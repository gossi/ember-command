import Helper from '@ember/component/helper';
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { getOwner } from '@ember/owner';
import { click, render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import { action, command } from 'ember-command';

import type CounterService from 'test-app/services/counter';

const inc = action(({ services }) => {
  console.log('factory called');

  return (amount: number) => {
    console.log('inc', amount);

    services.counter.counter += amount;
  };
});

const incOne = action(({ services }) => {
  console.log('factory called');

  return () => {
    console.log('inc');

    services.counter.counter += 1;
  };
});

// Invocation Styles:
//
// 1. (action)
//
// - `<button {{on "click" (incOne)}}>Inc</button>`
// - `<button {{on "click" (inc 10)}}>Inc</button>`
// - `<Step @inc={{10}} @push={{(inc)}}>Inc</Step>`
//
// 2. (fn (action))
//
// - `<button {{on "click" (fn (incOne))}}>Inc</button>`
// - `<button {{on "click" (fn (inc 10))}}>Inc</button>`
// - `<button {{on "click" (fn (inc) 10)}}>Inc</button>`
// - `<Step @inc={{10}} @push={{(fn (inc))}}>Inc</Step>`
//
// 3. (command action)
//
// - `<button {{on "click" (command incOne)}}>Inc</button>`
// - `<button {{on "click" (command (inc 10))}}>Inc</button>`
// - `<Step @inc={{10}} @push={{command inc}}>Inc</Step>`

module('Rendering | action', function (hooks) {
  setupRenderingTest(hooks);

  module('(action)', function () {
    test('plain invocation', async function (assert) {
      // eslint-disable-next-line @typescript-eslint/no-invalid-this
      const counter = this.owner.lookup('service:counter') as CounterService;

      await render(<template>
        <button {{on "click" (incOne)}}>Inc</button>
      </template>);

      assert.equal(counter.counter, 0, 'Counter is 0');

      await click('button');

      assert.equal(counter.counter, 1, 'Counter is 1');
    });

    test('curried invocation', async function (assert) {
      // eslint-disable-next-line @typescript-eslint/no-invalid-this
      const counter = this.owner.lookup('service:counter') as CounterService;

      await render(<template>
        <button {{on "click" (inc 10)}}>Inc</button>
      </template>);

      assert.equal(counter.counter, 0, 'Counter is 0');

      await click('button');

      assert.equal(counter.counter, 10, 'Counter is 10');
    });

    test('with parameters', async function (assert) {
      // eslint-disable-next-line @typescript-eslint/no-invalid-this
      const counter = this.owner.lookup('service:counter') as CounterService;

      const Step = <template>
        <button {{on "click" (fn @push @inc)}}>{{yield}}</button>
      </template>

      await render(<template>
        <Step @inc={{10}} @push={{(inc)}}>Inc</Step>
      </template>);

      assert.equal(counter.counter, 0, 'Counter is 0');

      await click('button');

      assert.equal(counter.counter, 10, 'Counter is 10');
    });
  });

  module('(fn (action))', function () {
    test('plain invocation', async function (assert) {
      // eslint-disable-next-line @typescript-eslint/no-invalid-this
      const counter = this.owner.lookup('service:counter') as CounterService;

      await render(<template>
        <button {{on "click" (fn (incOne))}}>Inc</button>
      </template>);

      assert.equal(counter.counter, 0, 'Counter is 0');

      await click('button');

      assert.equal(counter.counter, 1, 'Counter is 1');
    });

    test('curried invocation', async function (assert) {
      // eslint-disable-next-line @typescript-eslint/no-invalid-this
      const counter = this.owner.lookup('service:counter') as CounterService;

      await render(<template>
        <button {{on "click" (fn (inc 10))}}>Inc</button>
      </template>);

      assert.equal(counter.counter, 0, 'Counter is 0');

      await click('button');

      assert.equal(counter.counter, 10, 'Counter is 10');
    });

    test('curried with (fn)', async function (assert) {
      // eslint-disable-next-line @typescript-eslint/no-invalid-this
      const counter = this.owner.lookup('service:counter') as CounterService;

      await render(<template>
        <button {{on "click" (fn (inc) 10)}}>Inc</button>
      </template>);

      assert.equal(counter.counter, 0, 'Counter is 0');

      await click('button');

      assert.equal(counter.counter, 10, 'Counter is 10');
    });

    test('with parameters', async function (assert) {
      // eslint-disable-next-line @typescript-eslint/no-invalid-this
      const counter = this.owner.lookup('service:counter') as CounterService;

      const Step = <template>
        <button {{on "click" (fn @push @inc)}}>{{yield}}</button>
      </template>

      await render(<template>
        <Step @inc={{10}} @push={{(fn (inc))}}>Inc</Step>
      </template>);

      assert.equal(counter.counter, 0, 'Counter is 0');

      await click('button');

      assert.equal(counter.counter, 10, 'Counter is 10');
    });
  });

  module('(command action)', function () {
    test('plain invocation', async function (assert) {
      // eslint-disable-next-line @typescript-eslint/no-invalid-this
      const counter = this.owner.lookup('service:counter') as CounterService;

      await render(<template>
        <button {{on "click" (command incOne)}}>Inc</button>
      </template>);

      assert.equal(counter.counter, 0, 'Counter is 0');

      await click('button');

      assert.equal(counter.counter, 1, 'Counter is 1');
    });

    test('curried invocation', async function (assert) {
      // eslint-disable-next-line @typescript-eslint/no-invalid-this
      const counter = this.owner.lookup('service:counter') as CounterService;

      await render(<template>
        <button {{on "click" (command (inc 10))}}>Inc</button>
      </template>);

      assert.equal(counter.counter, 0, 'Counter is 0');

      await click('button');

      assert.equal(counter.counter, 10, 'Counter is 10');
    });

    test('with parameters', async function (assert) {
      // eslint-disable-next-line @typescript-eslint/no-invalid-this
      const counter = this.owner.lookup('service:counter') as CounterService;

      const Step = <template>
        <button {{on "click" (fn @push @inc)}}>{{yield}}</button>
      </template>

      await render(<template>
        <Step @inc={{10}} @push={{command inc}}>Inc</Step>
      </template>);

      assert.equal(counter.counter, 0, 'Counter is 0');

      await click('button');

      assert.equal(counter.counter, 10, 'Counter is 10');
    });
  });
});
