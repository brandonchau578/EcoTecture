import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      'react-map-gl': 'react-map-gl/dist/esm/index.js', // or adjust based on where the correct entry point is
    },
  },
});

