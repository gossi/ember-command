import Route from '@ember/routing/route';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import { LinkCommand } from '#src';
import { arrangeCommand, arrangeCommandInstance } from '#test-support';
import { getOwner } from '#tests/helpers';

import { setupLink } from 'ember-link/test-support';

module('Unit | Identify command instances', function (hooks) {
  setupTest(hooks);
  setupLink(hooks);

  test('a link is a link', (assert) => {
    getOwner().register('route:test-route', class extends Route {});

    const linkService = getOwner().lookup('service:link-manager');

    const link = linkService.createLink({
      route: 'test-route'
    });

    const command = arrangeCommandInstance(link);

    assert.ok(command.link);
  });

  /**
   * This tests only exists because of:
   * https://github.com/gossi/ember-command/issues/23
   */
  test('a link command is a link', (assert) => {
    getOwner().register('route:test-route', class extends Route {});

    const command = arrangeCommand(new LinkCommand({ route: 'test-route' }));

    assert.ok(LinkCommand.isLinkCommand(command));
  });
});
