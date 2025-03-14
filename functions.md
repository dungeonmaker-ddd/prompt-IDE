## 函数定义

### 1. updateDebugPanel
- 类型: function
- 参数: 
- 外部变量: openedDirectories, openedDirsObj, dirHandle, cardId, rootDirectories
- 代码:
```javascript
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

### 2. isDirectoryAlreadyOpen
- 类型: function
- 参数: dirHandle
- 外部变量: path, dirHandle, dirHandleMap
- 代码:
```javascript
function isDirectoryAlreadyOpen(dirHandle) {
// 尝试获取唯一标识符
      try {
        // 使用目录名称作为简单的标识符
        // 在实际应用中可能需要更复杂的逻辑来确定唯一性
        const path = dirHandle.name;
        return dirHandleMap.has(path);
}
```

### 3. getExistingCardId
- 类型: function
- 参数: dirHandle
- 外部变量: path, dirHandle, dirHandleMap
- 代码:
```javascript
function getExistingCardId(dirHandle) {
const path = dirHandle.name;
      return dirHandleMap.get(path) || null;
}
```

### 4. createRootContainer
- 类型: function
- 参数: 
- 外部变量: containerId, rootContainerIdCounter, container, boardContainer
- 代码:
```javascript
function createRootContainer() {
const containerId = `root_container_${rootContainerIdCounter++}`;
      
      const container = document.createElement('div');
      container.className = 'root-directory-container';
      container.id = containerId;
      
      boardContainer.appendChild(container);
      
      return containerId;
}
```

### 5. createDirectoryCard
- 类型: function
- 参数: directoryName, dirHandle, parentCardId = null, containerID = null
- 外部变量: cardId, cardIdCounter, card, rootDirectories
- 代码:
```javascript
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

### 6. findRootContainer
- 类型: function
- 参数: cardId
- 外部变量: card, cardId
- 代码:
```javascript
function findRootContainer(cardId) {
// 如果是根卡片，直接返回其父容器
      const card = document.getElementById(cardId);
      if (!card) return null;
      
      return card.parentElement.id;
}
```

### 7. closeCard
- 类型: function
- 参数: cardId
- 外部变量: childCardIds, directoryRelationships, cardId
- 代码:
```javascript
function closeCard(cardId) {
// 查找所有子卡片
      const childCardIds = [];
      for (const [childId, parentId] of directoryRelationships.entries()) {
        if (parentId === cardId) {
          childCardIds.push(childId);
}
```

### 8. clearAllCards
- 类型: function
- 参数: 
- 外部变量: rootIds, rootDirectories, cardId, openedDirectories, directoryRelationships, selectedItemsPerCard, dirHandleMap, fileContentEditor, saveChangesButton, currentFileHandle, existingLabel
- 代码:
```javascript
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

### 9. selectItem
- 类型: function
- 参数: cardId, itemType, itemName
- 外部变量: selectedItemsPerCard, cardId
- 代码:
```javascript
function selectItem(cardId, itemType, itemName) {
// 获取选中项集合
      if (!selectedItemsPerCard.has(cardId)) {
        selectedItemsPerCard.set(cardId, new Set());
}
```

### 10. removeSelectedItem
- 类型: function
- 参数: cardId, itemId
- 外部变量: selectedItems, selectedItemsPerCard, cardId, itemId
- 代码:
```javascript
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

### 11. updateSelectedItemsPanel
- 类型: function
- 参数: cardId
- 外部变量: card, cardId, contentRight, headerElement, children
- 代码:
```javascript
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

### 12. fillCardWithDirectoryContents
- 类型: function
- 参数: contentLeft, cardInfo, dirHandle, cardId
- 外部变量: contentLeft, fileCount, dirCount, dirHandle, entryElement, icon, cardId
- 代码:
```javascript
function fillCardWithDirectoryContents(contentLeft, cardInfo, dirHandle, cardId) {
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
}
```

### 13. handleDirectorySelectionAndDisplay
- 类型: function
- 参数: 
- 外部变量: dirHandle
- 代码:
```javascript
function handleDirectorySelectionAndDisplay() {
try {
        // 请求读写权限以支持编辑操作
        const dirHandle = await window.showDirectoryPicker({
          mode: 'readwrite' // 需要读写权限
}
```

### 14. showStatusMessage
- 类型: function
- 参数: message, isError = false
- 外部变量: statusMessage
- 代码:
```javascript
function showStatusMessage(message, isError = false) {
// 创建或获取状态消息元素
      let statusMessage = document.querySelector('.status-message');
      
      if (!statusMessage) {
        statusMessage = document.createElement('div');
        statusMessage.className = 'status-message';
        document.querySelector('.controls').insertAdjacentElement('afterend', statusMessage);
}
```

### 15. createConnectorLines
- 类型: function
- 参数: parentCard, childCard
- 外部变量: parentRect, parentCard, childRect, childCard, containerRect, parentHeader, card, childHeader, parentHeaderRect, childHeaderRect, parentRelX, parentRelY, childRelX, childRelY, horizontalLine, verticalLine, horizontalLine2, node1, node2
- 代码:
```javascript
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

### 16. handleDirectoryClick
- 类型: function
- 参数: dirHandle, parentCardId
- 外部变量: dirHandle, existingCardId, card
- 代码:
```javascript
function handleDirectoryClick(dirHandle, parentCardId) {
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
```

### 17. handleFileReadAsText
- 类型: function
- 参数: fileHandle
- 外部变量: file, textContent, fileContentEditor, saveChangesButton, currentFileHandle, editorLabel, existingLabel
- 代码:
```javascript
function handleFileReadAsText(fileHandle) {
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
```

### 18. toggleCardCollapse
- 类型: function
- 参数: card
- 外部变量: wasCollapsed, card, cardContent, isCurrentlyCollapsed, expandedHeight
- 代码:
```javascript
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

### 19. updateConnectors
- 类型: function
- 参数: 
- 外部变量: connectors, card, directoryRelationships, parentCard, childCard
- 代码:
```javascript
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

### 20. handleSaveFileChanges
- 类型: function
- 参数: 
- 外部变量: currentFileHandle
- 代码:
```javascript
function handleSaveFileChanges() {
if (!currentFileHandle) {
        showStatusMessage('请先选择一个文件进行编辑！', true);
        return;
}
```

### 21. addCollapseAllButton
- 类型: function
- 参数: 
- 外部变量: collapseAllButton, textContent, allCards, card, anyExpanded
- 代码:
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
```

## 主要CSS规则

### 1. /* 基本样式 */
    body
```css
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

### 2. /* 卡片内容区域平滑过渡效果 */
    .card-content
```css
/* 卡片内容区域平滑过渡效果 */
    .card-content {
  transition: height 0.3s ease-out, opacity 0.3s ease-out;
  overflow: hidden;
  
}
```

### 3. /* 收起状态的卡片内容样式 */
    .directory-card.card-collapsed .card-content
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

### 4. /* 收起状态下标题栏底部边框隐藏 */
    .directory-card.card-collapsed .card-header
```css
/* 收起状态下标题栏底部边框隐藏 */
    .directory-card.card-collapsed .card-header {
  border-bottom: none;
  
}
```

### 5. /* 收起状态的卡片样式 */
    .directory-card.card-collapsed
```css
/* 收起状态的卡片样式 */
    .directory-card.card-collapsed {
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  
}
```

### 6. /* 卡片连接线 */
    .card-connector
```css
/* 卡片连接线 */
    .card-connector {
  position: absolute;
  border: 2px solid #4285f4;
  z-index: 1;
  
}
```

### 7. .card-header
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

### 8. .root .card-header
```css
.root .card-header {
  background-color: #FF5722;
  
}
```

### 9. .card-title-section
```css
.card-title-section {
  flex-grow: 1;
  
}
```

### 10. .card-title
```css
.card-title {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
  
}
```

