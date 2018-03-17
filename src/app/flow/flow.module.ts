import { NgModule } from '@angular/core';

import { CoreModule } from '../core/core.module';
import { FlowComponent } from './flow.component';
import { FlowService } from './flow.service';

@NgModule({
  imports: [CoreModule],
  declarations: [FlowComponent],
  providers: [FlowService]
})
export class FlowModule { }
