import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { User } from '../../types/User';
import { UserService } from '../../services/user.service';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { AddUserComponent } from '../add-user/add-user.component';
import {MatButtonModule} from '@angular/material/button';
@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [MatTableModule, CommonModule, MatCardModule,AddUserComponent,MatButtonModule],
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

