# Community Discovery Page

一个基于 React + TypeScript 实现的社区发现页面，具有类似小红书的瀑布流布局和无限滚动功能。

## 演示视频

[查看功能演示视频](https://www.loom.com/share/3ecf5f5cfd3048baa45dfdcca048b9d6)

## 主要功能

### 1. 瀑布流布局
- 双列网格布局展示内容
- 支持图片和视频内容
- 响应式设计，适配移动端

### 2. 无限滚动
- 滚动到底部自动加载新内容
- 保留已加载的历史内容
- 平滑的加载过渡效果
- 加载状态提示

### 3. 下拉刷新
- 支持下拉刷新获取最新内容
- 清晰的视觉反馈
- 刷新状态提示

### 4. 内容展示
- 支持图片和视频两种类型
- 标题和描述信息展示
- 内容卡片悬停效果
- 懒加载优化

## 技术栈

- React 18
- TypeScript
- styled-components
- antd-mobile
- react-router-dom

## 项目结构

```
community-discovery/
├── src/
│   ├── components/     # 可复用组件
│   ├── views/         # 页面组件
│   ├── types/        # TypeScript 类型定义
│   ├── utils/        # 工具函数
│   ├── services/     # API 服务
│   ├── App.tsx      # 应用入口
│   └── main.tsx     # 主入口文件
├── public/          # 静态资源
└── package.json    # 项目依赖
```

## 开发说明

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## 性能优化

1. 图片懒加载
2. 无限滚动性能优化
3. 状态管理优化
4. 滚动事件节流

## 注意事项

1. 确保网络连接正常以加载外部资源
2. 视频播放需要浏览器支持
3. 移动端访问时建议使用 Chrome 或 Safari 浏览器

## 未来计划

- [ ] 添加内容筛选功能
- [ ] 优化图片加载体验
- [ ] 添加更多交互动画
- [ ] 支持更多媒体类型

## 贡献指南

1. Fork 本仓库
2. 创建特性分支
3. 提交更改
4. 发起 Pull Request

## 许可证

MIT 