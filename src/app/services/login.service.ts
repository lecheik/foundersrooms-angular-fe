import { Injectable } from '@angular/core';
import { Http,ResponseContentType , Headers } from '@angular/http';
import {AppConst} from '../constants/app-const';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import {User} from '../models/user';
/*
import { 
  AuthService, 
  FacebookLoginProvider, 
  GoogleLoginProvider,
  LinkedinLoginProvider
} from 'ng4-social-login';
import { SocialUser } from 'ng4-social-login';
*/
import { AuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider, LinkedInLoginProvider } from "angularx-social-login";
@Injectable()
export class LoginService {

  private serverPath: string = AppConst.serverPath;
  private subject = new Subject();
  private userLoggedInSubject=new Subject();
  private refreshUserData=new Subject();
  filesToUpload: Array<File>;

  constructor(
		private http : Http,
		private authService: AuthService) { 
			this.filesToUpload = [];	
	
		}


  getAuthService():AuthService{
	  return this.authService;
  }
  
  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }
 /*
  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }
 
  signInWithLinkedIN(): void {
    this.authService.signIn(LinkedinLoginProvider.PROVIDER_ID);
  }*/
 
  signOut(): void {
    this.authService.signOut();
  }
  
	blobToFile(theBlob: Blob, fileName:string): File{
		var b: any = theBlob;
		//A Blob() is almost a File() - it's just missing the two properties below which we will add
		b.lastModifiedDate = new Date();
		b.name = fileName;

		//Cast to a File() type
		return <File>theBlob;
	}  
  
  getProfileImage(imageUrl:string){
	
    return this.http.get(imageUrl, {
      responseType: ResponseContentType.Blob
    });
  }
  
  uploadImage(userId: number,file:File):any {
	this.filesToUpload=new Array();
	this.filesToUpload.push(file);
  	//return this.makeFileRequest(this.serverPath+"/user/add/avatar?id="+userId/*+"?"+ new Date().getTime()*/, [], this.filesToUpload);
	return this.makeFileRequest(this.serverPath+"/user/add/avatar/"+userId, [], this.filesToUpload);
	/*.then((result) => {
  		console.log(result);
		this.refreshUserDataNow();
  	}, (error) => {
  		console.log(error);
  	});*/
  }  
  
  makeFileRequest(url:string, params:Array<string>, files:Array<File>) {
  	return new Promise((resolve, reject) => {
  		var formData:any = new FormData();
  		var xhr = new XMLHttpRequest();
  		for(var i=0; i<files.length;i++) {
  			formData.append("uploads[]", files[i], files[i].name);
  		}
		
  		xhr.onreadystatechange = () =>  {
  			if(xhr.readyState == 4) {
  				if(xhr.status==200) {
  					console.log("image uploaded successfully!");
					this.refreshUserDataNow();
  				} else {
  					reject(xhr.response);
  				}
  			}
  		}

  		xhr.open("POST", url, true);
  		xhr.setRequestHeader("x-auth-token", localStorage.getItem("xAuthToken"));
  		xhr.send(formData);
  	});
  }   

  newSocialUser(firstName: string,lastName:string,username:string, email:string, userType:string) {
  	let url = this.serverPath+'/user/new_social';
  	let userInfo = {
		"firstName":firstName,
		"lastName":lastName,
  		"username" : username,
  		"email" : email,
		"userType":userType
  	}
  	let tokenHeader = new Headers({
  		'Content-Type' : 'application/json',
  		'x-auth-token' : localStorage.getItem('xAuthToken')
  	});

  	return this.http.post(url, JSON.stringify(userInfo), {headers : tokenHeader});
  }  
  
  newNonSocialUser(firstName: string,lastName:string, email:string,password:string, userType:string) {
  	let url = this.serverPath+'/user/new_non_social';
  	let userInfo = {
		"firstName":firstName,
		"lastName":lastName,
  		"username" : email,
  		"email" : email,
		"userType":userType,
		"password":password
  	}
  	let tokenHeader = new Headers({
  		'Content-Type' : 'application/json',
  		'x-auth-token' : localStorage.getItem('xAuthToken')
  	});

  	return this.http.post(url, JSON.stringify(userInfo), {headers : tokenHeader});
  }    
  
  sendCredential(username: string, password : string){
    //let url = "http://localhost:8181/token";
	let url = this.serverPath+'/token';
    let encodedCredentials = btoa(username+":"+password);
    let basicHeader = "Basic "+encodedCredentials;
    let headers = new Headers ({
      'Content-Type' : 'application/x-www-form-urlencoded',
      'Authorization' : basicHeader
    });

    return this.http.get(url, {headers: headers});
  }

  getUserDataRefresh(){
	  return this.refreshUserData;
  }
  
  refreshUserDataNow(){
	this.refreshUserData.next(true)  ;
  }
  
  getUserSubject(){
    return this.userLoggedInSubject;
  }

  getSubject(){
	  return this.subject;
  }

  sendLoginEvent(value : boolean){
	  //this.subject.next(value);
	  this.subject.next({"loggedIn":value});
  }

  shareUserLoggedIn(user:User){
    this.userLoggedInSubject.next({"userLoggedIn":user});
  }

  checkSession(){

    //let url = "http://localhost:8181/checkSession";
	let url = this.serverPath+'/checkSession';
    let headers = new Headers ({
      'x-auth-token' : localStorage.getItem('xAuthToken')
    });

    return this.http.get(url, {headers: headers});
  }

  logout() {
    //let url = "http://localhost:8181/user/logout";
	let url = this.serverPath+'/user/logout';
    let headers = new Headers ({
      'x-auth-token' : localStorage.getItem('xAuthToken')
    });

    return this.http.post(url, '', {headers: headers});
  }

}
