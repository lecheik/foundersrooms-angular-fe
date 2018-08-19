import { WfStep } from './wf-step';
export class StepGroup {
	public groupName:string;
	public steps:WfStep[]=new Array();
	public groupRatio:number=0;
}
