// 生成可直接部署的静态网站：dist/site
// 字体全部本地托管（不依赖谷歌字体，国内能正常打开），按 unicode-range 切片按需加载。
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const OUT = path.join(ROOT, 'dist', 'site');
const FS = path.join(ROOT, 'node_modules', '@fontsource');

const FONTS = [
  ['noto-serif-sc', [500, 700, 900]],
  ['noto-sans-sc', [500, 700, 900]],
  ['zcool-xiaowei', [400]],
  ['zcool-qingke-huangyou', [400]],
  ['ma-shan-zheng', [400]],
  ['anton', [400]],
  ['cormorant-garamond', [600, 700]],
];

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'fonts', 'files'), { recursive: true });
fs.mkdirSync(path.join(OUT, 'fonts', 'licenses'), { recursive: true });
fs.mkdirSync(path.join(OUT, 'vendor'), { recursive: true });

let css = '/* 自托管字体：均为 SIL Open Font License 1.1，许可证见 licenses/ */\n';
let files = 0, bytes = 0;
for (const [pkg, weights] of FONTS) {
  for (const w of weights) {
    const src = fs.readFileSync(path.join(FS, pkg, `${w}.css`), 'utf8');
    const re = /\/\*\s*([^*]+?)\s*\*\/\s*@font-face\s*\{([^}]*)\}/g;
    let m;
    while ((m = re.exec(src))) {
      const label = m[1];
      const keep = /\[\d+\]/.test(label) || /-latin-\d/.test(label) || /-latin-ext-\d/.test(label);
      if (!keep) continue;
      const file = (m[2].match(/url\(\.\/files\/([^)]+?\.woff2)\)/) || [])[1];
      if (!file) continue;
      const body = m[2].replace(/src:[^;]+;/, `src: url(files/${file}) format('woff2');`);
      css += `@font-face {${body}}\n`;
      const from = path.join(FS, pkg, 'files', file);
      fs.copyFileSync(from, path.join(OUT, 'fonts', 'files', file));
      files++; bytes += fs.statSync(from).size;
    }
  }
  fs.copyFileSync(path.join(FS, pkg, 'LICENSE'), path.join(OUT, 'fonts', 'licenses', `${pkg}.txt`));
}
fs.writeFileSync(path.join(OUT, 'fonts', 'fonts.css'), css);

fs.copyFileSync(path.join(ROOT, 'node_modules', 'jszip', 'dist', 'jszip.min.js'), path.join(OUT, 'vendor', 'jszip.min.js'));
for (const f of ['app.css', 'engine.js', 'app.js']) fs.copyFileSync(path.join(ROOT, 'src', f), path.join(OUT, f));

const html = fs.readFileSync(path.join(ROOT, 'src', 'index.html'), 'utf8')
  .replace('<!--FONTCSS-->', '<link rel="stylesheet" href="fonts/fonts.css">')
  .replace('<!--SCRIPTS-->', '<script src="vendor/jszip.min.js"></script>\n<script src="engine.js"></script>\n<script src="app.js"></script>');
fs.writeFileSync(path.join(OUT, 'index.html'), html);

console.log(`site built: ${files} font files, ${(bytes / 1048576).toFixed(1)} MB fonts`);
