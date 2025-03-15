/**
 * HTML文件AST解析器
 * 
 * 本模块结合了AST技术，专门用于从HTML文件中提取和分析JavaScript代码
 * 能够精确提取HTML中的:
 * 1. script标签中的JavaScript代码并进行AST分析
 * 2. 内联事件处理器中的JavaScript代码
 * 3. CSS样式规则(通过扩展支持)
 * 4. HTML元素结构(通过扩展支持)
 */

const { analyzeCode, generateMarkdownDoc } = require('./ast-code-extractor');

/**
 * @function extractScriptTags
 * @description 从HTML内容中提取所有script标签的内容
 * @param {string} htmlContent HTML文件内容
 * @returns {Array} 脚本内容对象数组，包含位置信息
 */
function extractScriptTags(htmlContent) {
    const scriptTags = [];
    const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/g;
    let match;

    while ((match = scriptRegex.exec(htmlContent)) !== null) {
        // 获取script标签的类型，默认为普通JavaScript
        const typeMatch = match[0].match(/type=["']([^"']*)["']/);
        const type = typeMatch ? typeMatch[1] : 'text/javascript';
        
        // 只处理JavaScript类型的脚本
        if (type === 'text/javascript' || type === 'application/javascript' || type === 'module' || !type.includes('/')) {
            scriptTags.push({
                content: match[1],
                startIndex: match.index + match[0].indexOf(match[1]),
                endIndex: match.index + match[0].indexOf(match[1]) + match[1].length,
                lineOffset: htmlContent.substring(0, match.index + match[0].indexOf(match[1])).split('\n').length - 1
            });
        }
    }

    return scriptTags;
}

/**
 * @function extractInlineEventHandlers
 * @description 提取HTML元素中的内联事件处理器
 * @param {string} htmlContent HTML文件内容
 * @returns {Array} 内联事件处理器对象数组
 */
function extractInlineEventHandlers(htmlContent) {
    const eventHandlers = [];
    // 匹配像 onclick="..." onmouseover="..." 等的内联事件处理器
    const eventRegex = /\s(on\w+)=["']([^"']*)["']/g;
    let match;

    while ((match = eventRegex.exec(htmlContent)) !== null) {
        const eventName = match[1];
        const handlerCode = match[2];
        const startIndex = match.index;
        
        // 计算行号
        const lineOffset = htmlContent.substring(0, startIndex).split('\n').length - 1;
        
        eventHandlers.push({
            eventName: eventName,
            code: handlerCode,
            startIndex: startIndex,
            lineOffset: lineOffset
        });
    }

    return eventHandlers;
}

/**
 * @function createVirtualJsFileFromHtml
 * @description 从HTML中提取所有JavaScript代码并创建虚拟JS文件内容
 * @param {string} htmlContent HTML文件内容
 * @returns {Object} 包含虚拟JS文件内容和行映射的对象
 */
function createVirtualJsFileFromHtml(htmlContent) {
    const scripts = extractScriptTags(htmlContent);
    const eventHandlers = extractInlineEventHandlers(htmlContent);
    
    let virtualJsContent = '';
    const lineMapping = [];
    let virtualLine = 1;
    
    // 添加script标签内容
    scripts.forEach((script, index) => {
        // 添加注释以标记script来源
        virtualJsContent += `// Script block ${index + 1}\n`;
        virtualLine++;
        
        // 记录起始行映射
        const scriptStartVirtualLine = virtualLine;
        
        // 添加script内容
        const scriptContent = script.content;
        virtualJsContent += scriptContent;
        if (!scriptContent.endsWith('\n')) {
            virtualJsContent += '\n';
        }
        
        // 更新行映射
        const scriptLines = scriptContent.split('\n');
        for (let i = 0; i < scriptLines.length; i++) {
            lineMapping.push({
                virtualLine: virtualLine++,
                htmlLine: script.lineOffset + i + 1,
                type: 'script',
                blockIndex: index
            });
        }
        
        // 添加额外的空行作为分隔符
        virtualJsContent += '\n';
        virtualLine++;
    });
    
    // 添加内联事件处理器
    if (eventHandlers.length > 0) {
        virtualJsContent += '\n// Inline event handlers\n';
        virtualLine += 2;
        
        eventHandlers.forEach((handler, index) => {
            const wrapperFuncName = `inlineHandler_${handler.eventName}_${index}`;
            
            // 将事件处理器代码包装在函数中
            virtualJsContent += `function ${wrapperFuncName}(event) {\n`;
            virtualLine++;
            
            // 记录行映射
            lineMapping.push({
                virtualLine: virtualLine,
                htmlLine: handler.lineOffset + 1,
                type: 'eventHandler',
                handlerIndex: index
            });
            
            // 添加处理器代码
            virtualJsContent += `    ${handler.code}\n`;
            virtualLine++;
            
            virtualJsContent += `}\n\n`;
            virtualLine += 2;
        });
    }
    
    return {
        content: virtualJsContent,
        lineMapping: lineMapping
    };
}

