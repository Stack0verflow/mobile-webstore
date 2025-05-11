import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Model } from '../../../shared/interfaces/Model';
import { ProductService } from '../../../shared/services/product.service';
import { CommonService } from '../../../shared/services/common.service';
import { environment } from '../../../../environments/environment';
import { Product } from '../../../shared/interfaces/Product';

@Component({
    selector: 'app-view-product',
    standalone: false,
    templateUrl: './view-product.component.html',
    styleUrl: './view-product.component.scss',
})
export class ViewProductComponent implements OnInit {
    uuid: string | null = null;
    selectedModel: Model | null = null;
    selectedColorIndex: number = 0;
    selectedStorageIndex: number = 0;
    selectedImageUrl: string = '';
    actualProduct: Product | null = null;

    filterCategories: string[] = environment.filterCategories;
    filterKeys: Map<string, string[]> = environment.filterKeys;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private productService: ProductService,
        private commonService: CommonService
    ) {}

    ngOnInit(): void {
        this.uuid = this.route.snapshot.queryParamMap.get('id');
        this.getSelectedModel(this.uuid);
    }

    getSelectedModel(uuid: string | null): void {
        if (uuid) {
            this.productService.getModel(uuid).subscribe({
                next: (model) => {
                    this.selectedModel = model;
                    this.updatedSelectedImageUrl();
                    this.getAvailableProduct();
                },
                error: (error) => {
                    this.commonService.openSnackBarError(error);
                    this.router.navigate(['/product/browse']);
                },
            });
        }
    }

    updatedSelectedImageUrl() {
        this.selectedImageUrl =
            this.selectedModel!.pictures[this.selectedColorIndex];
    }

    addToCart(event: Event) {
        event.stopPropagation();
        if (this.actualProduct && this.actualProduct.quantity > 0) {
            this.commonService.addProductToCart(this.actualProduct);
        }
    }

    switchColor(event: Event, colorIndex: number) {
        if (
            this.selectedColorIndex !== colorIndex &&
            (!(event instanceof KeyboardEvent) ||
                event.key === ' ' ||
                event.key === 'Enter')
        ) {
            event.stopPropagation();
            event.preventDefault();
            this.selectedColorIndex = colorIndex;
            this.updatedSelectedImageUrl();
            this.getAvailableProduct();
        }
    }

    switchStorage(event: Event, storageIndex: number) {
        if (
            !(event instanceof KeyboardEvent) ||
            event.key === ' ' ||
            event.key === 'Enter'
        ) {
            event.stopPropagation();
            event.preventDefault();
            this.selectedStorageIndex = storageIndex;
            this.getAvailableProduct();
        }
    }

    getAvailableProduct() {
        this.productService
            .getProductBySelection(
                this.selectedModel!.uuid,
                this.selectedModel!.colors[this.selectedColorIndex],
                this.selectedModel!.details.memory.storages[
                    this.selectedStorageIndex
                ].toString()
            )
            .subscribe({
                next: (product) => {
                    this.actualProduct = product;
                },
                error: (error) => {
                    this.commonService.openSnackBarError(error);
                },
            });
    }

    getDetailValue(category: string, name: string): string {
        // special case for 'General' fields
        if (category === 'General') {
            return (
                (this.selectedModel as any)[name] ??
                (this.selectedModel!.details as any)[name] ??
                'Not specified'
            );
        }

        const mapping: Record<string, keyof Model['details']> = {
            CPU: 'cpu',
            Display: 'display',
            Camera: 'camera',
            Memory: 'memory',
            Network: 'network',
            Connection: 'connection',
            Physical: 'physical',
        };

        const section = mapping[category];
        return (
            (this.selectedModel!.details[section] as any)[name] ??
            'Not specified'
        );
    }
}
