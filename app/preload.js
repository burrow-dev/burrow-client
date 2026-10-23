"use strict";

const {contextBridge, ipcRenderer} = require("electron");

contextBridge.exposeInMainWorld("client", {
  info: () => ipcRenderer.invoke("info"),
  // makes the game socket reach `serverUrl` (see relay.js).
  useServer: (serverUrl, gamePort, gameHost) => ipcRenderer.invoke("useServer", serverUrl, gamePort, gameHost),
  // one of the server's /api calls ("status", "register", "ban"): {status, body, ms}.
  api: (serverUrl, call, body) => ipcRenderer.invoke("api", serverUrl, call, body),
  // hashes of this computer's ids, for the server's sign-in (device.js).
  device: () => ipcRenderer.invoke("device"),
  // the server's captcha ("login" or "signup") in a window of its own: its answer, or "" when there is none.
  captcha: (serverUrl, action) => ipcRenderer.invoke("captcha", serverUrl, action),
  setGpu: on => ipcRenderer.invoke("setGpu", on),
  setAutoUpdate: on => ipcRenderer.invoke("setAutoUpdate", on),
  restartToUpdate: () => ipcRenderer.send("restartToUpdate"),
  // {state: "ready" | "download", version} from updater.js
  onUpdate: listener => ipcRenderer.on("update", (event, state) => listener(state)),
  // {total, game}, each {cpu, memoryMb}; processes, how many there are.
  metrics: () => ipcRenderer.invoke("metrics"),
  // how many times the game's picture changed on the screen in a second, or null.
  painted: gameContentsId => ipcRenderer.invoke("painted", gameContentsId),
  // saves a picture of the game; resolves to the file's path, or null.
  screenshot: gameContentsId => ipcRenderer.invoke("screenshot", gameContentsId),
  showFile: file => ipcRenderer.send("showFile", file),
  toggleFullscreen: () => ipcRenderer.send("toggleFullscreen"),
  openPage: url => ipcRenderer.send("openPage", url),
  // the player's own theatre video file, which the game page may then load; "" when stopped.
  ownVideo: link => ipcRenderer.invoke("ownVideo", link),
  // an address the theatre's browser would not load (main.js BROWSER_SITES)
  onBrowserBlocked: listener => ipcRenderer.on("browserBlocked", (event, url) => listener(url)),
  // Discord rich presence (discord.js): {appId, state, start, url}, or null.
  presence: info => ipcRenderer.send("presence", info),
  onFullscreen: listener => ipcRenderer.on("fullscreen", (event, on) => listener(on)),
  onShortcut: listener => ipcRenderer.on("shortcut", (event, key) => listener(key)),
});
