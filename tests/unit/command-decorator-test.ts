import { action } from '@ember/object';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import { command, commandFor } from '#src';
import { setOwner } from '#src/-private/-owner';
import CounterDecrementCommand from '#tests/app/components/command-demo/counter-decrement-command';
import CounterIncrementCommand from '#tests/app/components/command-demo/counter-increment-command';
import CounterService from '#tests/app/services/counter';
import { getOwner } from '#tests/helpers';

class CommandAggregator {
  @command inc = commandFor(new CounterIncrementCommand());

  @command
  get dec() {
    return commandFor(new CounterDecrementCommand());
  }

  @command noop = undefined;

  @command
  get npe() {
    return;
  }

  @action
  runInc() {
    void this.inc();
  }

  runDec = () => {
    void this.dec();
  };
}

module('Unit | @command decorator', function (hooks) {
  setupTest(hooks);

  test('it works with property', function (assert) {
    const aggregator = new CommandAggregator();

    setOwner(aggregator, getOwner());

    assert.ok(aggregator.inc);
  });

  test('it works with getter', function (assert) {
    const aggregator = new CommandAggregator();

    setOwner(aggregator, getOwner());

    assert.ok(aggregator.dec);
  });

  test('it works with @action', function (assert) {
    getOwner().register('service:counter', CounterService);

    const counter = getOwner().lookup('service:counter');
    const aggregator = new CommandAggregator();

    setOwner(aggregator, getOwner());

    assert.strictEqual(counter.counter, 0);
    aggregator.runInc();

    assert.strictEqual(counter.counter, 1);
  });

  test('it works with undefined property', function (assert) {
    const aggregator = new CommandAggregator();

    setOwner(aggregator, getOwner());

    assert.strictEqual(aggregator.noop, undefined);
  });

  test('it works with undefined getter', function (assert) {
    const aggregator = new CommandAggregator();

    setOwner(aggregator, getOwner());

    assert.strictEqual(aggregator.npe, undefined);
  });
});
