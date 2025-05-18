import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../shared/services/product.service';
import { Subject, takeUntil } from 'rxjs';
import { CommonService } from '../../../shared/services/common.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { User } from '../../../shared/interfaces/User';

@Component({
    selector: 'app-add-model',
    standalone: false,
    templateUrl: './add-model.component.html',
    styleUrl: './add-model.component.scss',
})
export class AddModelComponent implements OnInit, OnDestroy {
    destroy$: Subject<boolean> = new Subject<boolean>();

    modelForm = new FormGroup({
        name: new FormControl('No name', [Validators.required]),
        brand: new FormControl('Brandie', [Validators.required]),
        basePrice: new FormControl(0, [Validators.required, Validators.min(0)]),
        color: new FormControl('white'),
        pictures: new FormGroup({}),

        details: new FormGroup({
            cpu: new FormGroup({
                speed: new FormControl(4, [Validators.required]),
                cores: new FormControl(6, [Validators.required]),
            }),
            display: new FormGroup({
                diameter: new FormControl(6, [Validators.required]),
                resolution: new FormControl('1920x1080', [Validators.required]),
                technology: new FormControl('Tech', [Validators.required]),
                refreshRate: new FormControl(60, [Validators.required]),
                colorDepth: new FormControl('16M', [Validators.required]),
            }),
            camera: new FormGroup({
                backResolution: new FormControl('20.0 MP', [
                    Validators.required,
                ]),
                backMaxZoom: new FormControl(10, [Validators.required]),
                frontResolution: new FormControl('20.0 MP', [
                    Validators.required,
                ]),
                autofocus: new FormControl(false, [Validators.required]),
                flashlight: new FormControl(false, [Validators.required]),
                recordingMaxResolution: new FormControl('UHD 4K', [
                    Validators.required,
                ]),
            }),
            memory: new FormGroup({
                ram: new FormControl(8, [Validators.required]),
                storage: new FormControl(0, [Validators.required]),
            }),
            network: new FormGroup({
                simType: new FormControl('Nano-SIM', [Validators.required]),
                dualSim: new FormControl(false, [Validators.required]),
                ['5g']: new FormControl(false, [Validators.required]),
            }),
            connection: new FormGroup({
                usb: new FormControl('Type-C', [Validators.required]),
                jack: new FormControl(false, [Validators.required]),
                wifi: new FormControl('802.11a/b/g/n/ac/ax/be 2.4GHz+5GHz', [
                    Validators.required,
                ]),
                bluetooth: new FormControl('v5.4', [Validators.required]),
                nfc: new FormControl(false, [Validators.required]),
            }),
            physical: new FormGroup({
                height: new FormControl(140, [Validators.required]),
                width: new FormControl(70, [Validators.required]),
                depth: new FormControl(7, [Validators.required]),
                weight: new FormControl(170, [Validators.required]),
            }),
            battery: new FormControl(3500, [Validators.required]),
            os: new FormControl('Andronix', [Validators.required]),
        }),
    });

    currentUser: User | null = null;
    colors: string[] = [];
    storages: number[] = [];

    constructor(
        private authService: AuthService,
        private productService: ProductService,
        private commonService: CommonService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.checkCurrentUser();
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

    addColor() {
        if (
            this.modelForm.controls.color.value?.trim() &&
            !this.colors.includes(this.modelForm.controls.color.value)
        ) {
            this.colors.push(this.modelForm.controls.color.value);
            this.modelForm.controls.pictures.addControl(
                'picture' + this.colors.length,
                new FormControl('', Validators.required)
            );
        }
    }

    removeColor(color: string) {
        if (this.colors.includes(color)) {
            this.colors.splice(
                this.colors.findIndex((col) => col === color),
                1
            );
        }
    }

    onImgError(event: Event, index: number) {
        const target = event.target as HTMLImageElement;
        target.src = 'assets/image-not-found.png';
        this.modelForm
            .get('pictures.picture' + index)
            ?.setErrors({ invalidUrl: true });
    }

    addStorage() {
        const storageValue =
            this.modelForm.controls.details.controls.memory.controls.storage
                .value;
        if (
            Number(storageValue) &&
            Number(storageValue) > 0 &&
            !this.storages.includes(Number(storageValue))
        ) {
            this.storages.push(Number(storageValue));
        }
    }

    removeStorage(storage: number) {
        if (this.storages.includes(storage)) {
            this.storages.splice(
                this.storages.findIndex((str) => str === storage),
                1
            );
        }
    }

    addModel() {
        const form = this.modelForm;

        if (form && form.valid) {
            this.productService
                .createModel(
                    this.currentUser!,
                    form.controls.name.value!,
                    this.colors,
                    Object.values(form.controls.pictures.value),
                    form.controls.brand.value!,
                    form.controls.details.value,
                    form.controls.basePrice.value!,
                    this.storages
                )
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (model) => {
                        this.commonService.openSnackBarSuccess(
                            'Model created!'
                        );
                        this.router.navigate(['admin/menu']);
                    },
                    error: () => {
                        this.commonService.openSnackBarError(
                            'Could not create new model!'
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
