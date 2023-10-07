# Attaching to UI

`ember-command` provides you with a `<CommandElement>` component to render
commands in their appropriate HTML element to make it accessibility compliant.
[WAI-ARIA 1.1 for Accessible Rich Internet
Applications](https://www.w3.org/TR/wai-aria-1.1) explicitely mentions
`button`, `menuitem` and `link` as the implementationable roles for the abstract
super role [`command`](https://www.w3.org/TR/wai-aria-1.1/#command) (but there
also may be more UI elements, that are receivers of commands).

As such `<CommandElement>` acts as building block to your components. Let's make
an example button component:

```gts
import Component from '@glimmer/component';
import { CommandElement } from 'ember-command';
import type { TOC } from '@ember/component/template-only';

interface ButtonSignature {
  Element: HTMLButtonElement | HTMLAnchorElement | HTMLSpanElement;
  Args: {
    /** A command which will be invoked when the button is pushed */
    push: Command;
  }
}

const Button: TOC<ButtonSignature> = <template>
  <CommandElement @command={{@push}} ..attributes>
    {{yield}}
  </CommandElement>
</template>

export default Button;
```

which we can use as:

```hbs
<Button @push={{this.ourCommand}}>Request an Offer</Button>
```

Thanks to the `<CommandElement>` the rendered element will adjust to either
`<a>` or `<button>` and will cover all accessbility needs out of the box for you.
By handing off that logical part to `<CommandElement>` you can focus on giving
your button component the best styling it deserves.
