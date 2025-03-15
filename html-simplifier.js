/**
 * HTML文件简化工具
 * 
 * 专门用于创建简化版HTML文件，保持原始行号不变：
 * 1. 保留所有HTML元素结构
 * 2. 保留CSS选择器但移除CSS属性
 * 3. 保留脚本函数声明和结构，但清空函数体内部代码
 * 4. 保留HTML注释
 * 5. 移除内联样式内容
 * 6. 递归保留嵌套函数声明
 * 7. 保留函数体内的所有注释
 * 8. 保留完整的变量声明（包括赋值部分）
 * 9. 保留if/try等语句的声明和大括号结构
 */

const fs = require('fs');
const path = require('path');

/**
 * @function simplifyHtml
 * @description 简化HTML内容，保持行号不变
 * @param {string} htmlContent 原始HTML内容
 * @returns {string} 简化后的HTML内容
 */
function simplifyHtml(htmlContent) {
    // 将HTML分割成行以便于处理
    const lines = htmlContent.split('\n');
    
    // 用于跟踪当前状态的标志
    let inScript = false;
    let inStyle = false;
    let currentSelector = '';
    let inCssRule = false;
    let braceCounter = 0;
    let inComment = false;
    
    // JavaScript解析状态
    let jsFunctionDepth = 0;      // 函数嵌套深度
    let jsBraceCounter = 0;       // JavaScript大括号计数
    let inJSFunction = false;     // 是否在函数体内
    let inJSFunctionDeclaration = false; // 是否在函数声明行
    let inJSComment = false;      // 是否在JS注释内
    let isMultiLineJSComment = false; // 是否是多行JS注释
    let jsMultiLineCommentStart = 0; // 多行注释开始的行号
    let inJSControlStructure = false; // 是否在if/for/while/try等控制结构内
    
    // 预定义正则表达式
    // 检测函数声明行 (function name() 或 async function name() 或 const name = function() 等)
    const functionDeclRegex = /(async\s+)?function\s+\w+\s*\(.*\)|(?:const|let|var)\s+\w+\s*=\s*(async\s+)?function\s*\(.*\)|(?:const|let|var)\s+\w+\s*=\s*\(.*\)\s*=>/;
    const methodDeclRegex = /\w+\s*:\s*(async\s+)?function\s*\(.*\)/;
    const arrowFuncRegex = /(?:const|let|var)\s+\w+\s*=\s*(?:async\s+)?\(.*\)\s*=>/;
    
    // 检测变量声明行
    const varDeclRegex = /^(?:const|let|var)\s+\w+\s*=/;
    
    // 检测控制结构开始 (if, for, while, switch, try-catch)
    const controlStructureRegex = /^(?:if|for|while|switch|try)\s*\(/;
    const catchBlockRegex = /^(?:catch|finally)\s*(?:\([^)]*\))?\s*{/;
    const elseBlockRegex = /^else\s*(?:{|if)/;
    
    // 处理每一行
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmedLine = line.trim();
        
        // 处理HTML注释
        if (!inComment && line.includes('<!--')) {
            inComment = !line.includes('-->');
            continue; // 保留注释行
        }
        if (inComment) {
            if (line.includes('-->')) {
                inComment = false;
            }
            continue; // 保留注释行
        }
        
        // 处理内联样式 (style="...")
        if (line.match(/style=["'][^"']*["']/)) {
            // 替换内联样式内容但保留style属性
            lines[i] = line.replace(/(style=["'])([^"']*)(['"])/, '$1$3');
            continue;
        }
        
        // 检查是否进入或离开script标签
        if (!inScript && line.match(/<script[^>]*>/)) {
            inScript = true;
            // 保留script标签行
            continue;
        }
        if (inScript && line.match(/<\/script>/)) {
            inScript = false;
            // 重置所有JavaScript相关状态
            jsFunctionDepth = 0;
            jsBraceCounter = 0;
            inJSFunction = false;
            inJSFunctionDeclaration = false;
            inJSComment = false;
            isMultiLineJSComment = false;
            inJSControlStructure = false;
            // 保留结束script标签行
            continue;
        }
        
        // 如果在script标签内，处理JavaScript
        if (inScript) {
            // 检查是否是注释行或注释的一部分
            if (!inJSComment) {
                // 检查是否是单行注释
                if (trimmedLine.startsWith('//')) {
                    inJSComment = true;
                    continue; // 保留单行注释
                }
                
                // 检查是否是多行注释开始
                if (trimmedLine.startsWith('/*')) {
                    inJSComment = true;
                    isMultiLineJSComment = true;
                    jsMultiLineCommentStart = i;
                    
                    // 检查多行注释是否在同一行结束
                    if (trimmedLine.endsWith('*/') || line.includes('*/')) {
                        inJSComment = false;
                        isMultiLineJSComment = false;
                    }
                    continue; // 保留多行注释开始
                }
            } else if (isMultiLineJSComment) {
                // 检查多行注释是否结束
                if (trimmedLine.endsWith('*/') || line.includes('*/')) {
                    inJSComment = false;
                    isMultiLineJSComment = false;
                }
                continue; // 保留多行注释的后续行
            }
            
            // 检测变量声明行 - 保留完整的变量声明
            if (varDeclRegex.test(trimmedLine) && !functionDeclRegex.test(trimmedLine) && 
                !methodDeclRegex.test(trimmedLine) && !arrowFuncRegex.test(trimmedLine)) {
                // 保留完整的变量声明，不截断
                continue;
            }
            
            if (controlStructureRegex.test(trimmedLine) || catchBlockRegex.test(trimmedLine) || elseBlockRegex.test(trimmedLine)) {
                // 保留控制结构声明行
                
                // 如果这一行包含左大括号，进入控制结构体
                const openBraceIndex = line.indexOf('{');
                if (openBraceIndex !== -1) {
                    inJSControlStructure = true;
                    jsBraceCounter = 1; // 开始计数大括号
                    
                    // 如果同一行还有右大括号，可能是空的结构体
                    const closeBraceIndex = line.indexOf('}', openBraceIndex);
                    if (closeBraceIndex !== -1) {
                        jsBraceCounter--;
                        if (jsBraceCounter === 0) {
                            inJSControlStructure = false;
                        }
                    }
                }
                continue;
            }
            
            // 如果不是控制结构声明行，但遇到了开始大括号，可能是控制结构体的开始
            if (!inJSControlStructure && !inJSFunction && line.indexOf('{') !== -1 && !functionDeclRegex.test(trimmedLine)) {
                const prevLine = i > 0 ? lines[i-1].trim() : '';
                // 检查上一行是否是控制结构行但没有大括号
                if (controlStructureRegex.test(prevLine) || catchBlockRegex.test(prevLine) || elseBlockRegex.test(prevLine)) {
                    inJSControlStructure = true;
                    jsBraceCounter = 1;
                    continue;
                }
            }
            
            // 处理控制结构体内部
            if (inJSControlStructure) {
                // 计算这一行的大括号数量
                const openBraces = (line.match(/{/g) || []).length;
                const closeBraces = (line.match(/}/g) || []).length;
                jsBraceCounter += openBraces - closeBraces;
                
                // 检查控制结构是否结束
                if (jsBraceCounter === 0) {
                    inJSControlStructure = false;
                    // 保留控制结构结束行(右大括号)
                    if (trimmedLine === '}') {
                        continue;
                    }
                }
                
                // 在控制结构内部检查嵌套的变量声明 - 保留完整声明
                if (varDeclRegex.test(trimmedLine) && !functionDeclRegex.test(trimmedLine) && 
                    !methodDeclRegex.test(trimmedLine) && !arrowFuncRegex.test(trimmedLine)) {
                    // 保留完整的变量声明，不截断
                    continue;
                }
                
                // 检查是否是注释行
                if (trimmedLine.startsWith('//') || trimmedLine.startsWith('/*') || trimmedLine.includes('*/')) {
                    // 保留注释行
                    continue;
                }
                
                // 检查内部的嵌套控制结构
                if (controlStructureRegex.test(trimmedLine) || catchBlockRegex.test(trimmedLine) || elseBlockRegex.test(trimmedLine)) {
                    continue;
                }
                
                // 清空非特殊行
                if (trimmedLine === '') {
                    continue; // 保留空行
                } else if (trimmedLine !== '}') { // 不清空结束大括号行
                    lines[i] = '';
                }
                continue;
            }
            
            // 检查是否是函数声明行（包括嵌套函数）
            if (functionDeclRegex.test(trimmedLine) || methodDeclRegex.test(trimmedLine) || arrowFuncRegex.test(trimmedLine)) {
                inJSFunctionDeclaration = true;
                // 保留函数声明行
                
                // 如果声明行包含左大括号，进入函数体
                const openBraceIndex = line.indexOf('{');
                const closeBraceIndex = line.indexOf('}');
                
                if (openBraceIndex !== -1) {
                    inJSFunction = true;
                    jsFunctionDepth++;
                    jsBraceCounter = 1; // 开始计数大括号
                    
                    // 如果同一行还有右大括号，检查是否函数结束
                    if (closeBraceIndex !== -1 && openBraceIndex < closeBraceIndex) {
                        jsBraceCounter--;
                        if (jsBraceCounter === 0) {
                            inJSFunction = false;
                            jsFunctionDepth--;
                        }
                    }
                }
                continue;
            }
            
            // 如果不是函数声明行，但上一行是，检查是否是开始大括号
            if (inJSFunctionDeclaration && !inJSFunction && line.indexOf('{') !== -1) {
                inJSFunctionDeclaration = false;
                inJSFunction = true;
                jsFunctionDepth++;
                jsBraceCounter = 1;
                
                // 如果同一行还有右大括号，检查是否函数结束
                const openBraceIndex = line.indexOf('{');
                const closeBraceIndex = line.indexOf('}');
                
                if (closeBraceIndex !== -1 && openBraceIndex < closeBraceIndex) {
                    jsBraceCounter--;
                    if (jsBraceCounter === 0) {
                        inJSFunction = false;
                        jsFunctionDepth--;
                    }
                }
                continue;
            } else {
                inJSFunctionDeclaration = false;
            }
            
            // 如果在函数体内部，处理大括号和检测嵌套函数
            if (inJSFunction) {
                // 在函数体内再次检查嵌套函数声明
                if (functionDeclRegex.test(trimmedLine) || methodDeclRegex.test(trimmedLine) || arrowFuncRegex.test(trimmedLine)) {
                    // 保留嵌套函数声明行
                    continue;
                }
                
                // 检查是否是函数体内的注释行
                if (trimmedLine.startsWith('//') || trimmedLine.startsWith('/*') || trimmedLine.includes('*/')) {
                    // 保留注释行
                    continue;
                }
                
                // 在函数体内检查变量声明 - 保留完整声明
                if (varDeclRegex.test(trimmedLine) && !functionDeclRegex.test(trimmedLine) && 
                    !methodDeclRegex.test(trimmedLine) && !arrowFuncRegex.test(trimmedLine)) {
                    // 保留完整的变量声明，不截断
                    continue;
                }
                
                // 在函数体内检查控制结构
                if (controlStructureRegex.test(trimmedLine) || catchBlockRegex.test(trimmedLine) || elseBlockRegex.test(trimmedLine)) {
                    continue;
                }
                
                // 计算这一行的大括号数量
                const openBraces = (line.match(/{/g) || []).length;
                const closeBraces = (line.match(/}/g) || []).length;
                jsBraceCounter += openBraces - closeBraces;
                
                // 检查函数是否结束
                if (jsBraceCounter === 0) {
                    inJSFunction = false;
                    jsFunctionDepth--;
                    // 保留函数结束行(右大括号)
                    if (trimmedLine === '}') {
                        continue;
                    }
                }
                
                // 清空非注释、非函数声明的函数体内部代码行，但保留空行
                if (trimmedLine === '') {
                    continue; // 保留空行
                } else {
                    lines[i] = '';
                    continue;
                }
            }
            
            // 检查事件监听器和其他直接执行的语句，不保留
            if (trimmedLine.includes('.addEventListener') || 
                trimmedLine.includes('document.getElementById') ||
                trimmedLine.endsWith(';')) {
                lines[i] = '';
                continue;
            }
            
            // 保留非函数体的其他JavaScript代码（如全局变量声明等）
            continue;
        }
        
        // 检查是否进入或离开style标签
        if (!inStyle && line.match(/<style[^>]*>/)) {
            inStyle = true;
            // 保留style标签行
            continue;
        }
        if (inStyle && line.match(/<\/style>/)) {
            inStyle = false;
            // 保留结束style标签行
            continue;
        }
        
        // 如果在style标签内
        if (inStyle) {
            // 处理CSS规则
            // 检查是否有左大括号，表示CSS规则开始
            const openBraceIndex = line.indexOf('{');
            if (openBraceIndex !== -1 && !inCssRule) {
                inCssRule = true;
                braceCounter = 1; // 计数左大括号
                
                // 只保留选择器部分和左大括号，不自动添加右大括号
                lines[i] = line.substring(0, openBraceIndex + 1);
                
                // 检查同一行是否有右大括号
                const closeBraceIndex = line.indexOf('}', openBraceIndex);
                if (closeBraceIndex !== -1) {
                    braceCounter--; // 减少右大括号计数
                    if (braceCounter === 0) {
                        inCssRule = false;
                        // 在同一行添加右大括号
                        lines[i] += '}';
                    }
                }
                continue;
            }
            
            // 处理选择器跨行的情况 (例如：多行选择器)
            if (!inCssRule && !trimmedLine.startsWith('@') && !trimmedLine.includes('{') && trimmedLine !== '') {
                // 这可能是多行选择器的一部分
                currentSelector += line;
                lines[i] = line; // 保留选择器行
                continue;
            }
            
            // 处理CSS规则内部的行
            if (inCssRule) {
                // 计算行中的大括号数量
                const openBraces = (line.match(/{/g) || []).length;
                const closeBraces = (line.match(/}/g) || []).length;
                braceCounter += openBraces - closeBraces;
                
                // 如果规则结束了
                if (closeBraces > 0 && braceCounter === 0) {
                    inCssRule = false;
                    
                    // 如果这一行只有右大括号，保留它
                    if (trimmedLine === '}') {
                        lines[i] = line; // 保留原始闭合括号行
                    } else {
                        // 处理有内容和闭合括号的行
                        const closeBraceIndex = line.lastIndexOf('}');
                        lines[i] = ' '.repeat(line.indexOf('}')) + '}'; // 保留原始缩进和闭合括号
                    }
                } else if (closeBraces > 0) {
                    // 处理嵌套CSS规则的闭合括号
                    const closeBraceIndex = line.indexOf('}');
                    lines[i] = ' '.repeat(closeBraceIndex) + '}'; // 保留原始缩进和闭合括号
                } else {
                    // 如果还在规则内部，清空该行
                    lines[i] = '';
                }
                continue;
            }
            
            // 处理媒体查询和其他CSS特殊规则
            if (trimmedLine.startsWith('@media') || trimmedLine.startsWith('@keyframes')) {
                // 保留媒体查询声明
                continue;
            }
        }
    }
    
    // 重新组合成HTML字符串
    return lines.join('\n');
}

/**
 * @function simplifyHtmlFile
 * @description 简化HTML文件并保存结果
 * @param {string} inputPath 输入HTML文件路径
 * @param {string} outputPath 输出文件路径，默认为{filename}.simplified.html
 * @returns {Object} 结果信息
 */
function simplifyHtmlFile(inputPath, outputPath) {
    try {
        // 如果没有提供输出路径，创建默认的输出路径
        if (!outputPath) {
            const dir = path.dirname(inputPath);
            const basename = path.basename(inputPath, path.extname(inputPath));
            outputPath = path.join(dir, `${basename}.simplified.html`);
        }
        
        // 读取原始HTML文件
        const htmlContent = fs.readFileSync(inputPath, 'utf8');
        
        // 简化HTML内容
        const simplifiedContent = simplifyHtml(htmlContent);
        
        // 保存简化后的内容
        fs.writeFileSync(outputPath, simplifiedContent);
        
        return {
            success: true,
            inputPath,
            outputPath
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
            inputPath
        };
    }
}

/**
 * @function getStatistics
 * @description 获取HTML简化的统计信息
 * @param {string} originalContent 原始HTML内容
 * @param {string} simplifiedContent 简化后的HTML内容
 * @returns {Object} 统计信息
 */
function getStatistics(originalContent, simplifiedContent) {
    const originalLines = originalContent.split('\n');
    const simplifiedLines = simplifiedContent.split('\n');
    
    // 计算移除了内容的行数
    let emptyLines = 0;
    for (let i = 0; i < simplifiedLines.length; i++) {
        if (simplifiedLines[i] === '' && originalLines[i].trim() !== '') {
            emptyLines++;
        }
    }
    
    // 正则表达式查找各种元素
    const functionDeclarationRegex = /(function\s+\w+|const\s+\w+\s*=\s*function|\w+\s*:\s*function)/g;
    const varDeclarationRegex = /(?:const|let|var)\s+\w+\s*=/g;
    const controlStructureRegex = /(?:if|for|while|switch|try)\s*\(/g;
    
    // 计算JavaScript注释（包括单行和多行）
    const singleLineCommentCount = (simplifiedContent.match(/\/\/.*$/gm) || []).length;
    const multiLineCommentCount = (simplifiedContent.match(/\/\*[\s\S]*?\*\//g) || []).length;
    
    // 统计
    const cssRuleCount = (originalContent.match(/[^}]\s*{\s*[^{]*}/g) || []).length;
    const scriptTagCount = (simplifiedContent.match(/<script[^>]*>/g) || []).length;
    const inlineStyleCount = (originalContent.match(/style=["'][^"']*["']/g) || []).length;
    const commentCount = (simplifiedContent.match(/<!--[\s\S]*?-->/g) || []).length;
    const functionCount = (simplifiedContent.match(functionDeclarationRegex) || []).length;
    const varCount = (simplifiedContent.match(varDeclarationRegex) || []).length;
    const controlCount = (simplifiedContent.match(controlStructureRegex) || []).length;
    
    return {
        originalLineCount: originalLines.length,
        simplifiedLineCount: simplifiedLines.length,
        emptyLines: emptyLines,
        cssRules: cssRuleCount,
        scriptTags: scriptTagCount,
        inlineStyles: inlineStyleCount,
        htmlComments: commentCount,
        functions: functionCount,
        jsComments: singleLineCommentCount + multiLineCommentCount,
        varDeclarations: varCount,
        controlStructures: controlCount
    };
}

/**
 * 命令行接口
 */
function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.log('使用方法: node html-simplifier.js <HTML文件路径> [输出文件路径]');
        return;
    }
    
    const inputPath = args[0];
    const outputPath = args[1];
    
    if (!fs.existsSync(inputPath)) {
        console.error(`错误：文件不存在: ${inputPath}`);
        return;
    }
    
    console.log(`正在简化HTML文件: ${inputPath}`);
    const result = simplifyHtmlFile(inputPath, outputPath);
    
    if (result.success) {
        // 获取统计信息
        const originalContent = fs.readFileSync(inputPath, 'utf8');
        const simplifiedContent = fs.readFileSync(result.outputPath, 'utf8');
        const stats = getStatistics(originalContent, simplifiedContent);
        
        console.log('简化成功！');
        console.log(`- 输出文件: ${result.outputPath}`);
        console.log(`- 原始行数: ${stats.originalLineCount}`);
        console.log(`- 简化后行数: ${stats.simplifiedLineCount}`);
        console.log(`- 清空的内容行: ${stats.emptyLines}`);
        console.log(`- 保留的CSS规则数量: ${stats.cssRules}`);
        console.log(`- 保留的脚本标签数量: ${stats.scriptTags}`);
        console.log(`- 保留的函数声明数量: ${stats.functions || 0}`);
        console.log(`- 保留的变量声明数量: ${stats.varDeclarations || 0}`);
        console.log(`- 保留的控制结构数量: ${stats.controlStructures || 0}`);
        console.log(`- 保留的JavaScript注释数量: ${stats.jsComments || 0}`);
        console.log(`- 处理的内联样式数量: ${stats.inlineStyles}`);
        console.log(`- 保留的HTML注释数量: ${stats.htmlComments}`);
    } else {
        console.error(`简化失败: ${result.error}`);
    }
}

// 如果是直接运行则执行main函数
if (require.main === module) {
    main();
}

// 导出函数
module.exports = {
    simplifyHtml,
    simplifyHtmlFile,
    getStatistics
}; 