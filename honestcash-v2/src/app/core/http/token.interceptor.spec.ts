import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';

import { TokenInterceptor } from './token.interceptor';
import {MockAuthenticationService} from '..';
import {AuthenticationService} from '../services/authentication.service';

describe('TokenInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let authenticationService: MockAuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TokenInterceptor,
          multi: true
        }
      ]
    });
  });

  beforeEach(inject([HttpClient, HttpTestingController, AuthenticationService], (_http: HttpClient, _httpMock: HttpTestingController, _authenticationService: MockAuthenticationService) => {
    http = _http;
    httpMock = _httpMock;
    authenticationService = _authenticationService;
  }));

  afterEach(() => {
    httpMock.verify();
  });

  it('should append token to the request headers as x-auth-token if the user is authenticated', () => {
    authenticationService.isAuthenticated = true;
    // Act
    http.get('http://test.com/toto').subscribe();

    // Assert
    const httpRequest = httpMock.expectOne({ url: 'http://test.com/toto' });
    expect(httpRequest.request.headers.has('x-auth-token')).toEqual(true);
  });

  it('should not append token to the request headers as x-auth-token if the user is not authenticated', () => {
    authenticationService.isAuthenticated = false;
    // Act
    http.get('http://test.com/toto').subscribe();

    // Assert
    const httpRequest = httpMock.expectOne({ url: 'http://test.com/toto' });
    expect(httpRequest.request.headers.has('x-auth-token')).toEqual(false);
  });
});