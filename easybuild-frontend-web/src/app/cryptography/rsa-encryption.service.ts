import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { JSEncrypt } from 'jsencrypt';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class RsaEncryptionService {
  constructor(private http: HttpClient) { }

  private getPublicKey(): Observable<string> {
    return this.http.get(environment.apiUrl + 'security/public-key/rsa')
      .pipe(map(res => res as string));
  }

  private encryptStringWithKey(data: string, publicKey: string): string {
    let rsa = new JSEncrypt();
    rsa.setPublicKey(publicKey);
    return rsa.encrypt(data);
  }

  public encryptString(data: string): Observable<string> {
    return this.getPublicKey().pipe(map(key => this.encryptStringWithKey(data, key)));
  }
}