import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import {AppConst} from '../constants/app-const';

@Injectable()
export class UtilityService {
  private serverPath: string = AppConst.serverPath;

  constructor(private http:Http) { }
/*
  getCountryList() {
  	let url = AppConst.serverPath+"/utility/get_countries";

  	let tokenHeader = new Headers({
  		'Content-Type' : 'application/json',
  		'x-auth-token' : localStorage.getItem("xAuthToken")
  	});
  	return this.http.get(url, {headers: tokenHeader});
  }
*/

  getObjectFromBackendResult(res:any,isArray:boolean):any{
	  if(isArray)
		return res.arrayBuffer().byteLength > 0 ? res.json() : [];
	  return res.arrayBuffer().byteLength > 0 ? res.json() : {};
  
  }
  getCountryList() {
  	let url = AppConst.serverPath+"/utility/get_all_cities_name";

  	let tokenHeader = new Headers({
  		'Content-Type' : 'application/json',
  		'x-auth-token' : localStorage.getItem("xAuthToken")
  	});
  	return this.http.get(url, {headers: tokenHeader});
  }



  getActivitySectors() {
    let url = AppConst.serverPath+"/json/sectors.json";

    let tokenHeader = new Headers({
      'Content-Type' : 'application/json',
      'x-auth-token' : localStorage.getItem("xAuthToken")
    });
    return this.http.get(url, {headers: tokenHeader});
  }

  getJobs() {
    let url = AppConst.serverPath+"/json/jobs.json";

    let tokenHeader = new Headers({
      'Content-Type' : 'application/json',
      'x-auth-token' : localStorage.getItem("xAuthToken")
    });
    return this.http.get(url, {headers: tokenHeader});
  }

  getAllCities() {
    let url = AppConst.serverPath+"/utility/get_all_cities";

    let tokenHeader = new Headers({
      'Content-Type' : 'application/json',
      'x-auth-token' : localStorage.getItem("xAuthToken")
    });
    return this.http.get(url, {headers: tokenHeader});
  }

  getCitiesWithCityNameContaining(value:string) {
    let url = AppConst.serverPath+"/utility/get_city_name_containing/"+value;

    let tokenHeader = new Headers({
      'Content-Type' : 'application/json',
      'x-auth-token' : localStorage.getItem("xAuthToken")
    });
    return this.http.get(url, {headers: tokenHeader});
  }

  isCityNameExists(value:string) {
    let url = AppConst.serverPath+"/utility/is_city_name_exists/"+value;

    let tokenHeader = new Headers({
      'Content-Type' : 'application/json',
      'x-auth-token' : localStorage.getItem("xAuthToken")
    });
    return this.http.get(url, {headers: tokenHeader});
  }

  getCityInfos(value:string) {
    let url = AppConst.serverPath+"/utility/get_city_infos/"+value;

    let tokenHeader = new Headers({
      'Content-Type' : 'application/json',
      'x-auth-token' : localStorage.getItem("xAuthToken")
    });
    return this.http.get(url, {headers: tokenHeader});
  }



}
