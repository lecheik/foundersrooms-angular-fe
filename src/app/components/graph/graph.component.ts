import { Component, OnInit, ViewEncapsulation  } from '@angular/core';
import * as shape from 'd3-shape';
import { colorSets } from '../../utils/color-sets';
import { countries, generateHierarchialGraph, getTurbineData } from '../../utils/data';
import chartGroups from '../../utils/chartTypes';
import { id } from '../../utils/id';
import { Title } from '@angular/platform-browser';
import { LoginService } from '../../services/login.service';
import {Params, ActivatedRoute, Router} from '@angular/router';
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {


  theme = 'dark';
  chartType = 'directed-graph';
  chartGroups: any;
  chart: any;
  realTimeData: boolean = false;
  countries: any[];
  graph: { links: any[], nodes: any[] };
  hierarchialGraph: { links: any[], nodes: any[] };

  view: any[];
  width: number = 700;
  height: number = 300;
  fitContainer: boolean = true;
  autoZoom: boolean = false;
  panOnZoom: boolean = true;
  enableZoom: boolean = true;

  // options
  showLegend = false;
  orientation: string = 'LR'; // LR, RL, TB, BT

  orientations: any[] = [
    {
      label: 'Left to Right',
      value: 'LR'
    }, {
      label: 'Right to Left',
      value: 'RL'
    }, {
      label: 'Top to Bottom',
      value: 'TB'
    }, {
      label: 'Bottom to Top',
      value: 'BT'
    }
  ];
  // line interpolation
  curveType: string = 'Linear';
  curve: any = shape.curveStepBefore;
  interpolationTypes = [
    'Bundle', 'Cardinal', 'Catmull Rom', 'Linear', 'Monotone X',
    'Monotone Y', 'Natural', 'Step', 'Step After', 'Step Before'
  ];

  colorSets: any;
  colorScheme: any;
  schemeType: string = 'ordinal';
  selectedColorScheme: string;

  constructor(private titleService:Title,private router:Router,private loginService:LoginService) { 
      Object.assign(this, {
      countries,
      colorSets,
      chartGroups,
      hierarchialGraph: generateHierarchialGraph(),
    });
	
    this.setColorScheme('picnic');
    this.setInterpolationType('Bundle');
	//this.realTimeData=true;
//this.updateData();	
	this.toggleFitContainer(true,true);
	this.curve = shape.curveCardinal;
	//this.toggleEnableZoom(false);
	this.updateNodeColors();
	this.view = [1000, this.height];
	//$("#2").d3Click();
	
  }

  updateNodeColors(){
	console.log(this.hierarchialGraph);
	
  }
  
  ngOnInit() {

	this.titleService.setTitle("Project Workflow");
    this.loginService.checkSession().subscribe(
  		res => {
			this.loginService.sendLoginEvent(true);
  		},
  		error => {
			this.loginService.sendLoginEvent(false);
  			this.router.navigate(['/login']);
  		}
  	);	  
    this.selectChart(this.chartType);

    //setInterval(this.updateData.bind(this), 1000);
	//this.updateData();

    if (!this.fitContainer) {
      this.applyDimensions();
    }	  
  }
  
  updateData() {
	  
    if (!this.realTimeData) {
      return;
    }

    const country = this.countries[Math.floor(Math.random() * this.countries.length)];
    const add = Math.random() < 0.7;
    const remove = Math.random() < 0.5;

    if (add) {
      // directed graph

      const hNode = {
        id: id(),
        label: country
      };

      this.hierarchialGraph.nodes.push(hNode);

      this.hierarchialGraph.links.push({
        source: this.hierarchialGraph.nodes[Math.floor(Math.random() * (this.hierarchialGraph.nodes.length - 1))].id,
        target: hNode.id,
        label: 'on success'
      });

      this.hierarchialGraph.links = [...this.hierarchialGraph.links];
      this.hierarchialGraph.nodes = [...this.hierarchialGraph.nodes];
    }
  }

  applyDimensions() {
    this.view = [this.width, this.height];
  }

  toggleEnableZoom(enableZoom: boolean) {
    this.enableZoom = enableZoom;
  }

  toggleFitContainer(fitContainer: boolean, autoZoom: boolean): void {
    this.fitContainer = fitContainer;
    this.autoZoom = autoZoom;

    if (this.fitContainer) {
      this.view = undefined;
    } else {
      this.applyDimensions();
    }
  }

  selectChart(chartSelector) {
    this.chartType = chartSelector;

    for (const group of this.chartGroups) {
      for (const chart of group.charts) {
        if (chart.selector === chartSelector) {
          this.chart = chart;
          return;
        }
      }
    }
  }

  select(data) {
	//d3.select('#9').dispatch('click');  
    //console.log('Item clicked', data);
	//console.log($('#grap'));
	//data.options.color='#00b862';
	//$('#modalflow').modal('show');
  }

  setColorScheme(name) {
    this.selectedColorScheme = name;
    this.colorScheme = this.colorSets.find(s => s.name === name);
  }

  setInterpolationType(curveType) {
    this.curveType = curveType;
    if (curveType === 'Bundle') {
      this.curve = shape.curveBundle.beta(1);
    }
    if (curveType === 'Cardinal') {
      this.curve = shape.curveCardinal;
    }
    if (curveType === 'Catmull Rom') {
      this.curve = shape.curveCatmullRom;
    }
    if (curveType === 'Linear') {
      this.curve = shape.curveLinear;
    }
    if (curveType === 'Monotone X') {
      this.curve = shape.curveMonotoneX;
    }
    if (curveType === 'Monotone Y') {
      this.curve = shape.curveMonotoneY;
    }
    if (curveType === 'Natural') {
      this.curve = shape.curveNatural;
    }
    if (curveType === 'Step') {
      this.curve = shape.curveStep;
    }
    if (curveType === 'Step After') {
      this.curve = shape.curveStepAfter;
    }
    if (curveType === 'Step Before') {
      this.curve = shape.curveStepBefore;
    }
  }

  onLegendLabelClick(entry) {
    console.log('Legend clicked', entry);
  }

  toggleExpand(node) {
    console.log('toggle expand', node);
  }  

}
