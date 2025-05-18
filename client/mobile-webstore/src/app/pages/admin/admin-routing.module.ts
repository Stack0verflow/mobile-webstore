import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModifyProductComponent } from './modify-product/modify-product.component';
import { AdminMainComponent } from './admin-main/admin-main.component';
import { AddModelComponent } from './add-model/add-model.component';
import { ModifyModelComponent } from './modify-model/modify-model.component';
import { isAdminAuthenticated } from '../../shared/guards/admin-auth.guard';

const routes: Routes = [
    {
        path: 'menu',
        component: AdminMainComponent,
        title: 'Admin menu - OneMobile',
        canActivate: [isAdminAuthenticated],
    },
    {
        path: 'add-model',
        component: AddModelComponent,
        title: 'Add model - OneMobile',
        canActivate: [isAdminAuthenticated],
    },
    {
        path: 'modify-model',
        component: ModifyModelComponent,
        title: 'Modify model - OneMobile',
        canActivate: [isAdminAuthenticated],
    },
    {
        path: 'modify-product',
        component: ModifyProductComponent,
        title: 'Modify product - OneMobile',
        canActivate: [isAdminAuthenticated],
    },
    { path: '', redirectTo: 'menu', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdminRoutingModule {}
