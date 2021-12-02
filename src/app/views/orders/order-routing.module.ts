import { AddEditComponent } from './add-edit.component';
import { ListComponent } from './list.component';
import { LayoutComponent } from './layout.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', component: ListComponent, data: { title: "" } },
            { path: 'add', component: AddEditComponent, data: { title: "Add" } },
            { path: 'edit/:id', component: AddEditComponent, data: { title: "Edit"  }}
        ]
    }
]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OrdersRoutingModule { }