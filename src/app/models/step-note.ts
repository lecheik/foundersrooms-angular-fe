import { WfStep } from './wf-step';
export class StepNote {
	public id:number;
	public content:string="";
	public creationDate:Date;
	public lastModidicationDate:Date;
	public noteType;string;
	public worflowStepReference:WfStep;
}
