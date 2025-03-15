# HTML文件分析报告

## JavaScript代码分析

### 目录

* [函数](#函数)
* [变量](#变量)

## 函数

### updateDebugPanel

*
   * @function updateDebugPanel
   * @description 更新调试面板的内容，显示原始数据结构

**类型:** 函数声明

**位置:** 第 489-532 行

---

### isDirectoryAlreadyOpen

*
   * @function isDirectoryAlreadyOpen
   * @description 检查目录是否已经打开
   * @param {FileSystemDirectoryHandle} dirHandle 目录句柄
   * @returns {boolean} 目录是否已经打开

**类型:** 函数声明

**参数:**

| 名称 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| dirHandle | FileSystemDirectoryHandle | - | - |

**返回值:** boolean

**位置:** 第 540-551 行

---

### getExistingCardId

*
   * @function getExistingCardId
   * @description 获取已打开目录的卡片ID
   * @param {FileSystemDirectoryHandle} dirHandle 目录句柄
   * @returns {string|null} 卡片ID，如果未打开则返回null

**类型:** 函数声明

**参数:**

| 名称 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| dirHandle | FileSystemDirectoryHandle | - | - |

**返回值:** string|null

**位置:** 第 559-567 行

---

### createRootContainer

*
   * @function createRootContainer
   * @description 创建根目录容器
   * @returns {string} 容器ID

**类型:** 函数声明

**返回值:** string

**位置:** 第 574-581 行

---

### createDirectoryCard

*
   * @function createDirectoryCard
   * @description 创建目录卡片
   * @param {string} directoryName 目录名称
   * @param {FileSystemDirectoryHandle} dirHandle 目录句柄
   * @param {string|null} parentCardId 父卡片ID
   * @param {string|null} containerID 容器ID
   * @returns {HTMLElement} 创建的卡片元素

**类型:** 函数声明

**参数:**

| 名称 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| directoryName | string | - | - |
| dirHandle | FileSystemDirectoryHandle | - | - |
| parentCardId | string|null | - | - |
| containerID | string|null | - | - |

**返回值:** HTMLElement

**位置:** 第 592-703 行

---

### findRootContainer

*
   * @function findRootContainer
   * @description 查找卡片所属的根容器
   * @param {string} cardId 卡片ID
   * @returns {string} 根容器ID

**类型:** 函数声明

**参数:**

| 名称 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| cardId | string | - | - |

**返回值:** string

**位置:** 第 711-725 行

---

### closeCard

*
   * @function closeCard
   * @description 关闭卡片及其所有子卡片
   * @param {string} cardId 要关闭的卡片ID

**类型:** 函数声明

**参数:**

| 名称 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| cardId | string | - | - |

**位置:** 第 732-781 行

---

### clearAllCards

*
   * @function clearAllCards
   * @description 清空所有卡片

**类型:** 函数声明

**位置:** 第 787-815 行

---

### selectItem

*
   * @function selectItem
   * @description 选中项目并添加到右侧面板
   * @param {string} cardId 卡片ID
   * @param {string} itemType 项目类型 ('file' 或 'directory')
   * @param {string} itemName 项目名称

**类型:** 函数声明

**参数:**

| 名称 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| cardId | string | - | - |
| itemType | string | - | - |
| itemName | string | - | - |

**位置:** 第 824-850 行

---

### removeSelectedItem

*
   * @function removeSelectedItem
   * @description 从选中项中移除
   * @param {string} cardId 卡片ID
   * @param {string} itemId 项目ID

**类型:** 函数声明

**参数:**

| 名称 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| cardId | string | - | - |
| itemId | string | - | - |

**位置:** 第 858-875 行

---

### updateSelectedItemsPanel

*
   * @function updateSelectedItemsPanel
   * @description 更新卡片右侧的已选中项面板
   * @param {string} cardId 卡片ID

**类型:** 函数声明

**参数:**

| 名称 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| cardId | string | - | - |

**位置:** 第 882-927 行

---

### showStatusMessage

*
   * @function showStatusMessage
   * @description 显示状态消息
   * @param {string} message 消息内容
   * @param {boolean} isError 是否为错误消息

**类型:** 函数声明

**参数:**

| 名称 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| message | string | - | - |
| isError | boolean | false | - |

**位置:** 第 935-951 行

---

### fillCardWithDirectoryContents

*
   * @function fillCardWithDirectoryContents
   * @description 填充卡片内容区域
   * @param {HTMLElement} contentLeft 左侧内容元素
   * @param {HTMLElement} cardInfo 卡片信息元素
   * @param {FileSystemDirectoryHandle} dirHandle 目录句柄
   * @param {string} cardId 卡片ID
   * @async

**类型:** 函数声明

**参数:**

| 名称 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| contentLeft | HTMLElement | - | - |
| cardInfo | HTMLElement | - | - |
| dirHandle | FileSystemDirectoryHandle | - | - |
| cardId | string | - | - |

**位置:** 第 962-1009 行

---

### handleDirectorySelectionAndDisplay

*
   * @function handleDirectorySelectionAndDisplay
   * @description 处理用户选择目录并展示其内容
   * @async

**类型:** 函数声明

**位置:** 第 1016-1049 行

---

### createConnectorLines

*
   * @function createConnectorLines
   * @description 创建连接父卡片和子卡片的连接线
   * @param {HTMLElement} parentCard 父卡片元素
   * @param {HTMLElement} childCard 子卡片元素

**类型:** 函数声明

**参数:**

| 名称 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| parentCard | HTMLElement | - | - |
| childCard | HTMLElement | - | - |

**位置:** 第 1057-1122 行

---

### toggleCardCollapse

*
   * @function toggleCardCollapse
   * @description 切换卡片的收起/展开状态
   * @param {HTMLElement} card 要切换的卡片元素

**类型:** 函数声明

**参数:**

| 名称 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| card | HTMLElement | - | - |

**位置:** 第 1129-1142 行

---

### handleDirectoryClick

*
   * @function handleDirectoryClick
   * @description 处理目录点击，打开子目录
   * @param {FileSystemDirectoryHandle} dirHandle 目录句柄
   * @param {string} parentCardId 父卡片ID
   * @async

**类型:** 函数声明

**参数:**

| 名称 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| dirHandle | FileSystemDirectoryHandle | - | - |
| parentCardId | string | - | - |

**位置:** 第 1151-1189 行

---

### handleFileReadAsText

*
   * @function handleFileReadAsText
   * @description 将文件作为文本读取并显示
   * @param {FileSystemFileHandle} fileHandle 文件句柄
   * @async

**类型:** 函数声明

**参数:**

| 名称 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| fileHandle | FileSystemFileHandle | - | - |

**位置:** 第 1197-1231 行

---

### updateConnectors

*
   * @function updateConnectors
   * @description 更新所有连接线位置

**类型:** 函数声明

**位置:** 第 1237-1250 行

---

### handleSaveFileChanges

*
   * @function handleSaveFileChanges
   * @description 保存对文件的修改
   * @async

**类型:** 函数声明

**位置:** 第 1260-1275 行

---

### addCollapseAllButton

*
   * @function addCollapseAllButton
   * @description 添加折叠/展开所有卡片按钮

**类型:** 函数声明

**位置:** 第 1281-1324 行

---

### toggleAllCards

**类型:** 函数声明

**位置:** 第 1287-1318 行

---

## 变量

| 名称 | 类型 | 初始值 | 描述 |
|------|------|--------|------|
| openedDirectories | const | - |  |
| directoryRelationships | const | - |  |
| rootDirectories | const | - |  |
| selectedItemsPerCard | const | - |  |
| dirHandleMap | const | - |  |
| currentFileHandle | let | - |  |
| boardContainer | const | - |  |
| fileContentEditor | const | - |  |
| saveChangesButton | const | - |  |
| statusMessageElement | const | - |  |
| openedDirsObj | const | {...} |  |
| relationshipsObj | const | {...} |  |
| selectedItemsObj | const | {...} |  |
| dirHandleObj | const | {...} |  |
| globalVars | const | {...} |  |
| path | const | - |  |
| path | const | - |  |
| containerId | const | - |  |
| container | const | - |  |
| cardId | const | - |  |
| card | const | - |  |
| header | const | - |  |
| titleSection | const | - |  |
| title | const | - |  |
| info | const | - |  |
| actions | const | - |  |
| collapseBtn | const | - |  |
| closeBtn | const | - |  |
| content | const | - |  |
| contentLeft | const | - |  |
| contentRight | const | - |  |
| contentRightHeader | const | - |  |
| selectedItemsContainer | const | - |  |
| container | const | - |  |
| path | const | - |  |
| currentId | let | cardId |  |
| rootCard | const | - |  |
| childrenToClose | const | [...] |  |
| card | const | - |  |
| directoryPath | let | - |  |
| connectors | const | - |  |
| rootIds | const | [...] |  |
| existingLabel | const | - |  |
| items | const | - |  |
| itemId | const | - |  |
| items | const | - |  |
| itemName | const | - |  |
| card | const | - |  |
| selectedItemsContainer | const | - |  |
| items | const | - |  |
| itemId | const | - |  |
| itemName | const | - |  |
| itemElement | const | - |  |
| nameElement | const | - |  |
| icon | const | - |  |
| removeButton | const | - |  |
| fileCount | let | - |  |
| dirCount | let | - |  |
| entry | const | - |  |
| entryElement | const | - |  |
| dirHandle | const | - |  |
| existingCardId | const | - |  |
| card | const | - |  |
| containerId | const | - |  |
| rootCard | const | - |  |
| parentRect | const | - |  |
| childRect | const | - |  |
| boardRect | const | - |  |
| parentLeft | const | - |  |
| parentTop | const | - |  |
| childLeft | const | - |  |
| childTop | const | - |  |
| connector | const | - |  |
| startX | const | - |  |
| startY | const | - |  |
| endX | const | childLeft |  |
| endY | const | - |  |
| horizontalLine | const | - |  |
| verticalLine | const | - |  |
| horizontalLine2 | const | - |  |
| startNode | const | - |  |
| endNode | const | - |  |
| existingCardId | const | - |  |
| card | const | - |  |
| parentCard | const | - |  |
| containerID | const | - |  |
| directoryCard | const | - |  |
| file | const | - |  |
| textContent | const | - |  |
| editorLabel | const | - |  |
| existingLabel | const | - |  |
| connectors | const | - |  |
| parentCard | const | - |  |
| childCard | const | - |  |
| writable | const | - |  |
| collapseAllButton | const | - |  |
| allCards | const | - |  |
| anyExpanded | let | - |  |

## CSS样式分析

### 选择器: `/* 基本样式 */
    body`

**位置**: 第 7 行 - 第 16 行

**属性**:
```css
font-family: Arial, sans-serif;
      padding: 0;
      margin: 0;
      background-color: #f5f5f5;
      display: flex;
      min-height: 100vh;
```

---

### 选择器: `/* 左侧调试面板 */
    .debug-panel`

**位置**: 第 16 行 - 第 29 行

**属性**:
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

### 选择器: `.debug-panel h2`

**位置**: 第 29 行 - 第 36 行

**属性**:
```css
font-size: 18px;
      margin-top: 0;
      padding-bottom: 10px;
      border-bottom: 1px solid #455A64;
```

---

### 选择器: `.debug-section`

**位置**: 第 36 行 - 第 40 行

**属性**:
```css
margin-bottom: 20px;
```

---

### 选择器: `.debug-section h3`

**位置**: 第 40 行 - 第 50 行

**属性**:
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

### 选择器: `.debug-content`

**位置**: 第 50 行 - 第 63 行

**属性**:
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

### 选择器: `.debug-content.json`

**位置**: 第 63 行 - 第 67 行

**属性**:
```css
color: #FFD54F;
```

---

### 选择器: `.debug-count`

**位置**: 第 67 行 - 第 76 行

**属性**:
```css
background-color: #455A64;
      color: white;
      border-radius: 10px;
      padding: 2px 6px;
      font-size: 11px;
      margin-left: 5px;
```

---

### 选择器: `/* 主内容区域 */
    .main-content`

**位置**: 第 76 行 - 第 85 行

**属性**:
```css
flex-grow: 1;
      padding: 20px;
      box-sizing: border-box;
      overflow-y: auto;
      height: 100vh;
```

---

### 选择器: `/* 控制区域 */
    .controls`

**位置**: 第 85 行 - 第 93 行

**属性**:
```css
margin-bottom: 20px;
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
```

---

### 选择器: `button`

**位置**: 第 93 行 - 第 102 行

**属性**:
```css
padding: 8px 16px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
```

---

### 选择器: `button.danger`

**位置**: 第 102 行 - 第 106 行

**属性**:
```css
background-color: #f44336;
```

---

### 选择器: `button:disabled`

**位置**: 第 106 行 - 第 111 行

**属性**:
```css
background-color: #cccccc;
      cursor: not-allowed;
```

---

### 选择器: `/* 布局容器 - 电路板风格 */
    .board-container`

**位置**: 第 111 行 - 第 125 行

**属性**:
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

### 选择器: `/* 根目录区域 */
    .root-directory-container`

**位置**: 第 125 行 - 第 133 行

**属性**:
```css
display: flex;
      flex-direction: column;
      gap: 20px;
      position: relative;
```

---

### 选择器: `/* 目录卡片样式 */
    .directory-card`

**位置**: 第 133 行 - 第 147 行

**属性**:
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

### 选择器: `/* 卡片内容区域平滑过渡效果 */
    .card-content`

**位置**: 第 147 行 - 第 155 行

**属性**:
```css
transition: height 0.3s ease-out, opacity 0.3s ease-out;
      overflow: hidden;
      display: flex;
      height: 300px;
```

---

### 选择器: `/* 收起状态的卡片内容样式 */
    .directory-card.card-collapsed .card-content`

**位置**: 第 155 行 - 第 164 行

**属性**:
```css
height: 0 !important;
      opacity: 0;
      padding: 0;
      margin: 0;
      border: none;
```

---

### 选择器: `/* 收起状态下标题栏底部边框隐藏 */
    .directory-card.card-collapsed .card-header`

**位置**: 第 164 行 - 第 169 行

**属性**:
```css
border-bottom: none;
```

---

### 选择器: `/* 收起状态的卡片样式 */
    .directory-card.card-collapsed`

**位置**: 第 169 行 - 第 176 行

**属性**:
```css
border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
```

---

### 选择器: `/* 根目录卡片 */
    .directory-card.root`

**位置**: 第 176 行 - 第 181 行

**属性**:
```css
margin-left: 0;
```

---

### 选择器: `/* 卡片连接线 */
    .card-connector`

**位置**: 第 181 行 - 第 188 行

**属性**:
```css
position: absolute;
      border: 2px solid #4285f4;
      z-index: 1;
```

---

### 选择器: `.connector-horizontal`

**位置**: 第 188 行 - 第 193 行

**属性**:
```css
height: 2px;
      background-color: #4285f4;
```

---

### 选择器: `.connector-vertical`

**位置**: 第 193 行 - 第 198 行

**属性**:
```css
width: 2px;
      background-color: #4285f4;
```

---

### 选择器: `/* 卡片节点点 */
    .connector-node`

**位置**: 第 198 行 - 第 208 行

**属性**:
```css
position: absolute;
      width: 8px;
      height: 8px;
      background-color: #4285f4;
      border-radius: 50%;
      z-index: 1;
```

---

### 选择器: `.card-header`

**位置**: 第 208 行 - 第 218 行

**属性**:
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

### 选择器: `.root .card-header`

**位置**: 第 218 行 - 第 222 行

**属性**:
```css
background-color: #FF5722;
```

---

### 选择器: `.card-title-section`

**位置**: 第 222 行 - 第 226 行

**属性**:
```css
flex-grow: 1;
```

---

### 选择器: `.card-title`

**位置**: 第 226 行 - 第 232 行

**属性**:
```css
margin: 0;
      font-size: 16px;
      font-weight: bold;
```

---

### 选择器: `.card-info`

**位置**: 第 232 行 - 第 238 行

**属性**:
```css
font-size: 12px;
      margin-top: 5px;
      color: rgba(255, 255, 255, 0.8);
```

---

### 选择器: `/* 卡片操作按钮 */
    .card-actions`

**位置**: 第 238 行 - 第 244 行

**属性**:
```css
display: flex;
      gap: 5px;
```

---

### 选择器: `.card-collapse-btn, .card-close-btn`

**位置**: 第 244 行 - 第 260 行

**属性**:
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

### 选择器: `.card-collapse-btn:hover, .card-close-btn:hover`

**位置**: 第 260 行 - 第 264 行

**属性**:
```css
background-color: rgba(255, 255, 255, 0.2);
```

---

### 选择器: `.content-left`

**位置**: 第 264 行 - 第 270 行

**属性**:
```css
flex: 1;
      border-right: 1px solid #eee;
      overflow-y: auto;
```

---

### 选择器: `.content-right`

**位置**: 第 270 行 - 第 276 行

**属性**:
```css
flex: 1;
      overflow-y: auto;
      background-color: #f9f9f9;
```

---

### 选择器: `.content-right-header`

**位置**: 第 276 行 - 第 284 行

**属性**:
```css
padding: 10px;
      background-color: #E3F2FD;
      border-bottom: 1px solid #ddd;
      font-weight: bold;
      color: #0D47A1;
```

---

### 选择器: `/* 文件项样式 */
    .file-item, .directory-item`

**位置**: 第 284 行 - 第 293 行

**属性**:
```css
padding: 10px;
      border-bottom: 1px solid #eee;
      cursor: pointer;
      display: flex;
      align-items: center;
```

---

### 选择器: `.file-item:hover, .directory-item:hover`

**位置**: 第 293 行 - 第 297 行

**属性**:
```css
background-color: #f0f0f0;
```

---

### 选择器: `.directory-item`

**位置**: 第 297 行 - 第 301 行

**属性**:
```css
color: #4285f4;
```

---

### 选择器: `.item-icon`

**位置**: 第 301 行 - 第 306 行

**属性**:
```css
margin-right: 8px;
      font-size: 16px;
```

---

### 选择器: `/* 选中项样式 */
    .selected-item`

**位置**: 第 306 行 - 第 316 行

**属性**:
```css
padding: 10px;
      border-bottom: 1px solid #e0e0e0;
      background-color: #E8F5E9;
      display: flex;
      justify-content: space-between;
      align-items: center;
```

---

### 选择器: `.selected-item .item-name`

**位置**: 第 316 行 - 第 321 行

**属性**:
```css
display: flex;
      align-items: center;
```

---

### 选择器: `.remove-item`

**位置**: 第 321 行 - 第 337 行

**属性**:
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

### 选择器: `.remove-item:hover`

**位置**: 第 337 行 - 第 341 行

**属性**:
```css
background-color: rgba(244, 67, 54, 0.1);
```

---

### 选择器: `.empty-selection`

**位置**: 第 341 行 - 第 348 行

**属性**:
```css
padding: 20px;
      color: #757575;
      text-align: center;
      font-style: italic;
```

---

### 选择器: `/* 文件编辑区域 */
    .editor-container`

**位置**: 第 348 行 - 第 357 行

**属性**:
```css
margin-top: 20px;
      background-color: white;
      border-radius: 8px;
      padding: 15px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
```

---

### 选择器: `.editor-label`

**位置**: 第 357 行 - 第 363 行

**属性**:
```css
margin-bottom: 10px;
      font-weight: bold;
      color: #4285f4;
```

---

### 选择器: `textarea`

**位置**: 第 363 行 - 第 373 行

**属性**:
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

### 选择器: `/* 状态消息 */
    .status-message`

**位置**: 第 373 行 - 第 382 行

**属性**:
```css
padding: 10px;
      margin: 10px 0;
      border-radius: 4px;
      background-color: #e3f2fd;
      color: #0d47a1;
```

---

### 选择器: `/* 右键菜单 */
    .context-menu`

**位置**: 第 382 行 - 第 393 行

**属性**:
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

### 选择器: `.context-menu-item`

**位置**: 第 393 行 - 第 398 行

**属性**:
```css
padding: 8px 12px;
      cursor: pointer;
```

---

### 选择器: `.context-menu-item:hover`

**位置**: 第 398 行 - 第 402 行

**属性**:
```css
background-color: #f0f0f0;
```

---

### 选择器: `/* 响应式设计 */
    @media (max-width: 1200px)`

**位置**: 第 402 行 - 第 408 行

**属性**:
```css
body {
        flex-direction: column;
```

---

## HTML元素分析

| 元素 | ID | 类名 | 位置 |
|------|------|------|------|
| div | - | debug-panel | 第 414 行 |
| div | - | debug-section | 第 416 行 |
| span | - | debug-count | 第 417 行 |
| div | - | debug-content json | 第 418 行 |
| div | - | debug-section | 第 420 行 |
| span | - | debug-count | 第 421 行 |
| div | - | debug-content json | 第 422 行 |
| div | - | debug-section | 第 424 行 |
| span | - | debug-count | 第 425 行 |
| div | - | debug-content json | 第 426 行 |
| div | - | debug-section | 第 428 行 |
| span | - | debug-count | 第 429 行 |
| div | - | debug-content json | 第 430 行 |
| div | - | debug-section | 第 432 行 |
| span | - | debug-count | 第 433 行 |
| div | - | debug-content json | 第 434 行 |
| div | - | debug-section | 第 436 行 |
| div | - | debug-content json | 第 438 行 |
| div | - | main-content | 第 443 行 |
| div | - | controls | 第 444 行 |
| button | addDirectoryButton | - | 第 445 行 |
| button | clearAllButton | - | 第 446 行 |
| button | saveChangesButton | - | 第 447 行 |
| div | - | status-message | 第 451 行 |
| div | boardContainer | - | 第 454 行 |
| div | - | editor-container | 第 457 行 |
| textarea | fileContentEditor | - | 第 458 行 |
| div | - | empty-selection | 第 665 行 |
| div | - | empty-selection | 第 892 行 |
| span | - | item-icon | 第 975 行 |
| span | - | item-icon | 第 988 行 |
| div | - | error | 第 1005 行 |

