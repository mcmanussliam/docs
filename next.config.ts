import type {NextConfig} from 'next';
import createMDX from '@next/mdx';

export const REPOSITORY_NAME = 'pages';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: `/${REPOSITORY_NAME}`,
  assetPrefix: `/${REPOSITORY_NAME}/`,
  images: {unoptimized: true},
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  reactCompiler: true,
  trailingSlash: true,
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [
      ['remark-frontmatter'],
      ['remark-mdx-frontmatter'],
      ['remark-gfm', {strict: true, throwOnError: true}]
    ],
    rehypePlugins: [
      ['rehype-pretty-code'],
    ],
  }
});

export default withMDX(nextConfig);
