import { Injectable } from '@angular/core';

import { ThenableReference } from '@firebase/database-types';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';

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
    flow.ideas.forEach((i: FlowIdea) => {
      for (let key in i) {
        if (!i[key]) {
          delete i[key];
        }
      }
    });
    if ('$key' in flow) {
      return this.db.list(`/${this.authSvc.authId}/flows`).update(flow['$key'], flow);
    } else {
      return this.db.list(`/${this.authSvc.authId}/flows`).push(flow);
    }
  }
}
