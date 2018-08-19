import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { NeedService } from '../../services/need.service';
import { LoginService } from '../../services/login.service';
import { UtilityService } from '../../services/utility.service';
import { Title } from '@angular/platform-browser';
import {Params, ActivatedRoute, Router} from '@angular/router';
import {Http} from '@angular/http';
import {AppConst} from '../../constants/app-const';
import {FormControl} from '@angular/forms';
import {NeedDetails} from '../../models/need-details';
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-need',
  templateUrl: './need.component.html',
  styleUrls: ['./need.component.css']
})
export class NeedComponent implements OnInit {

  userLoggedIn:User=new User();
  prestataire:string="Prestataire";
  createur:string="Créateur";
  investisseur:string="Investisseur";
  private coachingFormControl=new FormControl();
  private investmentFormControl=new FormControl();
  private operationsFormControl=new FormControl();
  private adviseFormControl=new FormControl();  
  
  private investmentServices:string[]=new Array();
  private operationalServices:string[]=new Array();
  private coachingServices:string[]=new Array();
  private adviseServices:string[]=new Array();
  
  private investmentChecked:string[]=new Array();
  private coachingChecked:string[]=new Array();
  private operationChecked:string[]=new Array();
  private adviseChecked:string[]=new Array();
  
  private investmentSelection:NeedDetails[]=new Array();
  private coachingSelection:NeedDetails[]=new Array();
  private operationalSelection:NeedDetails[]=new Array();
  private adviseSelection:NeedDetails[]=new Array();
  
  /*private*/ dataFetched:boolean=false;
	
  constructor(
		private router:Router,
		private http:Http,
		private route:ActivatedRoute,
		private loginService:LoginService,
		private needService:NeedService,
		private titleService:Title,
		private utilityService:UtilityService,
		private userService:UserService
  ) { }
  
  deleteAllServices(param:string){
	  this.needService.deleteServicesDetailsByServiceType(param).subscribe(
		res=>{
			switch(param){
				case "investment": {
					this.investmentChecked=[];
					this.investmentSelection=[];
					break;
					}
				case "coaching":{
					this.coachingChecked=[];
					this.coachingSelection=[];
					break;
				}	
				case "operations":{
					this.operationChecked=[];
					this.operationalSelection=[];
					break;
				}
				case "advise":{
					this.adviseChecked=[];
					this.adviseSelection=[];
					break;
				}
				default:console.log("nothing to do");
			}
		},
		err=>{
			
		}
	  
	  );
  }

  createNeedDetailsItem(serviceName:string,serviceType:string):NeedDetails{
	  let needDetails=new NeedDetails();
	  needDetails.service=serviceName;
	  needDetails.serviceType=serviceType;
	  needDetails.details="";
	  needDetails.value1=[1,24];
	  needDetails.value2=[10000,1000000];
	  needDetails.value3=7;
	  return needDetails;
  }
  
  removeItemFromSelection(selection:NeedDetails[],serviceName:string){
	  let index;
	  for(var i=0;i<selection.length;i++){
		  if(selection[i].service==serviceName){
			  selection.splice(i,1);
			  break;
		  }
	  }
  }
  
  clickOnInvestmentService(event,service){	  
	  let itemChecked=!$(event.target).hasClass("mat-pseudo-checkbox-checked");	  
	  if(itemChecked)
	  this.investmentSelection.push(this.createNeedDetailsItem(service,"investment"));
		else
			this.removeItemFromSelection(this.investmentSelection,service);
  }
  
  clickOnCoachingService(event,service){
	  let itemChecked=!$(event.target).hasClass("mat-pseudo-checkbox-checked");	  
	  if(itemChecked)
	  this.coachingSelection.push(this.createNeedDetailsItem(service,"coaching"));
		else
			this.removeItemFromSelection(this.coachingSelection,service);
  }
  
  clickOnOperationService(event,service){
	  let itemChecked=!$(event.target).hasClass("mat-pseudo-checkbox-checked");	  
	  if(itemChecked)
	  this.operationalSelection.push(this.createNeedDetailsItem(service,"operations"));
		else
			this.removeItemFromSelection(this.operationalSelection,service);
  }
  
  clickOnAdviseService(event,service){
	  let itemChecked=!$(event.target).hasClass("mat-pseudo-checkbox-checked");	  
	  if(itemChecked)
	  this.adviseSelection.push(this.createNeedDetailsItem(service,"advise"));
		else
			this.removeItemFromSelection(this.adviseSelection,service);
  }
  
  submitInvestmentServices(){	  
  console.log(this.investmentSelection);
	  this.needService.submitDetailsServices(this.investmentSelection).subscribe(
		res=>{
			let result=res.json();
			this.investmentSelection=result["needs"];
			this.investmentChecked=result["services"];
		},
		err=>{
			
		}
	  
	  );
  }
  
  submitCoachingServices(){
	  this.needService.submitDetailsServices(this.coachingSelection).subscribe(
		res=>{
			let result=res.json();
			this.coachingSelection=result["needs"];
			this.coachingChecked=result["services"];
		},
		err=>{
			
		}
	  
	  );
  }
  
  submitOperationalServices(){
	  this.needService.submitDetailsServices(this.operationalSelection).subscribe(
		res=>{
			let result=res.json();
			this.operationalSelection=result["needs"];
			this.operationChecked=result["services"];
		},
		err=>{
			
		}
	  
	  );	  
  }
  
  submitAdvismentServices(){
	  this.needService.submitDetailsServices(this.adviseSelection).subscribe(
		res=>{
			
			let result=res.json();
			console.log(result);
			this.adviseSelection=result["needs"];
			this.adviseChecked=result["services"];
		},
		err=>{
			
		}
	  
	  );	  
  }
  
  getCurrentUser() {
  	this.userService.getCurrentUser().subscribe(
  		res => {
  			this.userLoggedIn = this.utilityService.getObjectFromBackendResult(res,false);		
			this.dataFetched=true;			
  		},
  		err => {
  			console.log(err);
  		}
  	);
  }   
  
  loadUIModel(data:any){
	  this.investmentChecked=data[0]["services"];
	  this.coachingChecked=data[1]["services"];
	  this.operationChecked=data[2]["services"];
	  this.adviseChecked=data[3]["services"];
	  
	  this.investmentSelection=data[0]["needs"];
	  this.coachingSelection=data[1]["needs"];
	  this.operationalSelection=data[2]["needs"];
	  this.adviseSelection=data[3]["needs"];
	  this.getCurrentUser();
	  
  }
  
  ngOnInit() {
	this.titleService.setTitle("Besoins");
    this.loginService.checkSession().subscribe(
  		res => {
			$( document ).ready(function() {
				$('a[title]').tooltip();
			});
			this.loginService.sendLoginEvent(true);
			this.needService.loadServices().subscribe(
				res=>{
					let result=res.json();
					this.investmentServices=result[0];
					this.coachingServices=result[1];
					this.operationalServices=result[2];
					this.adviseServices=result[3];
				},
				error=>{
					
				}
			);
			this.needService.getUserviceDetails().subscribe(
				res=>{
					this.loadUIModel(res.json());
				},
				error=>{
					
				}
			);
  		},
  		error => {
			this.loginService.sendLoginEvent(false);
  			this.router.navigate(['/login']);
  		}
  	);	  
 
  }

}  