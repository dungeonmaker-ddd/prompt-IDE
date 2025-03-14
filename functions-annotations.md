# 函数列表
## updateDebugPanel
- **类型**: 函数声明
- **参数**: ``
- **位置**: 第 523 行至第 580 行
### 函数说明
```
@function updateDebugPanel
@description 更新调试面板的内容，显示原始数据结构
```
### 内部注释
#### 注释 1 (第 528 行)
```
// 转换 Map 和 Set 为对象和数组以便更好地展示
// openedDirectories Map
```
**相关代码** (第 530 行):
```javascript
const openedDirsObj = {};
```
#### 注释 2 (第 541 行)
```
// directoryRelationships Map
```
**相关代码** (第 542 行):
```javascript
const relationshipsObj = {};
```
#### 注释 3 (第 549 行)
```
// rootDirectories Set
```
**相关代码** (第 550 行):
```javascript
rootDirectoriesDebug.textContent = JSON.stringify([...rootDirectories], null, 2);
```
#### 注释 4 (第 553 行)
```
// selectedItemsPerCard Map
```
**相关代码** (第 554 行):
```javascript
const selectedItemsObj = {};
```
#### 注释 5 (第 565 行)
```
// dirHandleMap
```
**相关代码** (第 566 行):
```javascript
const dirHandleObj = {};
```
#### 注释 6 (第 573 行)
```
// 全局变量
```
**相关代码** (第 574 行):
```javascript
const globalVars = {
```
---
## getExistingCardId
- **类型**: 函数声明
- **参数**: `dirHandle`
- **位置**: 第 582 行至第 585 行
### 函数说明
```
@function isDirectoryAlreadyOpen
@description 检查目录是否已经打开
@param {FileSystemDirectoryHandle} dirHandle 目录句柄
@returns {boolean} 目录是否已经打开
/
    async function isDirectoryAlreadyOpen(dirHandle) {
      // 尝试获取唯一标识符
      try {
        // 使用目录名称作为简单的标识符
        // 在实际应用中可能需要更复杂的逻辑来确定唯一性
        const path = dirHandle.name;
        return dirHandleMap.has(path);
      } catch (error) {
        console.error('检查目录是否已打开时出错', error);
        return false;
      }
    }
    /**
@function getExistingCardId
@description 获取已打开目录的卡片ID
@param {FileSystemDirectoryHandle} dirHandle 目录句柄
@returns {string|null} 卡片ID，如果未打开则返回null
```
---
## isDirectoryAlreadyOpen
- **类型**: 函数声明
- **参数**: `dirHandle`
- **位置**: 第 588 行至第 599 行
### 内部注释
#### 注释 1 (第 589 行)
```
// 尝试获取唯一标识符
```
**相关代码** (第 590 行):
```javascript
try {
```
#### 注释 2 (第 591 行)
```
// 使用目录名称作为简单的标识符
// 在实际应用中可能需要更复杂的逻辑来确定唯一性
```
**相关代码** (第 593 行):
```javascript
const path = dirHandle.name;
```
---
## createRootContainer
- **类型**: 函数声明
- **参数**: ``
- **位置**: 第 612 行至第 615 行
### 函数说明
```
@function createRootContainer
@description 创建根目录容器
@returns {string} 容器ID
```
---
## createDirectoryCard
- **类型**: 函数声明
- **参数**: `directoryName, dirHandle, parentCardId = null, containerID = null`
- **位置**: 第 629 行至第 632 行
### 函数说明
```
@function createDirectoryCard
@description 创建目录卡片
@param {string} directoryName 目录名称
@param {FileSystemDirectoryHandle} dirHandle 目录句柄
@param {string|null} parentCardId 父卡片ID
@param {string|null} containerID 容器ID
@returns {HTMLElement} 创建的卡片元素
```
---
## findRootContainer
- **类型**: 函数声明
- **参数**: `cardId`
- **位置**: 第 786 行至第 789 行
### 函数说明
```
@function findRootContainer
@description 查找卡片所属的根容器
@param {string} cardId 卡片ID
@returns {string} 根容器ID
```
---
## closeCard
- **类型**: 函数声明
- **参数**: `cardId`
- **位置**: 第 800 行至第 803 行
### 函数说明
```
@function closeCard
@description 关闭卡片及其所有子卡片
@param {string} cardId 要关闭的卡片ID
```
---
## clearAllCards
- **类型**: 函数声明
- **参数**: ``
- **位置**: 第 855 行至第 887 行
### 函数说明
```
@function clearAllCards
@description 清空所有卡片
```
### 内部注释
#### 注释 1 (第 860 行)
```
// 复制根目录ID集合，因为在循环中会修改集合
```
**相关代码** (第 861 行):
```javascript
const rootIds = [...rootDirectories];
```
#### 注释 2 (第 863 行)
```
// 关闭所有根目录卡片
```
**相关代码** (第 864 行):
```javascript
rootIds.forEach(cardId => closeCard(cardId));
```
#### 注释 3 (第 866 行)
```
// 重置状态
```
**相关代码** (第 867 行):
```javascript
openedDirectories.clear();
```
#### 注释 4 (第 873 行)
```
// 清空编辑器
```
**相关代码** (第 874 行):
```javascript
fileContentEditor.value = '';
```
#### 注释 5 (第 879 行)
```
// 移除编辑器标签
```
**相关代码** (第 880 行):
```javascript
const existingLabel = document.querySelector('.editor-label');
```
#### 注释 6 (第 885 行)
```
// 更新调试面板
```
**相关代码** (第 886 行):
```javascript
updateDebugPanel();
```
---
## selectItem
- **类型**: 函数声明
- **参数**: `cardId, itemType, itemName`
- **位置**: 第 889 行至第 892 行
### 函数说明
```
@function selectItem
@description 选中项目并添加到右侧面板
@param {string} cardId 卡片ID
@param {string} itemType 项目类型 ('file' 或 'directory')
@param {string} itemName 项目名称
```
---
## removeSelectedItem
- **类型**: 函数声明
- **参数**: `cardId, itemId`
- **位置**: 第 921 行至第 924 行
### 函数说明
```
@function removeSelectedItem
@description 从选中项中移除
@param {string} cardId 卡片ID
@param {string} itemId 项目ID
```
---
## updateSelectedItemsPanel
- **类型**: 函数声明
- **参数**: `cardId`
- **位置**: 第 942 行至第 945 行
### 函数说明
```
@function updateSelectedItemsPanel
@description 更新卡片右侧的已选中项面板
@param {string} cardId 卡片ID
```
---
## showStatusMessage
- **类型**: 函数声明
- **参数**: `message, isError = false`
- **位置**: 第 998 行至第 1001 行
### 函数说明
```
@function fillCardWithDirectoryContents
@description 填充卡片内容区域
@param {HTMLElement} contentLeft 左侧内容元素
@param {HTMLElement} cardInfo 卡片信息元素
@param {FileSystemDirectoryHandle} dirHandle 目录句柄
@param {string} cardId 卡片ID
@async
/
    async function fillCardWithDirectoryContents(contentLeft, cardInfo, dirHandle, cardId) {
      try {
        // 清空卡片内容
        contentLeft.innerHTML = '';
        let fileCount = 0;
        let dirCount = 0;
        // 遍历目录内容
        for await (const entry of dirHandle.values()) {
          const entryElement = document.createElement('div');
          if (entry.kind === 'directory') {
            dirCount++;
            entryElement.className = 'directory-item';
            entryElement.innerHTML = `<span class="item-icon">📁</span> ${entry.name}`;
            // 添加点击事件（左键）
            entryElement.addEventListener('click', () => handleDirectoryClick(entry, cardId));
            // 添加右键事件
            entryElement.addEventListener('contextmenu', (event) => {
              event.preventDefault(); // 阻止默认右键菜单
              selectItem(cardId, 'directory', entry.name);
            });
          } else {
            fileCount++;
            entryElement.className = 'file-item';
            entryElement.innerHTML = `<span class="item-icon">📄</span> ${entry.name}`;
            // 添加点击事件（左键）
            entryElement.addEventListener('click', () => handleFileReadAsText(entry));
            // 添加右键事件
            entryElement.addEventListener('contextmenu', (event) => {
              event.preventDefault(); // 阻止默认右键菜单
              selectItem(cardId, 'file', entry.name);
            });
          }
          contentLeft.appendChild(entryElement);
        }
        // 更新卡片信息
        cardInfo.textContent = `${dirCount} 个目录, ${fileCount} 个文件`;
      } catch (error) {
        contentLeft.innerHTML = `<div class="error">加载失败: ${error.message}</div>`;
        cardInfo.textContent = '加载失败';
        console.error('[DEBUG] 目录内容加载失败', error);
      }
    }
    /**
@function handleDirectorySelectionAndDisplay
@description 处理用户选择目录并展示其内容
@async
/
    async function handleDirectorySelectionAndDisplay() {
      try {
        // 请求读写权限以支持编辑操作
        const dirHandle = await window.showDirectoryPicker({
          mode: 'readwrite' // 需要读写权限
        });
        // 检查目录是否已经打开
        if (await isDirectoryAlreadyOpen(dirHandle)) {
          const existingCardId = getExistingCardId(dirHandle);
          if (existingCardId) {
            const card = document.getElementById(existingCardId);
            if (card) {
              // 已打开目录，滚动到该卡片
              card.scrollIntoView({ behavior: 'smooth' });
              showStatusMessage(`目录 ${dirHandle.name} 已经打开`);
              return;
            }
          }
        }
        // 创建新的根容器
        const containerId = createRootContainer();
        // 创建根目录卡片
        const rootCard = createDirectoryCard(dirHandle.name, dirHandle, null, containerId);
        // 显示状态消息
        showStatusMessage(`成功添加目录: ${dirHandle.name}`);
      } catch (error) {
        console.error('[DEBUG] 目录选择失败', error);
        showStatusMessage(`选择目录失败: ${error.message}`, true);
      }
    }
    /**
@function showStatusMessage
@description 显示状态消息
@param {string} message 消息内容
@param {boolean} isError 是否为错误消息
```
---
## fillCardWithDirectoryContents
- **类型**: 函数声明
- **参数**: `contentLeft, cardInfo, dirHandle, cardId`
- **位置**: 第 1007 行至第 1057 行
### 内部注释
#### 注释 1 (第 1009 行)
```
// 清空卡片内容
```
**相关代码** (第 1010 行):
```javascript
contentLeft.innerHTML = '';
```
#### 注释 2 (第 1015 行)
```
// 遍历目录内容
```
**相关代码** (第 1016 行):
```javascript
for await (const entry of dirHandle.values()) {
```
#### 注释 3 (第 1024 行)
```
// 添加点击事件（左键）
```
**相关代码** (第 1025 行):
```javascript
entryElement.addEventListener('click', () => handleDirectoryClick(entry, cardId));
```
#### 注释 4 (第 1027 行)
```
// 添加右键事件
```
**相关代码** (第 1028 行):
```javascript
entryElement.addEventListener('contextmenu', (event) => {
```
#### 注释 5 (第 1037 行)
```
// 添加点击事件（左键）
```
**相关代码** (第 1038 行):
```javascript
entryElement.addEventListener('click', () => handleFileReadAsText(entry));
```
#### 注释 6 (第 1040 行)
```
// 添加右键事件
```
**相关代码** (第 1041 行):
```javascript
entryElement.addEventListener('contextmenu', (event) => {
```
#### 注释 7 (第 1050 行)
```
// 更新卡片信息
```
**相关代码** (第 1051 行):
```javascript
cardInfo.textContent = `${dirCount} 个目录, ${fileCount} 个文件`;
```
---
## handleDirectorySelectionAndDisplay
- **类型**: 函数声明
- **参数**: ``
- **位置**: 第 1064 行至第 1097 行
### 内部注释
#### 注释 1 (第 1066 行)
```
// 请求读写权限以支持编辑操作
```
**相关代码** (第 1067 行):
```javascript
const dirHandle = await window.showDirectoryPicker({
```
#### 注释 2 (第 1071 行)
```
// 检查目录是否已经打开
```
**相关代码** (第 1072 行):
```javascript
if (await isDirectoryAlreadyOpen(dirHandle)) {
```
#### 注释 3 (第 1077 行)
```
// 已打开目录，滚动到该卡片
```
**相关代码** (第 1078 行):
```javascript
card.scrollIntoView({ behavior: 'smooth' });
```
#### 注释 4 (第 1085 行)
```
// 创建新的根容器
```
**相关代码** (第 1086 行):
```javascript
const containerId = createRootContainer();
```
#### 注释 5 (第 1088 行)
```
// 创建根目录卡片
```
**相关代码** (第 1089 行):
```javascript
const rootCard = createDirectoryCard(dirHandle.name, dirHandle, null, containerId);
```
#### 注释 6 (第 1091 行)
```
// 显示状态消息
```
**相关代码** (第 1092 行):
```javascript
showStatusMessage(`成功添加目录: ${dirHandle.name}`);
```
---
## createConnectorLines
- **类型**: 函数声明
- **参数**: `parentCard, childCard`
- **位置**: 第 1126 行至第 1129 行
### 函数说明
```
@function createConnectorLines
@description 创建连接父卡片和子卡片的连接线
@param {HTMLElement} parentCard 父卡片元素
@param {HTMLElement} childCard 子卡片元素
```
---
## toggleCardCollapse
- **类型**: 函数声明
- **参数**: `card`
- **位置**: 第 1194 行至第 1197 行
### 函数说明
```
@function handleDirectoryClick
@description 处理目录点击，打开子目录
@param {FileSystemDirectoryHandle} dirHandle 目录句柄
@param {string} parentCardId 父卡片ID
@async
/
    async function handleDirectoryClick(dirHandle, parentCardId) {
      try {
        // 检查目录是否已经打开
        if (await isDirectoryAlreadyOpen(dirHandle)) {
          const existingCardId = getExistingCardId(dirHandle);
          if (existingCardId) {
            const card = document.getElementById(existingCardId);
            if (card) {
              // 已打开目录，滚动到该卡片
              card.scrollIntoView({ behavior: 'smooth' });
              showStatusMessage(`目录 ${dirHandle.name} 已经打开`);
              return;
            }
          }
        }
        // 获取父卡片和容器
        const parentCard = document.getElementById(parentCardId);
        if (!parentCard) {
          throw new Error('找不到父卡片');
        }
        const containerID = findRootContainer(parentCardId);
        // 创建新的目录卡片
        const directoryCard = createDirectoryCard(dirHandle.name, dirHandle, parentCardId, containerID);
        // 创建连接线
        setTimeout(() => {
          createConnectorLines(parentCard, directoryCard);
        }, 10);
        // 滚动到新卡片位置
        directoryCard.scrollIntoView({ behavior: 'smooth' });
      } catch (error) {
        console.error('[DEBUG] 打开子目录失败', error);
        showStatusMessage(`打开目录失败: ${error.message}`, true);
      }
    }
    /**
@function handleFileReadAsText
@description 将文件作为文本读取并显示
@param {FileSystemFileHandle} fileHandle 文件句柄
@async
/
    async function handleFileReadAsText(fileHandle) {
      try {
        const file = await fileHandle.getFile();
        const textContent = await file.text();
        fileContentEditor.value = textContent;
        fileContentEditor.disabled = false;
        saveChangesButton.disabled = false;
        currentFileHandle = fileHandle;
        // 添加当前正在编辑的文件信息
        const editorLabel = document.createElement('div');
        editorLabel.textContent = `正在编辑: ${fileHandle.name}`;
        // 如果已经有标签，则替换它
        const existingLabel = document.querySelector('.editor-label');
        if (existingLabel) {
          existingLabel.remove();
        }
        editorLabel.className = 'editor-label';
        document.querySelector('.editor-container').insertBefore(editorLabel, fileContentEditor);
        // 滚动到编辑器位置
        fileContentEditor.scrollIntoView({ behavior: 'smooth' });
        // 显示状态消息
        showStatusMessage(`已加载文件: ${fileHandle.name}`);
        // 更新调试面板
        updateDebugPanel();
      } catch (error) {
        console.error('[DEBUG] 文件读取失败', error);
        showStatusMessage(`读取文件失败: ${error.message}`, true);
      }
    }
    /**
@function toggleCardCollapse
@description 切换卡片的收起/展开状态
@param {HTMLElement} card 要切换的卡片元素
```
---
## handleDirectoryClick
- **类型**: 函数声明
- **参数**: `dirHandle, parentCardId`
- **位置**: 第 1201 行至第 1239 行
### 内部注释
#### 注释 1 (第 1203 行)
```
// 检查目录是否已经打开
```
**相关代码** (第 1204 行):
```javascript
if (await isDirectoryAlreadyOpen(dirHandle)) {
```
#### 注释 2 (第 1209 行)
```
// 已打开目录，滚动到该卡片
```
**相关代码** (第 1210 行):
```javascript
card.scrollIntoView({ behavior: 'smooth' });
```
#### 注释 3 (第 1217 行)
```
// 获取父卡片和容器
```
**相关代码** (第 1218 行):
```javascript
const parentCard = document.getElementById(parentCardId);
```
#### 注释 4 (第 1225 行)
```
// 创建新的目录卡片
```
**相关代码** (第 1226 行):
```javascript
const directoryCard = createDirectoryCard(dirHandle.name, dirHandle, parentCardId, containerID);
```
#### 注释 5 (第 1228 行)
```
// 创建连接线
```
**相关代码** (第 1229 行):
```javascript
setTimeout(() => {
```
#### 注释 6 (第 1233 行)
```
// 滚动到新卡片位置
```
**相关代码** (第 1234 行):
```javascript
directoryCard.scrollIntoView({ behavior: 'smooth' });
```
---
## handleFileReadAsText
- **类型**: 函数声明
- **参数**: `fileHandle`
- **位置**: 第 1247 行至第 1282 行
### 内部注释
#### 注释 1 (第 1257 行)
```
// 添加当前正在编辑的文件信息
```
**相关代码** (第 1258 行):
```javascript
const editorLabel = document.createElement('div');
```
#### 注释 2 (第 1261 行)
```
// 如果已经有标签，则替换它
```
**相关代码** (第 1262 行):
```javascript
const existingLabel = document.querySelector('.editor-label');
```
#### 注释 3 (第 1270 行)
```
// 滚动到编辑器位置
```
**相关代码** (第 1271 行):
```javascript
fileContentEditor.scrollIntoView({ behavior: 'smooth' });
```
#### 注释 4 (第 1273 行)
```
// 显示状态消息
```
**相关代码** (第 1274 行):
```javascript
showStatusMessage(`已加载文件: ${fileHandle.name}`);
```
#### 注释 5 (第 1276 行)
```
// 更新调试面板
```
**相关代码** (第 1277 行):
```javascript
updateDebugPanel();
```
---
## updateConnectors
- **类型**: 函数声明
- **参数**: ``
- **位置**: 第 1350 行至第 1367 行
### 函数说明
```
@function updateConnectors
@description 更新所有连接线位置
```
### 内部注释
#### 注释 1 (第 1355 行)
```
// 移除所有连接线
```
**相关代码** (第 1356 行):
```javascript
const connectors = document.querySelectorAll('.card-connector, .connector-node');
```
#### 注释 2 (第 1359 行)
```
// 重新绘制所有连接线
```
**相关代码** (第 1360 行):
```javascript
directoryRelationships.forEach((parentId, childId) => {
```
---
## handleSaveFileChanges
- **类型**: 函数声明
- **参数**: ``
- **位置**: 第 1374 行至第 1390 行
---
## addCollapseAllButton
- **类型**: 函数声明
- **参数**: ``
- **位置**: 第 1396 行至第 1435 行
### 内部注释
#### 注释 1 (第 1401 行)
```
// 智能切换所有卡片状态
```
**相关代码** (第 1402 行):
```javascript
function toggleAllCards() {
```
#### 注释 2 (第 1406 行)
```
// 检查是否有任何卡片处于展开状态
```
**相关代码** (第 1407 行):
```javascript
allCards.forEach(card => {
```
#### 注释 3 (第 1413 行)
```
// 如果有任何卡片展开，则收起所有卡片
```
**相关代码** (第 1414 行):
```javascript
if (anyExpanded) {
```
#### 注释 4 (第 1422 行)
```
// 如果所有卡片都已收起，则展开所有卡片
```
**相关代码** (第 1423 行):
```javascript
else {
```
#### 注释 5 (第 1433 行)
```
// 添加到控制区域
```
**相关代码** (第 1434 行):
```javascript
document.querySelector('.controls').appendChild(collapseAllButton);
```
---
## toggleAllCards
- **类型**: 嵌套函数 (嵌套在 addCollapseAllButton 内)
- **参数**: ``
- **位置**: 第 1402 行至第 1431 行
### 内部注释
#### 注释 1 (第 1406 行)
```
// 检查是否有任何卡片处于展开状态
```
**相关代码** (第 1407 行):
```javascript
allCards.forEach(card => {
```
#### 注释 2 (第 1413 行)
```
// 如果有任何卡片展开，则收起所有卡片
```
**相关代码** (第 1414 行):
```javascript
if (anyExpanded) {
```
#### 注释 3 (第 1422 行)
```
// 如果所有卡片都已收起，则展开所有卡片
```
**相关代码** (第 1423 行):
```javascript
else {
```
---
## toggleAllCards
- **类型**: 函数声明
- **参数**: ``
- **位置**: 第 1402 行至第 1431 行
### 内部注释
#### 注释 1 (第 1406 行)
```
// 检查是否有任何卡片处于展开状态
```
**相关代码** (第 1407 行):
```javascript
allCards.forEach(card => {
```
#### 注释 2 (第 1413 行)
```
// 如果有任何卡片展开，则收起所有卡片
```
**相关代码** (第 1414 行):
```javascript
if (anyExpanded) {
```
#### 注释 3 (第 1422 行)
```
// 如果所有卡片都已收起，则展开所有卡片
```
**相关代码** (第 1423 行):
```javascript
else {
```
---
# CSS 规则
## body
- **位置**: 第 7 行至第 15 行
### 属性
```css
font-family: Arial, sans-serif;
      padding: 0;
      margin: 0;
      background-color: #f5f5f5;
      display: flex;
      min-height: 100vh;
```
### 说明
```
基本样式
```
---
## .debug-panel
- **位置**: 第 17 行至第 28 行
### 属性
```css
width: 280px;
      background-color: #263238;
      color: #fff;
      padding: 15px;
      box-sizing: border-box;
      overflow-y: auto;
      height: 100vh;
      position: sticky;
      top: 0;
```
### 说明
```
左侧调试面板
```
---
## .main-content
- **位置**: 第 77 行至第 84 行
### 属性
```css
flex-grow: 1;
      padding: 20px;
      box-sizing: border-box;
      overflow-y: auto;
      height: 100vh;
```
### 说明
```
主内容区域
```
---
## .controls
- **位置**: 第 86 行至第 92 行
### 属性
```css
margin-bottom: 20px;
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
```
### 说明
```
控制区域
```
---
## .board-container
- **位置**: 第 112 行至第 124 行
### 属性
```css
position: relative;
      display: flex;
      flex-wrap: wrap;
      gap: 30px;
      margin-bottom: 20px;
      padding: 20px;
      background-color: #f0f0f0;
      border-radius: 10px;
      border: 1px solid #ddd;
      min-height: 400px;
```
### 说明
```
布局容器 - 电路板风格
```
---
## .root-directory-container
- **位置**: 第 126 行至第 132 行
### 属性
```css
display: flex;
      flex-direction: column;
      gap: 20px;
      position: relative;
```
### 说明
```
根目录区域
```
---
## .directory-card
- **位置**: 第 134 行至第 146 行
### 属性
```css
position: relative;
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
      width: 600px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      background-color: white;
      margin-left: 30px;
      z-index: 2;
      transition: box-shadow 0.3s, border-radius 0.3s;
```
### 说明
```
目录卡片样式
```
---
## .card-content
- **位置**: 第 148 行至第 152 行
### 属性
```css
transition: height 0.3s ease-out, opacity 0.3s ease-out;
      overflow: hidden;
```
### 说明
```
卡片内容区域平滑过渡效果
```
---
## .directory-card.card-collapsed .card-content
- **位置**: 第 154 行至第 161 行
### 属性
```css
height: 0 !important;
      opacity: 0;
      padding: 0;
      margin: 0;
      border: none;
```
### 说明
```
收起状态的卡片内容样式
```
---
## .directory-card.card-collapsed .card-header
- **位置**: 第 163 行至第 166 行
### 属性
```css
border-bottom: none;
```
### 说明
```
收起状态下标题栏底部边框隐藏
```
---
## .directory-card.card-collapsed
- **位置**: 第 168 行至第 173 行
### 属性
```css
border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
```
### 说明
```
收起状态的卡片样式
```
---
## .directory-card.root
- **位置**: 第 175 行至第 178 行
### 属性
```css
margin-left: 0;
```
### 说明
```
根目录卡片
```
---
## .card-connector
- **位置**: 第 180 行至第 185 行
### 属性
```css
position: absolute;
      border: 2px solid #4285f4;
      z-index: 1;
```
### 说明
```
卡片连接线
```
---
## .connector-node
- **位置**: 第 197 行至第 205 行
### 属性
```css
position: absolute;
      width: 8px;
      height: 8px;
      background-color: #4285f4;
      border-radius: 50%;
      z-index: 1;
```
### 说明
```
卡片节点点
```
---
## .card-actions
- **位置**: 第 237 行至第 241 行
### 属性
```css
display: flex;
      gap: 5px;
```
### 说明
```
卡片操作按钮
```
---
## .card-content
- **位置**: 第 263 行至第 267 行
### 属性
```css
display: flex;
      height: 300px;
```
### 说明
```
分栏布局
```
---
## .file-item, .directory-item
- **位置**: 第 289 行至第 296 行
### 属性
```css
padding: 10px;
      border-bottom: 1px solid #eee;
      cursor: pointer;
      display: flex;
      align-items: center;
```
### 说明
```
文件项样式
```
---
## .selected-item
- **位置**: 第 311 行至第 319 行
### 属性
```css
padding: 10px;
      border-bottom: 1px solid #e0e0e0;
      background-color: #E8F5E9;
      display: flex;
      justify-content: space-between;
      align-items: center;
```
### 说明
```
选中项样式
```
---
## .editor-container
- **位置**: 第 353 行至第 360 行
### 属性
```css
margin-top: 20px;
      background-color: white;
      border-radius: 8px;
      padding: 15px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
```
### 说明
```
文件编辑区域
```
---
## .status-message
- **位置**: 第 378 行至第 385 行
### 属性
```css
padding: 10px;
      margin: 10px 0;
      border-radius: 4px;
      background-color: #e3f2fd;
      color: #0d47a1;
```
### 说明
```
状态消息
```
---
## .context-menu
- **位置**: 第 387 行至第 396 行
### 属性
```css
position: absolute;
      background-color: white;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      padding: 5px 0;
      z-index: 1000;
```
### 说明
```
右键菜单
```
---
## @media (max-width: 1200px)
- **位置**: 第 407 行至第 411 行
### 属性
```css
body {
        flex-direction: column;
```
### 说明
```
响应式设计
```
---
## /* 基本样式 */
    body
