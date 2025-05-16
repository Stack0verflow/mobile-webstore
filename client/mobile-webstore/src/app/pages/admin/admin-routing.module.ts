import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddProductComponent } from './add-product/add-product.component';
import { ModifyProductComponent } from './modify-product/modify-product.component';
import { AdminMainComponent } from './admin-main/admin-main.component';

const routes: Routes = [
    {
        path: 'menu',
        component: AdminMainComponent,
        title: 'Admin menu - OneMobile',
    },
    {
        path: 'add-product',
        component: AddProductComponent,
        title: 'Add product - OneMobile',
    },
    {
        path: 'modify-product',
        component: ModifyProductComponent,
        title: 'Modify product - OneMobile',
    },
    { path: '', redirectTo: 'menu', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdminRoutingModule {}
