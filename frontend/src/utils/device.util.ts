// frontend/src/utils/device.util.ts
export function getOrCreateDeviceUuid(): string {
  const STORAGE_KEY = 'tms_device_uuid';
  let deviceUuid = localStorage.getItem(STORAGE_KEY);
  
  if (!deviceUuid) {
    // Genera un UUID v4 seguro compatible con los navegadores modernos
    deviceUuid = crypto.randomUUID ? crypto.randomUUID() : 'dev-' + Math.random().toString(36).substring(2) + Date.now();
    localStorage.setItem(STORAGE_KEY, deviceUuid);
  }
  
  return deviceUuid;
}