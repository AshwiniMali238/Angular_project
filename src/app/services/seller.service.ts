import { EventEmitter, Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { login, SignUp } from '../data-type';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SellerService {
isLoginError=new EventEmitter<boolean>(false)
  constructor(private http:HttpClient,private router:Router) { }

  //seller sign up code
  userSignUp(data:SignUp){
    //console.warn("service call");
     this.http.post('http://localhost:3000/seller',
      data,
      {observe:'response'}).subscribe((result)=>{
        console.warn(result)
        if(result){
          localStorage.setItem('seller',JSON.stringify(result.body))
          this.router.navigate(['seller-home']);
        }
      })
      }
    
  //seller login code
  userlogin(data:login)
  {
  //console.warn(data);
   this.http.get(`http://localhost:3000/seller?email=${data.email}&password=${data.password}`,
    {observe:'response'}
      )
    .subscribe((res:any)=>{
      console.warn(res)
      if(res && res.body && res.body.length){
       console.warn("login sucessfully")
       localStorage.setItem('seller',JSON.stringify(res.body))
          this.router.navigate(['seller-home']);
       
    }else{
        console.warn("email or password is wrong")
        this.isLoginError.emit(true)
    }
   })
  }
}

   
 

  
    
  
  
 




