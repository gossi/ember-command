# Links

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
