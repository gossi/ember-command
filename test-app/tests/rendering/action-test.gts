import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { click, render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import { action, command } from 'ember-command';

import type { TOC } from '@ember/component/template-only';
import type { TestContext } from '@ember/test-helpers';
import type CounterService from 'test-app/services/counter';

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
  Args: { push: (...args: unknown[]) => void; inc: number };
  Blocks: {
    default: [];
  };
}

// eslint-disable-next-line @typescript-eslint/naming-convention
const Step: TOC<StepSignature> = <template>
  <button type="button" {{on "click" (fn @push @inc)}}>{{yield}}</button>
</template>

module('Rendering | action', function (hooks) {
  setupRenderingTest(hooks);

  module('(action)', function () {
    test('plain invocation', async function (this: TestContext, assert) {
      const counter = this.owner.lookup('service:counter') as CounterService;

      await render(<template>
        <button type="button" {{on "click" (incOne)}}>Inc</button>
      </template>);

      assert.equal(counter.counter, 0, 'Counter is 0');

      await click('button');

      assert.equal(counter.counter, 1, 'Counter is 1');
    });

    test('curried invocation', async function (this: TestContext, assert) {
      const counter = this.owner.lookup('service:counter') as CounterService;

      await render(<template>
        <button type="button" {{on "click" (inc 10)}}>Inc</button>
      </template>);

      assert.equal(counter.counter, 0, 'Counter is 0');

      await click('button');

      assert.equal(counter.counter, 10, 'Counter is 10');
    });

    test('with parameters', async function (this: TestContext, assert) {
      const counter = this.owner.lookup('service:counter') as CounterService;

      await render(<template>
        <Step @inc={{10}} @push={{(inc)}}>Inc</Step>
      </template>);

      assert.equal(counter.counter, 0, 'Counter is 0');

      await click('button');

      assert.equal(counter.counter, 10, 'Counter is 10');
    });
  });

  module('(fn (action))', function () {
    test('plain invocation', async function (this: TestContext, assert) {
      const counter = this.owner.lookup('service:counter') as CounterService;

      await render(<template>
        <button type="button" {{on "click" (fn (incOne))}}>Inc</button>
      </template>);

      assert.equal(counter.counter, 0, 'Counter is 0');

      await click('button');

      assert.equal(counter.counter, 1, 'Counter is 1');
    });

    test('curried invocation', async function (this: TestContext, assert) {
      const counter = this.owner.lookup('service:counter') as CounterService;

      await render(<template>
        <button type="button" {{on "click" (fn (inc 10))}}>Inc</button>
      </template>);

      assert.equal(counter.counter, 0, 'Counter is 0');

      await click('button');

      assert.equal(counter.counter, 10, 'Counter is 10');
    });

    test('curried with (fn)', async function (this: TestContext, assert) {
      const counter = this.owner.lookup('service:counter') as CounterService;

      await render(<template>
        <button type="button" {{on "click" (fn (inc) 10)}}>Inc</button>
      </template>);

      assert.equal(counter.counter, 0, 'Counter is 0');

      await click('button');

      assert.equal(counter.counter, 10, 'Counter is 10');
    });

    test('with parameters', async function (this: TestContext, assert) {
      const counter = this.owner.lookup('service:counter') as CounterService;

      await render(<template>
        <Step @inc={{10}} @push={{(fn (inc))}}>Inc</Step>
      </template>);

      assert.equal(counter.counter, 0, 'Counter is 0');

      await click('button');

      assert.equal(counter.counter, 10, 'Counter is 10');
    });
  });

  module('(command action)', function () {
    test('plain invocation', async function (this: TestContext, assert) {
      const counter = this.owner.lookup('service:counter') as CounterService;

      await render(<template>
        <button type="button" {{on "click" (command incOne)}}>Inc</button>
      </template>);

      assert.equal(counter.counter, 0, 'Counter is 0');

      await click('button');

      assert.equal(counter.counter, 1, 'Counter is 1');
    });

    test('curried invocation', async function (this: TestContext, assert) {
      const counter = this.owner.lookup('service:counter') as CounterService;

      await render(<template>
        <button type="button" {{on "click" (command (inc 10))}}>Inc</button>
      </template>);

      assert.equal(counter.counter, 0, 'Counter is 0');

      await click('button');

      assert.equal(counter.counter, 10, 'Counter is 10');
    });

    test('with parameters', async function (this: TestContext, assert) {
      const counter = this.owner.lookup('service:counter') as CounterService;

      await render(<template>
        <Step @inc={{10}} @push={{command inc}}>Inc</Step>
      </template>);

      assert.equal(counter.counter, 0, 'Counter is 0');

      await click('button');

      assert.equal(counter.counter, 10, 'Counter is 10');
    });
  });
});
