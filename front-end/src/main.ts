import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { AppModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule, {
  ngZoneEventCoalescing: true
})
  .catch(err => console.error(err));
