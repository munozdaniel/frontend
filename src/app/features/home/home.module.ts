import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './containers/home/home.component';
import { HomeRoutingModule } from './home-routing.module';
import { TestComponent } from './containers/test/test.component';



@NgModule({
  declarations: [HomeComponent, TestComponent],
  imports: [
    CommonModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
