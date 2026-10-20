// brand/*.svg → PNG (투명 배경). 사용법: node brand/render_png.mjs  (playwright 필요)
import { chromium } from 'playwright'
import { readFileSync, readdirSync } from 'node:fs'
const dir = new URL('.', import.meta.url).pathname
const b = await chromium.launch()
const p = await b.newPage()
for (const f of readdirSync(dir).filter((f) => f.endsWith('.svg'))) {
  const svg = readFileSync(dir + f, 'utf8'),
    [, w, h] = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/).map(Number)
  const scale = f.includes('mark') ? 1024 / w : 4 // 심볼은 1024px, 글자 포함은 4배
  await p.setViewportSize({ width: Math.round(w * scale), height: Math.round(h * scale) })
  await p.setContent(
    `<style>html,body{margin:0;background:transparent}svg{display:block;width:100vw;height:100vh}</style>${svg}`,
  )
  await p.screenshot({ path: dir + f.replace('.svg', '.png'), omitBackground: true })
}
await b.close()
