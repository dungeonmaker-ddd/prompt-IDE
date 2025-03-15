# AST代码分析与文档生成工具

基于抽象语法树（AST）的JavaScript代码分析工具，能够精确提取代码结构并自动生成文档。相比传统的基于正则表达式的代码提取方式，AST解析更加可靠、准确，能够真正理解代码的语法结构。

## 功能特点

- 🔍 **精确代码分析**：基于Babel的AST解析，理解代码的真实语法结构
- 📚 **全面信息提取**：函数、类、变量、导入导出等代码元素的完整信息
- 📝 **JSDoc支持**：自动提取并解析JSDoc注释
- 🔄 **嵌套结构分析**：正确处理嵌套函数和类定义
- 📊 **自动文档生成**：生成结构化的Markdown文档

## 安装方法

1. 克隆或下载本仓库
2. 安装依赖：

```bash
npm install
```

## 使用方法

### 命令行使用

分析单个文件并生成文档：

```bash
npm run analyze <文件路径> [输出文件路径]
```

例如：

```bash
npm run analyze json-format-extractor.js
```

### 分析代码字符串

```bash
npm run analyze -- --string "const x = 5; function test() { return x; }" code-doc.md
```

### 在代码中使用

```javascript
const { extractFromFile, extractFromCode } = require('./ast-code-extractor');

// 从文件分析
const fileResult = extractFromFile('path/to/file.js');
console.log(fileResult.markdown);

// 从代码字符串分析
const codeResult = extractFromCode('const x = 5; function test() { return x; }');
console.log(codeResult.markdown);
```

## 提取的信息类型

工具能够提取以下信息：

- **函数和方法**：名称、参数、返回类型、位置、JSDoc注释
- **类**：名称、继承关系、方法、属性、JSDoc注释
- **变量和常量**：名称、类型、初始值、位置
- **导入导出**：导入源、导出项、类型
- **注释**：JSDoc、普通块注释、行注释

## 对比正则表达式提取方式

AST解析相比正则表达式有以下优势：

| 功能 | AST解析 | 正则表达式 |
|------|--------|------------|
| 嵌套结构处理 | ✅ 准确识别嵌套关系 | ❌ 容易混淆配对 |
| 语法理解 | ✅ 理解语法语义 | ❌ 仅匹配文本模式 |
| 注释处理 | ✅ 能关联代码和注释 | ⚠️ 容易误匹配 |
| 复杂语法 | ✅ 支持最新JavaScript特性 | ❌ 难以处理复杂语法 |
| 可靠性 | ✅ 高可靠性 | ⚠️ 易受格式影响 |

## 生成的文档示例

生成的Markdown文档包括：

- 函数/方法列表及详情
- 类定义及其方法属性
- 变量定义列表
- 导入导出信息
- 代码位置和关系

## 实现原理

1. 使用`@babel/parser`将代码解析为AST
2. 使用`@babel/traverse`遍历AST并提取信息
3. 对提取的信息进行结构化处理
4. 生成Markdown格式的文档

## 未来计划

- [ ] 支持TypeScript类型信息提取
- [ ] 支持代码复杂度分析
- [ ] 生成HTML格式文档
- [ ] 依赖关系图生成 