import { WfStep } from './wf-step';
import { User } from './user';

export class StepComment {
	public id:number;
	public content:string="";
	public creationDate:Date;
	public lastModidicationDate:Date;
	public worflowStepReference:WfStep;	
	public author:any;
	public userReference:User=new User();
}
