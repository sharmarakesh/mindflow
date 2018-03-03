import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { GraphModule } from './graph/graph.module';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    GraphModule
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
