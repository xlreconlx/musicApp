import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
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

  username = '';
  password = '';
  token: string | null = null;

  constructor(private http: HttpClient) {}

  login(): void {
    this.http.post('http://localhost:8080/auth/login', { username: this.username, password: this.password }, { responseType: 'text' })
      .subscribe({
        next: (res: string) => {
          this.token = res;
          console.log(res);
          localStorage.setItem('token', res);
          this.getPlaylists(); 
          this.obtenerListas();
          this.obtenerGeneros();
        },
        error: () => alert('Login fallido')
      });
  }

  getPlaylists(): void {
    if (!this.token) return;

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    console.log(token);
    console.log(headers);
    this.http.get<any[]>(this.apiUrl, { headers })
      .subscribe({
        next: (data) => this.playlists = data,
        error: () => alert('Error al obtener playlists')
      });
  }

  logout(): void {
    this.token = null;
    this.playlists = [];
    localStorage.removeItem('token');
  }

  obtenerGeneros() {
    this.http.get<string[]>(this.generosUrl).subscribe({
      next: (data) => this.generos = data,
      error: (err) => {
        console.error('Error obteniendo géneros:', err);
        this.generos = []; // fallback vacío
      }
    });
  }

  agregarCancion() {
    this.playlist.canciones.push({ titulo: '', artista: '', album: '', anno: '', genero: '' });
  }

  eliminarCancion(index: number) {
    this.playlist.canciones.splice(index, 1);
  }

  crearLista() {
    this.http.post(this.apiUrl, this.playlist).subscribe({
      next: () => {
        this.mensaje = 'Lista creada exitosamente';
        this.playlist = {
          nombre: '',
          descripcion: '',
          canciones: [{ titulo: '', artista: '', album: '', anno: '', genero: '' }]
        };
        this.obtenerListas();
      },
      error: (err) => {
        console.error(err);
        this.mensaje = 'Error al crear la lista';
      }
    });
  }

  obtenerListas() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (res) => this.playlists = res,
      error: (err) => console.error(err)
    });
  }

  eliminarLista(nombre: string) {
    this.http.delete(`${this.apiUrl}/${nombre}`).subscribe({
      next: () => {
        this.mensaje = `Lista "${nombre}" eliminada`;
        this.obtenerListas();
      },
      error: () => this.mensaje = `No se pudo eliminar la lista "${nombre}"`,
    });
  }


}
