import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {LoginPage} from './pages/login.page';

const routes: Routes = [
  {
    path: '',
    component: LoginPage
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {

}