- **位置**: 第 6 行至第 15 行
### 属性
```css
font-family: Arial, sans-serif;
      padding: 0;
      margin: 0;
      background-color: #f5f5f5;
      display: flex;
      min-height: 100vh;
```
---
## /* 左侧调试面板 */
    .debug-panel
- **位置**: 第 15 行至第 28 行
### 属性
```css
width: 280px;
      background-color: #263238;
      color: #fff;
      padding: 15px;
      box-sizing: border-box;
      overflow-y: auto;
      height: 100vh;
      position: sticky;
      top: 0;
```
---
## .debug-panel h2
- **位置**: 第 28 行至第 35 行
### 属性
```css
font-size: 18px;
      margin-top: 0;
      padding-bottom: 10px;
      border-bottom: 1px solid #455A64;
```
---
## .debug-section
- **位置**: 第 35 行至第 39 行
### 属性
```css
margin-bottom: 20px;
```
---
## .debug-section h3
- **位置**: 第 39 行至第 49 行
### 属性
```css
font-size: 14px;
      color: #81D4FA;
      margin-top: 0;
      margin-bottom: 5px;
      display: flex;
      justify-content: space-between;
      align-items: center;
```
---
## .debug-content
- **位置**: 第 49 行至第 62 行
### 属性
```css
font-family: monospace;
      font-size: 12px;
      white-space: pre-wrap;
      word-break: break-all;
      background-color: #1E272C;
      padding: 10px;
      border-radius: 4px;
      max-height: 200px;
      overflow-y: auto;
      color: #A5D6A7;
```
---
## .debug-content.json
- **位置**: 第 62 行至第 66 行
### 属性
```css
color: #FFD54F;
```
---
## .debug-count
- **位置**: 第 66 行至第 75 行
### 属性
```css
background-color: #455A64;
      color: white;
      border-radius: 10px;
      padding: 2px 6px;
      font-size: 11px;
      margin-left: 5px;
```
---
## /* 主内容区域 */
    .main-content
