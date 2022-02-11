const { bindCmd, execCmd, callIfHostname, firstTime, buildHadoopXml, readPropertiesSync } = require("./yuuki-util")
const yaml = require("js-yaml")
const fs = require("fs")
const path = require('path')
// 保证只执行一次
if (!firstTime()) {
    return;    
}

// 根据所有properties生成相应xml
[
    "core-site.properties",
    "hdfs-site.properties",
    "mapred-site.properties",
    "yarn-site.properties",
].map(name => `${process.env["HADOOP_HOME"]}/etc/hadoop/${name}`)
    .filter(file => fs.existsSync(file))
    .map(file => [path.resolve(path.dirname(file), path.basename(file, '.properties') + ".xml"), buildHadoopXml(readPropertiesSync(file))])
    .forEach(([xmlPath, content]) => {
        fs.writeFileSync(xmlPath, content)
    })

callIfHostname("hadoop1",() => {
    // hadoop1节点需要先创建namenode的hdfs相关玩意
    execCmd("hdfs namenode -format")
})

callIfHostname("hadoop2",() => {
    execCmd("echo 'hello, world!'")
})

callIfHostname("hadoop3",() => {
    execCmd("echo 'hello, world!'")
})

callIfHostname("hadoop4",() => {
    execCmd("echo 'hello, world!'")
})
