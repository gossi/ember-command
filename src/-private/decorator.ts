import { assert } from '@ember/debug';

import { getOwner } from './-owner.ts';
import { type Commandable, type CommandInstance, createCommandInstance } from './instance.ts';

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
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { initializer, get } = desc;
  const invoker = initializer ?? get;

  return {
    get() {
      let action = actions.get(this) as CommandInstance | undefined;

      if (!action) {
        assert(`Missing initializer for '${String(key)}'.`, typeof invoker === 'function');

        const composition = invoker.call(this) as Commandable | Commandable[] | undefined;

        action = composition
          ? // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
            createCommandInstance(getOwner(this) as Owner, composition)
          : undefined;
        actions.set(this, action);
      }

      return action;
    }
  };
}
