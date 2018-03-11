import { NgModule } from '@angular/core';

import { CoreModule } from '../core/core.module';
import { GraphComponent } from './graph.component';
import { GraphService } from './graph.service';

@NgModule({
  imports: [CoreModule],
  declarations: [GraphComponent],
  providers: [GraphService]
})
export class GraphModule { }
