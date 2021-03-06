### 重绘和回流

浏览器使用流式布局模型 (Flow Based Layout)，浏览器会解析HTML生成RenderTree，计算他们在页面上的大小和位置，然后把节点绘制到页面上

回流必将引起重绘，重绘不一定会引起回流

**回流**

当部分或全部元素的尺寸、结构、或某些属性发生改变时，浏览器重新渲染部分或全部文档的过程称为回流。

**导致回流**

- 页面首次渲染

- 浏览器窗口大小发生改变

- 元素尺寸或位置或字体大小发生改变

- 添加或者删除可见的DOM元素

- 激活CSS伪类（例如：:hover）

**重绘**

当页面中元素样式的改变并不影响它在文档流中的位置时，浏览器会将新样式赋予给元素并重新绘制它，这个过程称为重绘。

**导致重绘**

- 各种颜色变化

- 透明度变化