const $http = require("axios")

const tgbot = (process.env.TGBOT || '').split('&&',2)

$http.get('https://www.hmv.co.jp/en/search/adv_1/category_3/keyword_No+More+Heroes+3++Nintendo+Switch+/target_GAMES/type_sr/',{
    headers:{
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br' ,
        'Accept-Language': 'ja-JP,ja;q=0.9,zh-CN,zh-HK;q=0.8,zh;q=0.7,en-US;q=0.6,en;q=0.5',
        'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36'
      }
}).then(res=>{
        if(!res.data.includes('Deleted')){
            if(tgbot[0] && tgbot[1]){
                $http.post(`https://api.telegram.org/bot${tgbot[1]}/sendMessage`,{
                  'chat_id':tgbot[0],
                  'text':'有货！！！！！'
                },{
                  headers:{
                    'Content-Type': 'application/json'      
                  }
                })
            }
        }else{
            console.log('无货')
        }
    }
).catch()

$http.get('https://www.hmv.co.jp/en/basket/updatewishlist/method_type/CARTALL/?sku2%5B%5D=11776374',{
    headers:{
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br' ,
        'Accept-Language': 'ja-JP,ja;q=0.9,zh-CN,zh-HK;q=0.8,zh;q=0.7,en-US;q=0.6,en;q=0.5',
        'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36'
      }
}).then(res=>{
    if(!res.data.includes('is sold out')){
        if(tgbot[0] && tgbot[1]){
            $http.post(`https://api.telegram.org/bot${tgbot[1]}/sendMessage`,{
              'chat_id':tgbot[0],
              'text':'有货！！！！！'
            },{
              headers:{
                'Content-Type': 'application/json'      
              }
            })
        }
    }else{
        console.log('无货')
    }
}).catch()