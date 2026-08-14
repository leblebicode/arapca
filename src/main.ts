import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { syncAppStorageVersion } from './app/version';

syncAppStorageVersion();

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
