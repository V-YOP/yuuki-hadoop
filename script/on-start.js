const { bindCmd, execCmd, callIfHostname } = require("./yuuki-util")

// 启动ssh
execCmd("/usr/sbin/sshd -E /etc/ssh/sshd.log")

callIfHostname("hadoop1", () => {
    bindCmd("exec /opt/hadoop/sbin/start-dfs.sh")
    bindCmd("/bin/bash")
})

callIfHostname("hadoop2", () => {
    bindCmd("exec /opt/hadoop/sbin/start-yarn.sh")
    bindCmd("/bin/bash")
})

callIfHostname("hadoop3", () => {
    bindCmd("/bin/bash")
})





