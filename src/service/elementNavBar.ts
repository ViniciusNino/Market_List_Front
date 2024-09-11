import { Injectable } from "@angular/core";
import { ROUTES_COMPONENTS } from "src/app/app-const.route";

@Injectable({
  providedIn: 'root'
})

export class ElementNavBar {

  constructor(
  ) { }

  validateMenuNavbar(route: string = null) {
    const url = route ?? window.location.pathname.split('/')[1];
    document.getElementsByName('menuNavbar').forEach((itemMenu => {
      itemMenu.className = itemMenu.innerHTML.toLowerCase() === url ? 'menu__list-li selected' : 'menu__list-li';
    }));
    document.getElementsByName('menu')[0].style.visibility = url === ROUTES_COMPONENTS.LOGIN || url === '' ? 'hidden' : 'visible';
  }
}
