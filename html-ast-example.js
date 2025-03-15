/**
 * HTML-AST解析器使用示例
 * 
 * 本文件演示如何使用html-ast-extractor.js对HTML文件进行解析和分析
 */

const { analyzeHtmlFile } = require('./html-ast-extractor');
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
        console.log('使用方法: node html-ast-example.js <HTML文件路径> [输出文件路径]');
        return;
    }
    
    // 从文件分析
    const filePath = args[0];
    const outputPath = args[1] || `${path.basename(filePath, path.extname(filePath))}-analysis.md`;
    
    if (!fs.existsSync(filePath)) {
        console.log(`错误: 文件不存在: ${filePath}`);
        return;
    }
    
    console.log(`分析HTML文件: ${filePath}`);
    const result = analyzeHtmlFile(filePath);
    
    if (result.success) {
        console.log('HTML文件分析成功!');
        
        // 输出分析结果统计
        console.log('分析统计:');
        
        // JavaScript统计
        if (result.report.javascript) {
            console.log('- JavaScript:');
            console.log(`  - 函数: ${result.report.javascript.functions?.length || 0}`);
            console.log(`  - 类: ${result.report.javascript.classes?.length || 0}`);
            console.log(`  - 变量: ${result.report.javascript.variables?.length || 0}`);
            console.log(`  - 导入: ${result.report.javascript.imports?.length || 0}`);
            console.log(`  - 导出: ${result.report.javascript.exports?.length || 0}`);
        } else {
            console.log('- JavaScript: 无有效代码或分析失败');
        }
        
        // CSS统计
        console.log(`- CSS规则: ${result.report.css?.length || 0}`);
        
        // HTML元素统计
        console.log(`- HTML元素: ${result.report.html?.length || 0}`);
        
        // 保存Markdown文档
        saveMarkdownDoc(result.markdown, outputPath);
    } else {
        console.error('HTML文件分析失败:', result.error);
    }
}

// 运行主程序
main().catch(error => {
    console.error('程序执行出错:', error);
}); 