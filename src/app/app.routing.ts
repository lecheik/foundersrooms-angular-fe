import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {UserProfileComponent} from './components/user-profile/user-profile.component';
import {UserListComponent} from './components/user-list/user-list.component';
import {UserDetailComponent} from './components/user-detail/user-detail.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {NetworkComponent} from './components/network/network.component';
import {NeedComponent} from './components/need/need.component';
import {ProjectComponent} from './components/project/project.component';
import {HomeComponent} from './components/home/home.component';
import {SearchComponent} from './components/search/search.component';
import {SignUpComponent} from './components/sign-up/sign-up.component';
import {GraphComponent} from './components/graph/graph.component';
import {CytoscapeComponent} from './components/cytoscape/cytoscape.component';
import {StepLayoutComponent} from './components/step-layout/step-layout.component';
import {ChatComponent} from './components/chat/chat.component';

const appRoutes: Routes = [
	{
		path : '',
		redirectTo: '/home',
		pathMatch: 'full'
	},
	{
		path: 'login',
		component: LoginComponent
	},
	{
		path: 'sign-up/:user_type',
		component: SignUpComponent
	},		
	{
		path: 'userProfile',
		component: UserProfileComponent
	},
	{
		path: 'userList',
		component: UserListComponent
	},
	{
		path: 'userDetail/:id',
		component: UserDetailComponent
	},
	{
		path: 'dashboard',
		component: DashboardComponent
	},
	{
		path: 'network',
		component: NetworkComponent
	},
	{
		path: 'need',
		component: NeedComponent
	},
	{
		path: 'project/:id',
		component: ProjectComponent
	},
	{
		path: 'home',
		component: HomeComponent
	},	
	{
		path: 'graph',
		component: CytoscapeComponent
	},	
	{
		path: 'search',
		component: SearchComponent
	},	
	{
		path: 'step_layout',
		component: StepLayoutComponent
	},	
	{
		path: 'chat',
		component: ChatComponent
	},	
	{
		path: '**',
		redirectTo: '/network',
	}
];



export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
