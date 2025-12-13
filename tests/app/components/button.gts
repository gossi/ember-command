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
