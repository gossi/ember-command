import { capabilities, setHelperManager } from '@ember/helper';
import { next } from '@ember/runloop';

import { sweetenOwner } from 'ember-sweet-owner';

import type Owner from '@ember/owner';
import type { HelperCapabilities } from '@glimmer/interfaces';
import type { SweetOwner } from 'ember-sweet-owner';

interface Args {
  positional: any[];
  named: object;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunction = (...args: any[]) => any;
type ActionFactory<F extends AnyFunction> = (owner: SweetOwner) => F;
type ActionInvoker<F extends AnyFunction> = (
  owner: SweetOwner,
  ...args: Parameters<F>
) => ReturnType<F>;

class ActionFactoryManager<F extends AnyFunction> {
  capabilities: HelperCapabilities = capabilities('3.23', {
    hasValue: true
  });

  constructor(protected owner: Owner) {}

  createHelper(fn: ActionInvoker<F>, args: Args) {
    return { fn, args };
  }

  getValue({ fn, args }: { fn: ActionInvoker<F>; args: Args }) {
    const sweetOwner = sweetenOwner(this.owner);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const an = fn(sweetOwner);

    console.log('ActionFactoryManager.getValue', fn, args, an);

    return (...moreArgs: any[]) =>
      next(this, function () {
        an(...[...args.positional, ...moreArgs]);
        // code to be executed in the next run loop,
        // which will be scheduled after the current one
      });
  }
}

// Provide a singleton manager.
const ActionFactoryManagerInstance = (owner: any) => new ActionFactoryManager(owner as Owner);

export function action<F extends AnyFunction>(
  factory: ActionFactory<F>
): (...args: Parameters<F>) => () => ReturnType<F> {
  // variant 1:
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  setHelperManager(ActionFactoryManagerInstance, factory);

  return factory as unknown as (...args: Parameters<F>) => () => ReturnType<F>;

  // variant 2:
  // const an =
  //   (...args: Parameters<F>) =>
  //   (owner: SweetOwner) =>
  //     factory(owner)(...args);

  // // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // // @ts-ignore
  // setHelperManager(ActionFactoryManagerInstance, an);

  // return an as (...args: Parameters<F>) => () => ReturnType<F>;
}

// const testingTheTypes = action(({ services }) => {
//   return (amount = 5) => {
//     // so smth
//     console.log(amount);
//   };
// });

// const tst = testingTheTypes();
