import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GenericHttpService } from './generic-http.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private _service: GenericHttpService<any>) { }

  getProfile(): Observable<any> {
    return this._service.get('users/profile');
  }

  updateProfile(data: any): Observable<any> {
    return this._service.put('users/profile', data);
  }
}
