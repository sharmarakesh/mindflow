import { NgModule } from '@angular/core';

import { GraphComponent } from './graph.component';
import { GraphService } from './graph.service';

@NgModule({
  declarations: [GraphComponent],
  providers: [GraphService]
})
export class GraphModule { }
