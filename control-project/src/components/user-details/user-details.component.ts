import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../types/User';
import { MatCardModule } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UpdateUserComponent } from '../update-user/update-user.component';
import { CommonModule } from '@angular/common';
import { Notyf } from 'notyf';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [MatCardModule, CommonModule, MatIconModule, MatButtonModule, UpdateUserComponent],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css'
})
export class UserDetailsComponent implements OnInit {
  user: User = { userName: '', email: '', id: -1, phoneNumber: '',passwordHash: ''  };
  updateUser: boolean = false;
  private notyf = new Notyf({
    duration: 40000,
    position: { x: 'center', y: 'top' },
    dismissible: true 
  });
  constructor(private route: ActivatedRoute, private userService: UserService, private router: Router) { }

  ngOnInit() {
    const userIdString = this.route.snapshot.paramMap.get('id');
    const userId = userIdString ? Number(userIdString) : null;

    if (userId !== null && !isNaN(userId)) {
      this.userService.getUserById(userId).subscribe(data => {
        this.user = data;
      });
    } else {
      this.notyf.error('Invalid user ID');
    }
  }

  goBack() {
    this.router.navigate(['/users']);
  }

  onDeleteUser() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this user?',
      icon: "question",
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel'
    }).then((result:any) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(this.user.id).subscribe(() => {
          this.router.navigate(['/users']); 
        }, error => {
          this.notyf.error(`${error.error}`)
        });
      }
    });
  }
  closeUpdateUser(){
    this.updateUser = false;
    const userIdString = this.route.snapshot.paramMap.get('id');
    const userId = userIdString ? Number(userIdString) : null;
    if (userId!== null &&!isNaN(userId)) {
    this.userService.getUserById(userId).subscribe(data => {
      this.user = data;
    });}
  }
}
