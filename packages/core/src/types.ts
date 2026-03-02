import { AxiosInstance } from "axios";

export interface CircuitBreakerConfig {
  enabled?: boolean;
  failureThreshold?: number;
  successThreshold?: number;
  timeoutMs?: number;
}

export interface CooldownConfig {
  enabled?: boolean;
  durationMs?: number;
  strategy?: "reject" | "wait";
}

export interface AnomalyConfig {
  maxPerMinute?: number;
  reportToServer?: boolean;
  reportEndpoint?: string;
}

export interface CreateAxiosRefreshConfig {
  axiosInstance: AxiosInstance;
  refreshTokenFn: () => Promise<string>;
  setAccessToken?: (token: string) => void;
  logout?: () => void;

  retry?: { enabled?: boolean; maxRetries?: number };
  circuitBreaker?: CircuitBreakerConfig;
  cooldown?: CooldownConfig;
  anomaly?: AnomalyConfig;
  devtools?: { enabled?: boolean };
}