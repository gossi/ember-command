import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import { arrangeCommand } from '#test-support';
import CounterDecrementCommand from '#tests/app/components/command-demo/counter-decrement-command';
import CounterIncrementCommand from '#tests/app/components/command-demo/counter-increment-command';
import CounterService from '#tests/app/services/counter';
import { getOwner } from '#tests/helpers';

module('Integration | Command | Counter', function (hooks) {
  setupTest(hooks);

  test('it in- and decrements', (assert) => {
    getOwner().register('service:counter', CounterService);

    const counterService = getOwner().lookup('service:counter');

    assert.strictEqual(counterService.counter, 0);

    const inc = arrangeCommand(new CounterIncrementCommand());
    const dec = arrangeCommand(new CounterDecrementCommand());

    inc.execute();
    assert.strictEqual(counterService.counter, 1);

    dec.execute();
    assert.strictEqual(counterService.counter, 0);

    dec.execute();
    assert.strictEqual(counterService.counter, -1);

    inc.execute();
    assert.strictEqual(counterService.counter, 0);
  });
});
