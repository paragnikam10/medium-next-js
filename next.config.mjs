/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "miro.medium.com",
            },
            {
                protocol: "https",
                hostname: "www.shutterstock.com", 
            },
        ],
    },
};

export default nextConfig;

