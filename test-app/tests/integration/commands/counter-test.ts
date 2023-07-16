import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import CounterDecrementCommand from 'test-app/components/command-demo/counter-decrement-command';
import CounterIncrementCommand from 'test-app/components/command-demo/counter-increment-command';
import CounterService from 'test-app/services/counter';

import { arrangeCommand } from 'ember-command/test-support';

import type { TestContext } from '@ember/test-helpers';

module('Integration | Command | Counter', function (hooks) {
  setupTest(hooks);

  test('it in- and decrements', async function (this: TestContext, assert) {
    this.owner.register('service:counter', CounterService);

    const counterService = this.owner.lookup('service:counter') as CounterService;

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
