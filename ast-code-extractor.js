/**
 * AST代码提取器与文档生成器
 * 
 * 基于抽象语法树(AST)的代码分析工具，能够精确提取JavaScript代码中的:
 * 1. 函数和方法定义（包括参数、JSDoc注释）
 * 2. 类定义及其方法
 * 3. 变量和常量声明
 * 4. 导入和导出语句
 * 5. 嵌套结构和作用域
 * 
 * 并能够根据这些信息生成结构化文档
 */

/**
 * @typedef {Object} Location
 * @property {number} startLine 开始行号
 * @property {number} endLine 结束行号
 * @property {number} startColumn 开始列号
 * @property {number} endColumn 结束列号
 */

/**
 * @typedef {Object} Comment
 * @property {string} type 注释类型 (Block, Line, JSDoc)
 * @property {string} value 注释内容
 * @property {Location} location 注释位置
 */

/**
 * @typedef {Object} Parameter
 * @property {string} name 参数名称
 * @property {string} [type] 参数类型（如果在JSDoc中指定）
 * @property {string} [default] 默认值（如果有）
 * @property {boolean} [rest] 是否是剩余参数
 */

/**
 * @typedef {Object} FunctionInfo
 * @property {string} name 函数名称
 * @property {string} type 函数类型 (FunctionDeclaration, ArrowFunction, MethodDefinition, etc.)
 * @property {Parameter[]} params 参数列表
 * @property {Comment[]} comments 相关注释
 * @property {Location} location 位置信息
 * @property {string} [returnType] 返回类型（如果在JSDoc中指定）
 * @property {FunctionInfo[]} [nestedFunctions] 嵌套函数
 */

/**
 * @typedef {Object} ClassInfo
 * @property {string} name 类名称
 * @property {Comment[]} comments 相关注释
 * @property {Location} location 位置信息
 * @property {string[]} [extends] 继承的类
 * @property {string[]} [implements] 实现的接口
 * @property {FunctionInfo[]} methods 类方法
 * @property {VariableInfo[]} properties 类属性
 */

/**
 * @typedef {Object} VariableInfo
 * @property {string} name 变量名称
 * @property {string} kind 变量类型 (var, let, const)
 * @property {Comment[]} comments 相关注释
 * @property {Location} location 位置信息
 * @property {string} [type] 变量类型（如果在JSDoc中指定）
 * @property {string} [initialValue] 初始值字符串表示
 */

/**
 * @typedef {Object} ExportInfo
 * @property {string} type 导出类型 (DefaultExport, NamedExport)
 * @property {string[]} names 导出的名称
 * @property {Location} location 位置信息
 */

/**
 * @typedef {Object} ImportInfo
 * @property {string} source 导入源
 * @property {Object[]} specifiers 导入说明符
 * @property {Location} location 位置信息
 */

/**
 * @typedef {Object} ExtractedInfo
 * @property {FunctionInfo[]} functions 函数信息
 * @property {ClassInfo[]} classes 类信息
 * @property {VariableInfo[]} variables 变量信息
 * @property {ExportInfo[]} exports 导出信息
 * @property {ImportInfo[]} imports 导入信息
 */

// 注意：实际实现需要安装依赖
// npm install @babel/parser @babel/traverse @babel/types

/**
 * @function parseCode
 * @description 使用Babel解析器解析代码生成AST
 * @param {string} code 源代码
 * @returns {Object} Babel AST
 */
function parseCode(code) {
    try {
        // 实际代码中需引入@babel/parser
        const parser = require('@babel/parser');
        return parser.parse(code, {
            sourceType: 'module',
            plugins: [
                'jsx',
                'typescript',
                'classProperties',
                'decorators-legacy',
                'objectRestSpread'
            ],
            attachComments: true // 确保注释被附加到AST节点
        });
    } catch (error) {
        console.error('解析代码时出错:', error);
        return null;
    }
}

/**
 * @function extractComments
 * @description 从节点中提取注释
 * @param {Object} node AST节点
 * @param {Array} comments 所有注释
 * @param {Array} lines 源代码行
 * @returns {Comment[]} 注释数组
 */
