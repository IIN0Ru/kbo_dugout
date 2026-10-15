// dist-artifact/의 app.css·app.js를 하나의 HTML 조각으로 합쳐 공유용 페이지를 만든다.
// 사용: npm run build:artifact
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'

// public/에 둔 글꼴(블랙한산스)은 빌드에 자동으로 들어가지 않으므로 직접 data URI로 넣는다
const blackHan = readFileSync('public/fonts/BlackHanSans-Regular.woff2').toString('base64')
const css = readFileSync('dist-artifact/app.css', 'utf8').replace(
  /url\(\s*['"]?[^)'"]*BlackHanSans-Regular\.woff2['"]?\s*\)/g,
  `url(data:font/woff2;base64,${blackHan})`,
)
const js = readFileSync('dist-artifact/app.js', 'utf8').replace(/<\/script/gi, '<\\/script')

const html = `<title>DUGOUT</title>
<meta name="claude:viewport-fit-sides" content="cover">
<style>${css}</style>
<div id="root"></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js"></script>
<script>
window.ReactJSXRuntime = (function (R) {
  function jsx(type, props, key) {
    var p = Object.assign({}, props);
    if (key !== undefined) p.key = key;
    return R.createElement(type, p);
  }
  return { jsx: jsx, jsxs: jsx, Fragment: R.Fragment };
})(window.React);
</script>
<script>${js}</script>
`

mkdirSync('artifact', { recursive: true })
writeFileSync('artifact/dugout.html', html)
console.log('artifact/dugout.html', (html.length / 1024).toFixed(1), 'KB')
