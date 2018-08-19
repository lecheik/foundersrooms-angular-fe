import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import {AppConst} from '../constants/app-const';

@Injectable()
export class SearchService {
  private serverPath: string = AppConst.serverPath;

  constructor(private http:Http) { }
  
  getUsers(user:any){
    let url = this.serverPath+"/search/users";
    let tokenHeader = new Headers({
      'Content-Type' : 'application/json',
      'x-auth-token' : localStorage.getItem("xAuthToken")
    });
	return this.http.post(url, JSON.stringify(user), {headers : tokenHeader});     
  }  
  
  getUsersWhoseCompleteNameStartsWhith(payLoad:any){
    let url = this.serverPath+"/search/users/name_like";
    let tokenHeader = new Headers({
      'Content-Type' : 'application/json',
      'x-auth-token' : localStorage.getItem("xAuthToken")
    });
	return this.http.post(url, JSON.stringify(payLoad), {headers : tokenHeader});     
  }   
  
  getUserMatch(){
    let url = this.serverPath+"/search/matching";
    let tokenHeader = new Headers({
      'Content-Type' : 'application/json',
      'x-auth-token' : localStorage.getItem("xAuthToken")
    });
	return this.http.get(url, {headers: tokenHeader});		
  }  
  
  getProjects(project:any){
    let url = this.serverPath+"/search/projects";
    let tokenHeader = new Headers({
      'Content-Type' : 'application/json',
      'x-auth-token' : localStorage.getItem("xAuthToken")
    });
	return this.http.post(url, JSON.stringify(project), {headers : tokenHeader});     
  }  
   
  
}
