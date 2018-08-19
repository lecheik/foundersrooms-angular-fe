import { User } from './user';
import { Step } from './step';

export class Task {
	public id:number;
	public taskName:string;
	public completed:boolean=false;
	public assignedTo:any;
	public projectStep:Step;
	public userReference:User;
}