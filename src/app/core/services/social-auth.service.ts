import { Injectable } from '@angular/core';
import { BaseHttpService } from '.';
import { User } from '../model';
import { SocialUser, AuthService } from 'angularx-social-login';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SocialAuthService extends BaseHttpService<User>{
  user: SocialUser;
  constructor(private socialAuthService: AuthService, httpClient: HttpClient) { 
    super(
      httpClient,
      'http://127.0.0.1:5000/api/Authentication/',
      ''
    )
  };
}
