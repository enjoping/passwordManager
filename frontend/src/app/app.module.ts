import { BrowserModule } from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import GroupService from './services/group.service';
import EventService from './services/event/event.service';
import * as Raven from 'raven-js';
import {LoginPageComponent} from './pages/login/login-page.component';
import {AppRoutingModule} from './app.routing.module';
import {LoginComponent} from './components/login/login.component';
import {GroupsPageComponent} from './pages/groups/groups-page.component';
import {SearchComponent} from './components/search/search.component';
import {PageHeaderComponent} from './components/page-header/page-header.component';
import {ContentBoxComponent} from './components/content-box/content-box.component';
import {GroupListComponent} from './components/groups/group-list.component';


Raven
  .config('https://46c8374abe074351a3639dc38d93efd4@sentry.io/175238')
  .install();

export class RavenErrorHandler implements ErrorHandler {
  handleError(err: any): void {
    Raven.captureException(err.originalError);
  }
}

@NgModule({
    declarations: [
      AppComponent,
      LoginPageComponent,
      GroupsPageComponent,
      PageHeaderComponent,
      LoginComponent,
      SearchComponent,
      ContentBoxComponent,
      GroupListComponent
    ],
    imports: [
      AppRoutingModule,
      BrowserModule,
      FormsModule,
      HttpModule,
      NgbModule.forRoot()
    ],
    /*
      ERROR thrown: Cannot read property 'provide' of null. App worked fine, even with the error thrown, but
      CI crashed.
      Never seen it before. Fixed it with these instructions by changing the providers to the following format:
        https://github.com/angular/angular-cli/issues/3834
     */
    providers: [
      { provide: GroupService, useClass: GroupService },
      { provide: EventService, useClass: EventService },
      { provide: ErrorHandler, useClass: RavenErrorHandler }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
