"""Render the sticker contact sheets and the app UI with a local headless Chromium."""
import subprocess, sys, time, os
from playwright.sync_api import sync_playwright

ROOT = '/home/claude/yifang'
OUT = sys.argv[1] if len(sys.argv) > 1 else '/tmp/shots'
WHAT = sys.argv[2] if len(sys.argv) > 2 else 'sheet,ui'
os.makedirs(OUT, exist_ok=True)
srv = subprocess.Popen([sys.executable, '-m', 'http.server', '8765', '--bind', '127.0.0.1'], cwd=ROOT,
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(1.2)
errors = []
try:
    with sync_playwright() as p:
        b = p.chromium.launch()
        if 'sheet' in WHAT:
            for t in ['zhi', 'hui', 'shang', 'xing']:
                pg = b.new_page(viewport={'width': 2140, 'height': 1200}, device_scale_factor=1)
                pg.on('pageerror', lambda e: errors.append('sheet: ' + str(e)))
                pg.goto(f'http://127.0.0.1:8765/test/sheet.html?type={t}')
                pg.wait_for_function('window.__done === true', timeout=90000)
                pg.wait_for_timeout(300)
                pg.locator(f'#sec-{t}').screenshot(path=f'{OUT}/sheet-{t}.png')
                pg.close()
        if 'ui' in WHAT:
            for name, vp, scheme in [('desk', {'width': 1440, 'height': 960}, 'light'), ('desk-dark', {'width': 1440, 'height': 960}, 'dark'), ('phone', {'width': 390, 'height': 844}, 'light')]:
                ctx = b.new_context(viewport=vp, device_scale_factor=2 if name == 'phone' else 1, color_scheme=scheme, accept_downloads=True)
                pg = ctx.new_page()
                pg.on('pageerror', lambda e: errors.append(name + ': ' + str(e)))
                pg.on('console', lambda m: errors.append(name + ' console: ' + m.text) if m.type == 'error' else None)
                pg.goto('http://127.0.0.1:8765/dist/site/index.html')
                pg.wait_for_timeout(3500)
                if name == 'desk':
                    # add two items, switch type, add one more
                    pg.click('#addBtn'); pg.wait_for_timeout(300)
                    pg.click('.kcard[data-kind="word"]'); pg.wait_for_timeout(600)
                    pg.click('#addBtn'); pg.wait_for_timeout(300)
                    pg.click('.tcard:nth-child(2) .tpick'); pg.wait_for_timeout(1500)
                    pg.click('.kcard[data-kind="price"]'); pg.wait_for_timeout(1200)
                    pg.click('#addBtn'); pg.wait_for_timeout(800)
                    # zip download works?
                    with pg.expect_download(timeout=60000) as dl:
                        pg.click('#zipBtn')
                    d = dl.value
                    d.save_as(f'{OUT}/{d.suggested_filename}')
                    errors.append('zip: ' + d.suggested_filename)
                    with pg.expect_download(timeout=60000) as dl2:
                        pg.click('#dlBtn')
                    d2 = dl2.value
                    d2.save_as(f'{OUT}/{d2.suggested_filename}')
                    errors.append('png: ' + d2.suggested_filename)
                    pg.wait_for_timeout(800)
                if name == 'desk-dark':
                    pg.click('.tcard:nth-child(3) .tpick'); pg.wait_for_timeout(1500)
                    pg.click('.kcard[data-kind="chapter"]'); pg.wait_for_timeout(1500)
                pg.screenshot(path=f'{OUT}/ui-{name}.png', full_page=True)
                ctx.close()
        b.close()
finally:
    srv.terminate()
print('\n'.join(errors) or 'no errors')