/**
 * @function mapVirtualLineToHtml
 * @description 将虚拟JS文件中的行号映射回HTML文件中的行号
 * @param {number} virtualLine 虚拟JS文件中的行号
 * @param {Array} lineMapping 行映射数组
 * @returns {number} HTML文件中的行号
 */
function mapVirtualLineToHtml(virtualLine, lineMapping) {
    const mapping = lineMapping.find(map => map.virtualLine === virtualLine);
    return mapping ? mapping.htmlLine : -1;
}

/**
 * @function analyzeHtml
 * @description 分析HTML文件并提取所有JavaScript代码进行AST分析
 * @param {string} htmlContent HTML文件内容
 * @returns {Object} 分析结果
 */
function analyzeHtml(htmlContent) {
    const { content: virtualJsContent, lineMapping } = createVirtualJsFileFromHtml(htmlContent);
    
    // 如果提取不到任何JavaScript代码，返回空结果
    if (!virtualJsContent.trim()) {
        return {
            success: false,
            error: "HTML文件中没有检测到JavaScript代码",
            jsContent: virtualJsContent
        };
    }
    
    // 使用AST分析提取的JavaScript代码
    const extractedInfo = analyzeCode(virtualJsContent);
    
    if (!extractedInfo) {
        return {
            success: false,
            error: "JavaScript代码分析失败",
            jsContent: virtualJsContent
        };
    }
    
    // 将虚拟JS文件中的行号映射回HTML文件中的行号
    remapLocationsToHtml(extractedInfo, lineMapping);
    
    // 生成分析结果文档
    const markdown = generateMarkdownDoc(extractedInfo);
    
    return {
        success: true,
        extractedInfo: extractedInfo,
        markdown: markdown,
        jsContent: virtualJsContent
    };
}

/**
 * @function remapLocationsToHtml
 * @description 将提取的信息中的位置从虚拟JS文件映射回HTML文件
 * @param {Object} extractedInfo 提取的代码信息
 * @param {Array} lineMapping 行映射数组
 */
