/**
 * 注释与位置提取器
 *
 * 专注于从HTML文件中提取所有函数和命名元素的:
 * 1. 名称
 * 2. 注释
 * 3. 位置信息
 * 同时支持嵌套函数和各种定义方式
 */

/**
 * @function extractAnnotationsAndLocations
 * @description 从HTML文件提取所有命名元素的注释和位置
 * @param {string} htmlContent HTML文件内容
 * @returns {Object} 包含提取内容的结构化对象
 */
function extractAnnotationsAndLocations(htmlContent) {
    return {
        functions: extractAllFunctionsInfo(htmlContent),
        css: extractCSSInfo(htmlContent),
        html: extractHTMLElementsInfo(htmlContent)
    };
}

/**
 * @function extractAllFunctionsInfo
 * @description 提取所有JavaScript函数的信息
 * @param {string} htmlContent HTML文件内容
 * @returns {Array} 函数信息对象数组
 */
function extractAllFunctionsInfo(htmlContent) {
    // 提取script内容
    const scriptContent = extractScriptTags(htmlContent);
    const lines = htmlContent.split('\n');
    const result = [];

    // 收集所有函数声明
    collectFunctionDeclarations(scriptContent, result, lines);

    // 收集所有方法声明
    collectMethodDeclarations(scriptContent, result, lines);

    // 收集所有变量赋值的函数
    collectFunctionAssignments(scriptContent, result, lines);

    // 收集所有箭头函数
    collectArrowFunctions(scriptContent, result, lines);

    // 按行号排序
    result.sort((a, b) => a.location.line - b.location.line);

    return result;
}

/**
 * @function extractScriptTags
 * @description 提取HTML中的所有script标签内容
 * @param {string} htmlContent HTML内容
 * @returns {string} 合并后的脚本内容
 */
function extractScriptTags(htmlContent) {
    const scriptTags = [];
    const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/g;
    let match;

    while ((match = scriptRegex.exec(htmlContent)) !== null) {
        scriptTags.push({
            content: match[1],
            startIndex: match.index + match[0].indexOf(match[1]),
            endIndex: match.index + match[0].indexOf(match[1]) + match[1].length
        });
    }

    return scriptTags;
}

/**
 * @function getLineNumber
 * @description 获取指定位置在文件中的行号
 * @param {string} content 完整内容
 * @param {number} index 字符位置
 * @returns {number} 行号（从1开始）
 */
function getLineNumber(content, index) {
    const upToIndex = content.substring(0, index);
    return upToIndex.split('\n').length;
}

/**
 * @function collectFunctionDeclarations
 * @description 收集标准函数声明
 * @param {Array} scriptTags 脚本标签内容数组
 * @param {Array} result 结果数组
 * @param {Array} lines 源文件行数组
 */
function collectFunctionDeclarations(scriptTags, result, lines) {
    // 匹配标准函数声明 function name(...) {...}
    const functionRegex = /\/\*\*\s*([\s\S]*?)\s*\*\/\s*function\s+(\w+)\s*\(([^)]*)\)/g;

    scriptTags.forEach(scriptTag => {
        const scriptContent = scriptTag.content;
        let match;

        while ((match = functionRegex.exec(scriptContent)) !== null) {
            const comment = match[1].trim();
            const name = match[2];
            const params = match[3].trim();
            const startIndex = scriptTag.startIndex + match.index;
            const lineNumber = getLineNumber(scriptContent, match.index) - 1 + getLineNumber(lines.join('\n'), scriptTag.startIndex);

            result.push({
                name: name,
                type: 'function',
                params: params,
                comment: formatJSDocComment(comment),
                location: {
                    line: lineNumber,
                    index: startIndex
                }
            });

            // 检查嵌套函数
            const functionBody = extractFunctionBody(scriptContent.substring(match.index));
            if (functionBody) {
                collectNestedFunctions(functionBody, name, lineNumber, startIndex, result);
            }
        }
    });

    // 没有JSDoc注释的函数
    const simpleFunctionRegex = /function\s+(\w+)\s*\(([^)]*)\)/g;

    scriptTags.forEach(scriptTag => {
        const scriptContent = scriptTag.content;
        let match;

        while ((match = simpleFunctionRegex.exec(scriptContent)) !== null) {
            const name = match[1];
            const params = match[2].trim();
            const startIndex = scriptTag.startIndex + match.index;
            const lineNumber = getLineNumber(scriptContent, match.index) - 1 + getLineNumber(lines.join('\n'), scriptTag.startIndex);

            // 检查该函数是否已经被添加(可能有JSDoc版本)
            const existingFunc = result.find(f => f.name === name);
            if (!existingFunc) {
                result.push({
                    name: name,
                    type: 'function',
                    params: params,
                    comment: '',
                    location: {
                        line: lineNumber,
                        index: startIndex
                    }
                });

                // 检查嵌套函数
                const functionBody = extractFunctionBody(scriptContent.substring(match.index));
                if (functionBody) {
                    collectNestedFunctions(functionBody, name, lineNumber, startIndex, result);
                }
            }
        }
    });
}

