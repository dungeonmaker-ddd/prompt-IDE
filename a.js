/**
 * HTML Patch 语料生成器
 *
 * 此工具用于从HTML文件中提取关键部分，生成结构化语料，
 * 便于AI助手生成准确的patch文件。
 */

/**
 * @function generatePatchCorpus
 * @description 从HTML文件生成结构化的patch语料
 * @param {string} htmlContent - HTML文件内容
 * @returns {Object} 结构化的语料对象
 */
function generatePatchCorpus(htmlContent) {
    return {
        functions: extractJavaScriptFunctions(htmlContent),
        cssRules: extractCSSRules(htmlContent),
        htmlStructure: extractHTMLStructure(htmlContent),
        metadata: extractMetadata(htmlContent)
    };
}

/**
 * @function extractJavaScriptFunctions
 * @description 提取HTML中的JavaScript函数，包含行号和上下文
 * @param {string} htmlContent - HTML文件内容
 * @returns {Array} 函数列表，包含名称、内容、位置和上下文
 */
function extractJavaScriptFunctions(htmlContent) {
    const lines = htmlContent.split('\n');
    const result = [];

    // 提取所有script标签内容
    const scriptBlocks = [];
    let inScript = false;
    let currentScript = '';
    let scriptStartLine = 0;

    lines.forEach((line, index) => {
        if (line.includes('<script')) {
            inScript = true;
            scriptStartLine = index;
            currentScript = '';
        }

        if (inScript) {
            currentScript += line + '\n';
        }

        if (line.includes('</script>')) {
            inScript = false;
            scriptBlocks.push({
                content: currentScript,
                startLine: scriptStartLine,
                endLine: index
            });
        }
    });

    // 从每个script块中提取函数
    scriptBlocks.forEach(scriptBlock => {
        const scriptContent = scriptBlock.content;

        // 函数模式
        const patterns = [
            // 标准函数声明 function name() { ... }
            {
                regex: /\/\*\*[\s\S]*?\*\/\s*function\s+(\w+)\s*\(([^)]*)\)\s*\{([\s\S]*?)(?=\n\s*\})/g,
                extractor: (match, name, params, body, offset) => ({
                    type: 'function',
                    name: name,
                    params: params.trim(),
                    jsdoc: match.includes('/**') ? match.match(/\/\*\*([\s\S]*?)\*\//)[0] : '',
                    body: body.trim(),
                    fullContent: match + '\n}',
                    lineNumber: getLineNumber(scriptContent, offset) + scriptBlock.startLine
                })
            },
            // 匿名函数赋值 const name = function() { ... }
            {
                regex: /\/\*\*[\s\S]*?\*\/\s*(const|let|var)\s+(\w+)\s*=\s*function\s*\(([^)]*)\)\s*\{([\s\S]*?)(?=\n\s*\})/g,
                extractor: (match, varType, name, params, body, offset) => ({
                    type: 'anonymous_function',
                    name: name,
                    params: params.trim(),
                    jsdoc: match.includes('/**') ? match.match(/\/\*\*([\s\S]*?)\*\//)[0] : '',
                    varType: varType,
                    body: body.trim(),
                    fullContent: match + '\n}',
                    lineNumber: getLineNumber(scriptContent, offset) + scriptBlock.startLine
                })
            },
            // 箭头函数 const name = () => { ... }
            {
                regex: /\/\*\*[\s\S]*?\*\/\s*(const|let|var)\s+(\w+)\s*=\s*\(([^)]*)\)\s*=>\s*\{([\s\S]*?)(?=\n\s*\})/g,
                extractor: (match, varType, name, params, body, offset) => ({
                    type: 'arrow_function',
                    name: name,
                    params: params.trim(),
                    jsdoc: match.includes('/**') ? match.match(/\/\*\*([\s\S]*?)\*\//)[0] : '',
                    varType: varType,
                    body: body.trim(),
                    fullContent: match + '\n}',
                    lineNumber: getLineNumber(scriptContent, offset) + scriptBlock.startLine
                })
            },
            // 对象方法 methodName: function() { ... } 或 methodName() { ... }
            {
                regex: /\/\*\*[\s\S]*?\*\/\s*(\w+)\s*(?::)?\s*function\s*\(([^)]*)\)\s*\{([\s\S]*?)(?=\n\s*\})/g,
                extractor: (match, name, params, body, offset) => ({
                    type: 'method',
                    name: name,
                    params: params.trim(),
                    jsdoc: match.includes('/**') ? match.match(/\/\*\*([\s\S]*?)\*\//)[0] : '',
                    body: body.trim(),
                    fullContent: match + '\n}',
                    lineNumber: getLineNumber(scriptContent, offset) + scriptBlock.startLine
                })
            }
        ];

        // 应用每个模式提取函数
        patterns.forEach(pattern => {
            let match;
            while ((match = pattern.regex.exec(scriptContent)) !== null) {
                const func = pattern.extractor(...match, match.index);

                // 添加上下文信息
                func.context = getContext(lines, func.lineNumber, 3);

                result.push(func);
            }
        });
    });

    return result;
}

