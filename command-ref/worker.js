export default {
  async fetch(request) {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>PxD Command Reference</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:#0a0a0a;color:#e0e0e0;font-family:'Segoe UI',sans-serif;padding:32px;max-width:860px;margin:0 auto;}
  h1{font-size:22px;color:#c9a84c;font-weight:700;margin-bottom:6px;letter-spacing:1px;}
  .subtitle{font-size:12px;color:#666;margin-bottom:32px;letter-spacing:2px;text-transform:uppercase;}
  h2{font-size:13px;color:#c9a84c;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:28px 0 14px 0;padding-bottom:8px;border-bottom:1px solid #222;}
  .step{background:#111;border:1px solid #222;border-radius:8px;padding:14px 16px;margin-bottom:10px;}
  .step-label{font-size:10px;color:#888;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:6px;}
  .step-desc{font-size:12px;color:#aaa;margin-bottom:8px;}
  pre{background:#0d0d0d;border:1px solid #1e1e1e;border-radius:6px;padding:12px 14px;font-family:'Consolas','DM Mono',monospace;font-size:12px;color:#e0e0e0;white-space:pre-wrap;word-break:break-all;position:relative;}
  .copy-btn{position:absolute;top:8px;right:8px;background:#1e1e1e;border:1px solid #333;border-radius:4px;color:#888;font-size:10px;padding:3px 8px;cursor:pointer;font-family:'Segoe UI',sans-serif;}
  .copy-btn:hover{background:#c9a84c;color:#000;border-color:#c9a84c;}
  .copy-btn.copied{background:#2a4a2a;color:#4caf50;border-color:#4caf50;}
  .cmd-grid{display:grid;gap:8px;}
  .cmd{background:#111;border:1px solid #1e1e1e;border-radius:6px;padding:12px 14px;display:flex;align-items:flex-start;gap:12px;cursor:pointer;transition:border-color 0.15s;}
  .cmd:hover{border-color:#333;}
  .cmd-text{flex:1;}
  .cmd-label{font-size:11px;color:#888;margin-bottom:3px;letter-spacing:0.5px;}
  .cmd-code{font-family:'Consolas','DM Mono',monospace;font-size:12px;color:#c9a84c;}
  .cmd-copy{font-size:10px;color:#555;flex-shrink:0;padding-top:2px;}
</style>
</head>
<body>
<h1>Profit by Design [PxD]</h1>
<div class="subtitle">Command Reference &amp; Startup Routine</div>

<h2>Startup Routine</h2>

<div class="step">
  <div class="step-label">Step 1 — Launch Claude MCP</div>
  <div class="step-desc">Open CMD and paste:</div>
  <pre id="s1">cd C:\\Users\\jarit\\tradingview-mcp &amp;&amp; claude<button class="copy-btn" onclick="cp('s1',this)">Copy</button></pre>
</div>

<div class="step">
  <div class="step-label">Step 2 — Launch TradingView with debugging</div>
  <div class="step-desc">Inside Claude, paste:</div>
  <pre id="s2">tv_launch<button class="copy-btn" onclick="cp('s2',this)">Copy</button></pre>
</div>

<h2>Daily Commands</h2>

<div class="cmd-grid">
  <div class="cmd" onclick="cpText('run batch-scan.txt', this)">
    <div class="cmd-text"><div class="cmd-label">Scan Watchlist — SCAN tab active</div><div class="cmd-code">run batch-scan.txt</div></div>
    <div class="cmd-copy">click to copy</div>
  </div>
  <div class="cmd" onclick="cpText('run scan.txt', this)">
    <div class="cmd-text"><div class="cmd-label">Scan Current Pair</div><div class="cmd-code">run scan.txt</div></div>
    <div class="cmd-copy">click to copy</div>
  </div>
</div>

<script>
function cp(id, btn) {
  const el = document.getElementById(id);
  const text = el.childNodes[0].textContent.trim();
  navigator.clipboard.writeText(text).then(() => {
    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
  });
}
function cpData(id, btn) {
  const el = document.getElementById(id);
  const text = el.dataset.copy;
  navigator.clipboard.writeText(text).then(() => {
    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
  });
}
function cpText(text, el) {
  navigator.clipboard.writeText(text).then(() => {
    const cd = el.querySelector('.cmd-copy');
    cd.textContent = 'copied!';
    cd.style.color = '#4caf50';
    setTimeout(() => { cd.textContent = 'click to copy'; cd.style.color = ''; }, 2000);
  });
}
</script>
</body>
</html>`;
    return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }
};
