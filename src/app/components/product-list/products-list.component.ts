import { Component, OnInit } from '@angular/core';
import { fromEventPattern } from 'rxjs';
import { ProductService } from 'src/app/services/products.service';
import { Product } from 'src/app/common/products';
import { ActivatedRoute } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { CartItem } from 'src/app/common/cart-item';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list-grid.component.html', //Se actualiza a el product.list.table.html
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent implements OnInit {

  //Se realiza la conexión con el Backend - API REST

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  //Nuevas propiedades para la paginacion
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;
  previousKeyword: string = null;


  constructor(private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {  //Si el usuario ha tipado algo...
      this.handleSearchProduct();
    } else {
      this.handleListProduct();
    }

  }

  handleSearchProduct() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword');

    //if we have different keyword than previous
    //the number page set to 1

    if(this.previousKeyword != theKeyword){
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyword;

    console.log(`keyword=${theKeyword}, thePageNumber=${this.thePageNumber}`);
    

    //Se busca un producto por la palabra escrita
    this.productService.searchProductsPaginate(this.thePageNumber -1, this.thePageSize, theKeyword).subscribe(this.processResult());
  }

  handleListProduct() {
    //Se chequea si el parametro "id" está disponible
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      //Se convierte el parámetro id de string a numero con el simbolo "+"
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');

    }
    else {
      //El parammetro "id " no esta disponible
      this.currentCategoryId = 1;
    }

    //Se verifica si se tiene una categoria diferente a la anterior
    //Si se tiene una categoria diferente se vuelve a la pagina 1
    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);



    //Se obtienen los productos para ese category_id
    this.productService.getProductListPaginate(this.thePageNumber - 1, 
                                              this.thePageSize, 
                                              this.currentCategoryId).subscribe(this.processResult());

  }

  processResult() {
    return data => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }

  updatePageSize(pageSize:number){
    this.thePageSize = pageSize;
    this.thePageNumber = 1;
    this.listProducts();
    
  }

  addToCart(theProduct: Product){
    console.log(`AddToCart: ${theProduct.name}, ${theProduct.unitPrice}`)

    const theCartItem = new CartItem(theProduct);
    
    this.cartService.addToCart(theCartItem);
  }

}