- **位置**: 第 75 行至第 84 行
### 属性
```css
flex-grow: 1;
      padding: 20px;
      box-sizing: border-box;
      overflow-y: auto;
      height: 100vh;
```
---
## /* 控制区域 */
    .controls
- **位置**: 第 84 行至第 92 行
### 属性
```css
margin-bottom: 20px;
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
```
---
## button
- **位置**: 第 92 行至第 101 行
### 属性
```css
padding: 8px 16px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
```
---
## button.danger
- **位置**: 第 101 行至第 105 行
### 属性
```css
background-color: #f44336;
```
---
## button:disabled
- **位置**: 第 105 行至第 110 行
### 属性
```css
background-color: #cccccc;
      cursor: not-allowed;
```
---
## /* 布局容器 - 电路板风格 */
    .board-container
- **位置**: 第 110 行至第 124 行
### 属性
```css
position: relative;
      display: flex;
      flex-wrap: wrap;
      gap: 30px;
      margin-bottom: 20px;
      padding: 20px;
      background-color: #f0f0f0;
      border-radius: 10px;
      border: 1px solid #ddd;
      min-height: 400px;
```
---
## /* 根目录区域 */
    .root-directory-container
- **位置**: 第 124 行至第 132 行
### 属性
```css
display: flex;
      flex-direction: column;
      gap: 20px;
      position: relative;
```
---
## /* 目录卡片样式 */
    .directory-card
