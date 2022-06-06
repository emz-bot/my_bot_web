var fs = require('fs')
var path = require('path')
var qiniu = require("qiniu")

const prefixhost = process.env.prefixhost  // 七牛cdn绑定的域名
const accessKey = process.env.accessKey  // 七牛accessKey
const secretKey = process.env.secretKey  // 七牛secretKey
const space = process.env.space  // 七牛空间名
const zone = process.env.zone  // 空间对应的机房，zone_z1代表华北，其他配置参见七牛云文档
const limit = 10

//自己七牛云的秘钥
var mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
var config = new qiniu.conf.Config()
// 空间对应的机房，zone_z1代表华北，其他配置参见七牛云文档
// Zone_z0 华东
// Zone_z1 华北
// Zone_z2 华南
// Zone_na0 北美
// Zone_as0 东南亚
// Zone_cn-east-2 华东-浙江2
console.log(zone)
config.zone = qiniu.zone[zone]
console.log(config.zone)
// 是否使用https域名
config.useHttpsDomain = true
// 上传是否使用cdn加速
config.useCdnDomain = true


const bucketManager = new qiniu.rs.BucketManager(mac, config);
const cdnManager = new qiniu.cdn.CdnManager(mac, config)

var formUploader = new qiniu.form_up.FormUploader(config)

main()

function main() {
    delAll().then(res => {
    displayFile('./dist')
    refresDNS()
    })
}


async function refresDNS() {
    var dirsToRefresh = [
        prefixhost
      ];
    //单次请求链接不可以超过10个，如果超过，请分批发送请求
    cdnManager.refreshDirs(dirsToRefresh, function(err, respBody, respInfo) {
    if (err) {
        throw err;
    }
    console.log(respInfo.statusCode);
    if (respInfo.statusCode == 200) {
        console.log("缓存刷新成功!");
    } else {
        var jsonBody = JSON.parse(respBody);
        console.log(jsonBody.code);
        console.log(jsonBody.error);
        console.log(jsonBody.requestId);
        console.log(jsonBody.invalidUrls);
        console.log(jsonBody.invalidDirs);
        console.log(jsonBody.urlQuotaDay);
        console.log(jsonBody.urlSurplusDay);
        console.log(jsonBody.dirQuotaDay);
        console.log(jsonBody.dirSurplusDay);
    }
    });
}

async function getQiniuList() {
    var options = {
      limit: limit,
      prefix: "",
    }
    var array = []
    var list = await getList()
    // marker 上一次列举返回的位置标记，作为本次列举的起点信息
    async function getList(mark=false) {
      if(mark){
        var options = {
          limit: options.limit,
          prefix: options.prefix,
          mark: mark
        }
      }
      return new Promise(function(resolve, reject){
        bucketManager.listPrefix(space, options, function(err, respBody, respInfo) {
          if (err) {
            console.log(err);
            throw err;
          }
          if (respInfo.statusCode == 200) {
            //如果这个nextMarker不为空，那么还有未列举完毕的文件列表，下次调用listPrefix的时候，指定options里面的marker为这个值
            var nextMarker = respBody.marker;
            var commonPrefixes = respBody.commonPrefixes;
            var items = respBody.items;
            items.forEach(function(item) {
              array.push(qiniu.rs.deleteOp(space, item.key))
            });
            if(respBody.marker){
              getList(respBody.marker)
            } else{
              resolve(array)
            }
          } else {
            console.log(respInfo.statusCode);
            console.log(respBody);
          }
        });
      })
    }
    return list
}

async function delAll(){
    async function delQiniuAll() {
      return new Promise(function(resolve, reject){
        // 获取七牛远程列表数据
        getQiniuList().then(res => {
          if (res.length!==0){
            console.log('远程列表为空'.debug);
            del(res, resolve)
          } else {
            resolve()
          }
        })
      })
    }
    await delQiniuAll()
  }
  function del(deleteOperations, resolve) {
    bucketManager.batch(deleteOperations, function(err, respBody, respInfo) {
      if (err) {
        console.log(err);
        //throw err;
      } else {
        // 200 is success, 298 is part success
        if (parseInt(respInfo.statusCode / 100) == 2) {
          respBody.forEach(function(item, index) {
            if (item.code == 200) {
              resolve(index)
              console.log('删除成功'+'第'+(parseInt(index)+1)+'个文件')
            } else {
              console.log('删除失败');
              console.log(item.code + "\t" + item.data.error);
              resolve(index)
            }
          });
        } else {
          console.log(respInfo.deleteusCode);
          console.log(respBody);
        }
      }
    });
  }


function upload(key, localFile) {
  var Bucket = key
  var options = {
    scope: Bucket,
  }
  var putPolicy = new qiniu.rs.PutPolicy(options)
  var uploadToken = putPolicy.uploadToken(mac)
  let str = null
  if (localFile.indexOf("./dist\\") >= 0) {
    str = localFile.replace("./dist\\", "")
  } else if (localFile.indexOf("./dist/") >= 0) {
    str = localFile.replace("./dist/", "")
  } else {
    str = localFile
  }
  key = str
  key = key.replace("\\", "/")
  formUploader.putFile(uploadToken, key, localFile, null, function (respErr, respBody, respInfo) {
    if (respErr) {
      console.log(localFile + "文件上传失败,正在重新上传-----------")
      upload(qiniuPrefix.space, localFile)
    } else {
      if (respInfo.statusCode == 200) {
        console.log(respBody)
      } else {
        console.log(respInfo.statusCode)
        console.log(respBody)
        if (respBody.error) {
          console.log(respBody.error)
        }
      }
    }
  })
}

function displayFile(param) {
  //转换为绝对路径
  //var param = path.resolve(param);
  fs.stat(param, function (err, stats) {
    //如果是目录的话，遍历目录下的文件信息
    if (stats.isDirectory()) {
      fs.readdir(param, function (err, file) {
        file.forEach((e) => {
          //遍历之后递归调用查看文件函数
          //遍历目录得到的文件名称是不含路径的，需要将前面的绝对路径拼接
          var absolutePath = path.join(param, e)
          //var absolutePath = path.resolve(path.join(param, e));
          displayFile(absolutePath)
        })
      })
    } else {
      //file2/这里是空间里的文件前缀
      var key = space
      var localFile = './' + param
      if (!localFile.endsWith(".gz")) {
        upload(key, localFile)
      }
    }
  })
}
