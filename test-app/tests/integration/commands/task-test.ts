import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import { prepareCommand } from 'ember-command/test-support';

import TaskCommand from './task-command';

import type { TestContext } from '@ember/test-helpers';

module('Integration | Command | Task', function (hooks) {
  setupTest(hooks);

  test('it waits for change', async function (this: TestContext, assert) {
    const bag = {
      carry: false
    };

    assert.notOk(bag.carry);

    const cmd = prepareCommand(this, new TaskCommand(bag));

    await cmd.execute();

    assert.ok(bag.carry);
  });
});