- **位置**: 第 132 行至第 146 行
### 属性
```css
position: relative;
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
      width: 600px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      background-color: white;
      margin-left: 30px;
      z-index: 2;
      transition: box-shadow 0.3s, border-radius 0.3s;
```
---
## /* 卡片内容区域平滑过渡效果 */
    .card-content
- **位置**: 第 146 行至第 152 行
### 属性
```css
transition: height 0.3s ease-out, opacity 0.3s ease-out;
      overflow: hidden;
```
---
## /* 收起状态的卡片内容样式 */
    .directory-card.card-collapsed .card-content
- **位置**: 第 152 行至第 161 行
### 属性
```css
height: 0 !important;
      opacity: 0;
      padding: 0;
      margin: 0;
      border: none;
```
---
## /* 收起状态下标题栏底部边框隐藏 */
    .directory-card.card-collapsed .card-header
- **位置**: 第 161 行至第 166 行
### 属性
```css
border-bottom: none;
```
---
## /* 收起状态的卡片样式 */
    .directory-card.card-collapsed
- **位置**: 第 166 行至第 173 行
### 属性
```css
border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
```
---
## /* 根目录卡片 */
    .directory-card.root
- **位置**: 第 173 行至第 178 行
### 属性
```css
margin-left: 0;
```
---
## /* 卡片连接线 */
    .card-connector
