## HTML文件语料

### 文件元数据
- 标题: 文件系统访问 API - 多目录电路板式浏览
- 字符集: UTF-8
- 总行数: 1449
- 脚本数量: 1
- 样式表数量: 1

### 函数列表

#### 1. updateDebugPanel (function)
- 行号: 522
- 参数: 
- 代码:
```javascript
/**
     * @function updateDebugPanel
     * @description 更新调试面板的内容，显示原始数据结构
     */
    function updateDebugPanel() {
      // 转换 Map 和 Set 为对象和数组以便更好地展示
      // openedDirectories Map
      const openedDirsObj = {};
      openedDirectories.forEach((dirHandle, cardId) => {
        openedDirsObj[cardId] = {
          name: dirHandle.name,
          kind: dirHandle.kind,
          isRoot: rootDirectories.has(cardId)
}
```

#### 2. getExistingCardId (function)
- 行号: 581
- 参数: dirHandle
- 代码:
```javascript
/**
     * @function isDirectoryAlreadyOpen
     * @description 检查目录是否已经打开
     * @param {FileSystemDirectoryHandle} dirHandle 目录句柄
     * @returns {boolean} 目录是否已经打开
     */
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
     * @function getExistingCardId
     * @description 获取已打开目录的卡片ID
     * @param {FileSystemDirectoryHandle} dirHandle 目录句柄
     * @returns {string|null} 卡片ID，如果未打开则返回null
     */
    function getExistingCardId(dirHandle) {
      const path = dirHandle.name;
      return dirHandleMap.get(path) || null;
}
```

#### 3. createRootContainer (function)
- 行号: 611
- 参数: 
- 代码:
```javascript
/**
     * @function createRootContainer
     * @description 创建根目录容器
     * @returns {string} 容器ID
     */
    function createRootContainer() {
      const containerId = `root_container_${rootContainerIdCounter++}`;
      
      const container = document.createElement('div');
      container.className = 'root-directory-container';
      container.id = containerId;
      
      boardContainer.appendChild(container);
      
      return containerId;
}
```

#### 4. createDirectoryCard (function)
- 行号: 628
- 参数: directoryName, dirHandle, parentCardId = null, containerID = null
- 代码:
```javascript
/**
     * @function createDirectoryCard
     * @description 创建目录卡片
     * @param {string} directoryName 目录名称
     * @param {FileSystemDirectoryHandle} dirHandle 目录句柄
     * @param {string|null} parentCardId 父卡片ID
     * @param {string|null} containerID 容器ID
     * @returns {HTMLElement} 创建的卡片元素
     */
    function createDirectoryCard(directoryName, dirHandle, parentCardId = null, containerID = null) {
      // 生成唯一卡片ID
      const cardId = `card_${cardIdCounter++}`;
      
      const card = document.createElement('div');
      card.className = parentCardId ? 'directory-card' : 'directory-card root';
      card.id = cardId;
      card.dataset.name = directoryName;
      
      if (!parentCardId) {
        rootDirectories.add(cardId);
}
```

#### 5. findRootContainer (function)
- 行号: 785
- 参数: cardId
- 代码:
```javascript
/**
     * @function findRootContainer
     * @description 查找卡片所属的根容器
     * @param {string} cardId 卡片ID
     * @returns {string} 根容器ID
     */
    function findRootContainer(cardId) {
      // 如果是根卡片，直接返回其父容器
      const card = document.getElementById(cardId);
      if (!card) return null;
      
      return card.parentElement.id;
}
```

#### 6. closeCard (function)
- 行号: 799
- 参数: cardId
- 代码:
```javascript
/**
     * @function closeCard
     * @description 关闭卡片及其所有子卡片
     * @param {string} cardId 要关闭的卡片ID
     */
    function closeCard(cardId) {
      // 查找所有子卡片
      const childCardIds = [];
      for (const [childId, parentId] of directoryRelationships.entries()) {
        if (parentId === cardId) {
          childCardIds.push(childId);
}
```

#### 7. clearAllCards (function)
- 行号: 854
- 参数: 
- 代码:
```javascript
/**
     * @function clearAllCards
     * @description 清空所有卡片
     */
    function clearAllCards() {
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
```

