import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';
import * as QUnit from 'qunit';
import { setup } from 'qunit-dom';

import setupSinon from 'ember-sinon-qunit';

import Application from 'dummy/app';
import config from 'dummy/config/environment';

setApplication(Application.create(config.APP));

setup(QUnit.assert);
setupSinon();

start();
