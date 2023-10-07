# Composing

In order to write clean and maintainable code, it's a good advice to keep the
complexity low. In order to do so, functions should do one thing but do it well.

Adding more features to an existing function is considered bad practice, as a
function would exceed its responsibilities and is in danger of causing unwanted
side-effects. To manage this and keep upon code quality promises, one such
practice is to separate by the _what_ and the _how_ (by uncle bob).

Here is a sample in plain JS. In order to prepare the checkout (the _what_), this
requires to aquire customer details (1st _how_), payment method (2nd _how_) and
shipping information (3rd _how_):

```js
function prepareCheckout() { // the what
  aquireCustomerDetails();   // how #1
  aquirePaymentMethod();     // how #2
  aquireShipping();          // how #3
}
```

Composing commands is providing this capability. Each commandable is turning
into one _how_ whereas the composition of all them is the _what_.

A command can be composed from [functions](./functions.md),
[actions](./actions.md), [commands](./command.md), one [link](./links.md) or
other composed commands (they are flattened in).

## Benefits

Composability is really beneficial when working towards changing requirements.
Once a command is written and attached to the UI, changing the functionality is
keeping the code as is, but compose in another command.

## Invocation Styles

Declarative:

```gts
import { command, CommandElement } from 'ember-command';
import { track } from 'your-tracking-package';
import { link } from 'ember-link';

function sayHello() {
  console.log('Hi);
}

<template>
  <CommandElement @command={{command sayHello (link "application") (track "said-hello")}}>
</template>
```

Imperative:

```ts
import { command, commandFor, LinkCommand } from 'ember-command';
import { TrackCommand } from 'your-tracking-package';

function sayHello() {
  console.log('Hi);
}

export default class MyComponent extends Component {
  @command doSth = commandFor([
    sayHello,
    new LinkCommand({ route: 'application' }),
    new TrackCommand('said-hello')
  ])
}
```
