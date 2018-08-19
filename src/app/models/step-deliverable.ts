import { WfStep } from './wf-step';

export class StepDeliverable {
	public id:number;
	public deliverableNum:number;
	public label:string;
	public progress:number=0;
	public completed:boolean;
	public worflowStepReference:WfStep;		
}
