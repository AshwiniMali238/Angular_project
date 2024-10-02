import { Component } from '@angular/core';
import { ProductService } from '../services/product.service';
import { product } from '../data-type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seller-add-product',
  templateUrl: './seller-add-product.component.html',
  styleUrl: './seller-add-product.component.css'
})
export class SellerAddProductComponent {

  constructor(private product: ProductService,private route:Router) { }
  //add product code
  addProductMessage: string | undefined;

  ProductAdd(data: product) {
    //console.warn(data);
    this.product.addProduct(data).subscribe((result) => {
      console.warn(result);
      if (result) {
        this.addProductMessage = "Product addedd successfully";
        this.route.navigate(['seller-home']);
      }
      //to remove the msg 
      setTimeout(() => this.addProductMessage = undefined, 3000);
    })
  }

}
