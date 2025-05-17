import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminMainComponent } from './admin-main/admin-main.component';
import { ModifyProductComponent } from './modify-product/modify-product.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { DetailValueDisplayPipe } from '../../shared/pipes/detail-value-display.pipe';
import { AddModelComponent } from './add-model/add-model.component';
import { ModifyModelComponent } from './modify-model/modify-model.component';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
    declarations: [
        AdminMainComponent,
        ModifyProductComponent,
        AddModelComponent,
        ModifyModelComponent,
    ],
    imports: [
        CommonModule,
        AdminRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        MatCardModule,
        MatCheckboxModule,
        DetailValueDisplayPipe,
    ],
})
export class AdminModule {}
