import { Component, OnInit } from '@angular/core';
import { FilesService, FileItem } from '../../services/files.service';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss'],
})
export class FilesComponent implements OnInit {
  files: FileItem[] = [];
  isLoading = false;

  constructor(private filesService: FilesService) { }

  ngOnInit(): void {
    this.loadFiles();
  }

  loadFiles(): void {
    this.isLoading = true;
    this.filesService.listFiles().subscribe({
      next: (items) => {
        this.files = items;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        alert('Ne mogu dohvatiti datoteke.');
      },
    });
  }

  download(item: FileItem): void {
    this.filesService.download(item._id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = item.originalName;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => alert('Download nije uspio.'),
    });
  }

  delete(item: FileItem): void {
    if (!confirm(`Obrisati "${item.originalName}"?`)) return;

    this.filesService.delete(item._id).subscribe({
      next: () => {
        this.files = this.files.filter((f) => f._id !== item._id);
      },
      error: () => alert('Brisanje nije uspjelo.'),
    });
  }
}
