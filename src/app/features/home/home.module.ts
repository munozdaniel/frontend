import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './containers/home/home.component';
import { HomeRoutingModule } from './home-routing.module';
import { TestComponent } from './containers/test/test.component';
import { SharedModule } from 'app/shared/shared.module';
import { DesignSharedModule } from '@design/shared.module';



@NgModule({
  declarations: [HomeComponent, TestComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    DesignSharedModule
  ]
})
export class HomeModule { }
