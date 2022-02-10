/**
 * 搞不懂child_process的exec和spawn的区别，我来另搞一个
 */
const fs = require("fs")
const { execSync, spawnSync } = require("child_process")
const callOption = {
    cwd: process.cwd(), 
    env: process.env, 
    shell: true,
    stdio: 'inherit',
    encoding: 'utf-8' 
}

/**
 * “绑定”到某命令，同终端下运行命令无异（应该
 * @param {*} path 命令路径
 * @returns 
 */
const bindCmd = path => spawnSync(path, null, callOption)

/**
 * 执行某命令，类似使用&但是是同步？俺也不知道啊
 */
const execCmd = execSync


function firstTime() {
    // 如果不是第一次执行，则直接退出执行
    if (fs.existsSync("/root/inited")){
        return false
    }
    fs.writeFileSync("/root/inited", "")
    return true
}

/**
 * 如果hostname匹配，则同步执行回调
 * @param {string} hostname 
 * @param {()=>()} fn 
 */
function callIfHostname(hostname, fn) {
    if (!process.env["HOSTNAME"])
        throw new Error("HOSTNAME环境变量未初始化！请不要在Dockerfile中通过RUN来执行该nodejs脚本！")
    if (hostname === process.env["HOSTNAME"])
        fn()
}

module.exports = exports = {
    bindCmd,
    execCmd,
    callIfHostname,
    firstTime
}