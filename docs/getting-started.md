# Getting Started

## Installation

Install `ember-command` with:

```sh
ember install ember-command
```

## Usage

The idea for `ember-command` is clearly to [separate your business logic from
your UI](./why.md) by offering a couple of mechanics to do that.

### Actions

Write an action that invokes a service within a [single file
component](https://rfcs.emberjs.com/id/0779-first-class-component-templates).

```gts
import { action } from 'ember-command';
import { on } from '@ember/modifier';

const inc = action(({ services }) => () => {
  services.counter.inc();
});

const Counter = <template>
  <button type="button" {{(inc)}}>+</button>
</template>

export default Counter;
```

### Composing

Compose various commands together to form a primitive that can be passed around.
This works well in combination with
[`ember-link`](https://github.com/buschtoens/ember-link).

Let's make a link and add tracking to it:

```gts
import { command, action, CommandElement } from 'ember-command';
import { link } from 'ember-link';

const track = action(({ services }) => (event: string) => {
  services.tracking.track(event);
});

const HomeLink = <template>
  <CommandElement @command={{command 
    (fn (track) "go home")
    (link "application")
  }}>Home</CommandElement>
</template>

export default HomeLink;
```
