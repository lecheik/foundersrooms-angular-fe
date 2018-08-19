import {
    Component,
    OnInit,
    ViewContainerRef
} from '@angular/core';
import {
    Params,
    ActivatedRoute,
    Router
} from '@angular/router';
import {
    Title
} from '@angular/platform-browser';
import {
    SelectItem
} from 'primeng/components/common/api';
import {
    Message
} from 'primeng/components/common/api';
import {
    MessageService
} from 'primeng/components/common/messageservice';
import {
    LoginService
} from '../../services/login.service';
import {
    UtilityService
} from '../../services/utility.service';
import {
    UploadImageService
} from '../../services/upload-image.service';
import {
    User
} from '../../models/user';

import {
    SocialUser
} from 'ng4-social-login';
declare var jquery: any;
declare var $: any;


@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.css'],
    providers: [MessageService]
})
export class SignUpComponent implements OnInit {
    msgs: Message[] = [];
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private loginService: LoginService,
        private utilityService: UtilityService, private messageService: MessageService,
        private titleService: Title
        /*,
        private authService: AuthService*/
    ) {

    }
    //registration mapping values
    credentials: any = {
        userEmail: '',
        password: '',
        passwordConfirm: '',
        userName: '',
        firstName: '',
        userType: ''
    }

    userType: string[] = ["Creator", "Supplier", "Investor"];
    private userApp: User = new User();
    selectedUserType: string = undefined;
    private user: SocialUser;
    private loggedIn: boolean;
    userTypeSelected: boolean = true;
    emailAlreadyExist: boolean = true;
    passwordOk: boolean = true;
    bothPasswordMatched: boolean = true;
    emailOk: boolean = true;
    userNameOk: boolean = true;
    firstNameOk: boolean = true;
    emailSent: boolean = true;
    signInTriggered: boolean = false;

    showSuccess() {
        this.msgs = [];
        this.msgs.push({
            severity: 'success',
            summary: 'Success Message',
            detail: 'Order submitted'
        });
    }

    emailCheck(value: string): boolean {
        var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        return re.test(value);
    }

    checkIfEmailIsValid() {
        this.emailOk = this.emailCheck(this.credentials.userEmail);
    }

    checkIfPasswordIsValid() {
        this.passwordOk = (this.credentials.password.length > 8);
    }

    checkIfConfirmPasswordIsValid() {
        this.bothPasswordMatched = (this.credentials.passwordConfirm == this.credentials.password);
    }

    checkIfUsernameIsValid() {
        this.userNameOk = (this.credentials.userName.trim().length >= 3);
    }

    checkIfFirstNameIsValid() {
        this.firstNameOk = (this.credentials.firstName.trim().length >= 3);
    }

    isRegistrationFormOk(): boolean {
        if (this.selectedUserType == undefined) {
            this.userTypeSelected = false;
            return false;
        }
        this.userTypeSelected = true;
        if (!this.emailCheck(this.credentials.userEmail)) {
            this.emailOk = false;
            return false;
        }
        this.emailOk = true;
        if (this.credentials.password.length < 8) {
            this.passwordOk = false;
            return false;
        }
        this.passwordOk = true;
        if (this.credentials.passwordConfirm != this.credentials.password) {
            this.bothPasswordMatched = false;
            return false;
        }
        this.bothPasswordMatched = true;
        if (this.credentials.userName.trim().length < 3) {
            this.userNameOk = false;
            return false;
        }
        this.userNameOk = true;
        if (this.credentials.firstName.trim().length < 3) {
            this.firstNameOk = false;
            return false;
        }
        this.firstNameOk = true;
        return true;
    }

    registerUserWithoutProvider() {
        this.emailOk = !this.emailOk;
        let check = this.isRegistrationFormOk();
        if (check)
            this.loginService.newNonSocialUser(this.credentials.firstName, this.credentials.userName, this.credentials.userEmail, this.credentials.password, this.selectedUserType).subscribe(
                res => {
                    this.userApp = res.json();
                    this.router.navigate(['/login']);
                },
                error => {
                    console.log(error.text());
                    this.emailAlreadyExist = true;
                }
            );
        else
            this.showSuccess();
    }

    createNewAccount() {
        var names = this.user.name.split(" ");
        var email = this.user.email;
        //var username=names[0]+"."+names[1];
        var username = email; //swap username with email for authentication
        var photoUrl = this.user.photoUrl;
        this.loginService.newSocialUser(names[0], names[1], username.toLowerCase(), email, this.selectedUserType).subscribe(
            res => {
                this.userApp = this.utilityService.getObjectFromBackendResult(res, false);                
                this.userApp = res.json();
                this.loginService.getProfileImage(this.user.photoUrl).subscribe(
                    result => {
                        let blob = new Blob([result.json()], {
                            type: res.headers.get("Content-Type")
                        });

                        this.loginService.uploadImage(this.userApp.id, new File([blob], this.userApp.firstName + new Date().getTime())).then((result) => {
                            console.log(result);
                            this.loginService.refreshUserDataNow();
                            this.login(email,"foundersrooms");
                        }, (error) => {
                            console.log(error);
                        });

                    }

                );
                this.login(email, "foundersrooms");
            },
            error => {
                console.log(error.text());
                this.emailAlreadyExist = false;
            }
        );
    }

    login(username: string, password: string) {
        this.loginService.sendCredential(username, password).subscribe(
            res => {
                localStorage.setItem("xAuthToken", res.json().token);
                this.loggedIn = true;
                this.loginService.sendLoginEvent(true);
                this.router.navigate(['/network']);
                this.signInTriggered = false;
            },
            error => {
                console.log(error);
                this.loggedIn = false;
                //this.loginError = true;
                this.loginService.sendLoginEvent(false);
                this.signInTriggered = false;
            }
        );
    }

    signInWithGoogle(): void {
        if (this.selectedUserType != undefined) {
            this.signInTriggered = true;
            this.loginService.signInWithGoogle();
        }
    }

    signInWithFB(): void {
		/*
        if (this.selectedUserType != undefined) {
            this.signInTriggered = true;
            this.loginService.signInWithFB();
        }*/
    }

    signInWithLinkedIN(): void {
		/*
        if (this.selectedUserType != undefined) {
            this.signInTriggered = true;
            this.loginService.signInWithLinkedIN();
        }*/
    }


    toTitleCase(str): string {
        return str.replace(/(?:^|\s)\w/g, function(match) {
            return match.toUpperCase();
        });
    }

    afterComponentInit() {
        $(document).ready(function() {
            $(this).scrollTop(0);
        });
        this.loginService.getAuthService().authState.subscribe((user) => {
            this.user = user;
            if (this.user != null && this.signInTriggered)
                this.createNewAccount();
            this.loggedIn = (user != null);

        });
        this.route.params.forEach((params: Params) => {
            let parameter = params['user_type'];
            if (parameter != "register") {
                this.selectedUserType = this.toTitleCase(parameter);
                this.userTypeSelected = true;
            } else this.userTypeSelected = false;


        });
        this.credentials.userEmail = '';
        this.credentials.password = '';
        this.credentials.passwordConfirm = '';
        this.credentials.userName = '';
        this.credentials.firstName = '';
    }

    ngOnInit() {
		this.titleService.setTitle("Inscription");
        this.loginService.checkSession().subscribe(
            res => {
                this.loginService.signOut();
                this.loginService.logout().subscribe(
                    res => {
                        this.loginService.sendLoginEvent(false);
                        this.signInTriggered = false;
                        this.afterComponentInit();
                    },
                    error => {
                        console.log(error);
                    }
                );
            },
            err => {
                this.afterComponentInit();
            }
        );
    }

}