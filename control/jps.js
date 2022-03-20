// 在每个容器中执行jps，快速检查是否正确启动
const { execCmd, bindCmd } = require("../script/src/yuuki-util")
    
const lst = [
    'hdp1.local',
    'hdp2.local',
    'hdp3.local',
    'hive.local',
    'spark.local'
]

lst.forEach(str => {
    console.log(str)
    bindCmd(`docker exec ${str} jps -m`)   
    console.log("--------")
})
