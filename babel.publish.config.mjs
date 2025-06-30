import { templateCompatSupport } from '@embroider/compat/babel';

import { isCompat, macros } from './babel.config.mjs';

export default {
  plugins: [
    [
      '@babel/plugin-transform-typescript',
      {
        allExtensions: true,
        allowDeclareFields: true,
        onlyRemoveTypeImports: true
      }
    ],
    [
      'babel-plugin-ember-template-compilation',
      {
        transforms: [...(isCompat ? templateCompatSupport() : macros.templateMacros)]
      }
    ],
    [
      'module:decorator-transforms',
      {
        runtime: {
          import: 'decorator-transforms/runtime-esm'
        }
      }
    ]
  ],

  generatorOpts: {
    compact: false
  }
};
