import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    reactStrictMode: true,
    experimental: {
        appDir: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        domains: ['firebasestorage.googleapis.com', 'images.unsplash.com']
    }
};

export default nextConfig;
