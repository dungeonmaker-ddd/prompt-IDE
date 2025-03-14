const fs = require('fs');
const { extractAnnotationsAndLocations, formatOutput } = require('./annotation-location-extractor');

// 读取HTML文件
const htmlContent = fs.readFileSync('index.html', 'utf8');

// 提取注释和位置信息
const extractionResult = extractAnnotationsAndLocations(htmlContent);

// 格式化为可读输出
const formattedOutput = formatOutput(extractionResult);

// 输出结果
console.log(formattedOutput);
// 或保存到文件
fs.writeFileSync('functions-annotations.md', formattedOutput);