import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
    {
        path: 'not-found',
        component: NotFoundComponent,
        title: 'Page Not Found - OneMobile',
    },
    {
        path: 'home',
        component: HomeComponent,
        title: 'Home - OneMobile',
    },
    {
        path: 'user',
        loadChildren: () =>
            import('./pages/auth/auth.module').then((m) => m.AuthModule),
    },
    {
        path: 'admin',
        loadChildren: () =>
            import('./pages/admin/admin.module').then((m) => m.AdminModule),
    },
    {
        path: 'product',
        loadChildren: () =>
            import('./pages/product/product.module').then(
                (m) => m.ProductModule
            ),
    },
    {
        path: 'order',
        loadChildren: () =>
            import('./pages/order/order.module').then((m) => m.OrderModule),
    },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', redirectTo: '/not-found' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
