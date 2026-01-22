import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface FileItem {
  _id: string;
  originalName: string;
  storedName: string;
  mimetype: string;
  size: number;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class FilesService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  login(): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, {});
  }

  listFiles(): Observable<FileItem[]> {
    return this.http.get<FileItem[]>(`${this.apiUrl}/files`);
  }

  upload(file: File): Observable<FileItem> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<FileItem>(`${this.apiUrl}/files`, formData);
  }

  download(fileId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/files/${fileId}/download`, { responseType: 'blob' });
  }

  delete(fileId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/files/${fileId}`);
  }

  getNameFromToken(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    // JWT decode bez libraryja:
    try {
      const payloadPart = token.split('.')[1];
      const payloadJson = atob(payloadPart.replace(/-/g, '+').replace(/_/g, '/'));
      const payload = JSON.parse(payloadJson);
      return payload?.name ?? null;
    } catch {
      return null;
    }
  }
}
