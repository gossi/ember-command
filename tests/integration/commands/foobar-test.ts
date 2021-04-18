import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

import { prepareCommand } from 'ember-command/test-support';
import { TestContext } from 'ember-test-helpers';

import sinon from 'sinon';

import FooBarLogCommand from 'dummy/components/command-demo/foobar-log-command';

module('Integration | Command | FooBar', function (hooks) {
  setupTest(hooks);

  test('it logs "foobar"', async function (this: TestContext, assert) {
    const stub = sinon.stub(console, 'log');
    const cmd = prepareCommand(this, new FooBarLogCommand());

    cmd.execute();

    assert.ok(stub.calledOnceWith('foobar'));
  });
});
