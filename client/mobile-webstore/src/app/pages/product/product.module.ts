import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { BrowseComponent } from './browse/browse.component';

@NgModule({
    declarations: [BrowseComponent],
    imports: [CommonModule, ProductRoutingModule],
})
export class ProductModule {}
