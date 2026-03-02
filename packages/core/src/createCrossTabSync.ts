export const createCrossTabSync = () => {
  if (
    typeof window === "undefined" ||
    typeof (globalThis as any).BroadcastChannel === "undefined"
  ) {
    return {
      broadcast: () => {},
      listen: () => {}
    };
  }

  const channel = new (globalThis as any).BroadcastChannel(
    "axios-refresh"
  );

  return {
    broadcast: (token: string) => {
      channel.postMessage({ token });
    },
    listen: (cb: (t: string) => void) => {
      channel.addEventListener("message", (e: any) => {
        if (e.data?.token) cb(e.data.token);
      });
    }
  };
};