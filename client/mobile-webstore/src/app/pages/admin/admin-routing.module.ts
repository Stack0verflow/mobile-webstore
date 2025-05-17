import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModifyProductComponent } from './modify-product/modify-product.component';
import { AdminMainComponent } from './admin-main/admin-main.component';
import { AddModelComponent } from './add-model/add-model.component';
import { ModifyModelComponent } from './modify-model/modify-model.component';

const routes: Routes = [
    {
        path: 'menu',
        component: AdminMainComponent,
        title: 'Admin menu - OneMobile',
    },
    {
        path: 'add-model',
        component: AddModelComponent,
        title: 'Add model - OneMobile',
    },
    {
        path: 'modify-model',
        component: ModifyModelComponent,
        title: 'Modify model - OneMobile',
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
