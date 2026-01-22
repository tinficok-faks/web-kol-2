import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FilesService } from '../../services/files.service';

@Component({
  selector: 'app-new-file',
  templateUrl: './new-file.component.html',
  styleUrls: ['./new-file.component.scss'],
})
export class NewFileComponent {
  selectedFile: File | null = null;
  isUploading = false;

  constructor(private filesService: FilesService, private router: Router) { }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files && input.files.length ? input.files[0] : null;
  }

  onSubmit(): void {
    if (!this.selectedFile) return;

    this.isUploading = true;
    this.filesService.upload(this.selectedFile).subscribe({
      next: () => {
        this.isUploading = false;
        this.router.navigate(['/files']);
      },
      error: () => {
        this.isUploading = false;
        alert('Upload nije uspio.');
      },
    });
  }
}
