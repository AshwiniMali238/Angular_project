import { Component,OnInit} from '@angular/core';
import {Router} from '@angular/router'
import { ProductService } from '../services/product.service';
import { product } from '../data-type';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  constructor(private route:Router,private product:ProductService){}
  //Chnage NavBar after Login the Seller
  menuType:string='default';
  sellerName:string='';
  userName:string='';
  cartItems=0;
  searchResult:undefined | product[];
ngOnInit():void{
  //after seller login change navbar or hide search box code
  //after user login change navbar
  this.route.events.subscribe((val:any)=>{
   if(val.url){
    if(localStorage.getItem('seller') && val.url.includes('seller')){
      //console.warn("in seller area")
     
      if(localStorage.getItem('seller'))
      {
        let sellerStore=localStorage.getItem('seller');
        let sellerData=sellerStore && JSON.parse(sellerStore)[0];
        this.sellerName=sellerData.name;
        this.menuType="seller"; 
      } 
    }else if(localStorage.getItem('user')){
      let userStore=localStorage.getItem('user');
      let userData=userStore && JSON.parse(userStore);
      this.userName=userData.name;
      this.menuType="user";
      this.product.getCartList(userData.id);
    }
    else{
      //console.warn("outside seller area")
      this.menuType='default';
    }

   }
  });
//display cart value
  let cartData=localStorage.getItem('localcart')
  if(cartData){
    this.cartItems=JSON.parse(cartData).length;
  }
  //event emitter subscribe
  this.product.cartData.subscribe((items)=>{
    this.cartItems=items.length
  })
}
//seller logout code
logout(){
  localStorage.removeItem('seller');
  this.route.navigate(['/']);
}

userlogout(){
  localStorage.removeItem('user');
  this.route.navigate(['/']);
  //update cart value
  this.product.cartData.emit([]);
}

searchProducts(query:KeyboardEvent){
if(query){
  //to get data in input box
  const element=query.target as HTMLInputElement;
  //console.warn(element.value)
  this.product.searchProducts(element.value).subscribe((data)=>{
    //console.warn(data);
    //to display 5 product in search box
    if(data.length>5){
      data.length=5;
    }
    this.searchResult=data;
    
  })
}
}
//refresh the search products
hideSearch(){
  this.searchResult=undefined;
}

submitSearch(val:string){
  console.warn(val);
  this.route.navigate([`search/${val}`]);
}

redirectToDetails(id:number){
  this.route.navigate(['/details/'+id]);
}
}
