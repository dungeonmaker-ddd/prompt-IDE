以下是从 HTML 文件中提取的函数、CSS 规则和 HTML 元素信息，可用于生成补丁文件：

## JavaScript 函数

### 1. updateDebugPanel
- 类型: function
- 参数: 
- 位置: 行 523, 索引 12424
- 注释:
```
@function updateDebugPanel
@description 更新调试面板的内容，显示原始数据结构
```
- 定义:
```javascript
/**

      // 转换 Map 和 Set 为对象和数组以便更好地展示
      // openedDirectories Map
      const openedDirsObj = {};
      openedDirectories.forEach((dirHandle, cardId) => {
        openedDirsObj[cardId] = {
          name: dirHandle.name,
          kind: dirHandle.kind,
          isRoot: rootDirectories.has(cardId)
        };
      });
      openedDirectoriesDebug.textContent = JSON.stringify(openedDirsObj, null, 2);
      openedDirCount.textContent = openedDirectories.size;
      
      // directoryRelationships Map
      const relationshipsObj = {};
      directoryRelationships.forEach((parentId, childId) => {
        relationshipsObj[childId] = parentId;
      });
      relationshipsDebug.textContent = JSON.stringify(relationshipsObj, null, 2);
      relationshipsCount.textContent = directoryRelationships.size;
      
      // rootDirectories Set
      rootDirectoriesDebug.textContent = JSON.stringify([...rootDirectories], null, 2);
      rootDirCount.textContent = rootDirectories.size;
      
      // selectedItemsPerCard Map
      const selectedItemsObj = {};
      selectedItemsPerCard.forEach((items, cardId) => {
        selectedItemsObj[cardId] = [...items].map(item => {
          const [type, name] = item.split('::');
          return { type, name };
        });
      });
      selectedItemsDebug.textContent = JSON.stringify(selectedItemsObj, null, 2);
      const totalItems = [...selectedItemsPerCard.values()].reduce((acc, set) => acc + set.size, 0);
      selectedItemsCount.textContent = totalItems;
      
      // dirHandleMap
      const dirHandleObj = {};
      dirHandleMap.forEach((cardId, path) => {
        dirHandleObj[path] = cardId;
      });
      dirHandleMapDebug.textContent = JSON.stringify(dirHandleObj, null, 2);
      dirHandleMapCount.textContent = dirHandleMap.size;
      
      // 全局变量
      const globalVars = {
        cardIdCounter,
        rootContainerIdCounter,
        hasCurrentFile: currentFileHandle !== null
      };
      globalVarsDebug.textContent = JSON.stringify(globalVars, null, 2);
    
}
```

### 2. getExistingCardId
- 类型: function
- 参数: dirHandle
- 位置: 行 582, 索引 14659
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
- 定义:
```javascript
/**
FileSystemDirectoryHandle
}
```

### 3. isDirectoryAlreadyOpen
- 类型: function
- 参数: dirHandle
- 位置: 行 588, 索引 14850
- 定义:
```javascript
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
```

### 4. createRootContainer
- 类型: function
- 参数: 
- 位置: 行 612, 索引 15521
- 注释:
```
@function createRootContainer
@description 创建根目录容器
@returns {string} 容器ID
```
- 定义:
```javascript
/**
string
}
```

### 5. createDirectoryCard
- 类型: function
- 参数: directoryName, dirHandle, parentCardId = null, containerID = null
- 位置: 行 629, 索引 16002
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
- 定义:
```javascript
/**
string
}
```

### 6. findRootContainer
- 类型: function
- 参数: cardId
- 位置: 行 786, 索引 21179
- 注释:
```
@function findRootContainer
@description 查找卡片所属的根容器
@param {string} cardId 卡片ID
@returns {string} 根容器ID
```
- 定义:
```javascript
/**
string
}
```

### 7. closeCard
- 类型: function
- 参数: cardId
- 位置: 行 800, 索引 21543
- 注释:
```
@function closeCard
@description 关闭卡片及其所有子卡片
@param {string} cardId 要关闭的卡片ID
```
- 定义:
```javascript
/**
string
}
```

