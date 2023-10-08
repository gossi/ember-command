# Commands for Ember

Implementation of the
[Command](https://refactoring.guru/design-patterns/command) design pattern from
[C-Q-S](https://en.wikipedia.org/wiki/Command–query_separation) for ember.

- Commands are a primitives to be passed around
- Commands are just functions
- Commands are composable of many functions (but stays a function)
- Commands can have/be a link (but stays a function)
- Use commands with `(fn)` and enjoy partial applications (because it stayed a
  function)

What you'll get:

- A `Command` class to extend from for your implementation
- A `LinkCommand` as syntactic sugar for creating a link (through [`ember-link`](https://github.com/buschtoens/ember-link))
- A `@command` decorator to connect your component with your command
- A `<CommandElement>` component as your building block to attach your command to the UI
- The `<CommandElement>` will accept a `Command`, an `@action` or a `(link)`
- The `<CommandElement>` will render the correct HTML element to take care of
  accessibility

## Documentation

[Read the Documentation](https://gossi.github.io/ember-command/)

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

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.

## License

This project is licensed under the [MIT License](LICENSE.md).
