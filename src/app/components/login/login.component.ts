import {
    Component,
    OnInit
} from '@angular/core';
import {
    Router
} from '@angular/router';
import {
    LoginService
} from '../../services/login.service';
import {
    UserService
} from '../../services/user.service';
import {
    Title
} from '@angular/platform-browser';
import {
    User
} from '../../models/user';
import {
    SocialUser
} from 'ng4-social-login';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    /*private*/
    credential = {
        'username': '',
        'password': ''
    }
    private loggedIn = false;
    private loginError: boolean = false;
    private emailSent: boolean = false;
    private usernameExists: boolean;
    private emailExists: boolean;
    private username: string;
    private email: string;

    private emailNotExists: boolean = false;
    private forgetPasswordEmailSent: boolean;
    private recoverEmail: string;
    private socialUser: SocialUser;
    private socialSignInTriggered: boolean = false;
    constructor(
        private loginService: LoginService,
        private userService: UserService,
        private router: Router,
        private titleService: Title
    ) {}

    onSubmit() {
        this.signInUser(this.credential.username, this.credential.password);
    }

    signInUser(email: string, password: string) {
        this.loginService.sendCredential(email, password).subscribe(
            res => {
                localStorage.setItem("xAuthToken", res.json().token);
                this.loggedIn = true;
                //location.reload();
                this.loginService.sendLoginEvent(true);
                //this.getCurrentUser();
				this.userService.checkBasicRequirements().subscribe(
					result=>{
						if(result.json())
							this.router.navigate(['/dashboard']);
						else
							this.router.navigate(['/userProfile']);
					}
				);
                //
            },
            error => {
                console.log(error);
				this.loginService.getAuthService().signOut();
                this.loggedIn = false;
                this.loginError = true;
                this.loginService.sendLoginEvent(false);
            }
        );

    }

    getCurrentUser() {
        this.userService.getCurrentUser().subscribe(
            res => {
                let user: User = res.json();
                this.loginService.shareUserLoggedIn(user);
            },
            err => {
                console.log(err);
            }
        );
    }

    onNewAccount() {
        this.usernameExists = false;
        this.emailExists = false;
        this.emailSent = false;

        this.userService.newUser(this.username, this.email).subscribe(
            res => {
                console.log(res);
                this.emailSent = true;
            },
            error => {
                console.log(error.text());
                let errorMessage = error.text();
                if (errorMessage === "usernameExists") this.usernameExists = true;
                if (errorMessage === "emailExists") this.emailExists = true;
            }
        );
    }

    onForgetPassword() {
        this.forgetPasswordEmailSent = false;
        this.emailNotExists = false;

        this.userService.retrievePassword(this.recoverEmail).subscribe(
            res => {
                console.log(res);
                this.emailSent = true;
            },
            error => {
                console.log(error.text());
                let errorMessage = error.text();
                if (errorMessage === "emailExists") this.emailExists = true;
            }
        );
    }

    signInWithGoogle(): void {
        this.socialSignInTriggered = true;
        this.loginService.signInWithGoogle();
    }

    signInWithFB(): void {
		/*
        this.socialSignInTriggered = true;
        this.loginService.signInWithFB();*/
    }

    signInWithLinkedIN(): void {
        /*
		this.socialSignInTriggered = true;
        this.loginService.signInWithLinkedIN();
		*/
    }


    ngOnInit() {
        this.credential.username = '';
        this.credential.password = '';
        this.titleService.setTitle("Connextion");
        this.loginService.checkSession().subscribe(
            res => {
                this.loggedIn = true;
                this.loginService.sendLoginEvent(true);
                this.router.navigate(['/userProfile']);
            },
            error => {
                this.loginService.sendLoginEvent(false);
                this.loggedIn = false;
				if(this.socialUser!=null)
					this.loginService.getAuthService().signOut();
				this.loginService.getAuthService().authState.subscribe((user) => {		
					this.socialUser = user;
					if (this.socialUser != null /*&& this.socialSignInTriggered*/) {                
						var email = this.socialUser.email;
						this.signInUser(email, "foundersrooms");

					}
					//this.loggedIn = (user != null);

				});				
            }
        );
    }
}