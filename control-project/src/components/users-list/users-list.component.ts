import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { User } from '../../types/User';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../services/user.service';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { AddUserComponent } from '../add-user/add-user.component';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [MatTableModule, CommonModule, MatCardModule,AddUserComponent],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css'
})
export class UsersListComponent implements OnInit {

  private userService = inject(UserService); // אינג'קט לשירות
  private router = inject(Router)
  dataSource = new MatTableDataSource<User>(); // הגדרת dataSource ריק כברירת מחדל
  displayedColumns: string[] = ['id', 'name', 'email']; // לדוגמה, עמודות מוצגות
  users: User[] = [];
  addUser:boolean = false;

  ngOnInit() {
    this.userService.getUsers();
    this.userService.users$.subscribe(users => {
      if (users) {
        this.dataSource.data = users;
        this.users = users;// עדכון dataSource כשהנתונים מתקבלים
      }
    });
  }

  goToDetails(userId: number) {
    this.router.navigate(['/user', userId]); // מעבר לעמוד פרטי המשתמש
  }

 closeAddUser(){
  this.addUser=false;
 }
}

