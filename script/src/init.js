const { bindCmd, execCmd, callIfHostname, firstTime, buildHadoopXml, readPropertiesSync, hadoopConfigPath } = require("./yuuki-util")

const fs = require("fs")
const path = require('path')

// 保证只执行一次
if (!firstTime()) {
    return;
}

console.log("===构造Hadoop配置文件===")

// 根据所有properties生成相应xml
const configFileList =
    ["core-site.properties",
     "hdfs-site.properties",
     "mapred-site.properties",
     "yarn-site.properties"]

configFileList.map(filename => path.resolve(hadoopConfigPath(), filename))
    .filter(file => fs.existsSync(file))
    .map(file => [`${path.dirname(file)}/${path.basename(file, '.properties')}.xml`, readPropertiesSync(file)])
    .forEach(([xmlPath, content]) => {
        const result = buildHadoopXml(content)
        console.log(`构造hadoop配置文件：${xmlPath}\n${result}`)
        fs.writeFileSync(xmlPath, result)
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