- **位置**: 第 178 行至第 185 行
### 属性
```css
position: absolute;
      border: 2px solid #4285f4;
      z-index: 1;
```
---
## .connector-horizontal
- **位置**: 第 185 行至第 190 行
### 属性
```css
height: 2px;
      background-color: #4285f4;
```
---
## .connector-vertical
- **位置**: 第 190 行至第 195 行
### 属性
```css
width: 2px;
      background-color: #4285f4;
```
---
## /* 卡片节点点 */
    .connector-node
- **位置**: 第 195 行至第 205 行
### 属性
```css
position: absolute;
      width: 8px;
      height: 8px;
      background-color: #4285f4;
      border-radius: 50%;
      z-index: 1;
```
---
## .card-header
- **位置**: 第 205 行至第 215 行
### 属性
```css
background-color: #4285f4;
      padding: 12px;
      border-bottom: 1px solid #ddd;
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
```
---
## .root .card-header
- **位置**: 第 215 行至第 219 行
### 属性
```css
background-color: #FF5722;
```
---
## .card-title-section
- **位置**: 第 219 行至第 223 行
### 属性
```css
flex-grow: 1;
```
---
## .card-title
- **位置**: 第 223 行至第 229 行
### 属性
```css
margin: 0;
      font-size: 16px;
      font-weight: bold;
```
---
## .card-info
- **位置**: 第 229 行至第 235 行
### 属性
```css
font-size: 12px;
      margin-top: 5px;
      color: rgba(255, 255, 255, 0.8);
```
---
## /* 卡片操作按钮 */
    .card-actions
