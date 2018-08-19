import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {LoginService} from '../../services/login.service';
import { Title } from '@angular/platform-browser';
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router:Router,
		private titleService:Title,private loginService: LoginService) { }
  private loggedIn =false;
  ngOnInit() {
	$(document).ready(function(){
		$(this).scrollTop(0);
	});	 
	this.titleService.setTitle("FoundersRooms");	  
    this.loginService.checkSession().subscribe(
      res => {
        this.loggedIn=true;
		this.loginService.sendLoginEvent(true);
      },
      error => {
        this.loggedIn=false;
		this.loginService.sendLoginEvent(false);
      }
    );	
  }


}
