const $http = require("axios")

const tgbot = (process.env.TGBOT || '').split('&&',2)

$http.get('https://www.hmv.co.jp/search/adv_1/category_3/keyword_No+More+Heroes+3++Nintendo+Switch+/target_GAMES/type_sr/',{
    headers:{
        'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36'
      }
}).then(res=>{
        if(!res.data.includes('販売終了')){
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
        }
    }
).catch()

$http.get('https://www.hmv.co.jp/basket/updatewishlist/method_type/CARTALL/?sku2%5B%5D=11776374',{
    headers:{
        'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36'
      }
}).then(res=>{
    if(!res.data.includes('は完売しました')){
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
    }
}).catch()