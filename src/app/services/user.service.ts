import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import {AppConst} from '../constants/app-const';
import {User} from '../models/user';

import { Subject } from 'rxjs/Subject';

@Injectable()
export class UserService {
  private serverPath: string = AppConst.serverPath;
  private loggedUserId:number;
  
  private notificationSubject = new Subject();
  private notifItemsSubject = new Subject();
  
  constructor(private http:Http) { }


  newUser(username: string, email:string) {
  	let url = this.serverPath+'/user/newUser';
  	let userInfo = {
  		"username" : username,
  		"email" : email
  	}
  	let tokenHeader = new Headers({
  		'Content-Type' : 'application/json',
  		'x-auth-token' : localStorage.getItem('xAuthToken')
  	});

  	return this.http.post(url, JSON.stringify(userInfo), {headers : tokenHeader});
  }
  
  getNotifItemsSubject(){
	  return this.notifItemsSubject;
  }
  
  getNotificationSubject(){
	return this.notificationSubject;
  }
  
  incrementNotifItemSubject(value:number){
	  this.notifItemsSubject.next({"inc":value});
  }
  
  publishNotificationItemsNumber(value:number){	  	  
	  this.notificationSubject.next({"notificationItemsNumber":value});
  }

  updateUserInfo(user: User, newPassword: string, currentPassword: string) {
    let url = this.serverPath + "/user/updateUserInfo";
    let userInfo = {
      "id" : user.id,
      "firstName" : user.firstName,
      "lastName" : user.lastName,
      "username" : user.username,
      "currentPassword" : currentPassword,
      "email" : user.email,
      "newPassword" :newPassword,
  	  "facebookID":user.facebookID,
  	  "phone":user.phone,
  	  "bio":user.bio,
  	  "codePostal":user.codePostal,
  	  "googleID":user.googleID,
  	  "linkedInID":user.linkedInID,
  	  "intro":user.intro,
  	  "country":user.country,
  	  "avatar":user.avatar,
  	  "town":user.town,
      "sector":user.sector,
      "job":user.job
    };
    let tokenHeader = new Headers({
      'Content-Type' : 'application/json',
      'x-auth-token' : localStorage.getItem("xAuthToken")
    });
    return this.http.post(url, JSON.stringify(userInfo), {headers:tokenHeader});
  }

  retrievePassword(email:string) {
  	let url = this.serverPath+'/user/forgetPassword';
  	let userInfo = {
  		"email" : email
  	}
  	let tokenHeader = new Headers({
  		'Content-Type' : 'application/json',
  		'x-auth-token' : localStorage.getItem('xAuthToken')
  	});

  	return this.http.post(url, JSON.stringify(userInfo), {headers : tokenHeader});
  }

  getCurrentUser() {
    let url = this.serverPath+'/user/getCurrentUser';

    let tokenHeader = new Headers({
      'Content-Type' : 'application/json',
      'x-auth-token' : localStorage.getItem('xAuthToken')
    });

    return this.http.get(url, {headers : tokenHeader});
  }
  
  getCurrentUserProfile() {
    let url = this.serverPath+'/user/current_user';

    let tokenHeader = new Headers({
      'Content-Type' : 'application/json',
      'x-auth-token' : localStorage.getItem('xAuthToken')
    });

    return this.http.get(url, {headers : tokenHeader});
  }  

  getCurrentUserNetwork() {
    let url = this.serverPath+'/user/network';

    let tokenHeader = new Headers({
      'Content-Type' : 'application/json',
      'x-auth-token' : localStorage.getItem('xAuthToken')
    });

    return this.http.get(url, {headers : tokenHeader});
  }

  getUserList() {
  	let url = AppConst.serverPath+"/user/userList";

  	let tokenHeader = new Headers({
  		'Content-Type' : 'application/json',
  		'x-auth-token' : localStorage.getItem("xAuthToken")
  	});
  	return this.http.get(url, {headers: tokenHeader});
  }
  
