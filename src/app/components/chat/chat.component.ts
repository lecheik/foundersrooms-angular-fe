import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
    Observable
} from 'rxjs/Rx';
import {AppConst} from '../../constants/app-const';
import { User } from '../../models/user';
import { Chat } from '../../models/chat';
import { Message } from '../../models/message';
import { WebsocketServiceService } from '../../services/websocket-service.service';
import { LoginService } from '../../services/login.service';
import { UserService } from '../../services/user.service';
import { SearchService } from '../../services/search.service';
import { ChatService } from '../../services/chat.service';
import { UtilityService } from '../../services/utility.service';
import {Params, ActivatedRoute, Router} from '@angular/router';
import * as moment from 'moment';
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  contacts:any[]=new Array();
  chats:Chat[]=new Array();
  activeChat:Chat=null;
  currentChatMessages:Message[]=new Array();
  private serverPath = AppConst.serverPath;
  dataFetched:boolean=false;
  userSelected:boolean=false;
  activeContact:User=null;
  userLoggedIn:User= new User();
  searchContact:boolean=false;
  message:string="";
  searchContactContent:string="";
  
  constructor(
	private titleService:Title,
	private loginService:LoginService,
	private userService:UserService,
	private utilityService:UtilityService,
	private searchService:SearchService,
	private chatService:ChatService,
	private webSocketService : WebsocketServiceService,
	private router:Router
  ) { }

    getCurrentUser() {
        this.userService.getCurrentUser().subscribe(
            res => {
                this.userLoggedIn = this.utilityService.getObjectFromBackendResult(res, false);
				let stompClient = this.webSocketService.connect();	
				stompClient.connect({}, frame => {
					stompClient.subscribe('/topic/chat/'+this.userLoggedIn.username, result => {
						let domId:number;
						let message:Message=JSON.parse(result.body);
						this.chatService.ackMessage(message.ownerUsername,message.id).subscribe(
							result=>{
								console.log("Ack send for messageId "+message.id);
							}
						);									
						if(this.isChatListAvailable()){
							let chat:Chat=this.addMessageToAChat(message,message.ownerUsername);
							chat.correspondantUsername=message.ownerUsername;
							chat.correspondantId=message.correspondantId;
							chat.correspondantFirstName=message.correspondantFirstName;
							chat.completeCorrespondantName=message.completeCorrespondantName;
							chat.lastChatActivity=message.lastChatActivity;							
							this.moveChatOnTop(this.getChatByUsername(message.ownerUsername));
							domId=chat.correspondantId;
							
						}else{
							let chat:Chat=this.createNewChat(message);
							chat.correspondantUsername=message.ownerUsername;
							chat.correspondantId=message.correspondantId;
							chat.correspondantFirstName=message.correspondantFirstName;
							chat.completeCorrespondantName=message.completeCorrespondantName;
							chat.lastChatActivity=message.lastChatActivity;							
							this.chats.push(chat);		
							this.activeChat=chat;
							this.activeContact=message.correspondant;
							domId=chat.correspondantId;
						}
						this.scrollDownChatArea();	
						this.userSelected=true;	
						//$('#'+domId).effect("highlight", {}, 3000);
					});
				stompClient.subscribe('/topic/keep_alive/'+this.userLoggedIn.username, res => {
					let payLoad:any=JSON.parse(res.body);
					let contactUsername=payLoad.username;
					//let contactUsername=res.body;
					let aContact:User=this.contacts.find(item=>item.username==contactUsername);
					if(this.activeContact!=null)
						if(this.activeContact.username==contactUsername){
							//this.activeContact.online=true;
							this.activeContact.online=payLoad.status;
							this.activeContact.timeOut=10;
						}
					if(aContact!=undefined && aContact!=null){
						//aContact.online=true;
						aContact.online=payLoad.status;
						aContact.timeOut=10;
					}
				});		
				stompClient.subscribe('/topic/user_status/'+this.userLoggedIn.username, res => {				
					let parseResult:any=JSON.parse(res.body);
					let aContact:User=this.contacts.find(item=>item.username==parseResult.username);
					if(aContact!=null && aContact!=undefined)
						aContact.online=parseResult.online;
					if(this.activeContact!=null){
						if(aContact!=null && aContact!=undefined)
							if(this.activeContact.username==aContact.username)
								this.activeContact.online=false;
					}
				});
				}				
				);	
            },
            err => {
                console.log(err);
            }
        );
    }
	
  setDefaultChat(chat:Chat,correspondant:any){
	this.activeChat=chat;  
	this.activeContact=correspondant;
	this.userSelected=true;	
  }
	
  createNewChat(message:Message):Chat{
	let newChat:Chat=new Chat();
	newChat.messages.push(message);
	newChat.ownerUsername=this.userLoggedIn.username;
	newChat.lastMessageExchanged=message;
	return newChat;
  }    
  
  isChatAlreadyCreated(correspondantUsername:string):boolean{
	let leChat:Chat=this.getChatByUsername(correspondantUsername);
	if(leChat==null || leChat==undefined)
		return false;
	return true;
  }

  addMessageToAChat(message:Message,correspondantUsername:string):Chat{
	let leChat:Chat=this.getChatByUsername(correspondantUsername);	
	if(leChat==null || leChat==undefined){
		/*
		let newChat:Chat=new Chat();
		newChat.messages.push(message);
		newChat.lastMessageExchanged=message;*/
		leChat=this.createNewChat(message);
		this.chats.push(leChat);
	}else{	
		leChat.messages.push(message);
		leChat.lastMessageExchanged=message;	
	}
	return leChat;
  }  
	
  getMessageContentSubstring(content:string){
	if(content.trim().length<=15)
		return content;
	return content.substring(0,12)+"...";
  }  
	
  scrollDownChatArea(){
	let chatArea=$("#chat-area")[0];
	chatArea.scrollTop = chatArea.scrollHeight+60;
  }  
  
  isChatListAvailable():boolean{
	if(this.chats.length<=0)	
		return false;
	return true;
  }
    
  send(){
	  if(this.message.trim().length>0){
		  let message:Message=new Message();
		  message.ownerUsername=this.userLoggedIn.username;
		  message.correspondantId=this.activeContact.id;
		  message.content=this.message.trim();
		  this.activeChat.messages.push(message);
		  //this.currentChatMessages.push(message);
		  //this.activeChat.messages=this.currentChatMessages;
		  this.message="";
		  this.scrollDownChatArea();
		  this.chatService.sendMessage(this.activeContact.username,message.content).subscribe(
			res=>{
				//let message:Message=res.json();				
				//this.activeChat.messages.push(message);
				message=res.json();				
				this.activeChat.lastMessageExchanged=message;
				if(this.isChatListAvailable()){						
					let chat:Chat;
					if(this.isChatAlreadyCreated(this.activeContact.username)){
						chat=this.getChatByUsername(this.activeContact.username);
						chat=this.activeChat;
					}
					else
						this.chats.push(this.activeChat);							
					this.activeChat.correspondantUsername=message.correspondantUsername;
					this.activeChat.correspondantId=message.correspondantId;
					this.activeChat.correspondantFirstName=message.correspondantFirstName;
					this.activeChat.completeCorrespondantName=message.completeCorrespondantName;
					this.activeChat.lastChatActivity=message.lastChatActivity;					
					this.moveChatOnTop(this.activeChat);					
				}
				else{					
					this.activeChat.correspondantUsername=message.correspondantUsername;
					this.activeChat.correspondantId=message.correspondantId;
					this.activeChat.correspondantFirstName=message.correspondantFirstName;
					this.activeChat.completeCorrespondantName=message.completeCorrespondantName;
					this.activeChat.lastChatActivity=message.lastChatActivity;							
					this.chats.push(this.activeChat);
				}		
				//this.loadChatContent(this.activeChat);
			}
		  );		
	  }
  }
  
  inputTextChanged(text){
	  if(text.trim().length>0){
		this.searchContact=true;
		this.searchService.getUsersWhoseCompleteNameStartsWhith(text).subscribe(
			res=>{
				this.contacts=this.utilityService.getObjectFromBackendResult(res, false);
			}		
		);
	  }
		else
			this.searchContact=false;
  }
  
  getChatByUsername(username:string):Chat{
	  let chat:Chat=this.chats.find(item=>item.correspondantUsername==username);
	  //temporary assignment
	  //chat.messages=null;	  
	  return chat;
  }
  
  moveChatOnTop(chat:Chat){	  
	  this.chats.splice(this.chats.indexOf(chat),1);
	  this.chats.unshift(chat);
  }
  
  loadContactChat(contact:any){
	  this.chatService.loadChatContent(contact.username).subscribe(
		res=>{
			let tmp:any=this.utilityService.getObjectFromBackendResult(res,true);
			//this.currentChatMessages=tmp.messages;
			this.activeContact=tmp.correspondant;
			this.userSelected=true;			
			this.getUnReadMessagesNumber();
			this.searchContact=false;
			this.searchContactContent="";
			this.activeChat=this.getChatByUsername(contact.username);				
			if(this.activeChat!=null && this.activeChat!=undefined){
				this.chats.splice(this.chats.indexOf(this.activeChat),1);
				this.chats.unshift(this.activeChat);				
				this.activeChat.messages=tmp.messages;
				this.scrollDownChatArea();
			}else{
				this.activeChat=new Chat();
				this.activeChat.ownerUsername=this.userLoggedIn.username;
				this.activeChat.correspondantUsername=contact.username;
				this.activeChat.completeCorrespondantName=this.userLoggedIn.completeName;
			}
		}
	  );
  }
  
  loadChatContent(chat:any){
	  this.chatService.loadChatContent(chat.correspondantUsername).subscribe(
		res=>{
			let tmp:any=this.utilityService.getObjectFromBackendResult(res,true);
			chat.messages=null;
			//this.currentChatMessages=tmp.messages;
			this.activeChat=chat;			
			//this.activeChat.messages=tmp.messages;
			this.currentChatMessages=tmp.messages;
			this.activeChat.messages=this.currentChatMessages;
			this.activeContact=tmp.correspondant;
			this.userSelected=true;
			this.scrollDownChatArea();
			this.getUnReadMessagesNumber();
			this.chats.splice(this.chats.indexOf(chat),1);
			this.chats.unshift(chat);			
		}
	  );	  
  }  
  
  getUnReadMessagesNumber(){
	this.chatService.getUnReadMessagesNumber().subscribe(
		res=>{
			this.chatService.publishUnreachMessagesNumber(res.json());
		}
	)	
  }
  
  decrementContactsTimeOut(){
	  for(var item in this.contacts){
		  this.contacts[item].timeOut=this.contacts[item].timeOut-1;
		  if(this.contacts[item].timeOut==0) this.contacts[item].online=false;
	  }
	  if(this.activeContact!=null){
		this.activeContact.timeOut=this.activeContact.timeOut-1;
		if(this.activeContact.timeOut==0) this.activeContact.online=false;
	  }
  }
  
  loadData(){
	 moment.locale('fr');
	 this.getCurrentUser();
	 this.chatService.loadUserChats().subscribe(
		result=>{			
			this.chats=this.utilityService.getObjectFromBackendResult(result,true);
			if(this.chats.length==1){
				/*
				this.userService.getUser(this.chats[0].correspondantId).subscribe(
					res=>{
						//this.setDefaultChat(this.chats[0],res.json());
						this.loadChatContent(this.chats[0]);
						this.getUnReadMessagesNumber();
					}					
				);				*/
				this.loadChatContent(this.chats[0]);
				this.getUnReadMessagesNumber();				
			}
		}
	 );	 
	 /*
	 this.userService.getMyContacts().subscribe(
		res=> {
			this.contacts=this.utilityService.getObjectFromBackendResult(res,true);
			this.dataFetched=true;
					
		}
	 );*/
	  Observable.interval(5000).subscribe(x => {
		this.decrementContactsTimeOut();
      });	 
	 this.dataFetched=true;
  }
  
  ngOnInit() {
	this.titleService.setTitle("FoundersRooms Chat");
    this.loginService.checkSession().subscribe(
  		res => {			
			this.loginService.sendLoginEvent(true);
			this.loadData();
			$( document ).ready(function() {	
				$( document ).on('DOMNodeInserted', function(e){		
				/*
					let classList:any=e.target.classList;		
					if(classList!=undefined){	
						let lastChild:any=e.target.lastElementChild;
						if(lastChild!=null){
							let className=String(lastChild.className);
							if(className=="chat-message"){
								let chatArea=$("#chat-area")[0];
								chatArea.scrollTop = chatArea.scrollHeight+1000;
							}
							
						}
						
					}*/
				})
								
			});

  		},
  		error => {
			this.loginService.sendLoginEvent(false);
  			this.router.navigate(['/login']);
  		}
  	);		  
  }

  
}
