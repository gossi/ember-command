import { type TestContext } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import { arrangeCommand } from 'ember-command/test-support';

import TaskCommand from './task-command';

module('Integration | Command | Task', function (hooks) {
  setupTest(hooks);

  test('it waits for change', async function (this: TestContext, assert) {
    const bag = {
      carry: false
    };

    assert.notOk(bag.carry);

    const cmd = arrangeCommand(new TaskCommand(bag));

    await cmd.execute();

    assert.ok(bag.carry);
  });
});
