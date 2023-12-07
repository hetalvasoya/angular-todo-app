import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Constants } from 'src/app/config/constants';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  private apiBaseUrl = Constants.API_ENDPOINT;
  
  
  constructor(
    // Angular modules
    private http: HttpClient
  ) {     
  }
  
  private getHeaders(): HttpHeaders {   
    const authToken =  localStorage.getItem('token');  
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`
    });
  }

  get(url: string, options?:any) : Observable<any[]> {  
    const headers = this.getHeaders();
    return this.http.get<any[]>(`${this.apiBaseUrl}${url}`, {headers})
  }
  // get(url: string, options?:any) {
  //   return this.http.get(`${this.apiBaseUrl}${url}`, options)
  // }
  // public fetchData(url: string, options?:any) {    
  //   return this.http.get(`${this.apiBaseUrl}${url}`, options)
  //   .pipe(catchError((error: any) => {
  //       console.log("Error", error);
  //       return error;
  //     })
  //   )
  // }  
  post(url: string, data: any, options?:any) {
    const headers = this.getHeaders();
    return this.http.post(`${this.apiBaseUrl}${url}`, data, {headers})
  }

  // public post(url: string, data: any, options?: any) {
  //     return this.http.post(`${this.apiBaseUrl}${url}`, data, options)
  //     .pipe(catchError((error: any) => {
  //       console.log("Error", error);
  //       return error;
  //     })
  //   );
  // }
  public put(url: string, data: any, options?:any) {
    const headers = this.getHeaders();
    return this.http.put(`${this.apiBaseUrl}${url}`, data, {headers})
  }
  public delete(url: string, options?:any) {
    const headers = this.getHeaders();
    return this.http.delete(`${this.apiBaseUrl}${url}`, {headers})
  }  

  postAuth(url: string, data: any, options?: any)  {    
    return this.http.post(`${this.apiBaseUrl}${url}`, data);
 }
}
