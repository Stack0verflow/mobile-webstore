import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../shared/services/auth.service';
import { ProductService } from '../../../shared/services/product.service';
import { CommonService } from '../../../shared/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../shared/interfaces/User';
import { Model } from '../../../shared/interfaces/Model';

@Component({
    selector: 'app-modify-model',
    standalone: false,
    templateUrl: './modify-model.component.html',
    styleUrl: './modify-model.component.scss',
})
export class ModifyModelComponent implements OnInit, OnDestroy {
    destroy$: Subject<boolean> = new Subject<boolean>();

    modelForm = new FormGroup({
        name: new FormControl('', [Validators.required]),
        brand: new FormControl('', [Validators.required]),
        basePrice: new FormControl(0, [Validators.required, Validators.min(0)]),
        color: new FormControl(''),
        pictures: new FormGroup({}),

        details: new FormGroup({
            cpu: new FormGroup({
                speed: new FormControl(0, [Validators.required]),
                cores: new FormControl(0, [Validators.required]),
            }),
            display: new FormGroup({
                diameter: new FormControl(0, [Validators.required]),
                resolution: new FormControl('', [Validators.required]),
                technology: new FormControl('', [Validators.required]),
                refreshRate: new FormControl(0, [Validators.required]),
                colorDepth: new FormControl('', [Validators.required]),
            }),
            camera: new FormGroup({
                backResolution: new FormControl('', [Validators.required]),
                backMaxZoom: new FormControl(0, [Validators.required]),
                frontResolution: new FormControl('', [Validators.required]),
                autofocus: new FormControl(false, [Validators.required]),
                flashlight: new FormControl(false, [Validators.required]),
                recordingMaxResolution: new FormControl('', [
                    Validators.required,
                ]),
            }),
            memory: new FormGroup({
                ram: new FormControl(0, [Validators.required]),
                storage: new FormControl(0, [Validators.required]),
            }),
            network: new FormGroup({
                simType: new FormControl('', [Validators.required]),
                dualSim: new FormControl(false, [Validators.required]),
                ['5g']: new FormControl(false, [Validators.required]),
            }),
            connection: new FormGroup({
                usb: new FormControl('', [Validators.required]),
                jack: new FormControl(false, [Validators.required]),
                wifi: new FormControl('', [Validators.required]),
                bluetooth: new FormControl('', [Validators.required]),
                nfc: new FormControl(false, [Validators.required]),
            }),
            physical: new FormGroup({
                height: new FormControl(0, [Validators.required]),
                width: new FormControl(0, [Validators.required]),
                depth: new FormControl(0, [Validators.required]),
                weight: new FormControl(0, [Validators.required]),
            }),
            battery: new FormControl(0, [Validators.required]),
            os: new FormControl('', [Validators.required]),
        }),
    });

    currentUser: User | null = null;
    selectedModel: Model | null = null;
    colors: string[] = [];
    storages: number[] = [];

