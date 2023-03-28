// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')
module.exports = {
  webpack: {
    alias: {
      '@glass/assets': path.resolve(__dirname, 'src/assets'),
      '@glass/components': path.resolve(__dirname, 'src/components'),
      '@glass/constants': path.resolve(__dirname, 'src/core/constants'),
      '@glass/envs': path.resolve(__dirname, 'src/core/envs'),
      '@glass/enums': path.resolve(__dirname, 'src/core/enums'),
      '@glass/hooks': path.resolve(__dirname, 'src/core/hooks'),
      '@glass/models': path.resolve(__dirname, 'src/core/models'),
    },
  },
}
