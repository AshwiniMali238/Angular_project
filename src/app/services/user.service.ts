import { EventEmitter, Injectable } from '@angular/core';
import { login, SignUp } from '../data-type';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  invalidUserAuth=new EventEmitter<boolean>(false)
  constructor(private http:HttpClient,private route:Router) { }
  
userSignUp(user:SignUp){
  //console.warn(user)
this.http.post('http://localhost:3000/users',user,{observe:'response'})
 .subscribe((result)=>{
  console.warn(result);
  if(result){
    localStorage.setItem('user',JSON.stringify(result.body));
    this.route.navigate(['/'])
  }
 })
}

//user login
userLogin(user:login){
  this.http.get<SignUp[]>(`http://localhost:3000/users/?email=${user.email}&password=${user.password}`,
    {observe:'response'}).subscribe((result)=>{
      console.warn(result);
      if(result && result.body?.length){
        //for display validation 
        this.invalidUserAuth.emit(false)
        localStorage.setItem('user',JSON.stringify(result.body[0]));
        this.route.navigate(['/']);
      }
      //for display validation 
      else{
        this.invalidUserAuth.emit(true)
      }
    })
}

userAuthReload(){
 if(localStorage.getItem('user')){
  this.route.navigate(['/']);
 }
}
}
