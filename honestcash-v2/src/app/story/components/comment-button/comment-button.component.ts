import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import Story from '../../models/story';
import {Store} from '@ngrx/store';
import {AppStates} from '../../../app.states';
import {StoryCommentClicked, StoryCommentDraftLoad} from '../../store/story.actions';

@Component({
  selector: 'story-comment-button',
  templateUrl: './comment-button.component.html',
  styleUrls: ['./comment-button.component.scss']
})
export class StoryCommentButtonComponent implements OnInit {
  @Input() public parentStory: Story;
  constructor(
    private store: Store<AppStates>,
  ) { }

  public ngOnInit() {
  }

  public onReplyClicked() {
    this.store.dispatch(new StoryCommentDraftLoad(this.parentStory.id));
  }

}