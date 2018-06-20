import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from 'angularfire2';
import { NgxHighlightJsModule } from '@nowzoo/ngx-highlight-js';

import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { NgxFireControlModule } from '@nowzoo/ngx-fire-control';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { FirebaseControlStatusComponent } from './firebase-control-status/firebase-control-status.component';
import { MinimalComponent } from './minimal/minimal.component';
import { CustomControlComponent } from './custom-control/custom-control.component';
import { ArrayOfStringsControlComponent } from './custom-control/array-of-strings-control.component';
import { RadiosComponent } from './radios/radios.component';

@NgModule({
  declarations: [
    AppComponent,
    FirebaseControlStatusComponent,
    MinimalComponent,
    CustomControlComponent,
    ArrayOfStringsControlComponent,
    RadiosComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    NgxFireControlModule,
    NgxHighlightJsModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
