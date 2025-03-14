/**
 * 紧凑版注释与位置提取器
 *
 * 专注于从HTML文件中提取所有函数和命名元素的:
 * 1. 名称
 * 2. 注释
 * 3. 位置信息（开始行和结束行）
 * 4. 函数内所有注释及其对应代码
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
    result.sort((a, b) => a.location.startLine - b.location.startLine);

    return result;
}

/**
 * @function extractScriptTags
 * @description 提取HTML中的所有script标签内容
 * @param {string} htmlContent HTML内容
 * @returns {Array} 脚本内容对象数组
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
            const startLine = getLineNumber(scriptContent, match.index) - 1 + getLineNumber(lines.join('\n'), scriptTag.startIndex);

            // 提取函数体及结束位置
            const functionBodyResult = extractFunctionBodyWithEndLine(scriptContent.substring(match.index), startLine);
            if (!functionBodyResult) continue;

            // 分析函数体内的注释和代码
            const internalComments = extractInternalCommentsAndCode(functionBodyResult.body, startLine + functionBodyResult.bodyStartLine);

            result.push({
                name: name,
                type: 'function',
                params: params,
                comment: formatJSDocComment(comment),
                location: {
                    startLine: startLine,
                    endLine: functionBodyResult.endLine
                },
                internalComments: internalComments
            });

            // 检查嵌套函数
            collectNestedFunctions(functionBodyResult.body, name, startLine, startIndex, result, functionBodyResult.bodyStartLine);
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
            const startLine = getLineNumber(scriptContent, match.index) - 1 + getLineNumber(lines.join('\n'), scriptTag.startIndex);

            // 检查该函数是否已经被添加(可能有JSDoc版本)
            const existingFunc = result.find(f => f.name === name && f.type === 'function');
            if (!existingFunc) {
                // 提取函数体及结束位置
                const functionBodyResult = extractFunctionBodyWithEndLine(scriptContent.substring(match.index), startLine);
                if (!functionBodyResult) continue;

                // 分析函数体内的注释和代码
                const internalComments = extractInternalCommentsAndCode(functionBodyResult.body, startLine + functionBodyResult.bodyStartLine);

                result.push({
                    name: name,
                    type: 'function',
                    params: params,
                    comment: '',
                    location: {
                        startLine: startLine,
                        endLine: functionBodyResult.endLine
                    },
                    internalComments: internalComments
                });

                // 检查嵌套函数
                collectNestedFunctions(functionBodyResult.body, name, startLine, startIndex, result, functionBodyResult.bodyStartLine);
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
            const startLine = getLineNumber(scriptContent, match.index) - 1 + getLineNumber(lines.join('\n'), scriptTag.startIndex);

            // 提取函数体及结束位置
            const functionBodyResult = extractFunctionBodyWithEndLine(scriptContent.substring(match.index), startLine);
            if (!functionBodyResult) continue;

            // 分析函数体内的注释和代码
            const internalComments = extractInternalCommentsAndCode(functionBodyResult.body, startLine + functionBodyResult.bodyStartLine);

            result.push({
                name: name,
                type: 'method',
                params: params,
                comment: formatJSDocComment(comment),
                location: {
                    startLine: startLine,
                    endLine: functionBodyResult.endLine
                },
                internalComments: internalComments
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
            const startLine = getLineNumber(scriptContent, match.index) - 1 + getLineNumber(lines.join('\n'), scriptTag.startIndex);

            // 检查该方法是否已经被添加(可能有JSDoc版本)
            const existingMethod = result.find(f => f.name === name && f.type === 'method');
            if (!existingMethod) {
                // 提取函数体及结束位置
                const functionBodyResult = extractFunctionBodyWithEndLine(scriptContent.substring(match.index), startLine);
                if (!functionBodyResult) continue;

                // 分析函数体内的注释和代码
                const internalComments = extractInternalCommentsAndCode(functionBodyResult.body, startLine + functionBodyResult.bodyStartLine);

                result.push({
                    name: name,
                    type: 'method',
                    params: params,
                    comment: '',
                    location: {
                        startLine: startLine,
                        endLine: functionBodyResult.endLine
                    },
                    internalComments: internalComments
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
            const startLine = getLineNumber(scriptContent, match.index) - 1 + getLineNumber(lines.join('\n'), scriptTag.startIndex);

            // 提取函数体及结束位置
            const functionBodyResult = extractFunctionBodyWithEndLine(scriptContent.substring(match.index), startLine);
            if (!functionBodyResult) continue;

            // 分析函数体内的注释和代码
            const internalComments = extractInternalCommentsAndCode(functionBodyResult.body, startLine + functionBodyResult.bodyStartLine);

            result.push({
                name: name,
                type: 'function_assignment',
                varType: varType,
                params: params,
                comment: formatJSDocComment(comment),
                location: {
                    startLine: startLine,
                    endLine: functionBodyResult.endLine
                },
                internalComments: internalComments
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
            const startLine = getLineNumber(scriptContent, match.index) - 1 + getLineNumber(lines.join('\n'), scriptTag.startIndex);

            // 检查该函数是否已经被添加(可能有JSDoc版本)
            const existingFunc = result.find(f => f.name === name && f.type === 'function_assignment');
            if (!existingFunc) {
                // 提取函数体及结束位置
                const functionBodyResult = extractFunctionBodyWithEndLine(scriptContent.substring(match.index), startLine);
                if (!functionBodyResult) continue;

                // 分析函数体内的注释和代码
                const internalComments = extractInternalCommentsAndCode(functionBodyResult.body, startLine + functionBodyResult.bodyStartLine);

                result.push({
                    name: name,
                    type: 'function_assignment',
                    varType: varType,
                    params: params,
                    comment: '',
                    location: {
                        startLine: startLine,
                        endLine: functionBodyResult.endLine
                    },
                    internalComments: internalComments
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
            const startLine = getLineNumber(scriptContent, match.index) - 1 + getLineNumber(lines.join('\n'), scriptTag.startIndex);

            // 提取函数体及结束位置
            const functionBodyResult = extractArrowFunctionBodyWithEndLine(scriptContent.substring(match.index), startLine);
            if (!functionBodyResult) continue;

            // 分析函数体内的注释和代码
            const internalComments = extractInternalCommentsAndCode(functionBodyResult.body, startLine + functionBodyResult.bodyStartLine);

            result.push({
                name: name,
                type: 'arrow_function',
                varType: varType,
                params: params,
                comment: formatJSDocComment(comment),
                location: {
                    startLine: startLine,
                    endLine: functionBodyResult.endLine
                },
                internalComments: internalComments
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
            const startLine = getLineNumber(scriptContent, match.index) - 1 + getLineNumber(lines.join('\n'), scriptTag.startIndex);

            // 检查该函数是否已经被添加(可能有JSDoc版本)
            const existingFunc = result.find(f => f.name === name && f.type === 'arrow_function');
            if (!existingFunc) {
                // 提取函数体及结束位置
                const functionBodyResult = extractArrowFunctionBodyWithEndLine(scriptContent.substring(match.index), startLine);
                if (!functionBodyResult) continue;

                // 分析函数体内的注释和代码
                const internalComments = extractInternalCommentsAndCode(functionBodyResult.body, startLine + functionBodyResult.bodyStartLine);

                result.push({
                    name: name,
                    type: 'arrow_function',
                    varType: varType,
                    params: params,
                    comment: '',
                    location: {
                        startLine: startLine,
                        endLine: functionBodyResult.endLine
                    },
                    internalComments: internalComments
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
 * @param {number} bodyStartLine 函数体开始的行号偏移
 */
