const plugins = [] // 'tailwindcss'

if (process.env.NODE_ENV === 'production') {
  // '@fullhuman/postcss-purgecss'

  plugins.push('autoprefixer')
}

module.exports = {plugins}
