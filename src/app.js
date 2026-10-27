/* 壹芳贴图工坊 · 界面逻辑 */
(function () {
  'use strict';
  const YF = window.YF;
  const $ = s => document.querySelector(s);
  const STORE = 'yifang-tietu-v1';
  // 抖音界面遮挡区（1080×1920 参考值，以手机实际预览为准）
  const SAFE = { top: 170, bottom: 1420, left: 48, right: 930, iconsTop: 760, iconsBottom: 1480 };
  const HL_NAMES = { zhi: ['金线', '朱砂'], hui: ['黄底', '白底'], shang: ['鎏金', '朱砂'], xing: ['翡翠', '蜜蜡'] };
  const DEFAULT_ANCHOR = { emph: [1, 2], word: [1, 0], chapter: [1, 0], quote: [1, 1], callout: [1, 1], spec: [0, 2], price: [2, 2], vs: [1, 1], name: [0, 2], place: [0, 0] };
  const VERT_DEFAULT = { 'shang|chapter': true, 'shang|quote': true };
  const MAIN_FIELD = { emph: 'text', word: 'word', chapter: 'title', quote: 'text', callout: 'text', spec: 'name', price: 'price', vs: 'a', name: 'name', place: 'place' };
  const BG_OPTS = [['dark', '深色画面'], ['light', '浅色画面'], ['grid', '透明格'], ['photo', '我的截图']];
  const LOCK_SVG = '<svg viewBox="0 0 12 12" aria-hidden="true"><rect x="2" y="5.2" width="8" height="5.8" rx="1.2" fill="currentColor"/><path d="M3.8 5.4V4a2.2 2.2 0 0 1 4.4 0v1.4" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>';

  const today = () => { const d = new Date(); return d.getFullYear() + '.' + String(d.getMonth() + 1).padStart(2, '0') + '.' + String(d.getDate()).padStart(2, '0'); };
  const clone = o => JSON.parse(JSON.stringify(o));
  const uid = () => Math.random().toString(36).slice(2, 9);

  /* ---------- 状态 ---------- */
  function fresh() {
    const data = {};
    YF.KIND_ORDER.forEach(k => { data[k] = Object.assign({}, YF.KINDS[k].def); });
    data.place.date = today();
    const schemes = {};
    YF.TYPE_ORDER.forEach(t => { schemes[t] = Object.keys(YF.TYPES[t].schemes)[0]; });
    return {
      v: 1, brand: Object.assign({}, YF.DEFAULT_BRAND), names: {}, type: 'zhi', kind: 'emph', schemes: schemes, alt: false,
      data: data, vert: {}, align: {}, seal: 'brand', scale: {}, pos: {}, anchor: {},
      exMode: 'crop', exPx: 1, bg: 'dark', safe: true, tray: []
    };
  }
  function load() {
    try {
      const raw = localStorage.getItem(STORE);
      if (!raw) return null;
      const s = JSON.parse(raw), f = fresh();
      if (!s || s.v !== 1) return null;
      const out = Object.assign(f, s);
      YF.KIND_ORDER.forEach(k => { out.data[k] = Object.assign({}, YF.KINDS[k].def, (s.data || {})[k] || {}); });
      YF.TYPE_ORDER.forEach(t => { if (!YF.TYPES[t].schemes[out.schemes[t]]) out.schemes[t] = Object.keys(YF.TYPES[t].schemes)[0]; });
      if (!YF.TYPES[out.type]) out.type = 'zhi';
      if (!YF.KINDS[out.kind]) out.kind = 'emph';
      out.tray = Array.isArray(s.tray) ? s.tray.filter(it => it && YF.TYPES[it.type] && YF.KINDS[it.kind]) : [];
      return out;
    } catch (e) { return null; }
  }
  let S = load() || fresh();
  let editing = null; // 正在修改的素材包条目 id
  let saveTimer = 0;
  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try { localStorage.setItem(STORE, JSON.stringify(S)); } catch (e) { /* 存不了就算了，不影响使用 */ }
    }, 250);
  }

  const typeName = t => (S.names[t] || YF.TYPES[t].name);

  function optsFor(t, k) {
    const key = t + '|' + k, vOk = (YF.KINDS[k].vertical || []).indexOf(t) >= 0;
    const vertical = vOk ? (S.vert[key] != null ? !!S.vert[key] : !!VERT_DEFAULT[key]) : false;
    return { vertical: vertical, align: S.align[k] || 'left', seal: S.seal };
  }
  function specFor(t, k) {
    return { type: t, kind: k, scheme: S.schemes[t], alt: S.alt, data: Object.assign({}, S.data[k]), opts: optsFor(t, k), scale: S.scale[k] || 1, pos: S.pos[k] || null };
  }
  function anchorPos(a, R, s) {
    const w = R.w * s, h = R.h * s;
    let x = [SAFE.left + w / 2, 540, SAFE.right - w / 2][a[0]];
    let y = [SAFE.top + h / 2 + 30, (SAFE.top + SAFE.bottom) / 2, SAFE.bottom - h / 2 - 24][a[1]];
    if (w >= SAFE.right - SAFE.left) x = 540;
    x = Math.min(Math.max(x, w / 2), 1080 - w / 2);
    y = Math.min(Math.max(y, h / 2), 1920 - h / 2);
    return { x: Math.round(x), y: Math.round(y) };
  }
  // 带上算好的位置
  function resolved(sp) {
    const R = YF.layout(sp, S.brand);
    if (!sp.pos) sp.pos = anchorPos(S.anchor[sp.kind] || DEFAULT_ANCHOR[sp.kind], R, sp.scale);
    return { sp: sp, R: R };
  }
  const curSpec = () => specFor(S.type, S.kind);
  const textOf = data => Object.keys(data || {}).map(k => data[k]).join('');

  /* ---------- 字体就绪 ---------- */
  function ready(type, text) {
    return Promise.race([YF.fontsReady(type, text, S.brand), new Promise(r => setTimeout(r, 4000))]);
  }

  /* ---------- 预览台 ---------- */
  const cv = $('#stage');
  let last = null, hover = false, drag = null, bgImg = null, rq = 0;

  function drawStage() {
    const rect = cv.getBoundingClientRect();
    if (!rect.width) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const W = Math.round(rect.width * dpr), H = Math.round(rect.height * dpr);
    if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; }
    const ctx = cv.getContext('2d'), k = W / 1080;
    ctx.setTransform(k, 0, 0, k, 0, 0);
    ctx.clearRect(0, 0, 1080, 1920);
    drawBg(ctx);
    const r = resolved(curSpec());
    YF.place(ctx, r.R, r.sp);
    last = r;
    if (S.safe) drawSafe(ctx);
    if (hover || drag) {
      const b = boxOf(r);
      ctx.save(); ctx.setLineDash([14, 10]); ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(255,255,255,.85)';
      ctx.strokeRect(b.x1 - 10, b.y1 - 10, b.x2 - b.x1 + 20, b.y2 - b.y1 + 20); ctx.restore();
    }
  }
  function boxOf(r) {
    const s = r.sp.scale, w = r.R.w * s, h = r.R.h * s;
    return { x1: r.sp.pos.x - w / 2, y1: r.sp.pos.y - h / 2, x2: r.sp.pos.x + w / 2, y2: r.sp.pos.y + h / 2 };
  }
  function drawBg(ctx) {
    if (S.bg === 'grid') {
      ctx.fillStyle = '#C9CCC4'; ctx.fillRect(0, 0, 1080, 1920);
      ctx.fillStyle = '#E9EBE4';
      for (let y = 0; y < 1920; y += 60) for (let x = (y / 60) % 2 ? 60 : 0; x < 1080; x += 120) ctx.fillRect(x, y, 60, 60);
      return;
    }
    if (S.bg === 'photo' && bgImg) {
      const s = Math.max(1080 / bgImg.width, 1920 / bgImg.height), w = bgImg.width * s, h = bgImg.height * s;
      ctx.drawImage(bgImg, (1080 - w) / 2, (1920 - h) / 2, w, h); return;
    }
    scene(ctx, S.bg === 'light');
  }
  // 示意画面：丝绒托盘上的一只玉镯
  function scene(ctx, light) {
    const g = ctx.createRadialGradient(540, 820, 60, 540, 980, 1350);
    if (light) { g.addColorStop(0, '#F4F0E7'); g.addColorStop(0.55, '#DCD5C6'); g.addColorStop(1, '#B3AA98'); }
    else { g.addColorStop(0, '#3C443E'); g.addColorStop(0.5, '#1E2420'); g.addColorStop(1, '#0A0D0B'); }
    ctx.fillStyle = g; ctx.fillRect(0, 0, 1080, 1920);
    const cx = 540, cy = 900;
    const sg = ctx.createRadialGradient(cx + 20, cy + 300, 10, cx + 20, cy + 300, 420);
    sg.addColorStop(0, light ? 'rgba(60,50,30,.28)' : 'rgba(0,0,0,.55)'); sg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = sg; ctx.beginPath(); ctx.ellipse(cx + 20, cy + 300, 420, 120, 0, 0, Math.PI * 2); ctx.fill();
    const jg = ctx.createLinearGradient(cx - 330, cy - 330, cx + 330, cy + 330);
    jg.addColorStop(0, '#F1F4E6'); jg.addColorStop(0.3, '#CBD8B9'); jg.addColorStop(0.55, '#F5F7EC'); jg.addColorStop(0.8, '#B5C6A2'); jg.addColorStop(1, '#DCE5CC');
    ctx.fillStyle = jg; ctx.beginPath(); ctx.ellipse(cx, cy, 330, 330, 0, 0, Math.PI * 2); ctx.ellipse(cx, cy, 250, 250, 0, 0, Math.PI * 2, true); ctx.fill('evenodd');
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.lineWidth = 12; ctx.beginPath(); ctx.arc(cx, cy, 302, Math.PI * 1.08, Math.PI * 1.42); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(cx, cy, 268, Math.PI * 1.62, Math.PI * 1.8); ctx.stroke();
    ctx.strokeStyle = 'rgba(70,95,60,.22)'; ctx.lineWidth = 18; ctx.beginPath(); ctx.arc(cx, cy, 262, Math.PI * 0.08, Math.PI * 0.7); ctx.stroke();
  }
  function drawSafe(ctx) {
    ctx.save();
    ctx.fillStyle = 'rgba(8,10,9,.5)';
    ctx.fillRect(0, 0, 1080, SAFE.top);
    ctx.fillRect(0, SAFE.bottom, 1080, 1920 - SAFE.bottom);
    ctx.fillRect(SAFE.right, SAFE.iconsTop, 1080 - SAFE.right, SAFE.bottom - SAFE.iconsTop);
    ctx.fillStyle = 'rgba(255,255,255,.42)';
    const ix = (SAFE.right + 1080) / 2;
    [[820, 44], [970, 36], [1100, 36], [1230, 36], [1350, 36]].forEach(p => { ctx.beginPath(); ctx.arc(ix, p[0], p[1], 0, Math.PI * 2); ctx.fill(); });
    ctx.fillRect(48, SAFE.bottom + 150, 300, 22); ctx.fillRect(48, SAFE.bottom + 196, 560, 22);
    ctx.fillRect(48, SAFE.bottom + 250, 420, 80);
    ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.font = '600 30px ' + getComputedStyle(document.body).fontFamily;
    ctx.textBaseline = 'middle';
    ctx.fillText('抖音顶部导航', 48, SAFE.top / 2 + 10);
    ctx.fillText('标题文案 · 小黄车', 48, SAFE.bottom + 70);
    ctx.setLineDash([16, 12]); ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.lineWidth = 3;
    ctx.strokeRect(SAFE.left, SAFE.top, SAFE.right - SAFE.left, SAFE.bottom - SAFE.top);
    ctx.restore();
  }

  function refresh(o) {
    o = o || {};
    const id = ++rq, sp = curSpec();
    const allText = o.thumbs ? YF.KIND_ORDER.map(k => textOf(S.data[k])).join('') : textOf(sp.data);
    const loading = $('#stageLoading');
    const t = setTimeout(() => { if (id === rq) loading.hidden = false; }, 250);
    ready(sp.type, allText).then(() => {
      clearTimeout(t); loading.hidden = true;
      if (id !== rq) return;
      drawStage();
      if (o.thumbs) drawThumbs();
      if (o.style) buildStyle();
    });
    save();
  }

  /* ---------- 拖动与键盘 ---------- */
  function toFrame(e) { const r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) / r.width * 1080, y: (e.clientY - r.top) / r.height * 1920 }; }
  function inside(p) { if (!last) return false; const b = boxOf(last); return p.x >= b.x1 - 12 && p.x <= b.x2 + 12 && p.y >= b.y1 - 12 && p.y <= b.y2 + 12; }
  function setPos(x, y) {
    if (Math.abs(x - 540) < 16) x = 540;
    S.pos[S.kind] = { x: Math.round(Math.min(Math.max(x, 0), 1080)), y: Math.round(Math.min(Math.max(y, 0), 1920)) };
    delete S.anchor[S.kind];
    markAnchor(); drawStage(); save();
  }
  cv.addEventListener('pointerdown', e => {
    const p = toFrame(e);
    if (!inside(p)) return;
    drag = { dx: p.x - last.sp.pos.x, dy: p.y - last.sp.pos.y };
    cv.setPointerCapture(e.pointerId); cv.style.cursor = 'grabbing'; e.preventDefault();
  });
  cv.addEventListener('pointermove', e => {
    const p = toFrame(e);
    if (drag) { setPos(p.x - drag.dx, p.y - drag.dy); return; }
    const h = inside(p);
    if (h !== hover) { hover = h; cv.style.cursor = h ? 'grab' : 'default'; drawStage(); }
  });
  const endDrag = () => { if (drag) { drag = null; cv.style.cursor = hover ? 'grab' : 'default'; drawStage(); } };
  cv.addEventListener('pointerup', endDrag);
  cv.addEventListener('pointercancel', endDrag);
  cv.addEventListener('pointerleave', () => { if (!drag && hover) { hover = false; drawStage(); } });
  cv.addEventListener('touchstart', e => { const t = e.touches[0]; if (t && inside(toFrame(t))) e.preventDefault(); }, { passive: false });
  cv.addEventListener('keydown', e => {
    const step = e.shiftKey ? 40 : 10, d = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key];
    if (!d || !last) return;
    e.preventDefault(); setPos(last.sp.pos.x + d[0], last.sp.pos.y + d[1]);
  });

  /* ---------- 通用小控件 ---------- */
  function seg(box, items, value, onPick) {
    box.innerHTML = '';
    items.forEach(it => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-pressed', String(it.v === value));
      if (it.sw) { const i = document.createElement('i'); i.className = 'sw' + (it.sw === 'bare' ? ' bare' : ''); if (it.sw !== 'bare') i.style.background = it.sw; b.appendChild(i); }
      b.appendChild(document.createTextNode(it.label));
      if (it.title) b.title = it.title;
      b.addEventListener('click', () => {
        box.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', 'false'));
        b.setAttribute('aria-pressed', 'true'); onPick(it.v);
      });
      box.appendChild(b);
    });
  }
  function row(parent, label, el) {
    const r = document.createElement('div'); r.className = 'srow';
    const l = document.createElement('span'); l.className = 'lbl'; l.textContent = label;
    r.appendChild(l); r.appendChild(el); parent.appendChild(r); return r;
  }
  const segBox = label => { const d = document.createElement('div'); d.className = 'seg'; d.setAttribute('role', 'group'); d.setAttribute('aria-label', label); return d; };
  let toastTimer = 0;
  function toast(msg) {
    const t = $('#toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
  }

  /* ---------- ① 类型 ---------- */
  function buildTypes() {
    const box = $('#typeList'); box.innerHTML = '';
    YF.TYPE_ORDER.forEach(t => {
      const ty = YF.TYPES[t], on = t === S.type;
      const card = document.createElement('div'); card.className = 'tcard' + (on ? ' on' : '');
      const pick = document.createElement('button'); pick.type = 'button'; pick.className = 'tpick';
      pick.setAttribute('role', 'radio'); pick.setAttribute('aria-checked', String(on));
      const dots = Object.keys(ty.schemes).map(k => { const sc = ty.schemes[k]; return sc.panel ? '<i style="background:' + sc.panel + '"></i>' : '<i class="sw bare"></i>'; }).join('');
      pick.innerHTML = '<span class="tseal" style="background:' + ty.ui.card + ';color:' + ty.ui.cardInk + '">' + ty.seal + '</span>' +
        '<span class="tinfo"><span class="tname"></span><span class="ttheme">' + ty.theme + '<span class="tdots">' + dots + '</span></span><span class="tuse">' + ty.use + '</span></span>';
      pick.querySelector('.tname').textContent = typeName(t);
      pick.addEventListener('click', () => selectType(t));
      card.appendChild(pick);
      if (on) {
        const more = document.createElement('div'); more.className = 'tmore';
        more.innerHTML = '<span class="tlock">' + LOCK_SVG + '已锁定</span><span>' + ty.fontNote + '</span>';
        const rn = document.createElement('button'); rn.type = 'button'; rn.className = 'ghost small trename'; rn.textContent = '改名';
        rn.addEventListener('click', () => renameType(t, card));
        more.appendChild(rn); card.appendChild(more);
      }
      box.appendChild(card);
    });
  }
  function renameType(t, card) {
    const nameEl = card.querySelector('.tname');
    const inp = document.createElement('input'); inp.type = 'text'; inp.className = 'tnameinput'; inp.maxLength = 8; inp.value = typeName(t);
    inp.setAttribute('aria-label', '类型名称');
    nameEl.replaceWith(inp); inp.focus(); inp.select();
    let done = false;
    const finish = ok => {
      if (done) return; done = true;
      const v = inp.value.trim();
      if (ok) { if (v && v !== YF.TYPES[t].name) S.names[t] = v; else delete S.names[t]; }
      save(); buildTypes(); buildLock(); renderTray();
    };
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') finish(true); if (e.key === 'Escape') finish(false); });
    inp.addEventListener('blur', () => finish(true));
    inp.addEventListener('click', e => e.stopPropagation());
  }
  function selectType(t) {
    if (t === S.type) return;
    S.type = t; applyAccent(); buildTypes(); buildLock(); buildStyle(); refresh({ thumbs: true, style: true });
  }
  function applyAccent() {
    const ui = YF.TYPES[S.type].ui, root = document.documentElement.style;
    root.setProperty('--acc-l', ui.l); root.setProperty('--acc-d', ui.d);
  }
  function buildLock() {
    const ty = YF.TYPES[S.type], sc = ty.schemes[S.schemes[S.type]];
    $('#lockBar').innerHTML = '<span class="lseal" style="background:' + ty.ui.card + ';color:' + ty.ui.cardInk + '">' + ty.seal + '</span>' +
      '<div><b></b><span>' + ty.theme + ' · ' + sc.name + ' · 强调用「' + ty.hlName + '」</span></div>';
    $('#lockBar b').textContent = '已锁定：' + typeName(S.type);
  }

  /* ---------- ② 贴图种类 ---------- */
  function buildKinds() {
    const g = $('#kindGrid'); g.innerHTML = '';
    YF.KIND_ORDER.forEach(k => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'kcard'; b.dataset.kind = k;
      b.setAttribute('aria-pressed', String(k === S.kind));
      b.innerHTML = '<canvas aria-hidden="true"></canvas><span>' + YF.KINDS[k].name + '</span>';
      b.addEventListener('click', () => selectKind(k));
      g.appendChild(b);
    });
  }
  function selectKind(k) {
    if (k === S.kind) return;
    S.kind = k; closeBatch();
    document.querySelectorAll('.kcard').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.kind === k)));
    buildFields(); buildStyle(); markAnchor(); refresh();
  }
  function drawFit(c, sp, pad) {
    const R = YF.layout(sp, S.brand), b = R.bleed, W = R.w + b.l + b.r, H = R.h + b.t + b.b;
    const dpr = Math.min(2, window.devicePixelRatio || 1), cw = c.clientWidth || 100, ch = c.clientHeight || 60;
    c.width = Math.round(cw * dpr); c.height = Math.round(ch * dpr);
    const ctx = c.getContext('2d'), k = Math.min((cw - pad * 2) / W, (ch - pad * 2) / H);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, cw, ch);
    ctx.translate((cw - W * k) / 2, (ch - H * k) / 2); ctx.scale(k, k); ctx.translate(b.l, b.t);
    YF.paint(ctx, R);
  }
  function drawThumbs() {
    document.querySelectorAll('.kcard').forEach(b => { const sp = specFor(S.type, b.dataset.kind); sp.scale = 1; drawFit(b.querySelector('canvas'), sp, 4); });
  }

  /* ---------- ③ 文字 ---------- */
  function buildFields() {
    const k = S.kind, meta = YF.KINDS[k], box = $('#fields'); box.innerHTML = '';
    meta.fields.forEach(fd => {
      const id = 'f_' + k + '_' + fd.k;
      const wrap = document.createElement('div'); wrap.className = 'field' + (fd.narrow ? ' narrow' : '');
      if (fd.type === 'seg') {
        const l = document.createElement('span'); l.className = 'lbl'; l.textContent = fd.label; wrap.appendChild(l);
        const sb = segBox(fd.label);
        seg(sb, fd.opts.map(v => ({ v: v, label: v })), S.data[k][fd.k], v => { S.data[k][fd.k] = v; refresh(); });
        wrap.appendChild(sb); box.appendChild(wrap); return;
      }
      const top = document.createElement('div'); top.className = 'fieldtop';
      const l = document.createElement('label'); l.htmlFor = id; l.textContent = fd.label; top.appendChild(l);
      const inp = document.createElement(fd.type === 'area' ? 'textarea' : 'input');
      inp.id = id; if (fd.type === 'area') inp.rows = fd.rows || 2; else inp.type = 'text';
      inp.value = S.data[k][fd.k] || ''; if (fd.ph) inp.placeholder = fd.ph;
      inp.autocomplete = 'off'; inp.spellcheck = false;
      inp.addEventListener('input', () => { S.data[k][fd.k] = inp.value; refresh(); });
      if (fd.k === MAIN_FIELD[k] && ['emph', 'quote', 'chapter', 'word'].indexOf(k) >= 0 || fd.k === 'sub' && k === 'chapter') {
        const m = document.createElement('button'); m.type = 'button'; m.className = 'mark'; m.textContent = '【】标为强调';
        m.title = '先在框里选中要强调的字，再点这里';
        m.addEventListener('click', () => {
          const a = inp.selectionStart || 0, z = inp.selectionEnd || 0, v = inp.value;
          inp.value = z > a ? v.slice(0, a) + '【' + v.slice(a, z) + '】' + v.slice(z) : v.slice(0, a) + '【】' + v.slice(a);
          inp.focus(); const c = z > a ? z + 2 : a + 1; inp.setSelectionRange(c, c);
          S.data[k][fd.k] = inp.value; refresh();
        });
        top.appendChild(m);
      }
      wrap.appendChild(top); wrap.appendChild(inp);
      if (fd.hint) { const h = document.createElement('p'); h.className = 'hint'; h.textContent = fd.hint; wrap.appendChild(h); }
      box.appendChild(wrap);
    });
    const bt = $('#batchToggle'); bt.hidden = !meta.batch;
  }

  /* ---------- 批量 ---------- */
  function openBatch() {
    const meta = YF.KINDS[S.kind]; if (!meta.batch) return;
    $('#batch').hidden = false; $('#batchToggle').setAttribute('aria-expanded', 'true');
    $('#batchHint').textContent = meta.batch.hint; $('#batchText').placeholder = meta.batch.example; $('#batchText').focus();
  }
  function closeBatch() { $('#batch').hidden = true; $('#batchToggle').setAttribute('aria-expanded', 'false'); }
  function parseBatch(k, line, i) {
    const parts = line.split(/[|｜]/).map(s => s.trim());
    if (k === 'emph') return { text: line.replace(/\s*\/\s*/g, '\n') };
    if (k === 'word') return { word: parts[0], pinyin: parts[1] || '', note: parts[2] || '' };
    if (k === 'chapter') { const st = parseInt(S.data.chapter.no, 10), n = isNaN(st) ? i + 1 : st + i; return { no: String(n).padStart(2, '0'), title: parts[0], sub: parts[1] || '' }; }
    if (k === 'callout') return { text: parts[0], sub: parts[1] != null ? parts[1] : S.data.callout.sub };
    return {};
  }
  $('#batchToggle').addEventListener('click', () => ($('#batch').hidden ? openBatch() : closeBatch()));
  $('#batchClose').addEventListener('click', closeBatch);
  $('#batchGo').addEventListener('click', () => {
    const k = S.kind, lines = $('#batchText').value.split('\n').map(s => s.trim()).filter(Boolean);
    if (!lines.length) { toast('先在框里写几行，每行一张'); $('#batchText').focus(); return; }
    lines.forEach((ln, i) => {
      const sp = curSpec(); sp.data = Object.assign({}, S.data[k], parseBatch(k, ln, i));
      const r = resolved(sp); S.tray.push(Object.assign({ id: uid() }, clone(r.sp)));
    });
    $('#batchText').value = ''; closeBatch(); renderTray(); save();
    toast('已生成 ' + lines.length + ' 张，加到素材包里了');
  });

  /* ---------- ④ 样式 ---------- */
  function buildStyle() {
    const t = S.type, k = S.kind, ty = YF.TYPES[t], meta = YF.KINDS[k], box = $('#styleCtl'); box.innerHTML = '';
    const sc = ty.schemes[S.schemes[t]];
    let b = segBox('配色');
    seg(b, Object.keys(ty.schemes).map(key => ({ v: key, label: ty.schemes[key].name, sw: ty.schemes[key].panel || 'bare' })), S.schemes[t], v => { S.schemes[t] = v; buildLock(); buildStyle(); refresh({ thumbs: true }); });
    row(box, '配色', b);
    b = segBox('强调色');
    seg(b, [{ v: false, label: HL_NAMES[t][0], sw: solid(sc.hl) }, { v: true, label: HL_NAMES[t][1], sw: solid(sc.hl2) }], S.alt, v => { S.alt = v; refresh({ thumbs: true }); });
    row(box, '强调色', b);
    const rg = document.createElement('div'); rg.className = 'range';
    rg.innerHTML = '<input type="range" id="sizeRange" min="50" max="160" step="5" aria-label="大小"><output id="sizeOut" for="sizeRange"></output>';
    const inp = rg.querySelector('input'), out = rg.querySelector('output');
    inp.value = Math.round((S.scale[k] || 1) * 100); out.textContent = inp.value + '%';
    inp.addEventListener('input', () => { S.scale[k] = inp.value / 100; out.textContent = inp.value + '%'; refresh(); });
    row(box, '大小', rg);
    if (meta.align) {
      b = segBox('对齐');
      seg(b, [{ v: 'left', label: '左对齐' }, { v: 'center', label: '居中' }], S.align[k] || 'left', v => { S.align[k] = v; refresh({ thumbs: true }); });
      row(box, '对齐', b);
    }
    if ((meta.vertical || []).indexOf(t) >= 0) {
      b = segBox('排版');
      seg(b, [{ v: false, label: '横排' }, { v: true, label: '竖排' }], optsFor(t, k).vertical, v => { S.vert[t + '|' + k] = v; delete S.pos[k]; markAnchor(); refresh({ thumbs: true, style: true }); });
      row(box, '排版', b);
    }
    const R = YF.layout(curSpec(), S.brand);
    if (R.sealAt) {
      b = segBox('印章');
      seg(b, [{ v: 'none', label: '不加' }, { v: 'brand', label: '品牌章' }, { v: 'type', label: '类型章「' + ty.seal + '」' }], S.seal, v => { S.seal = v; refresh({ thumbs: true }); });
      row(box, '印章', b);
    }
  }
  function solid(c) { return c && c.indexOf('rgba') === 0 ? c.replace(/,\s*[\d.]+\)$/, ',1)') : c; }

  /* ---------- 摆放 ---------- */
  function buildPos() {
    const g = $('#posGrid'), names = [['左上', '上方', '右上'], ['左侧', '正中', '右侧'], ['左下', '下方', '右下']];
    g.innerHTML = '';
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
      const b = document.createElement('button'); b.type = 'button'; b.dataset.a = c + ',' + r; b.setAttribute('aria-label', names[r][c]); b.title = names[r][c];
      b.addEventListener('click', () => { S.anchor[S.kind] = [c, r]; delete S.pos[S.kind]; markAnchor(); drawStage(); save(); });
      g.appendChild(b);
    }
  }
  function markAnchor() {
    const a = S.pos[S.kind] ? null : (S.anchor[S.kind] || DEFAULT_ANCHOR[S.kind]);
    document.querySelectorAll('#posGrid button').forEach(b => b.setAttribute('aria-pressed', String(!!a && b.dataset.a === a[0] + ',' + a[1])));
  }

  /* ---------- 导出 ---------- */
  function buildExport() {
    seg($('#modeSeg'), [{ v: 'crop', label: '裁切贴图' }, { v: 'frame', label: '整屏定位' }], S.exMode, v => { S.exMode = v; modeHint(); save(); });
    seg($('#pxSeg'), [{ v: 1, label: '1080P' }, { v: 2, label: '4K（2 倍）' }], S.exPx, v => { S.exPx = v; save(); });
    modeHint();
  }
  function modeHint() {
    $('#modeHint').textContent = S.exMode === 'frame'
      ? '1080×1920 透明整屏图，拖进剪映就在预览里的位置，不用再挪。'
      : '只包含贴图本身，透明底，在剪映里自由摆放，做缩放动画更自然。';
    $('#zipNote').textContent = '按「' + (S.exMode === 'frame' ? '整屏定位' : '裁切贴图') + ' · ' + (S.exPx === 2 ? '4K' : '1080P') + '」导出';
  }
  const toBlob = c => new Promise((res, rej) => c.toBlob(b => (b ? res(b) : rej(new Error('blob'))), 'image/png'));
  function safeName(s) { return String(s || '').replace(/[【】\r\n\t]/g, '').replace(/[\\/:*?"<>|]/g, '').replace(/\s+/g, '').slice(0, 14) || '贴图'; }
  function mainText(it) {
    const d = it.data || {};
    if (it.kind === 'vs') return (d.a || '') + '对' + (d.b || '');
    if (it.kind === 'price') return '¥' + (d.price || '');
    return d[MAIN_FIELD[it.kind]] || '';
  }
  function fileName(it, i) {
    return (i != null ? String(i + 1).padStart(2, '0') + '_' : '') + safeName(typeName(it.type)) + '_' + YF.KINDS[it.kind].name + '_' + safeName(mainText(it)) + '.png';
  }
  function render(it) { return S.exMode === 'frame' ? YF.renderFrame(it, S.brand, S.exPx) : YF.renderCrop(it, S.brand, S.exPx); }
  async function saveFile(blob, name) {
    const host = window.claude;
    if (host && typeof host.use === 'function') {
      let dl = null;
      try { dl = await host.use('downloads'); } catch (e) { dl = null; }
      if (dl) {
        try { await dl.save({ filename: name, data: blob }); toast('已保存：' + name); }
        catch (e) { toast(e && e.code === 'declined' ? '已取消保存' : '这里没法直接保存，换浏览器打开网站版试试'); }
        return;
      }
    }
    const url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = name; document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 8000);
    toast('已开始下载：' + name);
  }
  async function busy(btn, label, fn) {
    const old = btn.textContent; btn.disabled = true; btn.textContent = label;
    try { await fn(t => { btn.textContent = t; }); }
    catch (e) { console.error(e); toast('导出出错了：' + (e && e.message ? e.message : '请重试')); }
    finally { btn.disabled = false; btn.textContent = old; updateTrayButtons(); }
  }
  $('#dlBtn').addEventListener('click', () => busy($('#dlBtn'), '正在生成…', async () => {
    const r = resolved(curSpec());
    await ready(r.sp.type, textOf(r.sp.data));
    await saveFile(await toBlob(render(r.sp)), fileName(r.sp, null));
  }));
  $('#zipBtn').addEventListener('click', () => busy($('#zipBtn'), '准备中…', async set => {
    if (!S.tray.length) return;
    if (typeof window.JSZip !== 'function') { toast('打包组件没加载出来，刷新页面再试'); return; }
    const types = Array.from(new Set(S.tray.map(it => it.type)));
    await Promise.all(types.map(t => ready(t, S.tray.filter(it => it.type === t).map(it => textOf(it.data)).join(''))));
    const d = new Date(), stamp = String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0') + '-' + String(d.getHours()).padStart(2, '0') + String(d.getMinutes()).padStart(2, '0');
    const folder = safeName(S.brand.name) + '贴图_' + stamp, zip = new window.JSZip(), dir = zip.folder(folder);
    for (let i = 0; i < S.tray.length; i++) {
      set('生成 ' + (i + 1) + '/' + S.tray.length);
      dir.file(fileName(S.tray[i], i), await toBlob(render(S.tray[i])));
      await new Promise(r => setTimeout(r, 0));
    }
    set('打包中…');
    await saveFile(await zip.generateAsync({ type: 'blob', compression: 'STORE' }), folder + '.zip');
  }));

  /* ---------- 素材包 ---------- */
  function addOrSave(asNew) {
    const r = resolved(curSpec()), item = clone(r.sp);
    const idx = editing ? S.tray.findIndex(x => x.id === editing) : -1;
    if (idx >= 0 && !asNew) { item.id = editing; S.tray[idx] = item; toast('第 ' + (idx + 1) + ' 张已更新'); }
    else { item.id = uid(); S.tray.push(item); toast('已加入素材包，第 ' + S.tray.length + ' 张'); }
    editing = null; editBar(); renderTray(); save();
  }
  $('#addBtn').addEventListener('click', () => addOrSave(false));
  $('#saveAsNew').addEventListener('click', () => addOrSave(true));
  $('#cancelEdit').addEventListener('click', () => { editing = null; editBar(); renderTray(); });
  function editBar() {
    const idx = editing ? S.tray.findIndex(x => x.id === editing) : -1;
    if (idx < 0) editing = null;
    $('#editingBar').hidden = !editing;
    $('#addBtn').textContent = editing ? '保存修改' : '加入素材包';
    if (editing) $('#editingText').textContent = '正在修改第 ' + (idx + 1) + ' 张';
  }
  function loadItem(it) {
    S.type = it.type; S.kind = it.kind; S.schemes[it.type] = it.scheme; S.alt = !!it.alt;
    S.data[it.kind] = Object.assign({}, YF.KINDS[it.kind].def, it.data);
    const o = it.opts || {};
    if ((YF.KINDS[it.kind].vertical || []).indexOf(it.type) >= 0) S.vert[it.type + '|' + it.kind] = !!o.vertical;
    S.align[it.kind] = o.align || 'left'; S.seal = o.seal || S.seal; S.scale[it.kind] = it.scale || 1;
    S.pos[it.kind] = it.pos || null; delete S.anchor[it.kind];
    editing = it.id;
    applyAccent(); buildTypes(); buildLock();
    document.querySelectorAll('.kcard').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.kind === S.kind)));
    buildFields(); buildStyle(); markAnchor(); editBar(); renderTray(); refresh({ thumbs: true, style: true });
    if (window.innerWidth < 1240) document.querySelector('.stage').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function updateTrayButtons() {
    $('#zipBtn').disabled = !S.tray.length; $('#clearBtn').disabled = !S.tray.length;
  }
  let clearArm = 0;
  $('#clearBtn').addEventListener('click', () => {
    const b = $('#clearBtn');
    if (!clearArm) { b.textContent = '确认清空？'; b.classList.add('danger'); clearArm = setTimeout(() => { clearArm = 0; b.textContent = '清空'; b.classList.remove('danger'); }, 3500); return; }
    clearTimeout(clearArm); clearArm = 0; b.textContent = '清空'; b.classList.remove('danger');
    S.tray = []; editing = null; editBar(); renderTray(); save(); toast('素材包已清空');
  });
  function renderTray() {
    const ol = $('#trayList'); ol.innerHTML = '';
    S.tray.forEach((it, i) => {
      const li = document.createElement('li'); li.className = 'titem' + (it.id === editing ? ' editing-now' : '');
      const scName = (YF.TYPES[it.type].schemes[it.scheme] || {}).name || '';
      li.innerHTML = '<canvas class="tthumb" aria-hidden="true"></canvas><span class="tno">' + String(i + 1).padStart(2, '0') + '</span>' +
        '<div class="tmeta"><b></b><span class="ty"></span><span class="tx"></span></div>' +
        '<div class="tacts"><button type="button" class="mv" data-d="-1" aria-label="往前挪">←</button><button type="button" class="mv" data-d="1" aria-label="往后挪">→</button><button type="button" class="ed">修改</button><button type="button" class="del">删除</button></div>';
      li.querySelector('b').textContent = YF.KINDS[it.kind].name;
      li.querySelector('.ty').textContent = typeName(it.type) + ' · ' + scName;
      li.querySelector('.tx').textContent = mainText(it).replace(/[【】]/g, '').replace(/\n/g, ' ');
      const mv = li.querySelectorAll('.mv');
      mv[0].disabled = i === 0; mv[1].disabled = i === S.tray.length - 1;
      mv.forEach(b => b.addEventListener('click', () => { const j = i + Number(b.dataset.d); const x = S.tray[i]; S.tray[i] = S.tray[j]; S.tray[j] = x; renderTray(); editBar(); save(); }));
      li.querySelector('.ed').addEventListener('click', () => loadItem(it));
      li.querySelector('.del').addEventListener('click', () => { S.tray.splice(i, 1); if (editing === it.id) editing = null; editBar(); renderTray(); save(); });
      ol.appendChild(li);
    });
    $('#trayCount').textContent = S.tray.length ? S.tray.length + ' 张' : '';
    $('#trayEmpty').hidden = S.tray.length > 0;
    updateTrayButtons();
    const types = Array.from(new Set(S.tray.map(it => it.type)));
    Promise.all(types.map(t => ready(t, S.tray.filter(it => it.type === t).map(it => textOf(it.data)).join('')))).then(() => {
      const cvs = ol.querySelectorAll('.tthumb');
      S.tray.forEach((it, i) => { if (cvs[i]) { const sp = clone(it); sp.scale = 1; drawFit(cvs[i], sp, 5); } });
    });
  }

  /* ---------- 背景、安全区、帮助、品牌 ---------- */
  function buildBg() {
    seg($('#bgSeg'), BG_OPTS.map(o => ({ v: o[0], label: o[1] })), S.bg, v => {
      if (v === 'photo' && !bgImg) { $('#bgFile').click(); return; }
      S.bg = v; drawStage(); save();
    });
  }
  $('#bgFile').addEventListener('change', e => {
    const f = e.target.files && e.target.files[0]; if (!f) { buildBg(); return; }
    const img = new Image(), url = URL.createObjectURL(f);
    img.onload = () => { bgImg = img; S.bg = 'photo'; buildBg(); drawStage(); toast('已换成你的截图（只在本页预览，不会上传）'); };
    img.onerror = () => { toast('这张图打不开，换一张 JPG 或 PNG 试试'); buildBg(); };
    img.src = url; e.target.value = '';
  });
  $('#safeToggle').addEventListener('change', e => { S.safe = e.target.checked; drawStage(); save(); });
  function toggle(btn, panel) {
    const open = panel.hidden; panel.hidden = !open; btn.setAttribute('aria-expanded', String(open));
  }
  $('#helpBtn').addEventListener('click', () => toggle($('#helpBtn'), $('#help')));
  $('#brandBtn').addEventListener('click', () => toggle($('#brandBtn'), $('#brandPanel')));
  $('#brandName').addEventListener('input', e => { S.brand.name = e.target.value.trim() || YF.DEFAULT_BRAND.name; refresh({ thumbs: true }); renderTray(); });
  $('#brandSealText').addEventListener('input', e => { S.brand.seal = Array.from(e.target.value.trim()).slice(0, 4).join('') || YF.DEFAULT_BRAND.seal; drawBrandSeal(); refresh({ thumbs: true }); renderTray(); });
  function drawBrandSeal() {
    const c = $('#brandSeal'), d = YF.sealDims(S.brand.seal, 30), dpr = Math.min(2, window.devicePixelRatio || 1);
    c.style.width = (d.w + 4) + 'px'; c.style.height = (d.h + 4) + 'px';
    c.width = Math.round((d.w + 4) * dpr); c.height = Math.round((d.h + 4) * dpr);
    YF.fontsReady('zhi', S.brand.seal, S.brand).then(() => {
      const ctx = c.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, d.w + 4, d.h + 4);
      YF.drawSeal(ctx, (d.w + 4) / 2, (d.h + 4) / 2, 30, S.brand.seal, '#B3352B', 7, 0);
    });
  }

  /* ---------- 启动 ---------- */
  let resizeT = 0;
  window.addEventListener('resize', () => { clearTimeout(resizeT); resizeT = setTimeout(() => { drawStage(); drawThumbs(); renderTray(); }, 120); });
  function init() {
    $('#brandName').value = S.brand.name; $('#brandSealText').value = S.brand.seal; $('#safeToggle').checked = S.safe;
    if (S.bg === 'photo') S.bg = 'dark';
    applyAccent(); drawBrandSeal(); buildTypes(); buildLock(); buildKinds(); buildFields(); buildStyle(); buildPos(); markAnchor();
    buildBg(); buildExport(); renderTray(); editBar();
    refresh({ thumbs: true, style: true });
  }
  init();
})();
