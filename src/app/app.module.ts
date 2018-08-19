import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { MaphilightModule } from 'ng-maphilight';
import { MomentModule } from 'ngx-moment';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SocialLoginModule, AuthServiceConfig } from "angularx-social-login";
import { GoogleLoginProvider, FacebookLoginProvider, LinkedInLoginProvider} from "angularx-social-login";
/*
import {
  SocialLoginModule, 
  AuthServiceConfig,
  GoogleLoginProvider, 
  FacebookLoginProvider, 
  LinkedinLoginProvider
} from 'ng4-social-login';*/
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {
  MatButtonModule,
  MatSpinner,
  MatMenuModule,
  MatToolbarModule,
  MatIconModule,
  MatCheckboxModule,
  MatCardModule,
  MatTabsModule,
  MatFormFieldModule,
  MatInputModule,
  MatGridListModule,
  MatSelectModule,
  MatAutocompleteModule,
  MatSliderModule,
  MatButtonToggleModule,
  MatSlideToggleModule
} from '@angular/material';
import { NouisliderModule } from 'ng2-nouislider';
import { DataTableModule } from 'angular2-datatable';
import { DataFilterPipe } from './components/user-list/data-filter.pipe';
import { routing } from './app.routing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import 'hammerjs';

import { SafePipe } from './models/safe-pipe';
import { NonEmptyStepTaskFilter } from './models/non-empty-step-task-filter';

import { AppComponent } from './app.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { LoginComponent } from './components/login/login.component';

import { LoginService} from './services/login.service';
import { UserService} from './services/user.service';
import { NeedService } from './services/need.service';
import { ProjectService } from './services/project.service';
import { UtilityService } from './services/utility.service';
import { UploadImageService } from './services/upload-image.service';
import { WebsocketServiceService } from './services/websocket-service.service';
import { SearchService } from './services/search.service';
import { ChatService } from './services/chat.service';

import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NetworkComponent } from './components/network/network.component';
import { NeedComponent } from './components/need/need.component';
import { ProjectComponent } from './components/project/project.component';
import { HomeComponent } from './components/home/home.component';
import { SearchComponent } from './components/search/search.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { GraphComponent } from './components/graph/graph.component';
import { CytoscapeComponent } from './components/cytoscape/cytoscape.component';
import { StepLayoutComponent } from './components/step-layout/step-layout.component';
import { ChatComponent } from './components/chat/chat.component';


/*const CONFIG = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider('519634358569-23djr33j5o5qvan3d6r825iht1cjmj7g.apps.googleusercontent.com')
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider('212399079363797')
  },
  {
    id: LinkedinLoginProvider.PROVIDER_ID,
    provider: new LinkedinLoginProvider('LINKEDIN_CLIENT_ID')
  }
]);*/

let CONFIG = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider("519634358569-23djr33j5o5qvan3d6r825iht1cjmj7g.apps.googleusercontent.com")
  }/*,
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider("Facebook-App-Id")
  },
  {
    id: LinkedInLoginProvider.PROVIDER_ID,
    provider: new LinkedInLoginProvider("LinkedIn-client-Id", false, 'en_US')
  }*/
]);
 
export function provideConfig() {
  return CONFIG;
}

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    LoginComponent,
    UserProfileComponent,
    UserListComponent,
    DataFilterPipe,
    UserDetailComponent,
    DashboardComponent,
    NetworkComponent,
    NeedComponent,
    ProjectComponent,
    HomeComponent,
    SearchComponent,
	SafePipe,
	NonEmptyStepTaskFilter,
	SignUpComponent,
	GraphComponent,
	CytoscapeComponent,
	StepLayoutComponent,
	ChatComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    routing,
    MatButtonModule,
    MatCheckboxModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatGridListModule,
    MatIconModule,
    MatCardModule,
    DataTableModule,
    MatTabsModule,
    MatSelectModule,
    MatAutocompleteModule,
	MatButtonToggleModule,
	MatSlideToggleModule,
    MatSliderModule,
    NouisliderModule,
	AngularFontAwesomeModule,
	SocialLoginModule,
	MessagesModule	,
	MessageModule,	
	NgxGraphModule,
	MaphilightModule,
	MomentModule,
	NgMultiSelectDropDownModule.forRoot()
	/*,
    TagInputModule*/
  ],
  providers: [
    LoginService,
    UserService,
    NeedService,
    UtilityService,
	ProjectService,
	UploadImageService,
	WebsocketServiceService,
	SearchService,
	ChatService,
	Title,
	{
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }	
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
