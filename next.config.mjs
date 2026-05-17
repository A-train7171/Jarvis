/** @type {import('next').NextConfig} */
const isMobile = process.env.BUILD_TARGET === "mobile";

const nextConfig = {
  // For Capacitor / mobile builds we emit a static export into ./out.
  // For regular web builds we keep server features.
  ...(isMobile ? { output: "export", trailingSlash: true } : {}),
  images: {
    unoptimized: isMobile,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
