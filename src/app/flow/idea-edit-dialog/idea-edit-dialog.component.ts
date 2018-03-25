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
  public ideas: FlowIdea[];
  private idea: FlowIdea;
  private formSubscription: Subscription
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { idea: FlowIdea, connections: FlowConnection[], ideas: FlowIdea[] },
    public dialogRef: MatDialogRef<IdeaEditDialogComponent>
  ) {
    this.idea = Object.assign({}, data.idea);
    // Parse the source and target in connections from objects to id's
    this.connections = [...data.connections.map((c: FlowConnection) => new FlowConnection(c.source.hasOwnProperty('index') ? (<FlowIdea>c.source).index : c.source, c.target.hasOwnProperty('index') ? (<FlowIdea>c.target).index : c.target, c.distance, c.strength))];
    this.ideas = data.ideas.filter((i: FlowIdea) => i.index !== this.idea.index);
    this.ideaForm = new FormGroup({
      color: new FormControl(data.idea.color, [Validators.required]),
      description: new FormControl(data.idea.description, [Validators.required]),
      name: new FormControl(data.idea.name, [Validators.required, Validators.maxLength(50)]),
      r: new FormControl(data.idea.r, [Validators.required])
    });

    this.formSubscription = this.ideaForm.valueChanges.subscribe(
      (c: { color: string, description: string, id: string, name: string, r: number }) => {
        this.idea.color = c.color;
        this.idea.description = c.description;
        this.idea.name = c.name;
        this.idea.r = c.r;
      },
      (err: any) => console.error('Error on form value changes: ', err)
    );
  }

  public addConnection(): void {
    this.connections.push(new FlowConnection('', '', 0, 0));
  }

  public removeConnection(i: number): void {
    this.connections.splice(i, 1);
  }

  public save(): void {
    if (this.connections.length) {
      this.connections.forEach((c: FlowConnection) => {
        if (!c.source) {
          c.source = this.idea.index || this.data.ideas.length;
        }
      });
    } else if (!this.data.ideas.length) {
      this.connections = [new FlowConnection(this.idea.index || 0, this.idea.index || 0, 0, 0)];
    }

    this.dialogRef.close({
      idea: this.idea,
      connections: this.connections.filter((c: FlowConnection) => c.target !== '')
    })
  }

}
