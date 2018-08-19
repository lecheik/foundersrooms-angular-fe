import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'; 
import { User } from '../../models/user';
import { Network } from '../../models/network';
import { UserService } from '../../services/user.service';
import { LoginService } from '../../services/login.service';
import { UtilityService } from '../../services/utility.service';
import { UploadImageService } from '../../services/upload-image.service';
import { WebsocketServiceService } from '../../services/websocket-service.service';
import { Title } from '@angular/platform-browser';
import {Params, ActivatedRoute, Router} from '@angular/router';
import {Http} from '@angular/http';
import {AppConst} from '../../constants/app-const';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.css']
})
export class NetworkComponent implements OnInit {

  //private user: User = new User();
  private network: Network  =new Network();
  private serverPath = AppConst.serverPath;
  private userLoggedIn:User=new User();
  /*private*/ dataFetched:boolean=false;
  
  constructor(
  
  		private userService:UserService,
		private router:Router,
		private http:Http,
		private route:ActivatedRoute,
		private loginService:LoginService,
		private titleService:Title,
		private utilityService:UtilityService,
		private imageService:UploadImageService, 
		private sanitizer: DomSanitizer,
		private webSocketService : WebsocketServiceService
  ) { }

  onUserSelect(user:User){
  	this.router.navigate(['/userDetail', user.id]);
  }

  getCurrentUserNetwork() {
  	this.userService.getCurrentUserNetwork().subscribe(
  		res => {
        this.network=res.json();
        this.network.contactSize=this.network.contacts.length;
        this.network.invitationSize=this.network.usersInvited.length;
        this.network.requestSize=this.network.userRequests.length;
		this.dataFetched=true;
  		},
  		err => {
  			console.log(err);
  		}
  	);
  }
  onDeleteContact(user:User){
    //let index:number=this.network.contacts.indexOf(user);
    //this.network.contacts.splice(index,1);
    //this.network.contactSize--;
    this.userService.cancelConnectionRequest(user.id,this.userLoggedIn.id).subscribe(
      res=>{
        let index:number=this.network.contacts.indexOf(user);
        this.network.contacts.splice(index,1);
        this.network.contactSize--;
		//this.loginService.refreshUserDataNow();		
      },
      error=>{
        console.log(error);
      }
    );
  }

  onDeleteInvitation(user:User){
    this.userService.cancelConnectionRequest(user.id,this.userLoggedIn.id).subscribe(
      res=>{
        let index:number=this.network.userRequests.indexOf(user);
        this.network.userRequests.splice(index,1);
        this.network.requestSize--;
		this.loginService.refreshUserDataNow();
      },
      error=>{
        console.log(error);
      }
    );
  }

  onDeleteRequest(user:User){
	  console.log(user);
    this.userService.cancelConnectionRequest(user.id,this.userLoggedIn.id).subscribe(
      res=>{
        let index:number=this.network.usersInvited.indexOf(user);
        this.network.usersInvited.splice(index,1);
        this.network.invitationSize--;
      },
      error=>{
        console.log(error);
      }
    );
  }

  onAcceptInvitation(user:User){
    //let index:number=this.network.userRequests.indexOf(user);
    //this.network.contacts.push(this.network.userRequests.splice(index,1)[0]);
    //this.network.requestSize--;
    //this.network.contactSize++;	
    this.userService.acceptConnectionRequest(user.id,this.userLoggedIn.id).subscribe(
      res => {
        let index:number=this.network.userRequests.indexOf(user);
        this.network.contacts.push(this.network.userRequests.splice(index,1)[0]);
        this.network.requestSize--;
        this.network.contactSize++;
		this.userService.publishNotificationItemsNumber(this.network.requestSize);
        },
        error => {
          console.log(error);
        }
      );
  }

  getCurrentUser() {
  	this.userService.getCurrentUser().subscribe(
  		res => {
  			this.userLoggedIn = this.utilityService.getObjectFromBackendResult(res,false);
			this.userService.getCurrentUserNetwork().subscribe(
				result => {
				this.network=this.utilityService.getObjectFromBackendResult(result,false);
				this.network.contactSize=this.network.contacts.length;
				this.network.invitationSize=this.network.usersInvited.length;
				this.network.requestSize=this.network.userRequests.length;
				this.dataFetched=true;
				},
				err => {
					console.log(err);
				}
			);			
  		},
  		err => {
  			console.log(err);
  		}
  	);
  }
  

  backEndEventOnContactsArray(codeOrder:number,user:User){
	  
  }
  
  backEndEventOnInvitationArray(codeOrder:number,user:User){
	 switch(codeOrder){
		case 0:
			//code to removeAttribute
			break;
		case 1:
			this.network.userRequests.unshift(user);
			this.network.requestSize=this.network.requestSize+1;
			this.loginService.refreshUserDataNow();
			break;
		default:
			;

	 }	 
  }

  backEndEventOnRequestArray(codeOrder:number,user:User){
	  
  }  
  
  handleBackendEvent(msg:any){
	switch(msg.targetArray){
		case 1:
			this.backEndEventOnContactsArray(msg.codeOrder,msg.user);
			break;
		case 2:
			this.backEndEventOnInvitationArray(msg.codeOrder,msg.user);
			break;
		default:
			this.backEndEventOnRequestArray(msg.codeOrder,msg.user);			
	}	
  }
  
  loadData(){
  	this.userService.getCurrentUser().subscribe(
  		res => {
  			this.userLoggedIn = res.json();
			let stompClient = this.webSocketService.connect();
			stompClient.connect({}, frame => {

				// Subscribe to notification topic
				stompClient.subscribe('/topic/'+this.userLoggedIn.username, res => {

					// Update notifications attribute with the recent messsage sent from the server
					//this.handleBackendEvent(JSON.parse(res.body));					
					this.getCurrentUserNetwork();
					//this.loginService.refreshUserDataNow();
				})
			});			
  		},
  		err => {
  			console.log(err);
  		}
  	);	  
  }
  
  getProfileImage(user:User):any{
	this.imageService.loadProfileImage(user).subscribe(
				result=>{
					let blob = new Blob([result.json()], {
					  type: result.headers.get("Content-Type")
					});						
					let urlCreator = window.URL;
					return this.sanitizer.bypassSecurityTrustUrl(
						urlCreator.createObjectURL(blob));
						//this.dataFetched = true;
				}
		
			);
  }

  ngOnInit() {
	this.titleService.setTitle("Réseau");
    this.loginService.checkSession().subscribe(
  		res => {
			this.loginService.sendLoginEvent(true);
			


      /*
      this.loginService.getUserSubject().subscribe((value)=>{
        this.userLoggedIn=value["userLoggedIn"];
      });*/
      this.loadData();
			this.getCurrentUserNetwork();
  		},
  		error => {
			this.loginService.sendLoginEvent(false);
  			this.router.navigate(['/login']);
  		}
  	);
  }

}
