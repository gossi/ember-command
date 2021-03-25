import { getOwner, setOwner } from '@ember/application';
import { UILink } from 'ember-link';
import { Action } from './-private/action';

export { Action } from './-private/action';

type Ingredient = () => void | Action | UILink;
type Composition = Ingredient | Ingredient[];

export interface Actionable {
  (...args: unknown[]): void;
  link?: UILink;
}

export function makeActionable(owner: unknown, composition: Composition) {
  composition = !Array.isArray(composition) ? [composition] : composition;

  // find the link
  const link = composition.find(ingredient => {
    if (ingredient instanceof UILink) {
      return ingredient;
    }
  });

  // and remove it
  if (link) {
    composition.splice(composition.indexOf(link), 1);
  }

  // instantiate action classes
  composition.map(ingredient => {
    if (ingredient instanceof Action) {
      setOwner(ingredient, owner);
    }

    return ingredient
  });

  const action = (...args: unknown[]) => {
    for (const fn of composition) {
      if (fn instanceof Action) {
        fn.execute(args);
      } else {
        fn(args);
      }
    }
  }

  if (link) {
    action.link = link;
  }

  return action;
}

export function actionable(prototype, key, desc) {
  let actionables = new WeakMap();
  let { initializer } = desc;

  return {
    get() {
      let actionable = actionables.get(this);

      if (!actionable) {
        actionable = makeActionable(getOwner(this), initializer.call(this));
        actionables.set(this, actionable);
      }

      return actionable;
    }
  }
}
