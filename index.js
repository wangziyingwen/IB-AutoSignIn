const $http = require("axios");

(async function() {
    $http.defaults.baseURL = process.env.HOST
    const username = process.env.USERNAME
    const password = process.env.PASSWORD
    const tgtoken = process.env.TGTOKEN
    const chatid = process.env.TGCHATID
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
    let hashparse = /name="formhash" value="(.*?)"/i
    res = await $http.post('/member.php?mod=logging&action=login&loginsubmit=yes&handlekey=login&loginhash=LeHw3&inajax=1',`formhash=${hashparse.exec(res.data)[1]}&referer=https%3A%2F%2Fiboy1069.co%2F&username=${username}&password=${password}&questionid=0&answer=`,{
      headers:Object.assign({
        'content-type': 'application/x-www-form-urlencoded'
      },setHeaders(res.headers['set-cookie'] || [],cookie))
    })
    res = await $http.get('/',{
      'headers':setHeaders(res.headers['set-cookie'] || [],cookie)
    })
    let signState = new Date(new Date().getTime() + 8 * 3600 * 1000).toJSON().substr(0, 19).replace('T', ' ').replace(/-/g, '.')
    if(res.data.includes(username)){
      console.log('登录成功')
      await $http.get(`/plugin.php?id=k_misign:sign&operation=qiandao&formhash=${hashparse.exec(res.data)[1]}&format=empty&inajax=1&ajaxtarget=JD_sign`,{
        'headers':setHeaders(res.headers['set-cookie'] || [],cookie)
      }).then(async ()=>{
        await $http.get('/',{
          'headers':setHeaders([],cookie)
        }).then(res=>{
          if(res.data.includes(username) && !res.data.includes('您今天还没有签到')){
            signState +='\n  > 签到成功'
            console.log('  > 签到成功')
          }else{
            signState +='\n  > 已签到，未知'
            console.log('  > 已签到，未知')
          }
        }).catch(()=>{
          signState +='\n  > 已签到，未知'
          console.log('  > 已签到，未知')
        })
      }).catch(()=>{
        signState +='\n  > 签到失败'
        console.log('  > 签到失败')
      })
    }else{
      signState +='\n  > 登录失败'
      console.log('登录失败')
    }
    $http.post(`https://api.telegram.org/bot${tgtoken}/sendMessage`,{
      'chat_id':chatid,
      'text':signState,
      'parse_mode':'HTML'
    },{
      headers:{
        'Content-Type': 'application/json'      
      }
    })
})()


