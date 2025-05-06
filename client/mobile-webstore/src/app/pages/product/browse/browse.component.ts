import { Component, OnInit } from '@angular/core';
import { Model } from '../../../shared/interfaces/Model';
import { environment } from '../../../../environments/environment';
import { ProductService } from '../../../shared/services/product.service';
import { CommonService } from '../../../shared/services/common.service';

@Component({
    selector: 'app-browse',
    standalone: false,
    templateUrl: './browse.component.html',
    styleUrl: './browse.component.scss',
})
export class BrowseComponent implements OnInit {
    models: Model[] = [];

    filterCategories: string[] = environment.filterCategories;
    filterKeys: Map<string, string[]> = environment.filterKeys;
    filterValues: Map<string, string[]> = environment.emptyFilterValues;

    constructor(
        private commonService: CommonService,
        private productService: ProductService
    ) {}

    ngOnInit(): void {
        this.loadModels();
    }

    loadModels() {
        this.productService.getAllModels().subscribe({
            next: (models) => {
                this.models = models;
                this.loadFilters();
            },
            error: (error) => {
                this.commonService.openSnackBarError(error);
            },
        });
    }

    loadFilters() {
        for (let i = 0; i < this.models.length; i++) {
            let details = this.models[i].details;

            // colors and storages
            let newColors = this.models[i].colors;
            let existingColors = this.filterValues.get('colors')!;
            let newStorages = details.memory.storages.map((value) =>
                value.toString()
            );
            let existingStorages = this.filterValues.get('storages')!;

            for (let j = 0; j < newColors.length; j++) {
                if (!existingColors.includes(newColors[j])) {
                    existingColors.push(newColors[j]);
                    this.filterValues.set('colors', existingColors);
                }
            }

            for (let j = 0; j < newStorages.length; j++) {
                if (!existingStorages.includes(newStorages[j])) {
                    existingStorages.push(newStorages[j]);
                    this.filterValues.set('storages', existingStorages);
                }
            }

            // battery, os, brand
            let existingBatteries = this.filterValues.get('battery')!;
            let existingOs = this.filterValues.get('os')!;
            let existingBrands = this.filterValues.get('brand')!;
            if (!existingBatteries.includes(details.battery.toString())) {
                existingBatteries.push(details.battery.toString());
                this.filterValues.set('battery', existingBatteries);
            }
            if (!existingOs.includes(details.os)) {
                existingOs.push(details.os);
                this.filterValues.set('os', existingOs);
            }
            if (!existingBrands.includes(this.models[i].brand)) {
                existingBrands.push(this.models[i].brand);
                this.filterValues.set('brand', existingBrands);
            }

            for (let [category, keys] of this.filterKeys.entries()) {
                for (let key of keys) {
                    let value = this.getNestedValue(
                        details,
                        category.toLowerCase(),
                        key
                    );
                    if (value) {
                        let existingValues = this.filterValues.get(key) || [];
                        if (!existingValues.includes(value.toString())) {
                            existingValues.push(value.toString());
                            this.filterValues.set(key, existingValues);
                        }
                    }
                }
            }
        }
    }

    // helper function to get nested values dynamically
    getNestedValue(details: any, category: string, key: string): any {
        if (details[category] && details[category][key] && key !== 'storages') {
            return details[category][key];
        }
        return null;
    }
}