/**
 * @function collectMethodDeclarations
 * @description 收集对象方法声明
 * @param {Array} scriptTags 脚本标签内容数组
 * @param {Array} result 结果数组
 * @param {Array} lines 源文件行数组
 */
function collectMethodDeclarations(scriptTags, result, lines) {
    // 匹配对象方法 name: function(...) {...}
    const methodRegex = /\/\*\*\s*([\s\S]*?)\s*\*\/\s*(\w+)\s*:\s*function\s*\(([^)]*)\)/g;

    scriptTags.forEach(scriptTag => {
        const scriptContent = scriptTag.content;
        let match;

        while ((match = methodRegex.exec(scriptContent)) !== null) {
            const comment = match[1].trim();
            const name = match[2];
            const params = match[3].trim();
            const startIndex = scriptTag.startIndex + match.index;
            const lineNumber = getLineNumber(scriptContent, match.index) - 1 + getLineNumber(lines.join('\n'), scriptTag.startIndex);

            result.push({
                name: name,
                type: 'method',
                params: params,
                comment: formatJSDocComment(comment),
                location: {
                    line: lineNumber,
                    index: startIndex
                }
            });
        }
    });

    // 没有JSDoc注释的方法
    const simpleMethodRegex = /(\w+)\s*:\s*function\s*\(([^)]*)\)/g;

    scriptTags.forEach(scriptTag => {
        const scriptContent = scriptTag.content;
        let match;

        while ((match = simpleMethodRegex.exec(scriptContent)) !== null) {
            const name = match[1];
            const params = match[2].trim();
            const startIndex = scriptTag.startIndex + match.index;
            const lineNumber = getLineNumber(scriptContent, match.index) - 1 + getLineNumber(lines.join('\n'), scriptTag.startIndex);

            // 检查该方法是否已经被添加(可能有JSDoc版本)
            const existingMethod = result.find(f => f.name === name && f.type === 'method');
            if (!existingMethod) {
                result.push({
                    name: name,
                    type: 'method',
                    params: params,
                    comment: '',
                    location: {
                        line: lineNumber,
                        index: startIndex
                    }
                });
            }
        }
    });
}

/**
 * @function collectFunctionAssignments
 * @description 收集函数赋值表达式
 * @param {Array} scriptTags 脚本标签内容数组
 * @param {Array} result 结果数组
 * @param {Array} lines 源文件行数组
 */
