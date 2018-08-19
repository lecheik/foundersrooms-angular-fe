import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { LoginService } from '../../services/login.service';
import {Params, ActivatedRoute, Router} from '@angular/router';
import {Http} from '@angular/http';
import {AppConst} from '../../constants/app-const';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
	
  public filterQuery = "";
  public rowsOnPage = 5;

  private selectedUser: User;
  /*private*/ userList: User[];
  private serverPath = AppConst.serverPath;	

  constructor(
  		private userService:UserService,
		private router:Router,
		private http:Http,
		private route:ActivatedRoute,
		private loginService:LoginService
  ) { }

  fetchUsers(){
	this.userService.getUserList().subscribe(
		res => {
			console.log(res.json());
			this.userList = res.json();
		},
		err => {
					console.log(err);
				} 
	);	
  }
  
  onSelect(user: User) {
	this.selectedUser = user;
	this.router.navigate(['/userDetail', this.selectedUser.id]);
	//this.router.navigate(['/userDetail', {id:this.selectedUser.id}]);
	
  }
  ngOnInit() {
	  
    this.loginService.checkSession().subscribe(
  		res => {
			this.loginService.sendLoginEvent(true);
			this.route.queryParams.subscribe(params => {
				if(params['userList']) {
					console.log("filtered user list");
					this.userList = JSON.parse(params['userList']);
				} else {
					this.userService.getUserList().subscribe(
						res => {							
							this.userList = res.json();
						},
						err => {
							console.log(err);
						} 
						);
				}
			});	 
  		},
  		error => {
			this.loginService.sendLoginEvent(false);
  			this.router.navigate(['/login']);
  		}
  	);	  
 
  }

}
