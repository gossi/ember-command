import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import sinon from 'sinon';

import { arrangeCommand } from '#test-support';
import FooBarLogCommand from '#tests/app/components/command-demo/foobar-log-command';

module('Integration | Command | FooBar', function (hooks) {
  setupTest(hooks);

  test('it logs "foobar"', (assert) => {
    const stub = sinon.stub(console, 'log');
    const cmd = arrangeCommand(new FooBarLogCommand());

    cmd.execute();

    assert.ok(stub.calledOnceWith('foobar'));
  });
});
