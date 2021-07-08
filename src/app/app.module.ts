import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ProductsListComponent } from './components/product-list/products-list.component';
import { HttpClientModule } from '@angular/common/http';
import { ProductService } from './services/products.service';

import { Routes, RouterModule, Router } from "@angular/router";
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { SearchComponent } from './components/search/search.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { LoginStatusComponent } from './components/login-status/login-status.component';

import{
  OKTA_CONFIG,
  OktaAuthModule,
  OktaCallbackComponent
} from '@okta/okta-angular';

import myAppConfig from './config/my-app-config';

const oktaConfig = Object.assign({
  onAuthRequired : (injector) => {
    const router = injector.get(Router);

    //redirect the user to login pages
    router.navigate(['/login']);
  }
}, myAppConfig.oidc);

const routes: Routes = [

  {path:'login/callback', component: OktaCallbackComponent},
  {path: 'login', component: LoginComponent},
  {path: 'checkout', component: CheckoutComponent},
  {path: 'cart-details', component: CartDetailsComponent},
  {path: 'products/:id', component: ProductDetailsComponent},
  {path: 'search/:keyword', component: ProductsListComponent},
  {path: 'category/:id', component: ProductsListComponent},
  {path: 'category', component: ProductsListComponent},
  {path: 'products', component: ProductsListComponent},
  {path: '', redirectTo : '/products', pathMatch : 'full'},
  {path: '**', redirectTo : '/products', pathMatch : 'full'} //Si con lo que se clickea no coincide, se redirige nuevamente a products.
];

@NgModule({
  declarations: [
    AppComponent,
    ProductsListComponent,
    ProductCategoryMenuComponent,
    SearchComponent,
    ProductDetailsComponent,
    CartStatusComponent,
    CartDetailsComponent,
    CheckoutComponent,
    LoginComponent,
    LoginStatusComponent
  ],
  imports: [
    RouterModule.forRoot(routes), //Se obtienen las rutas escritas previamente.
    BrowserModule,
    HttpClientModule,
    NgbModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    OktaAuthModule
  ],
  providers: [ProductService, {provide: OKTA_CONFIG, useValue: oktaConfig}],
  bootstrap: [AppComponent]
})
export class AppModule { }