- **位置**: 第 235 行至第 241 行
### 属性
```css
display: flex;
      gap: 5px;
```
---
## .card-collapse-btn, .card-close-btn
- **位置**: 第 241 行至第 257 行
### 属性
```css
background-color: transparent;
      color: white;
      border: none;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      font-weight: bold;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0;
      padding: 0;
```
---
## .card-collapse-btn:hover, .card-close-btn:hover
- **位置**: 第 257 行至第 261 行
### 属性
```css
background-color: rgba(255, 255, 255, 0.2);
```
---
## /* 分栏布局 */
    .card-content
- **位置**: 第 261 行至第 267 行
### 属性
```css
display: flex;
      height: 300px;
```
---
## .content-left
- **位置**: 第 267 行至第 273 行
### 属性
```css
flex: 1;
      border-right: 1px solid #eee;
      overflow-y: auto;
```
---
## .content-right
- **位置**: 第 273 行至第 279 行
### 属性
```css
flex: 1;
      overflow-y: auto;
      background-color: #f9f9f9;
```
---
## .content-right-header
- **位置**: 第 279 行至第 287 行
### 属性
```css
padding: 10px;
      background-color: #E3F2FD;
      border-bottom: 1px solid #ddd;
      font-weight: bold;
      color: #0D47A1;
```
---
## /* 文件项样式 */
    .file-item, .directory-item
