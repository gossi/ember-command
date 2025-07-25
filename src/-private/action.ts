import { capabilities, setHelperManager } from '@ember/helper';

import { sweetenOwner } from 'ember-sweet-owner';

import type Owner from '@ember/owner';
import type { HelperCapabilities } from '@glimmer/interfaces';
import type { SweetOwner } from 'ember-sweet-owner';

export const ACTION = Symbol('action');

interface Args {
  positional: never[];
  named: object;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyFunction = (...args: any[]) => any;
type ActionFactory<F extends AnyFunction> = (owner: SweetOwner) => F;

/**
 * Representing an action build with the `action()` factory
 */
export type Action<F extends AnyFunction> = ((owner: Owner) => F) & (() => F);

class ActionFactoryManager<F extends AnyFunction> {
  capabilities: HelperCapabilities = capabilities('3.23', {
    hasValue: true
  });

  constructor(protected owner: Owner) {}

  createHelper(invoker: Action<F>, args: Args) {
    return { fn: invoker(this.owner), args };
  }

  getValue({ fn, args }: { fn: F; args: Args }) {
    return (...params: never[]) => {
      const parameters = [...args.positional, ...params] as unknown as Parameters<F>;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return fn(...parameters);
    };
  }
}

// Provide a singleton manager.
const ActionFactoryManagerInstance = (owner: Owner) => new ActionFactoryManager(owner);

export function action<F extends AnyFunction>(factory: ActionFactory<F>): Action<F> {
  const an =
    (owner: Owner) =>
    (...args: Parameters<F>) =>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      factory(sweetenOwner(owner))(...args);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  an[ACTION] = ACTION;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  setHelperManager(ActionFactoryManagerInstance, an);

  return an as unknown as Action<F>;
}
