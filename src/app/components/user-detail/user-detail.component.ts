import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'; 
import "rxjs/Rx";
import { Subject } from "rxjs/Subject";
import { User } from '../../models/user';
import { Need } from '../../models/need';
import { UserService } from '../../services/user.service';
import { NeedService } from '../../services/need.service';
import { Title } from '@angular/platform-browser';
import { UtilityService } from '../../services/utility.service';
import { WebsocketServiceService } from '../../services/websocket-service.service';
import {Params, ActivatedRoute, Router} from '@angular/router';
import {Http} from '@angular/http';
import {AppConst} from '../../constants/app-const';

import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

  private userId: number;
  private user: User = new User();
  private serverPath = AppConst.serverPath;  
  private buttonLabel: string="";
  
  private need:Need;

  private addUserSuccess: boolean = false;
  private investmentArray:any[];
  private coachingArray:any[];
  private operationsArray:any[];
  private adviseArray:any[];
  
  /*private*/ dataFetched:boolean=false;
  
  constructor(
		private userService:UserService,		
		private router:Router,
		private http:Http,
		private route:ActivatedRoute,
		private loginService:LoginService,
		private needService:NeedService,
		private utilitiy:UtilityService,
		private titleService:Title,
		private sanitizer: DomSanitizer,
		private webSocketService : WebsocketServiceService
  ) { }
  imageData: any;
   loadProfileImage(){
	
    let imageUrl ;
	//if(this.user.profileImageSet)
		imageUrl= this.serverPath+"/imag/user/"+this.user.id;
	//else
		//imageUrl= this.serverPath+"/imag/user/default";
	
			this.loginService.getProfileImage(imageUrl).subscribe(
				result=>{
					let blob = new Blob([result.json()], {
					  type: result.headers.get("Content-Type")
					});	
					console.log(blob);
					let urlCreator = window.URL;
					this.imageData =this.sanitizer.bypassSecurityTrustUrl(
						urlCreator.createObjectURL(blob));
						
				}
		
			);		
         	   
   }  
  
  onRequest() {
	  if(this.user.acontact){ 
		this.userService.cancelConnectionRequest(this.userId,this.user.requesterId).subscribe(
			res=>{
				this.buttonLabel="Add";
				this.user.acontact=false;
				//this.userService.incrementNotifItemSubject(1);
			},
			error=>{
				console.log(error);
			}
		);
	  }else{
		if(!this.user.connectionNotificationReceived)
		  this.userService.sendConnectionRequest(this.userId,this.user.requesterId).subscribe(
			res => {				
				this.buttonLabel="Remove";	
				this.user.acontact=true;				
					
				},
				error => {
					console.log(error);
				}
			);		  
		  else
			this.userService.acceptConnectionRequest(this.userId,this.user.requesterId).subscribe(
				res => {				
					this.buttonLabel="Remove";	
					this.user.acontact=true;				
					this.userService.incrementNotifItemSubject(-1);	
					},
					error => {
						console.log(error);
					}
				);				
			
	  }
	} 
  
  checkButtonLabel(){
	  if(!this.user.acontact)
		  if(!this.user.connectionNotificationReceived)			  
			this.buttonLabel="Add";
		else
			this.buttonLabel="Accept";
	  else
		  this.buttonLabel="Remove";
		  
  }
  
  getUser(userId:number){
	 this.userService.getUser(userId).subscribe(
		res=>{
			this.user=res.json();
			this.checkButtonLabel();
		},
		err=>{
			console.log(err);
		}
	 
	 );	  
  }

  ngOnInit() {		
    this.loginService.checkSession().subscribe(
  		res => {

			//get request parameters
			this.loginService.sendLoginEvent(true);
			this.route.params.forEach((params: Params) => {
				this.userId = Number.parseInt(params['id']);
				
			});
			
			//load user profile
			this.userService.getUser(this.userId).subscribe(
				res => {
					this.user=res.json();	
					this.titleService.setTitle(this.user.firstName+" "+this.user.lastName);
					let stompClient = this.webSocketService.connect();
					stompClient.connect({}, frame => {

						// Subscribe to notification topic
						stompClient.subscribe('/topic/'+this.user.username, res => {

							// Update notifications attribute with the recent messsage sent from the server
							//this.handleBackendEvent(JSON.parse(res.body));					
							this.getUser(this.user.id);
							//this.loginService.refreshUserDataNow();
						})
					});						
					this.loadProfileImage();
					this.needService.getServicesDetailsForAParticularUser(this.user.id).subscribe(
						result=>{							
							this.user.serviceDetails=this.utilitiy.getObjectFromBackendResult(result,true);
							this.investmentArray=this.user.serviceDetails[0]["needs"];							
							this.coachingArray=this.user.serviceDetails[1]["needs"];
							this.operationsArray=this.user.serviceDetails[2]["needs"];
							this.adviseArray=this.user.serviceDetails[3]["needs"];
							this.checkButtonLabel();
							this.dataFetched=true;														
						},
						err=>{
							
						}					
					);									
											
				},
				error => {
					console.log(error);
				}
			);													
  		},
  		error => {
			this.loginService.sendLoginEvent(false);
  			this.router.navigate(['/login']);
  		}
  	);  
  		 
  }

}
