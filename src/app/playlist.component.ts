import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from './auth';
import { Router } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SongListDialogComponent } from './song-list-dialog.component';

@Component({
  selector: 'app-playlist',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatExpansionModule,
    MatTableModule,
    MatDialogModule
  ],
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {
  apiUrl = 'http://localhost:8080/lists';
  generosUrl = 'http://localhost:8080/spotify/generos';

  playlist = {
    nombre: '',
    descripcion: '',
    canciones: [
      { titulo: '', artista: '', album: '', anno: '', genero: '' }
    ]
  };

  playlists: any[] = [];
  generos: string[] = [];
  mensaje = '';
  displayedColumns: string[] = ['nombre', 'descripcion', 'acciones'];

  constructor(private http: HttpClient, public authService: AuthService, private router: Router, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getPlaylists();
    this.obtenerGeneros();
  }

  getPlaylists(): void {
    const token = this.authService.getToken();
    if (!token) return;

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get<any[]>(this.apiUrl, { headers }).subscribe({
      next: (data) => this.playlists = data,
      error: () => alert('Error al obtener playlists')
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  obtenerGeneros() {
    const token = this.authService.getToken();
    if (!token) return;

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get<string[]>(this.generosUrl, { headers }).subscribe({
      next: (data) => this.generos = data,
      error: (err) => {
        console.error('Error obteniendo géneros:', err);
        this.generos = [];
      }
    });
  }

  agregarCancion() {
    this.playlist.canciones = [...this.playlist.canciones, { titulo: '', artista: '', album: '', anno: '', genero: '' }];
  }

  eliminarCancion(index: number) {
    if (this.playlist.canciones.length > 1) {
      this.playlist.canciones.splice(index, 1);
      this.playlist.canciones = [...this.playlist.canciones]; // Force change detection
    }
  }

  crearLista() {
    const token = this.authService.getToken();
    if (!token) return;

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.post(this.apiUrl, this.playlist, { headers }).subscribe({
      next: () => {
        this.mensaje = 'Lista creada exitosamente';
        this.playlist = {
          nombre: '',
          descripcion: '',
          canciones: [{ titulo: '', artista: '', album: '', anno: '', genero: '' }]
        };
        this.getPlaylists();
      },
      error: (err) => {
        console.error(err);
        this.mensaje = 'Error al crear la lista';
      }
    });
  }

  eliminarLista(nombre: string) {
    const token = this.authService.getToken();
    if (!token) return;

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.delete(`${this.apiUrl}/${nombre}`,{ headers }).subscribe({
      next: () => {
        this.mensaje = `Lista "${nombre}" eliminada`;
        this.getPlaylists();
      },
      error: () => this.mensaje = `No se pudo eliminar la lista "${nombre}"`,
    });
  }

  selectPlaylist(playlist: any): void {
    this.dialog.open(SongListDialogComponent, {
      data: { playlistName: playlist.nombre, songs: playlist.canciones },
      width: '600px'
    });
  }
}
