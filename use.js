
// 读取HTML文件
const fs = require('fs');
const {generatePatchCorpus, formatCorpusForAI} = require("./a");
const htmlContent = fs.readFileSync('index.html', 'utf8');

// 提取语料
const corpus = generatePatchCorpus(htmlContent);

// 格式化为AI友好的格式
const formattedCorpus = formatCorpusForAI(corpus);

// 输出语料
console.log(formattedCorpus);
// 或保存到文件
fs.writeFileSync('index-corpus.md', formattedCorpus);