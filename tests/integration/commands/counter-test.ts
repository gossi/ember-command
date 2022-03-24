import { TestContext } from '@ember/test-helpers';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

import { prepareCommand } from 'ember-command/test-support';

import CounterDecrementCommand from 'dummy/components/command-demo/counter-decrement-command';
import CounterIncrementCommand from 'dummy/components/command-demo/counter-increment-command';
import CounterService from 'dummy/services/counter';

module('Integration | Command | Counter', function (hooks) {
  setupTest(hooks);

  test('it in- and decrements', async function (this: TestContext, assert) {
    this.owner.register('service:counter', CounterService);
    const counterService = this.owner.lookup('service:counter');

    assert.equal(counterService.counter, 0);
    const inc = prepareCommand(this, new CounterIncrementCommand());
    const dec = prepareCommand(this, new CounterDecrementCommand());

    inc.execute();
    assert.equal(counterService.counter, 1);

    dec.execute();
    assert.equal(counterService.counter, 0);

    dec.execute();
    assert.equal(counterService.counter, -1);

    inc.execute();
    assert.equal(counterService.counter, 0);
  });
});
