import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';
import Post from '../../../core/models/post';
import {HttpService} from '../../../core';
import blankBody from '../../../core/store/editor/editor.story.body.initial-value';
import {EmptyResponse} from '../../../core/models/authentication';
import Hashtag from '../../../core/models/hashtag';
import {delay} from 'rxjs/operators';
import {HttpHeaders} from '@angular/common/http';
import {ContentTypeFormDataHeader} from '../../../core/http/token.interceptor';

export interface DraftContext {
  parentPostId?: number;
  postId?: number;
}

export interface UploadImageResponse {
  files: [{ url: string; }];
}

export interface UploadImageEditorExpectedResponse {
  success: number;
  file: {
    url: string;
  };
}

export const API_ENDPOINTS = {
  getPost: (id: number) => `/post/${id}`,
  draft: (c: DraftContext = {}) =>
    c.parentPostId ? `/draft?parentPostId=${c.parentPostId}` : c.postId ? `/post/${c.postId}` : '/draft',
  newDraft: () => `/draft`,
  savePostProperty: (p: Post, property: 'title' | 'body' | 'hashtags' | 'paidSection') => `/draft/${p.id}/${property}`,
  saveDraft: (p: Post) => `/draft/${p.id}/body`,
  publishPost: (p: Post) => `/draft/${p.id}/publish`,
  uploadImage: () => `/upload/image`
};

export enum STORY_PROPERTIES {
  Title = 'title',
  Body = 'body',
  Hashtags = 'hashtags',
  PaidSection = 'paidSection',
}

@Injectable({
  providedIn: 'root'
})
export class EditorService {
  constructor(private http: HttpService) {}

  getPost(id: number): Observable<Post> {
    const post = new Post();
    post.title = 'asdf';
    post.body = blankBody;
    return of(post);
    // return this.http.get<Post>(API_ENDPOINTS.getPost(id));
  }

  loadPostDraft(draftContext: DraftContext): Observable<Post> {
    const post = new Post();
    post.title = 'asdf';
    post.body = blankBody;
    return of(post);
    // return this.http.get<Post>(API_ENDPOINTS.draft(draftContext));
  }

  loadNewPostDraft(): Observable<Post> {
    const post = new Post();
    post.title = 'asdf';
    post.body = blankBody;
    return of(post);
    // return this.http.post<Post>(API_ENDPOINTS.newDraft(), {});
  }

  savePostProperty(post: Post, property: STORY_PROPERTIES): Observable<EmptyResponse> {
    if (property === STORY_PROPERTIES.Hashtags && post.userPostHashtags.length > 0) {
      post.userPostHashtags = this.transformTags(<Hashtag[]>post.userPostHashtags);
    }
    return of({}).pipe(delay(6000));
    // return this.http.put<Post>(API_ENDPOINTS.savePostProperty(post, property), post);
  }

  publishPost(post: Post): Observable<Post> {
    console.log('publish');
    const _post = post;
    _post.publishedAt = new Date().toString();
    _post.createdAt = new Date().toString();
    _post.updatedAt = new Date().toString();
    return of(_post);
    // return this.http.put<Post>(API_ENDPOINTS.publishPost(post), post);
  }

  uploadImage(image: File): Observable<UploadImageResponse> {
    const formData = new FormData();
    formData.append('files[]', image, image.name);

    const httpOptions = {
      headers: new HttpHeaders().set(ContentTypeFormDataHeader, '')
    };

    return this.http.post<UploadImageResponse>(API_ENDPOINTS.uploadImage(), formData, httpOptions);
  }

  private transformTags(tags: Hashtag[]): string {
    return tags.map(h => h.hashtag).join(',');
  }
}