function extractComments(node, comments, lines) {
    if (!node || !comments) return [];

    const nodeComments = [];
    const nodeLine = node.loc.start.line;
    
    // 查找节点之前的注释
    const leadingComments = comments.filter(comment => {
        return comment.loc.end.line < nodeLine && 
               // 确保注释和节点之间没有其他非空行
               !lines.slice(comment.loc.end.line, nodeLine - 1)
                    .some(line => line.trim() !== '');
    });

    leadingComments.forEach(comment => {
        const type = comment.type === 'CommentBlock' && comment.value.startsWith('*') 
            ? 'JSDoc' 
            : comment.type === 'CommentBlock' ? 'Block' : 'Line';

        nodeComments.push({
            type: type,
            value: comment.value.trim(),
            location: {
                startLine: comment.loc.start.line,
                endLine: comment.loc.end.line,
                startColumn: comment.loc.start.column,
                endColumn: comment.loc.end.column
            }
        });
    });

    return nodeComments;
}

/**
 * @function extractParameters
 * @description 从函数定义中提取参数信息
 * @param {Array} params AST参数节点
 * @returns {Parameter[]} 参数信息数组
 */
function extractParameters(params) {
    if (!params) return [];

    return params.map(param => {
        // 处理不同类型的参数
        if (param.type === 'Identifier') {
            return {
                name: param.name,
                type: null,
                default: null,
                rest: false
            };
        } else if (param.type === 'AssignmentPattern') {
            // 默认参数
            return {
                name: param.left.name,
                type: null,
                default: param.right.value?.toString(),
                rest: false
            };
        } else if (param.type === 'RestElement') {
            // 剩余参数
            return {
                name: param.argument.name,
                type: null,
                default: null,
                rest: true
            };
        } else if (param.type === 'ObjectPattern') {
            // 解构参数
            return {
                name: '{' + param.properties.map(p => p.key.name).join(', ') + '}',
                type: 'object',
                default: null,
                rest: false
            };
        } else if (param.type === 'ArrayPattern') {
            // 数组解构
            return {
                name: '[' + param.elements.map(e => e?.name || '_').join(', ') + ']',
                type: 'array',
                default: null,
                rest: false
            };
        }
        
        return { name: 'unknown', type: null, default: null, rest: false };
    });
}

/**
 * @function extractJSDocInfo
 * @description 从JSDoc注释中提取类型信息
 * @param {Comment[]} comments 注释数组
 * @returns {Object} 提取的JSDoc信息
 */
function extractJSDocInfo(comments) {
    const jsDocComment = comments.find(c => c.type === 'JSDoc');
    if (!jsDocComment) return {};

    const result = {
        description: '',
        params: {},
        returns: null
    };

    // 简单解析JSDoc
    const lines = jsDocComment.value.split('\n');
    let currentDescription = [];
    
    lines.forEach(line => {
        line = line.trim().replace(/^\*\s*/, '');
        
        if (line.startsWith('@param')) {
            // 解析参数注释
            const paramMatch = line.match(/@param\s+{([^}]+)}\s+(\w+)(?:\s+(.*))?/);
            if (paramMatch) {
                result.params[paramMatch[2]] = {
                    type: paramMatch[1],
                    description: paramMatch[3] || ''
                };
            }
        } else if (line.startsWith('@returns') || line.startsWith('@return')) {
            // 解析返回值注释
            const returnMatch = line.match(/@returns?\s+{([^}]+)}(?:\s+(.*))?/);
            if (returnMatch) {
                result.returns = {
                    type: returnMatch[1],
                    description: returnMatch[2] || ''
                };
            }
        } else if (!line.startsWith('@')) {
            // 收集描述
            currentDescription.push(line);
        }
    });
    
    result.description = currentDescription.join('\n').trim();
    return result;
}

/**
 * @function extractFunctionInfo
 * @description 提取函数信息
 * @param {Object} node 函数节点
 * @param {Array} comments 所有注释
 * @param {Array} lines 源代码行
 * @returns {FunctionInfo} 函数信息
 */
function extractFunctionInfo(node, comments, lines) {
    const nodeComments = extractComments(node, comments, lines);
    const jsDocInfo = extractJSDocInfo(nodeComments);
    
    // 获取函数名称
    let name = '';
    if (node.id) {
        name = node.id.name;
    } else if (node.key) {
        name = node.key.name || node.key.value;
    } else if (node.parent && node.parent.type === 'VariableDeclarator') {
        name = node.parent.id.name;
    } else {
        name = '(anonymous)';
    }

    // 获取函数参数
    const params = extractParameters(node.params);
    
    // 使用JSDoc中的类型信息增强参数
    params.forEach(param => {
        if (jsDocInfo.params && jsDocInfo.params[param.name]) {
            param.type = jsDocInfo.params[param.name].type;
        }
    });

    return {
        name: name,
        type: node.type, // FunctionDeclaration, ArrowFunctionExpression, ...
        params: params,
        comments: nodeComments,
        location: {
            startLine: node.loc.start.line,
            endLine: node.loc.end.line,
            startColumn: node.loc.start.column,
            endColumn: node.loc.end.column
        },
        returnType: jsDocInfo.returns?.type,
        nestedFunctions: [] // 将在遍历过程中填充
    };
}

