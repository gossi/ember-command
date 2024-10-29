export default {
  presets: ['@babel/preset-typescript'],
  plugins: [
    'ember-template-imports/src/babel-plugin',
    '@embroider/addon-dev/template-colocation-plugin',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    '@babel/plugin-transform-class-static-block',
    '@babel/plugin-proposal-class-properties'
    // '@babel/plugin-transform-runtime'
  ]
};
