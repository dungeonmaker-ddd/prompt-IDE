## JavaScript 函数

### 1. updateDebugPanel
- 类型: function
- 参数: 
- 位置: 行 523
- 注释:
```
@function updateDebugPanel
@description 更新调试面板的内容，显示原始数据结构
```

### 2. getExistingCardId
- 类型: function
- 参数: dirHandle
- 位置: 行 582
- 注释:
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

### 3. isDirectoryAlreadyOpen
- 类型: function
- 参数: dirHandle
- 位置: 行 588

### 4. createRootContainer
- 类型: function
- 参数: 
- 位置: 行 612
- 注释:
```
@function createRootContainer
@description 创建根目录容器
@returns {string} 容器ID
```

### 5. createDirectoryCard
- 类型: function
- 参数: directoryName, dirHandle, parentCardId = null, containerID = null
- 位置: 行 629
- 注释:
```
@function createDirectoryCard
@description 创建目录卡片
@param {string} directoryName 目录名称
@param {FileSystemDirectoryHandle} dirHandle 目录句柄
@param {string|null} parentCardId 父卡片ID
@param {string|null} containerID 容器ID
@returns {HTMLElement} 创建的卡片元素
```

### 6. findRootContainer
- 类型: function
- 参数: cardId
- 位置: 行 786
- 注释:
```
@function findRootContainer
@description 查找卡片所属的根容器
@param {string} cardId 卡片ID
@returns {string} 根容器ID
```

### 7. closeCard
- 类型: function
- 参数: cardId
- 位置: 行 800
- 注释:
```
@function closeCard
@description 关闭卡片及其所有子卡片
@param {string} cardId 要关闭的卡片ID
```

### 8. clearAllCards
- 类型: function
- 参数: 
- 位置: 行 855
- 注释:
```
@function clearAllCards
@description 清空所有卡片
```

### 9. selectItem
- 类型: function
- 参数: cardId, itemType, itemName
- 位置: 行 889
- 注释:
```
@function selectItem
@description 选中项目并添加到右侧面板
@param {string} cardId 卡片ID
@param {string} itemType 项目类型 ('file' 或 'directory')
@param {string} itemName 项目名称
```

### 10. removeSelectedItem
- 类型: function
- 参数: cardId, itemId
- 位置: 行 921
- 注释:
```
@function removeSelectedItem
@description 从选中项中移除
@param {string} cardId 卡片ID
@param {string} itemId 项目ID
```

### 11. updateSelectedItemsPanel
- 类型: function
- 参数: cardId
- 位置: 行 942
- 注释:
```
@function updateSelectedItemsPanel
@description 更新卡片右侧的已选中项面板
@param {string} cardId 卡片ID
```

### 12. showStatusMessage
- 类型: function
- 参数: message, isError = false
- 位置: 行 998
- 注释:
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

### 13. fillCardWithDirectoryContents
- 类型: function
- 参数: contentLeft, cardInfo, dirHandle, cardId
- 位置: 行 1007

### 14. handleDirectorySelectionAndDisplay
- 类型: function
- 参数: 
- 位置: 行 1064

### 15. createConnectorLines
- 类型: function
- 参数: parentCard, childCard
- 位置: 行 1126
- 注释:
```
@function createConnectorLines
@description 创建连接父卡片和子卡片的连接线
@param {HTMLElement} parentCard 父卡片元素
@param {HTMLElement} childCard 子卡片元素
```

### 16. toggleCardCollapse
- 类型: function
- 参数: card
- 位置: 行 1194
- 注释:
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

### 17. handleDirectoryClick
- 类型: function
- 参数: dirHandle, parentCardId
- 位置: 行 1201

### 18. handleFileReadAsText
- 类型: function
- 参数: fileHandle
- 位置: 行 1247

### 19. updateConnectors
- 类型: function
- 参数: 
- 位置: 行 1350
- 注释:
```
@function updateConnectors
@description 更新所有连接线位置
```

### 20. handleSaveFileChanges
- 类型: function
- 参数: 
- 位置: 行 1374

### 21. addCollapseAllButton
- 类型: function
- 参数: 
- 位置: 行 1396

### 22. toggleAllCards
- 类型: nested_function (嵌套在 addCollapseAllButton 内)
- 参数: 
- 位置: 行 1402

## CSS 规则

### 1. body
- 位置: 行 7
- 注释:
```
基本样式
```

