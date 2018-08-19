import { Component } from '@angular/core';
import {LoginService} from './services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works';
  loggedIn=false;
  constructor(private loginService: LoginService){}
  
  ngOnInit() {
  
			this.loginService.getSubject().subscribe((value)=>{
				this.loggedIn=value["loggedIn"];
			});	 

  }			
}
