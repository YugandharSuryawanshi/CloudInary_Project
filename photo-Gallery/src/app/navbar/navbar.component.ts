import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  // isLoggedIn = false;

  // login() {
  //   this.isLoggedIn = true;
  // }

  // logout() {
  //   this.isLoggedIn = false;
  // }

}
