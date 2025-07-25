import { defineConfig } from 'vitepress';

// eslint-disable-next-line n/no-missing-import
import typedocSidebar from '../api/typedoc-sidebar.json';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'ember-command',
  description: 'Integrate your Business Logic with Ember',
  base: '/ember-command/',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guides', link: '/getting-started' },
      { text: 'API', link: '/api/modules', activeMatch: '/api' }
    ],

    outline: [2, 3],

    sidebar: {
      '/': [
        {
          text: 'Guides',
          items: [
            { text: 'Why ember-command?', link: '/why' },
            { text: 'Getting Started', link: '/getting-started' },
            { text: 'Installation', link: '/installation' },
            { text: 'Intended Usage', link: '/usage' }
          ]
        },
        {
          text: 'Tutorial',
          items: [
            {
              text: 'Super Rentals Recommendations',
              link: '/super-rentals-recommendations'
            }
          ]
        },
        {
          text: 'Commands',
          items: [
            { text: 'Functions', link: '/functions' },
            { text: 'Actions', link: '/actions' },
            { text: 'Command', link: '/command' },
            { text: 'Links', link: '/links' }
          ]
        },
        {
          text: 'Using Commands',
          items: [
            { text: 'Composing', link: '/composing' },
            { text: 'Attaching to UI', link: '/ui' },
            { text: 'Testing', link: '/testing' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API',
          items: typedocSidebar
        }
      ]
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/gossi/ember-command' }]
  }
});
