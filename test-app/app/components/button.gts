import { type CommandAction, CommandElement } from 'ember-command';

import type { TOC } from '@ember/component/template-only';

interface ButtonSignature {
  Element: HTMLButtonElement | HTMLSpanElement | HTMLAnchorElement;
  Args: { push: CommandAction };
  Blocks: {
    default: [];
  };
}

const Button: TOC<ButtonSignature> = <template>
  <CommandElement @command={{@push}} ...attributes>
    {{yield}}
  </CommandElement>
</template>;

export default Button;

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Button: typeof Button;
  }
}
