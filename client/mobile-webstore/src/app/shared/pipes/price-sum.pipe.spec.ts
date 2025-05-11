import { PriceSumPipe } from './price-sum.pipe';

describe('PriceSumPipe', () => {
    it('create an instance', () => {
        const pipe = new PriceSumPipe();
        expect(pipe).toBeTruthy();
    });
});