/**
 * @function extractClassInfo
 * @description 提取类信息
 * @param {Object} node 类节点
 * @param {Array} comments 所有注释
 * @param {Array} lines 源代码行
 * @returns {ClassInfo} 类信息
 */
function extractClassInfo(node, comments, lines) {
    const nodeComments = extractComments(node, comments, lines);
    
    return {
        name: node.id ? node.id.name : '(anonymous)',
        comments: nodeComments,
        location: {
            startLine: node.loc.start.line,
            endLine: node.loc.end.line,
            startColumn: node.loc.start.column,
            endColumn: node.loc.end.column
        },
        extends: node.superClass ? [node.superClass.name] : [],
        methods: [], // 将在遍历过程中填充
        properties: [] // 将在遍历过程中填充
    };
}

/**
 * @function extractVariableInfo
 * @description 提取变量信息
 * @param {Object} node 变量声明节点
 * @param {Array} comments 所有注释
 * @param {Array} lines 源代码行
 * @returns {VariableInfo[]} 变量信息数组
 */
function extractVariableInfo(node, comments, lines) {
    const nodeComments = extractComments(node, comments, lines);
    const result = [];
    
    node.declarations.forEach(declaration => {
        // 只处理简单标识符，不处理解构等复杂情况
        if (declaration.id.type === 'Identifier') {
            let initialValue = null;
            
            // 尝试获取初始值的字符串表示
            if (declaration.init) {
                if (declaration.init.type === 'Literal') {
                    initialValue = declaration.init.value?.toString();
                } else if (declaration.init.type === 'Identifier') {
                    initialValue = declaration.init.name;
                } else if (declaration.init.type.includes('Function')) {
                    initialValue = '(function)';
                } else if (declaration.init.type === 'ObjectExpression') {
                    initialValue = '{...}';
                } else if (declaration.init.type === 'ArrayExpression') {
                    initialValue = '[...]';
                }
            }
            
            result.push({
                name: declaration.id.name,
                kind: node.kind, // var, let, const
                comments: nodeComments,
                location: {
                    startLine: declaration.loc.start.line,
                    endLine: declaration.loc.end.line,
                    startColumn: declaration.loc.start.column,
                    endColumn: declaration.loc.end.column
                },
                initialValue: initialValue
            });
        }
    });
    
    return result;
}

/**
 * @function extractImportInfo
 * @description 提取导入语句信息
 * @param {Object} node 导入节点
 * @returns {ImportInfo} 导入信息
 */
function extractImportInfo(node) {
    const specifiers = node.specifiers.map(specifier => {
        if (specifier.type === 'ImportDefaultSpecifier') {
            return {
                type: 'default',
                local: specifier.local.name
            };
        } else if (specifier.type === 'ImportNamespaceSpecifier') {
            return {
                type: 'namespace',
                local: specifier.local.name
            };
        } else {
            return {
                type: 'named',
                imported: specifier.imported.name,
                local: specifier.local.name
            };
        }
    });
    
    return {
        source: node.source.value,
        specifiers: specifiers,
        location: {
            startLine: node.loc.start.line,
            endLine: node.loc.end.line,
            startColumn: node.loc.start.column,
            endColumn: node.loc.end.column
        }
    };
}

/**
 * @function extractExportInfo
 * @description 提取导出语句信息
 * @param {Object} node 导出节点
 * @returns {ExportInfo} 导出信息
 */