function collectFunctionAssignments(scriptTags, result, lines) {
    // 匹配函数赋值 const/let/var name = function(...) {...}
    const assignmentRegex = /\/\*\*\s*([\s\S]*?)\s*\*\/\s*(const|let|var)\s+(\w+)\s*=\s*function\s*\(([^)]*)\)/g;

    scriptTags.forEach(scriptTag => {
        const scriptContent = scriptTag.content;
        let match;

        while ((match = assignmentRegex.exec(scriptContent)) !== null) {
            const comment = match[1].trim();
            const varType = match[2];
            const name = match[3];
            const params = match[4].trim();
            const startIndex = scriptTag.startIndex + match.index;
            const lineNumber = getLineNumber(scriptContent, match.index) - 1 + getLineNumber(lines.join('\n'), scriptTag.startIndex);

            result.push({
                name: name,
                type: 'function_assignment',
                varType: varType,
                params: params,
                comment: formatJSDocComment(comment),
                location: {
                    line: lineNumber,
                    index: startIndex
                }
            });
        }
    });

    // 没有JSDoc注释的函数赋值
    const simpleAssignmentRegex = /(const|let|var)\s+(\w+)\s*=\s*function\s*\(([^)]*)\)/g;

    scriptTags.forEach(scriptTag => {
        const scriptContent = scriptTag.content;
        let match;

        while ((match = simpleAssignmentRegex.exec(scriptContent)) !== null) {
            const varType = match[1];
            const name = match[2];
            const params = match[3].trim();
            const startIndex = scriptTag.startIndex + match.index;
            const lineNumber = getLineNumber(scriptContent, match.index) - 1 + getLineNumber(lines.join('\n'), scriptTag.startIndex);

            // 检查该函数是否已经被添加(可能有JSDoc版本)
            const existingFunc = result.find(f => f.name === name && f.type === 'function_assignment');
            if (!existingFunc) {
                result.push({
                    name: name,
                    type: 'function_assignment',
                    varType: varType,
                    params: params,
                    comment: '',
                    location: {
                        line: lineNumber,
                        index: startIndex
                    }
                });
            }
        }
    });
}

/**
 * @function collectArrowFunctions
 * @description 收集箭头函数定义
 * @param {Array} scriptTags 脚本标签内容数组
 * @param {Array} result 结果数组
 * @param {Array} lines 源文件行数组
 */
function collectArrowFunctions(scriptTags, result, lines) {
    // 匹配箭头函数 const/let/var name = (...) => {...}
    const arrowRegex = /\/\*\*\s*([\s\S]*?)\s*\*\/\s*(const|let|var)\s+(\w+)\s*=\s*\(([^)]*)\)\s*=>/g;

    scriptTags.forEach(scriptTag => {
        const scriptContent = scriptTag.content;
        let match;

        while ((match = arrowRegex.exec(scriptContent)) !== null) {
            const comment = match[1].trim();
            const varType = match[2];
            const name = match[3];
            const params = match[4].trim();
            const startIndex = scriptTag.startIndex + match.index;
            const lineNumber = getLineNumber(scriptContent, match.index) - 1 + getLineNumber(lines.join('\n'), scriptTag.startIndex);

            result.push({
                name: name,
                type: 'arrow_function',
                varType: varType,
                params: params,
                comment: formatJSDocComment(comment),
                location: {
                    line: lineNumber,
                    index: startIndex
                }
            });
        }
    });

    // 没有JSDoc注释的箭头函数
    const simpleArrowRegex = /(const|let|var)\s+(\w+)\s*=\s*\(([^)]*)\)\s*=>/g;

    scriptTags.forEach(scriptTag => {
        const scriptContent = scriptTag.content;
        let match;

        while ((match = simpleArrowRegex.exec(scriptContent)) !== null) {
            const varType = match[1];
            const name = match[2];
            const params = match[3].trim();
            const startIndex = scriptTag.startIndex + match.index;
            const lineNumber = getLineNumber(scriptContent, match.index) - 1 + getLineNumber(lines.join('\n'), scriptTag.startIndex);

            // 检查该函数是否已经被添加(可能有JSDoc版本)
            const existingFunc = result.find(f => f.name === name && f.type === 'arrow_function');
            if (!existingFunc) {
                result.push({
                    name: name,
                    type: 'arrow_function',
                    varType: varType,
                    params: params,
                    comment: '',
                    location: {
                        line: lineNumber,
                        index: startIndex
                    }
                });
            }
        }
    });
}

/**
 * @function collectNestedFunctions
 * @description 收集函数体内的嵌套函数
 * @param {string} functionBody 函数体内容
 * @param {string} parentName 父函数名称
 * @param {number} parentLine 父函数行号
 * @param {number} parentIndex 父函数起始位置
 * @param {Array} result 结果数组
 */
