// 📦 中央安全設定檔 (config.js)
const _SECRET = {
  // 你的 GAS 網址 Base64
  u: "aHR0cHM6Ly9zY3JpcHQuZ29vZ2xlLmNvbS9tYWNyb3Mvcy9BS2Z5Y2J4NDI2OElrZ3dRbTJFczBnakRITFVfVTlua0pyUk1SMS14emJidHVhcTA4bGVQTGdBUTJ3bkRSckNlSGR5OWpOaGgvZXhlYw==",
  // 你的 Token Base64
  t: "Q2h1cmNoQXBwLTIwMjY="
};

// 全域變數供所有系統使用
window.GAS_URL = atob(_SECRET.u);
window.AUTH_TOKEN = atob(_SECRET.t);

// 🌟 這裡可以放「通用通訊工具」，這樣以後 script.js 只要寫一行就好
window.churchAPI = async function(action, data = {}) {
  const isPost = ["saveSheetData", "parseWithAI", "createGroup", "saveGroupPrompt", "saveGroupMembers", "toggleGroupStatus"].includes(action);
  
  if (isPost) {
    const resp = await fetch(window.GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action, token: window.AUTH_TOKEN, data })
    });
    return await resp.json();
  } else {
    const url = new URL(window.GAS_URL);
    url.searchParams.append('action', action);
    url.searchParams.append('token', window.AUTH_TOKEN);
    for (let key in data) url.searchParams.append(key, data[key]);
    const resp = await fetch(url);
    return await resp.json();
  }
};

console.log("✅ 中央設定已載入");
