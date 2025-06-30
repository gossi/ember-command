import { configs } from '@gossi/config-eslint';

export default [
  {
    ignores: ['docs/.vitepress/cache/', 'docs/.vitepress/dist/']
  },
  ...configs.ember(import.meta.dirname),
  {
    files: ['docs/.vitepress/config.mjs'],
    linterOptions: {
      reportUnusedDisableDirectives: 'off'
    }
  }
];
