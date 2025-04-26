import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { BrowseComponent } from './browse/browse.component';
import { ViewProductComponent } from './view-product/view-product.component';
import { MatCardModule } from '@angular/material/card';
import { ProductCardComponent } from './product-card/product-card.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { FilterKeyPipe } from '../../shared/pipes/filter-key.pipe';
import { DetailValueDisplayPipe } from '../../shared/pipes/detail-value-display.pipe';

@NgModule({
    declarations: [BrowseComponent, ViewProductComponent, ProductCardComponent],
    imports: [
        CommonModule,
        ProductRoutingModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatCheckboxModule,
        MatExpansionModule,
        FilterKeyPipe,
        DetailValueDisplayPipe,
    ],
})
export class ProductModule {}
