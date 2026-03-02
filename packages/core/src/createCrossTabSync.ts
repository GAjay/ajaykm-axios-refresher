export const createCrossTabSync = () => {
    if (typeof BroadcastChannel === "undefined")
      return { broadcast: () => {}, listen: () => {} };
  
    const channel = new BroadcastChannel("axios-refresh");
  
    return {
      broadcast: (token: string) =>
        channel.postMessage({ token }),
      listen: (cb: (t: string) => void) =>
        channel.addEventListener("message", e => {
          if (e.data?.token) cb(e.data.token);
        })
    };
  };