function collectNestedFunctions(functionBody, parentName, parentLine, parentIndex, result, bodyStartLine) {
    // 嵌套的命名函数
    const nestedFunctionRegex = /function\s+(\w+)\s*\(([^)]*)\)/g;
    let match;

    while ((match = nestedFunctionRegex.exec(functionBody)) !== null) {
        const name = match[1];
        const params = match[2].trim();
        const offset = match.index;
        const linesBeforeMatch = functionBody.substring(0, offset).split('\n');
        const startLine = parentLine + linesBeforeMatch.length - 1 + bodyStartLine;

        // 提取函数体及结束位置
        const functionBodyResult = extractFunctionBodyWithEndLine(functionBody.substring(offset), startLine);
        if (!functionBodyResult) continue;

        // 分析函数体内的注释和代码
        const internalComments = extractInternalCommentsAndCode(functionBodyResult.body, startLine + functionBodyResult.bodyStartLine);

        result.push({
            name: name,
            type: 'nested_function',
            parent: parentName,
            params: params,
            comment: '',
            location: {
                startLine: startLine,
                endLine: functionBodyResult.endLine
            },
            internalComments: internalComments
        });
    }

    // 嵌套的箭头函数赋值
    const nestedArrowRegex = /(const|let|var)\s+(\w+)\s*=\s*\(([^)]*)\)\s*=>/g;

    while ((match = nestedArrowRegex.exec(functionBody)) !== null) {
        const varType = match[1];
        const name = match[2];
        const params = match[3].trim();
        const offset = match.index;
        const linesBeforeMatch = functionBody.substring(0, offset).split('\n');
        const startLine = parentLine + linesBeforeMatch.length - 1 + bodyStartLine;

        // 提取函数体及结束位置
        const functionBodyResult = extractArrowFunctionBodyWithEndLine(functionBody.substring(offset), startLine);
        if (!functionBodyResult) continue;

        // 分析函数体内的注释和代码
        const internalComments = extractInternalCommentsAndCode(functionBodyResult.body, startLine + functionBodyResult.bodyStartLine);

        result.push({
            name: name,
            type: 'nested_arrow_function',
            parent: parentName,
            varType: varType,
            params: params,
            comment: '',
            location: {
                startLine: startLine,
                endLine: functionBodyResult.endLine
            },
            internalComments: internalComments
        });
    }
}

