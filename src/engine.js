/* 壹芳贴图引擎
 * 把一张贴图画到 canvas 上。所有尺寸都以 1080×1920 竖屏画面的像素为单位，
 * 导出时再按倍数放大，所以 1080P 和 4K 是同一套排版。
 */
(function (G) {
  'use strict';

  /* ---------- 字体 ---------- */
  const FB = '"Noto Sans SC", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif';
  const FAM = {
    serif: '"Noto Serif SC"',
    sans: '"Noto Sans SC"',
    xiaowei: '"ZCOOL XiaoWei"',
    huangyou: '"ZCOOL QingKe HuangYou"',
    brush: '"Ma Shan Zheng"',
    anton: '"Anton"',
    corm: '"Cormorant Garamond"'
  };
  const FONT = (f, size) => f[0] + ' ' + (+size).toFixed(2) + 'px ' + f[1] + ', ' + FB;
  // textBaseline=middle 时各字体的视觉中心微调（单位：em）
  const DY = {};
  DY[FAM.serif] = 0.02; DY[FAM.sans] = 0.02; DY[FAM.xiaowei] = 0.02; DY[FAM.huangyou] = 0.03;
  DY[FAM.brush] = 0.04; DY[FAM.anton] = 0.03; DY[FAM.corm] = 0.06;

  /* ---------- 视频类型：每种类型一套完整的视觉规范 ---------- */
  const TYPES = {
    zhi: {
      id: 'zhi', name: '知识科普', theme: '青金档案', seal: '识', use: '鉴别讲解 · 避坑科普 · 方总课堂',
      fontNote: '思源宋体 · 思源黑体',
      ui: { l: '#24448A', d: '#93AEE6', card: '#1E3A73', cardInk: '#F2EEE3' },
      hl: 'underbar', hlName: '金线衬底',
      fonts: { title: [900, FAM.serif], text: [700, FAM.serif], body: [500, FAM.sans], bold: [700, FAM.sans], num: [700, FAM.serif], latin: [600, FAM.corm] },
      schemes: {
        paper: {
          name: '宣纸', panel: '#F2EEE3', panel2: '#1E3A73', ink: '#15213B', ink2: '#F2EEE3', sub: '#59647A',
          acc: '#1E3A73', acc2: '#B08633', line: '#15213B', shadow: 'rgba(12,22,44,.30)',
          hl: 'rgba(214,173,77,.62)', hlInk: '#1E3A73', hl2: 'rgba(163,61,42,.18)', hlInk2: '#A33D2A',
          good: '#1E3A73', bad: '#A33D2A', sealC: '#B3352B'
        },
        lapis: {
          name: '青金', panel: '#172C57', panel2: '#D9B562', ink: '#F4EFE2', ink2: '#172C57', sub: '#B3C3E2',
          acc: '#E2BE68', acc2: '#D9B562', line: '#D9B562', shadow: 'rgba(0,0,0,.38)',
          hl: 'rgba(217,181,98,.40)', hlInk: '#F3D27C', hl2: 'rgba(238,140,112,.36)', hlInk2: '#FFB59E',
          good: '#F0CF78', bad: '#F08E73', sealC: '#C9463A'
        },
        bare: {
          name: '无底', panel: null, panel2: '#1E3A73', ink: '#FFFFFF', ink2: '#F6F1E4', sub: '#E9EEF8',
          acc: '#F2D27F', acc2: '#E8C46A', line: '#F2D27F', shadow: 'rgba(0,0,0,.4)',
          hl: 'rgba(30,58,115,.92)', hlInk: '#F6D98A', hl2: 'rgba(176,134,51,.95)', hlInk2: '#FFFFFF',
          good: '#F2D27F', bad: '#FF9F84', sealC: '#C9463A',
          fx: { stroke: ['#0F1D3A', 0.12], shadow: 'rgba(0,0,0,.45)', blur: 0.22 }
        }
      }
    },
    hui: {
      id: 'hui', name: '直播福利', theme: '南红价签', seal: '惠', use: '直播切片 · 上新福利 · 限时活动',
      fontNote: '庆科黄油体 · 思源黑体 · Anton',
      ui: { l: '#C43420', d: '#FF8466', card: '#C93220', cardInk: '#FFF7E8' },
      hl: 'box', hlName: '撞色方块',
      fonts: { title: [400, FAM.huangyou], text: [400, FAM.huangyou], body: [700, FAM.sans], bold: [900, FAM.sans], num: [400, FAM.anton] },
      schemes: {
        red: {
          name: '南红', panel: '#C93220', panel2: '#FFC23A', ink: '#FFF7E8', ink2: '#7E1A0D', sub: '#FFD9BC',
          acc: '#FFC23A', acc2: '#3B0D06', line: '#FFF7E8', shadow: '#4A0F07', pill: '#3B0D06', pillInk: '#FFC23A',
          card: '#FFF7E8', cardInk: '#3B0D06',
          hl: '#FFC23A', hlInk: '#9C1F10', hl2: '#FFF7E8', hlInk2: '#C93220', good: '#FFC23A', bad: '#3B0D06', sealC: '#3B0D06'
        },
        amber: {
          name: '蜜蜡', panel: '#FFC23A', panel2: '#C93220', ink: '#3B0D06', ink2: '#FFF7E8', sub: '#7A3A0C',
          acc: '#C93220', acc2: '#3B0D06', line: '#3B0D06', shadow: '#7A3A0C', pill: '#3B0D06', pillInk: '#FFC23A',
          card: '#FFF7E8', cardInk: '#3B0D06',
          hl: '#C93220', hlInk: '#FFF7E8', hl2: '#3B0D06', hlInk2: '#FFC23A', good: '#C93220', bad: '#3B0D06', sealC: '#C93220'
        },
        bare: {
          name: '描边', panel: null, panel2: '#FFC23A', ink: '#FFFFFF', ink2: '#7E1A0D', sub: '#FFE9B8',
          acc: '#FFC23A', acc2: '#C93220', line: '#FFC23A', shadow: '#3B0D06', pill: '#C93220', pillInk: '#FFF7E8',
          card: '#FFF7E8', cardInk: '#3B0D06',
          hl: '#FFC23A', hlInk: '#B3200F', hl2: '#C93220', hlInk2: '#FFFFFF', good: '#FFC23A', bad: '#3B0D06', sealC: '#C93220',
          fx: { stroke: ['#C93220', 0.1], stroke2: ['#3B0D06', 0.05], hard: ['#3B0D06', 0.06] }
        }
      }
    },
    shang: {
      id: 'shang', name: '细节鉴赏', theme: '羊脂展签', seal: '赏', use: '好物展示 · 细节特写 · 开箱',
      fontNote: '站酷小薇体 · 思源宋体',
      ui: { l: '#8B6A2E', d: '#D8B97A', card: '#F4EFE3', cardInk: '#8B6A2E' },
      hl: 'dots', hlName: '着重号',
      fonts: { title: [400, FAM.xiaowei], text: [500, FAM.serif], body: [500, FAM.serif], bold: [700, FAM.serif], num: [500, FAM.serif], latin: [600, FAM.corm] },
      schemes: {
        jade: {
          name: '羊脂', panel: 'rgba(249,246,238,.96)', panel2: '#1F2320', ink: '#1F2320', ink2: '#F7F3EA', sub: '#6F6A5D',
          acc: '#A47E3B', acc2: '#B5322A', line: 'rgba(31,35,32,.55)', shadow: 'rgba(0,0,0,.22)',
          hl: '#A47E3B', hlInk: '#8C6526', hl2: '#B5322A', hlInk2: '#B5322A', good: '#A47E3B', bad: '#8A857A', sealC: '#B5322A'
        },
        ink: {
          name: '墨玉', panel: 'rgba(20,22,19,.82)', panel2: '#CBAA66', ink: '#F6F1E5', ink2: '#1C1E1A', sub: '#BDB7A6',
          acc: '#CBAA66', acc2: '#C0392B', line: 'rgba(246,241,229,.45)', shadow: 'rgba(0,0,0,.32)',
          hl: '#CBAA66', hlInk: '#E8CB8C', hl2: '#E0705E', hlInk2: '#F2A592', good: '#E8CB8C', bad: '#9C978B', sealC: '#C0392B'
        },
        bare: {
          name: '留白', panel: null, panel2: '#CBAA66', ink: '#FFFFFF', ink2: '#1C1E1A', sub: '#F2EDE2',
          acc: '#E8CB8C', acc2: '#D24A3A', line: 'rgba(255,255,255,.75)', shadow: 'rgba(0,0,0,.4)',
          hl: '#E8CB8C', hlInk: '#F5DFAA', hl2: '#FF8A75', hlInk2: '#FFC4B6', good: '#F5DFAA', bad: '#D6D1C4', sealC: '#C0392B',
          fx: { shadow: 'rgba(0,0,0,.62)', blur: 0.28, sy: 0.04 }
        }
      }
    },
    xing: {
      id: 'xing', name: '源头日常', theme: '沉香手札', seal: '行', use: '源头探访 · 逛市场 · 方总日常',
      fontNote: '马善政楷书 · 思源黑体',
      ui: { l: '#2D7352', d: '#72C99D', card: '#2E7553', cardInk: '#F5ECD8' },
      hl: 'marker', hlName: '马克笔',
      fonts: { title: [400, FAM.brush], text: [400, FAM.brush], body: [500, FAM.sans], bold: [700, FAM.sans], num: [700, FAM.sans] },
      schemes: {
        paper: {
          name: '手札', panel: '#F5ECD8', panel2: '#2E7553', ink: '#3A2718', ink2: '#F7F0E0', sub: '#7A6450',
          acc: '#2E7553', acc2: '#B23A2C', line: '#3A2718', shadow: 'rgba(58,39,24,.28)', tape: 'rgba(222,178,96,.78)',
          kraft: '#D9B98C', grain: 'rgba(90,60,30,.07)',
          hl: 'rgba(64,160,108,.42)', hlInk: '#2A1B10', hl2: 'rgba(236,170,60,.55)', hlInk2: '#2A1B10',
          good: '#2E7553', bad: '#B23A2C', sealC: '#B23A2C'
        },
        jade: {
          name: '翡翠', panel: '#2C6A4D', panel2: '#F2C35B', ink: '#F8F1E1', ink2: '#2C2014', sub: '#CFE3D5',
          acc: '#F2C35B', acc2: '#F2A08A', line: '#F8F1E1', shadow: 'rgba(0,0,0,.32)', tape: 'rgba(246,238,220,.6)',
          kraft: '#F5ECD8', grain: 'rgba(255,255,255,.05)',
          hl: 'rgba(242,195,91,.5)', hlInk: '#FFFFFF', hl2: 'rgba(255,255,255,.26)', hlInk2: '#F2C35B',
          good: '#F2C35B', bad: '#F2A08A', sealC: '#C9463A'
        },
        bare: {
          name: '无纸', panel: null, panel2: '#2E7553', ink: '#FFFFFF', ink2: '#F7F0E0', sub: '#F3EBDD',
          acc: '#9FE0B9', acc2: '#FF8D78', line: '#FFFFFF', shadow: 'rgba(40,25,10,.45)', tape: 'rgba(222,178,96,.85)',
          kraft: '#D9B98C', grain: 'rgba(90,60,30,.07)',
          hl: 'rgba(52,150,98,.72)', hlInk: '#FFFFFF', hl2: 'rgba(236,160,40,.8)', hlInk2: '#FFFFFF',
          good: '#9FE0B9', bad: '#FF9C86', sealC: '#C9463A',
          fx: { stroke: ['rgba(48,30,16,.9)', 0.05], shadow: 'rgba(30,18,8,.6)', blur: 0.2 }
        }
      }
    }
  };
  const TYPE_ORDER = ['zhi', 'hui', 'shang', 'xing'];

  /* ---------- 贴图种类 ---------- */
  const KINDS = {
    emph: {
      name: '句子强调', fields: [
        { k: 'text', label: '句子', type: 'area', rows: 3, hint: '用【】框住要强调的字，回车换行' },
        { k: 'label', label: '角标', ph: '如：划重点（可不填）' }],
      def: { text: '看手镯，先看【种水】\n再看颜色', label: '划重点' }, align: true,
      batch: { hint: '每行生成一张。用【】框住强调的字，用 / 换行。', example: '看手镯，先看【种水】/再看颜色\n【对着光】看，棉絮一目了然\n这种料子，【可遇不可求】' }
    },
    word: {
      name: '关键词', fields: [
        { k: 'word', label: '关键词' },
        { k: 'pinyin', label: '注音', ph: '可不填' },
        { k: 'note', label: '释义', type: 'area', rows: 2, ph: '可不填' }],
      def: { word: '包浆', pinyin: 'bāo jiāng', note: '长期盘玩后，表面形成的温润光泽' },
      batch: { hint: '每行一张，格式：关键词|注音|释义（后两项可省）', example: '包浆|bāo jiāng|长期盘玩后形成的光泽\n开窗|kāi chuāng|在原石上磨开一小块看内部\n种水' }
    },
    chapter: {
      name: '段落主题', fields: [
        { k: 'no', label: '序号', ph: '01', narrow: true },
        { k: 'title', label: '主题' },
        { k: 'sub', label: '副标题', ph: '可不填' }],
      def: { no: '01', title: '先看种水', sub: '挑手镯的第一步' }, vertical: ['shang', 'xing'],
      batch: { hint: '每行一张，格式：主题|副标题。序号从当前序号开始自动往下排。', example: '先看种水|挑手镯的第一步\n再看颜色|浓、正、阳、匀\n最后看工|线条和抛光' }
    },
    quote: {
      name: '金句', fields: [
        { k: 'text', label: '金句', type: 'area', rows: 3, hint: '回车换行，【】可强调' },
        { k: 'by', label: '署名', ph: '可不填' }],
      def: { text: '玉不琢，不成器\n好料子也要遇对人', by: '方总' }, vertical: ['shang', 'xing'], align: true
    },
    callout: {
      name: '细节标注', fields: [
        { k: 'text', label: '标注' },
        { k: 'sub', label: '小字', ph: '可不填' },
        { k: 'dir', label: '指向', type: 'seg', opts: ['左上', '右上', '左下', '右下'] }],
      def: { text: '天然棉絮', sub: '看这里', dir: '右下' },
      batch: { hint: '每行一张，格式：标注|小字（小字可省）', example: '天然棉絮|看这里\n石纹|不是裂\n皮色|原生沁色' }
    },
    spec: {
      name: '参数卡', fields: [
        { k: 'name', label: '品名' },
        { k: 'rows', label: '参数', type: 'area', rows: 4, hint: '每行一项，格式：珠径：12mm' }],
      def: { name: '和田玉籽料手串', rows: '珠径：12mm\n克重：38.6g\n产地：新疆和田\n证书：国检 NGTC' }
    },
    price: {
      name: '价格签', fields: [
        { k: 'label', label: '标题' },
        { k: 'price', label: '现价', narrow: true },
        { k: 'orig', label: '原价', ph: '可不填', narrow: true },
        { k: 'note', label: '备注', ph: '可不填' },
        { k: 'badge', label: '角标', ph: '如：限时（可不填）', narrow: true }],
      def: { label: '直播间福利价', price: '1980', orig: '3680', note: '支持第三方复检', badge: '限时' }
    },
    vs: {
      name: '真假对比', fields: [
        { k: 'a', label: '左边 · 对的' },
        { k: 'ad', label: '左边说明', type: 'area', rows: 2, ph: '可不填' },
        { k: 'b', label: '右边 · 错的' },
        { k: 'bd', label: '右边说明', type: 'area', rows: 2, ph: '可不填' }],
      def: { a: '天然', ad: '色带过渡自然\n有深有浅', b: '染色', bd: '颜色浮在表面\n裂隙处更深' }
    },
    name: {
      name: '人物名牌', fields: [
        { k: 'name', label: '称呼' },
        { k: 'title', label: '身份' },
        { k: 'extra', label: '补充', ph: '可不填' }],
      def: { name: '方总', title: '壹芳珠宝', extra: '带你看懂每一件好料' }
    },
    place: {
      name: '地点', fields: [
        { k: 'place', label: '地点' },
        { k: 'extra', label: '补充', ph: '可不填' },
        { k: 'date', label: '日期', ph: '可不填', narrow: true }],
      def: { place: '新疆 · 和田', extra: '玉龙喀什河', date: '' }
    }
  };
  const KIND_ORDER = ['emph', 'word', 'chapter', 'quote', 'callout', 'spec', 'price', 'vs', 'name', 'place'];
  const DEFAULT_BRAND = { name: '壹芳珠宝', seal: '壹芳' };
  const FIXED_TEXT = '鉴宝笔记文玩词典原价实地探访源头行对比说参考价¥·— ';

  /* ---------- 小工具 ---------- */
  function hash(s) { let h = 2166136261 >>> 0; for (const ch of String(s)) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619) >>> 0; } return h; }
  function rng(seed) {
    let a = seed >>> 0;
    return function () { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  let MC = null;
  function mctx() { if (!MC) MC = document.createElement('canvas').getContext('2d'); return MC; }
  function mk(w, h) { const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return c; }
  function E(l, t, r, b) { return t === undefined ? { l: l, t: l, r: l, b: l } : { l: l, t: t, r: r, b: b }; }
  function rr(ctx, x, y, w, h, r) {
    r = Math.max(0, Math.min(r, w / 2, h / 2));
    ctx.beginPath(); ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  function circle(ctx, x, y, r) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); }
  function rotExtra(w, h, a) { const c = Math.abs(Math.cos(a)), s = Math.abs(Math.sin(a)); return { dx: (w * c + h * s - w) / 2, dy: (w * s + h * c - h) / 2 }; }
  function rotAbout(ctx, cx, cy, a) { ctx.translate(cx, cy); ctx.rotate(a); ctx.translate(-cx, -cy); }
  function softShadow(ctx, color, blur, oy) { ctx.shadowColor = color; ctx.shadowBlur = blur; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = oy; }
  function noShadow(ctx) { ctx.shadowColor = 'rgba(0,0,0,0)'; ctx.shadowBlur = 0; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0; }
  function clean(s) { return String(s == null ? '' : s).trim(); }

  /* ---------- 文字排版 ---------- */
  const NO_START = new Set(Array.from('，。、；：？！）》」』”’…—·．,.;:?!)]】〉〕%'));
  const NO_END = new Set(Array.from('（《「『“‘【〈〔(['));
  const V_ROT = new Set(Array.from('「」『』（）《》〈〉〔〕“”‘’—–-…～~()[]<>:：;；|｜'));
  const V_CORNER = new Set(Array.from('，。、．,.'));

  // 【】之间的字是强调字；回车换行
  function parseRich(str) {
    const out = []; let hl = false;
    for (const ch of Array.from(String(str == null ? '' : str))) {
      if (ch === '【') { hl = true; continue; }
      if (ch === '】') { hl = false; continue; }
      if (ch === '\r') continue;
      if (ch === '\n') { out.push({ br: true }); continue; }
      out.push({ ch: ch, hl: hl });
    }
    return out;
  }
  // 连续的英文/数字合成一个单位，避免被拆开换行
  function toUnits(toks) {
    const units = []; let buf = null;
    const flush = () => { if (buf) { units.push(buf); buf = null; } };
    for (const t of toks) {
      if (t.br) { flush(); units.push({ br: true }); continue; }
      if (/[A-Za-z0-9.%+\-\/'&]/.test(t.ch)) {
        if (buf && buf.hl === t.hl) buf.t += t.ch; else { flush(); buf = { t: t.ch, hl: t.hl }; }
      } else { flush(); units.push({ t: t.ch, hl: t.hl }); }
    }
    flush(); return units;
  }

  function tb(text, f, size, o) {
    o = o || {};
    const toks = parseRich(text);
    return o.vertical ? vblock(toks, f, size, o) : hblock(toks, f, size, o);
  }

  function hblock(toks, f, size, o) {
    const ctx = mctx(); ctx.font = FONT(f, size);
    const units = toUnits(toks);
    const tr = size * (o.track || 0), adv = size * (o.lh || 1.3);
    // 每段单独算一个均衡宽度：要折行时让各行差不多长，避免最后一行只剩一两个字
    const paraMax = []; let pw = 0;
    const pushPara = () => { paraMax.push(o.maxW && pw > o.maxW ? Math.min(o.maxW, pw / Math.ceil(pw / o.maxW) + size * 0.8) : o.maxW); pw = 0; };
    units.forEach(u => { if (u.br) pushPara(); else pw += ctx.measureText(u.t).width + tr; });
    pushPara();
    let para = 0;
    const lines = []; let cur = [], x = 0;
    const end = () => { while (cur.length && cur[cur.length - 1].t === ' ') cur.pop(); lines.push(cur); cur = []; x = 0; };
    for (const u of units) {
      if (u.br) { end(); para++; continue; }
      if (u.t === ' ' && !cur.length) continue;
      const w = ctx.measureText(u.t).width, lim = paraMax[para];
      if (lim && cur.length && x + w > lim + 0.5) {
        if (NO_START.has(u.t)) { cur.push({ t: u.t, hl: u.hl, w: w }); x += w + tr; continue; }
        const carry = [];
        while (cur.length > 1 && NO_END.has(cur[cur.length - 1].t)) carry.unshift(cur.pop());
        end();
        if (u.t === ' ') continue;
        carry.forEach(c => { cur.push(c); x += c.w + tr; });
      }
      cur.push({ t: u.t, hl: u.hl, w: w }); x += w + tr;
    }
    end();
    while (lines.length > 1 && !lines[lines.length - 1].length) lines.pop();
    let W = 0;
    const L = lines.map(ln => {
      let cx = 0; ln.forEach(u => { u.x = cx; cx += u.w + tr; });
      const lw = ln.length ? cx - tr : 0; W = Math.max(W, lw); return { units: ln, w: lw };
    });
    const B = { lines: L, w: W, h: L.length ? (L.length - 1) * adv + size : 0, size: size, adv: adv, f: f, tr: tr, align: o.align || 'left', vertical: false };
    B.draw = (ctx2, x0, y0, st) => drawH(ctx2, B, x0, y0, st || {});
    return B;
  }

  function vblock(toks, f, size, o) {
    const tr = size * (o.track || 0), adv = size + tr, colAdv = size * (o.lh || 1.5);
    const maxN = o.maxH ? Math.max(1, Math.floor((o.maxH + tr) / adv)) : 1e9;
    // 每段均衡分列，避免最后一列只剩一个字
    const paraN = []; let n0 = 0;
    toks.forEach(t => { if (t.br) { paraN.push(n0); n0 = 0; } else n0++; });
    paraN.push(n0);
    const cols = []; let cur = [], para = 0;
    const limit = () => { const n = paraN[para]; return n > maxN ? Math.ceil(n / Math.ceil(n / maxN)) : maxN; };
    for (const t of toks) {
      if (t.br) { cols.push(cur); cur = []; para++; continue; }
      if (t.ch === ' ' && !cur.length) continue;
      if (cur.length >= limit() && !NO_START.has(t.ch)) { cols.push(cur); cur = []; }
      cur.push({ t: t.ch, hl: t.hl });
    }
    cols.push(cur);
    while (cols.length > 1 && !cols[cols.length - 1].length) cols.pop();
    let H = 0; cols.forEach(c => { H = Math.max(H, c.length ? c.length * adv - tr : 0); });
    const B = { cols: cols, w: cols.length ? (cols.length - 1) * colAdv + size : 0, h: H, size: size, adv: adv, colAdv: colAdv, f: f, tr: tr, vertical: true, valign: o.valign || 'top' };
    B.draw = (ctx2, x0, y0, st) => drawV(ctx2, B, x0, y0, st || {});
    return B;
  }

  const putH = (ctx, p, m) => (m === 's' ? ctx.strokeText(p.u.t, p.x, p.y) : ctx.fillText(p.u.t, p.x, p.y));
  function putV(ctx, p, m) {
    const ch = p.u.t, s = p.s;
    if (V_ROT.has(ch)) {
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(Math.PI / 2);
      if (m === 's') ctx.strokeText(ch, 0, 0); else ctx.fillText(ch, 0, 0);
      ctx.restore();
    } else if (V_CORNER.has(ch)) {
      const x = p.x + s * 0.58, y = p.y - s * 0.56;
      if (m === 's') ctx.strokeText(ch, x, y); else ctx.fillText(ch, x, y);
    } else if (m === 's') ctx.strokeText(ch, p.x, p.y); else ctx.fillText(ch, p.x, p.y);
  }

  // 文字特效：描边 / 双描边 / 硬投影 / 柔投影
  function glyphs(ctx, pos, s, st, put) {
    const fx = st.fx || null;
    const skipHl = st.hlMode === 'box';
    ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.miterLimit = 2;
    const sw = fx ? ((fx.stroke ? fx.stroke[1] : 0) + (fx.stroke2 ? fx.stroke2[1] : 0)) * s * 2 : 0;
    if (fx && fx.hard) {
      const off = fx.hard[1] * s;
      ctx.save(); ctx.translate(off, off); ctx.fillStyle = fx.hard[0]; ctx.strokeStyle = fx.hard[0];
      pos.forEach(p => { if (sw && !(skipHl && p.u.hl)) { ctx.lineWidth = sw; put(ctx, p, 's'); } put(ctx, p, 'f'); });
      ctx.restore();
    }
    let used = false;
    const shadowOn = () => {
      if (fx && fx.shadow && !used) { ctx.shadowColor = fx.shadow; ctx.shadowBlur = (fx.blur || 0.2) * s; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = (fx.sy == null ? 0.05 : fx.sy) * s; used = true; return true; }
      return false;
    };
    if (fx && fx.stroke2) {
      const on = shadowOn(); ctx.strokeStyle = fx.stroke2[0]; ctx.lineWidth = sw;
      pos.forEach(p => { if (!(skipHl && p.u.hl)) put(ctx, p, 's'); }); if (on) noShadow(ctx);
    }
    if (fx && fx.stroke) {
      const on = shadowOn(); ctx.strokeStyle = fx.stroke[0]; ctx.lineWidth = fx.stroke[1] * s * 2;
      pos.forEach(p => { if (!(skipHl && p.u.hl)) put(ctx, p, 's'); }); if (on) noShadow(ctx);
    }
    const on = shadowOn();
    pos.forEach(p => { ctx.fillStyle = (p.u.hl && st.hlInk) ? st.hlInk : st.color; put(ctx, p, 'f'); });
    if (on) noShadow(ctx);
  }

  function drawH(ctx, B, x0, y0, st) {
    const W = st.alignW || B.w, s = B.size, dy = (DY[B.f[1]] || 0) * s;
    ctx.save();
    ctx.font = FONT(B.f, s); ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
    const pos = [];
    B.lines.forEach((ln, i) => {
      const off = B.align === 'center' ? (W - ln.w) / 2 : B.align === 'right' ? (W - ln.w) : 0;
      const cy = y0 + i * B.adv + s / 2;
      if (st.hlMode && st.hlMode !== 'dots') {
        let run = null; const runs = [];
        ln.units.forEach(u => {
          if (u.hl && u.t !== ' ') { if (!run) { run = { a: u.x, b: u.x + u.w }; runs.push(run); } else run.b = u.x + u.w; } else run = null;
        });
        runs.forEach((r, k) => hlBg(ctx, st.hlMode, x0 + off + r.a, cy, r.b - r.a, s, st.hlColor, (st.seed || 1) + i * 31 + k * 7));
      }
      ln.units.forEach(u => pos.push({ u: u, x: x0 + off + u.x, y: cy + dy, w: u.w, s: s }));
    });
    glyphs(ctx, pos, s, st, putH);
    if (st.hlMode === 'dots') dots(ctx, pos.filter(p => p.u.hl), s, st, false);
    ctx.restore();
  }

  function drawV(ctx, B, x0, y0, st) {
    const s = B.size, dy = (DY[B.f[1]] || 0) * s;
    ctx.save(); ctx.font = FONT(B.f, s); ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
    const pos = [];
    B.cols.forEach((col, i) => {
      const cx = x0 + B.w - s / 2 - i * B.colAdv;
      const ch = col.length ? col.length * B.adv - B.tr : 0;
      const off = B.valign === 'center' ? (B.h - ch) / 2 : B.valign === 'bottom' ? B.h - ch : 0;
      if (st.hlMode && st.hlMode !== 'dots') {
        let run = null; const runs = [];
        col.forEach((u, j) => { if (u.hl) { if (!run) { run = { a: j, b: j }; runs.push(run); } else run.b = j; } else run = null; });
        runs.forEach((r, k) => hlBgV(ctx, st.hlMode, cx, y0 + off + r.a * B.adv, (r.b - r.a) * B.adv + s, s, st.hlColor, (st.seed || 1) + i * 31 + k * 7));
      }
      col.forEach((u, j) => pos.push({ u: u, x: cx, y: y0 + off + j * B.adv + s / 2 + dy, w: s, s: s }));
    });
    glyphs(ctx, pos, s, st, putV);
    if (st.hlMode === 'dots') dots(ctx, pos.filter(p => p.u.hl), s, st, true);
    ctx.restore();
  }

  // 着重号：横排在字下，竖排在字右
  function dots(ctx, pos, s, st, vertical) {
    ctx.save(); ctx.fillStyle = st.hlColor || st.color;
    if (st.fx && st.fx.shadow) { ctx.shadowColor = st.fx.shadow; ctx.shadowBlur = s * 0.14; }
    const r = Math.max(2, s * 0.068);
    pos.forEach(p => {
      if (NO_START.has(p.u.t) || p.u.t === ' ') return;
      const n = vertical ? 1 : Math.max(1, Array.from(p.u.t).length);
      for (let k = 0; k < n; k++) {
        const x = vertical ? p.x + s * 0.7 : p.x + p.w * (k + 0.5) / n;
        const y = vertical ? p.y : p.y + s * 0.74;
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      }
    });
    ctx.restore();
  }

  function hlBg(ctx, mode, x, cy, w, s, color, seed) {
    if (!color) return;
    const R = rng(seed);
    ctx.save(); ctx.fillStyle = color;
    if (mode === 'underbar') {
      ctx.fillRect(x - s * 0.06, cy + s * 0.08, w + s * 0.12, s * 0.38);
    } else if (mode === 'box') {
      const px = s * 0.15, py = s * 0.09;
      ctx.translate(x + w / 2, cy); ctx.rotate(-0.035 + (R() - 0.5) * 0.03);
      rr(ctx, -w / 2 - px, -s / 2 - py, w + px * 2, s + py * 2, s * 0.14); ctx.fill();
    } else if (mode === 'marker') {
      marker(ctx, x - s * 0.12, cy - s * 0.06, w + s * 0.24, s * 0.62, R);
    }
    ctx.restore();
  }
  function hlBgV(ctx, mode, cx, y, len, s, color, seed) {
    if (!color) return;
    const R = rng(seed);
    ctx.save(); ctx.fillStyle = color;
    if (mode === 'underbar') {
      ctx.fillRect(cx - s * 0.62, y - s * 0.04, s * 0.4, len + s * 0.08);
    } else if (mode === 'box') {
      const px = s * 0.09, py = s * 0.14;
      rr(ctx, cx - s / 2 - px, y - py, s + px * 2, len + py * 2, s * 0.14); ctx.fill();
    } else if (mode === 'marker') {
      ctx.translate(cx + s * 0.06, y + len / 2); ctx.rotate(Math.PI / 2);
      marker(ctx, -len / 2 - s * 0.12, -s * 0.31, len + s * 0.24, s * 0.62, R);
    }
    ctx.restore();
  }

  /* ---------- 装饰元件 ---------- */
  function marker(ctx, x, y, w, h, R) {
    const tilt = (R() - 0.5) * 0.05;
    ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.rotate(tilt);
    const hw = w / 2, hh = h / 2, n = Math.max(5, Math.round(w / 22));
    ctx.beginPath();
    ctx.moveTo(-hw + hh * 0.5, -hh + (R() - 0.5) * h * 0.12);
    for (let i = 1; i <= n; i++) ctx.lineTo(-hw + hh * 0.5 + (w - hh) * i / n, -hh + (R() - 0.5) * h * 0.16);
    ctx.quadraticCurveTo(hw + hh * 0.3, 0, hw - hh * 0.4, hh);
    for (let i = n; i >= 0; i--) ctx.lineTo(-hw + hh * 0.5 + (w - hh) * i / n, hh + (R() - 0.5) * h * 0.16);
    ctx.quadraticCurveTo(-hw - hh * 0.3, 0, -hw + hh * 0.5, -hh);
    ctx.closePath(); ctx.fill(); ctx.restore();
  }
  function brushLine(ctx, x, y, w, t, R) {
    const n = Math.max(6, Math.round(w / 28));
    ctx.beginPath(); ctx.moveTo(x, y + t * 0.2);
    for (let i = 1; i <= n; i++) { const k = i / n; ctx.lineTo(x + w * k, y - t * 0.45 * Math.sin(Math.PI * k) - k * t * 0.5 + (R() - 0.5) * t * 0.25); }
    for (let i = n; i >= 0; i--) { const k = i / n; ctx.lineTo(x + w * k, y + t * 0.55 * Math.sin(Math.PI * Math.min(1, k * 1.1)) + t * 0.2 - k * t * 0.5 + (R() - 0.5) * t * 0.25); }
    ctx.closePath(); ctx.fill();
  }
  function roughRect(ctx, x, y, w, h, r, amp, R) {
    const pts = [];
    const seg = (x1, y1, x2, y2) => {
      const L = Math.hypot(x2 - x1, y2 - y1), n = Math.max(2, Math.round(L / 16));
      for (let i = 0; i < n; i++) { const t = i / n; pts.push([x1 + (x2 - x1) * t + (R() - 0.5) * amp * 2, y1 + (y2 - y1) * t + (R() - 0.5) * amp * 2]); }
    };
    seg(x + r, y, x + w - r, y); seg(x + w, y + r, x + w, y + h - r); seg(x + w - r, y + h, x + r, y + h); seg(x, y + h - r, x, y + r);
    ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath();
  }
  function handCircle(ctx, cx, cy, rx, ry, color, lw, R) {
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const p1 = R() * 6.28, p2 = R() * 6.28, start = R() * 6.28, total = Math.PI * 2 * 1.1, n = 72;
    ctx.beginPath();
    for (let i = 0; i <= n; i++) {
      const k = i / n, t = start + total * k;
      const wob = 1 + 0.035 * Math.sin(3 * t + p1) + 0.025 * Math.sin(5 * t + p2) + 0.07 * k;
      const px = cx + Math.cos(t) * rx * wob, py = cy + Math.sin(t) * ry * wob;
      if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py);
    }
    ctx.stroke(); ctx.restore();
  }
  function tape(ctx, cx, cy, w, h, ang, color) {
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(ang); ctx.fillStyle = color;
    const n = Math.max(3, Math.round(h / 7)), z = 4;
    ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2); ctx.lineTo(w / 2, -h / 2);
    for (let i = 1; i <= n; i++) ctx.lineTo(w / 2 - (i % 2 ? z : 0), -h / 2 + h * i / n);
    ctx.lineTo(-w / 2, h / 2);
    for (let i = n - 1; i >= 0; i--) ctx.lineTo(-w / 2 + (i % 2 ? z : 0), -h / 2 + h * i / n);
    ctx.closePath(); ctx.fill();
    ctx.globalAlpha = 0.2; ctx.fillStyle = '#ffffff'; ctx.fillRect(-w / 2 + 6, -h / 2 + 4, w - 12, h * 0.22);
    ctx.restore();
  }
  function paper(ctx, T, x, y, w, h, R) {
    const c = T.c;
    ctx.save(); softShadow(ctx, c.shadow, 24, 9); ctx.fillStyle = c.panel;
    roughRect(ctx, x, y, w, h, 3, 2, R); ctx.fill(); ctx.restore();
    ctx.save(); ctx.fillStyle = c.grain || 'rgba(80,50,20,.06)';
    const n = Math.round(w * h / 1600);
    for (let i = 0; i < n; i++) ctx.fillRect(x + 8 + R() * (w - 16), y + 8 + R() * (h - 16), 1.4 + R() * 2.6, 1.2);
    ctx.restore();
  }
  function hardBlock(ctx, x, y, w, h, r, fill, shadow, off) {
    off = off || [10, 12];
    if (shadow) { ctx.fillStyle = shadow; rr(ctx, x + off[0], y + off[1], w, h, r); ctx.fill(); }
    ctx.fillStyle = fill; rr(ctx, x, y, w, h, r); ctx.fill();
  }
  function couponDash(ctx, x, y, w, h, r, color) {
    ctx.save(); ctx.strokeStyle = color; ctx.globalAlpha = 0.5; ctx.lineWidth = 2.5; ctx.setLineDash([12, 9]);
    rr(ctx, x, y, w, h, r); ctx.stroke(); ctx.restore();
  }
  function zhiCard(ctx, T, w, h) {
    if (T.bare) return;
    const c = T.c;
    ctx.save(); softShadow(ctx, c.shadow, 34, 12); ctx.fillStyle = c.panel; ctx.fillRect(0, 0, w, h); ctx.restore();
    ctx.save(); ctx.strokeStyle = c.line;
    ctx.globalAlpha = 0.85; ctx.lineWidth = 2; ctx.strokeRect(13, 13, w - 26, h - 26);
    ctx.globalAlpha = 0.4; ctx.lineWidth = 1.2; ctx.strokeRect(19, 19, w - 38, h - 38);
    ctx.restore();
    ctx.save(); ctx.strokeStyle = c.acc2; ctx.lineWidth = 4; ctx.lineCap = 'square';
    const L = 26, i = 6;
    [[i, i, 1, 1], [w - i, i, -1, 1], [i, h - i, 1, -1], [w - i, h - i, -1, -1]].forEach(q => {
      ctx.beginPath(); ctx.moveTo(q[0], q[1] + q[3] * L); ctx.lineTo(q[0], q[1]); ctx.lineTo(q[0] + q[2] * L, q[1]); ctx.stroke();
    });
    ctx.restore();
  }
  function shangCard(ctx, T, w, h) {
    if (T.bare) return;
    const c = T.c;
    ctx.save(); softShadow(ctx, c.shadow, 28, 8); ctx.fillStyle = c.panel; ctx.fillRect(0, 0, w, h); ctx.restore();
    ctx.save(); ctx.strokeStyle = c.line; ctx.globalAlpha = 0.4; ctx.lineWidth = 1; ctx.strokeRect(10.5, 10.5, w - 21, h - 21); ctx.restore();
  }
  function bareLineShadow(ctx, T) { if (T.bare) softShadow(ctx, 'rgba(0,0,0,.5)', 8, 2); }
  function pinPath(ctx, cx, top, h) {
    const r = h * 0.36, cy = top + r, d = h - r, b = Math.acos(Math.min(1, r / d));
    ctx.beginPath(); ctx.moveTo(cx, top + h);
    ctx.lineTo(cx + Math.cos(Math.PI / 2 - b) * r, cy + Math.sin(Math.PI / 2 - b) * r);
    ctx.arc(cx, cy, r, Math.PI / 2 - b, Math.PI / 2 + b, true);
    ctx.closePath();
    ctx.moveTo(cx + r * 0.42, cy); ctx.arc(cx, cy, r * 0.42, 0, Math.PI * 2, true);
  }
  function checkMark(ctx, cx, cy, s, color, lw) {
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(cx - s * 0.42, cy + s * 0.02); ctx.lineTo(cx - s * 0.1, cy + s * 0.33); ctx.lineTo(cx + s * 0.46, cy - s * 0.32); ctx.stroke(); ctx.restore();
  }
  function crossMark(ctx, cx, cy, s, color, lw) {
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(cx - s * 0.33, cy - s * 0.33); ctx.lineTo(cx + s * 0.33, cy + s * 0.33);
    ctx.moveTo(cx + s * 0.33, cy - s * 0.33); ctx.lineTo(cx - s * 0.33, cy + s * 0.33); ctx.stroke(); ctx.restore();
  }
  function starburst(ctx, cx, cy, r1, r2, n, rot, color) {
    ctx.save(); ctx.fillStyle = color; ctx.beginPath();
    for (let i = 0; i < n * 2; i++) { const a = rot + i * Math.PI / n, r = i % 2 ? r2 : r1; const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r; if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
    ctx.closePath(); ctx.fill(); ctx.restore();
  }
  function arcText(ctx, text, r, center, size, f, color, top) {
    const chars = Array.from(text);
    ctx.save(); ctx.font = FONT(f, size); ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const step = Math.min(0.42, (size * 1.08) / r), total = step * (chars.length - 1);
    chars.forEach((ch, i) => {
      const a = top ? center - total / 2 + i * step : center + total / 2 - i * step;
      ctx.save(); ctx.translate(Math.cos(a) * r, Math.sin(a) * r); ctx.rotate(top ? a + Math.PI / 2 : a - Math.PI / 2); ctx.fillText(ch, 0, 0); ctx.restore();
    });
    ctx.restore();
  }
  function wavy(ctx, x, y, len, amp, wl, color, lw) {
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.beginPath();
    for (let i = 0; i <= len; i += 3) { const yy = y + Math.sin(i / wl * Math.PI * 2) * amp; if (i) ctx.lineTo(x + i, yy); else ctx.moveTo(x, yy); }
    ctx.stroke(); ctx.restore();
  }
  function dotLeader(ctx, x1, x2, y, color) {
    ctx.save(); ctx.fillStyle = color;
    for (let x = x1; x <= x2; x += 9) { ctx.beginPath(); ctx.arc(x, y, 1.6, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
  }
  function stampBox(ctx, cx, cy, B, color, rot) {
    const w = B.w + 30, h = B.h + 18;
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot); ctx.globalAlpha = 0.92;
    ctx.strokeStyle = color; ctx.lineWidth = 3; rr(ctx, -w / 2, -h / 2, w, h, 6); ctx.stroke();
    ctx.lineWidth = 1.2; rr(ctx, -w / 2 + 5, -h / 2 + 5, w - 10, h - 10, 4); ctx.stroke();
    B.draw(ctx, -B.w / 2, -B.h / 2, { color: color });
    ctx.restore();
  }
  function postmark(ctx, cx, cy, r, top, mid, bottom, color, R) {
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(-0.16); ctx.globalAlpha = 0.9;
    ctx.strokeStyle = color; ctx.fillStyle = color;
    ctx.lineWidth = r * 0.045; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke();
    ctx.lineWidth = r * 0.018; ctx.beginPath(); ctx.arc(0, 0, r * 0.64, 0, Math.PI * 2); ctx.stroke();
    arcText(ctx, top, r * 0.82, -Math.PI / 2, r * 0.2, [700, FAM.sans], color, true);
    arcText(ctx, bottom, r * 0.82, Math.PI / 2, r * 0.17, [700, FAM.sans], color, false);
    circle(ctx, -r * 0.82, 0, r * 0.035); circle(ctx, r * 0.82, 0, r * 0.035);
    ctx.font = FONT([700, FAM.sans], r * 0.19); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(mid, 0, r * 0.02);
    ctx.globalCompositeOperation = 'destination-out';
    for (let i = 0; i < 40; i++) { const a = R() * 6.28, d = R() * r * 1.02; ctx.beginPath(); ctx.arc(Math.cos(a) * d, Math.sin(a) * d, r * (0.006 + R() * 0.018), 0, 6.28); ctx.fill(); }
    ctx.restore();
  }

  /* ---------- 印章 ---------- */
  function sealDims(text, size) {
    const n = Math.max(1, Math.min(4, Array.from(text || '印').length));
    return { w: size, h: n === 2 ? size * 1.72 : n === 3 ? size * 2.4 : size, n: n };
  }
  function drawSeal(ctx, cx, cy, size, text, color, seed, rot) {
    const chars = Array.from(text || '印').slice(0, 4), d = sealDims(text, size), w = d.w, h = d.h, n = d.n;
    const m = ctx.getTransform ? ctx.getTransform() : { a: 1, b: 0 };
    const k = Math.max(0.3, Math.hypot(m.a, m.b)), pad = 3;
    const oc = mk((w + pad * 2) * k, (h + pad * 2) * k), o = oc.getContext('2d');
    o.scale(k, k); o.translate(pad, pad);
    const R = rng(seed);
    o.fillStyle = color; roughRect(o, 0, 0, w, h, size * 0.06, size * 0.016, R); o.fill();
    o.globalCompositeOperation = 'destination-out'; o.fillStyle = '#000'; o.textAlign = 'center'; o.textBaseline = 'middle';
    const inset = size * 0.13;
    if (n === 4) {
      const cs = (size - inset * 2) / 2; o.font = FONT([900, FAM.serif], cs * 0.92);
      const order = [[1, 0], [1, 1], [0, 0], [0, 1]];
      chars.forEach((ch, i) => { const q = order[i]; o.fillText(ch, inset + cs * (q[0] + 0.5), inset + cs * (q[1] + 0.5) + cs * 0.04); });
    } else {
      const cellH = (h - inset * 2) / n, fs = Math.min(cellH, w - inset * 2) * 0.94;
      o.font = FONT([900, FAM.serif], fs);
      chars.forEach((ch, i) => o.fillText(ch, w / 2, inset + cellH * (i + 0.5) + fs * 0.04));
    }
    for (let i = 0; i < 28; i++) {
      let x, y;
      if (R() < 0.6) { const side = Math.floor(R() * 4), t = R(); x = side === 1 ? w - R() * 3 : side === 3 ? R() * 3 : t * w; y = side === 0 ? R() * 3 : side === 2 ? h - R() * 3 : t * h; }
      else { x = R() * w; y = R() * h; }
      o.beginPath(); o.arc(x, y, size * (0.008 + R() * 0.02), 0, Math.PI * 2); o.fill();
    }
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot || 0); ctx.drawImage(oc, -w / 2 - pad, -h / 2 - pad, w + pad * 2, h + pad * 2); ctx.restore();
  }

  /* ---------- 样式快捷 ---------- */
  function S(T, color, extra) { return Object.assign({ color: color, hlInk: T.c.hlInk, hlColor: T.c.hl, hlMode: T.hlMode, fx: T.fx, seed: T.seed }, extra || {}); }
  function P(T, color) { return { color: color, fx: T.fx, seed: T.seed }; }
  function parseRows(s) {
    return String(s || '').split('\n').map(l => l.trim()).filter(Boolean).slice(0, 6).map(l => {
      const m = l.match(/^(.+?)[：:]\s*(.*)$/); return m ? { k: m[1].trim(), v: m[2].trim() } : { k: '', v: l };
    });
  }

  /* =================================================================
   * 各种贴图 × 各种类型
   * 每个函数返回 { w, h, bleed, sealAt, draw(ctx) }，(0,0) 为贴图左上角
   * ================================================================= */
  const K = {};

  /* ---------- 段落主题 ---------- */
  K.chapter = function (T, d, o) {
    const c = T.c, f = T.f, no = clean(d.no), title = clean(d.title) || ' ', sub = clean(d.sub);
    if (T.id === 'zhi') {
      const PD = 48;
      const noB = no ? tb(no, f.num, 136) : null;
      const lab = tb(T.brand.name + ' · 鉴宝笔记', f.bold, 22, { track: 0.24 });
      const ti = tb(title, f.title, 94, { maxW: 680, lh: 1.16 });
      const su = sub ? tb(sub, f.body, 34, { maxW: 680, lh: 1.45 }) : null;
      const rw = Math.max(lab.w, ti.w, su ? su.w : 0);
      const rh = lab.h + 20 + ti.h + (su ? 22 + su.h : 0);
      const gap = 38, lw = noB ? noB.w + gap * 2 + 3 : 0;
      const w = PD * 2 + lw + rw, h = PD * 2 + Math.max(rh, noB ? noB.size * 0.9 : 0);
      return {
        w: w, h: h, bleed: T.bare ? E(26) : E(36, 28, 36, 50), sealAt: { x: w - 12, y: 56, size: 54, rot: 0.06 },
        draw(ctx) {
          zhiCard(ctx, T, w, h);
          let x = PD;
          if (noB) {
            noB.draw(ctx, x, h / 2 - noB.h / 2, P(T, c.acc)); x += noB.w + gap;
            ctx.save(); bareLineShadow(ctx, T); ctx.fillStyle = c.acc2; ctx.fillRect(x, PD + 4, 3, h - PD * 2 - 8); ctx.restore(); x += 3 + gap;
          }
          let y = h / 2 - rh / 2;
          lab.draw(ctx, x, y, P(T, c.acc2)); y += lab.h + 20;
          ti.draw(ctx, x, y, S(T, c.ink)); y += ti.h + 22;
          if (su) su.draw(ctx, x, y, P(T, c.sub));
        }
      };
    }
    if (T.id === 'hui') {
      const ti = tb(title, f.title, 106, { maxW: 720, lh: 1.12 });
      const su = sub ? tb(sub, f.bold, 34) : null;
      const padX = 62, padY = 42;
      const w = Math.max(ti.w + padX * 2, su ? su.w + 160 : 0), h = ti.h + padY * 2 + (su ? 20 : 0);
      const ang = -0.05, rx = rotExtra(w, h, ang), br = no ? 58 : 0;
      const pill = su ? { w: su.w + 56, h: 64 } : null;
      return {
        w: w, h: h, bleed: { l: rx.dx + (no ? 62 : 16), t: rx.dy + (no ? 62 : 16), r: rx.dx + 28, b: rx.dy + (pill ? pill.h / 2 + 26 : 28) }, sealAt: null,
        draw(ctx) {
          ctx.save(); rotAbout(ctx, w / 2, h / 2, ang);
          if (!T.bare) { hardBlock(ctx, 0, 0, w, h, 24, c.panel, c.shadow); couponDash(ctx, 13, 13, w - 26, h - 26, 14, c.ink); }
          ti.draw(ctx, (w - ti.w) / 2, padY, S(T, c.ink));
          if (pill) {
            const px = w - pill.w - 36, py = h - pill.h / 2;
            hardBlock(ctx, px, py, pill.w, pill.h, pill.h / 2, c.pill, T.bare ? c.shadow : null, [5, 6]);
            su.draw(ctx, px + 28, py + (pill.h - su.h) / 2, { color: c.pillInk });
          }
          if (no) {
            const nb = tb(no, f.num, 60), bx = 8, by = 8;
            ctx.fillStyle = c.shadow; circle(ctx, bx + 6, by + 8, br);
            ctx.fillStyle = c.panel2; circle(ctx, bx, by, br);
            nb.draw(ctx, bx - nb.w / 2, by - nb.h / 2, { color: c.ink2 });
          }
          ctx.restore();
        }
      };
    }
    if (T.id === 'shang') {
      if (o.vertical) {
        const PD = 50, gap = 40;
        const ti = tb(title, f.title, 100, { vertical: true, track: 0.14, maxH: 560, lh: 1.4 });
        const su = sub ? tb(sub, f.body, 30, { vertical: true, track: 0.32, maxH: 560, lh: 1.6 }) : null;
        const noB = no ? tb(no, f.num, 40, { track: 0.08 }) : null;
        const colW = Math.max(ti.w, noB ? noB.w : 0);
        const topH = noB ? noB.h + 16 + 34 + 20 : 0;
        const w = PD * 2 + (su ? su.w + gap : 0) + colW;
        const h = PD * 2 + topH + Math.max(ti.h, su ? su.h + 90 : 0);
        const tx = w - PD - colW;
        return {
          w: w, h: h, bleed: T.bare ? E(28) : E(30, 24, 30, 40), sealAt: { x: PD + 4, y: h - PD + 4, size: 44, rot: 0 },
          draw(ctx) {
            shangCard(ctx, T, w, h);
            let y = PD;
            if (noB) {
              noB.draw(ctx, tx + colW / 2 - noB.w / 2, y, P(T, c.acc)); y += noB.h + 16;
              ctx.save(); bareLineShadow(ctx, T); ctx.fillStyle = c.acc; ctx.fillRect(tx + colW / 2 - 1, y, 2, 34); ctx.restore(); y += 34 + 20;
            }
            ti.draw(ctx, tx + (colW - ti.w) / 2, y, S(T, c.ink));
            if (su) su.draw(ctx, tx - gap - su.w, y + 90, P(T, c.sub));
          }
        };
      }
      const PD = 50;
      const noB = no ? tb(no, f.num, 42, { track: 0.12 }) : null;
      const ti = tb(title, f.title, 92, { maxW: 720, track: 0.1, lh: 1.2 });
      const su = sub ? tb(sub, f.body, 32, { maxW: 720, track: 0.2 }) : null;
      const cw = Math.max(ti.w, su ? su.w : 0, noB ? noB.w + 220 : 0);
      const ch = (noB ? noB.h + 24 : 0) + ti.h + (su ? 24 + su.h : 0);
      const w = PD * 2 + cw, h = PD * 2 + ch;
      return {
        w: w, h: h, bleed: T.bare ? E(28) : E(30, 24, 30, 40), sealAt: { x: w - PD - 12, y: h - 2, size: 44, rot: 0 },
        draw(ctx) {
          shangCard(ctx, T, w, h);
          let y = PD;
          if (noB) {
            noB.draw(ctx, PD, y, P(T, c.acc));
            ctx.save(); bareLineShadow(ctx, T); ctx.fillStyle = c.line; ctx.fillRect(PD + noB.w + 20, y + noB.h / 2, w - PD * 2 - noB.w - 20, 1.5); ctx.restore();
            y += noB.h + 24;
          }
          ti.draw(ctx, PD, y, S(T, c.ink)); y += ti.h + 24;
          if (su) su.draw(ctx, PD, y, P(T, c.sub));
        }
      };
    }
    // xing
    if (o.vertical) {
      const PD = 48;
      const ti = tb(title, f.title, 108, { vertical: true, track: 0.04, maxH: 600, lh: 1.3 });
      const su = sub ? tb(sub, f.body, 30, { vertical: true, track: 0.2, maxH: 600, lh: 1.5 }) : null;
      const nr = no ? 40 : 0, nb = no ? tb(no, f.bold, 32) : null;
      const top = no ? nr * 2 + 24 : 0;
      const w = PD * 2 + ti.w + (su ? 30 + su.w : 0), h = PD * 2 + top + Math.max(ti.h, su ? su.h + 70 : 0);
      const ang = 0.02, rx = rotExtra(w, h, ang);
      return {
        w: w, h: h, bleed: { l: rx.dx + 24, t: rx.dy + 40, r: rx.dx + 24, b: rx.dy + 36 }, sealAt: { x: PD + 12, y: h - PD - 6, size: 46, rot: -0.12 },
        draw(ctx) {
          const R = rng(T.seed);
          ctx.save(); rotAbout(ctx, w / 2, h / 2, ang);
          if (!T.bare) { paper(ctx, T, 0, 0, w, h, R); tape(ctx, w / 2, 2, 124, 38, -0.06, c.tape); }
          const tx = w - PD - ti.w; let y = PD;
          if (no) { handCircle(ctx, tx + ti.w / 2, y + nr, nr, nr * 0.9, c.acc, 4, R); nb.draw(ctx, tx + ti.w / 2 - nb.w / 2, y + nr - nb.h / 2, P(T, c.acc)); y += nr * 2 + 24; }
          ti.draw(ctx, tx, y, S(T, c.ink));
          if (su) su.draw(ctx, tx - 30 - su.w, y + 70, P(T, c.sub));
          ctx.restore();
        }
      };
    }
    {
      const PD = 52;
      const ti = tb(title, f.title, 114, { maxW: 720, lh: 1.15 });
      const su = sub ? tb(sub, f.body, 32, { maxW: 720 }) : null;
      const nr = no ? 46 : 0, nb = no ? tb(no, f.bold, 36) : null, lead = no ? nr * 2 + 26 : 0;
      const w = PD * 2 + Math.max(lead + ti.w, su ? su.w : 0), h = PD * 2 + ti.h + 30 + (su ? 16 + su.h : 0);
      const ang = -0.022, rx = rotExtra(w, h, ang);
      return {
        w: w, h: h, bleed: { l: rx.dx + 24, t: rx.dy + 38, r: rx.dx + 24, b: rx.dy + 36 }, sealAt: { x: w - 46, y: h - 42, size: 50, rot: -0.12 },
        draw(ctx) {
          const R = rng(T.seed);
          ctx.save(); rotAbout(ctx, w / 2, h / 2, ang);
          if (!T.bare) { paper(ctx, T, 0, 0, w, h, R); tape(ctx, 78, 2, 132, 40, -0.22, c.tape); }
          let x = PD; const y = PD;
          if (no) { handCircle(ctx, x + nr, y + ti.size / 2, nr, nr * 0.9, c.acc, 4.5, R); nb.draw(ctx, x + nr - nb.w / 2, y + ti.size / 2 - nb.h / 2, P(T, c.acc)); x += lead; }
          ti.draw(ctx, x, y, S(T, c.ink));
          ctx.save(); bareLineShadow(ctx, T); ctx.fillStyle = c.acc; brushLine(ctx, x - 4, y + ti.h + 16, ti.w * 0.9 + 8, 11, R); ctx.restore();
          if (su) su.draw(ctx, PD, y + ti.h + 30 + 16, P(T, c.sub));
          ctx.restore();
        }
      };
    }
  };

  /* ---------- 句子强调 ---------- */
  K.emph = function (T, d, o) {
    const c = T.c, f = T.f, text = d.text || ' ', lab = clean(d.label), align = o.align === 'center' ? 'center' : 'left';
    if (T.id === 'zhi') {
      const PD = 46;
      const B = tb(text, f.text, 62, { maxW: 820, lh: 1.46, align: align });
      const L = lab ? tb(lab, f.bold, 26, { track: 0.14 }) : null;
      const w = PD * 2 + Math.max(B.w, L ? L.w + 90 : 0), h = PD * 2 + B.h + (L ? 14 : 0);
      return {
        w: w, h: h, bleed: T.bare ? E(26, L ? 40 : 26, 26, 26) : E(36, L ? 40 : 28, 36, 50), sealAt: null,
        draw(ctx) {
          zhiCard(ctx, T, w, h);
          if (L) { const tw = L.w + 38, th = 48, tx = 30, ty = -20; ctx.fillStyle = c.panel2; ctx.fillRect(tx, ty, tw, th); L.draw(ctx, tx + 19, ty + (th - L.h) / 2, { color: c.ink2 }); }
          B.draw(ctx, PD, PD + (L ? 14 : 0), S(T, c.ink, { alignW: w - PD * 2 }));
        }
      };
    }
    if (T.id === 'hui') {
      const padX = 56, padY = 42;
      const B = tb(text, f.text, 66, { maxW: 820, lh: 1.4, align: align });
      const L = lab ? tb(lab, f.bold, 30) : null;
      const w = Math.max(B.w + padX * 2, L ? L.w + 120 : 0), h = B.h + padY * 2 + (L ? 16 : 0);
      return {
        w: w, h: h, bleed: { l: 22, t: L ? 50 : 18, r: 30, b: 32 }, sealAt: null,
        draw(ctx) {
          if (!T.bare) hardBlock(ctx, 0, 0, w, h, 24, c.panel, c.shadow);
          B.draw(ctx, padX, padY + (L ? 16 : 0), S(T, c.ink, { alignW: w - padX * 2 }));
          if (L) {
            const pw = L.w + 42, ph = 56;
            ctx.save(); ctx.translate(28 + pw / 2, -4); ctx.rotate(-0.06);
            hardBlock(ctx, -pw / 2, -ph / 2, pw, ph, ph / 2, c.panel2, c.shadow, [5, 6]);
            L.draw(ctx, -L.w / 2, -L.h / 2, { color: c.ink2 }); ctx.restore();
          }
        }
      };
    }
    if (T.id === 'shang') {
      const PD = 48;
      const B = tb(text, f.text, 56, { maxW: 800, track: 0.06, lh: 1.72, align: align });
      const L = lab ? tb(lab, f.bold, 24, { track: 0.42 }) : null;
      const w = PD * 2 + Math.max(B.w, L ? L.w + 72 : 0), h = PD * 2 + B.h + B.size * 0.3 + (L ? L.h + 26 : 0);
      return {
        w: w, h: h, bleed: T.bare ? E(30) : E(30, 24, 30, 40), sealAt: null,
        draw(ctx) {
          shangCard(ctx, T, w, h);
          let y = PD;
          if (L) {
            ctx.save(); bareLineShadow(ctx, T); ctx.fillStyle = c.acc; ctx.fillRect(PD, y + L.h / 2, 48, 1.6); ctx.restore();
            L.draw(ctx, PD + 64, y, P(T, c.acc)); y += L.h + 26;
          }
          B.draw(ctx, PD, y, S(T, c.ink, { alignW: w - PD * 2 }));
        }
      };
    }
    {
      const PD = 50;
      const B = tb(text, f.text, 66, { maxW: 820, lh: 1.42, align: align });
      const L = lab ? tb(lab, f.bold, 26, { track: 0.1 }) : null;
      const w = PD * 2 + Math.max(B.w, L ? L.w + 160 : 0), h = PD * 2 + B.h;
      const ang = -0.02, rx = rotExtra(w, h, ang);
      return {
        w: w, h: h, bleed: { l: rx.dx + 22, t: rx.dy + (L ? 52 : 32), r: rx.dx + (L ? 44 : 22), b: rx.dy + 36 }, sealAt: null,
        draw(ctx) {
          const R = rng(T.seed);
          ctx.save(); rotAbout(ctx, w / 2, h / 2, ang);
          if (!T.bare) { paper(ctx, T, 0, 0, w, h, R); tape(ctx, 72, 2, 124, 38, -0.2, c.tape); }
          B.draw(ctx, PD, PD, S(T, c.ink, { alignW: w - PD * 2 }));
          if (L) stampBox(ctx, w - 44 - L.w / 2, 2, L, c.acc2, 0.08);
          ctx.restore();
        }
      };
    }
  };

  /* ---------- 关键词 ---------- */
  K.word = function (T, d, o) {
    const c = T.c, f = T.f, word = clean(d.word) || ' ', py = clean(d.pinyin), note = clean(d.note);
    if (T.id === 'zhi') {
      const PD = 50;
      const tag = tb(T.brand.name + ' · 文玩词典', f.bold, 20, { track: 0.26 });
      const Y = py ? tb(py, f.latin, 42, { track: 0.02 }) : null;
      const W = tb(word, f.title, 150, { track: 0.03, maxW: 860, lh: 1.1 });
      const N = note ? tb(note, f.body, 32, { maxW: 720, lh: 1.5 }) : null;
      const cw = Math.max(W.w, Y ? Y.w : 0, N ? N.w : 0, tag.w);
      const w = PD * 2 + cw, h = PD * 2 + tag.h + 22 + (Y ? Y.h + 4 : 0) + W.h + (N ? 32 + N.h : 0);
      return {
        w: w, h: h, bleed: T.bare ? E(26) : E(36, 28, 36, 50), sealAt: { x: w - 12, y: 66, size: 56, rot: -0.06 },
        draw(ctx) {
          zhiCard(ctx, T, w, h);
          let y = PD;
          tag.draw(ctx, PD, y, P(T, c.acc2)); y += tag.h + 22;
          if (Y) { Y.draw(ctx, PD, y, P(T, c.acc2)); y += Y.h + 4; }
          W.draw(ctx, PD, y, S(T, c.acc)); y += W.h;
          if (N) {
            ctx.save(); bareLineShadow(ctx, T); ctx.fillStyle = c.acc2; ctx.fillRect(PD, y + 14, 64, 3); ctx.restore();
            N.draw(ctx, PD, y + 32, P(T, c.sub));
          }
        }
      };
    }
    if (T.id === 'hui') {
      const W = tb(word, f.title, 172, { maxW: 860, lh: 1.08 });
      const Y = py ? tb(py, f.bold, 30, { track: 0.1 }) : null;
      const N = note ? tb(note, f.bold, 30, { maxW: 720, lh: 1.35 }) : null;
      const padX = 56, padY = 30;
      const bw = Math.max(W.w, Y ? Y.w : 0) + padX * 2, bh = (Y ? Y.h + 8 : 0) + W.h + padY * 2;
      const pill = N ? { w: N.w + 54, h: N.h + 30 } : null;
      const w = Math.max(bw, pill ? pill.w + 70 : 0), h = bh + (pill ? pill.h * 0.7 : 0);
      const ang = -0.045, rx = rotExtra(w, h, ang);
      return {
        w: w, h: h, bleed: { l: rx.dx + 20, t: rx.dy + 20, r: rx.dx + 32, b: rx.dy + 34 }, sealAt: null,
        draw(ctx) {
          ctx.save(); rotAbout(ctx, w / 2, h / 2, ang);
          const bx = (w - bw) / 2;
          if (!T.bare) { hardBlock(ctx, bx, 0, bw, bh, 26, c.panel, c.shadow); couponDash(ctx, bx + 12, 12, bw - 24, bh - 24, 16, c.ink); }
          let y = padY;
          if (Y) { Y.draw(ctx, bx + (bw - Y.w) / 2, y, P(T, T.bare ? c.acc : c.sub)); y += Y.h + 8; }
          W.draw(ctx, bx + (bw - W.w) / 2, y, S(T, c.ink));
          if (pill) {
            const px = (w - pill.w) / 2 + 34, py2 = bh - pill.h * 0.3;
            hardBlock(ctx, px, py2, pill.w, pill.h, Math.min(pill.h / 2, 30), c.pill, c.shadow, [6, 7]);
            N.draw(ctx, px + 27, py2 + 15, { color: c.pillInk });
          }
          ctx.restore();
        }
      };
    }
    if (T.id === 'shang') {
      const PD = 58;
      const Y = py ? tb(py, f.latin, 36, { track: 0.28 }) : null;
      const W = tb(word, f.title, 150, { track: 0.18, maxW: 860, lh: 1.1, align: 'center' });
      const N = note ? tb(note, f.body, 30, { track: 0.08, maxW: 640, lh: 1.65, align: 'center' }) : null;
      const cw = Math.max(W.w, Y ? Y.w : 0, N ? N.w : 0, 280);
      const w = PD * 2 + cw, h = PD * 2 + (Y ? Y.h + 18 : 0) + W.h + (N ? 62 + N.h : 0);
      return {
        w: w, h: h, bleed: T.bare ? E(30) : E(30, 24, 30, 40), sealAt: { x: w - 8, y: PD + (Y ? Y.h + 18 : 0) + W.size * 0.5, size: 44, rot: 0 },
        draw(ctx) {
          shangCard(ctx, T, w, h);
          let y = PD;
          if (Y) { Y.draw(ctx, (w - Y.w) / 2, y, P(T, c.acc)); y += Y.h + 18; }
          W.draw(ctx, (w - W.w) / 2, y, S(T, c.ink)); y += W.h;
          if (N) {
            const lw = Math.min(W.w * 0.5, 240);
            ctx.save(); bareLineShadow(ctx, T); ctx.fillStyle = c.acc; ctx.fillRect((w - lw) / 2, y + 30, lw, 1.6); ctx.restore();
            N.draw(ctx, (w - N.w) / 2, y + 62, P(T, c.sub));
          }
        }
      };
    }
    {
      const PD = 50;
      const Y = py ? tb(py, f.body, 28, { track: 0.06 }) : null;
      const W = tb(word, f.title, 178, { maxW: 860, lh: 1.08 });
      const N = note ? tb(note, f.body, 30, { maxW: 680, lh: 1.5 }) : null;
      const cw = Math.max(W.w + 30, Y ? Y.w : 0, N ? N.w : 0);
      const w = PD * 2 + cw, h = PD * 2 + (Y ? Y.h + 10 : 0) + W.h + (N ? 24 + N.h : 0);
      const ang = 0.018, rx = rotExtra(w, h, ang);
      return {
        w: w, h: h, bleed: { l: rx.dx + 24, t: rx.dy + 36, r: rx.dx + 24, b: rx.dy + 36 }, sealAt: { x: Math.min(w - 30, PD + W.w + 60), y: PD + (Y ? Y.h + 10 : 0) + W.size * 0.5, size: 46, rot: 0.1 },
        draw(ctx) {
          const R = rng(T.seed);
          ctx.save(); rotAbout(ctx, w / 2, h / 2, ang);
          if (!T.bare) { paper(ctx, T, 0, 0, w, h, R); tape(ctx, w - 80, 2, 130, 40, 0.18, c.tape); }
          let y = PD;
          if (Y) { Y.draw(ctx, PD, y, P(T, c.sub)); y += Y.h + 10; }
          ctx.fillStyle = c.hl; marker(ctx, PD - 12, y + W.size * 0.36, W.w + 30, W.size * 0.56, R);
          W.draw(ctx, PD + 4, y, P(T, c.ink)); y += W.h;
          if (N) N.draw(ctx, PD, y + 24, P(T, c.sub));
          ctx.restore();
        }
      };
    }
  };

  /* ---------- 金句 ---------- */
  K.quote = function (T, d, o) {
    const c = T.c, f = T.f, text = d.text || ' ', by = clean(d.by), align = o.align === 'center' ? 'center' : 'left';
    if (T.id === 'zhi') {
      const PD = 54, top = 64;
      const Q = tb(text, f.title, 64, { maxW: 780, lh: 1.46, align: align });
      const Bb = by ? tb(by, f.bold, 28, { track: 0.12 }) : null;
      const qm = tb('“', [700, FAM.corm], 190);
      const w = PD * 2 + Math.max(Q.w, Bb ? Bb.w + 70 : 0, 320), h = PD + top + Q.h + (Bb ? 36 + Bb.h : 0) + PD;
      return {
        w: w, h: h, bleed: T.bare ? E(26) : E(36, 28, 36, 50), sealAt: { x: 66, y: h - 60, size: 54, rot: -0.08 },
        draw(ctx) {
          zhiCard(ctx, T, w, h);
          qm.draw(ctx, PD - 10, PD - 46, P(T, c.acc2));
          Q.draw(ctx, PD, PD + top, S(T, c.ink, { alignW: w - PD * 2 }));
          if (Bb) {
            const y = PD + top + Q.h + 36, bx = w - PD - Bb.w;
            ctx.save(); bareLineShadow(ctx, T); ctx.fillStyle = c.acc2; ctx.fillRect(bx - 62, y + Bb.h / 2 - 1, 46, 2); ctx.restore();
            Bb.draw(ctx, bx, y, P(T, c.sub));
          }
        }
      };
    }
    if (T.id === 'hui') {
      const padX = 58, padY = 48;
      const Q = tb(text, f.text, 68, { maxW: 800, lh: 1.36, align: align });
      const Bb = by ? tb(by + '说', f.bold, 30) : null;
      const w = Math.max(Q.w + padX * 2, Bb ? Bb.w + 140 : 0), h = Q.h + padY * 2 + (Bb ? 12 : 0), tail = 48;
      const bubble = (ctx2, ox, oy) => {
        rr(ctx2, ox, oy, w, h, 30);
        ctx2.moveTo(ox + 74, oy + h - 2); ctx2.lineTo(ox + 50, oy + h + tail); ctx2.lineTo(ox + 136, oy + h - 2); ctx2.closePath();
      };
      return {
        w: w, h: h, bleed: { l: 22, t: Bb ? 48 : 18, r: 30, b: tail + 30 }, sealAt: null,
        draw(ctx) {
          if (!T.bare) { ctx.fillStyle = c.shadow; bubble(ctx, 10, 12); ctx.fill(); ctx.fillStyle = c.panel; bubble(ctx, 0, 0); ctx.fill(); }
          Q.draw(ctx, padX, padY + (Bb ? 12 : 0), S(T, c.ink, { alignW: w - padX * 2 }));
          if (Bb) {
            const pw = Bb.w + 40, ph = 54;
            ctx.save(); ctx.translate(34 + pw / 2, -2); ctx.rotate(-0.05);
            hardBlock(ctx, -pw / 2, -ph / 2, pw, ph, ph / 2, c.panel2, c.shadow, [5, 6]);
            Bb.draw(ctx, -Bb.w / 2, -Bb.h / 2, { color: c.ink2 }); ctx.restore();
          }
        }
      };
    }
    if (T.id === 'shang') {
      if (o.vertical) {
        const PD = 56;
        const Q = tb(text, f.title, 78, { vertical: true, track: 0.1, maxH: 760, lh: 1.6 });
        const Bb = by ? tb(by, f.body, 28, { vertical: true, track: 0.34 }) : null;
        const w = PD * 2 + Q.w + (Bb ? 46 + Bb.w : 0), h = PD * 2 + Math.max(Q.h, Bb ? Bb.h + 120 : 0);
        return {
          w: w, h: h, bleed: T.bare ? E(30) : E(30, 24, 30, 40), sealAt: { x: PD + (Bb ? Bb.w / 2 : 22), y: h - PD + 2, size: 42, rot: 0 },
          draw(ctx) {
            shangCard(ctx, T, w, h);
            Q.draw(ctx, w - PD - Q.w, PD, S(T, c.ink));
            if (Bb) {
              const y = h - PD - Bb.h - 48;
              ctx.save(); bareLineShadow(ctx, T); ctx.fillStyle = c.acc; ctx.fillRect(PD + Bb.w / 2 - 0.8, y - 46, 1.6, 30); ctx.restore();
              Bb.draw(ctx, PD, y, P(T, c.sub));
            }
          }
        };
      }
      const PD = 58;
      const Q = tb(text, f.title, 66, { maxW: 780, track: 0.06, lh: 1.55, align: 'center' });
      const Bb = by ? tb(by, f.body, 28, { track: 0.3 }) : null;
      const qm = tb('“  ”', [600, FAM.corm], 80);
      const w = PD * 2 + Math.max(Q.w, 340), h = PD * 2 + 44 + Q.h + (Bb ? 36 + Bb.h : 0);
      return {
        w: w, h: h, bleed: T.bare ? E(30) : E(30, 24, 30, 40), sealAt: { x: w - PD - 12, y: h - 2, size: 42, rot: 0 },
        draw(ctx) {
          shangCard(ctx, T, w, h);
          qm.draw(ctx, (w - qm.w) / 2, PD - 22, P(T, c.acc));
          Q.draw(ctx, PD, PD + 44, S(T, c.ink, { alignW: w - PD * 2 }));
          if (Bb) {
            const y = PD + 44 + Q.h + 36;
            ctx.save(); bareLineShadow(ctx, T); ctx.fillStyle = c.acc;
            ctx.fillRect((w - Bb.w) / 2 - 58, y + Bb.h / 2, 40, 1.6); ctx.fillRect((w + Bb.w) / 2 + 18, y + Bb.h / 2, 40, 1.6); ctx.restore();
            Bb.draw(ctx, (w - Bb.w) / 2, y, P(T, c.sub));
          }
        }
      };
    }
    if (o.vertical) {
      const PD = 52;
      const Q = tb(text, f.text, 80, { vertical: true, track: 0.04, maxH: 760, lh: 1.4 });
      const Bb = by ? tb(by, f.title, 42, { vertical: true }) : null;
      const w = PD * 2 + Q.w + (Bb ? 40 + Bb.w : 0), h = PD * 2 + Math.max(Q.h, Bb ? Bb.h + 140 : 0);
      const ang = 0.02, rx = rotExtra(w, h, ang);
      return {
        w: w, h: h, bleed: { l: rx.dx + 24, t: rx.dy + 40, r: rx.dx + 24, b: rx.dy + 36 }, sealAt: { x: PD + (Bb ? Bb.w / 2 : 24), y: h - PD - 4, size: 44, rot: -0.1 },
        draw(ctx) {
          const R = rng(T.seed);
          ctx.save(); rotAbout(ctx, w / 2, h / 2, ang);
          if (!T.bare) { paper(ctx, T, 0, 0, w, h, R); tape(ctx, w / 2, 2, 124, 38, 0.05, c.tape); }
          Q.draw(ctx, w - PD - Q.w, PD, S(T, c.ink));
          if (Bb) Bb.draw(ctx, PD, h - PD - Bb.h - 60, P(T, c.sub));
          ctx.restore();
        }
      };
    }
    {
      const PD = 54;
      const Q = tb(text, f.text, 72, { maxW: 800, lh: 1.36, align: align });
      const Bb = by ? tb('—— ' + by, f.title, 44) : null;
      const w = PD * 2 + Math.max(Q.w, Bb ? Bb.w + 90 : 0), h = PD * 2 + Q.h + (Bb ? 26 + Bb.h : 0);
      const ang = -0.018, rx = rotExtra(w, h, ang);
      return {
        w: w, h: h, bleed: { l: rx.dx + 24, t: rx.dy + 38, r: rx.dx + 24, b: rx.dy + 36 }, sealAt: { x: w - PD - (Bb ? Bb.w : 0) - 44, y: h - PD - (Bb ? Bb.h / 2 : 20), size: 44, rot: -0.12 },
        draw(ctx) {
          const R = rng(T.seed);
          ctx.save(); rotAbout(ctx, w / 2, h / 2, ang);
          if (!T.bare) { paper(ctx, T, 0, 0, w, h, R); tape(ctx, w - 84, 2, 132, 40, 0.16, c.tape); }
          Q.draw(ctx, PD, PD, S(T, c.ink, { alignW: w - PD * 2 }));
          if (Bb) Bb.draw(ctx, w - PD - Bb.w, PD + Q.h + 26, P(T, c.sub));
          ctx.restore();
        }
      };
    }
  };

  /* ---------- 细节标注 ---------- */
  K.callout = function (T, d) {
    const c = T.c, f = T.f, text = clean(d.text) || ' ', sub = clean(d.sub), dir = d.dir || '右下';
    const sx = dir.indexOf('左') >= 0 ? -1 : 1, sy = dir.indexOf('上') >= 0 ? -1 : 1;
    let L, tr;
    if (T.id === 'zhi') {
      const M = tb(text, f.text, 44), Sb = sub ? tb(sub, f.bold, 22, { track: 0.2 }) : null;
      const lw = Math.max(M.w, Sb ? Sb.w : 0) + 48, lh = M.h + (Sb ? Sb.h + 10 : 0) + 36;
      L = { w: lw, h: lh, ly: lh / 2, draw(ctx) {
        if (!T.bare) { ctx.save(); softShadow(ctx, c.shadow, 20, 6); ctx.fillStyle = c.panel; ctx.fillRect(0, 0, lw, lh); ctx.restore(); ctx.strokeStyle = c.line; ctx.lineWidth = 1.5; ctx.strokeRect(6, 6, lw - 12, lh - 12); }
        let y = 18; if (Sb) { Sb.draw(ctx, 24, y, P(T, c.acc2)); y += Sb.h + 10; }
        M.draw(ctx, 24, y, S(T, c.ink));
      } };
      tr = 26;
    } else if (T.id === 'hui') {
      const M = tb(text, f.text, 46), Sb = sub ? tb(sub, f.bold, 24) : null;
      const tagW = Sb ? Sb.w + 26 : 0, lh = M.h + 34, lw = M.w + 56 + (Sb ? tagW + 14 : 0);
      L = { w: lw, h: lh, ly: lh / 2, draw(ctx) {
        if (!T.bare) hardBlock(ctx, 0, 0, lw, lh, lh / 2, c.panel, c.shadow, [6, 8]);
        let x = 28;
        if (Sb) { ctx.fillStyle = c.panel2; rr(ctx, x - 6, (lh - Sb.h - 16) / 2, tagW, Sb.h + 16, 8); ctx.fill(); Sb.draw(ctx, x + 7, (lh - Sb.h) / 2, { color: c.ink2 }); x += tagW + 8; }
        M.draw(ctx, x, (lh - M.h) / 2, S(T, c.ink));
      } };
      tr = 28;
    } else if (T.id === 'shang') {
      const M = tb(text, f.title, 46, { track: 0.12 }), Sb = sub ? tb(sub, f.body, 22, { track: 0.36 }) : null;
      const pad = T.bare ? 0 : 22;
      const lw = Math.max(M.w, Sb ? Sb.w : 0) + pad * 2, lh = M.h + (Sb ? Sb.h + 8 : 0) + 14 + pad * 2;
      L = { w: lw, h: lh, ly: lh - pad, draw(ctx) {
        if (!T.bare) { ctx.save(); softShadow(ctx, c.shadow, 18, 5); ctx.fillStyle = c.panel; ctx.fillRect(0, 0, lw, lh); ctx.restore(); }
        let y = pad; if (Sb) { Sb.draw(ctx, pad, y, P(T, c.acc)); y += Sb.h + 8; }
        M.draw(ctx, pad, y, S(T, c.ink));
        ctx.save(); bareLineShadow(ctx, T); ctx.fillStyle = c.acc; ctx.fillRect(pad, lh - pad - 1, lw - pad * 2, 1.6); ctx.restore();
      } };
      tr = 20;
    } else {
      const M = tb(text, f.text, 50), Sb = sub ? tb(sub, f.body, 22) : null;
      const lw = Math.max(M.w, Sb ? Sb.w : 0) + 52, lh = M.h + (Sb ? Sb.h + 6 : 0) + 36;
      L = { w: lw, h: lh, ly: lh / 2, draw(ctx) {
        const R = rng(T.seed + 5);
        if (!T.bare) { paper(ctx, T, 0, 0, lw, lh, R); tape(ctx, lw / 2, 0, 70, 26, -0.1, c.tape); }
        let y = 18; if (Sb) { Sb.draw(ctx, 26, y, P(T, c.sub)); y += Sb.h + 6; }
        M.draw(ctx, 26, y, S(T, c.ink));
      } };
      tr = 38;
    }
    const run = 76, diag = 150;
    const p0 = { x: sx > 0 ? L.w : 0, y: L.ly }, p1 = { x: p0.x + sx * run, y: p0.y }, p2 = { x: p1.x + sx * diag, y: p1.y + sy * diag };
    const minX = Math.min(0, p2.x - tr), maxX = Math.max(L.w, p2.x + tr), minY = Math.min(0, p2.y - tr), maxY = Math.max(L.h, p2.y + tr);
    const w = maxX - minX, h = maxY - minY, ox = -minX, oy = -minY;
    const ux = (p2.x - p1.x) / Math.hypot(p2.x - p1.x, p2.y - p1.y), uy = (p2.y - p1.y) / Math.hypot(p2.x - p1.x, p2.y - p1.y);
    const end = { x: p2.x - ux * tr, y: p2.y - uy * tr };
    return {
      w: w, h: h, bleed: E(30, 30, 30, 40), sealAt: null,
      draw(ctx) {
        ctx.save(); ctx.translate(ox, oy);
        ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        if (T.id === 'zhi') {
          bareLineShadow(ctx, T); ctx.strokeStyle = c.acc2; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(p1.x, p1.y); ctx.lineTo(end.x, end.y); ctx.stroke();
          ctx.beginPath(); ctx.arc(p2.x, p2.y, tr, 0, 6.29); ctx.stroke();
          ctx.globalAlpha = 0.6; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(p2.x, p2.y, tr + 12, 0, 6.29); ctx.stroke();
          ctx.globalAlpha = 1; ctx.fillStyle = c.acc2; circle(ctx, p2.x, p2.y, 6);
        } else if (T.id === 'hui') {
          ctx.strokeStyle = c.shadow; ctx.lineWidth = 7;
          ctx.beginPath(); ctx.moveTo(p0.x + 4, p0.y + 5); ctx.lineTo(p1.x + 4, p1.y + 5); ctx.lineTo(end.x + 4, end.y + 5); ctx.stroke();
          ctx.beginPath(); ctx.arc(p2.x + 4, p2.y + 5, tr, 0, 6.29); ctx.stroke();
          ctx.strokeStyle = c.acc; ctx.lineWidth = 7;
          ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(p1.x, p1.y); ctx.lineTo(end.x, end.y); ctx.stroke();
          ctx.beginPath(); ctx.arc(p2.x, p2.y, tr, 0, 6.29); ctx.stroke();
          ctx.fillStyle = c.acc; circle(ctx, p2.x, p2.y, 7);
        } else if (T.id === 'shang') {
          bareLineShadow(ctx, T); ctx.strokeStyle = c.acc; ctx.lineWidth = 1.8;
          ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(p1.x, p1.y); ctx.lineTo(end.x, end.y); ctx.stroke();
          ctx.beginPath(); ctx.arc(p2.x, p2.y, tr, 0, 6.29); ctx.stroke();
          ctx.fillStyle = c.acc; circle(ctx, p2.x, p2.y, 4);
        } else {
          const R = rng(T.seed + 9);
          bareLineShadow(ctx, T); ctx.strokeStyle = c.acc; ctx.lineWidth = 5;
          ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.quadraticCurveTo(p1.x + sx * 30, p1.y - sy * 10, end.x, end.y); ctx.stroke();
          handCircle(ctx, p2.x, p2.y, tr, tr * 0.86, c.acc, 5, R);
        }
        ctx.restore();
        L.draw(ctx);
        ctx.restore();
      }
    };
  };

  /* ---------- 参数卡 ---------- */
  K.spec = function (T, d) {
    const c = T.c, f = T.f, name = clean(d.name) || ' ', rows = parseRows(d.rows);
    if (T.id === 'zhi') {
      const PD = 48, rowH = 58;
      const N = tb(name, f.title, 50, { maxW: 720 });
      const R2 = rows.map(r => ({ k: tb(r.k, f.body, 29), v: tb(r.v, f.text, 33) }));
      const kW = Math.max(0, ...R2.map(r => r.k.w)), vW = Math.max(0, ...R2.map(r => r.v.w));
      const w = PD * 2 + Math.max(N.w, kW + 80 + vW, 380), h = PD * 2 + N.h + 24 + 3 + 12 + R2.length * rowH;
      return {
        w: w, h: h, bleed: T.bare ? E(26) : E(36, 28, 36, 50), sealAt: { x: w - 12, y: 60, size: 50, rot: 0.06 },
        draw(ctx) {
          zhiCard(ctx, T, w, h);
          N.draw(ctx, PD, PD, S(T, c.ink));
          let y = PD + N.h + 24;
          ctx.save(); bareLineShadow(ctx, T); ctx.fillStyle = c.acc2; ctx.fillRect(PD, y, w - PD * 2, 3); ctx.restore();
          y += 3 + 12;
          R2.forEach(r => {
            const cy = y + rowH / 2;
            r.k.draw(ctx, PD, cy - r.k.h / 2, P(T, c.sub));
            r.v.draw(ctx, w - PD - r.v.w, cy - r.v.h / 2, P(T, c.ink));
            if (r.k.w) { ctx.save(); ctx.globalAlpha = T.bare ? 0.7 : 0.45; dotLeader(ctx, PD + r.k.w + 16, w - PD - r.v.w - 16, cy + 6, T.bare ? '#FFFFFF' : c.line); ctx.restore(); }
            y += rowH;
          });
        }
      };
    }
    if (T.id === 'hui') {
      const padX = 40, rowH = 60;
      const N = tb(name, f.title, 54, { maxW: 720 });
      const R2 = rows.map(r => ({ k: tb(r.k, f.bold, 28), v: tb(r.v, f.bold, 34) }));
      const kW = Math.max(0, ...R2.map(r => r.k.w)), vW = Math.max(0, ...R2.map(r => r.v.w));
      const w = padX * 2 + Math.max(N.w, kW + 60 + vW, 380), headH = N.h + 44, h = headH + R2.length * rowH + 28;
      return {
        w: w, h: h, bleed: { l: 20, t: 20, r: 30, b: 34 }, sealAt: null,
        draw(ctx) {
          if (!T.bare) {
            hardBlock(ctx, 0, 0, w, h, 22, c.card, c.shadow);
            ctx.save(); rr(ctx, 0, 0, w, h, 22); ctx.clip(); ctx.fillStyle = c.panel; ctx.fillRect(0, 0, w, headH); ctx.restore();
          } else { hardBlock(ctx, 0, 0, w, headH, 18, c.pill, c.shadow, [6, 7]); }
          N.draw(ctx, padX, (headH - N.h) / 2, S(T, T.bare ? c.pillInk : c.ink));
          let y = headH + 14;
          R2.forEach((r, i) => {
            const cy = y + rowH / 2;
            r.k.draw(ctx, padX, cy - r.k.h / 2, P(T, T.bare ? c.acc : (c.panel === '#FFC23A' ? '#C93220' : c.panel)));
            r.v.draw(ctx, w - padX - r.v.w, cy - r.v.h / 2, P(T, T.bare ? c.ink : c.cardInk));
            if (!T.bare && i < R2.length - 1) { ctx.save(); ctx.strokeStyle = 'rgba(59,13,6,.22)'; ctx.setLineDash([6, 6]); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(padX, y + rowH); ctx.lineTo(w - padX, y + rowH); ctx.stroke(); ctx.restore(); }
            y += rowH;
          });
        }
      };
    }
    if (T.id === 'shang') {
      const PD = 50, rowH = 62;
      const N = tb(name, f.title, 54, { maxW: 720, track: 0.1 });
      const R2 = rows.map(r => ({ k: tb(r.k, f.body, 24, { track: 0.4 }), v: tb(r.v, f.body, 33, { track: 0.04 }) }));
      const kW = Math.max(0, ...R2.map(r => r.k.w)), vW = Math.max(0, ...R2.map(r => r.v.w));
      const w = PD * 2 + Math.max(N.w, kW + 44 + vW, 380), h = PD * 2 + N.h + 26 + R2.length * rowH;
      return {
        w: w, h: h, bleed: T.bare ? E(30) : E(30, 24, 30, 40), sealAt: { x: w - PD - 12, y: h - 2, size: 42, rot: 0 },
        draw(ctx) {
          shangCard(ctx, T, w, h);
          N.draw(ctx, PD, PD, S(T, c.ink));
          let y = PD + N.h + 18;
          ctx.save(); bareLineShadow(ctx, T); ctx.fillStyle = c.acc; ctx.fillRect(PD, y, w - PD * 2, 1.6); ctx.restore();
          y += 8;
          R2.forEach((r, i) => {
            const cy = y + rowH / 2;
            r.k.draw(ctx, PD, cy - r.k.h / 2, P(T, c.acc));
            r.v.draw(ctx, PD + kW + 44, cy - r.v.h / 2, P(T, c.ink));
            if (i < R2.length - 1) { ctx.save(); ctx.globalAlpha = 0.5; ctx.fillStyle = c.line; ctx.fillRect(PD, y + rowH, w - PD * 2, 1); ctx.restore(); }
            y += rowH;
          });
        }
      };
    }
    {
      const PD = 50, rowH = 66;
      const N = tb(name, f.title, 62, { maxW: 720 });
      const R2 = rows.map(r => ({ k: tb(r.k, f.body, 28), v: tb(r.v, f.text, 44) }));
      const kW = Math.max(0, ...R2.map(r => r.k.w)), vW = Math.max(0, ...R2.map(r => r.v.w));
      const w = PD * 2 + Math.max(N.w, 30 + kW + 34 + vW, 380), h = PD * 2 + N.h + 18 + R2.length * rowH;
      const ang = -0.018, rx = rotExtra(w, h, ang);
      return {
        w: w, h: h, bleed: { l: rx.dx + 24, t: rx.dy + 38, r: rx.dx + 24, b: rx.dy + 36 }, sealAt: { x: w - 46, y: h - 52, size: 46, rot: 0.12 },
        draw(ctx) {
          const R = rng(T.seed);
          ctx.save(); rotAbout(ctx, w / 2, h / 2, ang);
          if (!T.bare) { paper(ctx, T, 0, 0, w, h, R); tape(ctx, 70, 2, 124, 38, -0.2, c.tape); }
          N.draw(ctx, PD, PD, S(T, c.ink));
          let y = PD + N.h + 18;
          R2.forEach(r => {
            const cy = y + rowH / 2;
            ctx.fillStyle = c.acc; circle(ctx, PD + 8, cy, 5);
            r.k.draw(ctx, PD + 30, cy - r.k.h / 2, P(T, c.sub));
            r.v.draw(ctx, PD + 30 + kW + 34, cy - r.v.h / 2, P(T, c.ink));
            if (!T.bare) { ctx.save(); ctx.strokeStyle = c.line; ctx.globalAlpha = 0.18; ctx.lineWidth = 1.5; ctx.setLineDash([8, 7]); ctx.beginPath(); ctx.moveTo(PD, y + rowH - 2); ctx.lineTo(w - PD, y + rowH - 2); ctx.stroke(); ctx.restore(); }
            y += rowH;
          });
          ctx.restore();
        }
      };
    }
  };

  /* ---------- 价格签 ---------- */
  K.price = function (T, d) {
    const c = T.c, f = T.f, lab = clean(d.label), price = clean(d.price) || '0', orig = clean(d.orig), note = clean(d.note), badge = clean(d.badge);
    if (T.id === 'hui') {
      const L = lab ? tb(lab, f.bold, 30, { track: 0.06 }) : null;
      const yen = tb('¥', f.num, 66), Pr = tb(price, f.num, 156);
      const O = orig ? tb('原价 ¥' + orig, f.body, 30) : null;
      const Nt = note ? tb(note, f.bold, 28) : null;
      const padX = 60, holeY = 44, priceW = yen.w + 10 + Pr.w;
      const cw = Math.max(L ? L.w + 48 : 0, priceW, O ? O.w : 0, Nt ? Nt.w : 0, 300);
      const top = 92;
      const w = cw + padX * 2, h = top + (L ? 58 + (T.bare ? 34 : 16) : 0) + Pr.size * 0.86 + (O ? 14 + O.h : 0) + (Nt ? 16 + Nt.h : 0) + 48;
      const bR = badge ? 76 : 0;
      return {
        w: w, h: h, bleed: { l: 22, t: T.bare ? (badge ? 54 : 30) : 150, r: badge ? 70 : 32, b: 34 }, sealAt: null,
        draw(ctx) {
          if (!T.bare) {
            const tag = (ox, oy) => { rr(ctx, ox, oy, w, h, 28); ctx.moveTo(ox + w / 2 + 15, oy + holeY); ctx.arc(ox + w / 2, oy + holeY, 15, 0, Math.PI * 2, true); };
            ctx.fillStyle = c.shadow; tag(10, 12); ctx.fill('evenodd');
            ctx.fillStyle = c.panel; tag(0, 0); ctx.fill('evenodd');
            couponDash(ctx, 14, 14, w - 28, h - 28, 18, c.ink);
            ctx.save(); ctx.strokeStyle = c.acc; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(w / 2, holeY, 19, 0, 6.29); ctx.stroke(); ctx.restore();
            ctx.save(); ctx.strokeStyle = c.acc2; ctx.lineWidth = 4; ctx.lineCap = 'round';
            ctx.beginPath(); ctx.moveTo(w / 2 - 6, holeY - 2); ctx.bezierCurveTo(w / 2 - 40, holeY - 60, w / 2 + 24, holeY - 100, w / 2 - 12, holeY - 150); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(w / 2 + 6, holeY - 2); ctx.bezierCurveTo(w / 2 + 40, holeY - 54, w / 2 + 6, holeY - 108, w / 2 + 18, holeY - 150); ctx.stroke();
            ctx.restore();
          }
          let y = top;
          if (L) {
            const pw = L.w + 48, ph = 58;
            ctx.fillStyle = T.bare ? c.pill : c.panel2; rr(ctx, (w - pw) / 2, y, pw, ph, ph / 2); ctx.fill();
            L.draw(ctx, (w - L.w) / 2, y + (ph - L.h) / 2, { color: T.bare ? c.pillInk : c.ink2 }); y += ph + (T.bare ? 34 : 16);
          }
          const px = (w - priceW) / 2, pcy = y + Pr.size * 0.43;
          yen.draw(ctx, px, pcy - yen.h / 2 + Pr.size * 0.18, P(T, c.ink));
          Pr.draw(ctx, px + yen.w + 10, pcy - Pr.h / 2, P(T, c.ink));
          y += Pr.size * 0.86;
          if (O) {
            y += 14; O.draw(ctx, (w - O.w) / 2, y, P(T, c.sub));
            ctx.save(); ctx.strokeStyle = c.sub; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo((w - O.w) / 2 - 4, y + O.h / 2 + 2); ctx.lineTo((w + O.w) / 2 + 4, y + O.h / 2 + 2); ctx.stroke(); ctx.restore();
            y += O.h;
          }
          if (Nt) { y += 16; Nt.draw(ctx, (w - Nt.w) / 2, y, P(T, c.acc)); }
          if (badge) {
            const bx = w - 20, by = 34, Bd = tb(badge, f.title, 40);
            starburst(ctx, bx + 6, by + 8, bR, bR * 0.8, 16, 0.1, c.shadow);
            starburst(ctx, bx, by, bR, bR * 0.8, 16, 0.1, c.panel2);
            ctx.save(); ctx.translate(bx, by); ctx.rotate(0.22); Bd.draw(ctx, -Bd.w / 2, -Bd.h / 2, { color: c.ink2 }); ctx.restore();
          }
        }
      };
    }
    if (T.id === 'zhi') {
      const PD = 50;
      const L = lab ? tb(lab, f.bold, 24, { track: 0.3 }) : null;
      const yen = tb('¥', f.text, 50), Pr = tb(price, f.num, 132);
      const O = orig ? tb('原价 ¥' + orig, f.body, 28) : null, Nt = note ? tb(note, f.body, 26) : null;
      const Bd = badge ? tb(badge, f.bold, 22, { track: 0.2 }) : null;
      const priceW = yen.w + 8 + Pr.w;
      const w = PD * 2 + Math.max(L ? L.w + (Bd ? Bd.w + 60 : 0) : 0, priceW, O ? O.w : 0, Nt ? Nt.w : 0, 320);
      const h = PD * 2 + (L ? L.h + 14 : 0) + Pr.size * 0.86 + (O ? 10 + O.h : 0) + (Nt ? 14 + Nt.h : 0);
      return {
        w: w, h: h, bleed: T.bare ? E(26) : E(36, 28, 36, 50), sealAt: { x: w - 12, y: h - 64, size: 50, rot: -0.06 },
        draw(ctx) {
          zhiCard(ctx, T, w, h);
          let y = PD;
          if (L) {
            L.draw(ctx, PD, y, P(T, c.acc2));
            if (Bd) { const bw = Bd.w + 24, bh = Bd.h + 12; ctx.fillStyle = c.panel2; ctx.fillRect(w - PD - bw, y - 6, bw, bh); Bd.draw(ctx, w - PD - bw + 12, y, { color: c.ink2 }); }
            y += L.h + 14;
          }
          const pcy = y + Pr.size * 0.43;
          yen.draw(ctx, PD, pcy - yen.h / 2 + Pr.size * 0.14, P(T, c.acc));
          Pr.draw(ctx, PD + yen.w + 8, pcy - Pr.h / 2, P(T, c.acc));
          y += Pr.size * 0.86;
          if (O) {
            y += 10; O.draw(ctx, PD, y, P(T, c.sub));
            ctx.save(); ctx.strokeStyle = c.sub; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(PD - 3, y + O.h / 2 + 2); ctx.lineTo(PD + O.w + 3, y + O.h / 2 + 2); ctx.stroke(); ctx.restore();
            y += O.h;
          }
          if (Nt) { y += 14; Nt.draw(ctx, PD, y, P(T, c.sub)); }
        }
      };
    }
    if (T.id === 'shang') {
      const PD = 56;
      const L = lab ? tb(lab, f.title, 36, { track: 0.28 }) : null;
      const yen = tb('¥', f.num, 54), Pr = tb(price, f.num, 124, { track: 0.02 });
      const O = orig ? tb('¥' + orig, f.num, 42) : null, Nt = note ? tb(note, f.body, 26, { track: 0.12 }) : null;
      const Bd = badge ? tb(badge, f.body, 22, { track: 0.3 }) : null;
      const priceW = yen.w + 8 + Pr.w;
      const w = PD * 2 + Math.max(L ? L.w : 0, priceW + (O ? O.w + 28 : 0), Nt ? Nt.w : 0, 320);
      const h = PD * 2 + (L ? L.h + 40 : 0) + Pr.size * 0.86 + (Nt ? 26 + Nt.h : 0) + (Bd ? Bd.h + 20 : 0);
      return {
        w: w, h: h, bleed: T.bare ? E(30) : E(30, 24, 30, 40), sealAt: { x: w - PD - 12, y: h - 2, size: 42, rot: 0 },
        draw(ctx) {
          shangCard(ctx, T, w, h);
          let y = PD;
          if (Bd) { Bd.draw(ctx, (w - Bd.w) / 2, y, P(T, c.acc2)); y += Bd.h + 20; }
          if (L) {
            L.draw(ctx, (w - L.w) / 2, y, P(T, c.ink)); y += L.h + 20;
            ctx.save(); bareLineShadow(ctx, T); ctx.fillStyle = c.acc; ctx.fillRect((w - 120) / 2, y, 120, 1.6); ctx.restore(); y += 20;
          }
          const total = priceW + (O ? O.w + 28 : 0), px = (w - total) / 2, pcy = y + Pr.size * 0.43;
          yen.draw(ctx, px, pcy - yen.h / 2 + Pr.size * 0.12, P(T, c.ink));
          Pr.draw(ctx, px + yen.w + 8, pcy - Pr.h / 2, P(T, c.ink));
          if (O) {
            const ox = px + priceW + 28; O.draw(ctx, ox, pcy - O.h / 2 + Pr.size * 0.16, P(T, c.sub));
            ctx.save(); ctx.strokeStyle = c.sub; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(ox - 2, pcy + Pr.size * 0.16); ctx.lineTo(ox + O.w + 2, pcy + Pr.size * 0.16); ctx.stroke(); ctx.restore();
          }
          y += Pr.size * 0.86;
          if (Nt) Nt.draw(ctx, (w - Nt.w) / 2, y + 26, P(T, c.sub));
        }
      };
    }
    {
      // 源头日常：牛皮纸手写价签
      const L = lab ? tb(lab, f.bold, 26, { track: 0.08 }) : null;
      const Pr = tb('¥' + price, f.text, 136);
      const O = orig ? tb('¥' + orig, f.text, 46) : null, Nt = note ? tb(note, f.text, 36) : null;
      const Bd = badge ? tb(badge, f.text, 38) : null;
      const padL = 86, padR = 54, padY = 40;
      const cw = Math.max(L ? L.w : 0, Pr.w + (O ? O.w + 30 : 0), Nt ? Nt.w : 0, 300);
      const w = padL + cw + padR, h = padY * 2 + (L ? L.h + 10 : 0) + Pr.h + (Nt ? 8 + Nt.h : 0);
      const ang = -0.035, rx = rotExtra(w, h, ang);
      return {
        w: w, h: h, bleed: { l: rx.dx + 120, t: rx.dy + (Bd ? 70 : 30), r: rx.dx + (Bd ? 70 : 30), b: rx.dy + 36 }, sealAt: null,
        draw(ctx) {
          const R = rng(T.seed);
          ctx.save(); rotAbout(ctx, w / 2, h / 2, ang);
          if (!T.bare) {
            const shape = (ox, oy) => {
              ctx.beginPath(); ctx.moveTo(ox + 40, oy); ctx.lineTo(ox + w - 12, oy); ctx.quadraticCurveTo(ox + w, oy, ox + w, oy + 12);
              ctx.lineTo(ox + w, oy + h - 12); ctx.quadraticCurveTo(ox + w, oy + h, ox + w - 12, oy + h); ctx.lineTo(ox + 40, oy + h);
              ctx.lineTo(ox, oy + h - 40); ctx.lineTo(ox, oy + 40); ctx.closePath();
              ctx.moveTo(ox + 44, oy + h / 2); ctx.arc(ox + 32, oy + h / 2, 12, 0, Math.PI * 2, true);
            };
            ctx.save(); softShadow(ctx, c.shadow, 20, 8); ctx.fillStyle = c.kraft; shape(0, 0); ctx.fill('evenodd'); ctx.restore();
            ctx.save(); ctx.strokeStyle = 'rgba(80,50,20,.55)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(32, h / 2, 16, 0, 6.29); ctx.stroke(); ctx.restore();
            ctx.save(); ctx.strokeStyle = '#8A6A44'; ctx.lineWidth = 3.5; ctx.lineCap = 'round';
            ctx.beginPath(); ctx.moveTo(32, h / 2); ctx.bezierCurveTo(-30, h / 2 - 30, -60, h / 2 - 90, -110, h / 2 - 110); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(32, h / 2); ctx.bezierCurveTo(-24, h / 2 + 10, -70, h / 2 - 40, -112, h / 2 - 96); ctx.stroke();
            ctx.restore();
          }
          const ink = T.bare ? c.ink : '#3A2718', sub = T.bare ? c.sub : '#6E5236';
          let y = padY;
          if (L) { L.draw(ctx, padL, y, P(T, sub)); y += L.h + 10; }
          Pr.draw(ctx, padL, y, P(T, ink));
          if (O) {
            const ox = padL + Pr.w + 30, oy = y + Pr.h - O.h - 12;
            O.draw(ctx, ox, oy, P(T, sub));
            ctx.save(); ctx.strokeStyle = c.acc2; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath();
            ctx.moveTo(ox - 6, oy + O.h * 0.62); ctx.quadraticCurveTo(ox + O.w / 2, oy + O.h * 0.3 + (R() - 0.5) * 8, ox + O.w + 8, oy + O.h * 0.5); ctx.stroke(); ctx.restore();
          }
          y += Pr.h;
          if (Nt) Nt.draw(ctx, padL, y + 8, P(T, T.bare ? c.acc : '#2E7553'));
          if (Bd) {
            const bx = w - 34, by = 10;
            handCircle(ctx, bx, by, Bd.w / 2 + 26, Bd.h / 2 + 18, c.acc2, 4.5, R);
            Bd.draw(ctx, bx - Bd.w / 2, by - Bd.h / 2, P(T, c.acc2));
          }
          ctx.restore();
        }
      };
    }
  };

  /* ---------- 真假对比 ---------- */
  K.vs = function (T, d) {
    const c = T.c, f = T.f, a = clean(d.a) || ' ', b = clean(d.b) || ' ', ad = clean(d.ad), bd = clean(d.bd);
    if (T.id === 'hui') {
      const A = tb(a, f.title, 58), Bt = tb(b, f.title, 58);
      const Ad = ad ? tb(ad, f.bold, 26, { maxW: 320, lh: 1.4 }) : null, Bd = bd ? tb(bd, f.bold, 26, { maxW: 320, lh: 1.4 }) : null;
      const col = (t, dd) => Math.max(t.w + 70, dd ? dd.w : 0) + 64;
      const cwA = col(A, Ad), cwB = col(Bt, Bd), gap = 54;
      const ch = 34 + Math.max(A.h, 50) + Math.max(Ad ? 16 + Ad.h : 0, Bd ? 16 + Bd.h : 0) + 34;
      const w = cwA + gap + cwB, h = ch;
      const goodBg = T.sk === 'amber' ? '#C93220' : '#FFC23A', goodInk = T.sk === 'amber' ? '#FFF7E8' : '#3B0D06';
      return {
        w: w, h: h, bleed: { l: 22, t: 26, r: 34, b: 38 }, sealAt: null,
        draw(ctx) {
          const block = (x, cw, bg, ink, mark, t, dd, ang) => {
            ctx.save(); rotAbout(ctx, x + cw / 2, h / 2, ang);
            hardBlock(ctx, x, 0, cw, h, 22, bg, c.shadow);
            const iy = 34 + Math.max(t.h, 50) / 2;
            ctx.fillStyle = ink; circle(ctx, x + 56, iy, 25);
            if (mark === 'ok') checkMark(ctx, x + 56, iy, 30, bg, 6); else crossMark(ctx, x + 56, iy, 30, bg, 6);
            t.draw(ctx, x + 96, iy - t.h / 2, { color: ink });
            if (dd) dd.draw(ctx, x + 32, 34 + Math.max(t.h, 50) + 16, { color: ink });
            ctx.restore();
          };
          block(0, cwA, goodBg, goodInk, 'ok', A, Ad, -0.02);
          block(cwA + gap, cwB, '#3B0D06', '#FFF7E8', 'no', Bt, Bd, 0.02);
          const vx = cwA + gap / 2, vy = h / 2;
          ctx.fillStyle = c.shadow; circle(ctx, vx + 5, vy + 6, 46);
          ctx.fillStyle = T.sk === 'amber' ? '#FFC23A' : '#C93220'; circle(ctx, vx, vy, 46);
          const V = tb('VS', f.num, 46); V.draw(ctx, vx - V.w / 2, vy - V.h / 2, { color: T.sk === 'amber' ? '#3B0D06' : '#FFF7E8' });
        }
      };
    }
    const cfg = {
      zhi: { PD: 46, tf: f.title, ts: 54, df: f.body, ds: 28, icon: 28 },
      shang: { PD: 50, tf: f.title, ts: 56, df: f.body, ds: 26, icon: 24 },
      xing: { PD: 50, tf: f.title, ts: 64, df: f.body, ds: 27, icon: 30 }
    }[T.id];
    const A = tb(a, cfg.tf, cfg.ts), Bt = tb(b, cfg.tf, cfg.ts);
    const Ad = ad ? tb(ad, cfg.df, cfg.ds, { maxW: 340, lh: 1.5 }) : null, Bd = bd ? tb(bd, cfg.df, cfg.ds, { maxW: 340, lh: 1.5 }) : null;
    const headW = t => cfg.icon * 2 + 20 + t.w;
    const cwA = Math.max(headW(A), Ad ? Ad.w : 0), cwB = Math.max(headW(Bt), Bd ? Bd.w : 0), mid = 96;
    const headH = Math.max(A.h, cfg.icon * 2);
    const w = cfg.PD * 2 + cwA + mid + cwB, h = cfg.PD * 2 + headH + Math.max(Ad ? 20 + Ad.h : 0, Bd ? 20 + Bd.h : 0);
    const ang = T.id === 'xing' ? -0.016 : 0, rx = rotExtra(w, h, ang);
    return {
      w: w, h: h, bleed: T.id === 'xing' ? { l: rx.dx + 24, t: rx.dy + 38, r: rx.dx + 24, b: rx.dy + 36 } : (T.bare ? E(28) : E(36, 28, 36, 50)), sealAt: null,
      draw(ctx) {
        const R = rng(T.seed);
        ctx.save(); rotAbout(ctx, w / 2, h / 2, ang);
        if (T.id === 'zhi') zhiCard(ctx, T, w, h);
        else if (T.id === 'shang') shangCard(ctx, T, w, h);
        else if (!T.bare) { paper(ctx, T, 0, 0, w, h, R); tape(ctx, w / 2, 2, 130, 40, -0.05, c.tape); }
        const col = (x, t, dd, ok) => {
          const iy = cfg.PD + headH / 2, ic = cfg.icon, color = ok ? c.good : c.bad;
          ctx.save(); bareLineShadow(ctx, T);
          if (T.id === 'zhi') {
            ctx.fillStyle = color; circle(ctx, x + ic, iy, ic);
            if (ok) checkMark(ctx, x + ic, iy, ic * 1.1, T.bare ? '#15213B' : c.panel, 5); else crossMark(ctx, x + ic, iy, ic * 1.1, T.bare ? '#15213B' : c.panel, 5);
          } else if (T.id === 'shang') {
            if (ok) { ctx.strokeStyle = color; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.arc(x + ic, iy, ic * 0.8, 0, 6.29); ctx.stroke(); }
            else crossMark(ctx, x + ic, iy, ic * 1.5, color, 2.6);
          } else {
            if (ok) checkMark(ctx, x + ic, iy, ic * 1.9, color, 8); else crossMark(ctx, x + ic, iy, ic * 1.7, color, 8);
          }
          ctx.restore();
          t.draw(ctx, x + ic * 2 + 20, iy - t.h / 2, P(T, ok ? c.ink : c.ink));
          if (dd) dd.draw(ctx, x, cfg.PD + headH + 20, P(T, c.sub));
        };
        col(cfg.PD, A, Ad, true);
        col(cfg.PD + cwA + mid, Bt, Bd, false);
        const mx = cfg.PD + cwA + mid / 2;
        ctx.save(); bareLineShadow(ctx, T);
        if (T.id === 'zhi') {
          ctx.fillStyle = c.line; ctx.globalAlpha = 0.35; ctx.fillRect(mx - 0.75, cfg.PD, 1.5, h - cfg.PD * 2); ctx.globalAlpha = 1;
          ctx.fillStyle = T.bare ? c.panel2 : c.panel; ctx.save(); ctx.translate(mx, h / 2); ctx.rotate(Math.PI / 4); ctx.fillRect(-22, -22, 44, 44); ctx.strokeStyle = c.acc2; ctx.lineWidth = 2; ctx.strokeRect(-22, -22, 44, 44); ctx.restore();
          const V = tb('VS', f.num, 30); V.draw(ctx, mx - V.w / 2, h / 2 - V.h / 2, { color: c.acc2 });
        } else if (T.id === 'shang') {
          ctx.fillStyle = c.acc; ctx.fillRect(mx - 0.8, cfg.PD + 6, 1.6, h - cfg.PD * 2 - 12);
        } else {
          ctx.strokeStyle = c.line; ctx.globalAlpha = 0.4; ctx.lineWidth = 2.5; ctx.setLineDash([10, 9]);
          ctx.beginPath(); ctx.moveTo(mx, cfg.PD); ctx.lineTo(mx + 4, h - cfg.PD); ctx.stroke();
        }
        ctx.restore();
        ctx.restore();
      }
    };
  };

  /* ---------- 人物名牌 ---------- */
  K.name = function (T, d) {
    const c = T.c, f = T.f, nm = clean(d.name) || ' ', ti = clean(d.title), ex = clean(d.extra);
    if (T.id === 'zhi') {
      const PD = 40, ss = 84, sd = sealDims(T.brand.seal, ss);
      const N = tb(nm, f.title, 64), Ti = ti ? tb(ti, f.bold, 30, { track: 0.08 }) : null, Ex = ex ? tb(ex, f.body, 26) : null;
      const tw = Math.max(N.w, Ti ? Ti.w : 0, Ex ? Ex.w : 0), th = N.h + (Ti ? 12 + Ti.h : 0) + (Ex ? 10 + Ex.h : 0);
      const w = PD * 2 + sd.w + 32 + tw, h = PD * 2 + Math.max(th, sd.h);
      return {
        w: w, h: h, bleed: T.bare ? E(26) : E(36, 28, 36, 50), sealAt: null,
        draw(ctx) {
          zhiCard(ctx, T, w, h);
          drawSeal(ctx, PD + sd.w / 2, h / 2, ss, T.brand.seal, c.sealC, T.seed + 3, 0);
          let x = PD + sd.w + 32, y = h / 2 - th / 2;
          N.draw(ctx, x, y, S(T, c.ink)); y += N.h + 12;
          if (Ti) { Ti.draw(ctx, x, y, P(T, c.acc)); y += Ti.h + 10; }
          if (Ex) Ex.draw(ctx, x, y, P(T, c.sub));
        }
      };
    }
    if (T.id === 'hui') {
      const N = tb(nm, f.title, 70), Ti = ti ? tb(ti, f.bold, 30) : null, Ex = ex ? tb(ex, f.bold, 24) : null;
      const nb = { w: N.w + 68, h: N.h + 36 }, tbx = Ti ? { w: Ti.w + 44, h: Ti.h + 24 } : null, eb = Ex ? { w: Ex.w + 36, h: Ex.h + 20 } : null;
      const w = Math.max(nb.w, tbx ? 44 + tbx.w : 0, eb ? 88 + eb.w : 0), h = nb.h + (tbx ? tbx.h - 8 : 0) + (eb ? eb.h - 4 : 0);
      return {
        w: w, h: h, bleed: { l: 20, t: 20, r: 30, b: 34 }, sealAt: null,
        draw(ctx) {
          if (!T.bare) hardBlock(ctx, 0, 0, nb.w, nb.h, 16, c.panel, c.shadow);
          N.draw(ctx, 34, 18, S(T, c.ink));
          let y = nb.h - 8;
          if (tbx) { hardBlock(ctx, 44, y, tbx.w, tbx.h, 12, c.panel2, c.shadow, [6, 7]); Ti.draw(ctx, 66, y + 12, { color: c.ink2 }); y += tbx.h - 4; }
          if (eb) { hardBlock(ctx, 88, y, eb.w, eb.h, eb.h / 2, c.pill, null); Ex.draw(ctx, 106, y + 10, { color: c.pillInk }); }
        }
      };
    }
    if (T.id === 'shang') {
      const PD = 46;
      const N = tb(nm, f.title, 78, { track: 0.12 }), Ti = ti ? tb(ti, f.body, 30, { track: 0.22 }) : null, Ex = ex ? tb(ex, f.body, 25, { track: 0.1 }) : null;
      const rw = Math.max(Ti ? Ti.w : 0, Ex ? Ex.w : 0), rh = (Ti ? Ti.h : 0) + (Ti && Ex ? 14 : 0) + (Ex ? Ex.h : 0);
      const w = PD * 2 + N.w + (rw ? 36 + 2 + 36 + rw : 0), h = PD * 2 + Math.max(N.h, rh);
      return {
        w: w, h: h, bleed: T.bare ? E(30) : E(30, 24, 30, 40), sealAt: { x: w - PD - 12, y: 2, size: 40, rot: 0 },
        draw(ctx) {
          shangCard(ctx, T, w, h);
          N.draw(ctx, PD, h / 2 - N.h / 2, S(T, c.ink));
          if (rw) {
            const lx = PD + N.w + 36;
            ctx.save(); bareLineShadow(ctx, T); ctx.fillStyle = c.acc; ctx.fillRect(lx, PD + 4, 2, h - PD * 2 - 8); ctx.restore();
            let y = h / 2 - rh / 2;
            if (Ti) { Ti.draw(ctx, lx + 38, y, P(T, c.ink)); y += Ti.h + 14; }
            if (Ex) Ex.draw(ctx, lx + 38, y, P(T, c.sub));
          }
        }
      };
    }
    {
      // 名字和补充写在纸片上，身份贴在一条胶带上压住纸片下沿
      const N = tb(nm, f.title, 88), Ti = ti ? tb(ti, f.bold, 28, { track: 0.06 }) : null, Ex = ex ? tb(ex, f.body, 26) : null;
      const sw = Math.max(N.w, Ex ? Ex.w : 0) + 76, sh = N.h + (Ex ? Ex.h + 12 : 0) + 50;
      const tw = Ti ? Ti.w + 44 : 0, th = Ti ? Ti.h + 20 : 0, tx = Math.round(Math.max(24, Math.min(sw * 0.42, sw - tw + 30)));
      const w = Math.max(sw, tx + tw + 8), h = sh + (Ti ? th - 16 : 0);
      return {
        w: w, h: h, bleed: { l: 26, t: 30, r: 30, b: 34 }, sealAt: null,
        draw(ctx) {
          const R = rng(T.seed);
          ctx.save(); rotAbout(ctx, sw / 2, sh / 2, -0.03);
          if (!T.bare) paper(ctx, T, 0, 0, sw, sh, R);
          N.draw(ctx, 38, 25, P(T, c.ink));
          if (Ex) Ex.draw(ctx, 40, 25 + N.h + 12, P(T, c.sub));
          ctx.restore();
          if (Ti) {
            ctx.save(); ctx.translate(tx + tw / 2, sh - 16 + th / 2); ctx.rotate(0.03);
            ctx.fillStyle = c.tape; ctx.fillRect(-tw / 2, -th / 2, tw, th);
            Ti.draw(ctx, -Ti.w / 2, -Ti.h / 2, { color: '#3A2718' }); ctx.restore();
          }
        }
      };
    }
  };

  /* ---------- 地点 ---------- */
  K.place = function (T, d) {
    const c = T.c, f = T.f, pl = clean(d.place) || ' ', ex = clean(d.extra), dt = clean(d.date);
    const line2 = [ex, dt].filter(Boolean).join(' · ');
    if (T.id === 'zhi') {
      const PD = 42, ph = 70;
      const L = tb('实地探访', f.bold, 22, { track: 0.32 }), Pl = tb(pl, f.title, 58), Ex = line2 ? tb(line2, f.body, 28) : null;
      const tw = Math.max(L.w, Pl.w, Ex ? Ex.w : 0), th = L.h + 12 + Pl.h + (Ex ? 12 + Ex.h : 0);
      const w = PD * 2 + 52 + 28 + tw, h = PD * 2 + Math.max(th, ph);
      return {
        w: w, h: h, bleed: T.bare ? E(26) : E(36, 28, 36, 50), sealAt: null,
        draw(ctx) {
          zhiCard(ctx, T, w, h);
          ctx.save(); bareLineShadow(ctx, T); ctx.fillStyle = c.acc2; pinPath(ctx, PD + 26, h / 2 - ph / 2, ph); ctx.fill('evenodd'); ctx.restore();
          let x = PD + 52 + 28, y = h / 2 - th / 2;
          L.draw(ctx, x, y, P(T, c.acc)); y += L.h + 12;
          Pl.draw(ctx, x, y, S(T, c.ink)); y += Pl.h + 12;
          if (Ex) Ex.draw(ctx, x, y, P(T, c.sub));
        }
      };
    }
    if (T.id === 'hui') {
      const Pl = tb(pl, f.title, 58), Ex = line2 ? tb(line2, f.bold, 26) : null;
      const pr = 50, bw = Pl.w + 70, bh = Pl.h + 36;
      const w = Math.max(pr * 2 - 16 + bw, Ex ? pr * 2 - 16 + 30 + Ex.w + 36 : 0), h = Math.max(pr * 2, bh) + (Ex ? Ex.h + 18 : 0);
      return {
        w: w, h: h, bleed: { l: 20, t: 20, r: 30, b: 34 }, sealAt: null,
        draw(ctx) {
          const bx = pr * 2 - 16, by = pr - bh / 2;
          if (!T.bare || true) hardBlock(ctx, bx, by, bw, bh, bh / 2, T.bare ? c.pill : c.panel, c.shadow);
          Pl.draw(ctx, bx + 44, by + 18, S(T, T.bare ? c.pillInk : c.ink, { fx: null }));
          ctx.fillStyle = c.shadow; circle(ctx, pr + 6, pr + 8, pr); ctx.fillStyle = c.panel2; circle(ctx, pr, pr, pr);
          ctx.fillStyle = c.ink2; pinPath(ctx, pr, pr - 30, 60); ctx.fill('evenodd');
          if (Ex) { const ew = Ex.w + 36, eh = Ex.h + 18, ex2 = bx + 30, ey = by + bh - 4; hardBlock(ctx, ex2, ey, ew, eh, eh / 2, c.pill === '#3B0D06' ? '#3B0D06' : '#3B0D06', null); Ex.draw(ctx, ex2 + 18, ey + 9, { color: '#FFC23A' }); }
        }
      };
    }
    if (T.id === 'shang') {
      const PD = 50;
      const Pl = tb(pl, f.title, 64, { track: 0.2 }), Ex = ex ? tb(ex, f.body, 28, { track: 0.12 }) : null, Dt = dt ? tb(dt, f.num, 32, { track: 0.08 }) : null;
      const row2 = (Ex ? Ex.w : 0) + (Ex && Dt ? 30 : 0) + (Dt ? Dt.w : 0);
      const w = PD * 2 + Math.max(40 + Pl.w, row2, 300), h = PD * 2 + Pl.h + (row2 ? 50 + Math.max(Ex ? Ex.h : 0, Dt ? Dt.h : 0) : 0);
      return {
        w: w, h: h, bleed: T.bare ? E(30) : E(30, 24, 30, 40), sealAt: { x: w - PD - 12, y: h - 2, size: 40, rot: 0 },
        draw(ctx) {
          shangCard(ctx, T, w, h);
          ctx.save(); bareLineShadow(ctx, T); ctx.strokeStyle = c.acc; ctx.lineWidth = 2.2; pinPath(ctx, PD + 12, PD + Pl.h / 2 - 22, 44); ctx.stroke(); ctx.restore();
          Pl.draw(ctx, PD + 40, PD, S(T, c.ink));
          if (row2) {
            const y = PD + Pl.h + 24;
            ctx.save(); bareLineShadow(ctx, T); ctx.fillStyle = c.acc; ctx.fillRect(PD, y, w - PD * 2, 1.4); ctx.restore();
            let x = PD;
            if (Ex) { Ex.draw(ctx, x, y + 26, P(T, c.sub)); x += Ex.w + 30; }
            if (Dt) Dt.draw(ctx, x, y + 24, P(T, c.acc));
          }
        }
      };
    }
    {
      // 纸片左边写地点，右端盖一枚邮戳，邮戳的波浪线伸出纸外
      const r = 88;
      const Pl = tb(pl, f.title, 68), Ex = ex ? tb(ex, f.body, 28) : null;
      const padL = 52, padR = r * 2 + 40;
      const sw = Math.max(Pl.w, Ex ? Ex.w : 0) + padL + padR, sh = Math.max(Pl.h + (Ex ? Ex.h + 12 : 0) + 56, r * 2 + 30);
      const pcx = sw - r - 22, w = pcx + r + 150, h = sh;
      const top = pl.replace(/\s+/g, ' ');
      return {
        w: w, h: h, bleed: { l: 26, t: 34, r: 30, b: 34 }, sealAt: null,
        draw(ctx) {
          const R = rng(T.seed);
          ctx.save(); rotAbout(ctx, sw / 2, sh / 2, -0.02);
          if (!T.bare) { paper(ctx, T, 0, 0, sw, sh, R); tape(ctx, 70, 2, 120, 38, -0.2, c.tape); }
          const ty0 = (sh - (Pl.h + (Ex ? Ex.h + 12 : 0))) / 2;
          Pl.draw(ctx, padL, ty0, S(T, c.ink));
          if (Ex) Ex.draw(ctx, padL + 2, ty0 + Pl.h + 12, P(T, c.sub));
          ctx.restore();
          ctx.save(); if (T.bare) softShadow(ctx, 'rgba(0,0,0,.35)', 10, 2);
          postmark(ctx, pcx, h / 2, r, top, dt || ' ', T.brand.seal + ' · 源头行', c.acc2, R);
          ctx.restore();
          ctx.save(); ctx.translate(pcx, h / 2); ctx.rotate(-0.16); ctx.globalAlpha = 0.85;
          for (let i = -1; i <= 1; i++) wavy(ctx, r * 1.02, i * r * 0.32, 120, 6, 26, c.acc2, 3.4);
          ctx.restore();
        }
      };
    }
  };

  /* ---------- 组装 ---------- */
  function makeTheme(spec, brand) {
    const ty = TYPES[spec.type] || TYPES.zhi;
    const sk = ty.schemes[spec.scheme] ? spec.scheme : Object.keys(ty.schemes)[0];
    const sc = ty.schemes[sk];
    const c = Object.assign({}, sc);
    if (spec.alt) { c.hl = sc.hl2; c.hlInk = sc.hlInk2; }
    return {
      id: ty.id, ty: ty, f: ty.fonts, c: c, sk: sk, bare: !sc.panel, fx: sc.fx || null, hlMode: ty.hl,
      brand: Object.assign({}, DEFAULT_BRAND, brand || {}), seed: hash(ty.id + '|' + spec.kind + '|' + sk)
    };
  }
  function layout(spec, brand) {
    const T = makeTheme(spec, brand);
    const fn = K[spec.kind] || K.emph;
    const data = Object.assign({}, (KINDS[spec.kind] || KINDS.emph).def, spec.data || {});
    const opts = spec.opts || {};
    const R = fn(T, data, opts);
    R.T = T; R.seal = null;
    const so = opts.seal || 'none';
    if (so !== 'none' && R.sealAt) {
      const txt = so === 'type' ? T.ty.seal : (T.brand.seal || '壹芳');
      const dm = sealDims(txt, R.sealAt.size);
      R.seal = { x: R.sealAt.x, y: R.sealAt.y, size: R.sealAt.size, rot: R.sealAt.rot || 0, text: txt, color: T.c.sealC };
      const hw = dm.w / 2 + 6, hh = dm.h / 2 + 6;
      R.bleed = {
        l: Math.max(R.bleed.l, hw - R.seal.x), t: Math.max(R.bleed.t, hh - R.seal.y),
        r: Math.max(R.bleed.r, R.seal.x + hw - R.w), b: Math.max(R.bleed.b, R.seal.y + hh - R.h)
      };
    }
    return R;
  }
  function paint(ctx, R) {
    ctx.save(); R.draw(ctx); ctx.restore();
    if (R.seal) drawSeal(ctx, R.seal.x, R.seal.y, R.seal.size, R.seal.text, R.seal.color, R.T.seed + 99, R.seal.rot);
  }
  function place(ctx, R, spec) {
    const s = spec.scale || 1, p = spec.pos || { x: 540, y: 960 };
    ctx.save(); ctx.translate(p.x, p.y); ctx.scale(s, s); ctx.translate(-R.w / 2, -R.h / 2); paint(ctx, R); ctx.restore();
  }
  function renderCrop(spec, brand, px) {
    const R = layout(spec, brand), k = (spec.scale || 1) * (px || 1), b = R.bleed;
    const cv = mk((R.w + b.l + b.r) * k, (R.h + b.t + b.b) * k), ctx = cv.getContext('2d');
    ctx.scale(k, k); ctx.translate(b.l, b.t); paint(ctx, R); return cv;
  }
  function renderFrame(spec, brand, px) {
    px = px || 1;
    const R = layout(spec, brand), cv = mk(1080 * px, 1920 * px), ctx = cv.getContext('2d');
    ctx.scale(px, px); place(ctx, R, spec); return cv;
  }

  function fontList(typeId) {
    const ty = TYPES[typeId] || TYPES.zhi, seen = {}, out = [];
    const add = f => { const k = f[0] + f[1]; if (!seen[k]) { seen[k] = 1; out.push(f); } };
    Object.keys(ty.fonts).forEach(k => add(ty.fonts[k]));
    [[900, FAM.serif], [500, FAM.sans], [700, FAM.sans], [900, FAM.sans], [700, FAM.corm], [600, FAM.corm]].forEach(add);
    return out;
  }
  function fontsReady(typeId, text, brand) {
    if (!document.fonts || !document.fonts.load) return Promise.resolve();
    const b = Object.assign({}, DEFAULT_BRAND, brand || {});
    const t = String(text || '') + FIXED_TEXT + b.name + b.seal + (TYPES[typeId] ? TYPES[typeId].seal : '') + '0123456789';
    return Promise.all(fontList(typeId).map(f => document.fonts.load(f[0] + ' 48px ' + f[1], t).catch(() => null)));
  }

  G.YF = {
    TYPES: TYPES, TYPE_ORDER: TYPE_ORDER, KINDS: KINDS, KIND_ORDER: KIND_ORDER, DEFAULT_BRAND: DEFAULT_BRAND, FAM: FAM,
    layout: layout, paint: paint, place: place, renderCrop: renderCrop, renderFrame: renderFrame,
    fontsReady: fontsReady, drawSeal: drawSeal, sealDims: sealDims, FONT: FONT, mk: mk
  };
})(window);