### 2. .debug-panel
- 位置: 行 17
- 注释:
```
左侧调试面板
```

### 3. .main-content
- 位置: 行 77
- 注释:
```
主内容区域
```

### 4. .controls
- 位置: 行 86
- 注释:
```
控制区域
```

### 5. .board-container
- 位置: 行 112
- 注释:
```
布局容器 - 电路板风格
```

### 6. .root-directory-container
- 位置: 行 126
- 注释:
```
根目录区域
```

### 7. .directory-card
- 位置: 行 134
- 注释:
```
目录卡片样式
```

### 8. .card-content
- 位置: 行 148
- 注释:
```
卡片内容区域平滑过渡效果
```

### 9. .directory-card.card-collapsed .card-content
- 位置: 行 154
- 注释:
```
收起状态的卡片内容样式
```

### 10. .directory-card.card-collapsed .card-header
- 位置: 行 163
- 注释:
```
收起状态下标题栏底部边框隐藏
```

### 11. .directory-card.card-collapsed
- 位置: 行 168
- 注释:
```
收起状态的卡片样式
```

### 12. .directory-card.root
- 位置: 行 175
- 注释:
```
根目录卡片
```

### 13. .card-connector
- 位置: 行 180
- 注释:
```
卡片连接线
```

### 14. .connector-node
- 位置: 行 197
- 注释:
```
卡片节点点
```

### 15. .card-actions
- 位置: 行 237
- 注释:
```
卡片操作按钮
```

### 16. .card-content
- 位置: 行 263
- 注释:
```
分栏布局
```

### 17. .file-item, .directory-item
- 位置: 行 289
- 注释:
```
文件项样式
```

### 18. .selected-item
- 位置: 行 311
- 注释:
```
选中项样式
```

### 19. .editor-container
- 位置: 行 353
- 注释:
```
文件编辑区域
```

### 20. .status-message
- 位置: 行 378
- 注释:
```
状态消息
```

### 21. .context-menu
- 位置: 行 387
- 注释:
```
右键菜单
```

### 22. @media (max-width: 1200px)
- 位置: 行 407
- 注释:
```
响应式设计
```

### 23. /* 基本样式 */
    body
- 位置: 行 6

### 24. font-family: Arial, sans-serif;
      padding: 0;
      margin: 0;
      background-color: #f5f5f5;
      display: flex;
      min-height: 100vh;
    }
    
    /* 左侧调试面板 */
    .debug-panel
- 位置: 行 8

### 25. width: 280px;
      background-color: #263238;
      color: #fff;
      padding: 15px;
      box-sizing: border-box;
      overflow-y: auto;
      height: 100vh;
      position: sticky;
      top: 0;
    }
    
    .debug-panel h2
- 位置: 行 18

### 26. font-size: 18px;
      margin-top: 0;
      padding-bottom: 10px;
      border-bottom: 1px solid #455A64;
    }
    
    .debug-section
- 位置: 行 30

### 27. margin-bottom: 20px;
    }
    
    .debug-section h3
- 位置: 行 37

### 28. font-size: 14px;
      color: #81D4FA;
      margin-top: 0;
      margin-bottom: 5px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .debug-content
- 位置: 行 41

### 29. font-family: monospace;
      font-size: 12px;
      white-space: pre-wrap;
      word-break: break-all;
      background-color: #1E272C;
      padding: 10px;
      border-radius: 4px;
      max-height: 200px;
      overflow-y: auto;
      color: #A5D6A7;
    }
    
    .debug-content.json
- 位置: 行 51

### 30. color: #FFD54F;
    }
    
    .debug-count
- 位置: 行 64

### 31. background-color: #455A64;
      color: white;
      border-radius: 10px;
      padding: 2px 6px;
      font-size: 11px;
      margin-left: 5px;
    }
    
    /* 主内容区域 */
    .main-content
- 位置: 行 68

### 32. flex-grow: 1;
      padding: 20px;
      box-sizing: border-box;
      overflow-y: auto;
      height: 100vh;
    }
    
    /* 控制区域 */
    .controls
- 位置: 行 78

### 33. margin-bottom: 20px;
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    
    button
- 位置: 行 87

### 34. padding: 8px 16px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    
    button.danger
- 位置: 行 94

### 35. background-color: #f44336;
    }
    
    button:disabled
- 位置: 行 103

