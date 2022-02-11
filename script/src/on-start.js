const { bindCmd, execCmd, callIfHostname } = require("./yuuki-util")

// 启动ssh
console.log("===启动ssh===")
execCmd("/usr/sbin/sshd -E /etc/ssh/sshd.log")

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





