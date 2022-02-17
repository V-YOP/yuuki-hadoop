const { bindCmd, execCmd, callIfHostname, firstTime, buildHadoopXml, readPropertiesSync, hadoopConfigPath, parseTemplate } = require("./yuuki-util")

const fs = require("fs")
const path = require('path')

console.log("===构造Hadoop配置文件===")
const PROPERTIES_PATH = '/config/properties'
// 解析所有/config/properties目录下的properties文件，将其转换成xml并写入到其“元数据”标识的地方
fs.readdirSync(PROPERTIES_PATH)
    .map(fileName => readPropertiesSync(path.resolve(PROPERTIES_PATH, fileName)))
    .forEach(([data, metadata]) => {
        if (!metadata['metadata.transform.to'])
            throw new Error('需给定metadata.transform.to！')
        
        const resultPath = parseTemplate(metadata['metadata.transform.to'], process.env)
        const result = buildHadoopXml(data)
        console.log(`构造配置文件：${resultPath}\n${result}`)
        fs.writeFileSync(resultPath, result)
    })

callIfHostname("hadoop1", () => {
    // hadoop1节点需要先创建namenode的hdfs相关玩意
    console.log("===Hadoop1: 格式化namenode===")
    execCmd("hdfs namenode -format")
})

callIfHostname("hadoop2", () => {
    execCmd("echo 'hello, world!'")
})

callIfHostname("hadoop3", () => {
    execCmd("echo 'hello, world!'")
})

callIfHostname("hadoop4", () => {
    execCmd("echo 'hello, world!'")
})
