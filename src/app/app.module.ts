import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { dbConfig } from './db.config';
import { NgxIndexedDBModule } from 'ngx-indexed-db';
import { HeaderComponent } from './components/header/header.component';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { HttpClientModule } from "@angular/common/http";
import { TripDashboardModule } from "./components/trip-dashboard/trip-dashboard.module";
import { StateModule } from "./store/state.module";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NavMenuComponent
  ],
  imports: [
    NgxIndexedDBModule.forRoot(dbConfig),
    StateModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
    BrowserAnimationsModule,
    TripDashboardModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
