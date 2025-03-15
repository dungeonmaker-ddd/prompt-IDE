/**
 * AST代码提取器使用示例
 * 
 * 本文件演示如何使用ast-code-extractor.js中的功能来分析代码并生成文档
 */

const { extractFromFile, extractFromCode } = require('./ast-code-extractor');
const fs = require('fs');
const path = require('path');

/**
 * @function saveMarkdownDoc
 * @description 将Markdown文档保存到文件
 * @param {string} markdown Markdown内容
 * @param {string} outputPath 输出文件路径
 */
function saveMarkdownDoc(markdown, outputPath) {
    try {
        fs.writeFileSync(outputPath, markdown);
        console.log(`文档已保存到: ${outputPath}`);
    } catch (error) {
        console.error('保存文档时出错:', error);
    }
}

/**
 * 主程序入口
 */
async function main() {
    // 检查命令行参数
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.log('使用方法: node ast-example.js <文件路径> [输出文件路径]');
        console.log('  或者:   node ast-example.js --string "代码字符串" [输出文件路径]');
        return;
    }
    
    let result;
    let outputPath;
    
    if (args[0] === '--string') {
        // 从代码字符串分析
        if (args.length < 2) {
            console.log('错误: 使用--string选项时必须提供代码字符串');
            return;
        }
        
        const code = args[1];
        result = extractFromCode(code);
        outputPath = args[2] || 'code-analysis.md';
    } else {
        // 从文件分析
        const filePath = args[0];
        outputPath = args[1] || `${path.basename(filePath, path.extname(filePath))}-analysis.md`;
        
        if (!fs.existsSync(filePath)) {
            console.log(`错误: 文件不存在: ${filePath}`);
            return;
        }
        
        console.log(`分析文件: ${filePath}`);
        result = extractFromFile(filePath);
    }
    
    if (result.success) {
        console.log('代码分析成功!');
        
        // 输出分析结果统计
        const stats = {
            functions: result.extractedInfo.functions.length,
            classes: result.extractedInfo.classes.length,
            variables: result.extractedInfo.variables.length,
            imports: result.extractedInfo.imports.length,
            exports: result.extractedInfo.exports.length
        };
        
        console.log('分析统计:');
        console.log(`- 函数: ${stats.functions}`);
        console.log(`- 类: ${stats.classes}`);
        console.log(`- 变量: ${stats.variables}`);
        console.log(`- 导入: ${stats.imports}`);
        console.log(`- 导出: ${stats.exports}`);
        
        // 保存Markdown文档
        saveMarkdownDoc(result.markdown, outputPath);
    } else {
        console.error('代码分析失败:', result.error);
    }
}

// 运行主程序
main().catch(error => {
    console.error('程序执行出错:', error);
}); 