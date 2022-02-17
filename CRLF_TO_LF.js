// 替换./config目录下的所有文本文件换行符为LF
const { execCmd, bindCmd } = require("./script/src/yuuki-util")
const { resolve } = require("path")

if (process.env.MSYSTEM !== "MINGW64") {
    console.error("请使用git bash运行此脚本！")
    process.exit(1)    
}

const fileList =  execCmd(`find ${resolve(__dirname, 'config')}`).toString()
fileList.split("\n").filter(path=>path.length !== 0).map(path=>`dos2unix ${path}`).forEach(cmd => {
    bindCmd(cmd)
})
console.log('Done')