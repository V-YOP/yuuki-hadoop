const { bindCmd, execCmd, callIfHostname, firstTime } = require("./yuuki-util")

// 保证只执行一次
if (!firstTime()) {
    return;    
}

callIfHostname("hadoop1",() => {
    // hadoop1节点需要先创建namenode的hdfs相关玩意
    execCmd("hdfs namenode -format")
})

callIfHostname("hadoop2",()=>{
    execCmd("echo 'hello, world!'")
})

callIfHostname("hadoop3",()=>{
    execCmd("echo 'hello, world!'")
})

