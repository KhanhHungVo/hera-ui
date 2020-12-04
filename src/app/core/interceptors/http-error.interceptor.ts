
import { AuthenticationService } from '@app/core/services';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService : AuthenticationService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                // auto logout if 401 response returned from api
                this.authenticationService.logout();
            }
            
            let errorMessage = err.error || '';
            switch(err.status){
                case 401:
                    errorMessage = 'User name or password is not correct';
                    break;
                case 0:
                    errorMessage = err.message;
                    break;
                default: 
                    errorMessage = (typeof err.error === 'string') ? err.error : 'Server error !'
            }
            return throwError(errorMessage);
        }))
    }
}