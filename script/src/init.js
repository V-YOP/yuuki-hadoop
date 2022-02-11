const { bindCmd, execCmd, callIfHostname, firstTime, buildHadoopXml, readPropertiesSync } = require("./yuuki-util")
const yaml = require("js-yaml")
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

configFileList.map(name => `${process.env["HADOOP_HOME"]}/etc/hadoop/${name}`)
    .filter(file => fs.existsSync(file))
    .map(file => [path.resolve(path.dirname(file), path.basename(file, '.properties') + ".xml"),
    readPropertiesSync(file)])
    .forEach(([xmlPath, content]) => {
        console.log(`构造hadoop配置文件：${xmlPath}`)
        const result = buildHadoopXml(content)
        console.log(result)
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
