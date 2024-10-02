import { Component,OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { product } from '../data-type';
import { faTrash,faEdit } from '@fortawesome/free-solid-svg-icons';



@Component({
  selector: 'app-seller-home',
  templateUrl: './seller-home.component.html',
  styleUrl: './seller-home.component.css'
})
export class SellerHomeComponent {

productList:undefined | product[];
productMessage:undefined | string;
icon=faTrash;
editIcon=faEdit;
  
constructor(private http:ProductService){}

  ngOnInit():void{
    this.list();
  }
  //to display product list
  list(){
    this.http.productList().subscribe((result)=>{
      console.warn(result);
      this.productList=result;

    })
  }

  //delete product code(delte product api call)
  deleteProduct(id:number){
    console.warn("test id:",id);
    this.http.deleteProduct(id).subscribe((result)=>{
      if(result){
        this.productMessage="Product is deleted";
        //after delete refresh product list
        this.list();
      }
    })
    setTimeout(() => {
      this.productMessage=undefined;
    }, 3000);
    
  }
  
}
