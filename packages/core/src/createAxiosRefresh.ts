import { createCircuitBreaker } from "./createCircuitBreaker";
import { createCooldownLock } from "./createCooldownLock";
import { createCrossTabSync } from "./createCrossTabSync";
import { createDevtoolsBridge } from "./createDevtoolsBridge";
import { retryRequest } from "./retryRequest";
import { detectAnomaly } from "./anomaly";

export const createAxiosRefresh = (config: any) => {
  const breaker = createCircuitBreaker(config.circuitBreaker);
  const cooldown = createCooldownLock(config.cooldown);
  const crossTab = createCrossTabSync();
  const devtools =
    config.devtools?.enabled && createDevtoolsBridge();

  let isRefreshing = false;
  let queue: any[] = [];

  // new release

  const processQueue = (token: string) => {
    queue.forEach(cb => cb(token));
    queue = [];
  };

  crossTab.listen(token => {
    config.setAccessToken?.(token);
  });

  const refresh = async () => {
    if (!breaker.canExecute())
      throw new Error("Circuit OPEN");

    if (!(await cooldown.canProceed()))
      throw new Error("Cooldown");

    if (isRefreshing)
      return new Promise(res => queue.push(res));

    isRefreshing = true;

    try {
      const token = await retryRequest(
        () => config.refreshTokenFn(),
        config.retry?.maxRetries ?? 0
      );

      breaker.onSuccess();
      cooldown.activate();
      config.setAccessToken?.(token);
      crossTab.broadcast(token);
      processQueue(token);
      await detectAnomaly(config.anomaly);

      devtools?.emit({ type: "refresh_success" });

      return token;
    } catch (e) {
      breaker.onFailure();
      cooldown.activate();
      config.logout?.();
      throw e;
    } finally {
      isRefreshing = false;
    }
  };

  config.axiosInstance.interceptors.response.use(
    (r: any) => r,
    async (error: any) => {
      if (error.response?.status === 401) {
        const token = await refresh();
        error.config.headers.Authorization = token;
        return config.axiosInstance(error.config);
      }
      return Promise.reject(error);
    }
  );
};