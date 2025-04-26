import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterKey',
    standalone: true,
})
export class FilterKeyPipe implements PipeTransform {
    transform(value: string): string {
        value = value.replace(/([A-Z0-9])/g, ' $1');
        return value.charAt(0).toUpperCase() + value.slice(1);
    }
}
