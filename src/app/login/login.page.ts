import { Component, OnInit } from '@angular/core';
import { ElementNavBar } from 'src/service/elementNavBar';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  showSignIn: boolean = true;

  constructor(
    // readonly elementNavBar: ElementNavBar,
    ) { }

    ngOnInit(): void {
      // this.elementNavBar.validateMenuNavbar();
  }

  onShowSign(show: boolean) {
    this.showSignIn = show;
  }
}
