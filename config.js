// 📦 中央安全路由設定 (終極完美修復版)
(function() {
  function safeAtob(base64Str) {
    try {
      const sanitized = base64Str.replace(/-/g, '+').replace(/_/g, '/');
      return atob(sanitized);
    } catch (e) {
      console.error("❌ Base64 解碼失敗:", e);
      return null;
    }
  }

  const _URL_ROUTER = {
    // 👇 這裡已經為你換上 100% 正確的編碼
    "jirehwang": "aHR0cHM6Ly9zY3JpcHQuZ29vZ2xlLmNvbS9tYWNyb3Mvcy9BS2Z5Y2J5a182dFV1Y1ZnLVU0clJRallIdms2MzJ0ZVp5eHVmRGtOWF9YMVdSVVhQTUdnc1RhZW1WWERfbXY5a0JEanVTd09uQS9leGVj",
    "LKworship": "aHR0cHM6Ly9zY3JpcHQuZ29vZ2xlLmNvbS9tYWNyb3Mvcy9BS2Z5Y2J5a182dFV1Y1ZnLVU0clJRallIdms2MzJ0ZVp5eHVmRGtOWF9YMVdSVVhQTUdnc1RhZW1WWERfbXY5a0JEanVTd09uQS9leGVj",
    "DEFAULT": "aHR0cHM6Ly9zY3JpcHQuZ29vZ2xlLmNvbS9tYWNyb3Mvcy9BS2Z5Y2J5a182dFV1Y1ZnLVU0clJRallIdms2MzJ0ZVp5eHVmRGtOWF9YMVdSVVhQTUdnc1RhZW1WWERfbXY5a0JEanVTd09uQS9leGVj",
    
    "LKCschedule": "aHR0cHM6Ly9zY3JpcHQuZ29vZ2xlLmNvbS9tYWNyb3Mvcy9BS2Z5Y2J3aVlZLXdLeG1MUkFFYUVfcGJwX2tXeUF6bFJQQ3dZVlFmdm1KVmFtUkp2b3N2dDV3VFRrdndlYmJGQmtQOHJNcVgvZXhlYw==",
    "LKC1958_June_1": "aHR0cHM6Ly9zY3JpcHQuZ29vZ2xlLmNvbS9tYWNyb3Mvcy9BS2Z5Y2J4NDI2OElrZ3dRbTJFczBnakRITFVfVTlua0pyUk1SMS14emJidHVhcTA4bGVQTGdBUTJ3bkRSckNlSGR5OWpOaGgvZXhlYw==",
    "LKGroup": "aHR0cHM6Ly9zY3JpcHQuZ29vZ2xlLmNvbS9tYWNyb3Mvcy9BS2Z5Y2J6ZmFXaF9vb1JUR2lqcExWXzdMVkZVSGZtODN2TDZEdll0OXJ0NnplNW1EWGh0d0x2OHlteExYX1BHdURUWHptTndlL2V4ZWM="
  };

  const _TOKEN_BASE64 = "Q2h1cmNoQXBwLTIwMjY=";
  const hostname = window.location.hostname.split('.')[0];
  const targetEncodedUrl = _URL_ROUTER[hostname] || _URL_ROUTER["DEFAULT"];

  window.GAS_URL = safeAtob(targetEncodedUrl);
  window.AUTH_TOKEN = safeAtob(_TOKEN_BASE64);

  window.churchAPI = async function(action, data = {}) {
    if (!window.GAS_URL) return console.error("系統尚未就緒，GAS_URL 為空");

    // 確保所有動作都走 POST
    const postActions = [
      "saveSheetData", "savePositions", "saveSchedule", 
      "parseWithAI", "createGroup", "toggleGroupStatus",
      "getSchedule", "getPositions", "getScheduleByDateRange"
    ];
    const isPost = postActions.includes(action);
    
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
      console.error("📡 API 通訊失敗:", err);
      throw err;
    }
  };

  console.log(`✅ [${hostname}] 中央路由系統已就緒`);
})();
