import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
  // 공유 이미지(OG·스토리)가 런타임에 읽는 폰트 파일을 배포 번들에 포함
  outputFileTracingIncludes: {
    '/u/[handle]/opengraph-image': ['./src/assets/fonts/*.woff'],
    '/u/[handle]/story': ['./src/assets/fonts/*.woff'],
  },
  // 공개 주소는 /@handle 이지만, App Router에서 `@폴더`는 parallel route 문법이라
  // 실제 라우트는 /u/[handle] 에 두고 rewrite 한다.
  async rewrites() {
    return [
      { source: '/@:handle', destination: '/u/:handle' },
      { source: '/@:handle/:path*', destination: '/u/:handle/:path*' },
    ]
  },
}

export default nextConfig
