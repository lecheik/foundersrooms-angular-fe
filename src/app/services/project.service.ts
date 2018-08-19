import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import {AppConst} from '../constants/app-const';
import {
    Observable
} from 'rxjs/Rx';
@Injectable()
export class ProjectService {
  private serverPath: string = AppConst.serverPath;  

  constructor(private http:Http) { }
  
  
  getMyProjectsList(){
    let url = AppConst.serverPath+"/project/";

    let tokenHeader = new Headers({
      'Content-Type' : 'application/json',
      'x-auth-token' : localStorage.getItem("xAuthToken")
    });
    return this.http.get(url, {headers: tokenHeader});	  
  }  
  
  getProjectById(projectId:number){
    let url = AppConst.serverPath+"/project/get_project/"+projectId;

    let tokenHeader = new Headers({
      'Content-Type' : 'application/json',
      'x-auth-token' : localStorage.getItem("xAuthToken")
    });
    return this.http.get(url, {headers: tokenHeader});	  
  }

  
  getAvatar(){
    let url = "https://randomuser.me/api/";

    let tokenHeader = new Headers({
      'Content-Type' : 'application/json'
    });
    return this.http.get(url/*, {headers: tokenHeader}*/);	  
  }  
  
  createProject(project:any){
    let url = this.serverPath+'/project/create_project';
  	let tokenHeader = new Headers({
  		'Content-Type' : 'application/json',
  		'x-auth-token' : localStorage.getItem('xAuthToken')
  	});

  	return this.http.post(url, JSON.stringify(project), {headers : tokenHeader});	  
  }  
  
  deleteProject(projectId:number){
    let url = this.serverPath+'/project/delete_project/'+projectId;
  	let tokenHeader = new Headers({
  		'Content-Type' : 'application/json',
  		'x-auth-token' : localStorage.getItem('xAuthToken')
  	});

  	return this.http.delete(url, {headers : tokenHeader});	  
  }
  
  updateProjectState(projectId:number,archived:boolean){
    let url = this.serverPath+'/project/update_project_state/'+projectId;
  	let tokenHeader = new Headers({
  		'Content-Type' : 'application/json',
  		'x-auth-token' : localStorage.getItem('xAuthToken')
  	});

  	return this.http.post(url, JSON.stringify(archived), {headers : tokenHeader});	  	  
	  
  }
  
  saveProject(project:any){
    let url = this.serverPath+'/project/save_updated_project';
  	let tokenHeader = new Headers({
  		'Content-Type' : 'application/json',
  		'x-auth-token' : localStorage.getItem('xAuthToken')
  	});

  	return this.http.post(url, JSON.stringify(project), {headers : tokenHeader});	 	  
  }
  
  updateProjectDetails(projectItem:any,projectId:number){
    let url = this.serverPath+'/project/update_project_details/'+projectId;
  	let tokenHeader = new Headers({
  		'Content-Type' : 'application/json',
  		'x-auth-token' : localStorage.getItem('xAuthToken')
  	});

  	return this.http.post(url, JSON.stringify(projectItem), {headers : tokenHeader});		  
  }
  
  getProjectSteps(){
    let url = this.serverPath+'/json/project_steps.json';

    let tokenHeader = new Headers({
      'Content-Type' : 'application/json'
    });
    return this.http.get(url, {headers: tokenHeader});	  
  }   
  
  getProjectWorkflow(){
    //let url = this.serverPath+'/json/step_static_content.json';
	let url = 'assets/json/step_static_content.json';

    let tokenHeader = new Headers({
      'Content-Type' : 'application/json'
    });
    return this.http.get(url, {headers: tokenHeader});	  
  }    
  
  addMemberToTheProject(projectId:number,userId:number){
    let url = this.serverPath+'/project/add_member_to_project/'+projectId;
  	let tokenHeader = new Headers({
  		'Content-Type' : 'application/json',
  		'x-auth-token' : localStorage.getItem('xAuthToken')
  	});

  	return this.http.post(url, JSON.stringify(userId), {headers : tokenHeader});		  
  }
  
  createProjectStep(projectId:number,step:any){
    let url = this.serverPath+'/project/step/create/'+projectId;
  	let tokenHeader = new Headers({
  		'Content-Type' : 'application/json',
  		'x-auth-token' : localStorage.getItem('xAuthToken')
  	});

  	return this.http.post(url, JSON.stringify(step), {headers : tokenHeader});	  
  }
  
  createStepTask(projectId:number,task:any){
    let url = this.serverPath+'/project/step/create_task/'+projectId;
  	let tokenHeader = new Headers({
  		'Content-Type' : 'application/json',
  		'x-auth-token' : localStorage.getItem('xAuthToken')
  	});

  	return this.http.post(url, JSON.stringify(task), {headers : tokenHeader});	  
  }
  
  updateStepTaskState(projectId:number,task:any){

    let url = this.serverPath+'/project/step/update_task/'+projectId;
  	let tokenHeader = new Headers({
  		'Content-Type' : 'application/json',
  		'x-auth-token' : localStorage.getItem('xAuthToken')
  	});

  	return this.http.post(url, JSON.stringify(task), {headers : tokenHeader});	  
  }
  
