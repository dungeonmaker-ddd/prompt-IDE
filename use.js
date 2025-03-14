const fs = require('fs');
const { extractAnnotationsAndLocations, formatOutput, formatMarkdownFromJSON } = require('./json-format-extractor');

// 读取HTML文件
const htmlContent = fs.readFileSync('index.html', 'utf8');

// 提取注释和位置信息
const extractionResult = extractAnnotationsAndLocations(htmlContent);

// 格式化为JSON输出
const jsonOutput = formatOutput(extractionResult);

// 保存JSON结果
fs.writeFileSync('functions-annotations.json', jsonOutput);

// 如果需要Markdown格式，可以将JSON转换为Markdown
const markdownOutput = formatMarkdownFromJSON(jsonOutput);
fs.writeFileSync('functions-annotations.md', markdownOutput);

console.log('提取完成: 结果已保存到 functions-annotations.json 和 functions-annotations.md');

// 示例：如何处理输出的JSON结构
const processJsonOutput = () => {
    const data = JSON.parse(jsonOutput);

    // 例1: 获取所有包含特定注释关键词的函数
    const functionsWithSpecificComment = data.functions.filter(func =>
        func.description && func.description.includes('获取') ||
        (func.internalComments && func.internalComments.some(comment =>
            comment.comment.includes('获取')))
    );

    // 例2: 找出行数最多的函数
    const longestFunction = data.functions.reduce((longest, current) =>
        (current.location.endLine - current.location.startLine) >
        (longest.location.endLine - longest.location.startLine) ? current : longest
    );

    // 例3: 构建函数调用关系图 (伪代码)
    const functionCalls = {};
    data.functions.forEach(func => {
        functionCalls[func.name] = [];
        if (func.internalComments) {
            func.internalComments.forEach(comment => {
                // 假设我们通过代码行来检测函数调用
                data.functions.forEach(otherFunc => {
                    if (otherFunc.name !== func.name && comment.code.includes(otherFunc.name)) {
                        functionCalls[func.name].push(otherFunc.name);
                    }
                });
            });
        }
    });

    console.log('具有特定注释的函数:', functionsWithSpecificComment.map(f => f.name));
    console.log('最长的函数:', longestFunction.name,
        `(${longestFunction.location.endLine - longestFunction.location.startLine} 行)`);
    console.log('函数调用关系:', functionCalls);
};

// 运行JSON处理示例
processJsonOutput();