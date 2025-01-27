import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Ermöglicht Netzwerk-Zugriff
    https: {
      key: fs.readFileSync('localhost-key.pem'), // Dein lokales SSL-Key
      cert: fs.readFileSync('localhost.pem'), // Dein lokales SSL-Zertifikat
    },
    hmr: {
      overlay: false, // Verhindert störendes Overlay bei Hot-Reload-Fehlern
    },
  },
});
