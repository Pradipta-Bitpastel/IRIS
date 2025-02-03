/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true, // Disable TypeScript checks during the build
    },
    eslint: {
        ignoreDuringBuilds: true, // Disable ESLint checks during the build
    },
    images: {
        unoptimized: true, // Disable Next.js image optimization
    },
    reactStrictMode: false,
};
// module.exports = {
//     env: {
//         API_ENDPOINT: process.env.NODE_ENV === 'production'
//             ? 'https://api.production.example.com'
//             : 'https://api.development.example.com'
//     }
// };

export default nextConfig;