### 36. background-color: #cccccc;
      cursor: not-allowed;
    }
    
    /* 布局容器 - 电路板风格 */
    .board-container
- 位置: 行 107

### 37. position: relative;
      display: flex;
      flex-wrap: wrap;
      gap: 30px;
      margin-bottom: 20px;
      padding: 20px;
      background-color: #f0f0f0;
      border-radius: 10px;
      border: 1px solid #ddd;
      min-height: 400px;
    }
    
    /* 根目录区域 */
    .root-directory-container
- 位置: 行 113

### 38. display: flex;
      flex-direction: column;
      gap: 20px;
      position: relative;
    }
    
    /* 目录卡片样式 */
    .directory-card
- 位置: 行 127

### 39. position: relative;
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
      width: 600px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      background-color: white;
      margin-left: 30px;
      z-index: 2;
      transition: box-shadow 0.3s, border-radius 0.3s;
    }

    /* 卡片内容区域平滑过渡效果 */
    .card-content
- 位置: 行 135

### 40. transition: height 0.3s ease-out, opacity 0.3s ease-out;
      overflow: hidden;
    }

    /* 收起状态的卡片内容样式 */
    .directory-card.card-collapsed .card-content
- 位置: 行 149

### 41. height: 0 !important;
      opacity: 0;
      padding: 0;
      margin: 0;
      border: none;
    }

    /* 收起状态下标题栏底部边框隐藏 */
    .directory-card.card-collapsed .card-header
- 位置: 行 155

### 42. border-bottom: none;
    }

    /* 收起状态的卡片样式 */
    .directory-card.card-collapsed
- 位置: 行 164

### 43. border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }
    
    /* 根目录卡片 */
    .directory-card.root
- 位置: 行 169

### 44. margin-left: 0;
    }
    
    /* 卡片连接线 */
    .card-connector
- 位置: 行 176

### 45. position: absolute;
      border: 2px solid #4285f4;
      z-index: 1;
    }
    
    .connector-horizontal
- 位置: 行 181

### 46. height: 2px;
      background-color: #4285f4;
    }
    
    .connector-vertical
- 位置: 行 187

### 47. width: 2px;
      background-color: #4285f4;
    }
    
    /* 卡片节点点 */
    .connector-node
- 位置: 行 192

### 48. position: absolute;
      width: 8px;
      height: 8px;
      background-color: #4285f4;
      border-radius: 50%;
      z-index: 1;
    }
    
    .card-header
- 位置: 行 198

### 49. background-color: #4285f4;
      padding: 12px;
      border-bottom: 1px solid #ddd;
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .root .card-header
- 位置: 行 207

### 50. background-color: #FF5722;
    }
    
    .card-title-section
- 位置: 行 217

### 51. flex-grow: 1;
    }
    
    .card-title
- 位置: 行 221

### 52. margin: 0;
      font-size: 16px;
      font-weight: bold;
    }
    
    .card-info
- 位置: 行 225

### 53. font-size: 12px;
      margin-top: 5px;
      color: rgba(255, 255, 255, 0.8);
    }
    
    /* 卡片操作按钮 */
    .card-actions
- 位置: 行 231

### 54. display: flex;
      gap: 5px;
    }
    
    .card-collapse-btn, .card-close-btn
- 位置: 行 238

### 55. background-color: transparent;
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
    }
    
    .card-collapse-btn:hover, .card-close-btn:hover
- 位置: 行 243

### 56. background-color: rgba(255, 255, 255, 0.2);
    }
    
    /* 分栏布局 */
    .card-content
- 位置: 行 259

### 57. display: flex;
      height: 300px;
    }
    
    .content-left
- 位置: 行 264

### 58. flex: 1;
      border-right: 1px solid #eee;
      overflow-y: auto;
    }
    
    .content-right
- 位置: 行 269

### 59. flex: 1;
      overflow-y: auto;
      background-color: #f9f9f9;
    }
    
    .content-right-header
- 位置: 行 275

### 60. padding: 10px;
      background-color: #E3F2FD;
      border-bottom: 1px solid #ddd;
      font-weight: bold;
      color: #0D47A1;
    }
    
    /* 文件项样式 */
    .file-item, .directory-item
- 位置: 行 281

### 61. padding: 10px;
      border-bottom: 1px solid #eee;
      cursor: pointer;
      display: flex;
      align-items: center;
    }
    
    .file-item:hover, .directory-item:hover
