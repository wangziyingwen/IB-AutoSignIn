const $http = require("axios");

$http.defaults.baseURL = process.env.HOST
const user = process.env.USER
const tgtoken = process.env.TGTOKEN
const chatid = process.env.TGCHATID
async function signIn(username,password) {
  let cookie = {}, signState = username.slice(0,4)+'*** : '
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
  let res
  try{
    res = await $http.get('/member.php?mod=logging&action=login&referer=',{
      headers:{
        'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36'
      }
    })
    res = await $http.post(`/${/name="login".*?action="(.*?)"/i.exec(res.data)[1].replace(/&amp;/g,'&')}`,`formhash=${/name="formhash" value="(.*?)"/i.exec(res.data)[1]}&referer=https%3A%2F%2Fiboy1069.co%2F&username=${username}&password=${password}&questionid=0&answer=`,{
      headers:Object.assign({
        'content-type': 'application/x-www-form-urlencoded'
      },setHeaders(res.headers['set-cookie'] || [],cookie))
    })
  }catch{
    return signState + '操作失败'
  }
  if(res.data.includes(username)){
    signState += '登陆成功'
    await $http.get(`/plugin.php?id=k_misign:sign&operation=qiandao&formhash=${/name="formhash" value="(.*?)"/i.exec(res.data)[1]}&format=empty&inajax=1&ajaxtarget=JD_sign`,{
      'headers':setHeaders(res.headers['set-cookie'] || [],cookie)
    }).then(async ()=>{
      await $http.get(`/plugin.php?id=k_misign:sign&operation=qiandao&formhash=${/name="formhash" value="(.*?)"/i.exec(res.data)[1]}&format=empty&inajax=1&ajaxtarget=JD_sign`,{
        'headers':setHeaders(res.headers['set-cookie'] || [],cookie)
      }).then(async ()=>{
        await $http.get('/',{
          'headers':setHeaders([],cookie)
        }).then(res=>{
          if(res.data.includes(username) && !res.data.includes('您今天还没有签到')){
            signState +='  > 签到成功'
          }else{
            signState +='  > 已签到，未知'
          }
        }).catch(()=>{
          signState +='  > 已签到，未知'
        })
      }).catch(()=>{
        signState +='  > 签到失败'
      })
    }).catch(()=>{
      signState +='  > 签到失败'
    })
  }else{
    signState += '登陆失败'
  }
  return signState
}
let allstates = user.split('\n').map(item=>{
  item = item.split(',',2)
  return signIn(item[0],item[1])
})
Promise.all(allstates).then((result)=>{
  result = result.join('\n')
  console.log(result)
  $http.post(`https://api.telegram.org/bot${tgtoken}/sendMessage`,{
    'chat_id':chatid,
    'text':new Date(new Date().getTime() + 8 * 3600 * 1000).toJSON().substr(0, 19)+'\n'+result,
  },{
    headers:{
      'Content-Type': 'application/json'      
    }
  })
})


