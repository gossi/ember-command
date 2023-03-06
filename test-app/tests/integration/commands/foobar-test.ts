import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import { prepareCommand } from 'ember-command/test-support';
import sinon from 'sinon';
import FooBarLogCommand from 'test-app/components/command-demo/foobar-log-command';

import type { TestContext } from '@ember/test-helpers';

module('Integration | Command | FooBar', function (hooks) {
  setupTest(hooks);

  test('it logs "foobar"', async function (this: TestContext, assert) {
    const stub = sinon.stub(console, 'log');
    const cmd = prepareCommand(this, new FooBarLogCommand());

    cmd.execute();

    assert.ok(stub.calledOnceWith('foobar'));
  });
});
