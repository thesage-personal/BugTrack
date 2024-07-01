import { AfterViewChecked, Component } from '@angular/core';
import { AuthService } from './shared/Auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements AfterViewChecked {
  constructor(private authserv: AuthService) { }
  title = 'app';
  showNav = false;
  ngAfterViewChecked() {
    if (this.authserv.isLoggedIn()) {
      this.showNav = true;
    }
    else {
      this.showNav = false;
    }
  }
}
