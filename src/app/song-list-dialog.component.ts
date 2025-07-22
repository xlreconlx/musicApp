import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-song-list-dialog',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, MatButtonModule, MatDialogModule, MatTableModule],
  templateUrl: './song-list-dialog.component.html',
  styleUrls: ['./song-list-dialog.component.css']
})
export class SongListDialogComponent {
  displayedColumns: string[] = ['titulo', 'artista', 'album', 'anno', 'genero'];

  constructor(
    public dialogRef: MatDialogRef<SongListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { playlistName: string, songs: any[] }
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
