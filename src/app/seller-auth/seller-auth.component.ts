import { Component, inject } from '@angular/core';
import { SellerService } from '../services/seller.service';
import {Router} from '@angular/router'
import { SignUp } from '../data-type';

@Component({
  selector: 'app-seller-auth',
  templateUrl: './seller-auth.component.html',
  styleUrl: './seller-auth.component.css'
})
export class SellerAuthComponent {


  constructor(private seller:SellerService, private router:Router){}

  showLogin=false
  authError:string='';
  //email: string = '';
  //password: string = '';

  //seller signup code
  signUp(data:SignUp):void
  {
    console.warn(data)
    this.seller.userSignUp(data);
    
  }
  //seller login code 
  Login(data:SignUp):void{
   //console.warn(data)
   this.authError="";
    this.seller.userlogin(data)
    this.seller.isLoginError.subscribe((isError)=>{
      if(isError){
        this.authError="Email or Password is Wrong"
      }
    })
    }
   
  openLogin()
  {
    this.showLogin=true
  }
  openSignUp(){
    this.showLogin=false
  }
}
