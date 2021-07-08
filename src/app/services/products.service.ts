import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../common/products';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

//Toma los datos del backend, y los recupera. API REST

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = "http://localhost:8080/api/products";
  private categoryUrl = "http://localhost:8080/api/product-category";



  constructor(private httpClient: HttpClient) { }

  getProduct(theProductId: number): Observable<Product> {
    //need to build URL based in productID

    const productUrl = `${this.baseUrl}/${theProductId}`;

    return this.httpClient.get<Product>(productUrl);
  }

  getProductListPaginate(thePage: number,
    thePageSize: number,
    theCategoryId: number): Observable<GetResponseProduct> {

    // need to build URL based on category id, page and size 
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
      + `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProduct>(searchUrl);
  }

  getProductList(theCategoryId: number): Observable<Product[]> {
    //URL basada en la busqueda por categoria
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;

    return this.getProducts(searchUrl);
  }

  searchProducts(theKeyword: string): Observable<Product[]> {
    //URL basada en la busqueda por "theKeyword"
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;

    return this.getProducts(searchUrl);
  }

  searchProductsPaginate(thePage: number,
    thePageSize: number,
    theKeyword: string): Observable<GetResponseProduct> {

    // need to build URL based on category id, page and size 
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`
      + `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProduct>(searchUrl);
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProduct>(searchUrl).pipe(map(response => response._embedded.products));
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategories>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }
}



interface GetResponseProduct {
  _embedded: {
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponseProductCategories { //Unwraps the JSON from Spring Data (?)
  _embedded: {
    productCategory: ProductCategory[];
  };
}