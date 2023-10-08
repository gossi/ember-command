# Command

Commands as classes can use ember's dependency injection system as much as ember
developers are used to. That's what the `Command` base class is
for. Here is how we write our command from above with access to the data layer
(an ember service) to fire off a command to the backend:

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
