import { setApplication } from '@ember/test-helpers';
import * as QUnit from 'qunit';
import { setup } from 'qunit-dom';
import { start } from 'ember-qunit';

import setupSinon from 'ember-sinon-qunit';
import Application from 'test-app/app';
import config from 'test-app/config/environment';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
setApplication(Application.create(config.APP));

setup(QUnit.assert);
setupSinon();

start();
