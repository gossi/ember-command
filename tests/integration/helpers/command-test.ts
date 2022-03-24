import {
  click,
  render,
  TestContext as BaseTestContext
} from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

import Route from '@ember/routing/route';

import { hbs } from 'ember-cli-htmlbars';
import { LinkCommand } from 'ember-command';
import { Commandable } from 'ember-command/-private/commandables';
import { prepareCommandable } from 'ember-command/test-support';
import { linkFor, setupLink, TestLink } from 'ember-link/test-support';

import sinon, { SinonSpy } from 'sinon';

import FooBarLogCommand from 'dummy/components/command-demo/foobar-log-command';
import PushLogCommand from 'dummy/components/command-demo/push-log-command';

interface TestContext extends BaseTestContext {
  command: Commandable;
  commandA: Commandable;
  commandB: Commandable;
  link: TestLink;
}

module('Integration | Helper | command', function (hooks) {
  setupRenderingTest(hooks);
  setupLink(hooks);

  test('it renders for a function', async function (this: TestContext, assert) {
    this.command = sinon.spy();
    await render(hbs`<CommandElement @command={{command this.command}}/>`);

    assert.dom('[data-test-commander]').hasTagName('button');
    assert.dom('[data-test-commander]').hasAttribute('type');
    assert.dom('[data-test-commander]').doesNotHaveAttribute('href');
  });

  test('it renders for a link', async function (this: TestContext, assert) {
    this.owner.register('route:test-route', class extends Route {});
    await render(
      hbs`<CommandElement @command={{command (link "test-route")}}/>`
    );

    assert.dom('[data-test-commander]').hasTagName('a');
    assert.dom('[data-test-commander]').hasAttribute('href');

    this.link = linkFor('test-route');
    await render(hbs`<CommandElement @command={{this.link}}/>`);
    assert.dom('[data-test-commander]').hasTagName('a');
    assert.dom('[data-test-commander]').hasAttribute('href');
  });

  test('it renders for a command', async function (this: TestContext, assert) {
    this.command = prepareCommandable(this, new PushLogCommand());
    await render(hbs`<CommandElement @command={{command this.command}}/>`);

    assert.dom('[data-test-commander]').hasTagName('button');
    assert.dom('[data-test-commander]').hasAttribute('type');
    assert.dom('[data-test-commander]').doesNotHaveAttribute('href');
  });

  test('it renders for a link command', async function (this: TestContext, assert) {
    this.owner.register('route:test-route', class extends Route {});
    this.command = prepareCommandable(
      this,
      new LinkCommand({ route: 'test-route' })
    );
    await render(hbs`<CommandElement @command={{command this.command}}/>`);

    assert.dom('[data-test-commander]').hasTagName('a');
    assert.dom('[data-test-commander]').hasAttribute('href');
  });

  // compounds

  test('it renders for compound command', async function (this: TestContext, assert) {
    this.commandA = prepareCommandable(this, new PushLogCommand());
    this.commandB = prepareCommandable(this, new FooBarLogCommand());
    await render(
      hbs`<CommandElement @command={{command this.commandA this.commandB}}/>`
    );

    assert.dom('[data-test-commander]').hasTagName('button');
    assert.dom('[data-test-commander]').hasAttribute('type');
    assert.dom('[data-test-commander]').doesNotHaveAttribute('href');
  });

  test('it renders for compound link', async function (this: TestContext, assert) {
    this.owner.register('route:test-route', class extends Route {});
    this.owner.register('route:test-route2', class extends Route {});
    this.commandA = prepareCommandable(
      this,
      new LinkCommand({ route: 'test-route' })
    );
    this.commandB = prepareCommandable(
      this,
      new LinkCommand({ route: 'test-route2' })
    );
    await render(
      hbs`<CommandElement @command={{command this.commandA this.commandB}}/>`
    );

    assert.dom('[data-test-commander]').hasTagName('a');
    assert.dom('[data-test-commander]').hasAttribute('href');
  });

  test('it renders for compound command + link', async function (this: TestContext, assert) {
    this.owner.register('route:test-route', class extends Route {});
    this.commandA = prepareCommandable(
      this,
      new LinkCommand({ route: 'test-route' })
    );
    this.commandB = prepareCommandable(this, new FooBarLogCommand());
    await render(
      hbs`<CommandElement @command={{command this.commandA this.commandB}}/>`
    );

    assert.dom('[data-test-commander]').hasTagName('a');
    assert.dom('[data-test-commander]').hasAttribute('href');

    this.commandA = prepareCommandable(this, linkFor('test-route'));
    this.commandB = prepareCommandable(this, new FooBarLogCommand());

    await render(
      hbs`<CommandElement @command={{command this.commandA this.commandB}}/>`
    );

    assert.dom('[data-test-commander]').hasTagName('a');
    assert.dom('[data-test-commander]').hasAttribute('href');
  });

  // invoke
  test('invoke function', async function (this: TestContext, assert) {
    this.command = sinon.spy();
    await render(hbs`<CommandElement @command={{command this.command}}/>`);

    await click('[data-test-commander]');
    assert.ok((this.command as SinonSpy).calledOnce);

    this.commandA = prepareCommandable(this, new PushLogCommand());
    this.commandB = prepareCommandable(this, new FooBarLogCommand());
    await render(
      hbs`<CommandElement @command={{command this.commandA this.commandB}}/>`
    );

    assert.dom('[data-test-commander]').hasTagName('button');
    assert.dom('[data-test-commander]').hasAttribute('type');
    assert.dom('[data-test-commander]').doesNotHaveAttribute('href');
  });

  test('invoke command', async function (this: TestContext, assert) {
    const foo = new FooBarLogCommand();
    const stub = sinon.stub(foo, 'execute');
    this.command = prepareCommandable(this, foo);
    await render(hbs`<CommandElement @command={{command this.command}}/>`);

    await click('[data-test-commander]');
    assert.ok(stub.calledOnce);
  });

  test('invoke link', async function (this: TestContext, assert) {
    this.link = linkFor('some.route');
    this.link.onTransitionTo = () => {
      assert.step('link clicked');
    };
    await render(hbs`<CommandElement @command={{command this.link}}/>`);

    await click('[data-test-commander]');
    assert.verifySteps(['link clicked']);
  });
});