  getUsersNotYetConnectedTo() {
  	let url = AppConst.serverPath+"/user/not_yet_connected_to";

  	let tokenHeader = new Headers({
  		'Content-Type' : 'application/json',
  		'x-auth-token' : localStorage.getItem("xAuthToken")
  	});
  	return this.http.get(url, {headers: tokenHeader});
  }  
  
  getMyContacts() {
  	let url = AppConst.serverPath+"/user/my_contacts";

  	let tokenHeader = new Headers({
  		'Content-Type' : 'application/json',
  		'x-auth-token' : localStorage.getItem("xAuthToken")
  	});
  	return this.http.get(url, {headers: tokenHeader});
  }
  
  /*
  getMyContacts() {
  	let url = AppConst.serverPath+"/user/contacts";

  	let tokenHeader = new Headers({
  		'Content-Type' : 'application/json',
  		'x-auth-token' : localStorage.getItem("xAuthToken")
  	});
  	return this.http.get(url, {headers: tokenHeader});
  }  
  */
  
  getMyContactsWithMatchCriteria(token:string) {
  	let url = AppConst.serverPath+"/user/my_contacts/"+token;

  	let tokenHeader = new Headers({
  		'Content-Type' : 'application/json',
  		'x-auth-token' : localStorage.getItem("xAuthToken")
  	});
  	return this.http.get(url, {headers: tokenHeader});
  } 
  
  getUser(id:number) {
  	let url = AppConst.serverPath+"/user/profile/"+id;

  	let tokenHeader = new Headers({
  		'Content-Type' : 'application/json',
  		'x-auth-token' : localStorage.getItem("xAuthToken")
  	});
  	return this.http.get(url, {headers: tokenHeader});
  }

  sendConnectionRequest(id:number, idRequester:number) {
  	let url = AppConst.serverPath+"/notification/send/"+id;
  	let tokenHeader = new Headers({
  		'Content-Type' : 'application/json',
  		'x-auth-token' : localStorage.getItem("xAuthToken")
  	});

	let userInfo = {
      "id" : idRequester
    };

	return this.http.post(url,JSON.stringify(userInfo), {headers:tokenHeader});
  }

   cancelConnectionRequest(id:number, idRequester:number) {
  	let url = AppConst.serverPath+"/notification/cancel_relationship/"+id;
  	let tokenHeader = new Headers({
  		'Content-Type' : 'application/json',
  		'x-auth-token' : localStorage.getItem("xAuthToken")
  	});

	let userInfo = {
      "id" : idRequester
    };

	return this.http.post(url,JSON.stringify(userInfo), {headers:tokenHeader});
  }

  acceptConnectionRequest(id:number, idRequester:number){
  	let url = AppConst.serverPath+"/notification/accept/"+id;
  	let tokenHeader = new Headers({
  		'Content-Type' : 'application/json',
  		'x-auth-token' : localStorage.getItem("xAuthToken")
  	});

	let userInfo = {
      "id" : idRequester
    };
	return this.http.post(url,JSON.stringify(userInfo), {headers:tokenHeader});
  }

  getUserNotificationItemsNumber(){
  	let url = AppConst.serverPath+"/notification/invitations_items_number";

  	let tokenHeader = new Headers({
  		'Content-Type' : 'application/json',
  		'x-auth-token' : localStorage.getItem("xAuthToken")
  	});
  	return this.http.get(url, {headers: tokenHeader});	  
  }
  
  checkBasicRequirements(){
  	let url = AppConst.serverPath+"/user/is_basic_requirement_provided";

  	let tokenHeader = new Headers({
  		'Content-Type' : 'application/json',
  		'x-auth-token' : localStorage.getItem("xAuthToken")
  	});
  	return this.http.get(url, {headers: tokenHeader});	  
  }
  

/*
  searchUser(keyword:string) {
  	let url = AppConst.serverPath+"/user/searchUser";

  	let tokenHeader = new Headers({
  		'Content-Type' : 'application/json',
  		'x-auth-token' : localStorage.getItem("xAuthToken")
  	});
  	return this.http.post(url, keyword, {headers: tokenHeader});
  }  */

}