### 8. clearAllCards
- 类型: function
- 参数: 
- 位置: 行 855, 索引 23100
- 注释:
```
@function clearAllCards
@description 清空所有卡片
```
- 定义:
```javascript
/**

      // 复制根目录ID集合，因为在循环中会修改集合
      const rootIds = [...rootDirectories];
      
      // 关闭所有根目录卡片
      rootIds.forEach(cardId => closeCard(cardId));
      
      // 重置状态
      openedDirectories.clear();
      directoryRelationships.clear();
      rootDirectories.clear();
      selectedItemsPerCard.clear();
      dirHandleMap.clear();
      
      // 清空编辑器
      fileContentEditor.value = '';
      fileContentEditor.disabled = true;
      saveChangesButton.disabled = true;
      currentFileHandle = null;
      
      // 移除编辑器标签
      const existingLabel = document.querySelector('.editor-label');
      if (existingLabel) {
        existingLabel.remove();
      }
      
      // 更新调试面板
      updateDebugPanel();
    
}
```

### 9. selectItem
- 类型: function
- 参数: cardId, itemType, itemName
- 位置: 行 889, 索引 23971
- 注释:
```
@function selectItem
@description 选中项目并添加到右侧面板
@param {string} cardId 卡片ID
@param {string} itemType 项目类型 ('file' 或 'directory')
@param {string} itemName 项目名称
```
- 定义:
```javascript
/**
string
}
```

### 10. removeSelectedItem
- 类型: function
- 参数: cardId, itemId
- 位置: 行 921, 索引 24798
- 注释:
```
@function removeSelectedItem
@description 从选中项中移除
@param {string} cardId 卡片ID
@param {string} itemId 项目ID
```
- 定义:
```javascript
/**
string
}
```

### 11. updateSelectedItemsPanel
- 类型: function
- 参数: cardId
- 位置: 行 942, 索引 25314
- 注释:
```
@function updateSelectedItemsPanel
@description 更新卡片右侧的已选中项面板
@param {string} cardId 卡片ID
```
- 定义:
```javascript
/**
string
}
```

### 12. showStatusMessage
- 类型: function
- 参数: message, isError = false
- 位置: 行 998, 索引 27314
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
- 定义:
```javascript
/**
HTMLElement
}
```

### 13. fillCardWithDirectoryContents
- 类型: function
- 参数: contentLeft, cardInfo, dirHandle, cardId
- 位置: 行 1007, 索引 27618
- 定义:
```javascript
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
```

### 14. handleDirectorySelectionAndDisplay
- 类型: function
- 参数: 
- 位置: 行 1064, 索引 29665
- 定义:
```javascript
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
```

### 15. createConnectorLines
- 类型: function
- 参数: parentCard, childCard
- 位置: 行 1126, 索引 31708
- 注释:
```
@function createConnectorLines
@description 创建连接父卡片和子卡片的连接线
@param {HTMLElement} parentCard 父卡片元素
@param {HTMLElement} childCard 子卡片元素
```
- 定义:
```javascript
/**
HTMLElement
}
```

### 16. toggleCardCollapse
- 类型: function
- 参数: card
- 位置: 行 1194, 索引 35188
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
- 定义:
```javascript
/**
FileSystemDirectoryHandle
}
```

### 17. handleDirectoryClick
- 类型: function
- 参数: dirHandle, parentCardId
- 位置: 行 1201, 索引 35401
- 定义:
```javascript
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
```

### 18. handleFileReadAsText
- 类型: function
- 参数: fileHandle
- 位置: 行 1247, 索引 36892
- 定义:
```javascript
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
```

### 19. updateConnectors
- 类型: function
- 参数: 
- 位置: 行 1350, 索引 40039
- 注释:
```
@function updateConnectors
@description 更新所有连接线位置
```
- 定义:
```javascript
/**

      // 移除所有连接线
      const connectors = document.querySelectorAll('.card-connector, .connector-node');
      connectors.forEach(connector => connector.remove());
      
      // 重新绘制所有连接线
      directoryRelationships.forEach((parentId, childId) => {
        const parentCard = document.getElementById(parentId);
        const childCard = document.getElementById(childId);
        if (parentCard && childCard) {
          createConnectorLines(parentCard, childCard);
        }
      });
    
}
```

### 20. handleSaveFileChanges
- 类型: function
- 参数: 
- 位置: 行 1374, 索引 40787
- 定义:
```javascript
async function handleSaveFileChanges() {

      if (!currentFileHandle) {
        showStatusMessage('请先选择一个文件进行编辑！', true);
        return;
      }

      try {
        const writable = await currentFileHandle.createWritable();
        await writable.write(fileContentEditor.value);
        await writable.close();
        
        showStatusMessage(`文件 ${currentFileHandle.name} 已成功保存！`);
      } catch (error) {
        console.error('[DEBUG] 文件保存失败', error);
        showStatusMessage(`保存文件失败: ${error.message}`, true);
      }
    
}
```

