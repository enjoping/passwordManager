import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import GroupService from './services/group.service';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        NgbModule.forRoot()
    ],
    /*
      ERROR thrown: Cannot read property 'provide' of null. App worked fine, even with the error thrown, but
      CI crashed.
      Never seen it before. Fixed it with there instructions by changing the providers to the following format:
        https://github.com/angular/angular-cli/issues/3834
     */
    providers: [
      { provide: GroupService, useClass: GroupService }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
