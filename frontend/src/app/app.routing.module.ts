import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {LoginPageComponent} from './pages/login/login-page.component';
import {GroupsPageComponent} from './pages/groups/groups-page.component';
import {GroupPageComponent} from './pages/group/group-page.component';
import {UsersAdministrationComponent} from './pages/admin/users-administration';
import {GroupsAdministrationComponent} from './pages/admin/groups-administration';

const routes: Routes = [
  {
    path: '',
    component: LoginPageComponent
  },
  {
    path: 'groups',
    component: GroupsPageComponent
  },
  {
    path: 'group/:id',
    component: GroupPageComponent
  },
  {
    path: 'admin/users',
    component: UsersAdministrationComponent
  },
  {
    path: 'admin/groups',
    component: GroupsAdministrationComponent
  },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
