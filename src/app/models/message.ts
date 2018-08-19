export class Message {
	public id: string;
	public ownerUsername: string;
	public correspondantUsername:string;
	public getChatByUsername:string;
	public content: string;
	public sendTime: Date;
	public receivedDate: Date;
	public acknowledged: boolean;	
	
	//temporary data
	public correspondantFirstName: string;
	public completeCorrespondantName: string;
	public correspondantId: number;
	public lastChatActivity: Date;
	public correspondant:any;
}
