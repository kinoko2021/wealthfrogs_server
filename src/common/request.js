const axios = require('axios');
const iconv = require('iconv-lite');



exports.request = (url, type = 'GET', data = {}, charSet = 'GBK') => {
    return new Promise((resolve, reject) => {
      const options = {
        url,
        method: type,
        // 解决接口获取中文乱码问题
        responseType: "arraybuffer",
        transformResponse: [function(data) {
            return iconv.decode(data, charSet);
        }],
        validateStatus(status) {
          return (status >= 200 && status < 300) || status === 400
        },
      }

      if (type.toLowerCase() === 'get') {
        options.params = data
      } else {
        options.data = data
      }

      axios(options).then(res => {
          if (res.status === 200) {
            resolve(res.data)
          } else {
            reject('调用公共接口错误')
          }
        }
      ).catch(err => {
        reject('调用公共接口错误')
      })
    })
  }