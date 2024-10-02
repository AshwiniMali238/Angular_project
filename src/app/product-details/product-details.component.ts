import { Component,OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { cart, product } from '../data-type';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit{
  productData:undefined | product;
  productQuantity:number=1;
  user:string | undefined;
  //for remove to cart api
  cartData:product | undefined;
removeCart=false;
  constructor(private activeRoute:ActivatedRoute,private product:ProductService){}

  ngOnInit(): void {
    let productId=this.activeRoute.snapshot.paramMap.get('productId');
    console.warn(productId);
    productId && this.product.getProduct(productId).subscribe((result)=>{
      console.warn(result);
      this.productData=result;

      //update cart value
      let cartData=localStorage.getItem('localcart')
      if(productId && cartData){
        let items=JSON.parse(cartData)
        items =items.filter((item:product)=>productId==item.id.toString())
        if(items.length){
          this.removeCart=true;
        }
        else{
          this.removeCart=false;
        }
      }

      let user=localStorage.getItem('user')
        //get user id
        if(user){
          let userId=user && JSON.parse(user).id;
          this.product.getCartList(userId);
          this.product.cartData.subscribe((result)=>{
          let item =result.filter((item:product)=>productId?.toString()===item.productId?.toString())
          if(item.length){
            this.cartData=item[0];
            this.removeCart=true;
          }
          })
        }      
    })
  }

  handleQuantity(val:string){
    if(this.productQuantity<20 && val==='plus'){
      this.productQuantity=this.productQuantity+1;
    }else if(this.productQuantity>1 && val==='min'){
      this.productQuantity-=1;
    }
  }

  AddToCart(){
    if(this.productData){
      //add quantity in product
      this.productData.quantity=this.productQuantity
      //check user logged in or not
      if(!localStorage.getItem('user')){
        console.warn(this.productData)
        this.product.localAddtoCart(this.productData)
        this.removeCart=true;     
      }else{       
        //console.warn("user is logged in")       
         let user=localStorage.getItem('user')
        //get user id
        let userId=user && JSON.parse(user).id;
        //console.warn(userId)
        //create cartData object
        //use cart interface as cartData type
        let cartData:cart={
          ...this.productData,
          userId,
          productId:this.productData.id,
        }
        //delete cart id
        delete cartData.id;
        //console.warn(cartData)
        this.product.AddToCart(cartData).subscribe((result)=>{
          if(result){
            //alert("product is add to cart")
            this.product.getCartList(userId);
            this.removeCart=true;
          }
           })         
      }     
    }
 
  }
  RemoveToCart(productId:number){
    if(!localStorage.getItem('user')){
      this.product.removeItemFromCart(productId);
      
    }
    else{
      let user=localStorage.getItem('user')
      let userId=user && JSON.parse(user).id;
      console.warn(this.cartData)
      this.cartData && this.product.removeToCart(this.cartData.id)
      .subscribe((result)=>{
        if(result){
          this.product.getCartList(userId);
        }
      })
      this.removeCart=false;
    }
   
  }


}
