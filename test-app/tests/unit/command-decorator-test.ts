import { action } from '@ember/object';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import { command, commandFor } from 'ember-command';
import CounterDecrementCommand from 'test-app/components/command-demo/counter-decrement-command';
import CounterIncrementCommand from 'test-app/components/command-demo/counter-increment-command';

import { setOwner } from '../-owner';

class CommandAggregator {
  @command inc = commandFor(new CounterIncrementCommand());

  @command
  get dec() {
    return commandFor(new CounterDecrementCommand());
  }

  @command noop = undefined;

  @command
  get npe() {
    return undefined;
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

  test('it works with @action', function (assert) {
    // eslint-disable-next-line @typescript-eslint/no-invalid-this
    const counter = this.owner.lookup('service:counter');
    const aggregator = new CommandAggregator();

    // eslint-disable-next-line @typescript-eslint/no-invalid-this
    setOwner(aggregator, this.owner);

    assert.strictEqual(counter.counter, 0);
    aggregator.runInc();

    assert.strictEqual(counter.counter, 1);
  });

  test('it works with undefined property', function (assert) {
    const aggregator = new CommandAggregator();

    // eslint-disable-next-line @typescript-eslint/no-invalid-this
    setOwner(aggregator, this.owner);

    assert.strictEqual(aggregator.noop, undefined);
  });

  test('it works with undefined getter', function (assert) {
    const aggregator = new CommandAggregator();

    // eslint-disable-next-line @typescript-eslint/no-invalid-this
    setOwner(aggregator, this.owner);

    assert.strictEqual(aggregator.npe, undefined);
  });
});
