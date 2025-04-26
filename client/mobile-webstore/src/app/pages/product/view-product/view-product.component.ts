import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Model } from '../../../shared/interfaces/Model';
import { ProductService } from '../../../shared/services/product.service';
import { CommonService } from '../../../shared/services/common.service';
import { environment } from '../../../../environments/environment';

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
        this.selectedModel = this.getSelectedModel(this.uuid);
        if (!this.selectedModel) {
            this.router.navigate(['/product/browse']);
        }
    }

    getSelectedModel(uuid: string | null): Model | null {
        return this.productService.getModel(uuid);
    }

    addToCart(event: Event) {
        event.stopPropagation();
        this.commonService.addProductToCart(this.selectedModel!.uuid);
    }

    switchColor(event: Event, colorIndex: number) {
        if (
            !(event instanceof KeyboardEvent) ||
            event.key === ' ' ||
            event.key === 'Enter'
        ) {
            event.stopPropagation();
            event.preventDefault();
            this.selectedColorIndex = colorIndex;
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
        }
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
