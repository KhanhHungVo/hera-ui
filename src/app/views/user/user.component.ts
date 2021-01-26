
import { AlertService } from '@app/core/services';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, DebugElement, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SocialUser, AuthService, FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { User } from '@app/core/models';
import { AuthenticationService } from '@app/core/services';


// import { DisableControlDirective } from '@app/shared/directives/disable-control.directive';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  // @ViewChild(DisableControlDirective)
  user: User;
  userForm: FormGroup;
  isEditMode: boolean = false;
  constructor(private authService: AuthenticationService, private fb: FormBuilder, private actRoute: ActivatedRoute, private alertService: AlertService) {
    
  }

  get firstName() {
    return this.userForm.get('firstName');
  }

  get lastName() {
    return this.userForm.get('lastName');
  }
  get userName() {
    return this.userForm.get('userName');
  } 
  get fullName() {
    return `${this.firstName.value} ${this.lastName.value}`;
  }

  get email() {
    return this.userForm.get('email');
  }

  get phoneNumber() {
    return this.userForm.get('phoneNumber');
  }  

  get profilePicture() {
    return this.userForm.get('profilePicture').value;
  } 
  get dateOfBirth(){
    return this.userForm.get('dob').value;
  }

  date(e) {
    var convertDate = new Date(e.target.value).toISOString().substring(0, 10);
    this.userForm.get('dob').setValue(convertDate, {
      onlyself: true
    })
  }

  ngOnInit() {
    this.initialUserFormGroup();
    this.user = this.authService.currentUserValue;
    //const id = this.actRoute.snapshot.paramMap.get('id');
    //this.userForm.setValue(user);
    
    this.userForm.patchValue({
      userName: this.user.userName,
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
      profilePicture: this.user.profilePicture,
      dob: this.user.dateOfBirth,
      phoneNumber: this.user.phoneNumber
    })
  }

  onUpdateForm() {
    console.log(this.userForm.value);
    const id = this.actRoute.snapshot.paramMap.get('id');
    //this.authService.update(this.user.id, this.userForm.value);
    this.authService.update(id,{...{id: id},...this.userForm.value})
    .subscribe(
      data => {
          this.alertService.success('Update successful', { autoClose: true, keepAfterRouteChange: true });
      },
      error => {
          this.alertService.error(error, { autoClose: true, keepAfterRouteChange: false });
      }),
      () => this.isEditMode = false
  }
  initialUserFormGroup() {
    this.userForm = this.fb.group({
      userName: ['',[Validators.required]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: [''],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      phoneNumber: ['', [Validators.pattern('^[0-9]+$')]],
      dob:[''],
      profilePicture: ['']
    })
  }
  onChangeEditMode(){
    this.isEditMode = !this.isEditMode;
    console.log(this.isEditMode);
    // const state = this.isEditMode ? 'enable' : 'disable'  ;

    // Object.keys(this.userForm.controls).forEach((controlName) => {
    //     this.userForm.controls[controlName][state](); // disables/enables each form control based on 'this.formDisabled'
    // });

  }
  onExit(){
    this.isEditMode = false;
  }
}