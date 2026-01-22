// import { Routes } from '@angular/router';

// export const routes: Routes = [];


import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FilesComponent } from './pages/files/files.component';
import { NewFileComponent } from './pages/new-file/new-file.component';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'files' },
    { path: 'files', component: FilesComponent },
    { path: 'new-file', component: NewFileComponent },
    { path: '**', redirectTo: 'files' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule { }
