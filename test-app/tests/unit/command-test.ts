import Route from '@ember/routing/route';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import { LinkCommand } from 'ember-command';
import { arrangeCommandInstance } from 'ember-command/test-support';
import { setupLink } from 'ember-link/test-support';

import type { TestContext } from '@ember/test-helpers';
import type { Link } from 'ember-link';
import type LinkManagerService from 'ember-link/services/link-manager';

module('Unit | Identify command instances', function (hooks) {
  setupTest(hooks);
  setupLink(hooks);

  test('a link is a link', function (this: TestContext, assert) {
    this.owner.register('route:test-route', class extends Route {});

    const linkService = this.owner.lookup('service:link-manager') as LinkManagerService;

    const link = linkService.createLink({
      route: 'test-route'
    }) as Link;

    const command = arrangeCommandInstance(link);

    assert.ok(command.link);
  });

  test('a link command is a link', function (this: TestContext, assert) {
    this.owner.register('route:test-route', class extends Route {});

    const command = arrangeCommandInstance(new LinkCommand({ route: 'test-route' }));

    assert.ok(command.link);
  });
});
