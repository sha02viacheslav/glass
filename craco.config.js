// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')
module.exports = {
  webpack: {
    alias: {
      '@glass/assets': path.resolve(__dirname, 'src/assets'),
    },
  },
}
