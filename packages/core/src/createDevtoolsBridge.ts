export const createDevtoolsBridge = () => {
    if (typeof window === "undefined") return null;
  
    const w: any = window;
  
    if (!w.__AXIOS_REFRESH_DEVTOOLS__) {
      w.__AXIOS_REFRESH_DEVTOOLS__ = {
        events: [],
        emit(e: any) {
          this.events.push(e);
        }
      };
    }
  
    return w.__AXIOS_REFRESH_DEVTOOLS__;
  };