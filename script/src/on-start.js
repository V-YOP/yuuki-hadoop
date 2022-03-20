const { bindCmd, execCmd, execCmdAsync, sleep, waitUntil, portValid } = require("./yuuki-util")
const { resolve } = require("path")
const { callIfHostname } = require("./asyncCall")

// 启动ssh
console.log("===启动ssh===")
execCmd("/usr/sbin/sshd -E /etc/ssh/sshd.log")

callIfHostname("hdp1.local", async () => {
    // 在hadoop文档位置启动一个http-server
    // http-server似乎没有提供作为daemon执行的选项，这里异步执行
    console.log("===启动展示文档的http服务===")
    execCmdAsync(`/init-script/node_modules/http-server/bin/http-server -s -p 80 ${resolve(process.env["HADOOP_HOME"], "share/doc/hadoop/")}`)

    // hdfs在namenode所在节点上启动
    console.log("===启动dfs===")
    bindCmd("exec /opt/hadoop/sbin/start-dfs.sh")
    // 启动job history server，其似乎用于job历史的保存
    console.log("===启动history-server===")
    bindCmd("mapred --daemon start historyserver")
    bindCmd("/bin/bash")
})

callIfHostname("hdp2.local", async () => {
    // yarn在resourcemanager所在节点上启动
    console.log("===启动yarn===")
    bindCmd("exec /opt/hadoop/sbin/start-yarn.sh")
    bindCmd("/bin/bash")
})

callIfHostname("hdp3.local", async () => {
    bindCmd("/bin/bash")
})

callIfHostname("hive.local", async () => {
    // 启动metastore服务，允许外界访问Hive的元数据
    // 这是一个前台进程，需要让它异步化
    console.log("===启动metastore服务===")
    execCmdAsync("hive --service metastore")

    await waitUntil(() => portValid("hive.local:9083"))
    
    // 绑定到hiveserver2服务
    console.log("===metastore服务启动，启动hiveserver2服务===")
    bindCmd(" hive --service hiveserver2")
    //bindCmd("/bin/bash")
})

callIfHostname("spark.local", async () => {
    bindCmd("$SPARK_HOME/sbin/start-all.sh")
    bindCmd("/bin/bash")
})









