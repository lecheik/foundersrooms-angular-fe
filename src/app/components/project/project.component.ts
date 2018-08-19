import {
    Component,
    OnInit
} from '@angular/core';
import {
    Observable
} from 'rxjs/Rx';
import {
    NgForm
} from '@angular/forms';
import {
    Pipe,
    PipeTransform
} from '@angular/core';
import {
    DomSanitizer
} from '@angular/platform-browser';
import {
    User
} from '../../models/user';
import {
    Step
} from '../../models/step';
import { StepDeliverable } from '../../models/step-deliverable';
import {
    WfStep
} from '../../models/wf-step';
import {
    Url
} from '../../models/url';
import {
    StepGroup
} from '../../models/step-group';
import {
    StepNote
} from '../../models/step-note';
import {
    StepComment
} from '../../models/step-comment';
import {
    StepAttachment
} from '../../models/step-attachment';
import {
    Task
} from '../../models/task';
import { WebsocketServiceService } from '../../services/websocket-service.service';
import {
    UserService
} from '../../services/user.service';
import {
    LoginService
} from '../../services/login.service';
import {
    ProjectService
} from '../../services/project.service';
import {
    UtilityService
} from '../../services/utility.service';
import {
    Title
} from '@angular/platform-browser';
import {
    Params,
    ActivatedRoute,
    Router
} from '@angular/router';
import {
    Http
} from '@angular/http';
import {
    AppConst
} from '../../constants/app-const';
import {FormControl} from '@angular/forms';
declare var jquery: any;
declare var $: any;
import * as moment from 'moment';


import {
    Project
} from '../../models/project';