### 21. addCollapseAllButton
- 类型: function
- 参数: 
- 位置: 行 1396, 索引 41451
- 定义:
```javascript
function addCollapseAllButton() {

      const collapseAllButton = document.createElement('button');
      collapseAllButton.textContent = '收起/展开全部';
      collapseAllButton.className = 'collapse-toggle-all';

      // 智能切换所有卡片状态
      function toggleAllCards() {
        const allCards = document.querySelectorAll('.directory-card');
        let anyExpanded = false;
      
        // 检查是否有任何卡片处于展开状态
        allCards.forEach(card => {
          if (!card.classList.contains('card-collapsed')) {
            anyExpanded = true;
          }
        });

        // 如果有任何卡片展开，则收起所有卡片
        if (anyExpanded) {
          allCards.forEach(card => {
            if (!card.classList.contains('card-collapsed')) {
              toggleCardCollapse(card);
            }
          });
          collapseAllButton.textContent = '展开全部';
        }
        // 如果所有卡片都已收起，则展开所有卡片
        else {
          allCards.forEach(card => {
            if (card.classList.contains('card-collapsed')) {
              toggleCardCollapse(card);
            }
          });
          collapseAllButton.textContent = '收起全部';
        }
      }
      
      // 添加到控制区域
      document.querySelector('.controls').appendChild(collapseAllButton);
    
}
```

### 22. toggleAllCards
- 类型: nested_function (嵌套在 addCollapseAllButton 内)
- 参数: 
- 位置: 行 1402, 索引 41659
- 定义:
```javascript
function toggleAllCards() {
```

## CSS 规则

### 1. body
- 位置: 行 7, 索引 128
- 注释:
```
基本样式
```
- 定义:
```css
/* 基本样式 */
font-family: Arial, sans-serif;
      padding: 0;
      margin: 0;
      background-color: #f5f5f5;
      display: flex;
      min-height: 100vh;
```

### 2. .debug-panel
- 位置: 行 17, 索引 327
- 注释:
```
左侧调试面板
```
- 定义:
```css
/* 左侧调试面板 */
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

### 3. .main-content
- 位置: 行 77, 索引 1591
- 注释:
```
主内容区域
```
- 定义:
```css
/* 主内容区域 */
flex-grow: 1;
      padding: 20px;
      box-sizing: border-box;
      overflow-y: auto;
      height: 100vh;
```

### 4. .controls
- 位置: 行 86, 索引 1763
- 注释:
```
控制区域
```
- 定义:
```css
/* 控制区域 */
margin-bottom: 20px;
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
```

### 5. .board-container
- 位置: 行 112, 索引 2247
- 注释:
```
布局容器 - 电路板风格
```
- 定义:
```css
/* 布局容器 - 电路板风格 */
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

### 6. .root-directory-container
- 位置: 行 126, 索引 2568
- 注释:
```
根目录区域
```
- 定义:
```css
/* 根目录区域 */
display: flex;
      flex-direction: column;
      gap: 20px;
      position: relative;
```

### 7. .directory-card
- 位置: 行 134, 索引 2729
- 注释:
```
目录卡片样式
```
- 定义:
```css
/* 目录卡片样式 */
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

### 8. .card-content
- 位置: 行 148, 索引 3089
- 注释:
```
卡片内容区域平滑过渡效果
```
- 定义:
```css
/* 卡片内容区域平滑过渡效果 */
transition: height 0.3s ease-out, opacity 0.3s ease-out;
      overflow: hidden;
```

### 9. .directory-card.card-collapsed .card-content
- 位置: 行 154, 索引 3232
- 注释:
```
收起状态的卡片内容样式
```
- 定义:
```css
/* 收起状态的卡片内容样式 */
height: 0 !important;
      opacity: 0;
      padding: 0;
      margin: 0;
      border: none;
```

### 10. .directory-card.card-collapsed .card-header
- 位置: 行 163, 索引 3422
- 注释:
```
收起状态下标题栏底部边框隐藏
```
- 定义:
```css
/* 收起状态下标题栏底部边框隐藏 */
border-bottom: none;
```

### 11. .directory-card.card-collapsed
- 位置: 行 168, 索引 3536
- 注释:
```
收起状态的卡片样式
```
- 定义:
```css
/* 收起状态的卡片样式 */
border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
```

### 12. .directory-card.root
- 位置: 行 175, 索引 3734
- 注释:
```
根目录卡片
```
- 定义:
```css
/* 根目录卡片 */
margin-left: 0;
```

### 13. .card-connector
- 位置: 行 180, 索引 3815
- 注释:
```
卡片连接线
```
- 定义:
```css
/* 卡片连接线 */
position: absolute;
      border: 2px solid #4285f4;
      z-index: 1;
