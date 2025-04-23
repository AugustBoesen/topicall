import withPWA from 'next-pwa';

export default withPWA({
  dest: "public",         // destination directory for the PWA files
  disable: process.env.NODE_ENV === "development",        // disable PWA in the development environment
  register: true,         // register the PWA service worker
  skipWaiting: true,      // skip waiting for service worker activation
});

export const server = async () => {
  await import('./src/app/mongoconnect.js');
};