# Why using `ember-command`?

There is a couple of reasons why you want to use `ember-command`. Implementation of the
[Command](https://refactoring.guru/design-patterns/command) design pattern from
[Command-Query-Separation](https://en.wikipedia.org/wiki/Command–query_separation) for ember.

## Separating Business Logic from UI

Part of your [tactical
design](https://thedomaindrivendesign.io/what-is-tactical-design/) is to
separate business logic from your UI. At best, business logic stays pure JS/TS
and frameworks provide a connection to integrate with their DI systems and other
framework specific mechanics.

Business Logic splits into commands and queries and it is strongly advised to
separate both, also known as the _command and query separation pattern_ (cqs).

Ember provides two libraries to connect your pure business logic:

- `ember-command` for commands/actions/functions
- [`ember-ability`](https://github.com/gossi/ember-ability) for queries/questions/abilities

## First-Class Functions

`ember-command` takes care of running your business functions, so you can safely
write resilient business logic, properly backed up by unit tests. When composing
things together:

- Commands are primitives to be passed around
- Commands are just functions
- Commands are composable of many functions (but stays a function)
- Commands can have/be a link (but stays a function)
- Use commands with `(fn)` and enjoy partial applications (because it stayed a
  function)

What you'll get:

- A `Command` class to extend from for your implementation
- A `LinkCommand` as syntactic sugar for creating a link (through [`ember-link`](https://github.com/buschtoens/ember-link))
- A `@command` decorator to connect your component with your command
- A `<CommandElement>` component as your building block to attach your command
  to the UI
- An `action()` function to connect your pure business functions with ember' DI system
- The `<CommandElement>` will accept a `Command`, an `@action` or a `(link)`
- The `<CommandElement>` will render the correct HTML element to take care of
  accessibility
