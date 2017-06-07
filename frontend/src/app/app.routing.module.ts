import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {LoginPageComponent} from './pages/login/login-page.component';
import {GroupsPageComponent} from './pages/groups/groups-page.component';
import {GroupPageComponent} from './pages/group/group-page.component';

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
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