#### 8. selectItem (function)
- 行号: 888
- 参数: cardId, itemType, itemName
- 代码:
```javascript
/**
     * @function selectItem
     * @description 选中项目并添加到右侧面板
     * @param {string} cardId 卡片ID
     * @param {string} itemType 项目类型 ('file' 或 'directory')
     * @param {string} itemName 项目名称
     */
    function selectItem(cardId, itemType, itemName) {
      // 获取选中项集合
      if (!selectedItemsPerCard.has(cardId)) {
        selectedItemsPerCard.set(cardId, new Set());
}
```

#### 9. removeSelectedItem (function)
- 行号: 920
- 参数: cardId, itemId
- 代码:
```javascript
/**
     * @function removeSelectedItem
     * @description 从选中项中移除
     * @param {string} cardId 卡片ID
     * @param {string} itemId 项目ID
     */
    function removeSelectedItem(cardId, itemId) {
      // 获取选中项集合
      const selectedItems = selectedItemsPerCard.get(cardId);
      if (!selectedItems) return;
      
      // 从集合中移除
      selectedItems.delete(itemId);
      
      // 更新右侧面板
      updateSelectedItemsPanel(cardId);
      
      // 更新调试面板
      updateDebugPanel();
}
```

#### 10. updateSelectedItemsPanel (function)
- 行号: 941
- 参数: cardId
- 代码:
```javascript
/**
     * @function updateSelectedItemsPanel
     * @description 更新卡片右侧的已选中项面板
     * @param {string} cardId 卡片ID
     */
    function updateSelectedItemsPanel(cardId) {
      const card = document.getElementById(cardId);
      if (!card) return;
      
      const contentRight = card.querySelector('.content-right');
      const headerElement = contentRight.querySelector('.content-right-header');
      
      // 清空现有内容，但保留标题
      const children = Array.from(contentRight.children);
      children.forEach(child => {
        if (!child.classList.contains('content-right-header')) {
          child.remove();
}
```

#### 11. showStatusMessage (function)
- 行号: 997
- 参数: message, isError = false
- 代码:
```javascript
/**
     * @function fillCardWithDirectoryContents
     * @description 填充卡片内容区域
     * @param {HTMLElement} contentLeft 左侧内容元素
     * @param {HTMLElement} cardInfo 卡片信息元素
     * @param {FileSystemDirectoryHandle} dirHandle 目录句柄
     * @param {string} cardId 卡片ID
     * @async
     */
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
     * @function handleDirectorySelectionAndDisplay
     * @description 处理用户选择目录并展示其内容
     * @async
     */
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
     * @function showStatusMessage
     * @description 显示状态消息
     * @param {string} message 消息内容
     * @param {boolean} isError 是否为错误消息
     */
    function showStatusMessage(message, isError = false) {
      // 创建或获取状态消息元素
      let statusMessage = document.querySelector('.status-message');
      
      if (!statusMessage) {
        statusMessage = document.createElement('div');
        statusMessage.className = 'status-message';
        document.querySelector('.controls').insertAdjacentElement('afterend', statusMessage);
}
```

