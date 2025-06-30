import { tracked } from '@glimmer/tracking';
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { click, render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import { command, commandFor } from '#src';
import { arrangeCommandInstance } from '#test-support';
import MutateAction from '#tests/app/actions/mutate-action';
import TaskCommand from '#tests/commands/task-command';

module('Rendering | mutation', function (hooks) {
  setupRenderingTest(hooks);

  test('plain invocation', async (assert) => {
    const obj = {};
    const changeset = { foo: 'bar' };
    const cmd = arrangeCommandInstance(new MutateAction());

    await render(
      <template>
        <button type="button" {{on "click" (fn cmd obj changeset)}}>Inc</button>
      </template>
    );

    assert.notOk('foo' in obj);

    await click('button');

    assert.ok('foo' in obj);
  });

  test('change @tracked', async (assert) => {
    class Comp {
      @tracked carried = false;

      bag = {
        carry: false
      };

      @command task = commandFor(new TaskCommand(this.bag));

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      @command run = commandFor(this.runTask);

      runTask = async () => {
        await this.task();

        this.carried = this.bag.carry;
      };
    }

    const comp = new Comp();

    await render(
      <template>
        <button type="button" {{on "click" comp.run}}>Inc</button>

        {{#if comp.carried}}
          <span>I'm the carry</span>
        {{/if}}
      </template>
    );

    assert.notOk(comp.bag.carry);
    assert.dom('span').doesNotExist();

    await click('button');

    assert.ok(comp.bag.carry);
    assert.dom('span').exists();
  });
});
