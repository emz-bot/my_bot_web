import axios from 'axios'

axios.defaults.timeout = 20000
axios.defaults.baseURL = window.gurl.SERVICE_CONTEXT_PATH;

// json格式请求头
const headerJSON = {
  'Content-Type': 'application/json'
};

const headerForm = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

const headerFormData = {
  'Content-Type': 'multipart/form-data'
};

axios.interceptors.request.use(
  config => {
    config.headers = {}
    if (localStorage.token) {
      config.headers.authorization = localStorage.token
    }
    return config
  },
  err => {
    return Promise.reject(err)
  },
)

axios.interceptors.response.use(response => {
  return response
}, err => {
  if (err && err.response) {
    switch (err.response.status) {
      case 400:
        console.log('错误请求')
        break
      case 401:
        console.log('未授权，请重新登录')
        break
      case 403:
        console.log('拒绝访问')
        break
      case 404:
        console.log('请求错误,未找到该资源')
        break
      case 405:
        console.log('请求方法未允许')
        break
      case 408:
        console.log('请求超时')
        break
      case 500:
        console.log('服务器端出错')
        break
      case 501:
        console.log('网络未实现')
        break
      case 502:
        console.log('网络错误')
        break
      case 503:
        console.log('服务不可用')
        break
      case 504:
        console.log('网络超时')
        break
      case 505:
        console.log('http版本不支持该请求')
        break
      default:
        console.log(`连接错误${err.response.status}`)
    }
  } else {
    console.log('连接到服务器失败')
  }
  return Promise.resolve(err.response)
})

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function get(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params,
    }, {
      headers: headerJSON
    })
      .then(response => {
        resolve(response.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post(url, data) {
  return new Promise((resolve, reject) => {
    axios.post(url, data, {
      headers: headerJSON
    })
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
  })
}

/**
* 封装patch请求
* @param url
* @param data
* @returns {Promise}
*/

export function patch(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.patch(url, data, {
      headers: headerJSON
    })
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
  })
}

/**
* 封装put请求
* @param url
* @param data
* @returns {Promise}
*/

export function put(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.put(url, data, {
      headers: headerJSON
    })
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
  })
}

/**
* 封装delete请求
* @param url
* @param data
* @returns {Promise}
*/

export function del(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.delete(url, data, {
      headers: headerJSON
    })
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
  })
}

/**
 * 封装文件上传方法
 * @param url
 * @param file
 * @returns {Promise}
 */
export function uploadFile(url, file) {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    axios.post(url, formData, {
      headers: headerFormData
    }).then(response => {
      if (response.status === 200) {
        resolve(response.data);
      } else {
        reject(`Upload failed with status code ${response.status}`);
      }
    }).catch(error => {
      console.log(111111111111, error);
      reject(error);
    });
  });
}