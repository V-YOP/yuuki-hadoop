const fs = require('fs')
const path = require("path")
const currentPath = __dirname

/**
 * 
 * @param {string} filePath 
 * @param {string} fileName 模版名或生成文件名，该路径必须存在fileName.template文件
 * @param {Map<string, string>} context 
 */
function buildTemplate(filePath, fileName, context) {
    if (fileName.endsWith(".template"))
        fileName = fileName.substring(0, fileName.length - ".template".length)
    const templatePath = path.join(filePath, fileName + ".template")
    const resultFilePath = path.join(filePath, fileName)

    function readFile(path) {
        return fs.readFileSync(path).toString()
    }
    /**
     * 
     * @param {string} str 
     * @param {Map<string,string>} context 
     * @return {string}
     */
    function replaceTemplate(str, context) {
        context.forEach((value, name) => {
            if (str.indexOf(`{{${name}}}`) === -1) {
                console.warn(`警告：文件${templatePath}中变量${name}未使用}`);
            }
            str = str.replace(new RegExp(`{{${name}}}`, "g"), value)
        })

        const check = /{{(.*)}}/.exec(str)
        if (check && check.length > 0) {
            throw new Error(`文件${templatePath}存在上下文中未声明的变量：` + check.filter(str => !str.startsWith("{{")).join(", "))
        }
        return str
    }

    fs.writeFileSync(resultFilePath, replaceTemplate(readFile(templatePath), context))
}

// 使用这种方式来导出
exports = module.exports = {
    buildTemplate
}
