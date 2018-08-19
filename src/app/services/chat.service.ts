import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import {AppConst} from '../constants/app-const';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ChatService {
  private serverPath: string = AppConst.serverPath;
  private chatSubject = new Subject();
  
  constructor(private http:Http) { }
  
  publishUnreachMessagesNumber(value:number){
	 this.chatSubject.next({"unreadMessages":value});
  }
  
  getChatSubject(){
	 return this.chatSubject;
  }
  
  loadUserChats(){
    let url = this.serverPath+"/chat/load_whole_exchanges";
    let tokenHeader = new Headers({
      'Content-Type' : 'application/json',
      'x-auth-token' : localStorage.getItem("xAuthToken")
    });
	return this.http.get(url, {headers: tokenHeader});	  
  }
  
  loadChatContent(correspondantUsername:string){
    let url = this.serverPath+"/chat/load_chat_messages";
    let tokenHeader = new Headers({
      'Content-Type' : 'application/json',
      'x-auth-token' : localStorage.getItem("xAuthToken")
    });
	return this.http.post(url, JSON.stringify(correspondantUsername), {headers : tokenHeader}); 		  
  }
  
  sendKeepAlive(online:boolean){
    let url = this.serverPath+"/chat/keep_alive/"+online;
    let tokenHeader = new Headers({
      'Content-Type' : 'application/json',
      'x-auth-token' : localStorage.getItem("xAuthToken")
    });
	return this.http.get(url, {headers: tokenHeader});		  
  }
  
  getUnReadMessagesNumber(){
    let url = this.serverPath+"/chat/unread_number";
    let tokenHeader = new Headers({
      'Content-Type' : 'application/json',
      'x-auth-token' : localStorage.getItem("xAuthToken")
    });
	return this.http.get(url, {headers: tokenHeader});
  }
  
  sendMessage(destinatorUsername:string,message:string){
    let url = this.serverPath+"/chat/send_message";
    let tokenHeader = new Headers({
      'Content-Type' : 'application/json',
      'x-auth-token' : localStorage.getItem("xAuthToken")
    });
	let param:any={
		"correspondantUsername":destinatorUsername,
		"messageContent":message
	}
	return this.http.post(url, JSON.stringify(param), {headers : tokenHeader}); 	  
  }
  
  ackMessage(destinatorUsername:string,messageId:any){
    let url = this.serverPath+"/chat/message_ack";
    let tokenHeader = new Headers({
      'Content-Type' : 'application/json',
      'x-auth-token' : localStorage.getItem("xAuthToken")
    });
	let param:any={
		"correspondantUsername":destinatorUsername,
		"messageId":messageId
	}
	return this.http.post(url, JSON.stringify(param), {headers : tokenHeader}); 	  
  }

}