function collectNestedFunctions(functionBody, parentName, parentLine, parentIndex, result) {
    // 嵌套的命名函数
    const nestedFunctionRegex = /function\s+(\w+)\s*\(([^)]*)\)/g;
    let match;

    while ((match = nestedFunctionRegex.exec(functionBody)) !== null) {
        const name = match[1];
        const params = match[2].trim();
        const offset = match.index;
        const startLine = parentLine + functionBody.substring(0, offset).split('\n').length - 1;

        result.push({
            name: name,
            type: 'nested_function',
            parent: parentName,
            params: params,
            comment: '',
            location: {
                line: startLine,
                index: parentIndex + offset
            }
        });
    }

    // 嵌套的箭头函数赋值
    const nestedArrowRegex = /(const|let|var)\s+(\w+)\s*=\s*\(([^)]*)\)\s*=>/g;

    while ((match = nestedArrowRegex.exec(functionBody)) !== null) {
        const varType = match[1];
        const name = match[2];
        const params = match[3].trim();
        const offset = match.index;
        const startLine = parentLine + functionBody.substring(0, offset).split('\n').length - 1;

        result.push({
            name: name,
            type: 'nested_arrow_function',
            parent: parentName,
            varType: varType,
            params: params,
            comment: '',
            location: {
                line: startLine,
                index: parentIndex + offset
            }
        });
    }
}

/**
 * @function extractFunctionBody
 * @description 提取函数体内容
 * @param {string} text 从函数开始的文本
 * @returns {string|null} 函数体内容或null
 */
function extractFunctionBody(text) {
    let openBraces = 0;
    let startIndex = text.indexOf('{');

    if (startIndex === -1) return null;

    // 跳过函数声明，找到函数体的开始括号
    for (let i = startIndex; i < text.length; i++) {
        if (text[i] === '{') {
            openBraces++;
            if (openBraces === 1) startIndex = i;
        } else if (text[i] === '}') {
            openBraces--;
            if (openBraces === 0) {
                // 找到了匹配的结束括号
                return text.substring(startIndex + 1, i);
            }
        }
    }

    return null; // 不完整的函数体
}

/**
 * @function formatJSDocComment
 * @description 格式化JSDoc注释
 * @param {string} comment 原始注释内容
 * @returns {string} 格式化后的注释
 */
function formatJSDocComment(comment) {
    if (!comment) return '';

    // 移除每行开头的星号和多余空格
    const lines = comment.split('\n')
        .map(line => line.replace(/^\s*\*\s?/, ''))
        .filter(line => line.trim() !== '');

    return lines.join('\n');
}

/**
 * @function extractCSSInfo
 * @description 提取CSS选择器和规则信息
 * @param {string} htmlContent HTML文件内容
 * @returns {Array} CSS规则信息对象数组
 */
