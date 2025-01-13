import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';


// Import Bootstrap JS
import 'bootstrap'; // This imports Bootstrap's JavaScript functionality

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
