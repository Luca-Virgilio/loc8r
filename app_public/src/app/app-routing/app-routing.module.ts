import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// router module to routing the page
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from '../about/about.component';
import { HomepageComponent } from '../homepage/homepage.component';
import { DetailsPageComponent } from '../details-page/details-page.component';
import {RegisterComponent} from '../register/register.component'
import {LoginComponent} from '../login/login.component'
const routes: Routes = [
  {
    path: '',
    component: HomepageComponent
  },
  {
    path:'register',
    component: RegisterComponent
  },
  {
    path: 'login',
    component: LoginComponent
    },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'location/:locationId',
    component: DetailsPageComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }