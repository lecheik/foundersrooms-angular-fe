import { Injectable } from '@angular/core';

import {Http, Headers} from '@angular/http';
import {AppConst} from '../constants/app-const';
import {User} from '../models/user';

import {NeedDetails} from '../models/need-details';

@Injectable()
export class NeedService {

  private serverPath: string = AppConst.serverPath;
  
  constructor(private http:Http) { }


  loadServices(){
	//let url = AppConst.serverPath+"/needs/";
  let url = AppConst.serverPath+"/json/services.json";

  	let tokenHeader = new Headers({
  		'Content-Type' : 'application/json',
  		'x-auth-token' : localStorage.getItem("xAuthToken")
  	});
  	return this.http.get(url, {headers: tokenHeader});
  }

  submitDetailsServices(items:NeedDetails[]){
    let url = this.serverPath+'/user/persist_services';
  	let tokenHeader = new Headers({
  		'Content-Type' : 'application/json',
  		'x-auth-token' : localStorage.getItem('xAuthToken')
  	});

  	return this.http.post(url, JSON.stringify(items), {headers : tokenHeader});
  }
  
  getUserviceDetails(){
    let url = AppConst.serverPath+"/user/load_user_services_details";

    let tokenHeader = new Headers({
      'Content-Type' : 'application/json',
      'x-auth-token' : localStorage.getItem("xAuthToken")
    });
    return this.http.get(url, {headers: tokenHeader});	  
  }
  
  
  getServicesDetailsForAParticularUser(userId:number){
    let url = AppConst.serverPath+"/needs/"+userId;

    let tokenHeader = new Headers({
      'Content-Type' : 'application/json',
      'x-auth-token' : localStorage.getItem("xAuthToken")
    });
    return this.http.get(url, {headers: tokenHeader});	 	  
  }  
  
  deleteServicesDetailsByServiceType(serviceType:string){
    let url = AppConst.serverPath+"/user/delete_service_details/"+serviceType;

    let tokenHeader = new Headers({
      'Content-Type' : 'application/json',
      'x-auth-token' : localStorage.getItem("xAuthToken")
    });
    return this.http.delete(url, /*JSON.stringify(serviceType),*/ {headers : tokenHeader});		  
  }
  
}
