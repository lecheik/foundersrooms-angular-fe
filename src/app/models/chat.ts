import { Message } from './message';
export class Chat {
	public id: string;
	public ownerUsername: string;
	public correspondantUsername: string;
	public correspondantId: number;
	public correspondantFirstName: string;
	public completeCorrespondantUsername: string;
	public messages: Message[]=new Array();
	public lastMessageExchanged: Message=new Message();
	public completeCorrespondantName: string="";
	public lastChatActivity: Date;
	public addMessage(msg:Message){
		this.messages.push(msg);
	}
}
