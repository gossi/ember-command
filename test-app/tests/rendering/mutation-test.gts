import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { click, render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import MutateAction from 'test-app/actions/mutate-action';

import { arrangeCommandInstance } from 'ember-command/test-support';

import type { TestContext } from '@ember/test-helpers';

module('Rendering | mutation', function (hooks) {
  setupRenderingTest(hooks);

  test('plain invocation', async function (this: TestContext, assert) {
    const obj = {};
    const changeset = { foo: 'bar' };
    const cmd = arrangeCommandInstance(new MutateAction());

    await render(
      <template>
        <button type='button' {{on 'click' (fn cmd obj changeset)}}>Inc</button>
      </template>
    );

    assert.notOk('foo' in obj);

    await click('button');

    assert.ok('foo' in obj);
  });
});
