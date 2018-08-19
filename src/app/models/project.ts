import { User } from './user';
import { Step } from './step';
import { WfStep } from './wf-step';
import { StepGroup } from './step-group';

export class Project {
	public id:number;
	public name:string;
	public description:string;
	public archived:boolean;
	public videoPitch:string;	
	public ratio:number=0;
	public creator:User;
	public userMembers:User[]=new Array();
	public members:any[]=new Array();
	public projectSteps:Step[]=new Array();
	public projectWF:StepGroup[]=new Array();
	public projectWfSteps:WfStep[]=new Array();
	public numberOfAssignedTasks:number;
	public numberOfCompletedTask:number;
	public teamSizeSearchInf:number=0;
	public teamSizeSearchSup:number=0;
	public stepSearchInf:number;
	public stepSearchSup:number;		
}