function extractExportInfo(node) {
    if (node.type === 'ExportDefaultDeclaration') {
        let name = '';
        if (node.declaration.type === 'Identifier') {
            name = node.declaration.name;
        } else if (node.declaration.id) {
            name = node.declaration.id.name;
        }
        
        return {
            type: 'DefaultExport',
            names: [name || '(anonymous)'],
            location: {
                startLine: node.loc.start.line,
                endLine: node.loc.end.line,
                startColumn: node.loc.start.column,
                endColumn: node.loc.end.column
            }
        };
    } else if (node.type === 'ExportNamedDeclaration') {
        let names = [];
        
        if (node.declaration) {
            // export const x = 1;
            if (node.declaration.type === 'VariableDeclaration') {
                names = node.declaration.declarations.map(d => d.id.name);
            } else if (node.declaration.id) {
                // export function x() {}
                names = [node.declaration.id.name];
            }
        } else if (node.specifiers) {
            // export { x, y as z };
            names = node.specifiers.map(s => `${s.local.name}${s.exported.name !== s.local.name ? ' as ' + s.exported.name : ''}`);
        }
        
        return {
            type: 'NamedExport',
            names: names,
            source: node.source?.value, // re-export
            location: {
                startLine: node.loc.start.line,
                endLine: node.loc.end.line,
                startColumn: node.loc.start.column,
                endColumn: node.loc.end.column
            }
        };
    }
    
    return null;
}

/**
 * @function analyzeCode
 * @description 分析代码并提取所有信息
 * @param {string} code 源代码
 * @returns {ExtractedInfo} 提取的代码信息
 */
function analyzeCode(code) {
    const ast = parseCode(code);
    if (!ast) return null;
    
    const lines = code.split('\n');
    const result = {
        functions: [],
        classes: [],
        variables: [],
        exports: [],
        imports: []
    };
    
    // 保存作用域信息以处理嵌套结构
    const scopeStack = [];
    let currentClass = null;
    
    // 实际代码中需引入@babel/traverse
    const traverse = require('@babel/traverse').default;
    
    traverse(ast, {
        // 提取函数声明
        FunctionDeclaration(path) {
            const functionInfo = extractFunctionInfo(path.node, ast.comments, lines);
            
            // 检查是否在类或其他函数内
            if (currentClass) {
                // 类方法在ClassMethod中处理
            } else if (scopeStack.length > 0) {
                scopeStack[scopeStack.length - 1].nestedFunctions.push(functionInfo);
            } else {
                result.functions.push(functionInfo);
            }
            
            // 处理嵌套函数
            scopeStack.push(functionInfo);
            path.traverse({});
            scopeStack.pop();
        },
        
        // 提取箭头函数和函数表达式
        'ArrowFunctionExpression|FunctionExpression': function(path) {
            // 只处理变量声明中的函数
            if (path.parent.type === 'VariableDeclarator') {
                const functionInfo = extractFunctionInfo(path.node, ast.comments, lines);
                functionInfo.name = path.parent.id.name;
                
                if (scopeStack.length > 0) {
                    scopeStack[scopeStack.length - 1].nestedFunctions.push(functionInfo);
                } else {
                    result.functions.push(functionInfo);
                }
                
                // 处理嵌套函数
                scopeStack.push(functionInfo);
                path.traverse({});
                scopeStack.pop();
            }
        },
        
        // 提取类声明
        ClassDeclaration(path) {
            const classInfo = extractClassInfo(path.node, ast.comments, lines);
            result.classes.push(classInfo);
            
            // 设置当前类上下文
            currentClass = classInfo;
            path.traverse({});
            currentClass = null;
        },
        
        // 提取类表达式
        ClassExpression(path) {
            if (path.parent.type === 'VariableDeclarator') {
                const classInfo = extractClassInfo(path.node, ast.comments, lines);
                classInfo.name = path.parent.id.name;
                result.classes.push(classInfo);
                
                // 设置当前类上下文
                currentClass = classInfo;
                path.traverse({});
                currentClass = null;
            }
        },
        
        // 提取类方法
        ClassMethod(path) {
            if (currentClass) {
                const methodInfo = extractFunctionInfo(path.node, ast.comments, lines);
                currentClass.methods.push(methodInfo);
                
                // 处理嵌套函数
                scopeStack.push(methodInfo);
                path.traverse({});
                scopeStack.pop();
            }
        },
        
        // 提取类属性
        ClassProperty(path) {
            if (currentClass && path.node.key) {
                const nodeComments = extractComments(path.node, ast.comments, lines);
                
                currentClass.properties.push({
                    name: path.node.key.name || path.node.key.value,
                    comments: nodeComments,
                    location: {
                        startLine: path.node.loc.start.line,
                        endLine: path.node.loc.end.line,
                        startColumn: path.node.loc.start.column,
                        endColumn: path.node.loc.end.column
                    },
                    initialValue: path.node.value 
                        ? path.node.value.type === 'Literal' 
                            ? path.node.value.value?.toString() 
                            : '...'
                        : null
                });
            }
        },
        
        // 提取变量声明
        VariableDeclaration(path) {
            // 跳过已经处理过的函数和类表达式
            const isSpecialDeclaration = path.node.declarations.some(decl => 
                decl.init && (decl.init.type === 'FunctionExpression' || 
                            decl.init.type === 'ArrowFunctionExpression' ||
                            decl.init.type === 'ClassExpression'));
                            
            if (!isSpecialDeclaration) {
                const variableInfos = extractVariableInfo(path.node, ast.comments, lines);
                
                if (currentClass) {
                    // 类的静态属性在ClassProperty中处理
                } else if (scopeStack.length > 0) {
                    // 添加到当前函数作用域
                    // 此处简化处理，可根据需要添加到合适的作用域
                } else {
                    result.variables.push(...variableInfos);
                }
            }
        },
        
        // 提取导入
        ImportDeclaration(path) {
            const importInfo = extractImportInfo(path.node);
            result.imports.push(importInfo);
        },
        
        // 提取导出
        'ExportDefaultDeclaration|ExportNamedDeclaration': function(path) {
            const exportInfo = extractExportInfo(path.node);
            if (exportInfo) {
                result.exports.push(exportInfo);
            }
        }
    });
    
    return result;
}

