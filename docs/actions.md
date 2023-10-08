# Actions

Actions are perfect to connect existing functions with the Ember's DI container
or to wrap your service calls in functions.

## Wrapping Service Calls

Here is a `Counter` service, which can increment and decrement. Let's connect it
with a single-file-component.

::: info
The best part: `action()` and
[`ability()`](https://github.com/gossi/ember-ability) share the same API, so you
only need to learn one.
:::

::: code-group

```gts [components/counter.gts]
import { action } from 'ember-command';
import { ability } from 'ember-ability';
import { on } from '@ember/modifier';

const inc = action(({ services }) => () => {
  services.counter.inc();
});

const count = ability(({ services }) => () => {
  return services.counter.count;
});

const Counter = <template>
  {{count}} <button type="button" {{on "click" (inc)}}>+</button>
</template>

export default Counter;
```

```ts [services/counter.ts]
import { tracked } from '@glimmer/tracking';
import Service from '@ember/service';

export default class CounterService extends Service {
  @tracked count = 0;

  inc = () => {
    this.count++;
  }

  dec = () => {
    this.count--;
  }
}

declare module '@ember/service' {
  export interface Registry {
    counter: CounterService;
  }
}
```

:::

Due to Ember's helper infrastructure, an `action()` returns a factory, which in
the template must be invoked, so Ember can associate the action with the helper
manager that can find the owner. Thus, the *following code will break* as Ember
is not able to make that association.

```hbs
{{on "click" inc}}
```

## Connect Business Logic

Here is the request offer function for an addition to super-rentals example. The
`requestOffer()` function contains the chunk of business logic (suprisingly these
are most often only a few lines of code). The `requestOffer()` function can be
properly unit tested to ensure it will find the right way into the backend with
the expected payload.

```ts
type Expose = object; // typed somewhere else

export interface DataClient {
  sendCommand(name: string, payload: object): void;
}

export function requestOffer(recommendation: Expose, api: DataClient) {
  api.sendCommand('recommendations.request-offer', { recommendation });
}
```

`requestOffer()` function expects two parameters. The `api` comes as
an Ember service and `recommendation` is an argument to the component in which
the function is used. We are building a `requestOffer()` action as partial
application and curry in the final parameter with `(fn)` during invocation.

::: warning

Also remember to invoke the action in the template, so Ember can associate it
with the backing helper manager.

:::

::: code-group

```gts [components/recommendation.gts]
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

```ts [services/data.ts]
import Service from '@ember/service';
import type { DataClient } from 'your-businees-logic-package';

export default class DataService extends Service implements DataClient {

  sendCommand(string: name, payload: object) {
    // ... implementation goes here
  }
}

declare module '@ember/service' {
  export interface Registry {
    data: DataService;
  }
}
```

:::

## Composing

Actions can be composed with other commandables, such as links or functions.
Here is the `inc()` with additional tracking:

```gts
import { command, action } from 'ember-command';
import { track } from 'your-tracking-package';
import { on } from '@ember/modifier';

const inc = action(({ services }) => () => {
  services.counter.inc();
});

const Counter = <template>
  <button type="button" {{command inc (track "counter incremented")}}>+</button>
</template>

export default Counter;
```

::: info
In contrast to Ember, the `(command)` helper is able to recognize an `action()`
and thus doesn't need to be invoked.
:::
