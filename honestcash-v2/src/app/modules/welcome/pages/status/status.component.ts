import { Component, OnInit, HostBinding } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppStates } from '../../../../app.states';
import { GetStatus } from '../../../../core/store/auth/auth.actions';

@Component({
  selector: 'app-welcome-page-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit {
  @HostBinding('class') class = 'card mb-auto mt-auto';

  constructor(private store: Store<AppStates>) { }

  ngOnInit() {
    this.store.dispatch(new GetStatus);
  }

}
