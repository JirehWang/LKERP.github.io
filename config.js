// 📦 中央安全路由設定 (config.js)
(function() {
  // 1. 定義「專案名稱」與「GAS 網址（Base64）」的對照表
  const _URL_ROUTER = {
    "LKworship": "aHR0cHM6Ly9zY3JpcHQuZ29vZ2xlLmNvbS8uLi4vV29yc2hpcF9Vcmw=",
    "LKCschedule": "aHR0cHM6Ly9zY3JpcHQuZ29vZ2xlLmNvbS8uLi4vU2NoZWR1bGVfVXJs",
    "LKERP": "aHR0cHM6Ly9zY3JpcHQuZ29vZ2xlLmNvbS8uLi4vRVJQX1VybA==",
    "LKGroup": "aHR0cHM6Ly9zY3JpcHQuZ29vZ2xlLmNvbS8uLi4vR3JvdXBfVXJs",
    "DEFAULT": "aHR0cHM6Ly9zY3JpcHQuZ29vZ2xlLmNvbS8uLi4vRGVmYXVsdF9Vcmw="
  };

  const _TOKEN_BASE64 = "Q2h1cmNoQXBwLTIwMjY=";

  // 2. 自動偵測目前的專案名稱 (偵測 GitHub Pages 的 Repo 名稱)
  // 例如：LKworship.github.io -> 取得 "LKworship"
  const hostname = window.location.hostname.split('.')[0];
  
  // 3. 匹配網址，若找不到則使用 DEFAULT
  const targetEncodedUrl = _URL_ROUTER[hostname] || _URL_ROUTER["DEFAULT"];

  // 4. 掛載到全域 window 物件
  window.GAS_URL = atob(targetEncodedUrl);
  window.AUTH_TOKEN = atob(_TOKEN_BASE64);

  // 5. 通用通訊工具 (自動使用匹配到的 GAS_URL)
  window.churchAPI = async function(action, data = {}) {
    const isPost = ["saveSheetData", "parseWithAI", "createGroup"].includes(action);
    
    console.log(`📡 正在通訊至 [${hostname}] 的後端...`);

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

  console.log(`✅ [${hostname}] 中央路由系統已就緒`);
})();
