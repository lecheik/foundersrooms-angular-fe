import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { LoginService } from '../../services/login.service';
import {Params, ActivatedRoute, Router} from '@angular/router';
declare var cytoscape:any;
declare var jquery:any;
declare var $ :any;
@Component({
  selector: 'app-step-layout',
  templateUrl: './step-layout.component.html',
  styleUrls: ['./step-layout.component.css']
})
export class StepLayoutComponent implements OnInit {

  constructor(private route:ActivatedRoute,
			private loginService:LoginService,
			private titleService:Title,
			private router:Router) { }

  ngOnInit() {
	  this.titleService.setTitle("Project Step Template");
    this.loginService.checkSession().subscribe(
  		res => {			
			this.loginService.sendLoginEvent(true);
			$("#bd-example-modal-lg").modal('toggle');
  		},
  		error => {
			this.loginService.sendLoginEvent(false);
  			this.router.navigate(['/login']);
  		}
  	);	  
  }

}
