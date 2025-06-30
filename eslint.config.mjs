import { configs } from '@gossi/config-eslint';

export default [
  {
    ignores: [
      'docs/.vitepress/cache/',
      'docs/.vitepress/dist/',
      // https://github.com/gossi/ember-command/issues/139
      'tests/rendering/command-element-test.gts'
    ]
  },
  ...configs.ember(import.meta.dirname),
  {
    files: ['docs/.vitepress/config.mjs'],
    linterOptions: {
      reportUnusedDisableDirectives: 'off'
    }
  }
];