- **位置**: 第 287 行至第 296 行
### 属性
```css
padding: 10px;
      border-bottom: 1px solid #eee;
      cursor: pointer;
      display: flex;
      align-items: center;
```
---
## .file-item:hover, .directory-item:hover
- **位置**: 第 296 行至第 300 行
### 属性
```css
background-color: #f0f0f0;
```
---
## .directory-item
- **位置**: 第 300 行至第 304 行
### 属性
```css
color: #4285f4;
```
---
## .item-icon
- **位置**: 第 304 行至第 309 行
### 属性
```css
margin-right: 8px;
      font-size: 16px;
```
---
## /* 选中项样式 */
    .selected-item
- **位置**: 第 309 行至第 319 行
### 属性
```css
padding: 10px;
      border-bottom: 1px solid #e0e0e0;
      background-color: #E8F5E9;
      display: flex;
      justify-content: space-between;
      align-items: center;
```
---
## .selected-item .item-name
- **位置**: 第 319 行至第 324 行
### 属性
```css
display: flex;
      align-items: center;
```
---
## .remove-item
- **位置**: 第 324 行至第 340 行
### 属性
```css
background-color: transparent;
      color: #f44336;
      border: none;
      cursor: pointer;
      padding: 0;
      font-size: 16px;
      font-weight: bold;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
```
---
## .remove-item:hover
- **位置**: 第 340 行至第 344 行
### 属性
```css
background-color: rgba(244, 67, 54, 0.1);
```
---
## .empty-selection
- **位置**: 第 344 行至第 351 行
### 属性
```css
padding: 20px;
      color: #757575;
      text-align: center;
      font-style: italic;
```
---
## /* 文件编辑区域 */
    .editor-container
