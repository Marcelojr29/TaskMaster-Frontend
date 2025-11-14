import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, delay, map, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { CustomHttpParamEncoder } from '../helpers/customHttpParamEncoder';

@Injectable({
  providedIn: 'root'
})
export class GenericHttpService<T> {
  protected readonly apiUrl = `${environment.api.url}`;

  constructor(private http: HttpClient) { }

  private convertObjToHttpParams(query: any) {
    let params = new HttpParams({ encoder: new CustomHttpParamEncoder() });
    if (query) {
      Object.keys(query).forEach((key) => {
        params = params.append(key, query[key]);
      });
    }
    return params;
  }

  get(endpoint: string, args?: any): Observable<any> {
    const params = this.convertObjToHttpParams(args);
    const url = `${this.apiUrl}/${endpoint}`;
    
    return this.http.get<any>(url, { params }).pipe(
      tap({
        next: val => { },
        error: error => {
          console.log('on error', error.message);
        },
        complete: () => { }
      }),
      catchError(this.handleError)
    );
  }

  getById(endpoint: string, id: string): Observable<any> {
    const url = `${this.apiUrl}/${endpoint}/${id}`;
    return this.http.get<any>(url).pipe(
      tap({
        next: val => { },
        error: error => {
          console.log('on error', error.message);
        },
        complete: () => { }
      }),
      catchError(this.handleError)
    );
  }

  post(endpoint: string, data: T): Observable<T> {
    const url = `${this.apiUrl}/${endpoint}`;
    return this.http.post<T>(url, data).pipe(
      catchError(this.handleError)
    );
  }

  put(endpoint: string, data: T, id?: string): Observable<T> {
    const url = id ? `${this.apiUrl}/${endpoint}/${id}` : `${this.apiUrl}/${endpoint}`;
    return this.http.put<T>(url, data).pipe(
      catchError(this.handleError)
    );
  }

  delete(endpoint: string, id: string): Observable<any> {
    const url = `${this.apiUrl}/${endpoint}/${id}`;
    return this.http.delete<any>(url).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('HTTP Error:', error);
    return throwError(() => error);
  }
}
