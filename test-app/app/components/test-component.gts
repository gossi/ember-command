import { command } from 'ember-command';

import Button from './button';
import CurryCookCommand from './outer-demo/curry-cook-command';

function hi() {
  console.log('huhu');
}

const cook = new CurryCookCommand();

const nope = false;

const Foo = <template>
  <Button @push={{command hi}}>
    Log
  </Button>
</template>
