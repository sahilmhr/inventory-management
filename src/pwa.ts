import { registerSW } from "virtual:pwa-register";

registerSW({
  immediate: true,
  onOfflineReady() {
    window.dispatchEvent(new CustomEvent("retail-pocket:offline-ready"));
  },
  onNeedRefresh() {
    window.dispatchEvent(new CustomEvent("retail-pocket:update-ready"));
  }
});
