/**
 * 搞不懂child_process的exec和spawn的区别，我来另搞一个
 */
const fs = require("fs")
const { execSync, spawnSync , exec } = require("child_process")

/**
 * 用于阅读properties文件
 */
const PropertiesReader = require('properties-reader')

/**
 * “绑定”到某命令，同终端下运行命令无异（应该
 * @param {*} cmd 命令
 * @returns 
 */
const bindCmd = cmd => spawnSync(cmd, null, {
    cwd: process.cwd(), 
    env: process.env, 
    shell: true,
    stdio: 'inherit',
    encoding: 'utf-8' 
})

/**
 * 同步执行控制台命令，不关心输出
 */
const execCmd = cmd => execSync(cmd)

/**
 * 异步执行控制台命令，不关心输出
 */
const execCmdAsync = exec

/**
 * 检查是否是第一次执行，其将创建文件/root/inited来作为标识
 * @returns 
 */
function firstTime() {
    // 如果不是第一次执行，则直接退出执行
    if (fs.existsSync("/home/yuuki/inited")){
        return false
    }
    fs.writeFileSync("/home/yuuki/inited", "")
    return true
}


/**
 * 根据kv对生成Hadoop需要的XML格式字符串，忽略所有以metadata开头的字段
 * @param {Record<string, object>} obj 
 * @returns {string}
 */
function buildHadoopXml(obj) {
    if (!obj) {
        throw new Error("map不能为空！")
    }
    // 忽略所有以metadata开头的字段
    const entries = Object.entries(obj)
    // XML第一个标签前面不能够有任何空行！
    const res = `<?xml version="1.0"?>
    <?xml-stylesheet type="text/xsl" href="configuration.xsl"?>
    <!-- 该文件为代码自动生成w -->
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
                return `  ${line}`
            if (startsWith('<name>', '</name>', '<value>', '</value>'))
                return `    ${line}`
            return line
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
 * 根据文件路径读取properties文件，作为扁平的KV对序列返回，返回值的第一个元素为数据，第二个元素为元数据
 * key使用metadata开头的KV对认为是元数据
 * @param {string} filePath 
 * @return {[Record<string, string>, Record<string, string>]}
 */
function readPropertiesSync(filePath) {
    const properties = PropertiesReader(filePath)
    const data = {}
    const metadata = {}
    properties.each((k, v) => {
        // 使用metadata开头的
        if (k.startsWith('metadata'))
            metadata[k] = v.toString()
        else
            data[k] = v.toString()
    })
    return [data, metadata]
}


/**
 * 根据环境变量HADOOP_HOME获取返回HADOOP的配置目录
 * @example "/opt/hadoop/etc/hadoop"
 * @returns {string} HADOOP的配置目录，末尾没有/
 */
function hadoopConfigPath() {
    if (!process.env["HADOOP_HOME"])
        throw new Error("未找到HADOOP_HOME环境变量！")
    return `${process.env["HADOOP_HOME"]}/etc/hadoop`;
}

/**
 * 简单的“模板引擎”，把字符串中{{VARIABLE_NAME}}做替换
 * @param {string} str 
 * @param {Map<string,string>} context 
 * @return {string}
 */
 function parseTemplate(str, context) {
    Object.entries(context).forEach(([name, value]) => {
        str = str.replace(new RegExp(`{{${name}+?}}`, "g"), value)
    })

    const check = /{{(.*)}}/.exec(str)
    if (check && check.length > 0) {
        throw new Error(`存在上下文中未声明的变量：` + check.filter(str => !str.startsWith("{{")).join(", "))
    }
    return str
 }

 /**
  * 在指定的毫秒后resolve，同await联合使用
  * @param {number} time 
  * @returns 
  */
function sleep(time) {
    return new Promise(resolve=>setTimeout(resolve, time))    
}

module.exports = exports = {
    bindCmd,
    execCmd,
    firstTime,
    buildHadoopXml,
    flattenObjectRec,
    readPropertiesSync,
    hadoopConfigPath,
    execCmdAsync,
    parseTemplate,
    sleep
}