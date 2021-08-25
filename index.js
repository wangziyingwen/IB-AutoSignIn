const $http = require("axios")

const user = process.env.USER
const tgbot = (process.env.TGBOT || '').split('&&',2)
$http.defaults.baseURL = process.env.HOST

if(!process.env.HOST || !user){
  console.log('secret未完全配置')
  process.exit(0)
}

async function signIn(username,password) {
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
  let cookie,cookie_login,res
  let signState = `${username.slice(0,1)}***${username.slice(-1)}:   `
  //登录
  for(let i=0;i<6;i++){   
    cookie = {}
    try{
      res = await $http.get('member.php?mod=logging&action=login&referer=',{
        headers:{
          'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36'
        }
      })
      res = await $http.post(/name="login".*?action="(.*?)"/i.exec(res.data)[1].replace(/&amp;/g,'&'),`formhash=${/name="formhash" value="(.*?)"/i.exec(res.data)[1]}&referer=https%3A%2F%2Fiboy1069.co%2F&username=${username}&password=${password}&questionid=0&answer=`,{
        headers:Object.assign({
          'content-type': 'application/x-www-form-urlencoded'
        },setHeaders(res.headers['set-cookie'] || [],cookie))
      })
    }catch{
      if(i==5){
        return signState + '操作失败'
      }else{
        continue
      }
    }
    if(res.data.includes(username)){
      signState += '登录成功'
      break
    }else if(i==5){
      return signState + '登录失败'
    }
  }
  //签到
  cookie_login = Object.assign({},cookie)
  for(let i = 0;i<6;i++){
    cookie = cookie_login
    try{
      res = await $http.get('qiandao/',{
        'headers':setHeaders(res.headers['set-cookie'] || [],cookie)
      })
      res = await $http.get(`plugin.php?id=k_misign:sign&operation=qiandao&formhash=${/name="formhash" value="(.*?)"/i.exec(res.data)[1]}&format=empty&inajax=1&ajaxtarget=JD_sign`,{
        'headers':setHeaders(res.headers['set-cookie'] || [],cookie)
      })
      //首次签到返回空白，重复签到返回已签到？
      res = await $http.get('qiandao/',{
        'headers':setHeaders([],cookie)
      })
    }catch{
      if(i==5){
        return signState + '> 签到失败'
      }else{
        continue
      }
    }
    if(res.data.includes(username) && !res.data.includes('您今天还没有签到')){
      return signState + '  > 签到成功'
    }else if(i==5){
      return signState + '  > 未知错误'
    }
  }
}

let allstates = user.split('\n').map(item=>{
  item = item.split(',',2)
  return signIn(item[0],item[1])
})

//tg推送
Promise.all(allstates).then((result)=>{
  result = new Date(new Date().getTime() + 8 * 3600 * 1000).toJSON().substr(0, 19)+'\n'+result.join('\n')
  console.log(result)
  if(tgbot[0] && tgbot[1]){
    $http.post(`https://api.telegram.org/bot${tgbot[1]}/sendMessage`,{
      'chat_id':tgbot[0],
      'text':result
    },{
      headers:{
        'Content-Type': 'application/json'      
      }
    })
  }
})


