import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AuthData } from "./auth-data.model";
import { response } from "express";

@Injectable({ providedIn: "root" })
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();
  private userId: string;
  private isTeacher:boolean;
  private isAdmin:boolean;
  constructor(private http: HttpClient, private router: Router) { }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }
  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }
getUserType()
{
return this.isTeacher
}
getAdminUser()
{
  return this.isAdmin
}
  createUser(email: string, password: string) {
    const authData: AuthData = {email: email, password: password};
    this.http.post("http://localhost:3000/api/users/signup", authData)
      .subscribe({
        next: () => this.router.navigate(["/"]),
        error: () => this.authStatusListener.next(false),
        complete:()=> console.log("user is added")
      })
    };

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post<{ token: string; expiresIn: number, userId: string, isTeacher:boolean, isAdmin:boolean }>(
        "http://localhost:3000/api/users/login",
        authData
      )
      .subscribe({
        next:response=>{const token = response.token;
        this.token = token;
        if (token) {
          this.isTeacher=response.isTeacher
          this.isAdmin = response.isAdmin
          this.userId = response.userId
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          console.log(expirationDate);
          console.log(response.isTeacher)
          this.saveAuthData(token, expirationDate,this.userId,this.isTeacher,this.isAdmin);
          this.router.navigate(["/"]);
        }

      },error: () => this.authStatusListener.next(false)});
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isTeacher=authInformation.isTeacher;
      this.isAdmin=authInformation.isAdmin;
      console.log(this.isTeacher)
      this.isAuthenticated = true;
      this.userId=authInformation.userId
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.isTeacher=false;
    this.isAdmin=false;
    this.userId = null
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(["/"]);
  }

  private setAuthTimer(duration: number) {
    console.log("Setting timer: " + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date,userId:string, isTeacher:boolean,isAdmin:boolean) {
    localStorage.setItem("token", token);
    localStorage.setItem('isAdmin',isAdmin.toString())
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem('userId',userId)
    localStorage.setItem('isTeacher',isTeacher.toString())
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
    localStorage.removeItem("isTeacher");
    localStorage.removeItem('isAdmin')
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const isTeacher=localStorage.getItem("isTeacher")==='true';
    const isAdmin=localStorage.getItem("isAdmin")==='true';
    console.log(isTeacher);
    const expirationDate = localStorage.getItem("expiration");
    const userId=localStorage.getItem("userId");
    if (!token || !expirationDate) {
      return null
    }
    return {
      token: token,
      isAdmin:isAdmin,
      isTeacher:isTeacher,
      expirationDate: new Date(expirationDate),
      userId: userId
    }
  }
}
