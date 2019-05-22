import {Component, HostBinding, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';

import {AppStates, selectAuthorizationState} from '../../../../app.states';

@Component({
  selector: 'app-welcome-pages-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  @HostBinding('class') class = 'card mb-auto mt-auto';

  getState: Observable<any>;
  isAuthenticated: false;
  user = null;
  errorMessage = null;

  constructor(
    private store: Store<AppStates>
  ) {
    this.getState = this.store.select(selectAuthorizationState);
  }

  ngOnInit() {
  }
}
