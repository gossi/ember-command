export default scenarios();

function scenarios() {
  return {
    scenarios: [
      compatEmberScenario('ember-lts-3.28', '^3.28.0'),
      compatEmberScenario('ember-lts-4.4', '~4.4.0'),
      compatEmberScenario('ember-lts-4.12', '^4.12.0'),
      compatEmberScenario('ember-lts-5.4', '~5.4.0'),
      compatEmberScenario('ember-lts-5.12', '^5.12.0'),
      compatEmberScenario('ember-lts-6.4', '~6.4.0'),
      latestEmberScenario('latest'),
      latestEmberScenario('beta'),
      latestEmberScenario('alpha')
      // https://github.com/gossi/ember-command/issues/140
      // emberLink('v1', '^1.3.1'),
      // emberLink('v2', '^2.1.0')
    ]
  };
}

// function emberLink(name, emberLinkVersion) {
//   return {
//     name: `ember-link-${name}`,
//     npm: {
//       devDependencies: {
//         'ember-link': emberLinkVersion
//       }
//     }
//   };
// }

function latestEmberScenario(tag) {
  return {
    name: `ember-${tag}`,
    npm: {
      devDependencies: {
        'ember-source': `npm:ember-source@${tag}`
      }
    }
  };
}

function emberCliBuildJS() {
  return `const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const { compatBuild } = require('@embroider/compat');
module.exports = async function (defaults) {
  const { buildOnce } = await import('@embroider/vite');
  let app = new EmberApp(defaults);
  return compatBuild(app, buildOnce);
};`;
}

function compatEmberScenario(name, emberVersion) {
  let cliVersion = '^5.12.0';
  let deps = {};

  if (emberVersion.includes('3.28')) {
    cliVersion = '^4.12.0';
  }

  if (emberVersion.includes('3.28') || emberVersion.includes('4.4')) {
    cliVersion = '^4.12.0';
    deps = {
      '@glimmer/component': '^1.1.2'
    };
  }

  return {
    name,
    npm: {
      devDependencies: {
        'ember-source': emberVersion,
        '@embroider/compat': '^4.0.3',
        'ember-cli': cliVersion,
        'ember-auto-import': '^2.10.0',
        '@ember/optional-features': '^2.2.0',
        ...deps
      }
    },
    env: {
      ENABLE_COMPAT_BUILD: true
    },
    files: {
      'ember-cli-build.cjs': emberCliBuildJS(),
      'config/optional-features.json': JSON.stringify({
        'application-template-wrapper': false,
        'default-async-observers': true,
        'jquery-integration': false,
        'template-only-glimmer-components': true,
        'no-implicit-route-model': true
      })
    }
  };
}
