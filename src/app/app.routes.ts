import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './componenets/products/products.component';
import { LoginComponent } from './componenets/login/login.component';
import { LandingComponent } from './componenets/landing/landing.component';
import { CartComponent } from './componenets/cart/cart.component';
import { NgModule } from '@angular/core';
import { ResultComponent } from './componenets/result/result.component';
import { DetailsComponent } from './componenets/details/details.component';
import { ContactComponent } from './componenets/contact/contact.component';
import { AdminComponent } from './componenets/admin/admin.component';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
    title: 'Home'
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login'
  },
  {
    path: 'products',
    component: ProductsComponent,
    title: 'Products'
  },
  
  {
    path: 'products',
    component: ProductsComponent,
    title: 'Products'
  },
  {
    path: 'products/:categorySlug',
    component: ProductsComponent,
    title: 'Products'
  },
  
  { path: 'details/:id', component: DetailsComponent, title: 'Details' },

  {
    path: 'admin',
    component: AdminComponent,
    title: 'Admin',
    canActivate: [AdminGuard] 
  },
  {
    path: 'cart',
    component: CartComponent,
    title: 'Cart'
  },
  {
    path: 'result',
    component: ResultComponent,
    title: 'Result'
  },
  {
    path: 'contact',
    component: ContactComponent,
    title: 'contact'
  },
  
  
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes,
    {scrollPositionRestoration: 'top',}
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
