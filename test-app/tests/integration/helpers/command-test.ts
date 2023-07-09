import Route from '@ember/routing/route';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import { LinkCommand } from 'ember-command';
import { arrangeCommand } from 'ember-command/test-support';
import { linkFor, setupLink } from 'ember-link/test-support';
import sinon from 'sinon';
import FooBarLogCommand from 'test-app/components/command-demo/foobar-log-command';
import PushLogCommand from 'test-app/components/command-demo/push-log-command';

import type { TestContext as BaseTestContext } from '@ember/test-helpers';
import type { Commandable } from 'ember-command';
import { TestInstrumentedLinkManagerService, TestLink } from 'ember-link/test-support';
import type { SinonSpy } from 'sinon';
import { Link, LinkManagerService } from 'ember-link';

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
    this.link = linkFor('some.route');
    const service = this.owner.lookup('service:link-manager') as LinkManagerService;
    // this.link = new Link(service, { route: 'some-route' });
    console.log('T', this.link, this.link instanceof Link);

    // await render(hbs`<CommandElement @command={{command this.link}}/>`);

    // assert.dom('[data-test-commander]').hasTagName('a');
    // assert.dom('[data-test-commander]').hasAttribute('href');

    await render(hbs`<CommandElement @command={{this.link}}/>`);
    assert.dom('[data-test-commander]').hasTagName('a');
    assert.dom('[data-test-commander]').hasAttribute('href');
  });

  test('it renders for a command', async function (this: TestContext, assert) {
    this.command = arrangeCommand(new PushLogCommand());
    await render(hbs`<CommandElement @command={{command this.command}}/>`);

    assert.dom('[data-test-commander]').hasTagName('button');
    assert.dom('[data-test-commander]').hasAttribute('type');
    assert.dom('[data-test-commander]').doesNotHaveAttribute('href');
  });

  test('it renders for a link command', async function (this: TestContext, assert) {
    this.owner.register('route:test-route', class extends Route {});
    this.command = arrangeCommand(new LinkCommand({ route: 'test-route' }));
    await render(hbs`<CommandElement @command={{command this.command}}/>`);

    assert.dom('[data-test-commander]').hasTagName('a');
    assert.dom('[data-test-commander]').hasAttribute('href');
  });

  // compounds

  test('it renders for compound command', async function (this: TestContext, assert) {
    this.commandA = arrangeCommand(new PushLogCommand());
    this.commandB = arrangeCommand(new FooBarLogCommand());
    await render(hbs`<CommandElement @command={{command this.commandA this.commandB}}/>`);

    assert.dom('[data-test-commander]').hasTagName('button');
    assert.dom('[data-test-commander]').hasAttribute('type');
    assert.dom('[data-test-commander]').doesNotHaveAttribute('href');
  });

  test('it renders for compound link', async function (this: TestContext, assert) {
    this.owner.register('route:test-route', class extends Route {});
    this.owner.register('route:test-route2', class extends Route {});
    this.commandA = arrangeCommand(new LinkCommand({ route: 'test-route' }));
    this.commandB = arrangeCommand(new LinkCommand({ route: 'test-route2' }));
    await render(hbs`<CommandElement @command={{command this.commandA this.commandB}}/>`);

    assert.dom('[data-test-commander]').hasTagName('a');
    assert.dom('[data-test-commander]').hasAttribute('href');
  });

  test('it renders for compound command + link', async function (this: TestContext, assert) {
    this.owner.register('route:test-route', class extends Route {});
    this.commandA = arrangeCommand(new LinkCommand({ route: 'test-route' }));
    this.commandB = arrangeCommand(new FooBarLogCommand());
    await render(hbs`<CommandElement @command={{command this.commandA this.commandB}}/>`);

    assert.dom('[data-test-commander]').hasTagName('a');
    assert.dom('[data-test-commander]').hasAttribute('href');

    this.commandA = arrangeCommand(linkFor('test-route'));
    this.commandB = arrangeCommand(new FooBarLogCommand());

    await render(hbs`<CommandElement @command={{command this.commandA this.commandB}}/>`);

    assert.dom('[data-test-commander]').hasTagName('a');
    assert.dom('[data-test-commander]').hasAttribute('href');
  });

  // invoke
  test('invoke function', async function (this: TestContext, assert) {
    this.command = sinon.spy();
    await render(hbs`<CommandElement @command={{command this.command}}/>`);

    await click('[data-test-commander]');
    assert.ok((this.command as SinonSpy).calledOnce);

    this.commandA = arrangeCommand(new PushLogCommand());
    this.commandB = arrangeCommand(new FooBarLogCommand());
    await render(hbs`<CommandElement @command={{command this.commandA this.commandB}}/>`);

    assert.dom('[data-test-commander]').hasTagName('button');
    assert.dom('[data-test-commander]').hasAttribute('type');
    assert.dom('[data-test-commander]').doesNotHaveAttribute('href');
  });

  test('invoke command', async function (this: TestContext, assert) {
    const foo = new FooBarLogCommand();
    const stub = sinon.stub(foo, 'execute');

    this.command = arrangeCommand(foo);
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
