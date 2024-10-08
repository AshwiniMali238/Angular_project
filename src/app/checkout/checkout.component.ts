import { Component } from '@angular/core';
import { ProductService } from '../services/product.service';
import { cart, order } from '../data-type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})

export class CheckoutComponent {
totalPrice:number|undefined;
cartData:cart[]|undefined;
orderMsg:string|undefined;
  constructor(private product:ProductService, private route:Router){}
  
  ngOnInit(): void {
    this.product.currentCart().subscribe((result)=>{
    
     //calculate total price
     let price=0;
     this.cartData=result;
     result.forEach((item)=>{
       if(item.quantity){
         price=price+(+item.price* +item.quantity);
       }
     })
     this.totalPrice=price+(price/10)+100-(price/10);
     
     console.warn(this.totalPrice)
    })
  }
 
  orderNow(data:{email:string,address:string,contact:string}){
    let user=localStorage.getItem('user')
    let userId=user && JSON.parse(user).id

    if(this.totalPrice){
      let cartData:order={
        ...data,
        totalPrice:this.totalPrice,
        userId,
        id:undefined

      }

      this.cartData?.forEach((item)=>{
        setTimeout(()=>{
          item.id && this.product.deleteCartItems(item.id)
        },800);
        
      })
      this.product.orderNow(cartData).subscribe((result)=>{
        if(result){
          //alert("Order placed");
          this.orderMsg="Your order has been placed";

          setTimeout(()=>{
            this.route.navigate(['/my-orders']);
            this.orderMsg=undefined;
          },4000);
         
        }
      })
    }
  }

}
