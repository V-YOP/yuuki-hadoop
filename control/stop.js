const { execCmd, bindCmd } = require("../script/src/yuuki-util")
    
// 似乎总失败，不如直接把集群停了
console.log("===停止yarn===")
bindCmd(`docker exec hadoop2 stop-yarn.sh`)
console.log("===停止dfs===")
bindCmd(`docker exec hadoop1 stop-dfs.sh`)