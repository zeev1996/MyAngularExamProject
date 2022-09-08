import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/Repository/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  userId: string;
  isTeacher:boolean;
  isAdmin:boolean;
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.userId = this.authService.getUserId();
    this.isTeacher=this.authService.getUserType();
    this.isAdmin=this.authService.getAdminUser();
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.isTeacher=this.authService.getUserType();
        this.userId = this.authService.getUserId();
        this.isAdmin=this.authService.getAdminUser();
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
