import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Config } from '@app/app.config';
import { UserIdentity } from '@app/shared/models/user-identity';
import { environment } from '@env/environment';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ImageService {
  constructor(private http: HttpClient) { }

  getUrlFromId(id: string): string {
    return id ? `${environment.apiUrl}image/${id}/data` : null;
  }

  postImage(img: File | Blob, overrideName?: string): Observable<string> {
    if (!img) {
      return of(null);
    }

    let name = overrideName || (<File>img).name || Config.GlobalDefault.IMAGE_NAME;
    const formData: FormData = new FormData();
    formData.append('file', img, name);
    return this.http.post(environment.apiUrl + 'image', formData)
      .pipe(map(r => r as string));
  }

  putImage(img: File | Blob, id: string, overrideName?: string): Observable<any> {
    if (!img) {
      return of(null);
    }

    let name = overrideName || (<File>img).name || Config.GlobalDefault.IMAGE_NAME;
    const formData: FormData = new FormData();
    formData.append('file', img, name);
    return this.http.put(environment.apiUrl + 'image/' + id, formData);
  }

  deleteImage(id: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}image/${id}`);
  }

  generateDefaultAvatarUrl(user: UserIdentity): string {
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="50" fill="${this.stringToHslColor(user.username, 70, 70)}"/>
        <text x="50" y="55" text-anchor="middle" alignment-baseline="middle" font-family="Arial"
            font-size="50" fill="#ffffff" pointer-events="none">
            ${user.name[0].toUpperCase()}${user.lastName[0].toUpperCase()}
        </text>
    </svg>`;

    let blob = new Blob([svg], { type: 'image/svg+xml' });
    return URL.createObjectURL(blob);
  }

  private stringToHslColor(str: string, s: number, l: number) {
    let hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    return `hsl(${hash % 360}, ${s}%, ${l}%)`;
  }
}