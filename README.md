# Daniel's Portfolio / 个人主页

这是一个纯vibe coding实现的基于纯前端技术栈 (原生 HTML, CSS, JavaScript) 构建的轻量级个人作品集网页。全面支持双语（中/英）和系统级日夜间主题切换。

> 该项目的数据采用**高度解耦**的方式提取到了本地 `.json` 文件内。每次修改文字、添加项目、经历只需修改对应的字典文件，页面样式会自动重新渲染。

---

## 🛠️ 如何预览和启动

由于我们使用了原生的 JS `fetch` API 来获取多语言的数据模块 (`zh.json` 和 `en.json`)，**直接双击运行 `index.html` 会因为浏览器的同源策略产生 CORS 本地文件跨域报错，导致页面空白**。

**正确的预览方式：**

1. 在 VS Code 中安装 **Live Server** 插件 (作者通常为 Ritwick Dey)。
2. 在左侧文件目录右键点击 `index.html`，选择 **Open with Live Server**。
3. 它将会在默认浏览器中打开类似 `http://127.0.0.1:5500/` 的地址，所有修改保存后均会**热更新**直接显示在网页上。

---

## 📂 项目结构指南

```text
├── index.html        // 主页 HTML 骨架（所有组件坑位在此，不含实际内容）
├── project.html      // 独立的项目详情呈现专页
├── assets/           // 静态资源文件
│   ├── css/
│   │   └── style.css // 全局 CSS 样式，包含排版、时间轴和暗黑模式色彩变量
│   ├── images/       // 存放所有图片素材 (如头像、项目动图等)
│   └── js/
│       ├── main.js   // 核心逻辑：负责控制白/黑夜日间模式的监听与状态锁定
│       └── i18n.js   // 数据渲染引擎：拉取 json、注入 DOM 锚点的核心文件
└── lang/             // 【⚠️日常维护更新的核心目录️】
    ├── zh.json       // 全站中文内容与 URL 跳转映射表
    └── en.json       // 全站英文内容与 URL 跳转映射表 (注意随时与 zh.json 保持格式对称)
```

---

## 📝 日常内容维护与更新操作手册

所有的动态内容、文案、图片链接以及介绍，都**只需要**在 `lang/zh.json` 和 `lang/en.json` 当中修改。

### 1. 修改主要文字（如姓名、自我介绍、联络方式）
找到 `.json` 中的 `profile` 和 `contact` 对象直接修改值的内容即可。
*提示：自我介绍 `bio` 字段中可以直接写入简单的 html 标签用于加粗或其他特殊效果：`"bio": "作为一名..."`*

### 2. 添加一段新的工作经历或获奖经历
由于使用了时间轴效果，所有的条目必须被添加到根目录底下的 `experience` 或 `awards` 数组（Array）中去。
越靠前的条目，会自动越靠上展示。
```json
"experience": [
  {
    "title": "company",
    "companyLink": "https://newcompany.com", // [可选] 如果带有该行，标题会自动变为可点击的蓝色超链接
    "date": "2024.12 - 至今",
    "desc": "XXX..."
  }
]
```

### 3. 加入新项目并在 `project.html` 呈现
要在主页卡片内添加新项目，请在 `projects` 数组中添加对应的块：
```json
"projects": [
  {
    "id": "p3",  // 必须是全小写或数字，具有唯一性，用于URL查询 project.html?id=p3
    "title": "projects",
    "shortDesc": "XXX...",
    "image": "assets/images/new_project.webp", // [可选] 卡片或顶部配图
    "fullDesc": "<p>这里是你项目深度的细节描述，<strong>支持完全的 HTML 写法</strong>，你可以往这里塞很多段落介绍，或者写 <code>代码</code> 标签都可以。</p>"
  }
]
```
> **注意视频的插入**：如果您想在独立项目页加入 B 站视频或 Youtube，可以直接把 `<iframe src="..."></iframe>` 的复制连接写由于 `fullDesc` 这个字段里。引擎会自动把它安全解析并绘制出来。

### 4. 替换头像或首页画廊
把新文件拖进 `assets/images/` 文件夹下，然后去 `zh.json` (以及 en.json) 中的 `"gallery"` 或 `"profile"` 项里面去把相对路径（如 `"image": "assets/images/xxx.jpg"`）改掉即可。

---

## 🐞 部署到 GitHub Pages 注意事项

纯静态结构，只需要把这个根文件夹 **直接 Push 到 Github main/master 分支** 上。
然后在 GitHub 仓库对应的 `Settings` -> `Pages` 中，来源 Source 选为 **Deploy from a branch** 即可。无需执行任何构建命令。