/**
 * @function extractFunctionBodyWithEndLine
 * @description 提取函数体内容并计算结束行号
 * @param {string} text 从函数开始的文本
 * @param {number} startLine 函数开始的行号
 * @returns {Object|null} 函数体内容、结束行号和函数体开始的行号偏移
 */
function extractFunctionBodyWithEndLine(text, startLine) {
    let openBraces = 0;
    let startIndex = text.indexOf('{');

    if (startIndex === -1) return null;

    // 计算函数声明到函数体开始的行数偏移
    const bodyStartLine = text.substring(0, startIndex).split('\n').length - 1;

    // 跳过函数声明，找到函数体的开始括号
    for (let i = startIndex; i < text.length; i++) {
        if (text[i] === '{') {
            openBraces++;
        } else if (text[i] === '}') {
            openBraces--;
            if (openBraces === 0) {
                // 找到了匹配的结束括号
                const body = text.substring(startIndex + 1, i);
                // 计算结束行号
                const linesInBody = text.substring(0, i + 1).split('\n').length - 1;
                const endLine = startLine + linesInBody;

                return {
                    body: body,
                    endLine: endLine,
                    bodyStartLine: bodyStartLine
                };
            }
        }
    }

    return null; // 不完整的函数体
}

/**
 * @function extractArrowFunctionBodyWithEndLine
 * @description 提取箭头函数体内容并计算结束行号
 * @param {string} text 从箭头函数开始的文本
 * @param {number} startLine 函数开始的行号
 * @returns {Object|null} 函数体内容、结束行号和函数体开始的行号偏移
 */
function extractArrowFunctionBodyWithEndLine(text, startLine) {
    // 找到箭头函数的 =>
    const arrowIndex = text.indexOf('=>');
    if (arrowIndex === -1) return null;

    // 找到函数体开始位置
    let bodyStartIndex = text.indexOf('{', arrowIndex);
    if (bodyStartIndex === -1) {
        // 可能是单行箭头函数
        const lineEndIndex = text.indexOf('\n', arrowIndex);
        if (lineEndIndex === -1) return null;

        const body = text.substring(arrowIndex + 2, lineEndIndex).trim();
        // 箭头函数结束行就是开始行
        const endLine = startLine;
        return {
            body: body,
            endLine: endLine,
            bodyStartLine: 0
        };
    }

    // 计算箭头函数声明到函数体开始的行数偏移
    const bodyStartLine = text.substring(0, bodyStartIndex).split('\n').length - 1;

    // 对于有花括号的箭头函数，类似普通函数处理
    let openBraces = 0;

    for (let i = bodyStartIndex; i < text.length; i++) {
        if (text[i] === '{') {
            openBraces++;
        } else if (text[i] === '}') {
            openBraces--;
            if (openBraces === 0) {
                // 找到了匹配的结束括号
                const body = text.substring(bodyStartIndex + 1, i);
                // 计算结束行号
                const linesInBody = text.substring(0, i + 1).split('\n').length - 1;
                const endLine = startLine + linesInBody;

                return {
                    body: body,
                    endLine: endLine,
                    bodyStartLine: bodyStartLine
                };
            }
        }
    }

    return null; // 不完整的函数体
}

