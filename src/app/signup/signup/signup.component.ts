import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/Repository/auth.service";



@Component({
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]
})
export class SignupComponent implements OnInit,OnDestroy{
  isLoading = false;
   private sub:Subscription
  constructor(public authService: AuthService) {}

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.createUser(form.value.email, form.value.password);

  }
  ngOnInit(): void {
    this.sub=this.authService.getAuthStatusListener().subscribe(authStatus=>
      {
        this.isLoading=false;
      });
  }
  ngOnDestroy(): void {
     this.sub.unsubscribe();
  }
}
