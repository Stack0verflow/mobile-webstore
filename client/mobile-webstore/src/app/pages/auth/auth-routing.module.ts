import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        title: 'Log in - OneMobile',
    },
    {
        path: 'signup',
        component: SignupComponent,
        title: 'Sign up - OneMobile',
    },
    {
        path: 'profile',
        component: ProfileComponent,
        title: 'Profile - OneMobile',
    },
    { path: '', redirectTo: 'profile', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AuthRoutingModule {}
