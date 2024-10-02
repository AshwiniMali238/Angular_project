import { Component,OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { cart, priceSummary } from '../data-type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.css'
})
export class CartPageComponent implements OnInit {
cartData:cart[] | undefined;
priceSummary:priceSummary ={
  price:0,
  discount:0,
  delivery:0,
  tax:0,
  total:0
}
  

  constructor(private product:ProductService, private route:Router){}
 ngOnInit(): void {
   this.loadDetails();
 }

 loadDetails(){
  this.product.currentCart().subscribe((result)=>{
    //console.warn(result);
    this.cartData=result;
    //calculate total price
    let price=0;
    result.forEach((item)=>{
      if(item.quantity){
        price=price+(+item.price* +item.quantity);
      }
      
      //console.warn(price)
    })
    this.priceSummary.price=price;
    this.priceSummary.discount=price/10;
    this.priceSummary.tax=price/10;
    this.priceSummary.delivery=100;
    this.priceSummary.total=price+(price/10)+100-(price/10);
    //console.warn(this.priceSummary)

    if(!this.cartData.length){
      this.route.navigate(['/']);
    }
   })

 }

 checkout(){
  this.route.navigate(['checkout']);
 }

 removeToCart(cartId:number |undefined){
  cartId && this.cartData && this.product.removeToCart(cartId)
  .subscribe((result)=>{
    this.loadDetails();
  });


  
}
}

