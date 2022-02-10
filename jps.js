// 随手写的，用来快速检查是否正确启动

const { execCmd, bindCmd } = require("./script/yuuki-util")
bindCmd("docker exec hadoop1 jps")
console.log("---")
bindCmd("docker exec hadoop2 jps")
console.log("---")
bindCmd("docker exec hadoop3 jps")