import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { FilesService, FileItem } from '../../services/files.service';

@Component({
  selector: 'app-files',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
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

  getFileIcon(filename: string): string {
    const ext = filename.split(".").pop()?.toLowerCase() || "";
    switch (ext) {
      case "mp3":
      case "wav":
      case "flac":
        return "🎵";
      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
      case "svg":
        return "📷";
      case "docx":
      case "doc":
        return "📘";
      case "pdf":
        return "📕";
      case "xlsx":
      case "xls":
      case "csv":
        return "📊";
      case "mp4":
      case "avi":
      case "mov":
      case "mkv":
        return "🎥";
      default:
        return "📄";
    }
  }

  formatFileSize(bytes: number): string {
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
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
