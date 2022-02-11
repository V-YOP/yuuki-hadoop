const { execCmd, bindCmd } = require("../script/src/yuuki-util")
    
console.log("===启动dfs===")
bindCmd(`docker exec hadoop1 start-dfs.sh`)
console.log("===启动yarn===")
bindCmd(`docker exec hadoop2 start-yarn.sh`)