import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'detailValueDisplay',
    standalone: true,
})
export class DetailValueDisplayPipe implements PipeTransform {
    transform(value: string): string {
        if (value === 'true') {
            return 'Yes';
        } else if (value === 'false') {
            return 'No';
        }

        value = value.replaceAll(',', ', ');
        return value.charAt(0).toUpperCase() + value.slice(1);
    }
}
