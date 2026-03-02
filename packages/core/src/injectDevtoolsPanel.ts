/* eslint-disable */

export const injectDevtoolsPanel = () => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }
  
    const w: any = window;
  
    if (!w.__AXIOS_REFRESH_DEVTOOLS__) return;
  
    if (document.getElementById("__axios_refresh_devtools_panel__")) return;
  
    const devtools = w.__AXIOS_REFRESH_DEVTOOLS__;
  
    // Create container
    const panel = document.createElement("div");
    panel.id = "__axios_refresh_devtools_panel__";
  
    panel.style.position = "fixed";
    panel.style.bottom = "0";
    panel.style.right = "0";
    panel.style.width = "380px";
    panel.style.height = "280px";
    panel.style.background = "#0f172a";
    panel.style.color = "#22c55e";
    panel.style.fontSize = "12px";
    panel.style.fontFamily = "monospace";
    panel.style.borderTopLeftRadius = "8px";
    panel.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";
    panel.style.zIndex = "999999";
    panel.style.display = "flex";
    panel.style.flexDirection = "column";
  
    // Header
    const header = document.createElement("div");
    header.style.padding = "8px";
    header.style.borderBottom = "1px solid #1e293b";
    header.style.display = "flex";
    header.style.justifyContent = "space-between";
    header.style.alignItems = "center";
  
    header.innerHTML = `<strong>Axios Refresh DevTools</strong>`;
  
    // Controls
    const controls = document.createElement("div");
  
    const clearBtn = document.createElement("button");
    clearBtn.textContent = "Clear";
    clearBtn.style.marginRight = "6px";
  
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "✕";
  
    const forceBtn = document.createElement("button");
    forceBtn.textContent = "Force";
    forceBtn.style.marginRight = "6px";
  
    [clearBtn, forceBtn, closeBtn].forEach(btn => {
      btn.style.background = "#1e293b";
      btn.style.color = "#22c55e";
      btn.style.border = "1px solid #334155";
      btn.style.cursor = "pointer";
      btn.style.padding = "2px 6px";
      btn.style.fontSize = "11px";
    });
  
    controls.appendChild(clearBtn);
    controls.appendChild(forceBtn);
    controls.appendChild(closeBtn);
  
    header.appendChild(controls);
  
    // Body
    const body = document.createElement("div");
    body.style.flex = "1";
    body.style.overflow = "auto";
    body.style.padding = "6px";
  
    panel.appendChild(header);
    panel.appendChild(body);
    document.body.appendChild(panel);
  
    // Render event
    const renderEvent = (event: any) => {
      const line = document.createElement("div");
      line.style.borderBottom = "1px solid #1e293b";
      line.style.padding = "4px 0";
  
      const time = new Date(event.timestamp || Date.now())
        .toLocaleTimeString();
  
      line.innerHTML = `
        <div style="color:#94a3b8">${time}</div>
        <div>${event.type}</div>
      `;
  
      body.appendChild(line);
      body.scrollTop = body.scrollHeight;
    };
  
    // Load existing history
    if (Array.isArray(devtools.events)) {
      devtools.events.forEach(renderEvent);
    }
  
    // Subscribe live updates
    if (typeof devtools.subscribe === "function") {
      devtools.subscribe(renderEvent);
    }
  
    // Clear events
    clearBtn.onclick = () => {
      body.innerHTML = "";
      if (Array.isArray(devtools.events)) {
        devtools.events.length = 0;
      }
    };
  
    // Force refresh
    forceBtn.onclick = () => {
      if (typeof devtools.forceRefresh === "function") {
        devtools.forceRefresh();
      }
    };
  
    // Close panel
    closeBtn.onclick = () => {
      panel.remove();
    };
  
    // Optional: drag support
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;
  
    header.style.cursor = "move";
  
    header.onmousedown = (e) => {
      isDragging = true;
      offsetX = e.clientX - panel.getBoundingClientRect().left;
      offsetY = e.clientY - panel.getBoundingClientRect().top;
    };
  
    document.onmousemove = (e) => {
      if (!isDragging) return;
      panel.style.left = e.clientX - offsetX + "px";
      panel.style.top = e.clientY - offsetY + "px";
      panel.style.right = "auto";
      panel.style.bottom = "auto";
    };
  
    document.onmouseup = () => {
      isDragging = false;
    };
  };