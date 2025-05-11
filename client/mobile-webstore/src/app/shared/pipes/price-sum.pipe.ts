import { Pipe, PipeTransform } from '@angular/core';
import { CartItem } from '../interfaces/Cart';

@Pipe({
    name: 'priceSum',
    standalone: true,
})
export class PriceSumPipe implements PipeTransform {
    transform(items: CartItem[]): string {
        return items
            .reduce((sum, item) => sum + item.product.price * item.quantity, 0)
            .toFixed(2);
    }
}
