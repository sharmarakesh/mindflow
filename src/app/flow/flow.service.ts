import { Injectable } from '@angular/core';

import { ThenableReference } from '@firebase/database-types';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';

import { cloneDeep } from 'lodash';

import { AuthService } from '../admin/auth.service';
import { Flow, FlowConnection, FlowIdea } from './models';
import { FirebaseError } from '@firebase/util';

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

  public saveFlow(flow: Flow): Promise<void> {
    return new Promise((resolve, reject) => {
      const key: string = flow['$key'];
      const newFlow: Flow = this.serializeFlow(flow);
      if (key) {
        this.db.list(`/${this.authSvc.authId}/flows`).update(key, newFlow)
          .then(() => resolve())
          .catch((err: FirebaseError) => reject(err));
      } else {
        this.db.list(`/${this.authSvc.authId}/flows`).push(newFlow)
          .then(() => resolve());
      }
    });
  }

  private serializeFlow(flow): Flow {
    // Clone the flow
    const newFlow: Flow = Object.assign({}, flow);

    // Remove the firebase key
    delete newFlow['$key'];

    // Remove undefined or null properties used by d3 from flow ideas
    if (newFlow.ideas) {
      newFlow.ideas.forEach((i: FlowIdea) => {
        for (let key in i) {
          if (!i[key] && i[key] !== 0) {
            delete i[key];
          }
        }
      });
    }

    // Parse the source and target in connections from objects to id's
    if (newFlow.connections) {
      newFlow.connections = [...flow.connections.map((c: FlowConnection) => new FlowConnection(c.source.hasOwnProperty('index') ? (<FlowIdea>c.source).index : c.source, c.target.hasOwnProperty('index') ? (<FlowIdea>c.target).index : c.target, c.distance, c.strength))];
    }

    return newFlow;
  }
}
