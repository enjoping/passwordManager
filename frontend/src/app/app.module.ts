import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { GroupService } from './services/group.service';
import EventService from './services/event/event.service';
import { LoginPageComponent } from './pages/login/login-page.component';
import { AppRoutingModule } from './app.routing.module';
import { LoginComponent } from './components/login/login.component';
import { GroupsPageComponent } from './pages/groups/groups-page.component';
import { SearchComponent } from './components/search/search.component';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { ContentBoxComponent } from './components/content-box/content-box.component';
import { GroupListComponent } from './components/groups/group-list.component';
import { CreateGroupComponent } from './components/groups/create-group/create-group.component';
import { GroupRepositoryService } from './services/repositories/group-repository.service';
import { GroupPageComponent } from './pages/group/group-page.component';
import { SecurityNoteRepositoryService } from './services/repositories/security-note-repository.service';
import { SecurityNoteService } from './services/security-note.service';
import { CredentialListComponent } from './components/credentials/credential-list.component';
import { AddCredentialComponent } from './components/credentials/add-credentials/add-credentials.component';
import { UserRepositoryService } from './services/repositories/user-repository.service';
import { UsersAdministrationComponent } from './pages/admin/users-administration';
import { GroupsAdministrationComponent } from './pages/admin/groups-administration';
import { UsersComponent } from './components/users/users.component';
import { UserService } from './services/user.service';
import { LoginService } from './services/login.service';
import { CreateUserComponent } from './components/users/create-user/create-user.component';
import { AuthGuardService } from './services/auth-guard.service';
import { AdminGroupsComponent } from './components/groups/admin-groups/admin-groups.component';
import { ClipboardModule } from 'ngx-clipboard/dist';
import { MemberService } from './services/member.service';
import { MemberRepositoryService } from './services/repositories/member-repository.service';
import { InviteService } from './services/invite.service';
import { InviteRepositoryService } from './services/repositories/invite-repository.service';
import { InviteComponent } from './components/invite/invite.component';
import { InvitePageComponent } from './pages/invite/invite-page.component';
import { ConfirmDialogComponent } from './components/dialogs/confirm-dialog.component';
import { RegisterService } from './services/register.service';


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
      AdminGroupsComponent,
      InviteComponent,
      InvitePageComponent,
      ConfirmDialogComponent
    ],
    imports: [
      AppRoutingModule,
      BrowserModule,
      FormsModule,
      HttpModule,
      NgbModule.forRoot(),
      ClipboardModule
    ],
    entryComponents: [
      CreateGroupComponent,
      CreateUserComponent,
      AddCredentialComponent,
      ConfirmDialogComponent
    ],
    /*
      ERROR thrown: Cannot read property 'provide' of null. App worked fine, even with the error thrown, but
      CI crashed.
      Never seen it before. Fixed it with these instructions by changing the providers to the following format:
        https://github.com/angular/angular-cli/issues/3834
     */
    providers: [
      { useClass: EventService, provide: EventService },
      { useClass: LoginService, provide: LoginService },
      { useClass: GroupService, provide: GroupService },
      { useClass: UserService, provide: UserService },
      { useClass: SecurityNoteService, provide: SecurityNoteService },
      { useClass: MemberService, provide: MemberService },
      { useClass: InviteService, provide: InviteService },
      { useClass: AuthGuardService, provide: AuthGuardService },
      { useClass: SecurityNoteRepositoryService, provide: SecurityNoteRepositoryService },
      { useClass: GroupRepositoryService, provide: GroupRepositoryService },
      { useClass: UserRepositoryService, provide: UserRepositoryService },
      { useClass: MemberRepositoryService, provide: MemberRepositoryService },
      { useClass: RegisterService, provide: RegisterService },
      { useClass: InviteRepositoryService, provide: InviteRepositoryService }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
