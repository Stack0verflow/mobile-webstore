import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminMainComponent } from './admin-main/admin-main.component';
import { AddProductComponent } from './add-product/add-product.component';
import { ModifyProductComponent } from './modify-product/modify-product.component';

@NgModule({
    declarations: [
        AdminMainComponent,
        AddProductComponent,
        ModifyProductComponent,
    ],
    imports: [CommonModule, AdminRoutingModule],
})
export class AdminModule {}
