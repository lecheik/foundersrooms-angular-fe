import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'; 
import { User } from '../../models/user';
import { WebsocketServiceService } from '../../services/websocket-service.service';
import { UserService } from '../../services/user.service';
import { LoginService } from '../../services/login.service';
import { ProjectService } from '../../services/project.service';
import { UtilityService } from '../../services/utility.service';
import { SearchService } from '../../services/search.service';
import { Title } from '@angular/platform-browser';
import {Params, ActivatedRoute, Router} from '@angular/router';
import {Http} from '@angular/http';
import {AppConst} from '../../constants/app-const';
declare var jquery:any;
declare var $ :any;

import {Project} from '../../models/project';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {	
	
  private me:User;	
  createur:string="Créateur";
  private userSelectionList:User[]=new Array();
  private activeProjects:Project[]=new Array();
  private archiveProjects:Project[]=new Array();
  private serverPath = AppConst.serverPath;	
  /*private*/ dataFetched:boolean=false;profilesLoaded:boolean=false;

  constructor(
  		private userService:UserService,
		private router:Router,
		private http:Http,
		private route:ActivatedRoute,
		private loginService:LoginService,
		private projectService:ProjectService,
		private utilityService:UtilityService,
		private titleService:Title,private sanitizer: DomSanitizer,
		private webSocketService : WebsocketServiceService,
		private searchService : SearchService
  ) { }
  
  imageData: any;
   loadProfileImage(user:User){
	
    let imageUrl ;
	if(user.profileImageSet)
		imageUrl= this.serverPath+"/image/user/"+user.id+".jpg";
	else
		imageUrl= this.serverPath+"/image/user/user.svg";
	
			this.loginService.getProfileImage(imageUrl).subscribe(
				result=>{
					let blob = new Blob([result.json()], {
					  type: result.headers.get("Content-Type")
					});	
					console.log(blob);
					let urlCreator = window.URL;
					this.imageData =this.sanitizer.bypassSecurityTrustUrl(
						urlCreator.createObjectURL(blob));
						
				}
		
			);		
         	   
   }    
  
  openProjectDetails(item:Project){
	  this.router.navigate(['/project', item.id]);
  }
  
  deleteThatProject(item:Project,archive:boolean){
	  this.projectService.deleteProject(item.id).subscribe(
		res=>{
			if(!archive)
				this.activeProjects.splice(this.activeProjects.indexOf(item),1);			
			else
				this.archiveProjects.splice(this.archiveProjects.indexOf(item),1);
		},
		err=>{
			
		}
	  );
  }
  
  archiveThatProject(listItem:Project,databaseItem:Project){		
	let itemIndex=this.activeProjects.indexOf(listItem);
	this.activeProjects.splice(itemIndex,1);
	this.archiveProjects.unshift(databaseItem);
  }
  
  activeThatProject(listItem:Project,databaseItem:Project){	
	let itemIndex=this.archiveProjects.indexOf(listItem);
	this.archiveProjects.splice(itemIndex,1);
	this.activeProjects.unshift(databaseItem);	  
  }
  
  updateProjectState(item:Project,projectState:boolean){
	  this.projectService.updateProjectState(item.id,projectState).subscribe(
		res=>{									
			if(res.json()["archived"])
				this.archiveThatProject(item,res.json());
			else
				this.activeThatProject(item,res.json());
		},
		err=>{
			
		}	  
	  );
  }
  
  addNewProject(){
	  let projectName=$("#projectname").val().trim();
	  if(projectName.length>=4){		  
		  let project:Project=new Project();
		  project.name=$("#projectname").val();
		  project.name=project.name.trim();
		  //project.description=$("#summernote").val();
		  project.description="";
		  project.archived=false;
		  project.creator=this.me;
		  project.userMembers.push(this.me);
		  $("#projectname").val('');
		  $("#summernote").val('');
		  $("#exampleModalCenter").modal('toggle');	
		  
		  this.projectService.createProject(project).subscribe(
			res=>{			
				this.activeProjects.unshift(this.utilityService.getObjectFromBackendResult(res,false));
			},
			err=>{
				console.log(err);
			}
		  );		  		  
	  }
  }
  
  loadContactsSelection(){
	  this.searchService.getUserMatch().subscribe(
		res=>{
			let result=res.json();
			this.userSelectionList=result;		
			this.profilesLoaded=true;
			/*
			for(let item in result)
				this.projectService.getAvatar().subscribe(
					res=>{											
						result[item].town=res.json()["results"][0]["location"]["city"];
						result[item].email=res.json()["results"][0]["email"];
						result[item].phone=res.json()["results"][0]["phone"];
						result[item].avatar=res.json()["results"][0]["picture"]["large"];
						this.userSelectionList=result;												
					},
					err=>{
						
					}
				);		*/			
		},
		err=>{
			
		}
	  
	  );	  
  }
  
  insertAnActiveProject(project:Project){
	for(var item in this.activeProjects){
		if(this.activeProjects[item].id==project.id)
			return;
	}	 
	this.activeProjects.push(project);	
  }
  
  removeAnActiveProject(project:Project){
	let index:number;
	for(var item in this.activeProjects){
		if(this.activeProjects[item].id==project.id){
			index=this.activeProjects.indexOf(this.activeProjects[item]);
			this.activeProjects.splice(index,1);
		}
	}	 	
  }
  
  handleBackendEvent(input:any){
	let project:Project=input.project;
	if(this.me.id!=project.creator.id)
		switch(input.operation){
			case 'ADD':			
				this.insertAnActiveProject(project);				
			default :
				this.removeAnActiveProject(project);			
		}
  }
  
  loadData(){
	  this.userService.getCurrentUser().subscribe(
		res=>{			
			this.me=this.utilityService.getObjectFromBackendResult(res,false);		
			let stompClient = this.webSocketService.connect();
			stompClient.connect({}, frame => {
				// Subscribe to notification topic
				stompClient.subscribe('/topic/matching', result => {											
					this.loadContactsSelection();
				})
			});				
		},
		err=>{
			
		}
	  );
	  this.loadContactsSelection();
	  this.projectService.getMyProjectsList().subscribe(
		res=>{
			let result=this.utilityService.getObjectFromBackendResult(res,false);				
			this.activeProjects=result["active"];
			this.archiveProjects=result["archived"];	
			this.dataFetched=true;	
			let stompClient = this.webSocketService.connect();	
			stompClient.connect({}, frame => {
				// Subscribe to notification topic
				stompClient.subscribe('/topic/dashboard/'+this.me.username, res => {					
				this.handleBackendEvent(JSON.parse(res.body));
				})
			});				
		},
		err=>{
			
		}	  	  
	  );
  }
  
  ngOnInit() {
	this.titleService.setTitle("Dashboard");
    this.loginService.checkSession().subscribe(
  		res => {			
			this.loginService.sendLoginEvent(true);
			this.loadData();
			$( document ).ready(function() {	
			$('[data-toggle="tooltip"]').tooltip()	;
				$('#exampleModalCenter').on('shown.bs.modal', function () {					
					/*$('#summernote').summernote(
					{popover: {
					  air: [						
						['style', ['bold', 'italic', 'underline', 'clear']],
						['font', ['strikethrough', 'superscript', 'subscript']],
						['fontsize', ['fontsize']],
						['color', ['color']],
						['para', ['ul', 'ol', 'paragraph']]
					  ]
    
					}});*/
					/*
					$("#exampleModalCenter").draggable({
						handle: ".modal-header"
					});		*/	  
				});
				$('#exampleModalCenter').on('hidden.bs.modal', function () {						
					$('#summernote').summernote('destroy');
				});					
				$('#exampleModalCenter').on('shown.bs.modal', function () {
				  $('#projectname').trigger('focus');
				  
				});
								
			});

  		},
  		error => {
			this.loginService.sendLoginEvent(false);
  			this.router.navigate(['/login']);
  		}
  	);		  
  }

}
