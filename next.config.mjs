import fs from 'fs';
import path from 'path';

function getAdminPath() {
  try {
    const pkgPath = path.resolve(process.cwd(), 'package.json');
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      if (pkg.adminPath) {
        return pkg.adminPath.replace(/^\/+|\/+$/g, '');
      }
    }
  } catch (e) {
    // fallback
  }
  return 'demon/admin';
}

const adminPath = getAdminPath();

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // If adminPath in package.json is custom (not default 'demon/admin'), rewrite it to internal /demon/admin
    if (adminPath && adminPath !== 'demon/admin') {
      return [
        {
          source: `/${adminPath}`,
          destination: '/demon/admin',
        },
        {
          source: `/${adminPath}/:path*`,
          destination: '/demon/admin/:path*',
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
