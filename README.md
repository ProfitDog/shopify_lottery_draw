# 壹芳贴图工坊

壹芳珠宝的剪映贴图素材包工具（纯静态网页）。这个分支独立于 `main`，只放这个工具，和仓库里原来的项目没有关系。

- 先锁定视频类型（知识科普 / 直播福利 / 细节鉴赏 / 源头日常），每种类型一套配色、字体和装饰
- 再选贴图种类、改文字，导出透明 PNG，或者把一条视频的贴图打包成 ZIP
- 导入剪映后可以继续加入场、出场动画

## 目录

- `site/`：部署用的网页（Render 的发布目录）。字体全部本地托管，国内打开不依赖谷歌字体。
- `src/`：源码。`engine.js` 画贴图，`app.js` 是界面。
- `build.mjs`：从 `src/` 和字体包生成 `site/`。

## 改完源码怎么更新

```bash
npm install
node build.mjs          # 生成 dist/site
rm -rf site && cp -r dist/site site
git add -A && git commit -m "更新贴图工具" && git push
```

推送到 `yifang-tietu` 分支后，Render 会自动重新部署。

## 字体授权

站内字体均为 SIL Open Font License 1.1，可免费商用：思源宋体（Noto Serif SC）、思源黑体（Noto Sans SC）、站酷小薇体、站酷庆科黄油体、马善政楷书、Anton、Cormorant Garamond。许可证原文在 `site/fonts/licenses/`。
