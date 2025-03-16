import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowseComponent } from './browse/browse.component';

const routes: Routes = [
    {
        path: 'browse',
        component: BrowseComponent,
        title: 'Browse mobiles - OneMobile',
    },
    { path: '', redirectTo: 'browse', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ProductRoutingModule {}
