import { Component,OnInit } from '@angular/core';
import { cart, login, product, SignUp } from '../data-type';
import { UserService } from '../services/user.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-user-auth',
  templateUrl: './user-auth.component.html',
  styleUrl: './user-auth.component.css'
})
export class UserAuthComponent implements OnInit{
showLogin:boolean=true;
authError:string="";
  constructor(private user:UserService,private product:ProductService){ }

  ngOnInit(): void {
    this.user.userAuthReload();
  }
  //user sign up
  UserSignUp(data:SignUp){
    ///console.warn(data)
    this.user.userSignUp(data);
  }
  //user login
  login(data:login){
   //console.warn(data);
   this.user.userLogin(data);
   this.user.invalidUserAuth.subscribe((result)=>{
    //console.warn("apple",result)
    if(result){
      this.authError="User Not Found"
    }
    else{
      //user is find
      setTimeout(() => {
        this.localCartToRemoteCart();
      }, 300);
      //this.localCartToRemoteCart();

    }
   })
  }
  openLogin()
  {
    this.showLogin=true;
  }
  openSignup(){
    this.showLogin=false;
  }
  
  localCartToRemoteCart(){
    let data=localStorage.getItem('localcart');
    let user=localStorage.getItem('user')
   //let user=User && JSON.parse('user')
      let userId=user && JSON.parse(user).id;
    if(data){
      let cartDataList:product[]=JSON.parse(data);
      
      //create cartDataList object
       cartDataList.forEach((product:product,index) => {
        let cartData:cart={
          ...product,
          productId:product.id,
          userId
        }
        //delete cart id
        delete cartData.id;
       setTimeout(()=>{
        this.product.AddToCart(cartData).subscribe((result)=>{
          if(result){
            console.warn("item stored in Db");
          }
       })
       if(cartDataList.length===index+1){
        localStorage.removeItem('localcart');
       }
        },500);

      });
    }
    setTimeout(()=>{
      this.product.getCartList(userId);
    },2000);
   
  }
}
