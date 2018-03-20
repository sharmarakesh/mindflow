import { NgModule } from '@angular/core';

import { CoreModule } from '../core/core.module';
import { FlowComponent } from './flow.component';
import { FlowService } from './flow.service';
import { FlowEditDialogComponent } from './flow-edit-dialog/flow-edit-dialog.component';
import { IdeaEditDialogComponent } from './idea-edit-dialog/idea-edit-dialog.component';

@NgModule({
  imports: [CoreModule],
  entryComponents: [FlowEditDialogComponent, IdeaEditDialogComponent],
  declarations: [FlowComponent, FlowEditDialogComponent, IdeaEditDialogComponent],
  providers: [FlowService]
})
export class FlowModule { }