#### 12. createConnectorLines (function)
- 行号: 1125
- 参数: parentCard, childCard
- 代码:
```javascript
/**
     * @function createConnectorLines
     * @description 创建连接父卡片和子卡片的连接线
     * @param {HTMLElement} parentCard 父卡片元素
     * @param {HTMLElement} childCard 子卡片元素
     */
    function createConnectorLines(parentCard, childCard) {
      const parentRect = parentCard.getBoundingClientRect();
      const childRect = childCard.getBoundingClientRect();
      const containerRect = parentCard.parentElement.getBoundingClientRect();

      // 计算连接点位置 - 始终连接到标题区域中心
      const parentHeader = parentCard.querySelector('.card-header');
      const childHeader = childCard.querySelector('.card-header');

      const parentHeaderRect = parentHeader.getBoundingClientRect();
      const childHeaderRect = childHeader.getBoundingClientRect();

      // 计算相对于容器的位置
      const parentRelX = parentRect.left - containerRect.left + parentRect.width;
      const parentRelY = parentHeaderRect.top - containerRect.top + parentHeaderRect.height / 2; // 从卡片头部中间位置
      const childRelX = childRect.left - containerRect.left;
      const childRelY = childHeaderRect.top - containerRect.top + childHeaderRect.height / 2; // 到卡片头部中间位置
      
      // 创建水平线（从父卡片到垂直线）
      const horizontalLine = document.createElement('div');
      horizontalLine.className = `card-connector connector-horizontal connector-for-${childCard.id}`;
      horizontalLine.style.position = 'absolute';
      horizontalLine.style.left = `${parentRelX}px`;
      horizontalLine.style.top = `${parentRelY}px`;
      horizontalLine.style.width = `${(childRelX - parentRelX) / 2}px`;
      horizontalLine.style.height = '2px';
      parentCard.parentElement.appendChild(horizontalLine);
      
      // 创建垂直线（连接两个水平线）
      const verticalLine = document.createElement('div');
      verticalLine.className = `card-connector connector-vertical connector-for-${childCard.id}`;
      verticalLine.style.position = 'absolute';
      verticalLine.style.left = `${parentRelX + (childRelX - parentRelX) / 2}px`;
      verticalLine.style.top = `${Math.min(parentRelY, childRelY)}px`;
      verticalLine.style.width = '2px';
      verticalLine.style.height = `${Math.abs(childRelY - parentRelY)}px`;
      parentCard.parentElement.appendChild(verticalLine);
      
      // 创建水平线（从垂直线到子卡片）
      const horizontalLine2 = document.createElement('div');
      horizontalLine2.className = `card-connector connector-horizontal connector-for-${childCard.id}`;
      horizontalLine2.style.position = 'absolute';
      horizontalLine2.style.left = `${parentRelX + (childRelX - parentRelX) / 2}px`;
      horizontalLine2.style.top = `${childRelY}px`;
      horizontalLine2.style.width = `${(childRelX - parentRelX) / 2}px`;
      horizontalLine2.style.height = '2px';
      parentCard.parentElement.appendChild(horizontalLine2);
      
      // 为交叉点添加节点点
      const node1 = document.createElement('div');
      node1.className = `connector-node connector-for-${childCard.id}`;
      node1.style.left = `${parentRelX + (childRelX - parentRelX) / 2 - 4}px`;
      node1.style.top = `${parentRelY - 4}px`;
      parentCard.parentElement.appendChild(node1);
      
      const node2 = document.createElement('div');
      node2.className = `connector-node connector-for-${childCard.id}`;
      node2.style.left = `${parentRelX + (childRelX - parentRelX) / 2 - 4}px`;
      node2.style.top = `${childRelY - 4}px`;
      parentCard.parentElement.appendChild(node2);
}
```

#### 13. toggleCardCollapse (function)
- 行号: 1193
- 参数: card
- 代码:
```javascript
/**
     * @function handleDirectoryClick
     * @description 处理目录点击，打开子目录
     * @param {FileSystemDirectoryHandle} dirHandle 目录句柄
     * @param {string} parentCardId 父卡片ID
     * @async
     */
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
     * @function handleFileReadAsText
     * @description 将文件作为文本读取并显示
     * @param {FileSystemFileHandle} fileHandle 文件句柄
     * @async
     */
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
     * @function toggleCardCollapse
     * @description 切换卡片的收起/展开状态
     * @param {HTMLElement} card 要切换的卡片元素
     */
    function toggleCardCollapse(card) {
      const wasCollapsed = card.classList.contains('card-collapsed');
      const cardContent = card.querySelector('.card-content');
      const isCurrentlyCollapsed = card.classList.contains('card-collapsed');

      // 展开卡片
      if (isCurrentlyCollapsed) {
        // 设置初始高度为0
        cardContent.style.height = '0px';
        card.classList.remove('card-collapsed');

        // 获取展开后的高度
        const expandedHeight = cardContent.scrollHeight + 'px';

        // 动画过渡到展开高度
        setTimeout(() => {
          cardContent.style.height = expandedHeight;
          cardContent.style.opacity = '1';

          // 动画完成后移除内联高度，允许自然调整
          setTimeout(() => {
            cardContent.style.height = '';
}
```

