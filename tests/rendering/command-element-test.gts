import Route from '@ember/routing/route';
import { click, render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import { element } from 'ember-element-helper';
import sinon from 'sinon';

import { CommandElement, LinkCommand } from '#src';
import { arrangeCommandInstance } from '#test-support';
import FooBarLogCommand from '#tests/app/components/command-demo/foobar-log-command';
import PushLogCommand from '#tests/app/components/command-demo/push-log-command';
import { getOwner } from '#tests/helpers';

import { linkFor, setupLink } from 'ember-link/test-support';

module('Rendering | Component | <CommandElement>', function (hooks) {
  setupRenderingTest(hooks);
  setupLink(hooks);

  test('it renders "blank"', async (assert) => {
    await render(<template><CommandElement /></template>);

    assert.dom('[data-test-commander]').hasTagName('span');
    assert.dom('[data-test-commander]').doesNotHaveAttribute('type');
  });

  test('it renders @element', async (assert) => {
    await render(
      <template>
        {{! @glint-expect-error }}
        <CommandElement @element={{element "abbr"}} />
      </template>
    );

    assert.dom('[data-test-commander]').hasTagName('abbr');
    assert.dom('[data-test-commander]').doesNotHaveAttribute('type');
  });

  test('it renders for a function', async (assert) => {
    const cmd = sinon.spy();

    await render(<template><CommandElement @command={{cmd}} /></template>);

    assert.dom('[data-test-commander]').hasTagName('button');
    assert.dom('[data-test-commander]').hasAttribute('type');
    assert.dom('[data-test-commander]').doesNotHaveAttribute('href');
  });

  test('it renders for a link', async (assert) => {
    getOwner().register('route:test-route', class extends Route {});

    const linkService = getOwner().lookup('service:link-manager');

    const cmd = linkService.createLink({
      route: 'test-route'
    });

    await render(<template><CommandElement @command={{cmd}} /></template>);

    assert.dom('[data-test-commander]').hasTagName('a');
    assert.dom('[data-test-commander]').doesNotHaveAttribute('type');
    assert.dom('[data-test-commander]').hasAttribute('href');

    const link = linkFor('test-route');

    await render(<template><CommandElement @command={{link}} /></template>);
    assert.dom('[data-test-commander]').hasTagName('a');
    assert.dom('[data-test-commander]').doesNotHaveAttribute('type');
    assert.dom('[data-test-commander]').hasAttribute('href');
  });

  test('it renders for a command', async (assert) => {
    const cmd = arrangeCommandInstance(new PushLogCommand());

    await render(<template><CommandElement @command={{cmd}} /></template>);

    assert.dom('[data-test-commander]').hasTagName('button');
    assert.dom('[data-test-commander]').hasAttribute('type');
    assert.dom('[data-test-commander]').doesNotHaveAttribute('href');
  });

  test('it renders for a link command', async (assert) => {
    getOwner().register('route:test-route', class extends Route {});

    const cmd = arrangeCommandInstance(new LinkCommand({ route: 'test-route' }));

    await render(<template><CommandElement @command={{cmd}} /></template>);

    assert.dom('[data-test-commander]').hasTagName('a');
    assert.dom('[data-test-commander]').hasAttribute('href');
  });

  // compounds

  test('it renders for compound command', async (assert) => {
    const cmd = arrangeCommandInstance([new PushLogCommand(), new FooBarLogCommand()]);

    await render(<template><CommandElement @command={{cmd}} /></template>);

    assert.dom('[data-test-commander]').hasTagName('button');
    assert.dom('[data-test-commander]').hasAttribute('type');
    assert.dom('[data-test-commander]').doesNotHaveAttribute('href');
  });

  test('it renders for compound link', async (assert) => {
    getOwner().register('route:test-route', class extends Route {});
    getOwner().register('route:test-route2', class extends Route {});

    const cmd = arrangeCommandInstance([
      new LinkCommand({ route: 'test-route' }),
      new LinkCommand({ route: 'test-route2' })
    ]);

    await render(<template><CommandElement @command={{cmd}} /></template>);

    assert.dom('[data-test-commander]').hasTagName('a');
    assert.dom('[data-test-commander]').hasAttribute('href');
  });

  test('it renders for compound command + link', async (assert) => {
    getOwner().register('route:test-route', class extends Route {});

    const cmd = arrangeCommandInstance([
      new LinkCommand({ route: 'test-route' }),
      new FooBarLogCommand()
    ]);

    await render(<template><CommandElement @command={{cmd}} /></template>);

    assert.dom('[data-test-commander]').hasTagName('a');
    assert.dom('[data-test-commander]').hasAttribute('href');

    const compound = arrangeCommandInstance([linkFor('test-route'), new FooBarLogCommand()]);

    await render(<template><CommandElement @command={{compound}} /></template>);

    assert.dom('[data-test-commander]').hasTagName('a');
    assert.dom('[data-test-commander]').hasAttribute('href');
  });

  // invoke
  test('invoke function', async (assert) => {
    const cmd = sinon.spy();

    await render(<template><CommandElement @command={{cmd}} /></template>);

    await click('[data-test-commander]');
    assert.ok(cmd.calledOnce);

    const compound = arrangeCommandInstance([new PushLogCommand(), new FooBarLogCommand()]);

    await render(<template><CommandElement @command={{compound}} /></template>);

    assert.dom('[data-test-commander]').hasTagName('button');
    assert.dom('[data-test-commander]').hasAttribute('type');
    assert.dom('[data-test-commander]').doesNotHaveAttribute('href');
  });

  test('invoke command', async (assert) => {
    const foo = new FooBarLogCommand();
    const spy = sinon.spy();

    foo.execute = spy;

    const cmd = arrangeCommandInstance(foo);

    await render(<template><CommandElement @command={{cmd}} /></template>);

    await click('[data-test-commander]');
    assert.ok(spy.calledOnce);
  });

  test('invoke link', async (assert) => {
    const link = linkFor('some.route');

    link.onTransitionTo = () => {
      assert.step('link clicked');
    };

    await render(<template><CommandElement @command={{link}} /></template>);

    await click('[data-test-commander]');
    assert.verifySteps(['link clicked']);
  });
});
