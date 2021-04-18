import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

import { hbs } from 'ember-cli-htmlbars';
import { Commandable } from 'ember-command/-private/commandables';
import { TestContext as BaseTestContext } from 'ember-test-helpers';

import sinon from 'sinon';

interface TestContext extends BaseTestContext {
  command: Commandable;
}

module('Rendering | Component | <Commander>', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders "blank"', async function (assert) {
    await render(hbs`<Commander/>`);

    assert.dom('[data-test-commander]').hasTagName('div');
  });

  test('it renders @element', async function (assert) {
    await render(hbs`<Commander @element={{element "abbr"}}/>`);

    assert.dom('[data-test-commander]').hasTagName('abbr');
  });

  test('it renders for a function command', async function (this: TestContext, assert) {
    this.command = sinon.spy();
    await render(hbs`<Commander @command={{this.command}}/>`);

    assert.dom('[data-test-commander]').hasTagName('button');
  });
});
