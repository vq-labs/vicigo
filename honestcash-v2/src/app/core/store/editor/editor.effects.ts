import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import {
  EditorActionTypes,
} from './editor.actions';

@Injectable()
export class EditorEffects {

  constructor(
    private actions: Actions,
  ) {}

  @Effect()
  EditorLoad: Observable<any> = this.actions.pipe(
    ofType(EditorActionTypes.EDITOR_LOAD),
  );

  @Effect()
  EditorUnload: Observable<any> = this.actions.pipe(
    ofType(EditorActionTypes.EDITOR_UNLOAD),
  );
}