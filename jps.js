// 随手写的脚本，用来在每个容器中执行jps，快速检查是否正确启动

const { execCmd, bindCmd } = require("./script/src/yuuki-util")
bindCmd("docker exec hadoop1 jps")
console.log("---")
bindCmd("docker exec hadoop2 jps")
console.log("---")
bindCmd("docker exec hadoop3 jps")