# Super Rentals Tutorial

This tutorial in extending Super Rentals will teach on **preparing** your UI
components, **writing commands**, **attaching** them your UI and **testing**
them.

This documentation is guided by product development and engineering for _Super
Rentals Inc_ with CPO _Tomster_ and Frontend Engineer _Zoey_.

> _Tomster_ realized a cohort of customers that are interested in seeing
> personalized recommendations for rentals and put together a specification for
> the feature.
> Super Rentals shall be extended with a _recommendation_ section offering
> personalized exposé to customers. Customers can _request offers_ and _learn
> more_ about the object.
> <br><br>
> _Tomster_ and _Zoey_ underlined the relevant nouns and verbs in the feature
> specification to draw the domain terminology from it. The _recommendation_ is
> the new domain object and _request offer_ and _learn more_ are the actions upon
> that.
> <br><br>
> Meanwhile the backend developers were busy delievering an endpoint that
> implements the business logic for these actions. Now _Zoey's_ job is to
> connect the UI to these endpoints. To dispatch the request, the `data`
> service is used.

## Preparing UI Components

To be conforming to accessibility standards, commands shall be rendered in their
appropriate HTML element. `ember-command` provides the
`<CommandElement>` to do that. Your job is to integrate this component into your
existing set of components. [WAI-ARIA 1.1 for Accessible Rich Internet
Applications](https://www.w3.org/TR/wai-aria-1.1) explicitely mentions `button`,
`menuitem` and `link` as the implementationable roles for the abstract super role
[`command`](https://www.w3.org/TR/wai-aria-1.1/#command) (but there also may be
more UI elements, that are receivers of commands).

Let's make an example button component with the help of `<CommandElement>`:

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

Yes a button is _pushed_ not _onClicked_ (Think about it: Do you _push_ or
_click_ a button/switch to turn on the lights in your room?).

> As _Zoey_ is caring about accessibility, she wants commands to be
> represented as its appropriate element.

Thanks to the `<CommandElement>` the rendered element will adjust to either
`<a>` or `<button>` and will cover all accessbility needs out of the box for you.
By handing off that semantic part to `<CommandElement>` you can focus on giving
your button component the best styling it deserves.

## Writing Commands

This section focusses on writing commands in various formats.

### Ember Actions as Commands

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
work only with the parameters passed into them. As the purpose of a command is
to mutate the system, passing in all _dependencies_ can be quite cumbersome.

As a matter of that functions are great to _query_ the system and request a
particular state about something. _Commands_ are there to cause side-effects to the
system. Carefully using either one of them leads to proper [command and query
separation](https://en.wikipedia.org/wiki/Command–query_separation).

### Self-Contained Commands

Commands interact with the system, they are better contained in their own unit
(class or function) and their dependencies can be fulfilled through dependency
injection. That's what the `Command` base class is for, to give you the same
mechanics as other classes in the Ember framework.
Here is how we write our command from above with access to the data layer (an
ember service) to fire off a command to the backend:

```ts
import { inject as service } from '@ember/service';
import { Command } from 'ember-command';
import type DataService from 'super-rentals/services/data';

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

### Actions over Commands

As `Command`s are quite sophisticated and allow for more use-case scenarios
(such as undo), the more lightweight implementation are [actions](./actions.md).
The same `RequestOfferCommand` implemented as action is here:

```gts
import { fn } from '@ember/helper';
import { action } from 'ember-command';
import { Button } from 'your-ui-package';
import { requestOffer as upstreamRequestOffer, type Expose } from 'your-businees-logic-package';
import type { TOC } from '@ember/component/template-only';

interface RecommendationSignature {
  Args: {
    recommendation: Expose;
  }
}

const requestOffer = action(({ services }) => (recommendation: Expose) => {
  upstreamRequestOffer(recommendation, services.data);
});

const Recomendation: TOC<RecommendationSignature> = <template>
  <Button @push={{(fn (requestOffer) @recommendation)}}>Request offer</Button>
</template>

export default Recommendation;
```

Since this is a function assigned with a helper manager, it is suitable to be
used within a
[single-file-component](https://rfcs.emberjs.com/id/0779-first-class-component-templates).

### Seeding Commands

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

### Command Composition

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

### Link Commands

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

## Attaching Commands to your UI

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

## Testing Commands

As commands are isolated and self-containing a business logic, we can write
tests to specifically test for this. Let's test the tracking command using
[`ember-sinon-qunit`](https://github.com/elwayman02/ember-sinon-qunit) to stub
the `tracking` service:

```ts
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

import { arrangeCommand } from 'ember-command/test-support';
import { TestContext } from 'ember-test-helpers';

import sinon from 'sinon';

import TrackingCommand from '<somewhere-in-your-module>';

module('Integration | Command | TrackingCommand', function (hooks) {
  setupTest(hooks);

  test('it tracks', async function (this: TestContext, assert) {
    this.owner.register('service:tracking', TrackingService);
    const trackingService = this.owner.lookup('service:tracking');

    const stub = sinon.stub(trackingService, 'track');
    const cmd = arrangeCommand(new TrackingCommand());

    cmd.execute('hello');

    assert.ok(stub.calledOnceWith('hello'));
  });
});
```

The `arrangeCommand` is the testing equivalent to the `@command` decorator to
attach the owner and wires up dependency injection.
