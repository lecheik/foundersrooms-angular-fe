import { Injectable } from '@angular/core';
import {AppConst} from '../constants/app-const';
import { Http,ResponseContentType , Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UploadImageService {

  private serverPath: string = AppConst.serverPath;
  filesToUpload: Array<File>;
  constructor(private http : Http) { 
	this.filesToUpload = [];
  }

  upload(userId: number) {
  	this.makeFileRequest(this.serverPath+"/user/add/avatar?id="+userId, [], this.filesToUpload).then((result) => {
  		console.log(result);
  	}, (error) => {
  		console.log(error);
  	});
  }

  getImageProfile(imageUrl:string):File{
    this.http.get(imageUrl, {
      responseType: ResponseContentType.Blob
    })
      .toPromise()
      .then((res: any) => {
        let blob = new Blob([res._body], {
          type: res.headers.get("Content-Type")
        });
		return new File([blob], "user_pp");
      });	  
	 return new File([""], "empty"); 
  }  
  
  makeFileRequest(url:string, params:Array<string>, files:Array<File>) {
  	return new Promise((resolve, reject) => {
  		var formData:any = new FormData();
  		var xhr = new XMLHttpRequest();
  		for(var i=0; i<files.length;i++) {
  			formData.append("uploads[]", files[i], files[i].name);
  		}
  		xhr.onreadystatechange = function() {
  			if(xhr.readyState == 4) {
  				if(xhr.status==200) {
  					console.log("image uploaded successfully!");
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
  
  getImage(imageUrl:string){
	
    return this.http.get(imageUrl, {
      responseType: ResponseContentType.Blob
    });
  }  
  
   loadProfileImage(user:any){
	
    let imageUrl ;
	if(user.profileImageSet)
		imageUrl= this.serverPath+"/imag/user/"+user.id;
	else
		imageUrl= this.serverPath+"/imag/user/default";
	
			return this.getImage(imageUrl);	
         	   
   }  
}
