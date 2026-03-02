import { createCircuitBreaker } from "../src/createCircuitBreaker";

describe("Circuit Breaker", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(0);   
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("starts in CLOSED state", () => {
    const breaker = createCircuitBreaker({
      enabled: true,
      failureThreshold: 3
    });

    expect(breaker.getState()).toBe("CLOSED");
    expect(breaker.canExecute()).toBe(true);
  });

  test("opens after reaching failure threshold", () => {
    const breaker = createCircuitBreaker({
      enabled: true,
      failureThreshold: 2,
      timeoutMs: 5000
    });

    breaker.onFailure();
    breaker.onFailure();

    expect(breaker.getState()).toBe("OPEN");
    expect(breaker.canExecute()).toBe(false);
  });

  test("remains OPEN before timeout", () => {
    const breaker = createCircuitBreaker({
      enabled: true,
      failureThreshold: 1,
      timeoutMs: 5000
    });

    breaker.onFailure();

    jest.advanceTimersByTime(3000);

    expect(breaker.getState()).toBe("OPEN");
    expect(breaker.canExecute()).toBe(false);
  });

  test("moves to HALF_OPEN after timeout", () => {
    const breaker = createCircuitBreaker({
      enabled: true,
      failureThreshold: 1,
      timeoutMs: 5000
    });

    breaker.onFailure();

    breaker.onFailure(); // OPEN
jest.advanceTimersByTime(5000);
jest.setSystemTime(5000); 

    expect(breaker.canExecute()).toBe(true);
    expect(breaker.getState()).toBe("HALF_OPEN");
  });

  test("HALF_OPEN success closes breaker", () => {
    const breaker = createCircuitBreaker({
      enabled: true,
      failureThreshold: 1,
      timeoutMs: 2000
    });

    breaker.onFailure();

    jest.advanceTimersByTime(2000);

    breaker.canExecute(); // move to HALF_OPEN
    breaker.onSuccess();

    expect(breaker.getState()).toBe("CLOSED");
    expect(breaker.canExecute()).toBe(true);
  });

  test("HALF_OPEN failure reopens breaker", () => {
    const breaker = createCircuitBreaker({
      enabled: true,
      failureThreshold: 1,
      timeoutMs: 2000
    });

    breaker.onFailure();

    jest.advanceTimersByTime(2000);

    breaker.canExecute(); // HALF_OPEN
    breaker.onFailure();

    expect(breaker.getState()).toBe("OPEN");
  });

  test("success in CLOSED resets failure count", () => {
    const breaker = createCircuitBreaker({
      enabled: true,
      failureThreshold: 3
    });

    breaker.onFailure();
    breaker.onFailure();
    breaker.onSuccess();

    expect(breaker.getState()).toBe("CLOSED");

    breaker.onFailure();
    breaker.onFailure();
    breaker.onFailure();

    expect(breaker.getState()).toBe("OPEN");
  });

  test("disabled breaker always allows execution", () => {
    const breaker = createCircuitBreaker({
      enabled: false,
      failureThreshold: 1
    });

    breaker.onFailure();
    breaker.onFailure();

    expect(breaker.getState()).toBe("CLOSED");
    expect(breaker.canExecute()).toBe(true);
  });

  test("multiple OPEN cycles behave correctly", () => {
    const breaker = createCircuitBreaker({
      enabled: true,
      failureThreshold: 1,
      timeoutMs: 1000
    });

    breaker.onFailure();
    expect(breaker.getState()).toBe("OPEN");

    jest.advanceTimersByTime(1000);

    breaker.canExecute(); // HALF_OPEN
    breaker.onFailure();  // Reopen

    expect(breaker.getState()).toBe("OPEN");
  });
});