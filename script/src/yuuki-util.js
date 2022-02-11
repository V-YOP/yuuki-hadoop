/**
 * 搞不懂child_process的exec和spawn的区别，我来另搞一个
 */
const fs = require("fs")
const { execSync, spawnSync } = require("child_process")
const PropertiesReader = require('properties-reader')

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
    const res = `<?xml version="1.0"?>
    <?xml-stylesheet type="text/xsl" href="configuration.xsl"?>
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
    // 保证正确缩进
    return res.split("\n")
        .flatMap(line => !!line && line.trim().length !== 0 ? [line.trim()] : [])
        .map(line => {
            const startsWith = (...strs) => strs.some(str => line.startsWith(str))
            if (startsWith('<?', '<configuration>', '</configuration>'))
                return line
            if (startsWith('<property>', '</property>'))
                return `    ${line}`
            if (startsWith('<name>', '</name>', '<value>', '</value>'))
                return `        ${line}`
        }).join("\n")
}

/**
 * 将多层的对象转换成完全扁平的KV对
 * @example {a:{b:{c:1,d:2}}} => {"a.b.c": 1, "b.c.d" : 2}
 * @param {Record<string, string>} obj
 */
function flattenObjectRec(obj) {
    function helper(obj, path = '') {
        if (!obj || !(obj instanceof Object)) {
            throw new Error("you bad bad!")
        }
        return Object.entries(obj).flatMap(([k, v]) => {
            const nextKey = path === '' ? k : `${path}.${k}`
            return v instanceof Object ? helper(v, nextKey) : [[nextKey, v]]
        })
    }
    return Object.fromEntries(helper(obj))
}

/**
 * 根据文件路径读取properties文件，作为扁平的KV对返回
 * @param {string} filePath 
 * @return {Record<string, string>}
 */
function readPropertiesSync(filePath) {
    const properties = PropertiesReader(filePath)
    const res = {}
    properties.each((k, v) => {
        res[k] = v.toString()
    })
    return res
}

module.exports = exports = {
    bindCmd,
    execCmd,
    callIfHostname,
    firstTime,
    buildHadoopXml,
    flattenObjectRec,
    readPropertiesSync
}