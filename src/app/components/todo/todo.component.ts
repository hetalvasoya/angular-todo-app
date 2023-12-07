import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { Task } from 'src/app/model/task';
import { MessageService } from 'src/app/services/message/message.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { CommonFunction } from 'src/app/common/commonfunction';
import { User } from 'src/app/model/user';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {

  todoForm! : FormGroup;
  users: User[] = [];
  todoTasks: Task[] = [];
  inProgress: Task [] = [];
  completedTask: Task [] = [];
  isEnableEdit : boolean = false;
  searchText: string = '';
  updateTitleIndex: any;
  constructor(private fb: FormBuilder, private apiService: ApiService, private msgService: MessageService, private dialog: MatDialog) {}

  ngOnChange () {
    this.getUserList()
  }

  ngOnInit() {
    this.todoForm = this.fb.group({
      _id: [''],
      title: ['', Validators.required],
      description: ['', Validators.required],
      dueDate: ['', Validators.required],
      assigneeId: [''],
      order: [this.todoTasks.length]
    });
    this.getTaskList();
    this.getUserList()
  }

  search() {
    if(this.searchText) {
      const taskFilterData = this.todoTasks.filter((item) => {
        return item.title.toLowerCase().includes(this.searchText.toLowerCase());
      })
      this.todoTasks = taskFilterData;
      const inProgressTaskFilterData = this.inProgress.filter((item) => {
        return item.title.toLowerCase().includes(this.searchText.toLowerCase());
      })
      this.inProgress = inProgressTaskFilterData;
      const completedTaskFilterData = this.completedTask.filter((item) => {
        return item.title.toLowerCase().includes(this.searchText.toLowerCase());
      })
      this.completedTask = completedTaskFilterData;
    } else {
      this.getTaskList();
    }
  }

  getUserList() {
    this.apiService.get('/userList').subscribe((res: any) => {
      if(res.success) {
        this.users = res.data;       
      } else {
        this.msgService.openSnackBar((!res.error) ? res.message: res.error, 'Close', 'mat-info');
      }
    })
  }

  getTaskList() {
    this.apiService.get('/task/list').subscribe((res: any) => {
      if(res.success) {
        this.todoTasks = [];
        this.inProgress = [];
        this.completedTask = [];
        res.data.map((item: any) => {
          if(item.status == 0) {
            this.todoTasks.push(item)
          }
          if(item.status == 1) {
            this.inProgress.push(item)
          }
          if(item.status == 2) {
            this.completedTask.push(item)
          }
        })
        this.todoTasks.sort((a: any, b: any) => b['order'] - a['order']);     
      } else {
        this.msgService.openSnackBar((!res.error) ? res.message: res.error, 'Close', 'mat-info');
      }
    })    
  }

  moveTask(event: CdkDragDrop<Task[]>) {  
     
    let currentElement = event.container.element.nativeElement.id;
    let status = currentElement.split('cdk-drop-list-')[1];          
    
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
   
    let updateData = event.container.data[0];
    updateData.status = parseInt(status);
    event.container.data.map((item: any) => {
      item.status = status;
      return item;
    });

    this.apiService.post('/task/moveTask', {data: event.container.data, status: status, order: event.currentIndex}).subscribe((res: any) => {
      if(res.success) {
        this.getTaskList();
        (res.message) ? this.msgService.openSnackBar(res.message, 'Close', 'mat-success') : '';
      } else {
        this.msgService.openSnackBar((!res.error) ? res.message: res.error, 'Close', 'mat-warn');
      }
    })
  }

  addTask() {
    const saveTaskObj = {
      title: this.todoForm.value.title,
      description: this.todoForm.value.description,
      dueDate: CommonFunction.convertDate(this.todoForm.value.dueDate),
      assigneeId: this.todoForm.value.assigneeId,
      order: this.todoTasks.length
    }
    
    this.apiService.post('/task/add', saveTaskObj).subscribe((res: any) => {
      if(res.success) {
        this.todoTasks.unshift(res.data)
        this.todoForm.reset();      
        (res.message) ? this.msgService.openSnackBar(res.message, 'Close', 'mat-success') : '';  
      } else {
        this.msgService.openSnackBar((!res.error) ? res.message: res.error, 'Close', 'mat-warn');
      }
    })
  }

  deleteTask(_id: string, i: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if(result === true) {
        this.apiService.delete(`/task/delete/${_id}`).subscribe((res: any) => {
          if(res.success) {
            this.getTaskList();
            (res.message) ? this.msgService.openSnackBar(res.message, 'Close', 'mat-success') : '';
          } else {
            this.msgService.openSnackBar((!res.error) ? res.message: res.error, 'Close', 'mat-warn');
          }
        })
      }
    });
  }
  
  editTask(item: Task, i: number ) {   
    this.updateTitleIndex = i;
    this.todoForm.controls['_id'].setValue(item._id);
    this.todoForm.controls['title'].setValue(item.title);
    this.todoForm.controls['description'].setValue(item.description);
    this.todoForm.controls['dueDate'].setValue(item.dueDate);
    this.todoForm.controls['assigneeId'].setValue(item.assigneeId);
    this.isEnableEdit = true
  }

  updateTask() {
    this.todoForm.value.dueDate = CommonFunction.convertDate(this.todoForm.value.dueDate)
    this.apiService.put('/task/update', this.todoForm.value).subscribe((res: any) => {
      if(res.success) {
        this.todoForm.reset();
        this.isEnableEdit = false;
        this.getTaskList();
        (res.message) ? this.msgService.openSnackBar(res.message, 'Close', 'mat-success') : '';
      } else {
        this.msgService.openSnackBar((!res.error) ? res.message: res.error, 'Close', 'mat-warn');
      }
    });
  }

  resetForm() {
    this.todoForm.controls['_id'].setValue('');
    this.todoForm.controls['title'].setValue('');
    this.todoForm.controls['description'].setValue('');
    this.todoForm.controls['dueDate'].setValue('');
    this.todoForm.controls['assigneeId'].setValue('');
  }
  
}