- 位置: 行 290

### 62. background-color: #f0f0f0;
    }
    
    .directory-item
- 位置: 行 298

### 63. color: #4285f4;
    }
    
    .item-icon
- 位置: 行 302

### 64. margin-right: 8px;
      font-size: 16px;
    }
    
    /* 选中项样式 */
    .selected-item
- 位置: 行 306

### 65. padding: 10px;
      border-bottom: 1px solid #e0e0e0;
      background-color: #E8F5E9;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .selected-item .item-name
- 位置: 行 312

### 66. display: flex;
      align-items: center;
    }
    
    .remove-item
- 位置: 行 321

### 67. background-color: transparent;
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
    }
    
    .remove-item:hover
- 位置: 行 326

### 68. background-color: rgba(244, 67, 54, 0.1);
    }
    
    .empty-selection
- 位置: 行 342

### 69. padding: 20px;
      color: #757575;
      text-align: center;
      font-style: italic;
    }
    
    /* 文件编辑区域 */
    .editor-container
- 位置: 行 346

### 70. margin-top: 20px;
      background-color: white;
      border-radius: 8px;
      padding: 15px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    
    .editor-label
- 位置: 行 354

### 71. margin-bottom: 10px;
      font-weight: bold;
      color: #4285f4;
    }
    
    textarea
- 位置: 行 362

### 72. width: 100%;
      height: 300px;
      padding: 10px;
      box-sizing: border-box;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-family: monospace;
    }
    
    /* 状态消息 */
    .status-message
- 位置: 行 368

### 73. padding: 10px;
      margin: 10px 0;
      border-radius: 4px;
      background-color: #e3f2fd;
      color: #0d47a1;
    }
    
    /* 右键菜单 */
    .context-menu
- 位置: 行 379

### 74. position: absolute;
      background-color: white;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      padding: 5px 0;
      z-index: 1000;
    }
    
    .context-menu-item
- 位置: 行 388

### 75. padding: 8px 12px;
      cursor: pointer;
    }
    
    .context-menu-item:hover
- 位置: 行 398

### 76. background-color: #f0f0f0;
    }
    
    /* 响应式设计 */
    @media (max-width: 1200px)
- 位置: 行 403

### 77. flex-direction: column;
      }
      
      .debug-panel
- 位置: 行 409

### 78. width: 100%;
        height: auto;
        max-height: 300px;
      }
      
      .directory-card
- 位置: 行 413

## HTML 元素

### 1. div.debug-panel
- 位置: 行 427
- 注释:
```
左侧调试面板
```

### 2. div.debug-section
- 位置: 行 430

### 3. span#openedDirCount
- 位置: 行 431

### 4. div#openedDirectoriesDebug
- 位置: 行 432

### 5. div.debug-section
- 位置: 行 435

### 6. span#relationshipsCount
- 位置: 行 436

### 7. div#relationshipsDebug
- 位置: 行 437

### 8. div.debug-section
- 位置: 行 440

### 9. span#rootDirCount
- 位置: 行 441

### 10. div#rootDirectoriesDebug
- 位置: 行 442

### 11. div.debug-section
- 位置: 行 445

### 12. span#selectedItemsCount
- 位置: 行 446

### 13. div#selectedItemsDebug
- 位置: 行 447

### 14. div.debug-section
- 位置: 行 450

### 15. span#dirHandleMapCount
- 位置: 行 451

### 16. div#dirHandleMapDebug
- 位置: 行 452

### 17. div.debug-section
- 位置: 行 455

### 18. div#globalVarsDebug
- 位置: 行 457

### 19. div.main-content
- 位置: 行 462
- 注释:
```
主内容区域
```

### 20. div.controls
- 位置: 行 463

### 21. button#addDirectoryButton
- 位置: 行 464

### 22. button.danger
- 位置: 行 465

### 23. button#saveChangesButton
- 位置: 行 466

### 24. div.board-container
- 位置: 行 469

### 25. div.editor-container
- 位置: 行 473

### 26. textarea#fileContentEditor
- 位置: 行 474

### 27. div.item-name
- 位置: 行 984

### 28. span.item-icon
- 位置: 行 984

### 29. button.remove-item
- 位置: 行 985

### 30. span.item-icon
- 位置: 行 1022

### 31. span.item-icon
- 位置: 行 1035

### 32. div.error
- 位置: 行 1053

