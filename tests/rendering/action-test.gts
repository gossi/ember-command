import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { click, render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import { action, command } from '#src';
import CounterService from '#tests/app/services/counter.ts';
import { getOwner } from '#tests/helpers';

import type { TOC } from '@ember/component/template-only';

const inc = action(({ services }) => {
  return (amount: number) => {
    services.counter.counter += amount;
  };
});

const incOne = action(({ services }) => {
  return () => {
    services.counter.counter += 1;
  };
});

interface StepSignature {
  Element: HTMLButtonElement;
  Args: { push: (amount: number) => void; inc: number };
  Blocks: {
    default: [];
  };
}

const Step: TOC<StepSignature> = <template>
  <button type="button" {{on "click" (fn @push @inc)}}>{{yield}}</button>
</template>;

module('Rendering | action', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(() => {
    getOwner().register('service:counter', CounterService);
  });

  module('(action)', function () {
    test('plain invocation', async (assert) => {
      const counter = getOwner().lookup('service:counter');

      await render(
        <template>
          <button type="button" {{on "click" (incOne)}}>Inc</button>
        </template>
      );

      assert.strictEqual(counter.counter, 0, 'Counter is 0');

      await click('button');

      assert.strictEqual(counter.counter, 1, 'Counter is 1');
    });

    test('with parameters', async (assert) => {
      const counter = getOwner().lookup('service:counter');

      await render(
        <template>
          <Step @inc={{10}} @push={{(inc)}}>Inc</Step>
        </template>
      );

      assert.strictEqual(counter.counter, 0, 'Counter is 0');

      await click('button');

      assert.strictEqual(counter.counter, 10, 'Counter is 10');
    });
  });

  module('(fn (action))', function () {
    test('plain invocation', async (assert) => {
      const counter = getOwner().lookup('service:counter');

      await render(
        <template>
          <button type="button" {{on "click" (fn (incOne))}}>Inc</button>
        </template>
      );

      assert.strictEqual(counter.counter, 0, 'Counter is 0');

      await click('button');

      assert.strictEqual(counter.counter, 1, 'Counter is 1');
    });

    test('curried with (fn)', async (assert) => {
      const counter = getOwner().lookup('service:counter');

      await render(
        <template>
          <button type="button" {{on "click" (fn (inc) 10)}}>Inc</button>
        </template>
      );

      assert.strictEqual(counter.counter, 0, 'Counter is 0');

      await click('button');

      assert.strictEqual(counter.counter, 10, 'Counter is 10');
    });

    test('with parameters', async (assert) => {
      const counter = getOwner().lookup('service:counter');

      await render(
        <template>
          <Step @inc={{10}} @push={{(inc)}}>Inc</Step>
        </template>
      );

      assert.strictEqual(counter.counter, 0, 'Counter is 0');

      await click('button');

      assert.strictEqual(counter.counter, 10, 'Counter is 10');
    });
  });

  module('(command action)', function () {
    test('plain invocation', async (assert) => {
      const counter = getOwner().lookup('service:counter');

      await render(
        <template>
          <button type="button" {{on "click" (command incOne)}}>Inc</button>
        </template>
      );

      assert.strictEqual(counter.counter, 0, 'Counter is 0');

      await click('button');

      assert.strictEqual(counter.counter, 1, 'Counter is 1');
    });

    test('curried invocation', async (assert) => {
      const counter = getOwner().lookup('service:counter');

      await render(
        <template>
          <button type="button" {{on "click" (command (fn (inc) 10))}}>Inc</button>
        </template>
      );

      assert.strictEqual(counter.counter, 0, 'Counter is 0');

      await click('button');

      assert.strictEqual(counter.counter, 10, 'Counter is 10');
    });

    test('with parameters', async (assert) => {
      const counter = getOwner().lookup('service:counter');

      await render(
        <template>
          <Step @inc={{10}} @push={{command inc}}>Inc</Step>
        </template>
      );

      assert.strictEqual(counter.counter, 0, 'Counter is 0');

      await click('button');

      assert.strictEqual(counter.counter, 10, 'Counter is 10');
    });
  });
});
