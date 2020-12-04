

import { User } from '../models';

import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, from, throwError } from 'rxjs';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map, catchError, retry } from 'rxjs/operators';
import { AuthService, GoogleLoginProvider, SocialUser, FacebookLoginProvider } from 'angularx-social-login';
import { Router, ActivatedRoute } from '@angular/router';
import { error } from '@angular/compiler/src/util';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private user: SocialUser;
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  private url: string;
  private endPoint: string;
  private googleSingInUrl: string = `${environment.apiUrl}/Authentication/sigin-google`;
  private fbSignInUrl: string = `${environment.apiUrl}/Authentication/signin-facebook`;
  private basicSignInUrl: string = `${environment.apiUrl}/Authentication/login`;
  private returnUrl: string = '/';
  serverToken: string;
  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private authService: AuthService)  {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
     // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }


  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  // login(username: string, password: string): Observable<User> {
  //   return this.http.post<User>( this.basicSigInUrl , { username, password })
  //     .pipe(map(user => {
  //       // store user details and jwt token in local storage to keep user logged in between page refreshes
  //       localStorage.setItem('token', JSON.stringify(user));
  //       localStorage.setItem('currentUser', JSON.stringify(user));
  //       this.currentUserSubject.next(user);
  //       return user;
  //     }));
  // }

  async login(username: string, password: string): Promise<void> {
    var getToken = await this.http.post<User>( this.basicSignInUrl , { username, password })
    .toPromise();
    await this.setTokenAndRedirect(getToken);
  }

  async signInWithGoogle(): Promise<void> {

    var googleAccount = await this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    if (googleAccount != null) {
      let googleUserInfo = {
        tokenId: googleAccount.idToken,
        email: googleAccount.email,
        firstName: googleAccount.firstName,
        lastName: googleAccount.lastName,
        profilePicture: googleAccount.photoUrl
      }
      //var getToken = this.http.post<any>(this.googleSingInUrl, googleUserInfo).toPromise();
      // return await getToken.then(data => {
      //   localStorage.setItem('token', JSON.stringify(data));
      //   localStorage.setItem('currentUser', JSON.stringify(data));
      //   this.currentUserSubject.next(data);
      // })
      let getToken = await this.http.post<any>(this.googleSingInUrl, googleUserInfo)
      .toPromise();
      await this.setTokenAndRedirect(getToken);
    }
  }

  async signInWithFacebook(): Promise<void> {
    let fbAccount = await this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    if (fbAccount != null) {
      let fbUserInfo = {
        userId: fbAccount.id,
        tokenId: fbAccount.authToken,
        email: fbAccount.email,
        firstName: fbAccount.firstName,
        lastName: fbAccount.lastName,
        profilePicture: fbAccount.photoUrl
      }
      // var getToken = this.http.post<any>(this.fbSignInUrl, fbUserInfo).toPromise();
      // return await getToken.then(data => {
      //   localStorage.setItem('token', JSON.stringify(data));
      //   localStorage.setItem('currentUser', JSON.stringify(data));
      //   this.currentUserSubject.next(data);
      // })
      let getToken = await this.http.post<any>(this.fbSignInUrl, fbUserInfo)
      .toPromise();
      await this.setTokenAndRedirect(getToken);
    }

    
  }
  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  register(user: User) {
    return this.http.post(`${environment.apiUrl}/Authentication/register`, user);
  }

  getAll() {
    return this.http.get<User[]>(`${environment.apiUrl}/users`);
  }

  getById(id: string) {
    return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
  }

  update(id, params) {
    return this.http.put(`${environment.apiUrl}/users/${id}`, params)
      .pipe(map(x => {
        // update stored user if the logged in user updated their own record
        if (id == this.currentUserValue.id) {
          // update local storage
          const user = { ...this.currentUserValue, ...params };
          localStorage.setItem('currentUser', JSON.stringify(user));

          // publish updated user to subscribers
          this.currentUserSubject.next(user);
        }
        return x;
      }));
  }

  delete(id: string) {
    return this.http.delete(`${environment.apiUrl}/users/${id}`)
      .pipe(map(x => {
        // auto logout if the logged in user deleted their own record
        if (parseInt(id) == this.currentUserValue.id) {
          this.logout();
        }
        return x;
      }));
  }

  getUserInfo() {
    return this.http.get<User>(`${environment.apiUrl}/users/info`);
  }

  async setTokenAndRedirect(data) {
    localStorage.setItem('token', JSON.stringify(data));
    var user = await this.getUserInfo().toPromise();
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
    this.router.navigate([this.returnUrl]);
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';

    if (error.error instanceof ErrorEvent) {
      //error client
      errorMessage = error.error.message;
    } else {
      //error server
      errorMessage = `Server error status: ${error.status}, ` + `message : ${error.message}`;
    }

    return throwError(errorMessage);
  }
}
