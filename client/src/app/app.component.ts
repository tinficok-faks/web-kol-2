import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  filename: string = "rezultati.xlsx";
  size: number = 9.99;

  ext_2_icon (filename: string) {
    const ext = filename.split(".").pop();
    switch (ext) {
      case "mp3":
      case "wav":
        return "🎵";
      case "png":
      case "jpg":
        return "📷";
      case "docx":
        return "📘";
      case "pdf":
        return "📕";
      case "xlsx":
        return "📊";
      case "mp4":
        return "🎥";
      default:
        return "📄";
    }
  }

}
