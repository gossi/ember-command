# Functions

Functions are the most pure form to perform tasks. Dependency injection through
parameters, a function has all the things needed to operate. `ember-command` can
be composed of functions:

```gts
import { on } from '@ember/modifier';
import { command } from 'ember-command';

function sayHello() {
  console.log('Hello);
}

<template>
  <button {{on "click" (command sayHello)}}>Say Hello</button>
</template>
```

And using `(fn)` helper to pass it parameters:

```gts
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
import { command } from 'ember-command';

function sayHello(name: string) {
  console.log('Hello', name);
}

<template>
  <button {{on "click" (command (fn sayHello 'gossi'))}}>Say Hello</button>
</template>
```
