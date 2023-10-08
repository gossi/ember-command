# Intended Usage

The idea for `ember-command` is clearly to [separate your business logic from
your UI](./why.md) by offering a couple of mechanics to do that.

## 1. Wrap your Business Logic

Ideally, your business logic is available in pure JS/TS and at best even in
another package than your ember code. For most of the time to make your business
logic work is to use domain objects which you should have available and secondly
it requires one or many Ember services to function, such as a service for your
data layer, notification service, etc. for which `ember-command` offers you
[`action()`](./actions.md) and [`Command`](./command.md).

- `action()`: For usage in single-file-components
- `Command`: Implementation of the command-pattern in OOP for more sophisticated
  code and further advancability of an _undo_ functionality

## 2. Composition as Primitives

[`ember-link`](https://github.com/buschtoens/ember-link) introduced links as
primitives: define them and pass them around. `ember-command` extends this idea
by [composing commands](./composing.md) to form a primitive which can be passed
around.
