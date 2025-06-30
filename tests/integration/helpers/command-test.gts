import Route from '@ember/routing/route';
import { click, render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import sinon from 'sinon';

import { command, CommandElement, LinkCommand } from '#src';
import { arrangeCommand } from '#test-support';
import FooBarLogCommand from '#tests/app/components/command-demo/foobar-log-command';
import PushLogCommand from '#tests/app/components/command-demo/push-log-command';
import { getOwner } from '#tests/helpers';

import { linkFor, setupLink } from 'ember-link/test-support';

module('Integration | Helper | command', function (hooks) {
  setupRenderingTest(hooks);
  setupLink(hooks);

  test('it renders for a function', async (assert) => {
    const cmd = sinon.spy();

    await render(<template><CommandElement @command={{command cmd}} /></template>);

    assert.dom('[data-test-commander]').hasTagName('button');
    assert.dom('[data-test-commander]').hasAttribute('type');
    assert.dom('[data-test-commander]').doesNotHaveAttribute('href');
  });

  test('it renders for a link', async (assert) => {
    const link = linkFor('some.route');

    await render(<template><CommandElement @command={{command link}} /></template>);

    assert.dom('[data-test-commander]').hasTagName('a');
    assert.dom('[data-test-commander]').hasAttribute('href');

    await render(<template><CommandElement @command={{link}} /></template>);
    assert.dom('[data-test-commander]').hasTagName('a');
    assert.dom('[data-test-commander]').hasAttribute('href');
  });

  test('it renders for a command', async (assert) => {
    const cmd = arrangeCommand(new PushLogCommand());

    await render(<template><CommandElement @command={{command cmd}} /></template>);

    assert.dom('[data-test-commander]').hasTagName('button');
    assert.dom('[data-test-commander]').hasAttribute('type');
    assert.dom('[data-test-commander]').doesNotHaveAttribute('href');
  });

  test('it renders for a link command', async (assert) => {
    getOwner().register('route:test-route', class extends Route {});

    const cmd = arrangeCommand(new LinkCommand({ route: 'test-route' }));

    await render(<template><CommandElement @command={{command cmd}} /></template>);

    assert.dom('[data-test-commander]').hasTagName('a');
    assert.dom('[data-test-commander]').hasAttribute('href');
  });

  // compounds

  test('it renders for compound command', async (assert) => {
    const commandA = arrangeCommand(new PushLogCommand());
    const commandB = arrangeCommand(new FooBarLogCommand());

    await render(<template><CommandElement @command={{command commandA commandB}} /></template>);

    assert.dom('[data-test-commander]').hasTagName('button');
    assert.dom('[data-test-commander]').hasAttribute('type');
    assert.dom('[data-test-commander]').doesNotHaveAttribute('href');
  });

  test('it renders for compound link', async (assert) => {
    getOwner().register('route:test-route', class extends Route {});
    getOwner().register('route:test-route2', class extends Route {});

    const commandA = arrangeCommand(new LinkCommand({ route: 'test-route' }));
    const commandB = arrangeCommand(new LinkCommand({ route: 'test-route2' }));

    await render(<template><CommandElement @command={{command commandA commandB}} /></template>);

    assert.dom('[data-test-commander]').hasTagName('a');
    assert.dom('[data-test-commander]').hasAttribute('href');
  });

  test('it renders for compound command + link', async (assert) => {
    getOwner().register('route:test-route', class extends Route {});

    const commandA = arrangeCommand(new LinkCommand({ route: 'test-route' }));
    const commandB = arrangeCommand(new FooBarLogCommand());

    await render(<template><CommandElement @command={{command commandA commandB}} /></template>);

    assert.dom('[data-test-commander]').hasTagName('a');
    assert.dom('[data-test-commander]').hasAttribute('href');

    const commandC = arrangeCommand(linkFor('test-route'));
    const commandD = arrangeCommand(new FooBarLogCommand());

    await render(<template><CommandElement @command={{command commandC commandD}} /></template>);

    assert.dom('[data-test-commander]').hasTagName('a');
    assert.dom('[data-test-commander]').hasAttribute('href');
  });

  // invoke
  test('invoke function', async (assert) => {
    const cmd = sinon.spy();

    await render(<template><CommandElement @command={{command cmd}} /></template>);

    await click('[data-test-commander]');
    assert.ok(cmd.calledOnce);

    const commandA = arrangeCommand(new PushLogCommand());
    const commandB = arrangeCommand(new FooBarLogCommand());

    await render(<template><CommandElement @command={{command commandA commandB}} /></template>);

    assert.dom('[data-test-commander]').hasTagName('button');
    assert.dom('[data-test-commander]').hasAttribute('type');
    assert.dom('[data-test-commander]').doesNotHaveAttribute('href');
  });

  test('invoke command', async (assert) => {
    const foo = new FooBarLogCommand();
    const stub = sinon.stub(foo, 'execute');

    const cmd = arrangeCommand(foo);

    await render(<template><CommandElement @command={{command cmd}} /></template>);

    await click('[data-test-commander]');
    assert.ok(stub.calledOnce);
  });

  test('invoke link', async (assert) => {
    const link = linkFor('some.route');

    link.onTransitionTo = () => {
      assert.step('link clicked');
    };

    await render(<template><CommandElement @command={{command link}} /></template>);

    await click('[data-test-commander]');
    assert.verifySteps(['link clicked']);
  });
});