```

### 14. .connector-node
- 位置: 行 197, 索引 4137
- 注释:
```
卡片节点点
```
- 定义:
```css
/* 卡片节点点 */
position: absolute;
      width: 8px;
      height: 8px;
      background-color: #4285f4;
      border-radius: 50%;
      z-index: 1;
```

### 15. .card-actions
- 位置: 行 237, 索引 4926
- 注释:
```
卡片操作按钮
```
- 定义:
```css
/* 卡片操作按钮 */
display: flex;
      gap: 5px;
```

### 16. .card-content
- 位置: 行 263, 索引 5509
- 注释:
```
分栏布局
```
- 定义:
```css
/* 分栏布局 */
display: flex;
      height: 300px;
```

### 17. .file-item, .directory-item
- 位置: 行 289, 索引 6010
- 注释:
```
文件项样式
```
- 定义:
```css
/* 文件项样式 */
padding: 10px;
      border-bottom: 1px solid #eee;
      cursor: pointer;
      display: flex;
      align-items: center;
```

### 18. .selected-item
- 位置: 行 311, 索引 6443
- 注释:
```
选中项样式
```
- 定义:
```css
/* 选中项样式 */
padding: 10px;
      border-bottom: 1px solid #e0e0e0;
      background-color: #E8F5E9;
      display: flex;
      justify-content: space-between;
      align-items: center;
```

### 19. .editor-container
- 位置: 行 353, 索引 7359
- 注释:
```
文件编辑区域
```
- 定义:
```css
/* 文件编辑区域 */
margin-top: 20px;
      background-color: white;
      border-radius: 8px;
      padding: 15px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
```

### 20. .status-message
- 位置: 行 378, 索引 7891
- 注释:
```
状态消息
```
- 定义:
```css
/* 状态消息 */
padding: 10px;
      margin: 10px 0;
      border-radius: 4px;
      background-color: #e3f2fd;
      color: #0d47a1;
```

### 21. .context-menu
- 位置: 行 387, 索引 8072
- 注释:
```
右键菜单
```
- 定义:
```css
/* 右键菜单 */
position: absolute;
      background-color: white;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      padding: 5px 0;
      z-index: 1000;
```

### 22. @media (max-width: 1200px)
- 位置: 行 407, 索引 8498
- 注释:
```
响应式设计
```
- 定义:
```css
/* 响应式设计 */
body {
        flex-direction: column;
      }
      
      .debug-panel {
        width: 100%;
        height: auto;
        max-height: 300px;
      }
      
      .directory-card {
        width: 100%;
      }
```

### 23. /* 基本样式 */
    body
- 位置: 行 6, 索引 122
- 定义:
```css
<style>
font-family: Arial, sans-serif;
      padding: 0;
      margin: 0;
      background-color: #f5f5f5;
      display: flex;
      min-height: 100vh;
```

### 24. font-family: Arial, sans-serif;
      padding: 0;
      margin: 0;
      background-color: #f5f5f5;
      display: flex;
      min-height: 100vh;
    }
    
    /* 左侧调试面板 */
    .debug-panel
- 位置: 行 8, 索引 150
- 定义:
```css
body {
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
- 位置: 行 18, 索引 359
- 定义:
```css
.debug-panel {
font-size: 18px;
      margin-top: 0;
      padding-bottom: 10px;
      border-bottom: 1px solid #455A64;
```

### 26. font-size: 18px;
      margin-top: 0;
      padding-bottom: 10px;
      border-bottom: 1px solid #455A64;
    }
    
    .debug-section
- 位置: 行 30, 索引 610
- 定义:
```css
.debug-panel h2 {
margin-bottom: 20px;
```

### 27. margin-bottom: 20px;
    }
    
    .debug-section h3
- 位置: 行 37, 索引 761
- 定义:
```css
.debug-section {
font-size: 14px;
      color: #81D4FA;
      margin-top: 0;
      margin-bottom: 5px;
      display: flex;
      justify-content: space-between;
      align-items: center;
```

### 28. font-size: 14px;
      color: #81D4FA;
      margin-top: 0;
      margin-bottom: 5px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .debug-content
