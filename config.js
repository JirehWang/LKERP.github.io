// 📦 中央安全路由設定 (支援 GitHub Pages 多專案架構版)
(function() {
  function safeAtob(base64Str) {
    try {
      return atob(base64Str.replace(/-/g, '+').replace(/_/g, '/'));
    } catch (e) {
      console.error("❌ Base64 解碼失敗:", e);
      return null;
    }
  }

  // 📝 這裡是你所有系統的對應表
  const _URL_ROUTER = {
    // 敬拜團系統 (已換上正確編碼)
    "LKworship": "aHR0cHM6Ly9zY3JpcHQuZ29vZ2xlLmNvbS9tYWNyb3Mvcy9BS2Z5Y2J5a182dFV1Y1ZnLVU0clJRallIdms2MzJ0ZVp5eHVmRGtOWF9YMVdSVVhQTUdnc1RhZW1WWERfbXY5a0JEanVTd09uQS9leGVj",
    
    // 其他系統 (維持你原本設定的編碼)
    "LKCschedule": "aHR0cHM6Ly9zY3JpcHQuZ29vZ2xlLmNvbS9tYWNyb3Mvcy9BS2Z5Y2J3aVlZLXdLeG1MUkFFYUVfcGJwX2tXeUF6bFJQQ3dZVlFmdm1KVmFtUkp2b3N2dDV3VFRrdndlYmJGQmtQOHJNcVgvZXhlYw==",
    "LKC1958_June_1": "aHR0cHM6Ly9zY3JpcHQuZ29vZ2xlLmNvbS9tYWNyb3Mvcy9BS2Z5Y2J4NDI2OElrZ3dRbTJFczBnakRITFVfVTlua0pyUk1SMS14emJidHVhcTA4bGVQTGdBUTJ3bkRSckNlSGR5OWpOaGgvZXhlYw==",
    "LKGroup": "aHR0cHM6Ly9zY3JpcHQuZ29vZ2xlLmNvbS9tYWNyb3Mvcy9BS2Z5Y2J6ZmFXaF9vb1JUR2lqcExWXzdMVkZVSGZtODN2TDZEdll0OXJ0NnplNW1EWGh0d0x2OHlteExYX1BHdURUWHptTndlL2V4ZWM=",
    
    // 如果真的都找不到，預設去哪裡 (我先暫時設為敬拜團，你可以依需求更改)
    "DEFAULT": "aHR0cHM6Ly9zY3JpcHQuZ29vZ2xlLmNvbS9tYWNyb3Mvcy9BS2Z5Y2J5a182dFV1Y1ZnLVU0clJRallIdms2MzJ0ZVp5eHVmRGtOWF9YMVdSVVhQTUdnc1RhZW1WWERfbXY5a0JEanVTd09uQS9leGVj"
  };

  const _TOKEN_BASE64 = "Q2h1cmNoQXBwLTIwMjY=";

  // 🌟 關鍵修正：雙重定位機制
  // 1. 抓取路徑名稱 (例如從 /LKworship/index.html 抓出 "LKworship")
  const repoName = window.location.pathname.split('/')[1]; 
  // 2. 抓取網域名稱 (作為備用)
  const hostname = window.location.hostname.split('.')[0];

  // 🤖 智慧路由邏輯：
  // 優先找 Repository 名稱 (解決 GitHub Pages 多專案問題)
  // 如果找不到，再找 Hostname (解決未來若綁定自訂網域的問題)
  // 再找不到，就用 DEFAULT
  const currentKey = _URL_ROUTER[repoName] ? repoName : (_URL_ROUTER[hostname] ? hostname : "DEFAULT");
  
  const targetEncodedUrl = _URL_ROUTER[currentKey];

  window.GAS_URL = safeAtob(targetEncodedUrl);
  window.AUTH_TOKEN = safeAtob(_TOKEN_BASE64);

  window.churchAPI = async function(action, data = {}) {
    if (!window.GAS_URL) throw new Error("系統尚未就緒，GAS_URL 為空");

    try {
      const resp = await fetch(window.GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: action, token: window.AUTH_TOKEN, data: data })
      });
      return await resp.json();
    } catch (err) {
      console.error("📡 API 通訊失敗:", err);
      throw err;
    }
  };

  console.log(`✅ [${currentKey}] 中央路由系統已就緒`);
})();
