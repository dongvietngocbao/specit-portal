import type { NextConfig } from 'next';

const isGithubPages = process.env.GITHUB_ACTIONS === 'true';
const repoName = 'specit-portal';

const config: NextConfig = {
  transpilePackages: ['@specit/canonical-schema'],
  output: 'export',
  trailingSlash: true,
  basePath: isGithubPages ? `/${repoName}` : '',
  assetPrefix: isGithubPages ? `/${repoName}/` : '',
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.specit.vn' },
      { protocol: 'https', hostname: 'localhost' },
    ],
  },
};

export default config;
