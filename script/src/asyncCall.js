// 这种写法是非常不好的！

const hostname2Funcs = {

}
/**
 * 如果hostname匹配，则同步执行回调
 * @param {string} hostname 
 * @param {()=>Promise<void>} fn 
 */
function callIfHostname(hostname, fn) {
    if (!process.env["HOSTNAME"]) {
        throw new Error("HOSTNAME环境变量未初始化！请不要在Dockerfile中通过RUN来执行该nodejs脚本！")
    }
    if (hostname !== process.env["HOSTNAME"]) {
        return
    }
    if (!hostname2Funcs[hostname]) {hostname2Funcs[hostname] = []}

    hostname2Funcs[hostname].push(fn)
}

async function apply() {
    const fnLst = hostname2Funcs[process.env["HOSTNAME"]]
    if (!fnLst)
        return
    for (let i = 0; i < fnLst.length; i++) {
        await fnLst[i]()
    }
}

module.exports = exports = {
    callIfHostname,
    apply
}