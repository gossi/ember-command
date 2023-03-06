import { assert } from '@ember/debug';
import { getOwner } from '@ember/owner';

import { makeAction } from './utils';

import type Owner from '@ember/owner';

interface DecoratorPropertyDescriptor extends PropertyDescriptor {
  initializer?(): unknown;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore typings are weird for that case. That's the best to make it work
// as expression - ie. ignoring was easier than to change the code to a factory 😱
const decorator: PropertyDecorator = function (
  _prototype: unknown,
  key: string | symbol,
  desc: PropertyDescriptor
) {
  const actions = new WeakMap();
  const { initializer, get } = desc as DecoratorPropertyDescriptor;
  const invoker = initializer ?? get;

  return {
    get() {
      let action = actions.get(this);

      if (!action) {
        assert(`Missing initializer for '${String(key)}'.`, typeof invoker === 'function');
        action = makeAction(getOwner(this) as Owner, invoker.call(this));
        actions.set(this, action);
      }

      return action;
    }
  };
};

export { decorator };