/**
 * @function generateMarkdownDoc
 * @description 生成Markdown文档
 * @param {ExtractedInfo} extractedInfo 提取的代码信息
 * @returns {string} Markdown文档
 */
function generateMarkdownDoc(extractedInfo) {
    if (!extractedInfo) return '# 分析失败\n\n代码解析过程中发生错误。';
    
    let markdown = '# 代码分析文档\n\n';
    
    // 添加目录
    markdown += '## 目录\n\n';
    if (extractedInfo.functions.length > 0) markdown += '* [函数](#函数)\n';
    if (extractedInfo.classes.length > 0) markdown += '* [类](#类)\n';
    if (extractedInfo.variables.length > 0) markdown += '* [变量](#变量)\n';
    if (extractedInfo.exports.length > 0) markdown += '* [导出](#导出)\n';
    if (extractedInfo.imports.length > 0) markdown += '* [导入](#导入)\n';
    
    markdown += '\n';
    
    // 生成函数文档
    if (extractedInfo.functions.length > 0) {
        markdown += '## 函数\n\n';
        
        extractedInfo.functions.forEach(func => {
            markdown += `### ${func.name}\n\n`;
            
            const description = func.comments.find(c => c.type === 'JSDoc')?.value || '';
            if (description) {
                markdown += `${description}\n\n`;
            }
            
            markdown += `**类型:** ${getFunctionTypeName(func.type)}\n\n`;
            
            if (func.params.length > 0) {
                markdown += '**参数:**\n\n';
                markdown += '| 名称 | 类型 | 默认值 | 描述 |\n';
                markdown += '|------|------|--------|------|\n';
                
                func.params.forEach(param => {
                    const paramName = param.rest ? `...${param.name}` : param.name;
                    markdown += `| ${paramName} | ${param.type || '-'} | ${param.default || '-'} | - |\n`;
                });
                
                markdown += '\n';
            }
            
            if (func.returnType) {
                markdown += `**返回值:** ${func.returnType}\n\n`;
            }
            
            markdown += `**位置:** 第 ${func.location.startLine}-${func.location.endLine} 行\n\n`;
            
            if (func.nestedFunctions.length > 0) {
                markdown += '**嵌套函数:**\n\n';
                func.nestedFunctions.forEach(nested => {
                    markdown += `* \`${nested.name}(${nested.params.map(p => p.name).join(', ')})\` - 第 ${nested.location.startLine} 行\n`;
                });
                markdown += '\n';
            }
            
            markdown += '---\n\n';
        });
    }
    
    // 生成类文档
    if (extractedInfo.classes.length > 0) {
        markdown += '## 类\n\n';
        
        extractedInfo.classes.forEach(cls => {
            markdown += `### ${cls.name}\n\n`;
            
            const description = cls.comments.find(c => c.type === 'JSDoc')?.value || '';
            if (description) {
                markdown += `${description}\n\n`;
            }
            
            if (cls.extends.length > 0) {
                markdown += `**继承:** ${cls.extends.join(', ')}\n\n`;
            }
            
            markdown += `**位置:** 第 ${cls.location.startLine}-${cls.location.endLine} 行\n\n`;
            
            if (cls.properties.length > 0) {
                markdown += '**属性:**\n\n';
                markdown += '| 名称 | 初始值 | 描述 |\n';
                markdown += '|------|--------|------|\n';
                
                cls.properties.forEach(prop => {
                    const propDesc = prop.comments.find(c => c.type === 'JSDoc')?.value || '';
                    markdown += `| ${prop.name} | ${prop.initialValue || '-'} | ${propDesc} |\n`;
                });
                
                markdown += '\n';
            }
            
            if (cls.methods.length > 0) {
                markdown += '**方法:**\n\n';
                cls.methods.forEach(method => {
                    const methodDesc = method.comments.find(c => c.type === 'JSDoc')?.value || '';
                    markdown += `* \`${method.name}(${method.params.map(p => p.name).join(', ')})\` - ${methodDesc || '无描述'}\n`;
                });
                markdown += '\n';
            }
            
            markdown += '---\n\n';
        });
    }
    
    // 生成变量文档
    if (extractedInfo.variables.length > 0) {
        markdown += '## 变量\n\n';
        
        markdown += '| 名称 | 类型 | 初始值 | 描述 |\n';
        markdown += '|------|------|--------|------|\n';
        
        extractedInfo.variables.forEach(variable => {
            const varDesc = variable.comments.find(c => c.type === 'JSDoc')?.value || '';
            markdown += `| ${variable.name} | ${variable.kind} | ${variable.initialValue || '-'} | ${varDesc} |\n`;
        });
        
        markdown += '\n';
    }
    
    // 生成导出文档
    if (extractedInfo.exports.length > 0) {
        markdown += '## 导出\n\n';
        
        extractedInfo.exports.forEach(exp => {
            if (exp.type === 'DefaultExport') {
                markdown += `* 默认导出: \`${exp.names[0]}\`\n`;
            } else {
                markdown += `* 命名导出: \`${exp.names.join('`, `')}\`\n`;
            }
        });
        
        markdown += '\n';
    }
    
    // 生成导入文档
    if (extractedInfo.imports.length > 0) {
        markdown += '## 导入\n\n';
        
        extractedInfo.imports.forEach(imp => {
            const specifiersText = imp.specifiers.map(spec => {
                if (spec.type === 'default') {
                    return spec.local;
                } else if (spec.type === 'namespace') {
                    return `* as ${spec.local}`;
                } else {
                    return spec.imported !== spec.local ? `${spec.imported} as ${spec.local}` : spec.imported;
                }
            }).join(', ');
            
            markdown += `* \`import ${specifiersText} from '${imp.source}'\`\n`;
        });
        
        markdown += '\n';
    }
    
    return markdown;
}

