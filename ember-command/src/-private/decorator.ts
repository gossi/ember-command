import { assert } from '@ember/debug';

import { getOwner } from './-owner';
import { createCommandInstance } from './instance';

import type Owner from '@ember/owner';

interface DecoratorPropertyDescriptor extends PropertyDescriptor {
  initializer?(): unknown;
}

export function decorate(
  _prototype: unknown,
  key: string | symbol,
  desc: DecoratorPropertyDescriptor
) {
  const actions = new WeakMap();
  const { initializer, get } = desc;
  const invoker = initializer ?? get;

  return {
    get() {
      let action = actions.get(this);

      if (!action) {
        assert(`Missing initializer for '${String(key)}'.`, typeof invoker === 'function');
        action = createCommandInstance(getOwner(this) as Owner, invoker.call(this));
        actions.set(this, action);
      }

      return action;
    }
  };
}
