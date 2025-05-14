import withPWA from 'next-pwa';

const nextConfig = {
  reactStrictMode: true,
};

export default withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
})(nextConfig);  // Pass actual Next.js config to the wrapper

export const server = async () => {
  await import('./src/app/mongoconnect.js');
};