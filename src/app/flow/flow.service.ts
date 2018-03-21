import { Injectable } from '@angular/core';

import { ThenableReference } from '@firebase/database-types';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';

import { cloneDeep } from 'lodash';

import { AuthService } from '../admin/auth.service';
import { Flow, FlowConnection, FlowIdea } from './models';

@Injectable()
export class FlowService {
  constructor(
    private authSvc: AuthService,
    private db: AngularFireDatabase
  ) { }

  public getFlows(): FirebaseListObservable<Flow[]> {
    return this.db.list(`/${this.authSvc.authId}/flows`);
  }

  public removeFlow(flow: Flow): Promise<void> {
    return this.db.list(`/${this.authSvc.authId}/flows`).remove(flow['$key']);
  }

  public saveFlow(flow: Flow): Promise<void> | ThenableReference {
    const key: string = flow['$key'];
    const newFlow: Flow = this.serializeFlow(flow);
    if (key) {
      return this.db.list(`/${this.authSvc.authId}/flows`).update(key, newFlow);
    } else {
      return this.db.list(`/${this.authSvc.authId}/flows`).push(newFlow);
    }
  }

  private serializeFlow(flow): Flow {
    // Clone the flow
    const newFlow: Flow = Object.assign({}, flow);

    // Remove the firebase key
    delete newFlow['$key'];

    // Remove undefined or null properties used by d3 from flow ideas
    newFlow.ideas.forEach((i: FlowIdea) => {
      for (let key in i) {
        if (i[key] === null || i[key] === undefined) {
          delete i[key];
        }
      }
    });

    // Parse the source and target in connections from objects to id's
    newFlow.connections = [...flow.connections.map((c: FlowConnection) => new FlowConnection(c.source.hasOwnProperty('index') ? (<FlowIdea>c.source).index : c.source, c.target.hasOwnProperty('index') ? (<FlowIdea>c.target).index : c.target, c.distance, c.strength))];

    if (newFlow.connections.length > 1 && newFlow.connections[0].source === 0 && newFlow.connections[0].target === 0) {
      newFlow.connections.splice(0, 1);
    }
    
    return newFlow;
  }
}
