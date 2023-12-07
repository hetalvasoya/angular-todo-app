import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  // message: string = '';
  setAutoHide: boolean = true;
  autoHide: number = 1500;
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  constructor(public snackBar: MatSnackBar) { }

  // open(message: string, action: string, toolBarColor: string) {
  //   this.snackBar.open(this.message, action, {
  //     duration: 2000,
  //     panelClass: ['mat-toolbar', toolBarColor]
  //   })
  // }

  openSnackBar(message: any[], action: string, toolBarColor: string) {
    let config = new MatSnackBarConfig();
    config.verticalPosition = this.verticalPosition;
    config.horizontalPosition = this.horizontalPosition;
    config.duration = this.setAutoHide ? this.autoHide : 0;
    config.panelClass = ['mat-toolbar', toolBarColor];
    

    if ( message instanceof Array) {
      const errorRes = message;
      // console.log(errorRes, this.autoHide);
      // errorRes.forEach( (item:any, index: number) => {
      errorRes.map((item: any, index: number) => {
        this.snackBar.open(item.msg, 'Undo', {
          duration: this.autoHide
        });
        this.autoHide +=  500;
        this.snackBar.open(item.msg, action, config);            
       
        
        // setTimeout(() => {
          // this.snackBar.open(item.msg, action , config);  
        // },index * (this.autoHide+5));
      })
    } else {
      this.snackBar.open(message, action, config); 
    } 
  }
}