#### 14. updateConnectors (function)
- 行号: 1349
- 参数: 
- 代码:
```javascript
/**
     * @function updateConnectors
     * @description 更新所有连接线位置
     */
    function updateConnectors() {
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
```

### CSS规则

#### 1. <style>
    /* 基本样式 */
    body
- 行号: 5
- 规则:
```css
  <style>
    /* 基本样式 */
    body {
      font-family: Arial, sans-serif;
      padding: 0;
      margin: 0;
      background-color: #f5f5f5;
      display: flex;
      min-height: 100vh;
    }
```

#### 2. /* 左侧调试面板 */
    .debug-panel
- 行号: 14
- 规则:
```css

    
    /* 左侧调试面板 */
    .debug-panel {
      width: 280px;
      background-color: #263238;
      color: #fff;
      padding: 15px;
      box-sizing: border-box;
      overflow-y: auto;
      height: 100vh;
      position: sticky;
      top: 0;
    }
```

#### 3. .debug-panel h2
- 行号: 27
- 规则:
```css

    
    .debug-panel h2 {
      font-size: 18px;
      margin-top: 0;
      padding-bottom: 10px;
      border-bottom: 1px solid #455A64;
    }
```

#### 4. .debug-section
- 行号: 34
- 规则:
```css

    
    .debug-section {
      margin-bottom: 20px;
    }
```

#### 5. .debug-section h3
- 行号: 38
- 规则:
```css

    
    .debug-section h3 {
      font-size: 14px;
      color: #81D4FA;
      margin-top: 0;
      margin-bottom: 5px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
```

#### 6. .debug-content
- 行号: 48
- 规则:
```css

    
    .debug-content {
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
    }
```

#### 7. .debug-content.json
- 行号: 61
- 规则:
```css

    
    .debug-content.json {
      color: #FFD54F;
    }
```

#### 8. .debug-count
- 行号: 65
- 规则:
```css

    
    .debug-count {
      background-color: #455A64;
      color: white;
      border-radius: 10px;
      padding: 2px 6px;
      font-size: 11px;
      margin-left: 5px;
    }
```

#### 9. /* 主内容区域 */
    .main-content
- 行号: 74
- 规则:
```css

    
    /* 主内容区域 */
    .main-content {
      flex-grow: 1;
      padding: 20px;
      box-sizing: border-box;
      overflow-y: auto;
      height: 100vh;
    }
```

#### 10. /* 控制区域 */
    .controls
- 行号: 83
- 规则:
```css

    
    /* 控制区域 */
    .controls {
      margin-bottom: 20px;
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
```

#### 11. button
- 行号: 91
- 规则:
```css

    
    button {
      padding: 8px 16px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
```

#### 12. button.danger
- 行号: 100
- 规则:
```css

    
    button.danger {
      background-color: #f44336;
    }
```

#### 13. button:disabled
- 行号: 104
- 规则:
```css

    
    button:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }
```

#### 14. /* 布局容器 - 电路板风格 */
    .board-container
- 行号: 109
- 规则:
```css

    
    /* 布局容器 - 电路板风格 */
    .board-container {
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
    }
```

#### 15. /* 根目录区域 */
    .root-directory-container
- 行号: 123
- 规则:
```css

    
    /* 根目录区域 */
    .root-directory-container {
      display: flex;
      flex-direction: column;
      gap: 20px;
      position: relative;
    }
```

#### 16. /* 目录卡片样式 */
    .directory-card
- 行号: 131
- 规则:
```css

    
    /* 目录卡片样式 */
    .directory-card {
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
    }
```

#### 17. /* 卡片内容区域平滑过渡效果 */
    .card-content
- 行号: 145
- 规则:
```css


    /* 卡片内容区域平滑过渡效果 */
    .card-content {
      transition: height 0.3s ease-out, opacity 0.3s ease-out;
      overflow: hidden;
    }
```

