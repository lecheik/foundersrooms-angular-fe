export class User {
	public id: number;
	public firstName: string;
	public lastName: string;
	public firstNameAndLastName: string;
	public username: string;
	public password: string;
	public acontact: boolean=false;
	public email: string
	public phone: string;
	public enabled: boolean=true;
	public bio : string ;
	public codePostal : string ;
	public facebookID : string ;
	public googleID : string ;
	public tweeterId : string;
	public linkedInID : string ;
	public intro : string ;
	public country : string="France" ;
	public avatar : string;
	public town : string;
	public requesterId:number;
	public connectionNotificationReceived : boolean=false;
	public userType: string;
	public sector : string;
	public job:string;
	public serviceDetails:any[];
	public invitationItemsNumber:number;
	public me:boolean=false;
	public profileImageSet:boolean=false;
	public registeredByProvider:boolean=false;
	public completeName:string;
	public userTypeParameter:any[]=new Array();
	public sectorsToSearch:string[]=new Array();
	public online:boolean=false;
	public timeOut:number=10;
}
