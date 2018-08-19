import { WfStep } from './wf-step';
import { User } from './user';

export class StepAttachment {
	public id:number;
	public attachmentName:string;
	public attachmentSize:number;
	public attachmentFileType:string;
	public uploadDate:Date;
	public worflowStepReference:WfStep;	
	public author:any;
	public userReference:User=new User();
	public s3Prefix:string;
	//public file:File;
}
