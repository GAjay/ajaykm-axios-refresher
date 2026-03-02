export const createCooldownLock = (config?: any) => {
    if (!config?.enabled) {
      return {
        canProceed: async () => true,
        activate: () => {}
      };
    }
  
    let lockedUntil = 0;
  
    return {
      canProceed: async () => {
        const now = Date.now();
        if (now >= lockedUntil) return true;
  
        if (config.strategy === "wait") {
          await new Promise(r =>
            setTimeout(r, lockedUntil - now)
          );
          return true;
        }
        return false;
      },
      activate: () => {
        lockedUntil = Date.now() + (config.durationMs ?? 3000);
      }
    };
  };