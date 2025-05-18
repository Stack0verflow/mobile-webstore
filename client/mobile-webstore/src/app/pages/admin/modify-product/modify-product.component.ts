import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Product } from '../../../shared/interfaces/Product';
import { User } from '../../../shared/interfaces/User';
import { AuthService } from '../../../shared/services/auth.service';
import { ProductService } from '../../../shared/services/product.service';
import { CommonService } from '../../../shared/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-modify-product',
    standalone: false,
    templateUrl: './modify-product.component.html',
    styleUrl: './modify-product.component.scss',
})
export class ModifyProductComponent implements OnInit, OnDestroy {
    destroy$: Subject<boolean> = new Subject<boolean>();

    productForm = new FormGroup({
        price: new FormControl(0, [Validators.required]),
        warranty: new FormControl(0, [Validators.required]),
        quantity: new FormControl(0, [Validators.required]),
    });

    currentUser: User | null = null;
    selectedProduct: Product | null = null;

    constructor(
        private authService: AuthService,
        private productService: ProductService,
        private commonService: CommonService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.checkCurrentUser();
        this.loadSelectedProduct();
    }

    checkCurrentUser(): void {
        this.authService
            .getCurrentUser()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (user) => {
                    this.currentUser = user;
                    if (user === null) {
                        this.router.navigate(['/user/login']);
                    }
                },
                error: () => {
                    this.router.navigate(['/user/login']);
                },
            });
    }

    loadSelectedProduct() {
        const serial = this.route.snapshot.queryParamMap.get('serial');
        if (serial) {
            this.productService
                .getProductBySerial(serial)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (product) => {
                        this.selectedProduct = product;

                        if (product === null) {
                            this.router.navigate(['/admin/menu']);
                        } else {
                            this.updateForm();
                        }
                    },
                    error: () => {
                        this.router.navigate(['/admin/menu']);
                    },
                });
        } else {
            this.router.navigate(['/admin/menu']);
        }
    }

    updateForm() {
        if (this.selectedProduct) {
            this.productForm = new FormGroup({
                price: new FormControl(this.selectedProduct.price, [
                    Validators.required,
                ]),
                warranty: new FormControl(this.selectedProduct.warranty, [
                    Validators.required,
                ]),
                quantity: new FormControl(this.selectedProduct.quantity, [
                    Validators.required,
                ]),
            });
        }
    }

    updateProduct() {
        const form = this.productForm;

        if (form && form.valid) {
            this.productService
                .updateProduct(
                    this.currentUser!,
                    this.selectedProduct!.serial,
                    form.controls.price.value!,
                    form.controls.warranty.value!,
                    form.controls.quantity.value!
                )
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (product) => {
                        this.commonService.openSnackBarSuccess(
                            'Product updated!'
                        );
                        this.router.navigate(['admin/menu']);
                    },
                    error: () => {
                        this.commonService.openSnackBarError(
                            'Could not update the selected product!'
                        );
                    },
                });
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
}
