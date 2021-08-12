const $http = require("axios");

(async function() {
    $http.defaults.baseURL = process.env.HOST
    const username = process.env.USERNAME
    const password = process.env.PASSWORD
    let cookie = {}
    function setHeaders(arr,raw) {
      arr.forEach(item=>{
        item = item.split(';',1)[0].split('=',2)
        if(item[1] === 'deleted'){
          delete raw[item[0]]
        }else{
          raw[item[0]] = item[1]
        }
      })
      let cookie_str = ''
      for(let key in raw){
        cookie_str += `${key}=${raw[key]}; `
      }
      return cookie_str?{
        'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36',
        'cookie':cookie_str
      }:{
        'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36'
      }
    }
    let res = await $http.get('/',{
      headers:{
        'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36'
      }
    })
    res = await $http.post('/member.php?mod=logging&action=login&loginsubmit=yes&handlekey=login&loginhash=LeHw3&inajax=1',`formhash=${/name="formhash" value="(.*?)"/i.exec(res.data)[1]}&referer=https%3A%2F%2Fiboy1069.co%2F&username=${username}&password=${password}&questionid=0&answer=`,{
      headers:Object.assign({
        'content-type': 'application/x-www-form-urlencoded'
      },setHeaders(res.headers['set-cookie'] || [],cookie))
    })
    res = await $http.get('/',{
      'headers':setHeaders(res.headers['set-cookie'] || [],cookie)
    })
    if(res.data.includes(username)){
      console.log('登录成功')
      $http.get('/plugin.php?id=k_misign:sign',{
        'headers':setHeaders(res.headers['set-cookie'] || [],cookie)
      }).then(()=>{
        console.log('  > 签到成功')
      }).catch(()=>{
        console.log('  > 签到失败')
      })
    }else{
      console.log('登录失败')
    }
})()


