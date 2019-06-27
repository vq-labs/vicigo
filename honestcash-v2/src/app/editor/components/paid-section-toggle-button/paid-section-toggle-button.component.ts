import {Component, OnInit} from '@angular/core';
import {EditorStoryPropertyChange} from '../../store/editor.actions';
import {Store} from '@ngrx/store';
import {AppStates, selectEditorState} from '../../../app.states';
import {Observable, Subscription} from 'rxjs';
import Story from '../../../main/models/story';
import {STORY_PROPERTIES} from '../../shared/editor.story-properties';
import {EditorState} from '../../store/editor.state';

@Component({
  selector: 'editor-paid-section-toggle-button',
  templateUrl: './paid-section-toggle-button.component.html',
  styleUrls: ['./paid-section-toggle-button.component.scss']
})
export class EditorPaidSectionToggleButtonComponent implements OnInit {

  public story: Story;
  private editor$: Observable<EditorState>;
  private editorSub: Subscription;

  constructor(
    private store: Store<AppStates>,
  ) {
    this.editor$ = this.store.select(selectEditorState);
  }

  public ngOnInit() {
    this.editorSub = this.editor$
    .subscribe((editorState: EditorState) => {
      this.story = editorState.story;
    });
  }

  public onChangeHasPaidSection() {
    this.store.dispatch(new EditorStoryPropertyChange({property: STORY_PROPERTIES.HasPaidSection, value: this.story.hasPaidSection}));
  }

}