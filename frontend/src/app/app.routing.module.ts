import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {LoginPageComponent} from './pages/login/login-page.component';
import {GroupsPageComponent} from './pages/groups/groups-page.component';
import {GroupPageComponent} from './pages/group/group-page.component';
import {UsersAdministrationComponent} from './pages/admin/users-administration';
import {GroupsAdministrationComponent} from './pages/admin/groups-administration';
import {AuthGuardService} from './services/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    component: LoginPageComponent
  },
  {
    path: 'groups',
    canActivate: [ AuthGuardService ],
    component: GroupsPageComponent
  },
  {
    path: 'group/:id',
    canActivate: [ AuthGuardService ],
    component: GroupPageComponent
  },
  {
    path: 'admin/users',
    canActivate: [ AuthGuardService ],
    component: UsersAdministrationComponent
  },
  {
    path: 'admin/groups',
    canActivate: [ AuthGuardService ],
    component: GroupsAdministrationComponent
  },  {
    path: 'invite',
    canActivate: [ AuthGuardService ],
    component: GroupsAdministrationComponent
  },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
