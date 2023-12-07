import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';

import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { MessageService } from '../services/message/message.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private msgService: MessageService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log("eeeeeeeeeeeeeeeeeee", error);
        
        if(error.status === 0) {
        //  this.authService.logOut();
        }

        if(error.status === 429) {
          this.msgService.openSnackBar((!error.error.error) ? error.error.message: error.error.error, 'Close', 'mat-error');
        }
        if(error.status === 400) {
          this.msgService.openSnackBar((!error.error.error) ? error.error.message: error.error.error, 'Close', 'mat-warn');
        }
        if(error.status === 401) {
          this.msgService.openSnackBar((!error.error.error) ? error.error.message: error.error.error, 'Close', 'mat-warn');
          this.authService.logOut();
        }
        if(error.status === 500) {
          this.msgService.openSnackBar((!error.error.error) ? error.error.message: error.error.error, 'Close', 'mat-error');
        }
        if(error.status === 404) {
          this.msgService.openSnackBar((!error.error.error) ? error.message: error.error.error, 'Close', 'mat-error');
        }
        
        // if (error.error instanceof ErrorEvent) {
        //   // A client-side or network error occurred.
        //   console.error('An error occurred:', error.error.message);
        // } else {
        //   // The backend returned an unsuccessful response code.
        //   console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
        // }

        // // Handle specific error codes, including net::ERR_CONNECTION_REFUSED
        // if (error.error && error.error.code === 'net::ERR_CONNECTION_REFUSED') {
        //   // Handle the specific error here
        //   // You can display a user-friendly message or take other actions
        // }
        return throwError(error);
      })
    );
  }
}
