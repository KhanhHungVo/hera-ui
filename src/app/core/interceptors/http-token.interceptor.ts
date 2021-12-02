import { JwtToken } from '@app/core/models';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services';
import { environment } from '@env/environment';


@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
    constructor(
        private authenticationService: AuthenticationService
    ){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<import("@angular/common/http").HttpEvent<any>> {
        // const user = this.authenticationService.currentUserValue;
        // const isLoggedIn = user && user.token;
        const  jwtToken:JwtToken = JSON.parse(localStorage.getItem('token'));

        const isApiUrl = req.url.startsWith(environment.apiUrl);
        if(jwtToken && isApiUrl){
            req = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${jwtToken.accessToken}`
                }
            });
        }
        return next.handle(req);
    }

    
}