#### 18. /* 收起状态的卡片内容样式 */
    .directory-card.card-collapsed .card-content
- 行号: 151
- 规则:
```css


    /* 收起状态的卡片内容样式 */
    .directory-card.card-collapsed .card-content {
      height: 0 !important;
      opacity: 0;
      padding: 0;
      margin: 0;
      border: none;
    }
```

#### 19. /* 收起状态下标题栏底部边框隐藏 */
    .directory-card.card-collapsed .card-header
- 行号: 160
- 规则:
```css


    /* 收起状态下标题栏底部边框隐藏 */
    .directory-card.card-collapsed .card-header {
      border-bottom: none;
    }
```

#### 20. /* 收起状态的卡片样式 */
    .directory-card.card-collapsed
- 行号: 165
- 规则:
```css


    /* 收起状态的卡片样式 */
    .directory-card.card-collapsed {
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }
```

#### 21. /* 根目录卡片 */
    .directory-card.root
- 行号: 172
- 规则:
```css

    
    /* 根目录卡片 */
    .directory-card.root {
      margin-left: 0;
    }
```

#### 22. /* 卡片连接线 */
    .card-connector
- 行号: 177
- 规则:
```css

    
    /* 卡片连接线 */
    .card-connector {
      position: absolute;
      border: 2px solid #4285f4;
      z-index: 1;
    }
```

#### 23. .connector-horizontal
- 行号: 184
- 规则:
```css

    
    .connector-horizontal {
      height: 2px;
      background-color: #4285f4;
    }
```

#### 24. .connector-vertical
- 行号: 189
- 规则:
```css

    
    .connector-vertical {
      width: 2px;
      background-color: #4285f4;
    }
```

#### 25. /* 卡片节点点 */
    .connector-node
- 行号: 194
- 规则:
```css

    
    /* 卡片节点点 */
    .connector-node {
      position: absolute;
      width: 8px;
      height: 8px;
      background-color: #4285f4;
      border-radius: 50%;
      z-index: 1;
    }
```

#### 26. .card-header
- 行号: 204
- 规则:
```css

    
    .card-header {
      background-color: #4285f4;
      padding: 12px;
      border-bottom: 1px solid #ddd;
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
```

#### 27. .root .card-header
- 行号: 214
- 规则:
```css

    
    .root .card-header {
      background-color: #FF5722;
    }
```

#### 28. .card-title-section
- 行号: 218
- 规则:
```css

    
    .card-title-section {
      flex-grow: 1;
    }
```

#### 29. .card-title
- 行号: 222
- 规则:
```css

    
    .card-title {
      margin: 0;
      font-size: 16px;
      font-weight: bold;
    }
```

#### 30. .card-info
- 行号: 228
- 规则:
```css

    
    .card-info {
      font-size: 12px;
      margin-top: 5px;
      color: rgba(255, 255, 255, 0.8);
    }
```

#### 31. /* 卡片操作按钮 */
    .card-actions
- 行号: 234
- 规则:
```css

    
    /* 卡片操作按钮 */
    .card-actions {
      display: flex;
      gap: 5px;
    }
```

#### 32. .card-collapse-btn, .card-close-btn
- 行号: 240
- 规则:
```css

    
    .card-collapse-btn, .card-close-btn {
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
    }
```

#### 33. .card-collapse-btn:hover, .card-close-btn:hover
- 行号: 256
- 规则:
```css

    
    .card-collapse-btn:hover, .card-close-btn:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }
```

#### 34. /* 分栏布局 */
    .card-content
- 行号: 260
- 规则:
```css

    
    /* 分栏布局 */
    .card-content {
      display: flex;
      height: 300px;
    }
```

#### 35. .content-left
- 行号: 266
- 规则:
```css

    
    .content-left {
      flex: 1;
      border-right: 1px solid #eee;
      overflow-y: auto;
    }
```

#### 36. .content-right
- 行号: 272
- 规则:
```css

    
    .content-right {
      flex: 1;
      overflow-y: auto;
      background-color: #f9f9f9;
    }
```

