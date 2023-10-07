# Testing

As commands are isolated and self-containing a business logic, we can write for
this. There are integration tests, to test the commands itself and you can use
instances of commands to test your UIs

## Integration Tests

At first the `TrackingCommand` as a subject we want to test:

```ts
import { service } from '@ember/service';
import { Command } from 'ember-command';
import type TrackingService from '<your-app>/services/tracking';

export default class TrackCommand extends Command {
  @service declare tracking: TrackingService;

  execute(event: string, data?: unknown): void {
    this.tracking.track(event, data);
  }
}
```

Let's test the tracking command using
[`ember-sinon-qunit`](https://github.com/elwayman02/ember-sinon-qunit) to stub
the `tracking` service:

```ts
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

import { arrangeCommand } from 'ember-command/test-support';
import { TestContext } from 'ember-test-helpers';

import sinon from 'sinon';

import TrackingCommand from '<somewhere-in-your-module>';

module('Integration | Command | TrackingCommand', function (hooks) {
  setupTest(hooks);

  test('it tracks', async function (this: TestContext, assert) {
    this.owner.register('service:tracking', TrackingService);
    const trackingService = this.owner.lookup('service:tracking');

    const stub = sinon.stub(trackingService, 'track');
    const cmd = arrangeCommand(new TrackingCommand());

    cmd.execute('hello');

    assert.ok(stub.calledOnceWith('hello'));
  });
});
```

The `arrangeCommand` is the testing equivalent to the `@command` decorator to
attach the owner and wires up dependency injection.

## Rendering Tests

When your components accept commands as arguments, here is how to test them:

```gts
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

import { arrangeCommandInstance } from 'ember-command/test-support';
import { TestContext } from 'ember-test-helpers';

import sinon from 'sinon';

import TrackingCommand from '<somewhere-in-your-module>';
import YourComponnent from '<somewhere-in-your-module>';

module('Rendering | YourComponent', function (hooks) {
  setupTest(hooks);

  test('it triggers a @cmd', async function (this: TestContext, assert) {
    const cmd = arrangeCommandInstance(new TrackingCommand());
    const stub = sinon.stub(cmd, 'execute');

    await render(
      <template>
        <YourComponent @command={{cmd}}/>
      </template>
    );

    await click('button');

    assert.ok(stub.calledOnce);
  });
});
```