/**
 * @function extractInternalCommentsAndCode
 * @description 提取函数体内的所有注释及其对应的代码
 * @param {string} functionBody 函数体内容
 * @param {number} startLine 函数体开始的行号
 * @returns {Array} 注释和对应代码的数组
 */
function extractInternalCommentsAndCode(functionBody, startLine) {
    const result = [];
    const lines = functionBody.split('\n');

    // 提取单行注释 //
    let currentComment = '';
    let commentStartLine = 0;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmedLine = line.trim();

        // 检查是否是注释行
        if (trimmedLine.startsWith('//')) {
            if (!currentComment) {
                // 新注释开始
                commentStartLine = startLine + i;
            }
            // 添加到当前注释
            currentComment += (currentComment ? '\n' : '') + trimmedLine;
        } else if (currentComment) {
            // 注释结束，找到对应的代码行
            if (trimmedLine && !trimmedLine.startsWith('/*') && !trimmedLine.startsWith('*')) {
                result.push({
                    comment: currentComment,
                    code: trimmedLine,
                    location: {
                        commentLine: commentStartLine,
                        codeLine: startLine + i
                    }
                });
            }
            currentComment = '';
        }
    }

    // 提取多行注释 /* ... */
    const multilineCommentRegex = /\/\*(?!\*)([\s\S]*?)\*\//g;
    let match;

    while ((match = multilineCommentRegex.exec(functionBody)) !== null) {
        const commentContent = match[1].trim();
        const commentEndIndex = match.index + match[0].length;

        // 计算注释在函数体中的行号
        const linesBeforeComment = functionBody.substring(0, match.index).split('\n');
        const commentLine = startLine + linesBeforeComment.length - 1;

        // 找到注释后最近的代码行
        const textAfterComment = functionBody.substring(commentEndIndex);
        const nextLineMatch = textAfterComment.match(/^\s*(.+)/);

        if (nextLineMatch) {
            const nextLine = nextLineMatch[1];
            // 计算代码行号
            const linesBeforeCode = functionBody.substring(0, commentEndIndex + textAfterComment.indexOf(nextLine)).split('\n');
            const codeLine = startLine + linesBeforeCode.length - 1;

            result.push({
                comment: '/*' + commentContent + '*/',
                code: nextLine,
                location: {
                    commentLine: commentLine,
                    codeLine: codeLine
                }
            });
        }
    }

    // 提取JSDoc注释 /** ... */
    const jsdocCommentRegex = /\/\*\*([\s\S]*?)\*\//g;

    while ((match = jsdocCommentRegex.exec(functionBody)) !== null) {
        const commentContent = match[1].trim();
        const commentEndIndex = match.index + match[0].length;

        // 计算注释在函数体中的行号
        const linesBeforeComment = functionBody.substring(0, match.index).split('\n');
        const commentLine = startLine + linesBeforeComment.length - 1;

        // 找到注释后最近的代码行
        const textAfterComment = functionBody.substring(commentEndIndex);
        const nextLineMatch = textAfterComment.match(/^\s*(.+)/);

        if (nextLineMatch) {
            const nextLine = nextLineMatch[1];
            // 计算代码行号
            const linesBeforeCode = functionBody.substring(0, commentEndIndex + textAfterComment.indexOf(nextLine)).split('\n');
            const codeLine = startLine + linesBeforeCode.length - 1;

            result.push({
                comment: '/**' + commentContent + '*/',
                code: nextLine,
                location: {
                    commentLine: commentLine,
                    codeLine: codeLine
                }
            });
        }
    }

    // 按行号排序
    result.sort((a, b) => a.location.commentLine - b.location.commentLine);

    return result;
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
        const ruleRegex = /\/\*\s*([\s\S]*?)\s*\*\/\s*([^{]+)\s*\{([^}]*)\}/g;
        let ruleMatch;

        while ((ruleMatch = ruleRegex.exec(styleContent)) !== null) {
            const comment = ruleMatch[1].trim();
            const selector = ruleMatch[2].trim();
            const properties = ruleMatch[3].trim();
            const ruleIndex = styleStartIndex + ruleMatch.index;

            // 计算起始行和结束行
            const beforeRule = styleContent.substring(0, ruleMatch.index);
            const startLine = baseLineNumber + beforeRule.split('\n').length - 1;
            const ruleText = ruleMatch[0];
            const endLine = startLine + ruleText.split('\n').length - 1;

            result.push({
                selector: selector,
                properties: properties,
                comment: comment,
                location: {
                    startLine: startLine,
                    endLine: endLine
                }
            });
        }

        // 没有注释的CSS规则
        const simpleRuleRegex = /([^{]+)\s*\{([^}]*)\}/g;

        while ((ruleMatch = simpleRuleRegex.exec(styleContent)) !== null) {
            const selector = ruleMatch[1].trim();
            const properties = ruleMatch[2].trim();
            const ruleIndex = styleStartIndex + ruleMatch.index;

            // 计算起始行和结束行
            const beforeRule = styleContent.substring(0, ruleMatch.index);
            const startLine = baseLineNumber + beforeRule.split('\n').length - 1;
            const ruleText = ruleMatch[0];
            const endLine = startLine + ruleText.split('\n').length - 1;

            // 检查是否已添加(可能有注释版本)
            const existingRule = result.find(r => r.selector === selector);
            if (!existingRule) {
                result.push({
                    selector: selector,
                    properties: properties,
                    comment: '',
                    location: {
                        startLine: startLine,
                        endLine: endLine
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
        const elementText = match[0];

        // 计算起始行和结束行
        const beforeElement = htmlContent.substring(0, match.index);
        const startLine = beforeElement.split('\n').length;
        const endLine = startLine + (elementText.match(/\n/g) || []).length;

        // 查找前面的注释
        const commentRegex = /<!--\s*([\s\S]*?)\s*-->/g;
        let lastCommentEnd = 0;
        let commentForElement = '';
        let commentStartLine = 0;

        commentRegex.lastIndex = 0; // 重置regex
        let commentMatch;
        while ((commentMatch = commentRegex.exec(htmlContent)) !== null) {
            if (commentMatch.index > match.index) break;

            // 检查注释和元素之间是否有其他内容
            const betweenText = htmlContent.substring(commentMatch.index + commentMatch[0].length, match.index).trim();
            if (betweenText === '' || /^\s*$/.test(betweenText)) {
                commentForElement = commentMatch[1].trim();
                lastCommentEnd = commentMatch.index + commentMatch[0].length;

                // 计算注释起始行
                commentStartLine = htmlContent.substring(0, commentMatch.index).split('\n').length;
            }
        }

        result.push({
            tag: tagName,
            id: id,
            class: className,
            comment: commentForElement,
            location: {
                startLine: startLine,
                endLine: endLine,
                commentLine: commentStartLine
            }
        });
    }

    return result;
}

/**
 * @function formatOutput
 * @description 将提取结果格式化为JSON内嵌代码块的结构化输出
 * @param {Object} extractionResult 提取结果对象
 * @returns {string} 格式化后的JSON输出
 */
function formatOutput(extractionResult) {
    // 创建输出JSON结构
    const outputObject = {
        functions: [],
        css: [],
        html: []
    };

    // 处理函数信息
    if (extractionResult.functions.length > 0) {
        extractionResult.functions.forEach(func => {
            const functionObj = {
                name: func.name,
                type: getFunctionTypeName(func.type),
                params: func.params,
                location: {
                    startLine: func.location.startLine,
                    endLine: func.location.endLine
                }
            };

            if (func.parent) {
                functionObj.parent = func.parent;
            }

            if (func.comment) {
                functionObj.description = func.comment;
            }

            if (func.internalComments && func.internalComments.length > 0) {
                functionObj.internalComments = func.internalComments.map(item => ({
                    comment: item.comment,
                    code: item.code,
                    location: {
                        commentLine: item.location.commentLine,
                        codeLine: item.location.codeLine
                    }
                }));
            }

            outputObject.functions.push(functionObj);
        });
    }

    // 处理CSS规则
    if (extractionResult.css.length > 0) {
        extractionResult.css.forEach(rule => {
            const cssObj = {
                selector: rule.selector,
                location: {
                    startLine: rule.location.startLine,
                    endLine: rule.location.endLine
                }
            };

            if (rule.properties) {
                cssObj.properties = rule.properties;
            }

            if (rule.comment) {
                cssObj.description = rule.comment;
            }

            outputObject.css.push(cssObj);
        });
    }

    // 处理HTML元素
    if (extractionResult.html.length > 0) {
        extractionResult.html.forEach(element => {
            const htmlObj = {
                tag: element.tag,
                location: {
                    startLine: element.location.startLine,
                    endLine: element.location.endLine
                }
            };

            if (element.id) {
                htmlObj.id = element.id;
            }

            if (element.class) {
                htmlObj.class = element.class;
            }

            if (element.comment) {
                htmlObj.description = element.comment;
            }

            outputObject.html.push(htmlObj);
        });
    }

    // 将结果转换为带格式的JSON字符串
    return JSON.stringify(outputObject, null, 2);
}

/**
 * @function formatMarkdownFromJSON
 * @description 将JSON输出转换为易读的Markdown格式
 * @param {string} jsonOutput JSON格式的输出字符串
 * @returns {string} Markdown格式的输出
 */
function formatMarkdownFromJSON(jsonOutput) {
    const data = JSON.parse(jsonOutput);
    let output = '';

    // 处理函数列表
    if (data.functions && data.functions.length > 0) {
        output += '# 函数列表\n';

        data.functions.forEach(func => {
            // 函数基本信息
            output += `## ${func.name}\n`;
            output += `- **类型**: ${func.type}`;
            if (func.parent) output += ` (嵌套在 ${func.parent} 内)`;
            output += `\n- **参数**: \`${func.params}\`\n- **位置**: 第 ${func.location.startLine} 行至第 ${func.location.endLine} 行\n`;

            // 函数说明
            if (func.description) {
                output += `### 函数说明\n\`\`\`\n${func.description}\n\`\`\`\n`;
            }

            // 内部注释
            if (func.internalComments && func.internalComments.length > 0) {
                output += `### 内部注释\n`;
                func.internalComments.forEach((item, i) => {
                    output += `#### 注释 ${i+1} (第 ${item.location.commentLine} 行)\n\`\`\`\n${item.comment}\n\`\`\`\n**相关代码** (第 ${item.location.codeLine} 行):\n\`\`\`javascript\n${item.code}\n\`\`\`\n`;
                });
            }

            output += `---\n`;
        });
    }

    // 处理CSS规则
    if (data.css && data.css.length > 0) {
        output += '# CSS 规则\n';

        data.css.forEach(rule => {
            output += `## ${rule.selector}\n`;
            output += `- **位置**: 第 ${rule.location.startLine} 行至第 ${rule.location.endLine} 行\n`;

            if (rule.properties) {
                output += `### 属性\n\`\`\`css\n${rule.properties}\n\`\`\`\n`;
            }

            if (rule.description) {
                output += `### 说明\n\`\`\`\n${rule.description}\n\`\`\`\n`;
            }

            output += `---\n`;
        });
    }

    // 处理HTML元素
    if (data.html && data.html.length > 0) {
        output += '# HTML 元素\n';

        data.html.forEach(element => {
            const identifier = element.id ? `#${element.id}` : element.class ? `.${element.class}` : '';
            output += `## ${element.tag}${identifier}\n`;
            output += `- **位置**: 第 ${element.location.startLine} 行至第 ${element.location.endLine} 行\n`;

            if (element.description) {
                output += `### 说明\n\`\`\`\n${element.description}\n\`\`\`\n`;
            }

            output += `---\n`;
        });
    }

    return output;
}

/**
 * @function getFunctionTypeName
 * @description 获取函数类型的中文名称
 * @param {string} type 函数类型
 * @returns {string} 中文名称
 */
function getFunctionTypeName(type) {
    const typeMap = {
        'function': '函数声明',
        'method': '对象方法',
        'function_assignment': '函数赋值',
        'arrow_function': '箭头函数',
        'nested_function': '嵌套函数',
        'nested_arrow_function': '嵌套箭头函数'
    };

    return typeMap[type] || type;
}

// 导出函数
module.exports = {
    extractAnnotationsAndLocations,
    formatOutput,
    formatMarkdownFromJSON
};