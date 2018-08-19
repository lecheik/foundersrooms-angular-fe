import { Task } from './task';

export class Step {
	public id:number;
	public stepName:string;
	public stepNum:number;
	public description:string;
	public completed:boolean=false;
	public stepTasks:Task[]=new Array();
	public assignedTaskNumber:number;
	public completedTaskNumber:number;
	public taskRatio:number;
}