function remapLocationsToHtml(extractedInfo, lineMapping) {
    // 修改函数位置
    if (extractedInfo.functions) {
        extractedInfo.functions.forEach(func => {
            const htmlStartLine = mapVirtualLineToHtml(func.location.startLine, lineMapping);
            const htmlEndLine = mapVirtualLineToHtml(func.location.endLine, lineMapping);
            
            if (htmlStartLine !== -1) {
                func.location.originalStartLine = func.location.startLine;
                func.location.startLine = htmlStartLine;
            }
            
            if (htmlEndLine !== -1) {
                func.location.originalEndLine = func.location.endLine;
                func.location.endLine = htmlEndLine;
            }
            
            // 处理嵌套函数
            if (func.nestedFunctions) {
                func.nestedFunctions.forEach(nestedFunc => {
                    const nestedHtmlStartLine = mapVirtualLineToHtml(nestedFunc.location.startLine, lineMapping);
                    const nestedHtmlEndLine = mapVirtualLineToHtml(nestedFunc.location.endLine, lineMapping);
                    
                    if (nestedHtmlStartLine !== -1) {
                        nestedFunc.location.originalStartLine = nestedFunc.location.startLine;
                        nestedFunc.location.startLine = nestedHtmlStartLine;
                    }
                    
                    if (nestedHtmlEndLine !== -1) {
                        nestedFunc.location.originalEndLine = nestedFunc.location.endLine;
                        nestedFunc.location.endLine = nestedHtmlEndLine;
                    }
                });
            }
        });
    }
    
    // 修改类位置
    if (extractedInfo.classes) {
        extractedInfo.classes.forEach(cls => {
            const htmlStartLine = mapVirtualLineToHtml(cls.location.startLine, lineMapping);
            const htmlEndLine = mapVirtualLineToHtml(cls.location.endLine, lineMapping);
            
            if (htmlStartLine !== -1) {
                cls.location.originalStartLine = cls.location.startLine;
                cls.location.startLine = htmlStartLine;
            }
            
            if (htmlEndLine !== -1) {
                cls.location.originalEndLine = cls.location.endLine;
                cls.location.endLine = htmlEndLine;
            }
            
            // 处理类方法
            if (cls.methods) {
                cls.methods.forEach(method => {
                    const methodHtmlStartLine = mapVirtualLineToHtml(method.location.startLine, lineMapping);
                    const methodHtmlEndLine = mapVirtualLineToHtml(method.location.endLine, lineMapping);
                    
                    if (methodHtmlStartLine !== -1) {
                        method.location.originalStartLine = method.location.startLine;
                        method.location.startLine = methodHtmlStartLine;
                    }
                    
                    if (methodHtmlEndLine !== -1) {
                        method.location.originalEndLine = method.location.endLine;
                        method.location.endLine = methodHtmlEndLine;
                    }
                });
            }
        });
    }
    
    // 修改变量位置
    if (extractedInfo.variables) {
        extractedInfo.variables.forEach(variable => {
            const htmlStartLine = mapVirtualLineToHtml(variable.location.startLine, lineMapping);
            const htmlEndLine = mapVirtualLineToHtml(variable.location.endLine, lineMapping);
            
            if (htmlStartLine !== -1) {
                variable.location.originalStartLine = variable.location.startLine;
                variable.location.startLine = htmlStartLine;
            }
            
            if (htmlEndLine !== -1) {
                variable.location.originalEndLine = variable.location.endLine;
                variable.location.endLine = htmlEndLine;
            }
        });
    }
    
    // 修改导入位置
    if (extractedInfo.imports) {
        extractedInfo.imports.forEach(imp => {
            const htmlStartLine = mapVirtualLineToHtml(imp.location.startLine, lineMapping);
            const htmlEndLine = mapVirtualLineToHtml(imp.location.endLine, lineMapping);
            
            if (htmlStartLine !== -1) {
                imp.location.originalStartLine = imp.location.startLine;
                imp.location.startLine = htmlStartLine;
            }
            
            if (htmlEndLine !== -1) {
                imp.location.originalEndLine = imp.location.endLine;
                imp.location.endLine = htmlEndLine;
            }
        });
    }
    
    // 修改导出位置
    if (extractedInfo.exports) {
        extractedInfo.exports.forEach(exp => {
            const htmlStartLine = mapVirtualLineToHtml(exp.location.startLine, lineMapping);
            const htmlEndLine = mapVirtualLineToHtml(exp.location.endLine, lineMapping);
            
            if (htmlStartLine !== -1) {
                exp.location.originalStartLine = exp.location.startLine;
                exp.location.startLine = htmlStartLine;
            }
            
            if (htmlEndLine !== -1) {
                exp.location.originalEndLine = exp.location.endLine;
                exp.location.endLine = htmlEndLine;
            }
        });
    }
}

/**
 * @function extractFromHtmlFile
 * @description 从HTML文件中提取代码信息并生成文档
 * @param {string} filePath HTML文件路径
 * @returns {Object} 结果对象，包含提取的信息和生成的文档
 */