/**
 * @function getFunctionTypeName
 * @description 获取函数类型的中文名称
 * @param {string} type 函数类型
 * @returns {string} 中文名称
 */
function getFunctionTypeName(type) {
    const typeMap = {
        'FunctionDeclaration': '函数声明',
        'FunctionExpression': '函数表达式',
        'ArrowFunctionExpression': '箭头函数',
        'ClassMethod': '类方法'
    };
    
    return typeMap[type] || type;
}

/**
 * @function extractFromFile
 * @description 从文件中提取代码信息并生成文档
 * @param {string} filePath 文件路径
 * @returns {Object} 结果对象，包含提取的信息和生成的文档
 */
function extractFromFile(filePath) {
    const fs = require('fs');
    
    try {
        const code = fs.readFileSync(filePath, 'utf8');
        const extractedInfo = analyzeCode(code);
        const markdown = generateMarkdownDoc(extractedInfo);
        
        return {
            success: true,
            extractedInfo,
            markdown
        };
    } catch (error) {
        console.error('从文件提取信息时出错:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * @function extractFromCode
 * @description 从代码字符串中提取信息并生成文档
 * @param {string} code 源代码
 * @returns {Object} 结果对象，包含提取的信息和生成的文档
 */
function extractFromCode(code) {
    try {
        const extractedInfo = analyzeCode(code);
        const markdown = generateMarkdownDoc(extractedInfo);
        
        return {
            success: true,
            extractedInfo,
            markdown
        };
    } catch (error) {
        console.error('从代码提取信息时出错:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// 导出功能
module.exports = {
    analyzeCode,
    generateMarkdownDoc,
    extractFromFile,
    extractFromCode
}; 