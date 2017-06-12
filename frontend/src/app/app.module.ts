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
import {TagInputModule} from 'ng2-tag-input';
import {CreateGroupComponent} from './components/groups/create-group/create-group.component';
import {GroupRepositoryService} from './services/repositories/group-repository.service';
import {GroupPageComponent} from './pages/group/group-page.component';
import {SecurityNoteRepositoryService} from './services/repositories/security-note-repository.service';
import {SecurityNoteService} from './services/security-note.service';
import {CredentialListComponent} from './components/credentials/credential-list.component';
import {AddCredentialComponent} from './components/credentials/add-credentials/add-credentials.component';
import {UserRepositoryService} from './services/repositories/user-repository.service';
import { UsersAdministrationComponent } from './pages/admin/users-administration';
import { GroupsAdministrationComponent } from './pages/admin/groups-administration';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { UsersComponent } from './components/users/users.component';
import UserService from './services/user.service';
import {LoginService} from './services/login.service';
import { CreateUserComponent } from './components/users/create-user/create-user.component';
import {AuthGuardService} from './services/auth-guard.service';
import { AdminGroupsComponent } from './components/groups/admin-groups/admin-groups.component';


Raven
  .config('https://46c8374abe074351a3639dc38d93efd4@sentry.io/175238')
  .install();

export class RavenErrorHandler implements ErrorHandler {
  handleError(err: any): void {
    console.log(err);
    Raven.captureException(err.originalError);
  }
}

@NgModule({
    declarations: [
      AppComponent,
      LoginPageComponent,
      GroupsPageComponent,
      GroupPageComponent,
      PageHeaderComponent,
      LoginComponent,
      SearchComponent,
      ContentBoxComponent,
      GroupListComponent,
      CredentialListComponent,
      CreateGroupComponent,
      AddCredentialComponent,
      UsersAdministrationComponent,
      GroupsAdministrationComponent,
      UsersComponent,
      CreateUserComponent,
      AdminGroupsComponent
    ],
    imports: [
      AppRoutingModule,
      BrowserModule,
      FormsModule,
      HttpModule,
      NgbModule.forRoot(),
      BrowserAnimationsModule
    ],
    entryComponents: [
      CreateGroupComponent,
      CreateUserComponent,
      AddCredentialComponent
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
      { provide: UserService, useClass: UserService },
      { provide: SecurityNoteService, useClass: SecurityNoteService },
      { provide: LoginService, useClass: LoginService },
      { provide: AuthGuardService, useClass: AuthGuardService },
      { provide: GroupRepositoryService, useClass: GroupRepositoryService },
      { provide: SecurityNoteRepositoryService, useClass: SecurityNoteRepositoryService },
      { provide: UserRepositoryService, useClass: UserRepositoryService },
      { provide: ErrorHandler, useClass: RavenErrorHandler }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
