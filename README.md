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

## Installation

```bash
ember install ember-command
```

## Documentation

- [Preparing UI Components](#preparing-ui-components)
- [Writing Commands](#writing-commands)
  - [Ember Actions as Commands](#ember-actions-as-commands)
  - [Self-Contained Commands](#self-contained-commands)
  - [Seeding Commands](#seeding-commands)
  - [Compound Commands](#compound-commands)
  - [Link Commands](#link-commands)
- [Attaching Commands to your UI](#attaching-commands-to-your-ui)
- [Testing Commands](#testing-commands)

This section will teach on **preparing** your UI components, **writing
commands**, **attaching** them your UI and **testing** them.

This documentation is guided by product development and engineering for _Super
Rentals Inc_ with CPO _Tomster_ and Frontend Engineer _Zoey_.

_These passages are optional, you are free to skip - but may feel very much
related to your daily work._

> _Tomster_ realized a cohort of customers that are interested in seeing
> personalized recommendations for rentals and put together a specification for
> the feature.
> Super Rentals shall be extended with a _recommendation_ section offering
> personalized exposé to customers. Customers can _request offers_ and _learn
> more_ about the object.
>
> _Tomster_ and _Zoey_ underlined the relevant nouns and verbs in the feature
> specification to draw the domain terminology from it. The _recommendation_ is
> the new aggregate and _request offer_ and _learn more_ are the actions upon
> that.
>
> Meanwhile the backend developers were busy delievering an endpoint that
> implements the business logic for these actions. Now _Zoey's_ job is to
> connect the UI to these endpoints. To dispatch the request, the `data`
> service is used.

### Preparing UI Components

All elements/components that you want to invoke commands must be prepared.
Gladly you don't have to deal with the implementation details, this is what the
`<CommandElement>` is for. Your job is to integrate this component into your
existing set of components. [WAI-ARIA 1.1 for Accessible Rich Internet
Applications](https://www.w3.org/TR/wai-aria-1.1) explicitely mentions `button`,
`menuitem` and `link` as the implementationable roles for the abstract super role
[`command`](https://www.w3.org/TR/wai-aria-1.1/#command) (but there also may be
more UI elements, that are receivers of commands).

Let's make an example button component with the help of `<CommandElement>`:

```hbs
{{! components/button/index.hbs }}
<CommandElement @command={{@push}} ..attributes>
  {{yield}}
</CommandElement>
```

and give it an interface to describe the arguments:

```ts
// components/button/index.d.ts
import Component from '@glimmer/component';
import { Command } from 'ember-command/components/command-element';

export interface ButtonArgs {
  /** A command which will be invoked when the button is pushed */
  push: Command;
}
```

which we can use as:

```hbs
<Button @push={{this.ourCommand}}>Request an Offer</Button>
```

Yes a button is _pushed_ not _onClicked_ (Think about it: Do you _push_ or
_click_ a button/switch to turn on the lights in your room?).

> As _Zoey_ is caring about accessibility, she wants commands to be
> represented as its appropriate element.

Thanks to the `<CommandElement>` the rendered element will adjust to either
`<a>` or `<button>` and will cover all accessbility needs out of the box for you.
By handing off that logical part to `<CommandElement>` you can focus on giving
your button component the best styling it deserves ;)

### Writing Commands

This section focusses on writing commands in various formats.

#### Ember Actions as Commands

Ember recommends to use `@action` decorator for writing functions that can be
invoked from UI elements. `ember-command` is built to work with these existing
mechanismns. Any regular `@action` function/method also qualifies
as command and your existing code continues to work as is:

```ts
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import DataService from 'super-rentals/services/data';

class RecommendationComponent extends Component {
  @service declare data: DataService;

  @action
  requestOffer() {
    // very whimsical things here
  }
}
```

Yet, in this case business logic is coupled to the component. To write clean
code, we want to have this separated and let the component be the glue part
connecting business logic with UI.

As of that the simplest example is to extract your business logic into a
function:

```ts
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import DataService from 'super-rentals/services/data';
import { requestOffer } from 'super-rentals/recommendations';

class RecommendationComponent extends Component {
  @service declare data: DataService;

  @action
  requestOffer() {
    requestOffer(this.data);
  }
}
```

Extracting into functions is a good step to write maintainable code by
applying separation of concerns. Functions are nice in a way they are isolated and
work only with the parameters passed into them (unless the outer scope is
accessed or a function is run within a specific object - yes `EmberRouter` I
mean your parameter to
[`map()`](https://api.emberjs.com/ember/3.26/classes/EmberRouter/methods/map?anchor=map)).
As the purpose of a command is to mutate the system, passing in all _dependencies_
can be quite cumbersome.

As a matter of that functions are great to _query_ the system and request a
particular state about something. _Commands_ are there to cause side-effects to the
system. Carefully using either one of them leads to proper [command and query
separation](https://en.wikipedia.org/wiki/Command–query_separation).

#### Self-Contained Commands

Commands interact with the system, they are better contained in classes and
their dependencies can be fulfilled through dependency injection. That's
what the `Command` base class is for. Here is how we write our command from
above with access to the data layer (an ember service) to fire off a command
to the backend:

```ts
import { inject as service } from '@ember/service';
import { Command } from 'ember-command';
import DataService from 'super-rentals/services/data';

export default class RequestOfferCommand extends Command {
  @service declare data: DataService;

  execute(): void {
    this.data.sendCommand('super-rentals.recommendations.request-offer', {...});
  }
}
```

and we use the component to connect our command with the UI:

```ts
// components/recommendation
import Component from '@glimmer/component';
import { command } from 'ember-command';
import RequestOfferCommand from 'our-module-above';

class RecommendationComponent extends Component {
  @command requestOffer = new RequestOfferCommand();
}
```

We connect the command to our component by using the `@command` decorator, which
attaches the _owner_ to the command and enables dependency injection onto it and
wraps the command in a function that, when invoked, will call the `execute()`
method of the command.

You may realize, this is an implementation of the [command design
pattern](https://refactoring.guru/design-patterns/command).

#### Seeding Commands

To seed commands, the constructor can be used. We extend our component
with an argument and pass it down to the command:

```ts
// components/recommendation

interface RecommendationArgs {
  recommendation: Expose;
}

class RecommendationComponent extends Component<RecommendationArgs> {
  @command requestOffer = new RequestOfferCommand(this.args.recommendation);
}
```

and expect it from our command:

```ts
import { inject as service } from '@ember/service';
import { Command } from 'ember-command';
import DataService from 'super-rentals/services/data';

export default class RequestOfferCommand extends Command {
  @service declare data: DataService;

  #recommendation: Expose;

  constructor(recommendation: Expose) {
    this.#recommendation = recommendation;
  }

  execute(): void {
    this.data.sendCommand('super-rentals.recommendations.request-offer', {
      recommendation: this.#recommendation,
    });
  }
}
```

Now the command can operate on the _recommendation_ aggregate.

#### Compound Commands

> Hello _Zoey_? It's _Tomster_, our data and analytics team entered a late
> change to the original feature, they want to add tracking onto the link to
> measure the impact of that feature. Can you add tracking, too?
>
> "sure" answers _Zoey_ as she is confident to add this change with surgery
> precision into the already existing code, keeping the level of achieved
> separation. For tracking purposes, she knows, there is a `tracking` service
> to use.

We can have compound commands executed when a UI element is invoked, each in its
own class. Let's add the tracking command:

```ts
import { inject as service } from '@ember/service';
import { Command } from 'ember-command';
import TrackingService from 'super-rentals/services/tracking';

export default class TrackRequestOfferCommand extends Command {
  @service declare tracking: TrackingService;

  #recommendation: Expose;

  constructor(recommendation: Expose) {
    this.#recommendation = recommendation;
  }

  execute(): void {
    this.tracking.track('recommendations.request-offer', {
      recommendation: this.#recommendation,
    });
  }
}
```

And the only change need to make to our existing code to integrate the
tracking command:

```diff
// components/recommendation
import Component from '@glimmer/component';
import { command } from 'ember-command';
import RequestOfferCommand from 'our-module-above';
+ import TrackingRequestOfferCommand from 'our-other-module';

interface RecommendationArgs {
  recommendation: Expose;
}

class RecommendationComponent extends Component<RecommendationArgs> {
-  @command requestOffer = new RequestOfferCommand(this.args.recommendation);
+  @command requestOffer = [
+    new RequestOfferCommand(this.args.recommendation),
+    new TrackingRequestOfferCommand(this.args.recommendation)
+  ];
}
```

#### Link Commands

> _Zoey_ got notice from her coworker, who implemented a details route to which
> the _learn more_ action should link to.

Commands can also be links, which the `<CommandElement>` will render as `<a>`
element. The best solution for creating links is the
[`ember-link`](https://github.com/buschtoens/ember-link) addon.
Programmatically creating links with ember-link is a bit of a
mouthful, like so:

```ts
class RecommendationComponent extends Component {
  @service declare linkManager: LinkManagerService;

  get learnMoreLink() {
    return this.linkManager.createUILink({ route: 'recommendation.details' });
  }
}
```

Passing `learnMoreLink` to `@push` at our button would work straight ahead.
`ember-command` comes with a more friendly syntax to create links
programmatically for commands, which is the `LinkCommand` and be used as:

```ts
import { command, LinkCommand } from 'ember-command';

class RecommendationComponent extends Component {
  @command leanMoreLink = new LinkCommand({ route: 'recommendation.details' });
}
```

so much more lean :)

> Hey _Zoey_, it's _Tomster_ again - can you also add tracking to the learn more
> link?

Compound commands work with links, too. Constructed as an array, as already used
above with multiple commands:

```ts
class RecommendationComponent extends Component {
  @command leanMoreLink = [
    new LinkCommand({ route: 'recommendation.details' }),
    new TrackLearnMoreCommand(this.args.recommendation),
  ];
}
```

Whenever there is a link command present, the `<CommandElement>` will render as
`<a>`. When there are multiple links present, the first one will be rendered,
all successive ones will be dropped.

### Attaching Commands to your UI

This is straight forward. Let's take our recommendation component, which has a
`requestOffer` and a `learnMore` action to attach to the UI:

```hbs
<Button @push={{this.requestOffer}}>Request offer</Button>

.. and somewhere else ..

<Button @push={{this.learnMore}}>Learn more</Button>
```

Of course, `requestOffer` can be any format mentioned under [writing
commands](#writing-commands) section. Also for links, you have a chance to do
this in a template-only style:

```hbs
<Button @push={{link "recommendation.details"}}>Learn more</Button>
```

Just use the flavor you like the most.

### Testing Commands

As commands are isolated and self-containing a business logic, we can write
tests to specifically test for this. Let's test the tracking command using
[`ember-qunit-sinon`](https://github.com/elwayman02/ember-sinon-qunit) to stub
our service:

```ts
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

import { prepareCommand } from 'ember-command/test-support';
import { TestContext } from 'ember-test-helpers';

import sinon from 'sinon';

import TrackingRequestOfferCommand from 'our-module';

module('Integration | Command | TrackingRequestOfferCommand', function (hooks) {
  setupTest(hooks);

  test('it tracks', async function (this: TestContext, assert) {
    this.owner.register('service:tracking', TrackingService);
    const trackingService = this.owner.lookup('service:tracking');

    const stub = sinon.stub(trackingService, 'track');
    const cmd = prepareCommand(this, new TrackingRequestOfferCommand());

    cmd.execute();

    assert.ok(stub.calledOnce);
  });
});
```

The `prepareCommand` is the testing equivalent to the `@command` decorator to
attach the owner and wires up dependency injection.

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.

## License

This project is licensed under the [MIT License](LICENSE.md).
