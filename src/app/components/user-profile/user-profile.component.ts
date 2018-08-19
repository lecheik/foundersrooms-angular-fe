import {
    Component,
    OnInit
} from '@angular/core';
import {
    DomSanitizer,
    SafeUrl
} from '@angular/platform-browser';
import {
    AppConst
} from '../../constants/app-const';
import {
    UserService
} from '../../services/user.service';
import { Title } from '@angular/platform-browser';
import {
    LoginService
} from '../../services/login.service';
import {
    UtilityService
} from '../../services/utility.service';
import {
    NeedService
} from '../../services/need.service';
import {
    User
} from '../../models/user';
import {
    Need
} from '../../models/need';
import {
    Country
} from '../../models/country';
import {
    NeedTemplate
} from '../../models/need-template';
import {
    Router
} from '@angular/router';


import {
    FormControl
} from '@angular/forms';

import {
    Observable
} from 'rxjs/Observable';
import {
    startWith
} from 'rxjs/operators/startWith';
import {
    map
} from 'rxjs/operators/map';


export class State {
    constructor(public id: number, public name: string, public population: string, public flag: string) {}
}

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

    //private countries : Country[];
    private countries: string[];
    private serverPath = AppConst.serverPath;
    /*private*/
    dataFetched = false;
    private loginError: boolean;
    private loggedIn: boolean;
    private credential = {
        'username': '',
        'password': ''
    };

    private need: Need;

    private need1: User[];
    public need1Select = "";

    private activitiesList: string[] = new Array();
    private jobsList: string[][] = new Array();
    private jobListFiltered: string[] = new Array();

    private user: User = new User();
    private updateSuccess: boolean;
    private newPassword: string;
    private incorrectPassword: boolean;
    private currentPassword: string;

    stateCtrl: FormControl;
    filteredStates: Observable < any[] > ;

    states: State[] = new Array();
    imageData: any;
    nonSanitizeImageData: any;
    filesToUpload: Array < File > ;

    constructor(
        private loginService: LoginService,
        private userService: UserService,
        private router: Router,
        private needService: NeedService,
		private titleService:Title,
        private utilityService: UtilityService, private sanitizer: DomSanitizer
    ) {
        this.stateCtrl = new FormControl();
        this.filteredStates = this.stateCtrl.valueChanges
            .pipe(
                startWith(''),
                map(state => state ? this.filterStates(state) : this.states.slice())
            );

    }

    filterStates(name: string) {
        return this.states.filter(state =>
            state.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
    }

    onUpdateUserInfo() {
        this.userService.updateUserInfo(this.user, this.newPassword, this.currentPassword).subscribe(
            res => {
                this.updateSuccess = true;
				if(this.filesToUpload!=undefined)
				if(this.filesToUpload.length>0){
					let temp = this.filesToUpload[0] as Blob;
					this.loginService.uploadImage(this.user.id, new File([temp], this.user.firstName + new Date().getTime())).then((result) => {
						console.log(result);
						this.loginService.refreshUserDataNow();
					}, (error) => {
						console.log(error);
					});
				}

            },
            error => {
                console.log(error.text());
                let errorMessage = error.text();
                if (errorMessage === "Incorrect current password!") this.incorrectPassword = true;
            }
        );
    }

    getCurrentUser() {
        this.userService.getCurrentUser().subscribe(
		//this.userService.getCurrentUserProfile().subscribe(
            res => {
                this.user = this.utilityService.getObjectFromBackendResult(res, false);
                this.user.country = "France";
                let index = this.activitiesList.indexOf(this.user.sector);
                this.jobListFiltered = this.jobsList[index];
                this.loadProfileImage();
            },
            err => {
                console.log(err);
            }
        );
    }

    loadImageFromBrowser(event) {
        if (event.target.files && event.target.files[0]) {
            this.filesToUpload = < Array < File >> event.target.files;
            let urlCreator = window.URL;
            let blob = this.filesToUpload[0] as Blob;
            this.nonSanitizeImageData = null;
            this.nonSanitizeImageData = blob;
            this.imageData = this.sanitizer.bypassSecurityTrustUrl(
                urlCreator.createObjectURL(blob));
        }
    }

    loadProfileImage() {

        let imageUrl;
        if (this.user.profileImageSet) {
            imageUrl = this.serverPath + "/imag/user/" + this.user.id + ".jpg?" + new Date().getTime();
            console.log(imageUrl);
        } else
            imageUrl = this.serverPath + "/imag/user/default";

        this.loginService.getProfileImage(imageUrl).subscribe(
            result => {
                let blob = new Blob([result.json()], {
                    type: result.headers.get("Content-Type")
                });
                this.nonSanitizeImageData = blob;
                let urlCreator = window.URL;
                this.imageData = this.sanitizer.bypassSecurityTrustUrl(
                    urlCreator.createObjectURL(blob));
                this.dataFetched = true;
            }

        );

    }

    getCountriesAndCitiesListItems() {
        this.utilityService.getCountryList().subscribe(
            res => {
                this.countries = res.json();
                this.user.country = this.countries[74];
            },
            err => {
                console.log(err);
            }
        );
    }

    getActivitiesAndJobsListItems() {
        this.utilityService.getActivitySectors().subscribe(
            res => {
                let result = res.json();
                result.forEach((item, index) => {
                    this.activitiesList.push(item);
                });
            },
            err => {
                console.log(err);
            }
        );

        this.utilityService.getJobs().subscribe(
            res => {
                let result = res.json();
                result.forEach((item, index) => {
                    this.jobsList.push(item);
                });
                this.getCurrentUser();
            },
            err => {
                console.log(err);
            }
        );
    }

    onSectorSelect(item) {
        this.jobListFiltered = []
        let index = this.activitiesList.indexOf(item.value);
        let result = this.jobsList[index];
        result.forEach((item, index) => {
            this.jobListFiltered.push(item);
        });
        let tableIndex = Math.floor(Math.random() * this.jobListFiltered.length) + 1;
        this.user.job = this.jobListFiltered[tableIndex];
    }
    /*
      onFocusOut(item){
        if(item.trim().length>1)
        this.utilityService.getCityInfos(item.trim()).subscribe(
          res => {
            let result=res.json();
            if(!result["found"]){
              this.user.town="";
              this.states=[];
            }else
              this.user.town=result["name"];
            console.log(res.json());
          },
          err => {
            console.log(err);
          }
      );
      }
    */

    testUseCase(item) {
        console.log(item);
    }

    inputTextChanged(item) {

        if (item.trim().length > 2)
            this.utilityService.getCitiesWithCityNameContaining(item.trim()).subscribe(
                res => {
                    this.states = res.json();
                },
                err => {
                    console.log(err);
                }
            );
        else this.states = [];
    }

    loadData() {
        this.getCountriesAndCitiesListItems();
        this.getActivitiesAndJobsListItems();
    }


    ngOnInit() {	
		this.titleService.setTitle("Edition Profil");	
        this.loginService.checkSession().subscribe(
            res => {
                this.loginService.sendLoginEvent(true);
                this.loggedIn = true;
                this.loadData();

            },
            error => {
                this.loggedIn = false;
                console.log("inactive session");
                this.loginService.sendLoginEvent(false);
                this.router.navigate(['/login']);
            }
        );
    }

}