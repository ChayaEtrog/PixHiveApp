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

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [MatTableModule, CommonModule],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css'
})
export class UsersListComponent  implements OnInit {

  private userService = inject(UserService); // אינג'קט לשירות
  
  dataSource = new MatTableDataSource<User>(); // הגדרת dataSource ריק כברירת מחדל
  displayedColumns: string[] = ['id', 'name', 'email']; // לדוגמה, עמודות מוצגות

  ngOnInit() {
     this.userService.getUsers(); 
    this.userService.users$.subscribe(users => {
      if (users) {
        this.dataSource.data = users; // עדכון dataSource כשהנתונים מתקבלים
      }
    });
  }
  // פונקציה לפתיחת דיאלוג לפרטי המשתמש
  openUserDetails(user: User): void {
    // const dialogRef = this.dialog.open(UserDetailsDialog, {
    //   width: '400px',
    //   data: user,
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     // אם היה שינוי, אפשר לעדכן את רשימת המשתמשים
    //     this.userService.getUsers();
    //   }
    // });
  }
}