- 位置: 行 41, 索引 827
- 定义:
```css
.debug-section h3 {
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
- 位置: 行 51, 索引 1047
- 定义:
```css
.debug-content {
color: #FFD54F;
```

### 30. color: #FFD54F;
    }
    
    .debug-count
- 位置: 行 64, 索引 1359
- 定义:
```css
.debug-content.json {
background-color: #455A64;
      color: white;
      border-radius: 10px;
      padding: 2px 6px;
      font-size: 11px;
      margin-left: 5px;
```

### 31. background-color: #455A64;
      color: white;
      border-radius: 10px;
      padding: 2px 6px;
      font-size: 11px;
      margin-left: 5px;
    }
    
    /* 主内容区域 */
    .main-content
- 位置: 行 68, 索引 1415
- 定义:
```css
.debug-count {
flex-grow: 1;
      padding: 20px;
      box-sizing: border-box;
      overflow-y: auto;
      height: 100vh;
```

### 32. flex-grow: 1;
      padding: 20px;
      box-sizing: border-box;
      overflow-y: auto;
      height: 100vh;
    }
    
    /* 控制区域 */
    .controls
- 位置: 行 78, 索引 1623
- 定义:
```css
.main-content {
margin-bottom: 20px;
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
```

### 33. margin-bottom: 20px;
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    
    button
- 位置: 行 87, 索引 1790
- 定义:
```css
.controls {
padding: 8px 16px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
```

### 34. padding: 8px 16px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    
    button.danger
- 位置: 行 94, 索引 1909
- 定义:
```css
button {
background-color: #f44336;
```

### 35. background-color: #f44336;
    }
    
    button:disabled
- 位置: 行 103, 索引 2096
- 定义:
```css
button.danger {
background-color: #cccccc;
      cursor: not-allowed;
```

### 36. background-color: #cccccc;
      cursor: not-allowed;
    }
    
    /* 布局容器 - 电路板风格 */
    .board-container
- 位置: 行 107, 索引 2166
- 定义:
```css
button:disabled {
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
- 位置: 行 113, 索引 2289
- 定义:
```css
.board-container {
display: flex;
      flex-direction: column;
      gap: 20px;
      position: relative;
```

### 38. display: flex;
      flex-direction: column;
      gap: 20px;
      position: relative;
    }
    
    /* 目录卡片样式 */
    .directory-card
- 位置: 行 127, 索引 2612
- 定义:
```css
.root-directory-container {
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
- 位置: 行 135, 索引 2764
- 定义:
```css
.directory-card {
transition: height 0.3s ease-out, opacity 0.3s ease-out;
      overflow: hidden;
```

### 40. transition: height 0.3s ease-out, opacity 0.3s ease-out;
      overflow: hidden;
    }

    /* 收起状态的卡片内容样式 */
    .directory-card.card-collapsed .card-content
- 位置: 行 149, 索引 3128
- 定义:
```css
.card-content {
height: 0 !important;
      opacity: 0;
      padding: 0;
      margin: 0;
      border: none;
```

### 41. height: 0 !important;
      opacity: 0;
      padding: 0;
      margin: 0;
      border: none;
    }

    /* 收起状态下标题栏底部边框隐藏 */
    .directory-card.card-collapsed .card-header
- 位置: 行 155, 索引 3301
- 定义:
```css
.directory-card.card-collapsed .card-content {
border-bottom: none;
```

### 42. border-bottom: none;
    }

    /* 收起状态的卡片样式 */
    .directory-card.card-collapsed
- 位置: 行 164, 索引 3493
- 定义:
```css
.directory-card.card-collapsed .card-header {
border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
```

### 43. border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }
    
    /* 根目录卡片 */
    .directory-card.root
- 位置: 行 169, 索引 3589
- 定义:
```css
.directory-card.card-collapsed {
margin-left: 0;
```

### 44. margin-left: 0;
    }
    
    /* 卡片连接线 */
    .card-connector
- 位置: 行 176, 索引 3773
- 定义:
```css
.directory-card.root {
position: absolute;
      border: 2px solid #4285f4;
      z-index: 1;
```

### 45. position: absolute;
      border: 2px solid #4285f4;
      z-index: 1;
    }
    
    .connector-horizontal
- 位置: 行 181, 索引 3849
- 定义:
```css
.card-connector {
height: 2px;
      background-color: #4285f4;
```

### 46. height: 2px;
      background-color: #4285f4;
    }
    
    .connector-vertical
- 位置: 行 187, 索引 3971
- 定义:
```css
.connector-horizontal {
width: 2px;
      background-color: #4285f4;
```

### 47. width: 2px;
      background-color: #4285f4;
    }
    
    /* 卡片节点点 */
    .connector-node
- 位置: 行 192, 索引 4065
- 定义:
```css
.connector-vertical {
position: absolute;
      width: 8px;
      height: 8px;
      background-color: #4285f4;
      border-radius: 50%;
      z-index: 1;
```

### 48. position: absolute;
      width: 8px;
      height: 8px;
      background-color: #4285f4;
      border-radius: 50%;
      z-index: 1;
    }
    
    .card-header
- 位置: 行 198, 索引 4171
- 定义:
```css
.connector-node {
background-color: #4285f4;
      padding: 12px;
      border-bottom: 1px solid #ddd;
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
```

### 49. background-color: #4285f4;
      padding: 12px;
      border-bottom: 1px solid #ddd;
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .root .card-header
- 位置: 行 207, 索引 4350
- 定义:
```css
.card-header {
background-color: #FF5722;
```

### 50. background-color: #FF5722;
    }
    
    .card-title-section
- 位置: 行 217, 索引 4593
- 定义:
```css
.root .card-header {
flex-grow: 1;
```

### 51. flex-grow: 1;
    }
    
    .card-title
- 位置: 行 221, 索引 4667
- 定义:
```css
.card-title-section {
margin: 0;
      font-size: 16px;
      font-weight: bold;
```

### 52. margin: 0;
      font-size: 16px;
      font-weight: bold;
    }
    
    .card-info
- 位置: 行 225, 索引 4720
- 定义:
```css
.card-title {
font-size: 12px;
      margin-top: 5px;
      color: rgba(255, 255, 255, 0.8);
```

### 53. font-size: 12px;
      margin-top: 5px;
      color: rgba(255, 255, 255, 0.8);
    }
    
    /* 卡片操作按钮 */
    .card-actions
- 位置: 行 231, 索引 4819
- 定义:
```css
.card-info {
display: flex;
      gap: 5px;
```

### 54. display: flex;
      gap: 5px;
    }
    
    .card-collapse-btn, .card-close-btn
- 位置: 行 238, 索引 4959
- 定义:
```css
.card-actions {
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
- 位置: 行 243, 索引 5054
- 定义:
```css
.card-collapse-btn, .card-close-btn {
background-color: rgba(255, 255, 255, 0.2);
```

### 56. background-color: rgba(255, 255, 255, 0.2);
    }
    
    /* 分栏布局 */
    .card-content
- 位置: 行 259, 索引 5439
- 定义:
```css
.card-collapse-btn:hover, .card-close-btn:hover {
display: flex;
      height: 300px;
```

### 57. display: flex;
      height: 300px;
    }
    
    .content-left
- 位置: 行 264, 索引 5540
- 定义:
```css
.card-content {
flex: 1;
      border-right: 1px solid #eee;
      overflow-y: auto;
```

### 58. flex: 1;
      border-right: 1px solid #eee;
      overflow-y: auto;
    }
    
    .content-right
- 位置: 行 269, 索引 5618
- 定义:
```css
.content-left {
flex: 1;
      overflow-y: auto;
      background-color: #f9f9f9;
```

### 59. flex: 1;
      overflow-y: auto;
      background-color: #f9f9f9;
    }
    
    .content-right-header
- 位置: 行 275, 索引 5731
- 定义:
```css
.content-right {
padding: 10px;
      background-color: #E3F2FD;
      border-bottom: 1px solid #ddd;
      font-weight: bold;
      color: #0D47A1;
```

### 60. padding: 10px;
      background-color: #E3F2FD;
      border-bottom: 1px solid #ddd;
      font-weight: bold;
      color: #0D47A1;
    }
    
    /* 文件项样式 */
    .file-item, .directory-item
- 位置: 行 281, 索引 5848
- 定义:
```css
.content-right-header {
padding: 10px;
      border-bottom: 1px solid #eee;
      cursor: pointer;
      display: flex;
      align-items: center;
```

### 61. padding: 10px;
      border-bottom: 1px solid #eee;
      cursor: pointer;
      display: flex;
      align-items: center;
    }
    
    .file-item:hover, .directory-item:hover
- 位置: 行 290, 索引 6056
- 定义:
```css
.file-item, .directory-item {
background-color: #f0f0f0;
```

### 62. background-color: #f0f0f0;
    }
    
    .directory-item
- 位置: 行 298, 索引 6250
- 定义:
```css
.file-item:hover, .directory-item:hover {
color: #4285f4;
```

### 63. color: #4285f4;
    }
    
    .item-icon
- 位置: 行 302, 索引 6320
- 定义:
```css
.directory-item {
margin-right: 8px;
      font-size: 16px;
```

### 64. margin-right: 8px;
      font-size: 16px;
    }
    
    /* 选中项样式 */
    .selected-item
- 位置: 行 306, 索引 6374
- 定义:
```css
.item-icon {
padding: 10px;
      border-bottom: 1px solid #e0e0e0;
      background-color: #E8F5E9;
      display: flex;
      justify-content: space-between;
      align-items: center;
```

### 65. padding: 10px;
      border-bottom: 1px solid #e0e0e0;
      background-color: #E8F5E9;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .selected-item .item-name
- 位置: 行 312, 索引 6476
- 定义:
```css
.selected-item {
display: flex;
      align-items: center;
```

### 66. display: flex;
      align-items: center;
    }
    
    .remove-item
- 位置: 行 321, 索引 6708
- 定义:
```css
.selected-item .item-name {
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
- 位置: 行 326, 索引 6791
- 定义:
```css
.remove-item {
background-color: rgba(244, 67, 54, 0.1);
```

### 68. background-color: rgba(244, 67, 54, 0.1);
    }
    
    .empty-selection
- 位置: 行 342, 索引 7155
- 定义:
```css
.remove-item:hover {
padding: 20px;
      color: #757575;
      text-align: center;
      font-style: italic;
```

### 69. padding: 20px;
      color: #757575;
      text-align: center;
      font-style: italic;
    }
    
    /* 文件编辑区域 */
    .editor-container
- 位置: 行 346, 索引 7241
- 定义:
```css
.empty-selection {
margin-top: 20px;
      background-color: white;
      border-radius: 8px;
      padding: 15px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
```

### 70. margin-top: 20px;
      background-color: white;
      border-radius: 8px;
      padding: 15px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    
    .editor-label
- 位置: 行 354, 索引 7396
- 定义:
```css
.editor-container {
margin-bottom: 10px;
      font-weight: bold;
      color: #4285f4;
```

### 71. margin-bottom: 10px;
      font-weight: bold;
      color: #4285f4;
    }
    
    textarea
- 位置: 行 362, 索引 7582
- 定义:
```css
.editor-label {
width: 100%;
      height: 300px;
      padding: 10px;
      box-sizing: border-box;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-family: monospace;
```

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
- 位置: 行 368, 索引 7688
- 定义:
```css
textarea {
padding: 10px;
      margin: 10px 0;
      border-radius: 4px;
      background-color: #e3f2fd;
      color: #0d47a1;
```

### 73. padding: 10px;
      margin: 10px 0;
      border-radius: 4px;
      background-color: #e3f2fd;
      color: #0d47a1;
    }
    
    /* 右键菜单 */
    .context-menu
- 位置: 行 379, 索引 7924
- 定义:
```css
.status-message {
position: absolute;
      background-color: white;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      padding: 5px 0;
      z-index: 1000;
```

### 74. position: absolute;
      background-color: white;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      padding: 5px 0;
      z-index: 1000;
    }
    
    .context-menu-item
- 位置: 行 388, 索引 8103
- 定义:
```css
.context-menu {
padding: 8px 12px;
      cursor: pointer;
```

### 75. padding: 8px 12px;
      cursor: pointer;
    }
    
    .context-menu-item:hover
- 位置: 行 398, 索引 8350
- 定义:
```css
.context-menu-item {
background-color: #f0f0f0;
```

### 76. background-color: #f0f0f0;
    }
    
    /* 响应式设计 */
    @media (max-width: 1200px)
- 位置: 行 403, 索引 8445
- 定义:
```css
.context-menu-item:hover {
body {
        flex-direction: column;
      }
      
      .debug-panel {
        width: 100%;
        height: auto;
        max-height: 300px;
      }
      
      .directory-card {
        width: 100%;
      }
```

### 77. flex-direction: column;
      }
      
      .debug-panel
- 位置: 行 409, 索引 8557
- 定义:
```css
body {
width: 100%;
        height: auto;
        max-height: 300px;
```

### 78. width: 100%;
        height: auto;
        max-height: 300px;
      }
      
      .directory-card
- 位置: 行 413, 索引 8629
- 定义:
```css
.debug-panel {
width: 100%;
```

## HTML 元素

### 1. div.debug-panel
- 位置: 行 427, 索引 8834
- 注释:
```
左侧调试面板
```
- 定义:
```html
<div class="debug-panel">
```

### 2. div.debug-section
- 位置: 行 430, 索引 8892
- 定义:
```html
<div class="debug-section">
```

### 3. span#openedDirCount
- 位置: 行 431, 索引 8949
- 定义:
```html
<h3>openedDirectories <span class="debug-count" id="openedDirCount">0</span></h3>
```

### 4. div#openedDirectoriesDebug
- 位置: 行 432, 索引 9016
- 定义:
```html
<div class="debug-content json" id="openedDirectoriesDebug"></div>
```

### 5. div.debug-section
- 位置: 行 435, 索引 9106
- 定义:
```html
<div class="debug-section">
```

### 6. span#relationshipsCount
- 位置: 行 436, 索引 9168
- 定义:
```html
<h3>directoryRelationships <span class="debug-count" id="relationshipsCount">0</span></h3>
```

### 7. div#relationshipsDebug
- 位置: 行 437, 索引 9239
- 定义:
```html
<div class="debug-content json" id="relationshipsDebug"></div>
```

### 8. div.debug-section
- 位置: 行 440, 索引 9325
- 定义:
```html
<div class="debug-section">
```

### 9. span#rootDirCount
- 位置: 行 441, 索引 9380
- 定义:
```html
<h3>rootDirectories <span class="debug-count" id="rootDirCount">0</span></h3>
```

### 10. div#rootDirectoriesDebug
- 位置: 行 442, 索引 9445
- 定义:
```html
<div class="debug-content json" id="rootDirectoriesDebug"></div>
```

### 11. div.debug-section
- 位置: 行 445, 索引 9533
- 定义:
```html
<div class="debug-section">
```

### 12. span#selectedItemsCount
- 位置: 行 446, 索引 9586
- 定义:
```html
<h3>selectedItems <span class="debug-count" id="selectedItemsCount">0</span></h3>
```

### 13. div#selectedItemsDebug
- 位置: 行 447, 索引 9657
- 定义:
```html
<div class="debug-content json" id="selectedItemsDebug"></div>
```

### 14. div.debug-section
- 位置: 行 450, 索引 9743
- 定义:
```html
<div class="debug-section">
```

### 15. span#dirHandleMapCount
- 位置: 行 451, 索引 9795
- 定义:
```html
<h3>dirHandleMap <span class="debug-count" id="dirHandleMapCount">0</span></h3>
```

### 16. div#dirHandleMapDebug
- 位置: 行 452, 索引 9865
- 定义:
```html
<div class="debug-content json" id="dirHandleMapDebug"></div>
```

### 17. div.debug-section
- 位置: 行 455, 索引 9950
- 定义:
```html
<div class="debug-section">
```

### 18. div#globalVarsDebug
- 位置: 行 457, 索引 10006
- 定义:
```html
<div class="debug-content" id="globalVarsDebug"></div>
```

### 19. div.main-content
- 位置: 行 462, 索引 10108
- 注释:
```
主内容区域
```
- 定义:
```html
<div class="main-content">
```

### 20. div.controls
- 位置: 行 463, 索引 10140
- 定义:
```html
<div class="controls">
```

### 21. button#addDirectoryButton
- 位置: 行 464, 索引 10170
- 定义:
```html
<button id="addDirectoryButton">添加目录</button>
```

### 22. button.danger
- 位置: 行 465, 索引 10223
- 定义:
```html
<button id="clearAllButton" class="danger">清空所有</button>
```

### 23. button#saveChangesButton
- 位置: 行 466, 索引 10287
- 定义:
```html
<button id="saveChangesButton" disabled>保存修改</button>
```

### 24. div.board-container
- 位置: 行 469, 索引 10364
- 定义:
```html
<div id="boardContainer" class="board-container">
```

### 25. div.editor-container
- 位置: 行 473, 索引 10467
- 定义:
```html
<div class="editor-container">
```

### 26. textarea#fileContentEditor
- 位置: 行 474, 索引 10505
- 定义:
```html
<textarea id="fileContentEditor" placeholder="选择一个文件以查看和编辑其内容" disabled></textarea>
```

### 27. div.item-name
- 位置: 行 984, 索引 26838
- 定义:
```html
<div class="item-name"><span class="item-icon">${icon}</span> ${itemName}</div>
```

### 28. span.item-icon
- 位置: 行 984, 索引 26861
- 定义:
```html
<div class="item-name"><span class="item-icon">${icon}</span> ${itemName}</div>
```

### 29. button.remove-item
- 位置: 行 985, 索引 26929
- 定义:
```html
<button class="remove-item" title="移除">×</button>
```

### 30. span.item-icon
- 位置: 行 1022, 索引 28161
- 定义:
```html
entryElement.innerHTML = `<span class="item-icon">📁</span> ${entry.name}`;
```

### 31. span.item-icon
- 位置: 行 1035, 索引 28720
- 定义:
```html
entryElement.innerHTML = `<span class="item-icon">📄</span> ${entry.name}`;
```

### 32. div.error
- 位置: 行 1053, 索引 29373
- 定义:
```html
contentLeft.innerHTML = `<div class="error">加载失败: ${error.message}</div>`;
```

提示：使用上述信息生成补丁文件，描述每个命名元素的原始定义及其上下文。