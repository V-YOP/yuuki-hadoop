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

/**
 * 根据kv对生成Hadoop需要的XML格式字符串
 * @param {object} obj 
 * @returns {string}
 */
function buildHadoopXml(obj) {
    if (!obj) {
        throw new Error("map不能为空！")
    }
    const entries = Object.entries(obj)
    // XML第一个标签前面不能够有任何空行！
    return `<?xml version="1.0"?><?xml-stylesheet type="text/xsl" href="configuration.xsl"?>
    <configuration>
    ${
        entries.map(([k, v]) => `
        <property>
            <name>${k}</name>
            <value>${v}</value>
        </property>
        `).join('')
    }
    </configuration>
    `
}

/**
 * 将多层的对象转换成完全扁平的KV对
 * @example {a:{b:{c:1,d:2}}} => {"a.b.c": 1, "b.c.d" : 2}
 * @param {object} obj
 */
function flattenObjectRec(obj) {
    const res = {}
    function helper(obj, path = '') {
        if (!obj)
            return
        Object.entries(obj).forEach(([key, value]) => {
            const nextKey = path === '' ? key : path + '.' + key
            if (value instanceof Object) 
                helper(obj[key], nextKey)
            else 
                res[nextKey] = value    
        })
    }
    helper(obj)
    return res
}


module.exports = exports = {
    bindCmd,
    execCmd,
    callIfHostname,
    firstTime,
    buildHadoopXml,
    flattenObjectRec
}