- **位置**: 第 351 行至第 360 行
### 属性
```css
margin-top: 20px;
      background-color: white;
      border-radius: 8px;
      padding: 15px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
```
---
## .editor-label
- **位置**: 第 360 行至第 366 行
### 属性
```css
margin-bottom: 10px;
      font-weight: bold;
      color: #4285f4;
```
---
## textarea
- **位置**: 第 366 行至第 376 行
### 属性
```css
width: 100%;
      height: 300px;
      padding: 10px;
      box-sizing: border-box;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-family: monospace;
```
---
## /* 状态消息 */
    .status-message
- **位置**: 第 376 行至第 385 行
### 属性
```css
padding: 10px;
      margin: 10px 0;
      border-radius: 4px;
      background-color: #e3f2fd;
      color: #0d47a1;
```
---
## /* 右键菜单 */
    .context-menu
- **位置**: 第 385 行至第 396 行
### 属性
```css
position: absolute;
      background-color: white;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      padding: 5px 0;
      z-index: 1000;
```
---
## .context-menu-item
- **位置**: 第 396 行至第 401 行
### 属性
```css
padding: 8px 12px;
      cursor: pointer;
```
---
## .context-menu-item:hover
- **位置**: 第 401 行至第 405 行
### 属性
```css
background-color: #f0f0f0;
```
---
## /* 响应式设计 */
    @media (max-width: 1200px)
- **位置**: 第 405 行至第 411 行
### 属性
```css
body {
        flex-direction: column;
```
---
# HTML 元素
## div.debug-panel
- **位置**: 第 427 行至第 427 行
### 说明
```
左侧调试面板
```
---
## div.debug-section
- **位置**: 第 430 行至第 430 行
---
## span#openedDirCount
- **位置**: 第 431 行至第 431 行
---
## div#openedDirectoriesDebug
- **位置**: 第 432 行至第 432 行
---
## div.debug-section
- **位置**: 第 435 行至第 435 行
---
## span#relationshipsCount
- **位置**: 第 436 行至第 436 行
---
## div#relationshipsDebug
- **位置**: 第 437 行至第 437 行
---
## div.debug-section
- **位置**: 第 440 行至第 440 行
---
## span#rootDirCount
- **位置**: 第 441 行至第 441 行
---
## div#rootDirectoriesDebug
- **位置**: 第 442 行至第 442 行
---
## div.debug-section
- **位置**: 第 445 行至第 445 行
---
## span#selectedItemsCount
- **位置**: 第 446 行至第 446 行
---
## div#selectedItemsDebug
- **位置**: 第 447 行至第 447 行
---
## div.debug-section
- **位置**: 第 450 行至第 450 行
---
## span#dirHandleMapCount
- **位置**: 第 451 行至第 451 行
---
## div#dirHandleMapDebug
- **位置**: 第 452 行至第 452 行
---
## div.debug-section
- **位置**: 第 455 行至第 455 行
---
## div#globalVarsDebug
- **位置**: 第 457 行至第 457 行
---
## div.main-content
- **位置**: 第 462 行至第 462 行
### 说明
```
主内容区域
```
---
## div.controls
- **位置**: 第 463 行至第 463 行
---
## button#addDirectoryButton
- **位置**: 第 464 行至第 464 行
---
## button.danger
- **位置**: 第 465 行至第 465 行
---
## button#saveChangesButton
- **位置**: 第 466 行至第 466 行
---
## div.board-container
- **位置**: 第 469 行至第 469 行
---
## div.editor-container
- **位置**: 第 473 行至第 473 行
---
## textarea#fileContentEditor
- **位置**: 第 474 行至第 474 行
---
## div.item-name
- **位置**: 第 984 行至第 984 行
---
## span.item-icon
- **位置**: 第 984 行至第 984 行
---
## button.remove-item
- **位置**: 第 985 行至第 985 行
---
## span.item-icon
- **位置**: 第 1022 行至第 1022 行
---
## span.item-icon
- **位置**: 第 1035 行至第 1035 行
---
## div.error
- **位置**: 第 1053 行至第 1053 行
---
