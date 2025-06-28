import Service from '@ember/service';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import { action } from '#src';
import { getOwner } from '#tests/helpers';

class MathService extends Service {
  PI = Math.PI;

  add(a: number, b: number) {
    return a + b;
  }
}

declare module '@ember/service' {
  interface Registry {
    math: MathService;
  }
}

module('Unit | action()', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(() => {
    getOwner().register('service:math', MathService);
  });

  test('Access parameter free', (assert) => {
    const gimmePie = action(
      ({ services }) =>
        () =>
          services.math.PI
    )(getOwner());

    assert.strictEqual(gimmePie(), Math.PI);
  });

  test('With parameters', (assert) => {
    const add = action(
      ({ services }) =>
        (a: number, b: number) =>
          services.math.add(a, b)
    )(getOwner());

    assert.strictEqual(add(3, 5), 8);
  });

  test('Curried', (assert) => {
    const add = action(
      ({ services }) =>
        (a: number, b: number) =>
          services.math.add(a, b)
    )(getOwner());

    const addOne = (b: number) => add(1, b);

    assert.strictEqual(addOne(5), 6);
  });

  test('Async', async (assert) => {
    const gimmePie = action(({ services }) => async () => {
      await new Promise((resolve) => globalThis.setTimeout(resolve, 0));

      return services.math.PI;
    })(getOwner());

    const pi = await gimmePie();

    assert.strictEqual(pi, Math.PI);
  });
});
