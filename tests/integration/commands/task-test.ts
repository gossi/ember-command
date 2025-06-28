import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import { arrangeCommand } from '#test-support';
import TaskCommand from '#tests/commands/task-command';

module('Integration | Command | Task', function (hooks) {
  setupTest(hooks);

  test('it waits for change', async (assert) => {
    const bag = {
      carry: false
    };

    assert.notOk(bag.carry);

    const cmd = arrangeCommand(new TaskCommand(bag));

    await cmd.execute();

    assert.ok(bag.carry);
  });
});
