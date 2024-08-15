import { Client } from 'ssh2';

import compressing from 'compressing';

const conn = new Client()
// 服务器账号
const server = {
  host: process.env.host,
  username: process.env.username,
  password: process.env.password,
  port: process.env.port,
}
// 上传到服务器的地址
const remotePath = process.env.remote_path
// 本地压缩文件地址
const localPath = 'dist.zip'

const end_cmd = process.env.end_cmd

// 连接服务器
async function Connect () {
  return new Promise((resolve, reject) => {
    conn.on("ready", function(){
      console.log('服务器连接成功')
      resolve(conn)
    }).on('error', function(err){
      console.log('服务器连接失败')
      reject(err)
    }).on('end', function() {
      console.log('服务器连接关闭')
    }).on('close', function(had_error){
    }).connect(server);
  })
}
// 执行shell脚本
async function Shell (c,cmd){
  return new Promise((resolve, reject) => {
    console.log(`执行 ${cmd}`)
    c.exec(cmd,function(err, stream) {
      if (err) {
        console.log(err)
        throw err;
      }
      stream.on('close', function() {
        resolve(c)
      }).on('data', function(data) {

      }).stderr.on('data', function(data) {
        console.log('shell执行失败')
      });
    });
  })
}
// 上传新文件
function UploadFile(c){
  console.log('开始上传')
  return new Promise((resolve, reject) => {
    c.sftp(function (err, sftp) {
      if (err) {
        reject(err);
      } else {
        sftp.fastPut(localPath, remotePath + localPath, function (err, result) {
          if(err){reject(err)}
          resolve(c)
        });
      }
    });
  })
}
// 压缩dist目录文件
function compress() {
  return new Promise((resolve, reject) => {
    compressing.zip.compressDir('./dist', localPath)
      .then(() => {
        resolve(true)
        console.log('压缩成功')
      })
      .catch(err => {
        reject(err)
        console.error(err);
      });
  })
}
// 启动
(async function start() {
  // 压缩文件
  await compress()
  // 获取连接对象
  let c = await Connect()
  // 清空服务器上文件
  c = await Shell(c,`rm -rf ${remotePath} && mkdir -p ${remotePath}`)
  // 上传压缩文件
  c = await UploadFile(c)
  // 执行shell脚本 解压服务器上的文件
  const shellList = [
    `cd ${remotePath}\n`,
    `unzip ${localPath} \n`,
    `mv dist/* ./ \n`,
    `rm -rf dist ${localPath} \n`
  ]
  if ( end_cmd ){
    shellList.push(`${end_cmd} \n`)
  }
  c = await Shell(c, shellList.join(''))
  c.end()
}())