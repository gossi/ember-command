import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

import { setOwner } from '@ember/application';

import { command } from 'ember-command';

import CounterDecrementCommand from 'dummy/components/command-demo/counter-decrement-command';
import CounterIncrementCommand from 'dummy/components/command-demo/counter-increment-command';

class CommandAggregator {
  @command
  inc = new CounterIncrementCommand();

  @command
  get dec() {
    return new CounterDecrementCommand();
  }
}

module('Unit | @command decorator', function (hooks) {
  setupTest(hooks);

  test('it works with property', function (assert) {
    const aggregator = new CommandAggregator();
    // eslint-disable-next-line @typescript-eslint/no-invalid-this
    setOwner(aggregator, this.owner);

    assert.ok(aggregator.inc);
  });

  test('it works with getter', function (assert) {
    const aggregator = new CommandAggregator();
    // eslint-disable-next-line @typescript-eslint/no-invalid-this
    setOwner(aggregator, this.owner);

    assert.ok(aggregator.dec);
  });
});
