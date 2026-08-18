import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { checkForAppUpdate, syncAppStorageVersion } from './app/version';

syncAppStorageVersion();

void checkForAppUpdate().then((updating) => {
  if (updating) {
    return;
  }

  return bootstrapApplication(App, appConfig);
}).catch((err) => console.error(err));