#### 37. .content-right-header
- 行号: 278
- 规则:
```css

    
    .content-right-header {
      padding: 10px;
      background-color: #E3F2FD;
      border-bottom: 1px solid #ddd;
      font-weight: bold;
      color: #0D47A1;
    }
```

#### 38. /* 文件项样式 */
    .file-item, .directory-item
- 行号: 286
- 规则:
```css

    
    /* 文件项样式 */
    .file-item, .directory-item {
      padding: 10px;
      border-bottom: 1px solid #eee;
      cursor: pointer;
      display: flex;
      align-items: center;
    }
```

#### 39. .file-item:hover, .directory-item:hover
- 行号: 295
- 规则:
```css

    
    .file-item:hover, .directory-item:hover {
      background-color: #f0f0f0;
    }
```

#### 40. .directory-item
- 行号: 299
- 规则:
```css

    
    .directory-item {
      color: #4285f4;
    }
```

#### 41. .item-icon
- 行号: 303
- 规则:
```css

    
    .item-icon {
      margin-right: 8px;
      font-size: 16px;
    }
```

#### 42. /* 选中项样式 */
    .selected-item
- 行号: 308
- 规则:
```css

    
    /* 选中项样式 */
    .selected-item {
      padding: 10px;
      border-bottom: 1px solid #e0e0e0;
      background-color: #E8F5E9;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
```

#### 43. .selected-item .item-name
- 行号: 318
- 规则:
```css

    
    .selected-item .item-name {
      display: flex;
      align-items: center;
    }
```

#### 44. .remove-item
- 行号: 323
- 规则:
```css

    
    .remove-item {
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
    }
```

#### 45. .remove-item:hover
- 行号: 339
- 规则:
```css

    
    .remove-item:hover {
      background-color: rgba(244, 67, 54, 0.1);
    }
```

#### 46. .empty-selection
- 行号: 343
- 规则:
```css

    
    .empty-selection {
      padding: 20px;
      color: #757575;
      text-align: center;
      font-style: italic;
    }
```

#### 47. /* 文件编辑区域 */
    .editor-container
- 行号: 350
- 规则:
```css

    
    /* 文件编辑区域 */
    .editor-container {
      margin-top: 20px;
      background-color: white;
      border-radius: 8px;
      padding: 15px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
```

#### 48. .editor-label
- 行号: 359
- 规则:
```css

    
    .editor-label {
      margin-bottom: 10px;
      font-weight: bold;
      color: #4285f4;
    }
```

#### 49. textarea
- 行号: 365
- 规则:
```css

    
    textarea {
      width: 100%;
      height: 300px;
      padding: 10px;
      box-sizing: border-box;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-family: monospace;
    }
```

#### 50. /* 状态消息 */
    .status-message
- 行号: 375
- 规则:
```css

    
    /* 状态消息 */
    .status-message {
      padding: 10px;
      margin: 10px 0;
      border-radius: 4px;
      background-color: #e3f2fd;
      color: #0d47a1;
    }
```

#### 51. /* 右键菜单 */
    .context-menu
- 行号: 384
- 规则:
```css

    
    /* 右键菜单 */
    .context-menu {
      position: absolute;
      background-color: white;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      padding: 5px 0;
      z-index: 1000;
    }
```

#### 52. .context-menu-item
- 行号: 395
- 规则:
```css

    
    .context-menu-item {
      padding: 8px 12px;
      cursor: pointer;
    }
```

#### 53. .context-menu-item:hover
- 行号: 400
- 规则:
```css

    
    .context-menu-item:hover {
      background-color: #f0f0f0;
    }
```

#### 54. /* 响应式设计 */
    @media (max-width: 1200px)
- 行号: 404
- 规则:
```css

    
    /* 响应式设计 */
    @media (max-width: 1200px) {
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
    }
```

### HTML结构

#### 主要容器元素
- div#openedDirectoriesDebug (行 431)
- div#relationshipsDebug (行 436)
- div#rootDirectoriesDebug (行 441)
- div#selectedItemsDebug (行 446)
- div#dirHandleMapDebug (行 451)
- div#globalVarsDebug (行 456)
- div#boardContainer (行 468)
