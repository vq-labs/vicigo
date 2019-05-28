import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import EditorJS, {EditorConfig} from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Link from '@editorjs/link';
import Image from '@editorjs/image';
import List from '@editorjs/list';
import Embed from '@editorjs/embed';
import Quote from '@editorjs/quote';
import Paragraph from '@editorjs/paragraph';
import Code from '@editorjs/code';
import Marker from '@editorjs/marker';
import Delimiter from '@editorjs/delimiter';
import Post from '../../../../shared/models/post';
import {Store} from '@ngrx/store';
import {AppStates, selectEditorState} from '../../../../app.states';
import {interval, Observable, Subscription} from 'rxjs';
import {EDITOR_STATUS, State as EditorState} from '../../../../store/editor/editor.state';
import {EditorChange, EditorLoad, EditorStoryPropertySave, EditorUnload} from '../../../../store/editor/editor.actions';
import {EditorService, STORY_PROPERTIES} from '../../services/editor.service';
import {Block} from '../../converters/json-to-html';

export const EDITOR_AUTO_SAVE = {
  ON: false,
  INTERVAL: 5000,
};

export interface HonestEditorConfig extends EditorConfig {
  tools: {
    header: {
      class: Header,
      inlineToolbar: boolean,
    };
    link: {
      class: Link;
      inlineToolbar: boolean;
    };
    image: {
      class: Image;
      inlineToolbar: boolean;
      config: {} // needs to be populated in constructor for upload
    };
    list: {
      class: List;
      inlineToolbar: boolean;
    };
    embed: Embed;
    quote: Quote;
    paragraph: {
      class: Paragraph;
      inlineToolbar: boolean;
    };
    code: Code;
    Marker: Marker;
    delimiter: Delimiter;
  };
  onChange?: () => void;
}

@Component({
  selector: 'editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, OnDestroy {
  @Input() public story: Post;
  public saveStatus: EDITOR_STATUS;
  public hasEditorInitialized = false;
  readonly editor: EditorJS;
  private editorConfig: HonestEditorConfig = {
    holder: 'editor',
    autofocus: true,
    initialBlock: 'paragraph',
    tools: {
      header: {
        class: Header,
        inlineToolbar: true,
      },
      link: {
        class: Link,
        inlineToolbar: true,
      },
      image: {
        class: Image,
        inlineToolbar: true,
        config: {} // needs to be populated in constructor for upload
      },
      /*checklist: {
        class: Checklist,
        inlineToolbar: true,
      },*/
      list: {
        class: List,
        inlineToolbar: true,
      },
      embed: Embed,
      quote: Quote,
      paragraph: {
        class: Paragraph,
        inlineToolbar: true,
      },
      code: Code,
      Marker: Marker,
      delimiter: Delimiter,
      /*warning: Warning,*/
    },
    onChange: this.onEditorChange.bind(this)
  };
  public editorStateObservable: Observable<EditorState>;
  public editorState$: Subscription;
  private autosaveIntervalObservable = interval(EDITOR_AUTO_SAVE.INTERVAL);
  private autoSaveInterval$: Subscription;

  constructor(
    private store: Store<AppStates>,
    private editorService: EditorService,
  ) {
    this.editorConfig.tools.image.config = {
      uploader: {
        uploadByFile: this.uploadImage.bind(this),
        uploadByUrl: this.downloadImageFromUrlAndUpload.bind(this)
      }
    };
    this.editor = new EditorJS(this.editorConfig);
    this.editor.isReady.then(() => {
      this.store.dispatch(new EditorLoad({story: this.story, editor: this.editor}));
    });
    this.editorStateObservable = this.store.select(selectEditorState);
  }

  ngOnInit() {
    this.editorState$ = this.editorStateObservable
    .subscribe((editorState: EditorState) => {
      this.saveStatus = editorState.status;

      if (editorState.status === EDITOR_STATUS.Initialized && !this.hasEditorInitialized) {
        this.editor.blocks.clear();
        if (this.story.bodyJSON) {
          this.editor.blocks.render({blocks: <Block[]>this.story.bodyJSON});
        }
        this.hasEditorInitialized = true;
      }
    });
  }

  onEditorChange() {
    this.editor.saver.save()
    .then((outputData) => {
      this.story.bodyJSON = <Block[]>outputData.blocks;
      this.store.dispatch(new EditorChange({story: this.story, editor: this.editor}));

      if (EDITOR_AUTO_SAVE.ON && this.saveStatus === EDITOR_STATUS.NotSaved) {
        this.autoSaveInterval$ = this.autosaveIntervalObservable.subscribe(() => {
          this.store.dispatch(new EditorStoryPropertySave({story: this.story, property: STORY_PROPERTIES.BodyJSON}));
        });
      }
    });
  }

  uploadImage(file: File) {
    return this.editorService.uploadImage(file).toPromise().then((response) => {
      return {
        success: 1,
        file: {
          url: response.files[0].url
        }
      };
    });
  }

  downloadImageFromUrlAndUpload(url: string) {
    return this.editorService.downloadImageFromUrl(url).toPromise().then(response => {
      return {
        success: 1,
        file: {
          url: response.files[0].url
        }
      };
    });
  }

  ngOnDestroy() {
    if (this.editor && this.editor.destroy) {
      this.editor.destroy();
      this.store.dispatch(new EditorUnload());
    }
    if (EDITOR_AUTO_SAVE.ON && this.autoSaveInterval$) {
      this.autoSaveInterval$.unsubscribe();
    }
    if (this.editorState$) {
      this.editorState$.unsubscribe();
    }
  }
}
