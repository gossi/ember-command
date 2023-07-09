import Helper from '@ember/component/helper';

import type { ComponentLike } from '@glint/template';

export interface ElementSignature<T extends string> {
  Args: {
    Positional: [name: T];
  };
  Return: ComponentLike<{
    Element: T extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T] : Element;
    Blocks: { default: [] };
  }>;
}

export default class ElementHelper<T extends string> extends Helper<ElementSignature<T>> {}