    constructor(
        private authService: AuthService,
        private productService: ProductService,
        private commonService: CommonService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.checkCurrentUser();
        this.loadSelectedModel();
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

    loadSelectedModel() {
        const uuid = this.route.snapshot.queryParamMap.get('id');
        if (uuid) {
            this.productService
                .getModel(uuid)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (model) => {
                        this.selectedModel = model;
                        this.colors = this.selectedModel.colors;
                        this.storages =
                            this.selectedModel.details.memory.storages;
                        if (model === null) {
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
        if (this.selectedModel) {
            const picturesGroup = new FormGroup({});
            for (let i = 0; i < this.colors.length; i++) {
                picturesGroup.addControl(
                    'picture' + this.colors.length,
                    new FormControl(
                        this.selectedModel.pictures[i],
                        Validators.required
                    )
                );
            }

            this.modelForm = new FormGroup({
                name: new FormControl(this.selectedModel.name, [
                    Validators.required,
                ]),
                brand: new FormControl(this.selectedModel.brand, [
                    Validators.required,
                ]),
                basePrice: new FormControl(this.selectedModel.basePrice, [
                    Validators.required,
                    Validators.min(0),
                ]),
                color: new FormControl(''),
                pictures: picturesGroup,

                details: new FormGroup({
                    cpu: new FormGroup({
                        speed: new FormControl(
                            this.selectedModel.details.cpu.speed,
                            [Validators.required]
                        ),
                        cores: new FormControl(
                            this.selectedModel.details.cpu.cores,
                            [Validators.required]
                        ),
                    }),
                    display: new FormGroup({
                        diameter: new FormControl(
                            this.selectedModel.details.display.diameter,
                            [Validators.required]
                        ),
                        resolution: new FormControl(
                            this.selectedModel.details.display.resolution,
                            [Validators.required]
                        ),
                        technology: new FormControl(
                            this.selectedModel.details.display.technology,
                            [Validators.required]
                        ),
                        refreshRate: new FormControl(
                            this.selectedModel.details.display.refreshRate,
                            [Validators.required]
                        ),
                        colorDepth: new FormControl(
                            this.selectedModel.details.display.colorDepth,
                            [Validators.required]
                        ),
                    }),
                    camera: new FormGroup({
                        backResolution: new FormControl(
                            this.selectedModel.details.camera.backResolution,
                            [Validators.required]
                        ),
                        backMaxZoom: new FormControl(
                            this.selectedModel.details.camera.backMaxZoom,
                            [Validators.required]
                        ),
                        frontResolution: new FormControl(
                            this.selectedModel.details.camera.frontResolution,
                            [Validators.required]
                        ),
                        autofocus: new FormControl(
                            this.selectedModel.details.camera.autofocus,
                            [Validators.required]
                        ),
                        flashlight: new FormControl(
                            this.selectedModel.details.camera.flashlight,
                            [Validators.required]
                        ),
                        recordingMaxResolution: new FormControl(
                            this.selectedModel.details.camera.recordingMaxResolution,
                            [Validators.required]
                        ),
                    }),
                    memory: new FormGroup({
                        ram: new FormControl(
                            this.selectedModel.details.memory.ram,
                            [Validators.required]
                        ),
                        storage: new FormControl(0, [Validators.required]),
                    }),
                    network: new FormGroup({
                        simType: new FormControl(
                            this.selectedModel.details.network.simType,
                            [Validators.required]
                        ),
                        dualSim: new FormControl(
                            this.selectedModel.details.network.dualSim,
                            [Validators.required]
                        ),
                        ['5g']: new FormControl(
                            this.selectedModel.details.network['5g'],
                            [Validators.required]
                        ),
                    }),
                    connection: new FormGroup({
                        usb: new FormControl(
                            this.selectedModel.details.connection.usb,
                            [Validators.required]
                        ),
                        jack: new FormControl(
                            this.selectedModel.details.connection.jack,
                            [Validators.required]
                        ),
                        wifi: new FormControl(
                            this.selectedModel.details.connection.wifi,
                            [Validators.required]
                        ),
                        bluetooth: new FormControl(
                            this.selectedModel.details.connection.bluetooth,
                            [Validators.required]
                        ),
                        nfc: new FormControl(
                            this.selectedModel.details.connection.nfc,
                            [Validators.required]
                        ),
                    }),
                    physical: new FormGroup({
                        height: new FormControl(
                            this.selectedModel.details.physical.height,
                            [Validators.required]
                        ),
                        width: new FormControl(
                            this.selectedModel.details.physical.width,
                            [Validators.required]
                        ),
                        depth: new FormControl(
                            this.selectedModel.details.physical.depth,
                            [Validators.required]
                        ),
                        weight: new FormControl(
                            this.selectedModel.details.physical.weight,
                            [Validators.required]
                        ),
                    }),
                    battery: new FormControl(
                        this.selectedModel.details.battery,
                        [Validators.required]
                    ),
                    os: new FormControl(this.selectedModel.details.os, [
                        Validators.required,
                    ]),
                }),
            });
        }
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

    updateModel() {
        const form = this.modelForm;

        if (form && form.valid) {
            console.log(form.controls.name.value);
            this.productService
                .updateModel(
                    this.currentUser!,
                    this.selectedModel!.uuid,
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
                        console.log(model);
                        this.commonService.openSnackBarSuccess(
                            'Model updated!'
                        );
                        this.router.navigate(['admin/menu']);
                    },
                    error: () => {
                        this.commonService.openSnackBarError(
                            'Could not update the selected model!'
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
