import Route from '@ember/routing/route';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import { LinkCommand } from 'ember-command';
import { arrangeCommandInstance } from 'ember-command/test-support';
import { linkFor, setupLink } from 'ember-link/test-support';
import sinon from 'sinon';
import FooBarLogCommand from 'test-app/components/command-demo/foobar-log-command';
import PushLogCommand from 'test-app/components/command-demo/push-log-command';

import type { TestContext as BaseTestContext } from '@ember/test-helpers';
import type { CommandAction } from 'ember-command';
import type LinkManagerService from 'ember-link/services/link-manager';
import type { TestLink } from 'ember-link/test-support';
import type { SinonSpy } from 'sinon';

interface TestContext extends BaseTestContext {
  command: CommandAction;
  link: TestLink;
}

module('Rendering | Component | <CommandElement>', function (hooks) {
  setupRenderingTest(hooks);
  setupLink(hooks);

  test('it renders "blank"', async function (assert) {
    await render(hbs`<CommandElement/>`);

    assert.dom('[data-test-commander]').hasTagName('span');
    assert.dom('[data-test-commander]').doesNotHaveAttribute('type');
  });

  test('it renders @element', async function (assert) {
    await render(hbs`<CommandElement @element={{element "abbr"}}/>`);

    assert.dom('[data-test-commander]').hasTagName('abbr');
    assert.dom('[data-test-commander]').doesNotHaveAttribute('type');
  });

  test('it renders for a function', async function (this: TestContext, assert) {
    this.command = sinon.spy();
    await render(hbs`<CommandElement @command={{this.command}}/>`);

    assert.dom('[data-test-commander]').hasTagName('button');
    assert.dom('[data-test-commander]').hasAttribute('type');
    assert.dom('[data-test-commander]').doesNotHaveAttribute('href');
  });

  test('it renders for a link', async function (this: TestContext, assert) {
    this.owner.register('route:test-route', class extends Route {});

    const linkService = this.owner.lookup('service:link-manager') as LinkManagerService;

    this.command = linkService.createLink({
      route: 'test-route'
    });

    await render(hbs`<CommandElement @command={{this.command}}/>`);

    assert.dom('[data-test-commander]').hasTagName('a');
    assert.dom('[data-test-commander]').doesNotHaveAttribute('type');
    assert.dom('[data-test-commander]').hasAttribute('href');

    this.link = linkFor('test-route');
    await render(hbs`<CommandElement @command={{this.link}}/>`);
    assert.dom('[data-test-commander]').hasTagName('a');
    assert.dom('[data-test-commander]').doesNotHaveAttribute('type');
    assert.dom('[data-test-commander]').hasAttribute('href');
  });

  test('it renders for a command', async function (this: TestContext, assert) {
    this.command = arrangeCommandInstance(new PushLogCommand());
    await render(hbs`<CommandElement @command={{this.command}}/>`);

    assert.dom('[data-test-commander]').hasTagName('button');
    assert.dom('[data-test-commander]').hasAttribute('type');
    assert.dom('[data-test-commander]').doesNotHaveAttribute('href');
  });

  test('it renders for a link command', async function (this: TestContext, assert) {
    this.owner.register('route:test-route', class extends Route {});
    this.command = arrangeCommandInstance(new LinkCommand({ route: 'test-route' }));

    await render(hbs`<CommandElement @command={{this.command}}/>`);

    assert.dom('[data-test-commander]').hasTagName('a');
    assert.dom('[data-test-commander]').hasAttribute('href');
  });

  // compounds

  test('it renders for compound command', async function (this: TestContext, assert) {
    this.command = arrangeCommandInstance([new PushLogCommand(), new FooBarLogCommand()]);
    await render(hbs`<CommandElement @command={{this.command}}/>`);

    assert.dom('[data-test-commander]').hasTagName('button');
    assert.dom('[data-test-commander]').hasAttribute('type');
    assert.dom('[data-test-commander]').doesNotHaveAttribute('href');
  });

  test('it renders for compound link', async function (this: TestContext, assert) {
    this.owner.register('route:test-route', class extends Route {});
    this.owner.register('route:test-route2', class extends Route {});
    this.command = arrangeCommandInstance([
      new LinkCommand({ route: 'test-route' }),
      new LinkCommand({ route: 'test-route2' })
    ]);
    await render(hbs`<CommandElement @command={{this.command}}/>`);

    assert.dom('[data-test-commander]').hasTagName('a');
    assert.dom('[data-test-commander]').hasAttribute('href');
  });

  test('it renders for compound command + link', async function (this: TestContext, assert) {
    this.owner.register('route:test-route', class extends Route {});
    this.command = arrangeCommandInstance([
      new LinkCommand({ route: 'test-route' }),
      new FooBarLogCommand()
    ]);
    await render(hbs`<CommandElement @command={{this.command}}/>`);

    assert.dom('[data-test-commander]').hasTagName('a');
    assert.dom('[data-test-commander]').hasAttribute('href');

    this.command = arrangeCommandInstance([linkFor('test-route'), new FooBarLogCommand()]);
    await render(hbs`<CommandElement @command={{this.command}}/>`);

    assert.dom('[data-test-commander]').hasTagName('a');
    assert.dom('[data-test-commander]').hasAttribute('href');
  });

  // invoke
  test('invoke function', async function (this: TestContext, assert) {
    this.command = sinon.spy();
    await render(hbs`<CommandElement @command={{this.command}}/>`);

    await click('[data-test-commander]');
    assert.ok((this.command as SinonSpy).calledOnce);

    this.command = arrangeCommandInstance([new PushLogCommand(), new FooBarLogCommand()]);
    await render(hbs`<CommandElement @command={{this.command}}/>`);

    assert.dom('[data-test-commander]').hasTagName('button');
    assert.dom('[data-test-commander]').hasAttribute('type');
    assert.dom('[data-test-commander]').doesNotHaveAttribute('href');
  });

  test('invoke command', async function (this: TestContext, assert) {
    const foo = new FooBarLogCommand();
    const stub = sinon.stub(foo, 'execute');

    this.command = arrangeCommandInstance(foo);
    await render(hbs`<CommandElement @command={{this.command}}/>`);

    await click('[data-test-commander]');
    assert.ok(stub.calledOnce);
  });

  test('invoke link', async function (this: TestContext, assert) {
    this.link = linkFor('some.route');

    this.link.onTransitionTo = () => {
      assert.step('link clicked');
    };

    await render(hbs`<CommandElement @command={{this.link}}/>`);

    await click('[data-test-commander]');
    assert.verifySteps(['link clicked']);
  });
});
