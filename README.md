# Actionables (that ember could get used to)

Actionables is a concept to technically **model an action a user can perform**:

- An actionable is a primitive to be passed around
- An actionable is just a function
- An actionable is composable of many actions (but stays a function)
- An actionable can have a link (but stays a function)
- Use actionables with `(fn)` and enjoy partial applications (because it stayed
  a function)

What to do with them?

- Throw the actionable at `<Actionable>` component and let it be rendered
- Throw any `@action` or `(link)` at `<Actionable>` and it will be rendered

Oh: `Actionables` are _commands_ in [C-Q-S](https://en.wikipedia.org/wiki/Command–query_separation)

Open questions:

- Integration done properly?
- DAT NAME 😡 !§)$%/"=§$
  - Best name is clearly: `Action` - but, but ... ember? 😪
  - Alternative: `Command` as in the
    [Command](https://refactoring.guru/design-patterns/command) design pattern

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.

## License

This project is licensed under the [MIT License](LICENSE.md).