/**
 * @function extractCSSRules
 * @description 提取HTML中的CSS规则，包含行号和上下文
 * @param {string} htmlContent - HTML文件内容
 * @returns {Array} CSS规则列表，包含选择器、属性、位置和上下文
 */
function extractCSSRules(htmlContent) {
    const lines = htmlContent.split('\n');
    const result = [];

    // 提取所有style标签内容
    const styleBlocks = [];
    let inStyle = false;
    let currentStyle = '';
    let styleStartLine = 0;

    lines.forEach((line, index) => {
        if (line.includes('<style')) {
            inStyle = true;
            styleStartLine = index;
            currentStyle = '';
        }

        if (inStyle) {
            currentStyle += line + '\n';
        }

        if (line.includes('</style>')) {
            inStyle = false;
            styleBlocks.push({
                content: currentStyle,
                startLine: styleStartLine,
                endLine: index
            });
        }
    });

    // 从每个style块中提取CSS规则
    styleBlocks.forEach(styleBlock => {
        const styleContent = styleBlock.content;

        // CSS规则模式（支持多行和嵌套）
        const ruleRegex = /([^{]*?)\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g;
        let match;

        while ((match = ruleRegex.exec(styleContent)) !== null) {
            const selector = match[1].trim();
            const properties = match[2].trim();
            const fullContent = match[0];
            const lineNumber = getLineNumber(styleContent, match.index) + styleBlock.startLine;

            // 添加上下文信息
            const context = getContext(lines, lineNumber, 2);

            result.push({
                type: 'css_rule',
                selector: selector,
                properties: properties,
                fullContent: fullContent,
                lineNumber: lineNumber,
                context: context
            });
        }
    });

    return result;
}

/**
 * @function extractHTMLStructure
 * @description 提取HTML的主要结构元素
 * @param {string} htmlContent - HTML文件内容
 * @returns {Object} HTML结构信息
 */
function extractHTMLStructure(htmlContent) {
    const lines = htmlContent.split('\n');

    // 提取主要元素
    const headMatch = htmlContent.match(/<head>([\s\S]*?)<\/head>/);
    const bodyMatch = htmlContent.match(/<body>([\s\S]*?)<\/body>/);

    // 主要DOM容器元素
    const containerElements = [];
    const containerRegex = /<(div|section|article|main|aside|nav|header|footer)[^>]*id=["'](\w+)["'][^>]*>/g;
    let containerMatch;

    while ((containerMatch = containerRegex.exec(htmlContent)) !== null) {
        containerElements.push({
            tag: containerMatch[1],
            id: containerMatch[2],
            lineNumber: getLineNumber(htmlContent, containerMatch.index)
        });
    }

    return {
        head: headMatch ? { content: headMatch[1], lineNumber: getLineNumber(htmlContent, headMatch.index) } : null,
        body: bodyMatch ? { content: bodyMatch[1], lineNumber: getLineNumber(htmlContent, bodyMatch.index) } : null,
        containers: containerElements
    };
}

/**
 * @function extractMetadata
 * @description 提取HTML文件的元数据信息
 * @param {string} htmlContent - HTML文件内容
 * @returns {Object} 元数据信息
 */
function extractMetadata(htmlContent) {
    const titleMatch = htmlContent.match(/<title>(.*?)<\/title>/);
    const charsetMatch = htmlContent.match(/<meta\s+charset=["'](.*?)["']/);
    const lineCount = htmlContent.split('\n').length;

    return {
        title: titleMatch ? titleMatch[1] : null,
        charset: charsetMatch ? charsetMatch[1] : null,
        lineCount: lineCount,
        scriptCount: (htmlContent.match(/<script/g) || []).length,
        styleCount: (htmlContent.match(/<style/g) || []).length
    };
}

/**
 * @function getLineNumber
 * @description 根据偏移量获取行号
 * @param {string} content - 内容
 * @param {number} offset - 字符偏移量
 * @returns {number} 行号（从0开始）
 */
function getLineNumber(content, offset) {
    const lines = content.substring(0, offset).split('\n');
    return lines.length - 1;
}

/**
 * @function getContext
 * @description 获取指定行周围的上下文
 * @param {Array} lines - 文件的所有行
 * @param {number} lineNumber - 行号
 * @param {number} contextSize - 上下文行数
 * @returns {Object} 上下文对象，包含前后几行
 */
function getContext(lines, lineNumber, contextSize) {
    const startLine = Math.max(0, lineNumber - contextSize);
    const endLine = Math.min(lines.length - 1, lineNumber + contextSize);

    return {
        before: lines.slice(startLine, lineNumber),
        current: lines[lineNumber],
        after: lines.slice(lineNumber + 1, endLine + 1),
        startLine: startLine,
        endLine: endLine
    };
}

/**
 * @function getTextDifferences
 * @description 获取两段文本之间的差异
 * @param {string} text1 - 第一段文本
 * @param {string} text2 - 第二段文本
 * @returns {Array} 差异数组
 */
function getTextDifferences(text1, text2) {
    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');
    const result = [];

    // 简单的行对比算法
    let i = 0, j = 0;

    while (i < lines1.length || j < lines2.length) {
        if (i >= lines1.length) {
            // 文本1结束，文本2中的所有剩余行都是添加的
            result.push({ type: 'add', line: j, content: lines2[j] });
            j++;
        } else if (j >= lines2.length) {
            // 文本2结束，文本1中的所有剩余行都是删除的
            result.push({ type: 'remove', line: i, content: lines1[i] });
            i++;
        } else if (lines1[i] === lines2[j]) {
            // 行相同，无变化
            result.push({ type: 'unchanged', line1: i, line2: j, content: lines1[i] });
            i++;
            j++;
        } else {
            // 行不同，查找最近的匹配
            let foundMatch = false;
            const lookAhead = 3; // 向前查找的行数

            // 查找是否有行被删除
            for (let k = 1; k <= lookAhead && i + k < lines1.length; k++) {
                if (lines1[i + k] === lines2[j]) {
                    // 文本1中有k行被删除
                    for (let l = 0; l < k; l++) {
                        result.push({ type: 'remove', line: i + l, content: lines1[i + l] });
                    }
                    i += k;
                    foundMatch = true;
                    break;
                }
            }

            if (!foundMatch) {
                // 查找是否有行被添加
                for (let k = 1; k <= lookAhead && j + k < lines2.length; k++) {
                    if (lines1[i] === lines2[j + k]) {
                        // 文本2中有k行被添加
                        for (let l = 0; l < k; l++) {
                            result.push({ type: 'add', line: j + l, content: lines2[j + l] });
                        }
                        j += k;
                        foundMatch = true;
                        break;
                    }
                }
            }

            if (!foundMatch) {
                // 行被修改
                result.push({
                    type: 'change',
                    line1: i,
                    line2: j,
                    content1: lines1[i],
                    content2: lines2[j]
                });
                i++;
                j++;
            }
        }
    }

    return result;
}

/**
 * @function compareFunctions
 * @description 比较两个函数提取对象，生成差异报告
 * @param {Object} func1 - 第一个函数对象
 * @param {Object} func2 - 第二个函数对象
 * @returns {Object} 函数差异
 */
function compareFunctions(func1, func2) {
    // 只比较函数体
    const differences = getTextDifferences(func1.body, func2.body);

    return {
        name: func1.name,
        type: func1.type,
        hasDifferences: differences.some(diff => diff.type !== 'unchanged'),
        differenceCount: differences.filter(diff => diff.type !== 'unchanged').length,
        differences: differences,
        lineNumbers: {
            original: func1.lineNumber,
            modified: func2.lineNumber
        }
    };
}

/**
 * @function generatePatchFile
 * @description 根据语料生成patch文件
 * @param {Object} originalCorpus - 原始文件语料
 * @param {Object} modifiedCorpus - 修改后文件语料
 * @param {string} filePath - 文件路径
 * @returns {string} patch文件内容
 */
function generatePatchFile(originalCorpus, modifiedCorpus, filePath) {
    let patch = 'Index: ' + filePath + '\n';
    patch += '===================================================================\n';
    patch += '--- ' + filePath + '\t(revision)\n';
    patch += '+++ ' + filePath + '\t(working copy)\n';

    // 比较函数差异
    const originalFunctions = originalCorpus.functions.reduce((acc, func) => {
        acc[func.name] = func;
        return acc;
    }, {});

    const modifiedFunctions = modifiedCorpus.functions.reduce((acc, func) => {
        acc[func.name] = func;
        return acc;
    }, {});

    // 生成函数差异patch
    for (const funcName in modifiedFunctions) {
        if (originalFunctions[funcName]) {
            // 函数存在于两个版本，检查差异
            const comparison = compareFunctions(originalFunctions[funcName], modifiedFunctions[funcName]);

            if (comparison.hasDifferences) {
                // 生成此函数的patch块
                patch += generateFunctionPatchBlock(
                    originalFunctions[funcName],
                    modifiedFunctions[funcName],
                    comparison.differences
                );
            }
        } else {
            // 新函数，添加完整内容
            patch += generateAddedFunctionPatchBlock(modifiedFunctions[funcName]);
        }
    }

    // 检查删除的函数
    for (const funcName in originalFunctions) {
        if (!modifiedFunctions[funcName]) {
            // 函数已删除
            patch += generateRemovedFunctionPatchBlock(originalFunctions[funcName]);
        }
    }

    // 比较CSS规则差异（类似于函数比较）
    // ...

    return patch;
}

/**
 * @function generateFunctionPatchBlock
 * @description 生成修改函数的patch块
 * @param {Object} originalFunc - 原始函数
 * @param {Object} modifiedFunc - 修改后函数
 * @param {Array} differences - 差异数组
 * @returns {string} patch块
 */
function generateFunctionPatchBlock(originalFunc, modifiedFunc, differences) {
    // 这里实现具体的patch块生成逻辑
    // ...
    return '';
}

/**
 * @function generateAddedFunctionPatchBlock
 * @description 生成添加函数的patch块
 * @param {Object} func - 函数对象
 * @returns {string} patch块
 */
function generateAddedFunctionPatchBlock(func) {
    // 这里实现具体的patch块生成逻辑
    // ...
    return '';
}

/**
 * @function generateRemovedFunctionPatchBlock
 * @description 生成删除函数的patch块
 * @param {Object} func - 函数对象
 * @returns {string} patch块
 */
function generateRemovedFunctionPatchBlock(func) {
    // 这里实现具体的patch块生成逻辑
    // ...
    return '';
}

/**
 * @function formatCorpusForAI
 * @description 格式化语料以便AI更好地使用
 * @param {Object} corpus - 语料对象
 * @returns {string} 格式化的语料字符串
 */
function formatCorpusForAI(corpus) {
    let output = '## HTML文件语料\n\n';

    // 元数据信息
    output += '### 文件元数据\n';
    output += `- 标题: ${corpus.metadata.title || '无'}\n`;
    output += `- 字符集: ${corpus.metadata.charset || 'UTF-8'}\n`;
    output += `- 总行数: ${corpus.metadata.lineCount}\n`;
    output += `- 脚本数量: ${corpus.metadata.scriptCount}\n`;
    output += `- 样式表数量: ${corpus.metadata.styleCount}\n\n`;

    // 函数列表
    output += '### 函数列表\n\n';
    corpus.functions.forEach((func, index) => {
        output += `#### ${index + 1}. ${func.name} (${func.type})\n`;
        output += `- 行号: ${func.lineNumber}\n`;
        output += `- 参数: ${func.params}\n`;
        output += `- 代码:\n\`\`\`javascript\n${func.fullContent}\n\`\`\`\n\n`;
    });

    // CSS规则
    output += '### CSS规则\n\n';
    corpus.cssRules.forEach((rule, index) => {
        output += `#### ${index + 1}. ${rule.selector}\n`;
        output += `- 行号: ${rule.lineNumber}\n`;
        output += `- 规则:\n\`\`\`css\n${rule.fullContent}\n\`\`\`\n\n`;
    });

    // HTML结构信息
    output += '### HTML结构\n\n';
    output += '#### 主要容器元素\n';
    corpus.htmlStructure.containers.forEach((container, index) => {
        output += `- ${container.tag}#${container.id} (行 ${container.lineNumber})\n`;
    });

    return output;
}

// 导出函数
module.exports = {
    generatePatchCorpus,
    formatCorpusForAI,
    getTextDifferences,
    compareFunctions,
    generatePatchFile
};