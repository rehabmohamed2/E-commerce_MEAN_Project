import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser'; // Import BrowserModule here
import { AppComponent } from './app.component'; // Import your AppComponent
import { RouterModule } from '@angular/router'; // Import RouterModule if using routing

@NgModule({
  declarations: [
    // Declare non-standalone components here if you have any
  ],
  imports: [
    BrowserModule, // Import BrowserModule here
    RouterModule // Add RouterModule if you are using routing in your application
  ],
  providers: [],
  bootstrap: [AppComponent] // Bootstrapping the AppComponent
})
export class AppModule {}
