import { Component, OnInit } from '@angular/core';
import {
    Observable
} from 'rxjs/Rx';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'; 
import {LoginService} from '../../services/login.service';
import { UserService} from '../../services/user.service';
import { ChatService } from '../../services/chat.service';
import { WebsocketServiceService } from '../../services/websocket-service.service';
import { UploadImageService } from '../../services/upload-image.service';
import { User } from '../../models/user';
import {Router} from '@angular/router';

import {AppConst} from '../../constants/app-const';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {


  private loggedIn =false;
  prestataire:string="Prestataire";
  createur:string="Créateur";
  investisseur:string="Investisseur";  
  /*private*/ userLoggedIn:User=new User();
  private serverPath: string = AppConst.serverPath;
  /*private*/ dataFetched:boolean=false;
  unreadMessages:number=0;
  zero:number=0;
  imageData:any;
  constructor(
	private loginService: LoginService,
	private userService:UserService,
	private chatService:ChatService,
	private imageService:UploadImageService,
	private router:Router, 
	private sanitizer: DomSanitizer,
	private webSocketService : WebsocketServiceService) { }

  logout() {	
    this.loginService.logout().subscribe(
      res => {
        //location.reload();
		if(this.userLoggedIn.registeredByProvider)
			this.loginService.signOut();
		this.loginService.sendLoginEvent(false);
		this.loggedIn=false;
		this.router.navigate(['/login']);
      },
      error => {
		this.loggedIn=true;
        console.log(error);
      }
    );
  }
  
  openChat(){
	 this.router.navigate(['/chat']); 
  }
  
   loadProfileImage(){
	
    let imageUrl ;
	if(this.userLoggedIn.profileImageSet)
		imageUrl= this.serverPath+"/imag/user/"+this.userLoggedIn.id;
	else
		imageUrl= this.serverPath+"/imag/user/default";
	
			this.loginService.getProfileImage(imageUrl).subscribe(
				result=>{
					let blob = new Blob([result.json()], {
					  type: result.headers.get("Content-Type")
					});						
					let urlCreator = window.URL;
					this.imageData = this.sanitizer.bypassSecurityTrustUrl(
						urlCreator.createObjectURL(blob));
						this.dataFetched = true;
				}
		
			);		
         	   
   }  

  getUser(){
	this.userService.getCurrentUser().subscribe(
		res=>{
			this.userLoggedIn=res.json();
		},
		err=>{
			console.log(err);
		}
	 );
  }
  
  
  loadData(){
  	this.userService.getCurrentUser().subscribe(
  		res => {
			this.userLoggedIn=res.json();
			this.chatService.getChatSubject().subscribe((value)=>{
				this.unreadMessages=Number(value["unreadMessages"]);
			});		
			this.chatService.getUnReadMessagesNumber().subscribe(
				response=>{					
					this.unreadMessages=Number(response.json());
				}
			);
			this.loginService.getSubject().subscribe((value)=>{
				this.loggedIn=value["loggedIn"];
			});		
			this.userService.getNotificationSubject().subscribe((value)=>{				
				this.userLoggedIn.invitationItemsNumber=value["notificationItemsNumber"];
			});		
			this.userService.getNotifItemsSubject().subscribe((value)=>{				
				this.userLoggedIn.invitationItemsNumber=this.userLoggedIn.invitationItemsNumber+value["inc"];
			});		
			this.loginService.getUserDataRefresh().subscribe(
				res=>{
					this.getUser();
					this.loadProfileImage();
				}
			);
			this.loadProfileImage();
			let stompClient = this.webSocketService.connect();
			stompClient.connect({}, frame => {
				stompClient.subscribe('/topic/chat/'+this.userLoggedIn.username, result => {
					console.log(this.router.url);
					if(this.router.url!="/chat"){
						this.unreadMessages=this.unreadMessages+1;
					}
				});				

				// Subscribe to notification topic
				stompClient.subscribe('/topic/'+this.userLoggedIn.username, res => {

					// Update notifications attribute with the recent messsage sent from the server
					//this.handleBackendEvent(JSON.parse(res.body));					
					this.getUser();
				});
							
			});				
  		},
  		err => {
  			console.log(err);
  		}
  	);	
  }
  
  ngOnInit() {	  
	  /*
	  this.loginService.getSubject().subscribe((value)=>{
		  this.loggedIn=value["loggedIn"];
	  });
	  this.userService.getNotificationSubject().subscribe((value)=>{
		  this.userLoggedIn.invitationItemsNumber=value["notificationItemsNumber"];
	  });*/
    /*this.loginService.getUserSubject().subscribe((value)=>{
		  this.userLoggedIn=value["userLoggedIn"]; 			
	  });*/	  
    this.loginService.checkSession().subscribe(
      res => {
        this.loggedIn=true;
		this.loadData();
		
		Observable.interval(10000).subscribe(x => {
			//if(this.loggedIn)
				this.chatService.sendKeepAlive(this.loggedIn).subscribe(
					res=>{					
					}
				);
        });
      },
      error => {
        this.loggedIn=false;
      }
    );
	
  }

}
