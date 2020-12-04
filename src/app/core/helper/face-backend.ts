import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import { User } from '../models';


const users: User[] =  JSON.parse(localStorage.getItem('users')) || [{ id: '1', userName: 'test', password: 'test', firstName: 'Test', lastName: 'User', email: 'test@test.com', dateOfBirth: '1990-06-14' , phoneNumber: '123455777'}];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        // wrap in delayed observable to simulate server api call
        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .pipe(delay(500))
            .pipe(dematerialize());

        function handleRoute() {
            switch (true) {
                case url.endsWith('/Authentication/login') && method === 'POST':
                    return authenticate();
                case (url.endsWith('/Authentication/sigin-google') || url.endsWith('/Authentication/signin-facebook') ) && method === 'POST':
                    return authenticateWithOAuth();
                case url.endsWith('/users') && method === 'GET':
                    return getUsers();
                case url.endsWith('/users/info') && method === 'GET':
                    return getUserByToken();
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
            }    
        }

        // route functions

        function authenticate() {
            const { username, password } = body;
            const user = users.find(x => x.userName === username && x.password === password);
            if (!user) return error('Username or password is incorrect');
            return ok({
                id: user.id,
                userName: user.userName,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                token: 'fake-jwt-token',
                dateOfBirth: user.dateOfBirth,
                phoneNumber: user.phoneNumber 
            })
        }

        function authenticateWithOAuth() {
            const {tokenId, email, firstName, lastName, profilePicture } = body;
            return ok({
                id: 2,
                userName: email,
                email: email,
                firstName: firstName,
                lastName: lastName,
                providerTokenId: tokenId,
                profilePicture: profilePicture,
                token: 'fake-jwt-token-oauth'
            });
        }

        function getUserByToken() {
            var user = JSON.parse(localStorage.getItem('token'));
            return ok(user);
        }

        function getUsers() {
            if (!isLoggedIn()) return unauthorized();
            return ok(users);
        }

        // helper functions

        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }))
        }

        function error(message) {
            return throwError({ error: { message } });
        }

        function unauthorized() {
            return throwError({ status: 401, error: { message: 'Unauthorised' } });
        }

        function isLoggedIn() {
            return headers.get('Authorization') === 'Bearer fake-jwt-token';
        }
    }
}

export let fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};