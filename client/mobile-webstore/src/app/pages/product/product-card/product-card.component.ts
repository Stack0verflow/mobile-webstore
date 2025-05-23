import { Component, Input } from '@angular/core';
import { Model } from '../../../shared/interfaces/Model';
import { CommonService } from '../../../shared/services/common.service';

@Component({
    selector: 'app-product-card',
    standalone: false,
    templateUrl: './product-card.component.html',
    styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
    @Input() model!: Model;

    selectedColorIndex: number = 0;
    selectedStorageIndex: number = 0;

    constructor(private commonService: CommonService) {}

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
}
