const {  firstTime } = require("./yuuki-util")

// 保证只执行一次
if (firstTime()) {
    console.log('容器首次创建，执行init.js')
    require("./init")
}

require("./on-start")