function extractCSSInfo(htmlContent) {
    const result = [];
    const lines = htmlContent.split('\n');

    // 提取style标签内容
    const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/g;
    let styleMatch;

    while ((styleMatch = styleRegex.exec(htmlContent)) !== null) {
        const styleContent = styleMatch[1];
        const styleStartIndex = styleMatch.index + styleMatch[0].indexOf(styleContent);
        const baseLineNumber = getLineNumber(htmlContent, styleStartIndex);

        // 提取CSS规则
        const ruleRegex = /\/\*\s*([\s\S]*?)\s*\*\/\s*([^{]+)\s*\{/g;
        let ruleMatch;

        while ((ruleMatch = ruleRegex.exec(styleContent)) !== null) {
            const comment = ruleMatch[1].trim();
            const selector = ruleMatch[2].trim();
            const ruleIndex = styleStartIndex + ruleMatch.index;
            const lineNumber = baseLineNumber + getLineNumber(styleContent, ruleMatch.index) - 1;

            result.push({
                selector: selector,
                comment: comment,
                location: {
                    line: lineNumber,
                    index: ruleIndex
                }
            });
        }

        // 没有注释的CSS规则
        const simpleRuleRegex = /([^{]+)\s*\{/g;

        while ((ruleMatch = simpleRuleRegex.exec(styleContent)) !== null) {
            const selector = ruleMatch[1].trim();
            const ruleIndex = styleStartIndex + ruleMatch.index;
            const lineNumber = baseLineNumber + getLineNumber(styleContent, ruleMatch.index) - 1;

            // 检查是否已添加(可能有注释版本)
            const existingRule = result.find(r => r.selector === selector);
            if (!existingRule) {
                result.push({
                    selector: selector,
                    comment: '',
                    location: {
                        line: lineNumber,
                        index: ruleIndex
                    }
                });
            }
        }
    }

    return result;
}

/**
 * @function extractHTMLElementsInfo
 * @description 提取HTML元素信息
 * @param {string} htmlContent HTML文件内容
 * @returns {Array} HTML元素信息对象数组
 */
function extractHTMLElementsInfo(htmlContent) {
    const result = [];
    const lines = htmlContent.split('\n');

    // 提取带ID或class的HTML元素
    const elementRegex = /<(\w+)[^>]*(?:id=["']([^"']*)["']|class=["']([^"']*)["'])[^>]*>/g;
    let match;

    while ((match = elementRegex.exec(htmlContent)) !== null) {
        const tagName = match[1];
        const id = match[2] || '';
        const className = match[3] || '';
        const lineNumber = getLineNumber(htmlContent, match.index);

        // 查找前面的注释
        const commentRegex = /<!--\s*([\s\S]*?)\s*-->/g;
        let lastCommentEnd = 0;
        let commentForElement = '';

        while ((commentMatch = commentRegex.exec(htmlContent)) !== null) {
            if (commentMatch.index > match.index) break;

            // 检查注释和元素之间是否有其他内容
            const betweenText = htmlContent.substring(commentMatch.index + commentMatch[0].length, match.index).trim();
            if (betweenText === '' || /^\s*$/.test(betweenText)) {
                commentForElement = commentMatch[1].trim();
                lastCommentEnd = commentMatch.index + commentMatch[0].length;
            }
        }

        result.push({
            tag: tagName,
            id: id,
            class: className,
            comment: commentForElement,
            location: {
                line: lineNumber,
                index: match.index
            }
        });
    }

    return result;
}

/**
 * @function formatOutput
 * @description 将提取结果格式化为人类可读的格式
 * @param {Object} extractionResult 提取结果对象
 * @returns {string} 格式化后的输出
 */
function formatOutput(extractionResult) {
    let output = '';

    // 格式化函数信息
    if (extractionResult.functions.length > 0) {
        output += '## JavaScript 函数\n\n';

        extractionResult.functions.forEach((func, index) => {
            output += `### ${index + 1}. ${func.name}\n`;

            if (func.type === 'nested_function' || func.type === 'nested_arrow_function') {
                output += `- 类型: ${func.type} (嵌套在 ${func.parent} 内)\n`;
            } else {
                output += `- 类型: ${func.type}\n`;
            }

            output += `- 参数: ${func.params}\n`;
            output += `- 位置: 行 ${func.location.line}\n`;

            if (func.comment) {
                output += `- 注释:\n\`\`\`\n${func.comment}\n\`\`\`\n`;
            }

            output += '\n';
        });
    }

    // 格式化CSS信息
    if (extractionResult.css.length > 0) {
        output += '## CSS 规则\n\n';

        extractionResult.css.forEach((rule, index) => {
            output += `### ${index + 1}. ${rule.selector}\n`;
            output += `- 位置: 行 ${rule.location.line}\n`;

            if (rule.comment) {
                output += `- 注释:\n\`\`\`\n${rule.comment}\n\`\`\`\n`;
            }

            output += '\n';
        });
    }

    // 格式化HTML元素信息
    if (extractionResult.html.length > 0) {
        output += '## HTML 元素\n\n';

        extractionResult.html.forEach((element, index) => {
            const identifier = element.id ? `#${element.id}` : element.class ? `.${element.class}` : '';
            output += `### ${index + 1}. ${element.tag}${identifier}\n`;
            output += `- 位置: 行 ${element.location.line}\n`;

            if (element.comment) {
                output += `- 注释:\n\`\`\`\n${element.comment}\n\`\`\`\n`;
            }

            output += '\n';
        });
    }

    return output;
}

// 导出函数
module.exports = {
    extractAnnotationsAndLocations,
    formatOutput
};