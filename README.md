# @gajay/axios-refresh-core

> Production-grade Axios refresh token engine with circuit breaker, cooldown lock, retry logic, cross-tab sync, anomaly detection, DevTools panel, and MCP support.

[![npm version](https://img.shields.io/npm/v/@gajay/axios-refresh-core.svg)](https://www.npmjs.com/package/@gajay/axios-refresh-core)
[![MIT License](https://img.shields.io/npm/l/@gajay/axios-refresh-core.svg)](LICENSE)

---

## ✨ Features

- 🔄 Automatic Axios 401 refresh handling
- 🧠 Circuit breaker (OPEN / HALF_OPEN / CLOSED)
- ⏳ Cooldown lock to prevent refresh storms
- 🔁 Retry with configurable attempts
- 🌍 Cross-tab token sync (BroadcastChannel)
- 🚨 Anomaly detection (excessive refresh detection)
- 📊 DevTools floating debug panel
- 🔐 Optional logout fallback
- 🧪 Fully tested (Jest)
- ⚡ Tree-shakeable ESM + CJS build

---

## 📦 Installation

```bash
npm install @gajay/axios-refresh-core
```

or

```bash
yarn add @gajay/axios-refresh-core
```

---

## 🚀 Basic Usage

```ts
import axios from "axios";
import { createAxiosRefresh } from "@gajay/axios-refresh-core";

const api = axios.create({
  baseURL: "/api"
});

createAxiosRefresh({
  axiosInstance: api,
  refreshTokenFn: async () => {
    const res = await axios.post("/auth/refresh");
    return res.data.accessToken;
  },
  setAccessToken: (token) => {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  }
});
```

---

## 🛡 Circuit Breaker Example

```ts
createAxiosRefresh({
  axiosInstance: api,
  refreshTokenFn,
  circuitBreaker: {
    enabled: true,
    failureThreshold: 3,
    timeoutMs: 10000
  }
});
```

---

## ⏳ Cooldown Lock Example

```ts
createAxiosRefresh({
  axiosInstance: api,
  refreshTokenFn,
  cooldown: {
    enabled: true,
    durationMs: 5000,
    strategy: "reject" // or "wait"
  }
});
```

---

## 🔁 Retry Support

```ts
createAxiosRefresh({
  axiosInstance: api,
  refreshTokenFn,
  retry: {
    enabled: true,
    maxRetries: 2
  }
});
```

---

## 🌍 Cross-Tab Sync

Automatically syncs new access tokens across browser tabs using `BroadcastChannel`.

No additional setup required.

---

## 🚨 Anomaly Detection

Detect excessive refresh attempts and optionally report to server.

```ts
createAxiosRefresh({
  axiosInstance: api,
  refreshTokenFn,
  anomaly: {
    maxPerMinute: 5,
    reportToServer: true,
    reportEndpoint: "/security/anomaly"
  }
});
```

---

## 📊 DevTools Panel

Enable floating debug panel (development only):

```ts
createAxiosRefresh({
  axiosInstance: api,
  refreshTokenFn,
  devtools: {
    enabled: true
  }
});
```

## 🧪 Testing

```bash
npm run test
```

---

## 📦 Build

```bash
npm run build
```

---

## 🔐 Security Notes

- Always validate refresh token server-side
- Use short-lived access tokens
- Enable anomaly reporting in production
- Use HTTPS only

---

## 📚 Roadmap

- Chrome DevTools extension
- Metrics exporter
- WebSocket event streaming
- React DevTools integration
- SaaS monitoring dashboard

---

## 🤝 Contributing

Pull requests welcome. Please use Conventional Commits.

---

## 📄 License

MIT © Ajay Kumar Maheshwari