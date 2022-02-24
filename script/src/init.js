const { bindCmd, execCmd, firstTime, buildHadoopXml, readPropertiesSync, hadoopConfigPath, parseTemplate, sleep } = require("./yuuki-util")

const { callIfHostname } = require("./asyncCall")

const fs = require("fs")
const path = require('path')

// 初始化密钥以及ssh各种配置文件的权限
// 为什么密钥要放到这里来做？因为如果在Dockerfile中创建的话，总会得到一样的密钥
console.log("===初始化SSH服务端密钥===")
bindCmd(`ssh-keygen -A`)

// 为了ssh时能像使用docker exec时一样能拿到环境变量，直接把当前的环境变量“持久化”
console.log("===dump当前环境变量到/etc/profile.d/custom.sh中===")
execCmd("env | sed 's/^/export &/g' >> /etc/profile.d/custom.sh")

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

callIfHostname("hdp1.local", async () => {
    // hadoop1节点需要先创建namenode的hdfs相关玩意
    console.log("===Hadoop1: 格式化namenode===")
    bindCmd("hdfs namenode -format")
})

callIfHostname("hdp2.local", async () => {
    execCmd("echo 'hello, world!'")
})

callIfHostname("hdp3.local", async () => {
    execCmd("echo 'hello, world!'")
})

callIfHostname("hive.local", async () => {
    // TODO 仍旧待修改——应使用数据库连接，把原来留着的数据库扬了
    while (bindCmd(`nc -z 172.19.2.5 3306`).status !== 0) {
        console.log("===等待数据库上线===")
        await sleep(3000)
    }

    // 被逼无奈！之后或许可以试着用nodejs连接数据库，然后轮询
    // 不能使用setTimeout或setInterval，其在当前环境下无效，必须使用linux的sleep命令来进行同步的等待
    console.log("===检测到数据库上线===")
    await sleep(3000)
    console.log("===Hive: 格式化数据库Schema===")
    // schematool这个命令如果是derby的话会在当前目录（/share）创建derby的原文件，所以这里设置到一个另外的位置
    // execCmd(`
    //     mkdir -p ${process.env["HIVE_HOME"]}/data/derby &&\\
    //     cd ${process.env["HIVE_HOME"]}/data/derby &&\\
    //     schematool -dbType derby -initSchema`)

    // 使用MySQL，让它多嘴一些以方便debug
    bindCmd(`schematool -initSchema -dbType mysql -verbose`)
})
