import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import { User } from '../../models/user';
import { Step } from '../../models/step';
import { Project } from '../../models/project';
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

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor(
		private router:Router,
		private http:Http,
		private route:ActivatedRoute,
		private loginService:LoginService,
		private projectService:ProjectService,
		private utilityService:UtilityService,
		private titleService:Title,
		private userService:UserService,
		private searchService:SearchService
  ) { }
  
  userTypeOptions:any={
	 creator:false,
	 provider:false,
	 investor:false
  }  
  
  teamSizeChoices:any={
	  oneToFive:true,
	  fiveToTen:false,
	  tenToTwenty:false
  }
  activityFormControl=new FormControl();
  actvitiesChecked:string[]=new Array();
  serverPath: string = AppConst.serverPath;
  private defaultProjectSteps=new Array();
  activitiesList:string[]=new Array();
  /*private*/ citiesList:string[][]=new Array();
  private activitySector:string="None";
  /*private*/ searchLocation:string="";
  stateCtrl: FormControl=new FormControl();;
  private currentUser:User=new User();
  /*private*/ progressTab:number[]=[1,10];
  /*private*/ progressMarginInf:string;
  slideInfValue:number;
  /*private*/ progressMarginSup:string;
  slideSupValue:number;
  searchInput:string="";
  dataFetched:boolean=false;
  usersFound:User[]=new Array();
  projectsFound:Project[]=new Array();
  
  onProgressStatusChange(item){	 
	this.slideInfValue=item[0];
	this.slideSupValue=item[1];
	try{
	  this.progressMarginInf=this.defaultProjectSteps[item[0]-1]["stepName"];
	  this.progressMarginSup=this.defaultProjectSteps[item[1]-1]["stepName"];
	}catch(e){
		console.log("still updating slider data");
	}	
  }
  
  radioChange(event){
	let radioName=event.target.name;
	let radioId=event.target.id;
	switch(radioName){
		case "oneToFive":
			this.teamSizeChoices.oneToFive=!this.teamSizeChoices.oneToFive;	
			this.teamSizeChoices.fiveToTen=false;
			this.teamSizeChoices.tenToTwenty=false;
			break;
		case "fiveToTen":
			this.teamSizeChoices.fiveToTen=!this.teamSizeChoices.fiveToTen;
			this.teamSizeChoices.oneToFive=false;
			this.teamSizeChoices.tenToTwenty=false;			
			break;
		default:
			this.teamSizeChoices.oneToFive=false;
			this.teamSizeChoices.fiveToTen=false;				
			this.teamSizeChoices.tenToTwenty=!this.teamSizeChoices.tenToTwenty;
		
	}
	
  }
  
  inputCityChanged(item){
	if(item.trim().length>2)	  
      this.utilityService.getCitiesWithCityNameContaining(item.trim()).subscribe(
        res => {
          this.citiesList=res.json();
        },
        err => {
          console.log(err);
        }
		);
  }
  
  getActivitiesAndLocationListItems(){
    this.utilityService.getActivitySectors().subscribe(
  		res => {
		this.activitiesList=res.json();	
		this.activitiesList.unshift("None");
		this.getCurrentUser();
  		},
  		err => {
  			console.log(err);
  		}
  	);  
	

  }
  
  commonPropertiesSetter(user:User){
	if(this.searchInput.trim().length!=0)
		user.completeName=this.searchInput;
	else user.completeName="";	
	if(this.activitySector!="None")
		user.sector=this.activitySector;
	else
		user.sector="";
	if(this.searchLocation.trim().length!=0)
		user.town=this.searchLocation;
	else user.town="";	
	user.sectorsToSearch=this.actvitiesChecked;	
  }
  
  getTeamSizeSearch():number[]{
	if(this.teamSizeChoices.oneToFive)
		return [1,5];
	if(this.teamSizeChoices.fiveToTen)
		return [5,10];
	if(this.teamSizeChoices.tenToTwenty)
		return [10,20];
	return [0,100000];
  }

  
  seachProjects(){
	let project:Project=new Project();
	project.creator=new User();
	this.commonPropertiesSetter(project.creator); 
	project.name=project.creator.completeName;
	let teamSize:number[]=this.getTeamSizeSearch();
	if(teamSize.length){
		project.teamSizeSearchInf=teamSize[0];
		project.teamSizeSearchSup=teamSize[1];
	}
	project.stepSearchInf=this.slideInfValue-1;
	project.stepSearchSup=this.slideSupValue-1;
	
	this.searchService.getProjects(project).subscribe(
		res=>{			
			this.projectsFound=this.utilityService.getObjectFromBackendResult(res,true);
		},
		err=>{
			
		}
	);
	
	  
  }
  
  seachUserProfiles(){
	let user:User=new User();	
	if(this.userTypeOptions.creator)
		user.userTypeParameter.push('createur');
	if(this.userTypeOptions.provider)
		user.userTypeParameter.push('prestataire');
	if(this.userTypeOptions.investor)
		user.userTypeParameter.push('investisseur');

	this.commonPropertiesSetter(user);


	this.searchService.getUsers(user).subscribe(
		res=>{
			this.usersFound=this.utilityService.getObjectFromBackendResult(res,true);			
		},
		err=>{
			
		}	
	);
  }
  
  getCurrentUser() {
  	this.userService.getCurrentUser().subscribe(
  		res => {
  			this.currentUser = this.utilityService.getObjectFromBackendResult(res,false);
			let index=this.activitiesList.indexOf(this.currentUser.sector);
			//this.activitySector=this.activitiesList[index];
			this.utilityService.getCitiesWithCityNameContaining(this.currentUser.town).subscribe(
				result=>{
					this.citiesList=result.json();
					//this.searchLocation=this.currentUser.town;
					this.dataFetched=true;
				},
				err=>{
					
				}
			
			);
			
  		},
  		err => {
  			console.log(err);
  		}
  	);
  }  
  
  loadData(){
	  this.getActivitiesAndLocationListItems();
	  this.projectService.getProjectSteps().subscribe(
		res=>{		
			this.defaultProjectSteps=res.json();	
			this.progressMarginInf=this.defaultProjectSteps[0]["stepName"];
			this.progressMarginSup=this.defaultProjectSteps[9]["stepName"];
		},
		err=>{
			
		}
	  );	  
  }

  ngOnInit() {	  

	this.titleService.setTitle("Recherche");
    this.loginService.checkSession().subscribe(
  		res => {			
			this.loginService.sendLoginEvent(true);
			this.loadData();
			$( document ).ready(function() {											
			});

  		},
  		error => {
			this.loginService.sendLoginEvent(false);
  			this.router.navigate(['/login']);
  		}
  	);	  
  }

}
