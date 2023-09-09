import Service from '@ember/service';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import { action } from 'ember-command';

import type { TestContext } from '@ember/test-helpers';

class MathService extends Service {
  // eslint-disable-next-line @typescript-eslint/naming-convention
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

  hooks.beforeEach(function (this: TestContext) {
    this.owner.register('service:math', MathService);
  });

  test('Access parameter free', function (this: TestContext, assert) {
    const gimmePie = action(
      ({ services }) =>
        () =>
          services.math.PI
    )(this.owner);

    assert.equal(gimmePie(), Math.PI);
  });

  test('With parameters', function (this: TestContext, assert) {
    const add = action(
      ({ services }) =>
        (a: number, b: number) =>
          services.math.add(a, b)
    )(this.owner);

    assert.equal(add(3, 5), 8);
  });

  test('Curried', function (this: TestContext, assert) {
    const add = action(
      ({ services }) =>
        (a: number, b: number) =>
          services.math.add(a, b)
    )(this.owner);

    const addOne = (b: number) => add(1, b);

    assert.equal(addOne(5), 6);
  });
});
