const $axios = require("axios")

const host = process.env.HOST
let cookie_auth = process.env.COOKIE_AUTH, cookie_ul = process.env.COOKIE_UL, cookie_cf = process.env.COOKIE_CF
let headers = {
    'cookie':`gssi_2132_auth=${cookie_auth};gssi_2132_lastcheckfeed=${cookie_cf};gssi_2132_ulastactivity=${cookie_ul}`,
    'referer': host,
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36'
}
console.log(headers.cookie)
$axios.get(`${host}/plugin.php?id=k_misign:sign`,{
    'headers':headers
}).then(
    ({status,data})=>{
        console.log(status,data)
    }
).catch(()=>{
    console.log(false)
})


