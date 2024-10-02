import { Component,OnInit } from '@angular/core';
import { ActivatedRoute, PreloadAllModules, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { product } from '../data-type';

@Component({
  selector: 'app-seller-update-product',
  templateUrl: './seller-update-product.component.html',
  styleUrl: './seller-update-product.component.css'
})
export class SellerUpdateProductComponent implements OnInit{
  productData:undefined | product;
UpdateMessage:undefined | string;
  constructor(private route:ActivatedRoute,private product:ProductService,private router:Router ){}
  ngOnInit():void{
    
    //get product data by id
    let productId=this.route.snapshot.paramMap.get('id');
    console.warn(productId);
     productId && 
     this.product.getProduct(productId).subscribe((data)=>{
      console.warn(data);
      this.productData=data;
    })
  }
  //for update or edit product list
  ProductUpdate(data:product){
    console.warn(data);
    if(this.productData){
      data.id=this.productData.id;
    }
    this.product.UpdateProduct(data).subscribe((data)=>{
     if(data){
      this.UpdateMessage="Product Updated Successfully";
      this.router.navigate(['seller-home']);
     }
    })
    setTimeout(()=>{
      this.UpdateMessage=undefined;
    },3000)
  }
}
