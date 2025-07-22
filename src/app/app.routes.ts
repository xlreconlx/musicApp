import { Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { PlaylistComponent } from './playlist.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'playlists', component: PlaylistComponent, canActivate: [authGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];