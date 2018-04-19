import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public showMenu = false;

  public manageMenu() {
    console.log('inside!');
    this.showMenu = !this.showMenu;
  }
}
