import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { cart, order, product } from '../data-type';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  cartData=new EventEmitter<product[] | []>();
  constructor(private http:HttpClient) { }
  //add product code
  addProduct(data:product){
    //console.warn("service called");
     return this.http.post('http://localhost:3000/products',data);
  }

  //display product list
  productList(){
    return this.http.get<product[]>('http://localhost:3000/products');
  }

  //delete product
  deleteProduct(id:number)
  {
    return this.http.delete(`http://localhost:3000/products/${id}`);
  }

  //for get product list by id
  getProduct(id:string){
    return this.http.get<product>(`http://localhost:3000/products/${id}`);
  }
//for update or edit data
UpdateProduct(product:product){
  return this.http.put<product>(`http://localhost:3000/products/${product.id}`,product);
}

//for display images on carousel(bootstrap)
popularProducts(){
  return this.http.get<product[]>('http://localhost:3000/products?_limit=4');
  
}
//display images for Trendy Products
trendyProducts(){
  return this.http.get<product[]>('http://localhost:3000/products?_limit=10');
}
  //for searching the products
  searchProducts(query:string){
    return this.http.get<product[]>(`http://localhost:3000/products?q=${query}`);
  }

  localAddtoCart(data:product){
    let cartData=[];
    let localcart=localStorage.getItem('localcart');
    if(!localcart){
      localStorage.setItem('localcart',JSON.stringify([data]));
      //update after 2nd product in cartvalue
      this.cartData.emit([data]);
    }
    else{
      cartData=JSON.parse(localcart)
      cartData.push(data)
      localStorage.setItem('localcart',JSON.stringify(cartData))
    }
    //for displaying cart value after refresh
    this.cartData.emit(cartData);
  }

  removeItemFromCart(productId:number){
    //to check in localcart data is availbale or not
    let cartData=localStorage.getItem('localcart');
    //if localcart data is available
    if(cartData){
      let items:product[]=JSON.parse(cartData)

      items=items.filter((item:product)=>productId!==item.id);
//to set data in localcart
      localStorage.setItem('localcart',JSON.stringify(items));
      //refresh the cart value
      this.cartData.emit(items);

    }
  }

  AddToCart(cartData:cart){
    return this.http.post('http://localhost:3000/cart',cartData);
  }

  getCartList(userId:number){
   
    return this.http.get<product[]>('http://localhost:3000/cart?userId='+userId,
      {observe:'response'}).subscribe((result)=>{
        
        console.warn(result);

        if(result && result.body){
          this.cartData.emit(result.body);
      }
      })   
  }

  removeToCart(cartId:number){
    return this.http.delete('http://localhost:3000/cart/'+cartId);
  }

  currentCart(){
    let userStore=localStorage.getItem('user');
      let userData=userStore && JSON.parse(userStore);
      return this.http.get<cart[]>('http://localhost:3000/cart?userId='+userData.id);
  }

  orderNow(data:order){
    return this.http.post('http://localhost:3000/orders',data);
  }

  orderList(){
    let userStore=localStorage.getItem('user');
      let userData=userStore && JSON.parse(userStore);
    return this.http.get<order[]>('http://localhost:3000/orders?userId='+userData.id);
  }

  deleteCartItems(cartId:number){
    return this.http.delete('http://localhost:3000/cart/'+cartId,{observe:'response'})
    .subscribe((result)=>{
      if(result)
      {
        this.cartData.emit([]);
      }
    });
  }

  deleteOrder(orderId:number){
    return this.http.delete('http://localhost:3000/orders/'+orderId);
  }
}
    
    
