import { AppComponent } from './app/app.component';
import { ApplicationConfig, bootstrapApplication } from '@angular/platform-browser';
import { routes } from './app/app.routes';
import { provideRouter, withComponentInputBinding } from '@angular/router';

const AppConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
  ],
};

bootstrapApplication(AppComponent, AppConfig)
  .catch(err => console.error(err));
