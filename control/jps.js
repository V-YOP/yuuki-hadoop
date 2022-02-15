// 在每个容器中执行jps，快速检查是否正确启动
const { execCmd, bindCmd } = require("../script/src/yuuki-util")
    
const lst = [1, 2, 3, 4]

lst.forEach(i => {
    console.log(`hadoop${i}: `)
    bindCmd(`docker exec hadoop${i} jps`)   
    console.log("--------")
})