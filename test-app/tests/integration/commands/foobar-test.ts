import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import sinon from 'sinon';
import FooBarLogCommand from 'test-app/components/command-demo/foobar-log-command';

import { arrangeCommand } from 'ember-command/test-support';

import type { TestContext } from '@ember/test-helpers';

module('Integration | Command | FooBar', function (hooks) {
  setupTest(hooks);

  test('it logs "foobar"', function (this: TestContext, assert) {
    const stub = sinon.stub(console, 'log');
    const cmd = arrangeCommand(new FooBarLogCommand());

    cmd.execute();

    assert.ok(stub.calledOnceWith('foobar'));
  });
});