@Component({
    selector: 'app-project',
    templateUrl: './project.component.html',
    styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

    userLoggedIn: User = new User();
    serverPath: string = AppConst.serverPath;
    /*private*/
    currentProject: Project = new Project();
    private stepsWithTasksInside: Step[] = new Array();
    /*private*/
    currentSelectedStep: Step = new Step();
    /*private*/
    currentSelectedTask: Task = new Task();
    /*private*/
    currentSelectedUser: User = new User();
    /*private*/
    myContacts: User[] = new Array();
    private projectMembers: any[] = new Array();
    /*private*/
    dataFetched: boolean = false;
    /*private*/
    url = "";
	projectDescription:string="";
    private isBadUrl: boolean = false;
    private isBadDescriptionContent: boolean = false;
    stepValidate: boolean = false;taskValidate: boolean = false;
    projectWorflow: StepGroup[] = new Array();
    currentSelectedWFStep: WfStep = new WfStep();
    myNote: StepNote = new StepNote();
    myComment: StepComment = new StepComment();
    noteContent: string = "";
    workflowShown = false;imageShown=false;
	noteListShown=false;noteInputShown=false;remarkListShown=false;remarkInputShown=false;
	selectedContacts:User[]=new Array();
	dropdownSettings = {};
	tempArray:any[];
    cpt: number = 0; // used to control the maphightlight refreshment
    mapConfig = {
        "fade": true,
        "alwaysOn": false,
        "neverOn": false,
        "fill": true,
        "fillColor": "#e89441",
        "fillOpacity": 0.4,
        "stroke": true,
        "strokeColor": "#e89441",
        "strokeOpacity": 1,
        "strokeWidth": 1,
        "shadow": true,
        "shadowColor": "#000000",
        "shadowOpacity": 0.8,
        "shadowRadius": 10
    };


    constructor(
        private userService: UserService,
        private router: Router,
        private http: Http,
        private route: ActivatedRoute,
        private loginService: LoginService,
        private projectService: ProjectService,
        private utilityService: UtilityService,
        private titleService: Title,
		private webSocketService : WebsocketServiceService
    ) {}
	
	
	
	getUserById(id:number):User{
		for(var item in this.myContacts){
			if(this.myContacts[item].id==id)
				return this.myContacts[item];
		}
	}	
	
	getIndexByUserId(id:number):number{
		for(var item in this.selectedContacts){
			if(this.selectedContacts[item].id==id)
				return this.selectedContacts.indexOf(this.selectedContacts[item]);
		}		
	}
	openTeamModal(){
		this.selectedContacts=[];
		this.tempArray=[];		
		this.initProjectTeamModel();
	}
	componentShown(){
		console.log("component shown");
	}
    onItemSelect(item:any){  
		this.selectedContacts.push(this.getUserById(item.id));
		/*this.tempArray.push({
			'id':4,
			'firstNameAndLastName':'Jerry Lockwood'
		});	*/	
    }
	onItemDeSelect(item:any){
		let index=this.getIndexByUserId(item.id);
		this.selectedContacts.splice(index,1);
	}
    onSelectAll(items: any){
        for(var item in items){
			this.selectedContacts.push(this.getUserById(items[item].id));			
		}		
    }	
	onDeSelectAll(items: any){
		this.selectedContacts=[];
	}
	
	getAttachmentTooltip(attachment:StepAttachment){
		let date=moment(attachment.uploadDate);
		return attachment.userReference.firstName+" "+ attachment.userReference.lastName+","+date.fromNow();
	}
	
	getAttachmentUrl(attachment:StepAttachment):string{
		let rootUrl:string="https://s3.us-east-2.amazonaws.com/foundersrooms.images";		
		return rootUrl+"/"+attachment.s3Prefix
	}

    getYoutubeVideoId(videUrl) {
        var video_id = videUrl.split('v=')[1];
        var ampersandPosition = video_id.indexOf('&');
        if (ampersandPosition != -1) {
            video_id = video_id.substring(0, ampersandPosition);
        }
        return video_id;
    }
    matchYoutubeUrl(url) {
        var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/)(?:embed\/|v\/|watch\?v=|watch\?.+&v=)((?:\w|-){11})(?:&(play)?list=(\S+))?$/;
        if (url.match(p)) {
            return url.match(p)[1];
        }
        return false;
    }
    controlURLValue(event) {
        let elementId = event.target.id;
        let url = $("#" + elementId).val();
        if (this.matchYoutubeUrl(url))
            this.isBadUrl = false;
        else
            this.isBadUrl = true;

    }

    openProjectDetailsModal() {
        this.url = this.currentProject.videoPitch;
		this.projectDescription=this.currentProject.description;
        $('#video').val(this.url);
    }

    getURLStyle() {
        if (this.isBadUrl)
            return "#FA8072";
        return "#fff";
    }

    getDescriptionBackgroundStyle() {
        if (this.isBadDescriptionContent)
            return "#FA8072";
        return "#888";
    }

    getDateFormat(note: StepNote) {

    }
	
	hideNoteInputField(){
		this.noteInputShown=false;
	}
	
	hideAllRemarks(){
		this.remarkListShown=false;
	}
	
	showNoteInputField(){
		this.noteInputShown=true;
	}
	
	allNotesAction(){
		this.noteListShown=!this.noteListShown;
	}
	
	showAllRemarks(){
		this.remarkListShown=true;
	}
	
	showRemarkInputField(){
		this.remarkInputShown=true;
	}
	
	hideRemarkInputField(){
		this.remarkInputShown=false;
	}
	
	initializeDelivableArray(){
		//this.currentSelectedWFStep.deliverablesModelStatus=new Array();
				for(var item in this.currentSelectedWFStep.deliverables){
					let deliverable=new StepDeliverable();
					deliverable.label=this.currentSelectedWFStep.deliverables[item];
					deliverable.progress=0;
					deliverable.deliverableNum=Number(item);
					this.currentSelectedWFStep.deliverablesModelStatus.push(deliverable);
				}		
	}
	
	resetStepUIControlVariable(){
		this.noteListShown=false;
		this.noteInputShown=false;
		this.remarkListShown=false;
		this.remarkInputShown=false;		
	}
	
    //UI events
    onStepItemClick(groupId: number, groupStepId: number) {
		this.resetStepUIControlVariable();
        this.currentSelectedWFStep = this.currentProject.projectWF[groupId].steps[groupStepId];	
		if(this.currentSelectedWFStep.deliverablesModelStatus!=undefined){			
			if(this.currentSelectedWFStep.deliverablesModelStatus.length==0)
				this.initializeDelivableArray();
		}else{
				this.initializeDelivableArray();			
		}				
        this.myNote = new StepNote();
        $("#bd-example-modal-lg").modal('toggle');

    }

    matchProjectMemberToContactItem(item: any): User {
        if (item.assignedTo == null) return new User();
        let value: number = item.assignedTo.member.id;
        for (var i = 0; i < this.myContacts.length; i++) {
            if (value == this.myContacts[i].id)
                return this.myContacts[i];
        }

    }

    onTaskItemClick(item: Task) {
        this.currentSelectedTask = item;
        $('#taskSummernote').val(item.taskName);
        this.currentSelectedUser = this.matchProjectMemberToContactItem(item);

    }

    clickOnNewTask() {
        this.taskValidate = false;
        this.currentSelectedTask = new Task();
        this.currentSelectedUser = new User();
    }

    onAddProjectMember(item: User) {
        this.projectService.addMemberToTheProject(this.currentProject.id, item.id).subscribe(
            res => {
                this.projectMembers.push(this.utilityService.getObjectFromBackendResult(res, false));
            },
            err => {
                console.log(err);
            }
        );
    }

    assignProjectMemberToTask(task: Task, projectMember: any) {
        this.projectService.assignTaskToProjectMember(projectMember["id"], task.id).subscribe(
            res => {
                task.assignedTo = this.utilityService.getObjectFromBackendResult(res, false);
            },
            err => {

            }
        );
    }

    removeProjectMember(projectMember: any) {
        this.projectService.removeProjectMember(projectMember["id"]).subscribe(
            res => {
                for (var i = 0; i < this.projectMembers.length; i++)
                    if (this.projectMembers[i]["id"] = projectMember["id"]) {
                        this.projectMembers.splice(i, 1);
                        this.myContacts.push(this.utilityService.getObjectFromBackendResult(res, false));
                        break;
                    }
            },
            err => {

            }
        );
    }

    deleteStepTask(task: Task) {
        this.projectService.deleteProjectTask(task.id).subscribe(
            res => {
                this.currentSelectedStep.assignedTaskNumber = this.currentSelectedStep.assignedTaskNumber - 1;
                if (task.completed) this.currentSelectedStep.completedTaskNumber = this.currentSelectedStep.completedTaskNumber - 1;
                this.currentSelectedStep.completed = this.isTaskCompleted(this.currentSelectedStep.assignedTaskNumber, this.currentSelectedStep.completedTaskNumber);
                this.currentSelectedStep.taskRatio = this.calculateTaskRatio(this.currentSelectedStep.assignedTaskNumber, this.currentSelectedStep.completedTaskNumber);
                let index = this.currentProject.projectSteps[this.currentSelectedStep.stepNum].stepTasks.indexOf(task);
                this.currentProject.projectSteps[this.currentSelectedStep.stepNum].stepTasks.splice(index, 1);
            },
            err => {

            }
        );
    }

    applyEnableDisableStyleDependingOnProjectState(value: boolean) {
        if (value)
            $("#whole-content").addClass("disablecontent");
        else
            $("#whole-content").removeClass("disablecontent");
    }

    archiveProject(event) {
        this.currentProject.archived = event.checked;
        this.applyEnableDisableStyleDependingOnProjectState(event.checked);
        this.projectService.updateProjectState(this.currentProject.id, event.checked).subscribe(
            res => {
                console.log((res.json()["archived"]));
            },
            err => {

            }
        );
    }

    openFlowItem(event) {
        let elementId = event.target.id;
        let referenceTabStep = $("#" + elementId).attr('name');
        let stepNum = $("#" + elementId).attr('stepNum');
        this.currentSelectedStep = this.currentProject.projectSteps[stepNum];
        $("#workflow-tab").tab('show');
        $("#" + referenceTabStep).tab('show');
    }

    openStepDescription() {
        this.stepValidate = false;
        $('#stepSummernote').val(this.currentSelectedStep.description);
        //$('#stepSummernote').summernote("code", this.currentSelectedStep.description);
    }

    selectStep(parameter) {
        //this.currentSelectedStep=new Step();
        this.currentSelectedStep = this.currentProject.projectSteps[parameter];
    }

    onRemoveProjectMember(member: User) {

    }

    onChangeTaskState(event, task) {
        task.completed = event.checked;
        this.projectService.updateStepTaskState(this.currentProject.id, task).subscribe(
            res => {
                let result = this.utilityService.getObjectFromBackendResult(res, false);
                //task.completed=result.completed;
                if (task.completed)
                    this.currentSelectedStep.completedTaskNumber = this.currentSelectedStep.completedTaskNumber + 1;
                else
                    this.currentSelectedStep.completedTaskNumber = this.currentSelectedStep.completedTaskNumber - 1;
                this.currentSelectedStep.taskRatio = this.currentSelectedStep.completedTaskNumber / this.currentSelectedStep.assignedTaskNumber;
                this.currentSelectedStep.completed = this.isTaskCompleted(this.currentSelectedStep.stepTasks.length, this.currentSelectedStep.completedTaskNumber);
            },
            err => {

            }
        );


    }

    filterOutAlreadySelectedProjectMembers() {
        for (var i = 0; i < this.projectMembers.length; i++)
            for (var j = 0; j < this.myContacts.length; j++) {
                if (this.projectMembers[i]["id"] == this.myContacts[j].id) {
                    this.myContacts.splice(j, 1);
                    break;
                }
            }

    }
/*
    getStepMembers(stepTasks: Task[]): User[] {
        let members: User[] = new Array();
        let references: number[] = new Array();
        for (var i = 0; i < stepTasks.length; i++) {
            if (stepTasks[i].userReference != undefined && stepTasks[i].userReference != null)
                if (references.indexOf(stepTasks[i].userReference.id) < 0) {
                    members.push(stepTasks[i].userReference);
                    references.push(stepTasks[i].userReference.id);
                }
        }
        return members;
    }
*/
	
	computeGroupRatio(group:StepGroup):number{
		let value=group.groupRatio;
		let cpt:number=0;
		for(var item in group.steps){
			let step:WfStep=group.steps[item];
			for(var elt in step.deliverablesModelStatus)
				cpt=cpt+1;
		}
		return value/cpt;
	}
	
	getStepMembers(group:StepGroup):User[]{
		let result:User[]=new Array();
		for(var item in group.steps){
			let step:WfStep=group.steps[item];
			for(var iter in step.remarks)
				result.push(step.remarks[iter].userReference);			
		}
		return result;
	}
	
    getProjectMembers(projectSteps: any): User[] {
        let members: User[] = new Array();
        let references: number[] = new Array();

        for (var i = 0; i < projectSteps.length; i++) {
            for (var j = 0; j < projectSteps[i].stepTasks.length; j++) {
                if (projectSteps[i].stepTasks[j].userReference != undefined)
                    if (projectSteps[i].stepTasks[j].userReference != null)
                        if (references.indexOf(projectSteps[i].stepTasks[j].userReference.id) < 0) {
                            members.push(projectSteps[i].stepTasks[j].userReference);
                            references.push(projectSteps[i].stepTasks[j].userReference.id);
                        }
            }
        }
        return members;
    }

    userInputChange(item) {
        this.userService.getMyContactsWithMatchCriteria(item).subscribe(
            res => {
                this.myContacts = this.utilityService.getObjectFromBackendResult(res, true);
                this.filterOutAlreadySelectedProjectMembers();

            },
            err => {

            }
        );
    }

    resetProjectModal() {
        //$("#video").val('');
        //$("#summernote").val('');		  
    }

    deleteProject() {
        this.projectService.deleteProject(this.currentProject.id).subscribe(
            res => {
                this.router.navigate(['/dashboard']);
            },
            err => {

            }

        );
    }

    updateProjectDetails() {
        this.isBadDescriptionContent = $("#summernote").val().trim().length >= 50 ? false : true;
        if (this.url.indexOf('watch?v') >= 1)
            this.currentProject.videoPitch = "https://www.youtube.com/embed/" + this.getYoutubeVideoId(this.url.trim());
        this.isBadUrl = !this.matchYoutubeUrl(this.url);        
        if (!this.isBadUrl && !this.isBadDescriptionContent) {
            this.currentProject.description = $("#summernote").val().trim();
			$("#modaldetailprojet").modal('toggle');
            this.projectService.updateProjectDetails(this.currentProject, this.currentProject.id).subscribe(
                res => {
                    //this.currentProject=res.json();
                    this.resetProjectModal();
                    //$("#modaldetailprojet").modal('toggle');

                },
                err => {

                }
            );
        }
    }
	
	initProjectTeamModel(){
		let fakeArray:any[]=new Array();
		for(var item in this.currentProject.userMembers){
			let user:User=Object.assign({}, this.currentProject.userMembers[item]);
			if(user.id!=this.userLoggedIn.id && this.currentProject.members[item].activeMember){				
				this.selectedContacts.push(user);				
				let fake:any={
					id:user.id,
					firstNameAndLastName:user.firstName+" "+user.lastName
				}
				fakeArray.push(fake);
			}
		}		
		this.tempArray=fakeArray;
	}
	
	onStepModalHidden(event:any){
		/*console.log("event triggered");
		this.noteListShown=false;
		this.noteInputShown=false;
		this.remarkListShown=false;
		this.remarkInputShown=false;	*/	
	}
		
	onTeamModalHidden(event:any){
		/*console.log("modal team hidden");
		this.selectedContacts=[];
		this.tempArray=[];*/
		
	}
	
	submitProjectTeam(){
		let idArray:number[]=new Array();
		for(var item in this.tempArray)
			idArray.push(this.tempArray[item].id);
		let uniqueArray:number[] = idArray.filter(function(elem, index, self) {
			return index === self.indexOf(elem);
		});	
		$('#modalTeam').modal('toggle');
		this.projectService.addProjectMembers(this.currentProject.id,uniqueArray).subscribe(
			res=>{
				this.currentProject.members=res.json();
				let fakeArray:User[]=new Array();
				for(var item in this.selectedContacts)
					fakeArray.push(Object.assign({}, this.selectedContacts[item]));				
				this.currentProject.userMembers=fakeArray;	
				this.selectedContacts=[];
				//$('#modalTeam').modal('toggle');
			}
		);		
	}

    populateNoteInputText(note: StepNote) {
        this.myNote = note;
    }
	
    deleteStepAttachment(attachment: StepAttachment) {
        this.projectService.deleteProjectStepAttachment(attachment.id).subscribe(
            res => {
                let index = this.currentSelectedWFStep.attachmentsMetaData.indexOf(attachment);
                this.currentSelectedWFStep.attachmentsMetaData.splice(index, 1);
            }
        );
    }	
	
    deleteStepNote(note: StepNote) {
        this.projectService.deleteProjectStepNote(note.id).subscribe(
            res => {
                let index = this.currentSelectedWFStep.notes.indexOf(note);
                this.currentSelectedWFStep.notes.splice(index, 1);
            }
        );
    }

    handleFileSelect(evt) {
        let step: WfStep = Object.assign({}, this.currentSelectedWFStep);
        step.notes = [];
        step.remarks = [];
        step.attachmentsMetaData = [];
		step.deliverablesModelStatus= [];
        let attachment: StepAttachment = new StepAttachment();
        var files = evt.target.files;
		let file:File;
        for (var i = 0, f; f = files[i]; i++) {
            attachment.attachmentName = f.name;
            attachment.attachmentSize = f.size;
            attachment.attachmentFileType = f.type;
            attachment.worflowStepReference = step;
			file=f;  			
        }  
		this.projectService.createWorkflowStepAttachment(this.currentProject.id,step.stepNum, attachment, file).subscribe(
			response =>{
				attachment=response;
				if(this.currentSelectedWFStep.attachmentsMetaData==undefined)
					this.currentSelectedWFStep.attachmentsMetaData=new Array();
				this.currentSelectedWFStep.attachmentsMetaData.push(attachment);				
			},
			error =>{
				console.log(error);
			}
		);
    }
	
	refreshProjectGroupRatio(){
        return new Promise((resolve, reject) => {
            for (var elt in this.currentProject.projectWF) {
				let groupRatio:number=0;
				let group:StepGroup=this.currentProject.projectWF[elt];
				for(var item in group.steps){
					let step:WfStep=group.steps[item];
					for(var cpt in step.deliverablesModelStatus)
						groupRatio=groupRatio+step.deliverablesModelStatus[cpt].progress;
				}
				group.groupRatio=groupRatio;
            }
            resolve();
        });	
	}
	
	deliverableProgressChange(deliverable:StepDeliverable){		
		let step: WfStep = Object.assign({}, this.currentSelectedWFStep);
        step.notes = [];
        step.remarks = [];
        step.attachmentsMetaData = [];
		step.deliverablesModelStatus= [];	
		deliverable.worflowStepReference = step;			
		if(deliverable.id==undefined){
			this.projectService.initializeProjectStepDeliverableItemProgress(this.currentProject.id, this.currentSelectedWFStep.stepNum, deliverable).subscribe(
				res=>{
					deliverable=res.json();
					this.refreshProjectGroupRatio().then(() => {});					
				}						
			);
		}else{
			this.projectService.updateProjectStepDeliverableItemProgress(this.currentProject.id, this.currentSelectedWFStep.stepNum, deliverable).subscribe(
				res=>{
					deliverable=res.json();
					this.refreshProjectGroupRatio().then(() => {});	
				}						
			);			
		}
	}

    submitComment() {
        if (this.myComment.content.trim().length != 0) {
            let step: WfStep = Object.assign({}, this.currentSelectedWFStep);
            step.notes = [];
            step.remarks = [];
            step.attachmentsMetaData = [];
			step.deliverablesModelStatus= [];
            this.myComment.worflowStepReference = step;
            this.myComment.userReference = this.userLoggedIn;
            this.projectService.createWorflowStepComment(this.currentProject.id, this.currentSelectedWFStep.stepNum, this.myComment).subscribe(
                res => {
                    this.myComment = res.json();
                    this.currentSelectedWFStep.remarks.unshift(this.myComment);
                    this.myComment = new StepComment();
					this.remarkListShown=true;
                }
            );
        }

    }
/*
    submitNote(f: NgForm) {
        if (this.myNote.content.trim().length != 0){
            if (this.myNote.id == undefined) { //new note
                let step: WfStep = Object.assign({}, this.currentSelectedWFStep);
                step.notes = [];
                step.remarks = [];
                step.attachmentsMetaData = [];
				step.deliverablesModelStatus= [];
                this.myNote.worflowStepReference = step;
                this.projectService.createWorflowStepNote(this.currentProject.id, this.currentSelectedWFStep.stepNum, this.myNote).subscribe(
                    res => {
                        this.myNote = res.json();
                        this.currentSelectedWFStep.notes.unshift(this.myNote);
                        this.myNote = new StepNote();
                    }
                );
            } else { //note to be updated
                this.projectService.updateProjectStepNote(this.myNote, this.myNote.id).subscribe(
                    res => {
                        this.myNote = res.json();
                        this.myNote = new StepNote();
                    }
                );
            }
			this.noteListShown=true;
		}
    }
*/	
    submitNote() {
        if (this.myNote.content.trim().length != 0){
            if (this.myNote.id == undefined) { //new note
                let step: WfStep = Object.assign({}, this.currentSelectedWFStep);
                step.notes = [];
                step.remarks = [];
                step.attachmentsMetaData = [];
				step.deliverablesModelStatus= [];
                this.myNote.worflowStepReference = step;
                this.projectService.createWorflowStepNote(this.currentProject.id, this.currentSelectedWFStep.stepNum, this.myNote).subscribe(
                    res => {
                        this.myNote = res.json();
                        this.currentSelectedWFStep.notes.unshift(this.myNote);
                        this.myNote = new StepNote();
                    }
                );
            } else { //note to be updated
                this.projectService.updateProjectStepNote(this.myNote, this.myNote.id).subscribe(
                    res => {
                        this.myNote = res.json();
                        this.myNote = new StepNote();
                    }
                );
            }
			this.noteListShown=true;
		}
    }	

    saveStepDescription() {
        this.stepValidate = true;
        this.currentSelectedStep.description = $('#stepSummernote').val();
        this.projectService.createProjectStep(this.currentProject.id, this.currentSelectedStep).subscribe(
            res => {
                let step = this.utilityService.getObjectFromBackendResult(res, false);
                this.currentSelectedStep.description = step["description"];
                this.currentSelectedStep.id = step["id"];
                $("#modalflow").modal('toggle');
            },
            err => {

            }
        );

    }



    saveStepTask() {
        this.currentSelectedTask.taskName = $('#taskSummernote').val();
        if (this.currentSelectedUser.id != undefined)
            this.currentSelectedTask.userReference = this.currentSelectedUser
        else this.currentSelectedTask.userReference = null;
        if (this.currentSelectedTask.id == undefined) {
            this.taskValidate = true;
            this.currentSelectedTask.projectStep = this.currentSelectedStep;
            this.projectService.createStepTask(this.currentProject.id, this.currentSelectedTask).subscribe(
                res => {
                    let task: Task = this.utilityService.getObjectFromBackendResult(res, false);
                    this.currentProject.projectSteps[this.currentSelectedStep.stepNum].stepTasks.push(task);

                    this.currentSelectedStep.completed = false;
                    this.currentSelectedStep.assignedTaskNumber = this.currentSelectedStep.assignedTaskNumber + 1;
                    this.currentSelectedStep.taskRatio = this.currentSelectedStep.completedTaskNumber / this.currentSelectedStep.assignedTaskNumber;
                    $("#modaltache").modal('toggle');
                },
                err => {

                }
            );
        } else {
            this.projectService.updateStepTaskState(this.currentProject.id, this.currentSelectedTask).subscribe(
                res => {
                    let result: Task = this.utilityService.getObjectFromBackendResult(res, false);
                    this.currentSelectedTask.assignedTo = result.assignedTo;
                    $("#modaltache").modal('toggle');
                },
                err => {

                }
            );
        }
    }


    loadAllMyContacts() {
        this.userService.getMyContacts().subscribe(
            res => {
                this.myContacts = res.json();
                let user: User = new User(); //fake user to have an empty item in contact list	
                user.firstName = "<<None>>";
                //this.myContacts.unshift(this.currentProject.creator);
                //this.myContacts.unshift(user);
                //this.filterOutAlreadySelectedProjectMembers();
				this.dropdownSettings = {
            singleSelection: false,
            idField: 'id',
			enableCheckAll:false,
            textField: 'firstNameAndLastName',
            //selectAllText: 'Select All',
            //unSelectAllText: 'UnSelect All',
            itemsShowLimit: 3,
            allowSearchFilter: true
        };			
            },
            err => {

            }

        );

    }

    creatorNotYetInProjectMemberList(): boolean {
        for (var item in this.currentProject.projectSteps)
            if (this.currentProject.projectSteps[item].stepTasks.length > 0) {
                for (var elt in this.currentProject.projectSteps[item].stepTasks) {
                    if (this.currentProject.projectSteps[item].stepTasks[elt].assignedTo != null)
                        if (this.currentProject.projectSteps[item].stepTasks[elt].assignedTo.member.id == this.currentProject.creator.id)
                            return false;
                }
            }
        return true;
    }

    checkProjectMemberAvailability(): boolean {
        for (var item in this.currentProject.projectSteps)
            if (this.currentProject.projectSteps[item].stepTasks.length > 0) {
                for (var elt in this.currentProject.projectSteps[item].stepTasks)
                    if (this.currentProject.projectSteps[item].stepTasks[elt].assignedTo != null)
                        return true;
            }
        return false;
    }

	anyProgress():boolean{
		for(var item in this.currentProject.projectWF)
			if(this.currentProject.projectWF[item].groupRatio>0)
				return true
		return false;
	}
	
    checkTaskAvailabily(): boolean {
        for (var item in this.currentProject.projectSteps)
            if (this.currentProject.projectSteps[item].stepTasks.length > 0) {
                return true
            }
        return false;

    }
    setStepsWithTaskArray() {
        for (var item in this.currentProject.projectSteps)
            if (this.currentProject.projectSteps[item].stepTasks.length > 0) {
                let temp: Step = this.currentProject.projectSteps[item];
                this.stepsWithTasksInside.push(temp);
            }
        this.dataFetched = true;
    }

    isTaskCompleted(assigned: number, completed: number): boolean {
        if (assigned != 0)
            if (assigned == completed)
                return true;
        return false;
    }

    calculateTaskRatio(assigned: number, completed: number): number {
        if (assigned != 0)
            return completed / assigned;
        return 0;
    }
	
	checkProjectMemberStatus():boolean{
		if(this.currentProject.creator.id==this.userLoggedIn.id)
			return true;
		for(var item in this.currentProject.members){			
			if(this.userLoggedIn.id==this.currentProject.members[item].member.id)
				if(this.currentProject.members[item].activeMember)
					return true;
		}
		return false;
	}

    getCurrentUser() {
        this.userService.getCurrentUser().subscribe(
            res => {
                this.userLoggedIn = this.utilityService.getObjectFromBackendResult(res, false);
            },
            err => {
                console.log(err);
            }
        );
    }

    onWorkflowClick() {
        this.workflowShown = true;
		this.cpt=0;
    }

    alignMaphilightBehavior() {
        if (this.workflowShown && this.cpt < 3) {
            $("#wrapper *").css("max-width", "100%");
            $('img[usemap]').maphilight();
            $('img[usemap]').rwdImageMaps();
            this.cpt = this.cpt + 1;
            
        } else{ this.cpt = 0;
			this.workflowShown = false;
		}
    }

    dosomething() {
        $("#wrapper *").css("max-width", "100%");
        $('img[usemap]').maphilight();
        $('img[usemap]').imageMap();
		this.imageShown=true;
        Observable.interval(1000).subscribe(x => {
            this.alignMaphilightBehavior();
        });
    }

    onResize(event) {
        $("#wrapper *").css("max-width", "100%");
        $('img[usemap]').maphilight();
        //$('img[usemap]').imageMap();
        $('img[usemap]').rwdImageMaps();

    }


    updateRawData(projectWf: StepGroup[]) {
        let promise = new Promise((resolve, reject) => {
            for (var elt in projectWf) {
                let tempStep = projectWf[elt];
                for (var step in projectWf[elt].steps) {
                    tempStep.steps[step].description = tempStep.steps[step].descrip.split("\n");
                    tempStep.steps[step].deliverables = tempStep.steps[step].del.split("\n");
                    tempStep.steps[step].resources = tempStep.steps[step].res.split("\n");
                    tempStep.steps[step].recommandations = tempStep.steps[step].recom.split("\n");
                    tempStep.steps[step].liens = tempStep.steps[step].links.split("\n");
                    tempStep.steps[step].linksLabels = tempStep.steps[step].titles.split("\n");
                    tempStep.steps[step].linksTitles = new Array();
                    for (var cpt in tempStep.steps[step].liens) {
                        let url: Url = new Url();
                        url.link = tempStep.steps[step].liens[cpt];
                        if (tempStep.steps[step].linksLabels[cpt] != undefined)
                            url.text = tempStep.steps[step].linksLabels[cpt].toLowerCase();
                        if (url.link.trim().length != 0)
                            tempStep.steps[step].linksTitles.push(url);
                    }
                }
            }
            resolve();
        });
        return promise;
    }
	
	handleNoteEvent(input:any){
		switch(input.operation){
			case 'ADD':			
				break;
			default:
				;
		}
	}
	
	handleCommentEvent(input:any){
		let comment:StepComment=input.projectStepRemark;
		switch(input.operation){
			case 'ADD':				
				this.currentProject.projectWF[input.groupId].steps[input.groupStepId].remarks.push(comment);
				break;
			default:				
				for (var item in this.currentProject.projectWF[input.groupId].steps[input.groupStepId].remarks){
					let tempItem:StepComment=this.currentProject.projectWF[input.groupId].steps[input.groupStepId].remarks[item];
					if(tempItem.id==comment.id){	
						let index:number=this.currentProject.projectWF[input.groupId].steps[input.groupStepId].remarks.indexOf(tempItem);
						this.currentProject.projectWF[input.groupId].steps[input.groupStepId].remarks.splice(index,1);
						return ;
					}
				}					
		}		
	}	

	handleAttachmentEvent(input:any){
		let attachment:StepAttachment=input.projectStepAttachment;
		switch(input.operation){
			case 'ADD':				
				this.currentProject.projectWF[input.groupId].steps[input.groupStepId].attachmentsMetaData.push(attachment);
				break;
			default:				
				for (var item in this.currentProject.projectWF[input.groupId].steps[input.groupStepId].attachmentsMetaData){
					let tempItem:StepAttachment=this.currentProject.projectWF[input.groupId].steps[input.groupStepId].attachmentsMetaData[item];
					if(tempItem.id==attachment.id){	
						let index:number=this.currentProject.projectWF[input.groupId].steps[input.groupStepId].attachmentsMetaData.indexOf(tempItem);
						this.currentProject.projectWF[input.groupId].steps[input.groupStepId].attachmentsMetaData.splice(index,1);
						return ;
					}
				}			
		}		
	}
	
	handleDeliverableEvent(input:any){
		let deliverable:StepDeliverable=input.projectStepDeliverable;
		this.currentProject.projectWF[input.groupId].steps[input.groupStepId].deliverablesModelStatus[deliverable.deliverableNum]=deliverable;
	}
	
	handleBackendEvent(input:any){
		if(input.authorId!=this.userLoggedIn.id)
			switch(input.order){
				case 'NOTE':
					this.handleNoteEvent(input);
					break;
				case 'COMMENT':
					this.handleCommentEvent(input);
					break;
				case 'ATTACHMENT':
					this.handleAttachmentEvent(input);
				default:
					this.handleDeliverableEvent(input);
			}		
	}	
	
    loadData(projectId: number) {
        moment.locale('fr');
        this.getCurrentUser();
        this.projectService.getProjectWorkflow().subscribe(
            result => {
                let defaultWF: StepGroup[] = this.utilityService.getObjectFromBackendResult(result, true);
                this.updateRawData(defaultWF).then(() => {

                });
                this.projectService.getProjectById(projectId).subscribe(
                    res => {
                        this.currentProject = res.json();
                        this.titleService.setTitle("Projet://" + this.currentProject.name);
                        this.projectMembers = this.currentProject.userMembers;				
                        if (this.currentProject.videoPitch == null) {
                            this.currentProject.videoPitch = this.url;
                        }
                        this.loadAllMyContacts();
                        for (var item in this.currentProject.projectWfSteps) {
                            let tempStep = this.currentProject.projectWfSteps[item];
                            defaultWF[tempStep.groupId].steps[tempStep.groupStepId].id = tempStep.id;
                            defaultWF[tempStep.groupId].steps[tempStep.groupStepId].notes = tempStep.notes;
                            defaultWF[tempStep.groupId].steps[tempStep.groupStepId].remarks = tempStep.remarks;
                            defaultWF[tempStep.groupId].steps[tempStep.groupStepId].attachmentsMetaData = tempStep.attachmentsMetaData;
							defaultWF[tempStep.groupId].steps[tempStep.groupStepId].deliverablesModelStatus=tempStep.deliverablesModelStatus;
                            defaultWF[tempStep.groupId].steps[tempStep.groupStepId].completed = tempStep.completed;
							defaultWF[tempStep.groupId].groupRatio=defaultWF[tempStep.groupId].groupRatio+tempStep.stepRatio;
                        }												
                        this.currentProject.projectWF = defaultWF;
						let stompClient = this.webSocketService.connect();
						stompClient.connect({}, frame => {

							// Subscribe to notification topic
							stompClient.subscribe('/topic/'+this.currentProject.creator.username+"_"+this.currentProject.name+"_"+this.currentProject.id, res => {								
								this.handleBackendEvent(JSON.parse(res.body));
							})
						});		
						$('[data-toggle="tooltip"]').tooltip()						
                        this.dataFetched = true;
                    }
                );
            }
        );  
    }

    initializeSummernotes() {
        var textHeader = "";
        $(document).ready(function() {			
            $('#modaldetailprojet').on('shown.bs.modal', function() {
				/*
                $('#summernote').summernote({
                        popover: {
                            air: [
                                ['style', ['bold', 'italic', 'underline', 'clear']],
                                ['font', ['strikethrough', 'superscript', 'subscript']],
                                ['fontsize', ['fontsize']],
                                ['color', ['color']],
                                ['para', ['ul', 'ol', 'paragraph']]
                            ]

                        }
                    }

                );*/
            });
            $('#modalflow').on('shown.bs.modal', function() {
                $('#stepSummernote').summernote({
                        popover: {
                            air: [
                                ['style', ['bold', 'italic', 'underline', 'clear']],
                                ['font', ['strikethrough', 'superscript', 'subscript']],
                                ['fontsize', ['fontsize']],
                                ['color', ['color']],
                                ['para', ['ul', 'ol', 'paragraph']]
                            ]

                        }
                    }

                );
            });
            $('#modaltache').on('shown.bs.modal', function() {
                $('#taskSummernote').summernote({
                        popover: {
                            air: [
                                ['style', ['bold', 'italic', 'underline', 'clear']],
                                ['font', ['strikethrough', 'superscript', 'subscript']],
                                ['fontsize', ['fontsize']],
                                ['color', ['color']],
                                ['para', ['ul', 'ol', 'paragraph']]
                            ]

                        }
                    }

                );
            });
            $('#bd-example-modal-lg').on('shown.bs.modal', function() {
                /*$('#noteSummernote').summernote(
					{popover: {
					  air: [						
						['style', ['bold', 'italic', 'underline', 'clear']],
						['font', ['strikethrough', 'superscript', 'subscript']],
						['fontsize', ['fontsize']],
						['color', ['color']],
						['para', ['ul', 'ol', 'paragraph']]
					  ]
    
					}}
									
					);*/

            });
            $('#modalflow').on('hidden.bs.modal', function() {
                if (!this.stepValidate) {
                    //this.currentSelectedStep.description="";
                    //$('#stepSummernote').val('');
                }
                $('#stepSummernote').summernote('destroy');
            });
            $('#modaltache').on('hidden.bs.modal', function() {
                if (!this.taskValidate) {
                    //this.currentSelectedTask.taskName="";
                    $('#taskSummernote').val('');
                }
                $('#taskSummernote').summernote('destroy');
            });

            $("#bd-example-modal-lg").on('hidden.bs.modal', function() {
                //$(this).data('bs.modal', null);
                textHeader = "";
                $('#noteSummernote').summernote('destroy');
                $("#carouselExampleIndicators").carousel(0);
            });
            $("#bd-example-modal-lg").on('shown.bs.modal', function() {
                $(this).find('.modal-title').text("Description/Questions à se Poser");
                $('#carouselExampleIndicators').on('slide.bs.carousel', function(ev) {
                    var id = ev.relatedTarget.id;
                    switch (id) {
                        case "1":
                            $("#bd-example-modal-lg").find('.modal-title').text("Description/Questions à se Poser");
                            break;
                        // case "2":
                            // $("#bd-example-modal-lg").find('.modal-title').text("Deliverables");
                            // break;
                        case "2":
                            $("#bd-example-modal-lg").find('.modal-title').text("Recommandations");
                            break;
                        default:
                            $("#bd-example-modal-lg").find('.modal-title').text("Online Resources");
                    }
                });​
            });

        });
    }

    ngOnInit() {
        $('img[usemap]').imageMap();
        this.loginService.checkSession().subscribe(
            res => {

                this.loginService.sendLoginEvent(true);
                this.route.params.forEach((params: Params) => {
                    this.loadData(Number.parseInt(params['id']));
                });
                this.initializeSummernotes();

            },
            error => {
                this.loginService.sendLoginEvent(false);
                this.router.navigate(['/login']);
            }
        );
    }

}