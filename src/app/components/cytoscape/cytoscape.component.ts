import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { LoginService } from '../../services/login.service';
import {Params, ActivatedRoute, Router} from '@angular/router';
declare var cytoscape:any;
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-cytoscape',
  templateUrl: './cytoscape.component.html',
  styleUrls: ['./cytoscape.component.css'] 
})
export class CytoscapeComponent implements OnInit {
  
  private cy:any;
  constructor(private route:ActivatedRoute,
			private loginService:LoginService,
			private titleService:Title,
			private router:Router) { }


onResize(event) {
  //$("#cy > div").css( "max-width", "100%" );
//this.cy.reset();
 this.cy.resize();
  this.cy.fit();
 //this.cy.center();
 
	//this.cy.elements().remove();
  console.log("hello");
}			
  ngOnInit() {
	this.titleService.setTitle("Project Workflow");
    this.loginService.checkSession().subscribe(
  		res => {
			this.loginService.sendLoginEvent(true);
			this.cy= cytoscape({
				container: $('#cy'),
				  elements: [ // list of graph elements to start with
					{ // node 1
					  data: { id: '1',label: 'IDEE', type:'common', part:'concept' }
					},
					{ // node 2
					  data: { id: '2',label: 'PROPOSITION DE VALEUR', type:'common', part:'concept'  }
					},
					{ // node 3
					  data: { id: '3',label: 'BUSINESS MODEL', type:'common' , part:'concept' }
					},	
					{ // node 4
					  data: { id: '4',label: 'PROJET', type:'common' , part:'project' }
					},	
					{ // node 5
					  data: { id: '5',label: 'ETUDE DU MARCHE', type:'common' , part:'project' }
					},	
					{ // node 6
					  data: { id: '6',label: 'FINANCES', type:'common' , part:'project' }
					},	
					{ // node 7
					  data: { id: '7',label: 'DETAILS DES BESOINS', type:'common', part:'project'  }
					},	
					{ // node 8
					  data: { id: '8',label: 'DETAILS DES RESSOURCES', type:'common', part:'project'  }
					},	
					{ // node 9
					  data: { id: '9',label: 'PROJET FINANCABLE ?' , type:'check' }
					},	
					{ // node 10
					  data: { id: '10',label: 'EXECUTION' , type:'common', part:'product' }
					},	
					{ // node 11
					  data: { id: '11',label: 'DEVELOPPEMENT PRODUIT(MVP)' , type:'common', part:'product' }
					},	
					{ // node 12
					  data: { id: '12',label: 'TESTS ET VALIDATION' , type:'common', part:'product' }
					},	
					{ // node 13
					  data: { id: '13',label: 'PRODUIT OU SERVICE VENDABLE ?' , type:'check' }
					},	
					{ // node 14
					  data: { id: '14',label: 'TERRAIN' , type:'common' , part:'goto'}
					},	
					{ // node 15
					  data: { id: '15',label: 'CONTACT CLIENTELE' , type:'common' , part:'goto'}
					},	
					{ // node 16
					  data: { id: '16',label: 'COMMUNUCATION' , type:'common', part:'goto' }
					},	
					{ // node 17
					  data: { id: '17',label: 'COMMERCIALISATION' , type:'common' , part:'goto'}
					},	
					{ // node 18
					  data: { id: '18',label: 'ENTREPRISE' , type:'common' , part:'juri'}
					},	
					{ // node 19
					  data: { id: '19',label: 'STRUCTURE JURIDIQUE' , type:'common' , part:'juri'}
					},	
					{ // node 20
					  data: { id: '20',label: 'STATUTS' , type:'common' , part:'juri'}
					},	
					{ // node 21
					  data: { id: '21',label: 'IMMATRICULATION' , type:'common' , part:'juri'}
					}
					
					
					
					
					,					
					{ // edge 1-2
					  data: { id: '1-2', source: '1', target: '2' }
					},					
					{ // edge 2-3
					  data: { id: '2-3', source: '2', target: '3' }
					},					
					{ // edge 3-4
					  data: { id: '3-4', source: '3', target: '4' }
					},	
					{ // edge 4-5
					  data: { id: '4-5', source: '4', target: '5' }
					},					
					{ // edge 5-3
					  data: { id: '5-3', source: '5', target: '3', label: 'Iterations' }
					},					
					{ // edge 5-6
					  data: { id: '5-6', source: '5', target: '6' }
					},					
					{ // edge 6-7
					  data: { id: '6-7', source: '6', target: '7' }
					},					
					{ // edge 7-8
					  data: { id: '7-8', source: '7', target: '8' }
					},					
					{ // edge 8-9
					  data: { id: '8-9', source: '8', target: '9' }
					},					
					{ // edge 9-3
					  data: { id: '9-3', source: '9', target: '3', label:'Non' }
					},					
					{ // edge 9-10
					data: { id: '9-10', source: '9', target: '10', label:'Oui'}
					},					
					{ // edge 10-11
					data: { id: '10-11', source: '10', target: '11' }
					},					
					{ // edge 11-12
					data: { id: '11-12', source: '11', target: '12' }
					},					
					{ // edge 12-11
					data: { id: '12-11', source: '12', target: '11' }
					},					
					{ // edge 12-13
					data: { id: '12-13', source: '12', target: '13' }
					},					
					{ // edge 13-11
					data: { id: '13-11', source: '13', target: '11', label:'Non' }
					},					
					{ // edge 13-14
					data: { id: '13-14', source: '13', target: '14', label:'Oui' }
					},					
					{ // edge 14-15
					data: { id: '14-15', source: '14', target: '15' }
					},					
					{ // edge 15-16
					data: { id: '15-16', source: '15', target: '16' }
					},					
					{ // edge 16-17
					data: { id: '16-17', source: '16', target: '17' }
					},					
					{ // edge 17-18
					data: { id: '17-18', source: '17', target: '18' }
					},					
					{ // edge 18-19
					data: { id: '18-19', source: '18', target: '19' }
					},					
					{ // edge 19-20
					data: { id: '19-20', source: '19', target: '20' }
					},					
					{ // edge 20-21
					data: { id: '20-21', source: '20', target: '21' }
					}
				  ],

				  style: [ // the stylesheet for the graph
					{
					  selector: 'node[type="common"]',
					  style: {					
						'label': 'data(label)',						
						'font-size':'9rem'
					  }
					},
					{
					  selector: 'node[type="check"]',
					  style: {
						'background-color': '#dc3545',
						'label': 'data(label)',
						'shape': 'diamond',
						'font-size':'9rem'
					  }
					},{
					  selector: 'node[part="concept"]',
					  style: {
						'background-color': '#e89441'
					  }
					},{
					  selector: 'node[part="project"]',
					  style: {
						'background-color': '#062f6f'
					  }
					},{
					  selector: 'node[part="product"]',
					  style: {
						'background-color': '#28a745'
					  }
					},{
					  selector: 'node[part="goto"]',
					  style: {
						'background-color': '#808000'
					  }
					},{
					  selector: 'node[part="juri"]',
					  style: {
						'background-color': '#F3E5AB'
					  }
					},					
					{
					  selector: 'edge',
					  style: {
						'width': 1,
						'line-color': '#d0eef5',
						'target-arrow-color': '#343a40',
						'curve-style':'segments',
						'target-arrow-shape': 'triangle',
						'label': 'data(label)',
						'font-size':'8rem'
					  }
					},					
					{
					  selector: 'edge[label="Oui"]',
					  style: {
						'line-color':'#254117'
					  }
					},					
					{
					  selector: 'edge[label="Non"]',
					  style: {
						'line-color':'#F70D1A'
					  }
					}
				  ],
				fit: true,
				animate: true,
				  layout: {
					name: 'grid',
					rows: 8
			}});
  		},
  		error => {
			this.loginService.sendLoginEvent(false);
  			this.router.navigate(['/login']);
  		}
  	);		  

  }

}
