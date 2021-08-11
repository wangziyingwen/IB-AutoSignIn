const $axios = require("axios")

const host = process.env.HOST
let cookie_list = process.env.COOKIE
cookie_list = cookie_list.split('&&')
cookie_list.forEach((item,i)=>{
    let headers = {
        'cookie':`gssi_2132_auth=${item};`,
        'referer': host,
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36'
    }
    $axios.get(`${host}/plugin.php?id=k_misign:sign`,{
        'headers':headers
    }).then(
        ({status,data})=>{
            console.log(i,status,data)
        }
    ).catch(()=>{
        console.log(false)
    })
})


