import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { StateService } from '@app/core/services/state.service';
import { PermanentStorageService } from '@app/core/services/storage.service';
import { LoginModel } from '@app/shared/models/login-model';
import { ProfileManagementModel } from '@app/shared/models/profile-management';
import { environment } from '@env/environment';
import { AuthModel } from '@shared/models/auth-model';
import { RegisterModel } from '@shared/models/register-model';
import { UserIdentity } from '@shared/models/user-identity';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, tap } from 'rxjs/operators';

@Injectable()
export class AuthService {
  private static readonly LS_AUTH_KEY: string = 'easyBuildAuth';
  private model: AuthModel;
  private authChange: BehaviorSubject<AuthModel> = new BehaviorSubject<AuthModel>(new AuthModel());
  public onAuthChanged$ = this.authChange.asObservable().pipe(distinctUntilChanged());

  get identity(): UserIdentity {
    return this.model.user;
  }

  get jwt(): string {
    return this.model.jwt;
  }

  constructor(
    private http: HttpClient,
    private storage: PermanentStorageService,
    private state: StateService) {
    this.model = storage.get(AuthService.LS_AUTH_KEY) || new AuthModel();
  }

  public isAuthorized(): boolean {
    return this.identity != null && this.jwt != null
  }

  public login(model: LoginModel): Observable<AuthModel> {
    let body = JSON.stringify(model);
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
    return this.http.post(environment.apiUrl + 'account/login', body, { headers: headers })
      .pipe(
        tap((response: AuthModel) => {
          this.model = response;
          this.storage.set(AuthService.LS_AUTH_KEY, this.model);
          this.authChange.next(this.model);
        })
      );
  }

  public refreshIdentity(): Observable<any> {
    return this.http.get(environment.apiUrl + 'account/identity')
      .pipe(tap(user => {
        this.model.user = user;
        this.storage.set(AuthService.LS_AUTH_KEY, this.model);
        this.authChange.next(this.model);
      }));
  }

  public register(data: RegisterModel): Observable<any> {
    let body = JSON.stringify(data);
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
    return this.http.post(environment.apiUrl + 'account/register', body, { headers: headers });
  }

  public patchProfile(data: ProfileManagementModel): Observable<any> {
    let body = JSON.stringify(data);
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
    return this.http.patch(environment.apiUrl + 'account/profile', body, { headers: headers });
  }

  public logout() {
    this.storage.clear();
    this.state.clear();
    this.model = new AuthModel();
    this.authChange.next(this.model);
  }
}