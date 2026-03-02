import { createCooldownLock } from "../src/createCooldownLock";

describe("Cooldown Lock", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("reject strategy blocks during cooldown", async () => {
    const cooldown = createCooldownLock({
      enabled: true,
      durationMs: 3000,
      strategy: "reject"
    });

    cooldown.activate();

    const allowed = await cooldown.canProceed();

    expect(allowed).toBe(false);
  });

  test("reject strategy allows after cooldown expires", async () => {
    const cooldown = createCooldownLock({
      enabled: true,
      durationMs: 3000,
      strategy: "reject"
    });

    cooldown.activate();

    // Fast-forward time
    jest.advanceTimersByTime(3000);

    const allowed = await cooldown.canProceed();

    expect(allowed).toBe(true);
  });

  test("wait strategy waits until cooldown expires", async () => {
    const cooldown = createCooldownLock({
      enabled: true,
      durationMs: 2000,
      strategy: "wait"
    });

    cooldown.activate();

    const promise = cooldown.canProceed();

    // Advance partially
    jest.advanceTimersByTime(1000);

    let resolved = false;
    promise.then(() => {
      resolved = true;
    });

    expect(resolved).toBe(false);

    // Advance remaining
    jest.advanceTimersByTime(1000);

    await promise;

    expect(resolved).toBe(true);
  });

  test("multiple activate calls reset cooldown timer", async () => {
    const cooldown = createCooldownLock({
      enabled: true,
      durationMs: 3000,
      strategy: "reject"
    });

    cooldown.activate();

    jest.advanceTimersByTime(2000);

    // Activate again before expiry
    cooldown.activate();

    jest.advanceTimersByTime(2000);

    const allowed = await cooldown.canProceed();

    // Should still be blocked (only 2s after reset)
    expect(allowed).toBe(false);

    jest.advanceTimersByTime(1000);

    const allowedAfter = await cooldown.canProceed();
    expect(allowedAfter).toBe(true);
  });

  test("disabled config always allows", async () => {
    const cooldown = createCooldownLock({
      enabled: false,
      durationMs: 3000
    });

    cooldown.activate();

    const allowed = await cooldown.canProceed();

    expect(allowed).toBe(true);
  });

  test("no config returns always true", async () => {
    const cooldown = createCooldownLock();

    const allowed = await cooldown.canProceed();

    expect(allowed).toBe(true);
  });
});