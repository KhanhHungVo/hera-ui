import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, AuthenticationService } from '@app/core/services';
import { SocialUser } from 'angularx-social-login';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {
    form: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    user: SocialUser;
    loggedIn: boolean;
    serverToken: string = '';

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthenticationService,
        private alertService: AlertService,
        private http: HttpClient
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    async onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        await this.authService.login(this.f.username.value, this.f.password.value)
        .catch(error => {
            this.alertService.error(error);
            this.loading = false;
        })
            // .pipe(first())
            // .subscribe(
            //     data => {
            //         this.router.navigate([this.returnUrl]);
            //     },
            //     error => {
            //         this.alertService.error(error);
            //         this.loading = false;
            //     });
    }

    async signInWithGoogle() {
        await this.authService.signInWithGoogle()
        .catch(error => {
            this.alertService.error(error);
            this.loading = false;
        });
    }
    
    async signInWithFB(): Promise<void> {
        this.authService.signInWithFacebook()
        .catch(error => {
            this.alertService.error(error);
            this.loading = false;
        });
    }

}
