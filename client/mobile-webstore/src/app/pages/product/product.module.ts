import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { BrowseComponent } from './browse/browse.component';
import { ViewProductComponent } from './view-product/view-product.component';
import { MatCardModule } from '@angular/material/card';
import { ProductCardComponent } from './product-card/product-card.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
    declarations: [BrowseComponent, ViewProductComponent, ProductCardComponent],
    imports: [
        CommonModule,
        ProductRoutingModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
    ],
})
export class ProductModule {}
