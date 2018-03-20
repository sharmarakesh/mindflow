import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { Subscription } from 'rxjs/Subscription';

import { FlowIdea, FlowConnection } from '../models';

@Component({
  selector: 'app-idea-edit-dialog',
  templateUrl: './idea-edit-dialog.component.html',
  styleUrls: ['./idea-edit-dialog.component.css']
})
export class IdeaEditDialogComponent {
  public connections: FlowConnection[];
  public ideaForm: FormGroup;
  private idea: FlowIdea;
  private formSubscription: Subscription
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { idea: FlowIdea, connections: FlowConnection[], ideas: FlowIdea[] },
    public dialogRef: MatDialogRef<IdeaEditDialogComponent>
  ) {
    this.idea = data.idea;
    this.connections = data.connections;
    this.ideaForm = new FormGroup({
      color: new FormControl(data.idea.color, [Validators.required]),
      description: new FormControl(data.idea.description, [Validators.required]),
      id: new FormControl(data.idea.id, [Validators.required]),
      name: new FormControl(data.idea.name, [Validators.required])
    });

    this.formSubscription = this.ideaForm.valueChanges.subscribe(
      (c: { color: string, description: string, id: string, name: string }) => {
        this.idea.color = c.color;
        this.idea.description = c.description;
        this.idea.id = c.id;
        this.idea.name = c.name;
      },
      (err: any) => console.error('Error on form value changes: ', err)
    );
  }

  public addConnection(): void {
    this.connections.push(new FlowConnection('', '', 0, 0));
  }

  public save(): void {
    if (this.connections.length) {
      this.connections.forEach((c: FlowConnection) => {
        c.source = this.idea.id;
      });
    } else if (!this.data.ideas.length) {
      this.connections = [new FlowConnection(this.idea.id, this.idea.id, 0, 0)];
    }
    this.dialogRef.close({
      idea: this.idea,
      connections: this.connections
    })
  }

}
