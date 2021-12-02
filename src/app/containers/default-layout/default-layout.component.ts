import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AlertService, AuthenticationService } from '@app/core/services';
import { navItems } from '../../_nav';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent {
  
  constructor(
    private authService: AuthenticationService,
    private alertService: AlertService,
    private http: HttpClient
  ) { }

  public sidebarMinimized = false;
  public navItems = navItems;

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  async logOut() {
    debugger
    await this.authService.logout();
  }

}
