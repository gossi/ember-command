# Commands for Ember

Implementation of the
[Command](https://refactoring.guru/design-patterns/command) design pattern from
[C-Q-S](https://en.wikipedia.org/wiki/Command–query_separation) for ember.

- Commands are a primitives to be passed around
- Commands are just functions
- Commands are composable of many functions (but stays a function)
- Commands can have/be a link (but stays a function)
- Use commands with `(fn)` and enjoiy partial applications (because it stayed a
  function)

What you'll get:

- A `Command` class to extend from for your implementation
- A `LinkCommand` as syntactic sugar for creating a link (through
  [`ember-link`](https://github.com/buschtoens/ember-link))
- A `@command` decorator to connect your component with your command
- A `<Commander>` component which you can use to attach your command to the UI
- The `<Commander>` will accept a `Command`, an `@action` or a `(link)`

- Throw the actionable at `<Actionable>` component and let it be rendered
- Throw any `@action` or `(link)` at `<Actionable>` and it will be rendered

... more docs to come. Curious people want to check the dummy app, which
contains a demo.

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.

## License

This project is licensed under the [MIT License](LICENSE.md).
