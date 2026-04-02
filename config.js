// 📦 中央安全路由設定 (config.js)
(function() {
  // 🌟 1. 定義「專案名稱」與「完整網址的 Base64」對照表
  // 提示：這些編碼是透過 btoa("https://script.google.com/.../exec") 產生的
  const _URL_ROUTER = {
    "LKworship": "aHR0cHM6Ly9zY3JpcHQuZ29vZ2xlLmNvbS9tYWNyb3Mvcy9BS2Z5Y2J5ay_2dFV1Y1ZnLVU0clJRallIdms2MzJ0ZVp5eHVmRGtOWF9YMVdSVVhQTUdncy1hZW1WWERfbXY5a0JEanVTd09uQS9leGVj",
    "LKCschedule": "aHR0cHM6Ly9zY3JpcHQuZ29vZ2xlLmNvbS9tYWNyb3Mvcy9BS2Z5Y2J3aVlZf2dLeG1MUkFFYUVfcGJwX2tXeUF6bFJQQ3dZVlFmdm1KVmFtUkp2b3N2dDV3VFRrdndlYmJGQmtQOHJNcVgvZXhlYw==",
    "LKC1958_June_1": "aHR0cHM6Ly9zY3JpcHQuZ29vZ2xlLmNvbS9tYWNyb3Mvcy9BS2Z5Y2J4NDI2OElrZ3dRbTJFczBnakRITFVfVTlua0pyUk1SMS14emJidHVhcTA4bGVQTGdBUTJ3bkRSckNlSGR5OWpOaGgvZXhlYw==",
    "LKGroup": "aHR0cHM6Ly9zY3JpcHQuZ29vZ2xlLmNvbS9tYWNyb3Mvcy9BS2Z5Y2J6ZmFXaF9vb1JUR2lqcExWXzdMVkZVSGZtODN2TDZEdll0OXJ0NnplNW1EWGh0d0x2OHlteExYX1BHdURUWHptTndlL2V4ZWM=",
    "WhosCar": "aHR0cHM6Ly9zY3JpcHQuZ29vZ2xlLmNvbS9tYWNyb3Mvcy9BS2Z5Y2J4T2tvYU5xdUl4X1Y4bl83ZVNfNVVMbW9xeFBWbHlfQmV6eDlfUXNtV1N6Tk9jb2pyQ0k5T2E2VU5kNWhPRDJldVMvZXhlYw==",
    "DEFAULT": "aHR0cHM6Ly9zY3JpcHQuZ29vZ2xlLmNvbS9tYWNyb3Mvcy9BS2Z5Y2J4NDI2OElrZ3dRbTJFczBnakRITFVfVTlua0pyUk1SMS14emJidHVhcTA4bGVQTGdBUTJ3bkRSckNlSGR5OWpOaGgvZXhlYw=="
  };

  const _TOKEN_BASE64 = "Q2h1cmNoQXBwLTIwMjY=";

  // 2. 自動偵測目前的專案名稱
  const hostname = window.location.hostname.split('.')[0];
  
  // 3. 匹配網址，若找不到則使用 DEFAULT
  const targetEncodedUrl = _URL_ROUTER[hostname] || _URL_ROUTER["DEFAULT"];

  // 4. 掛載到全域 window 物件 (加入錯誤處理以防解碼失敗)
  try {
    window.GAS_URL = atob(targetEncodedUrl);
    window.AUTH_TOKEN = atob(_TOKEN_BASE64);
  } catch (e) {
    console.error("❌ 安全網解碼失敗，請確認 Base64 格式是否正確");
  }

  // 5. 通用通訊工具
  window.churchAPI = async function(action, data = {}) {
    if (!window.GAS_URL) return alert("系統尚未就緒，請檢查設定");

    const isPost = ["saveSheetData", "parseWithAI", "createGroup", "saveGroupPrompt", "saveGroupMembers", "toggleGroupStatus"].includes(action);
    
    console.log(`📡 正在通訊至 [${hostname}] 的後端...`);

    try {
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
    } catch (err) {
      console.error("API 通訊發生錯誤:", err);
      throw err;
    }
  };

  console.log(`✅ [${hostname}] 中央路由系統已就緒`);
})();
