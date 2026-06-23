/** Remote ColorVista backend (Azure App Service). */
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ??
  "https://colorvista-server.azurewebsites.net";

export const PROCESS_IMAGE_URL = `${API_BASE_URL}/process-image`;
export const ENHANCEMENT_URL = `${API_BASE_URL}/enhancement`;
export const PROCESS_FRAME_URL = `${API_BASE_URL}/process-frame`;