function extractFromHtmlFile(filePath) {
    const fs = require('fs');
    
    try {
        const htmlContent = fs.readFileSync(filePath, 'utf8');
        const result = analyzeHtml(htmlContent);
        
        // 如果分析失败但提取了JS内容，尝试写入临时JS文件便于调试
        if (!result.success && result.jsContent) {
            try {
                const tempJsFile = `${filePath}.extracted.js`;
                fs.writeFileSync(tempJsFile, result.jsContent);
                console.log(`提取的JavaScript代码已保存到: ${tempJsFile}`);
            } catch (err) {
                console.error('保存提取的JavaScript代码时出错:', err);
            }
        }
        
        return result;
    } catch (error) {
        console.error('从HTML文件提取信息时出错:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * @function extractCssFromHtml
 * @description 提取HTML文件中的CSS样式
 * @param {string} htmlContent HTML文件内容
 * @returns {Array} CSS规则信息对象数组
 */
function extractCssFromHtml(htmlContent) {
    const result = [];
    
    // 提取style标签内容
    const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/g;
    let styleMatch;

    while ((styleMatch = styleRegex.exec(htmlContent)) !== null) {
        const styleContent = styleMatch[1];
        const styleStartIndex = styleMatch.index + styleMatch[0].indexOf(styleContent);
        const baseLineNumber = htmlContent.substring(0, styleStartIndex).split('\n').length;

        // 提取CSS规则
        const ruleRegex = /([^{]+)\s*\{([^}]*)\}/g;
        let ruleMatch;

        while ((ruleMatch = ruleRegex.exec(styleContent)) !== null) {
            const selector = ruleMatch[1].trim();
            const properties = ruleMatch[2].trim();
            
            // 计算起始行和结束行
            const beforeRule = styleContent.substring(0, ruleMatch.index);
            const startLine = baseLineNumber + beforeRule.split('\n').length - 1;
            const ruleText = ruleMatch[0];
            const endLine = startLine + ruleText.split('\n').length - 1;

            result.push({
                selector: selector,
                properties: properties,
                location: {
                    startLine: startLine,
                    endLine: endLine
                }
            });
        }
    }

    return result;
}

/**
 * @function extractHtmlElements
 * @description 提取HTML元素结构
 * @param {string} htmlContent HTML文件内容
 * @returns {Array} HTML元素信息对象数组
 */
function extractHtmlElements(htmlContent) {
    const result = [];
    
    // 提取带ID或class的HTML元素
    const elementRegex = /<(\w+)[^>]*(?:id=["']([^"']*)["']|class=["']([^"']*)["'])[^>]*>/g;
    let match;

    while ((match = elementRegex.exec(htmlContent)) !== null) {
        const tagName = match[1];
        const id = match[2] || '';
        const className = match[3] || '';
        
        // 计算起始行
        const beforeElement = htmlContent.substring(0, match.index);
        const startLine = beforeElement.split('\n').length;

        result.push({
            tag: tagName,
            id: id,
            class: className,
            location: {
                startLine: startLine
            }
        });
    }

    return result;
}

/**
 * @function generateFullHtmlReport
 * @description 生成完整的HTML分析报告，包括JS、CSS和HTML元素
 * @param {string} htmlContent HTML文件内容
 * @returns {Object} 包含分析结果的对象
 */
function generateFullHtmlReport(htmlContent) {
    // 分析JavaScript
    const jsAnalysis = analyzeHtml(htmlContent);
    
    // 提取CSS
    const cssRules = extractCssFromHtml(htmlContent);
    
    // 提取HTML元素
    const htmlElements = extractHtmlElements(htmlContent);
    
    // 合并结果
    return {
        success: jsAnalysis.success,
        javascript: jsAnalysis.extractedInfo,
        css: cssRules,
        html: htmlElements,
        error: jsAnalysis.error
    };
}

/**
 * @function generateFullReportMarkdown
 * @description 生成包含JS、CSS和HTML分析的完整Markdown报告
 * @param {Object} report 分析报告对象
 * @returns {string} Markdown格式的报告
 */
function generateFullReportMarkdown(report) {
    let markdown = '# HTML文件分析报告\n\n';
    
    // 添加JavaScript分析结果
    if (report.javascript) {
        // 使用ast-code-extractor的generateMarkdownDoc生成JS部分
        const jsMarkdown = generateMarkdownDoc(report.javascript);
        markdown += '## JavaScript代码分析\n\n';
        markdown += jsMarkdown.replace('# 代码分析文档\n\n', '').replace('## 目录\n\n', '### 目录\n\n');
    } else if (report.error) {
        markdown += '## JavaScript代码分析\n\n';
        markdown += `**分析失败**: ${report.error}\n\n`;
    }
    
    // 添加CSS分析结果
    if (report.css && report.css.length > 0) {
        markdown += '## CSS样式分析\n\n';
        
        report.css.forEach(rule => {
            markdown += `### 选择器: \`${rule.selector}\`\n\n`;
            markdown += `**位置**: 第 ${rule.location.startLine} 行 - 第 ${rule.location.endLine} 行\n\n`;
            
            if (rule.properties) {
                markdown += `**属性**:\n\`\`\`css\n${rule.properties}\n\`\`\`\n\n`;
            }
            
            markdown += '---\n\n';
        });
    }
    
    // 添加HTML元素分析结果
    if (report.html && report.html.length > 0) {
        markdown += '## HTML元素分析\n\n';
        
        markdown += '| 元素 | ID | 类名 | 位置 |\n';
        markdown += '|------|------|------|------|\n';
        
        report.html.forEach(element => {
            markdown += `| ${element.tag} | ${element.id || '-'} | ${element.class || '-'} | 第 ${element.location.startLine} 行 |\n`;
        });
        
        markdown += '\n';
    }
    
    return markdown;
}

/**
 * @function analyzeHtmlFile
 * @description 分析HTML文件并生成完整报告
 * @param {string} filePath HTML文件路径
 * @returns {Object} 结果对象，包含分析信息和Markdown报告
 */
function analyzeHtmlFile(filePath) {
    const fs = require('fs');
    
    try {
        const htmlContent = fs.readFileSync(filePath, 'utf8');
        const report = generateFullHtmlReport(htmlContent);
        const markdown = generateFullReportMarkdown(report);
        
        return {
            success: true,
            report: report,
            markdown: markdown
        };
    } catch (error) {
        console.error('分析HTML文件时出错:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// 导出功能
module.exports = {
    extractFromHtmlFile,
    analyzeHtmlFile,
    extractScriptTags,
    extractCssFromHtml,
    extractHtmlElements
}; 