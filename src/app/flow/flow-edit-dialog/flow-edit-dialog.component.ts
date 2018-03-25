import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { Subscription } from 'rxjs/Subscription';

import { Flow } from '../models';

@Component({
  selector: 'app-flow-edit-dialog',
  templateUrl: './flow-edit-dialog.component.html',
  styleUrls: ['./flow-edit-dialog.component.css']
})
export class FlowEditDialogComponent {
  public flowForm: FormGroup;
  private flow: Flow;
  private formSubscription: Subscription
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { flow: Flow },
    public dialogRef: MatDialogRef<FlowEditDialogComponent>
  ) {
    this.flow = Object.assign({}, data.flow, { '$key': data.flow['$key'] });;
    this.flowForm = new FormGroup({
      name: new FormControl(data.flow.name, [Validators.required])
    });

    this.formSubscription = this.flowForm.valueChanges.subscribe(
      (c: { name: string }) => {
        this.flow.name = c.name;
      },
      (err: any) => console.error('Error on form value changes: ', err)
    );
  }

  public save(): void {
    this.dialogRef.close({
      flow: this.flow
    });
  }

}
