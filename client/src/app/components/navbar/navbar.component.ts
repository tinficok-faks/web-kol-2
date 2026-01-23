import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FilesService } from '../../services/files.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  username = '';

  constructor(private filesService: FilesService) { }

  ngOnInit(): void {
    // Ako već ima token, samo prikaži ime
    this.username = this.filesService.getNameFromToken() || '';

    // Ako nema token, napravi login (server vraća JWT)
    if (!this.username) {
      this.filesService.login().subscribe({
        next: (res) => {
          localStorage.setItem('token', res.token);
          this.username = this.filesService.getNameFromToken() || '';
        },
        error: () => {
          this.username = '';
        },
      });
    }
  }
}
