import { Component, OnInit } from '@angular/core';
import { Model } from '../../../shared/interfaces/Model';
import { Product } from '../../../shared/interfaces/Product';
import { CommonService } from '../../../shared/services/common.service';
import { ProductService } from '../../../shared/services/product.service';

@Component({
    selector: 'app-admin-main',
    standalone: false,
    templateUrl: './admin-main.component.html',
    styleUrl: './admin-main.component.scss',
})
export class AdminMainComponent implements OnInit {
    models: Model[] = [];
    products: Product[] = [];

    constructor(
        private commonService: CommonService,
        private productService: ProductService
    ) {}

    ngOnInit(): void {
        this.loadModels();
        this.loadProducts();
    }

    loadModels() {
        this.productService.getAllModels().subscribe({
            next: (models) => {
                this.models = models.sort((a, b) => (a.name < b.name ? -1 : 1));
            },
            error: (error) => {
                this.commonService.openSnackBarError(error);
            },
        });
    }

    loadProducts() {
        this.productService.getAllProducts().subscribe({
            next: (products) => {
                this.products = products.sort((a, b) =>
                    a.serial < b.serial ? -1 : 1
                );
            },
            error: (error) => {
                this.commonService.openSnackBarError(error);
            },
        });
    }
}
