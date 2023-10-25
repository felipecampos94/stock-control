import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {enviroment} from "../../../enviroments/enviroment";
import {SignupUserRequest} from "../../models/interfaces/user/SignupUserRequest";
import {Observable} from "rxjs";
import {SignupUserResponse} from "../../models/interfaces/user/SignupUserResponse";
import {AuthResquest} from "../../models/interfaces/user/auth/AuthResquest";
import {AuthResponse} from "../../models/interfaces/user/auth/AuthResponse";
import {CookieService} from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private API_URL = enviroment.API_URL;

  constructor(private http: HttpClient, private cookieService: CookieService) {
  }

  signupUser(requestDatas: SignupUserRequest): Observable<SignupUserResponse> {
    return this.http.post<SignupUserResponse>(`${this.API_URL}/user`, requestDatas);
  }

  authUser(requestDatas: AuthResquest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth`, requestDatas);
  }

  isLoggedIn(): boolean {
    //Verificar se o user possui um token ou cookie
    const JWT_TOKEN = this.cookieService.get('USER_INFO');
    return !!JWT_TOKEN;
  }
}