  assignTaskToProjectMember(memberId:number,taskId:number){
    let url = this.serverPath+'/project/step/assign_task/'+taskId;
  	let tokenHeader = new Headers({
  		'Content-Type' : 'application/json',
  		'x-auth-token' : localStorage.getItem('xAuthToken')
  	});

  	return this.http.post(url, JSON.stringify(memberId), {headers : tokenHeader});	  
  }  

  
  deleteProjectTask(taskId:number){
    let url = this.serverPath+'/project/step/delete_task/'+taskId;
  	let tokenHeader = new Headers({
  		'Content-Type' : 'application/json',
  		'x-auth-token' : localStorage.getItem('xAuthToken')
  	});

  	return this.http.delete(url,{headers : tokenHeader});	  
  }    
  
  removeProjectMember(projectMemberId:number){
    let url = this.serverPath+'/project_member/remove/'+projectMemberId;
  	let tokenHeader = new Headers({
  		'Content-Type' : 'application/json',
  		'x-auth-token' : localStorage.getItem('xAuthToken')
  	});

  	return this.http.delete(url,{headers : tokenHeader});	  
  }     
  
  //project step notes managenent
  
  createWorflowStepNote(projectId:number,stepNum:number, note:any){
    let url = this.serverPath+'/project/create_note/'+projectId+'/'+stepNum;
  	let tokenHeader = new Headers({
  		'Content-Type' : 'application/json',
  		'x-auth-token' : localStorage.getItem('xAuthToken')
  	});

  	return this.http.post(url, JSON.stringify(note), {headers : tokenHeader});	  
  }  
  
  deleteProjectStepNote(noteId:number){
    let url = this.serverPath+'/project/remove_note/'+noteId;
  	let tokenHeader = new Headers({
  		'Content-Type' : 'application/json',
  		'x-auth-token' : localStorage.getItem('xAuthToken')
  	});

  	return this.http.delete(url,{headers : tokenHeader});		  
  }
  
  updateProjectStepNote(note:any,noteId:number){
    let url = this.serverPath+'/project/update_note/'+noteId;
  	let tokenHeader = new Headers({
  		'Content-Type' : 'application/json',
  		'x-auth-token' : localStorage.getItem('xAuthToken')
  	});

  	return this.http.post(url, JSON.stringify(note), {headers : tokenHeader});		  
  }
  
  //project step comments management
  
  createWorflowStepComment(projectId:number,stepNum:number, comment:any){
    let url = this.serverPath+'/project/create_comment/'+projectId+'/'+stepNum;
  	let tokenHeader = new Headers({
  		'Content-Type' : 'application/json',
  		'x-auth-token' : localStorage.getItem('xAuthToken')
  	});

  	return this.http.post(url, JSON.stringify(comment), {headers : tokenHeader});	  
  }    
  
  //project step attachment managenent
  createWorkflowStepAttachment(projectId:number,stepNum:number, attachment:any, file:File): Observable<any> {
	  
  	return Observable.create(observer => {
		var formData:any = new FormData();
		formData.append("file", file);
		formData.append("ad",JSON.stringify(attachment));
		
  		var xhr = new XMLHttpRequest();
	/*
  		xhr.onreadystatechange = () =>  {
  			if(xhr.readyState == 4) {
  				if(xhr.status==200) {
  					console.log("image uploaded successfully!");
  				} else {
  					reject(xhr.response);
  				}
  			}
  		}*/
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    observer.next(JSON.parse(xhr.response));
                    observer.complete();
                } else {
                observer.error(xhr.response);
                }
            }
        };		

  		xhr.open("POST", this.serverPath+'/project/create_attachment/'+projectId+'/'+stepNum, true);
  		xhr.setRequestHeader("x-auth-token", localStorage.getItem("xAuthToken"));
  		xhr.send(formData);
  	});
  }

  deleteProjectStepAttachment(attachmentId:number){
    let url = this.serverPath+'/project/delete_attachement/'+attachmentId;
  	let tokenHeader = new Headers({
  		'Content-Type' : 'application/json',
  		'x-auth-token' : localStorage.getItem('xAuthToken')
  	});

  	return this.http.delete(url,{headers : tokenHeader});		  
  }  
  
  addProjectMembers(projectId:number,idArray:number[]){
    let url = this.serverPath+'/project/add_project_members/'+projectId;
  	let tokenHeader = new Headers({
  		'Content-Type' : 'application/json',
  		'x-auth-token' : localStorage.getItem('xAuthToken')
  	});
	let param={
		membersId:idArray
	}
  	return this.http.post(url, JSON.stringify(param), {headers : tokenHeader});	  
  }    
  
  initializeProjectStepDeliverableItemProgress(projectId:number,stepNum:number, deliverable:any){
    let url = this.serverPath+'/project/initiate_step_deliverable_progress/'+projectId+"/"+stepNum;
  	let tokenHeader = new Headers({
  		'Content-Type' : 'application/json',
  		'x-auth-token' : localStorage.getItem('xAuthToken')
  	});		
	let temp=deliverable.worflowStepReference;
	temp.deliverablesModelStatus=undefined;
	let param:any={
		'label':deliverable.label,
		'progress':deliverable.progress,
		'worflowStepReference':temp
	}
  	return this.http.post(url, JSON.stringify(deliverable), {headers : tokenHeader});	  
  }
  
  updateProjectStepDeliverableItemProgress(projectId:number,stepNum:number, deliverable:any){
    let url = this.serverPath+'/project/update_step_deliverable_progress/'+projectId+"/"+stepNum;
  	let tokenHeader = new Headers({
  		'Content-Type' : 'application/json',
  		'x-auth-token' : localStorage.getItem('xAuthToken')
  	});
  	return this.http.post(url, JSON.stringify(deliverable), {headers : tokenHeader});	  
  }  
}
