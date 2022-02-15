const { bindCmd, execCmd, callIfHostname, execCmdAsync } = require("./yuuki-util")
const { resolve } = require("path")

// 启动ssh
console.log("===启动ssh===")
execCmd("/usr/sbin/sshd -E /etc/ssh/sshd.log")

// 在hadoop文档位置启动一个http-server
// http-server似乎没有提供作为daemon执行的选项，这里异步执行
console.log("===启动展示文档的http服务===")
execCmdAsync(`http-server -s -p 80 ${resolve(process.env["HADOOP_HOME"], "share/doc/hadoop/")}`)

callIfHostname("hadoop1", () => {
    // hdfs在namenode所在节点上启动
    console.log("===启动dfs===")
    bindCmd("exec /opt/hadoop/sbin/start-dfs.sh")
    // 启动job history server，其似乎用于job历史的保存
    console.log("===启动history-server===")
    bindCmd("mapred --daemon start historyserver")
    bindCmd("/bin/bash")
})

callIfHostname("hadoop2", () => {
    // yarn在resourcemanager所在节点上启动
    console.log("===启动yarn===")
    bindCmd("exec /opt/hadoop/sbin/start-yarn.sh")
    bindCmd("/bin/bash")
})

callIfHostname("hadoop3", () => {
    bindCmd("/bin/bash")
})

callIfHostname("hadoop4", () => {
    bindCmd("/bin/bash")
})





