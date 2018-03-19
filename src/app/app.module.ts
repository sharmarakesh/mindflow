import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { AngularFireStorageModule } from 'angularfire2/storage';

import { AdminModule } from './admin/admin.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { environment } from '../environments/environment';
import { FlowModule } from './flow/flow.module';
import { FlowEditDialogComponent } from './flows/flow-edit-dialog/flow-edit-dialog.component';

@NgModule({
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase, 'Mindflow'),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    AdminModule,
    AppRoutingModule,
    CoreModule,
    FlowModule
  ],
  declarations: [AppComponent, FlowEditDialogComponent],
  bootstrap: [AppComponent],
  providers: [AngularFireDatabase]
})
export class AppModule { }
