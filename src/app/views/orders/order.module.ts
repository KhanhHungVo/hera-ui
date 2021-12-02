
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import  {OrdersRoutingModule} from './order-routing.module';
import { LayoutComponent } from './layout.component';
import { ListComponent } from './list.component';
import { AddEditComponent } from './add-edit.component';
import {HeraCurrency} from '@app/shared/pipes/hera-currency.pipe';
import {CurrencyFormatter} from '@app/shared/directives/currency-formatter.directive';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        OrdersRoutingModule
    ],
    declarations: [
        LayoutComponent,
        ListComponent,
        AddEditComponent,
        HeraCurrency,
        CurrencyFormatter
    ]
})
export class OrderModule { }