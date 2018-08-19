import { id } from '../utils/id';
//import * as tasks from '../../data/turbine.json';

const tasks={
  "name": "get_twitter_test_ioc_post_slack",
  "version": "1.0",
  "trigger": {
    "type": "schedule",
    "cron": "* 1 * * * *"
  },
  "tasks": {
    "get_twitter_post": {
      "type": "lib",
      "runner_type": "python",
      "action": "turbine_twitter.get_time_line",
      "retries": 2,
      "params": {
        "asset": "twitter",
        "inputs": {
          "count": 50
        }
      },
      "publish": {
        "pipe": "result"
      },
      "on-success": [
        "get_url_from_text"
      ]
    },
    "get_instagram_post": {
      "type": "lib",
      "runner_type": "python",
      "action": "turbine_intsagram.get_time_line",
      "retries": 2,
      "params": {
        "asset": "instagram",
        "inputs": {
          "count": 50
        }
      },
      "publish": {
        "pipe": "result"
      },
      "on-success": [
        "get_ioc_tc"
      ]
    },
    "get_url_from_text": {
      "type": "lib",
      "runner_type": "python",
      "action": "turbine_pipe.extract_value",
      "retries": 2,
      "params": {
        "inputs": {
          "mask": "([0-9]{1,3}\\.){3}[0-9]{1,3}"
        },
        "map": {
          "get_twitter_post.text": "text"
        }
      },
      "publish": {
        "pipe": "result"
      },
      "on-success": [
        "get_ioc_tc"
      ]
    },
    "get_ioc_tc": {
      "type": "lib",
      "runner_type": "python",
      "action": "turbine_threat_connect.get_ioc_batch",
      "retries": 2,
      "params": {
        "asset": "threat_connect",
        "inputs": {
          "owner": "Common Community"
        },
        "pipe": null,
        "map": {
          "get_url_from_text.value": "indicator"
        }
      },
      "publish": {
        "pipe": "result"
      },
      "on-success": [
        "render_message"
      ],
      "on-error": [
        "post_to_slack"
      ]
    },
    "render_message": {
      "type": "lib",
      "runner_type": "python",
      "retries": 2,
      "action": "turbine_pipe.render_template",
      "params": {
        "inputs": {
          "template": "TC reports {{name}} is {{description}}. Rating {{rating}}. {{url}}"
        },
        "map": {
          "get_ioc_tc.name": "name",
          "get_ioc_tc.description": "description",
          "get_ioc_tc.rating": "rating",
          "get_ioc_tc.url": "url"
        }
      },
      "publish": {
        "pipe": "result"
      },
      "on-success": [
        "post_to_slack"
      ]
    },
    "post_to_slack": {
      "type": "lib",
      "runner_type": "python",
      "retries": 2,
      "action": "turbine_slack.post_messages",
      "params": {
        "asset": "slack",
        "inputs": {
          "channel": "#turbine"
        },
        "map": {
          "render_message.value": "message"
        }
      }
    }
  }
};

export const countries = [
  'Abkhazia', 'Afghanistan', 'Akrotiri and Dhekelia', 'Aland', 'Albania',
  'Algeria', 'American Samoa', 'Andorra', 'Angola', 'Anguilla',
  'Antigua and Barbuda', 'Argentina', 'Armenia', 'Aruba', 'Ascension Island',
  'Australia', 'Austria', 'Azerbaijan', 'Bahamas, The', 'Bahrain', 'Bangladesh',
  'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan',
  'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei',
  'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Canada',
  'Cape Verde', 'Cayman Islands', 'Central Africa Republic', 'Chad', 'Chile',
  'China', 'Christmas Island', 'Cocos (Keeling) Islands', 'Colombia', 'Comoros',
  'Congo', 'Cook Islands', 'Costa Rica', 'Cote d\'lvoire', 'Croatia', 'Cuba',
  'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica',
  'Dominican Republic', 'East Timor Ecuador', 'Egypt', 'El Salvador',
  'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Falkland Islands',
  'Faroe Islands', 'Fiji', 'Finland', 'France', 'French Polynesia', 'Gabon',
  'Cambia, The', 'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Greece',
  'Greenland', 'Grenada', 'Guam', 'Guatemala', 'Guemsey', 'Guinea',
  'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hong Kong', 'Hungary',
  'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Isle of Man',
  'Israel', 'Italy', 'Jamaica', 'Japan', 'Jersey', 'Jordan', 'Kazakhstan',
  'Kenya', 'Kiribati', 'Korea, N', 'Korea, S', 'Kosovo', 'Kuwait', 'Kyrgyzstan',
  'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein',
  'Lithuania', 'Luxembourg', 'Macao', 'Macedonia', 'Madagascar', 'Malawi',
  'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania',
  'Mauritius', 'Mayotte', 'Mexico', 'Micronesia', 'Moldova', 'Monaco',
  'Mongolia', 'Montenegro', 'Montserrat', 'Morocco', 'Mozambique', 'Myanmar',
  'Nagorno-Karabakh', 'Namibia', 'Nauru', 'Nepal', 'Netherlands',
  'Netherlands Antilles', 'New Caledonia', 'New Zealand', 'Nicaragua', 'Niger',
  'Nigeria', 'Niue', 'Norfolk Island', 'Northern Cyprus',
  'Northern Mariana Islands', 'Norway', 'Oman', 'Pakistan', 'Palau',
  'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines',
  'Pitcaim Islands', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Romania',
  'Russia', 'Rwanda', 'Sahrawi Arab Democratic Republic', 'Saint-Barthelemy',
  'Saint Helena', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Martin',
  'Saint Pierre and Miquelon', 'Saint Vincent and Grenadines', 'Samos',
  'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia',
  'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia',
  'Solomon Islands', 'Somalia', 'Somaliland', 'South Africa', 'South Ossetia',
  'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Svalbard', 'Swaziland', 'Sweden',
  'Switzerland', 'Syria', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo',
  'Tokelau', 'Tonga', 'Transnistria', 'Trinidad and Tobago', 'Tristan da Cunha',
  'Tunisia', 'Turkey', 'Turkmenistan', 'Turks and Caicos Islands', 'Tuvalu',
  'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom',
  'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City',
  'Venezuela', 'Vietnam', 'Virgin Islands, British', 'Virgin Islands, U.S.',
  'Wallis and Futuna', 'Yemen', 'Zambia', 'Zimbabwe'
];

export function generateGraph(nodeCount: number) {
  const nodes = [];
  const links = [];
  for (let i = 0; i < nodeCount; i++) {
    const country = countries[Math.floor(Math.random() * countries.length)];
    nodes.push({
      id: id(),
      value: country,
    });
    for (let j = 0; j < nodes.length - 1; j++) {
      if (Math.random() < 0.03) {
        links.push({
          source: nodes[i].id,
          target: nodes[j].id,
        });
      }
    }
  }
  return { links, nodes };
}

export function generateHierarchialGraph() {
  const nodes = [{
    id: 'start',
    label: 'PROPOSITION DE VALEUR'
  }, {
    id: '1',
    label: 'BUSINESS MODEL',
    rank: 'first'
  }, {
    id: '2',
    label: 'ETUDE DU MARCHE',
    rank: 'first'
  }, {
    id: '3',
    label: 'DETAILS DES BESOINS',
    rank: 'first'
  }, {
    id: '4',
    label: 'DETAILS DES RESSOURCES'
  }, {
    id: '5',
    label: 'PROJET FINANCABLE?'
  }, {
    id: '6',
    label: 'DEVELOPPEMENT PRODUIT(MVP)'
  }, {
    id: '7',
    label: 'TESTS ET VALIDATION'
  }, {
    id: '8',
    label: 'PRODUIT OU SERVICE VENDABLE'
  }, {
    id: '9',
    label: 'CONTACT CLIENTELE'
  }, {
    id: '10',
    label: 'COMMUNICATION'
  }, {
    id: '11',
    label: 'COMMERCIALISATION'
  }, {
    id: '12',
    label: 'STRUCTURE JURIDIQUE'
  }, {
    id: '13',
    label: 'STATUTS'
  }, {
    id: '14',
    label: 'IMMATRICULATION'
  }];

  const links = [{
    source: 'start',
    target: '1'
  }, {
    source: '1',
    target: '2'
  }, {
    source: '2',
    target: '1',
	label:'Iterations'
  }, {
    source: '2',
    target: '3'
  }, {
    source: '3',
    target: '4'
  }, {
    source: '4',
    target: '5'
  }, {
    source: '5',
    target: '6',
	label: 'OUI'
  }, {
    source: '5',
    target: '2',
	label: 'NON'
  }, {
    source: '6',
    target: '7',
	label : 'Iterations'
  }, {
    source: '7',
    target: '6',
	label : 'Iterations'
  }, {
    source: '7',
    target: '8'
  }, {
    source: '8',
    target: '6',
	label : 'NON'
  }, {
    source: '8',
    target: '9',
	label : 'OUI'
  }, {
    source: '9',
    target: '10'
  }, {
    source: '10',
    target: '11'
  }, {
    source: '11',
    target: '12'
  }, {
    source: '12',
    target: '13'
  }, {
    source: '13',
    target: '14'
  }];

  return { links, nodes };
}

export function getTurbineData() {
  const nodes = [];
  const links = [];

  for (const key in tasks.tasks) {
    const node = tasks.tasks[key];
    node.id = id();
    node.label = key;

    nodes.push(node);
  }

  for (const node of nodes) {
    if (node['on-success']) {
      for (const label of node['on-success']) {
        const target = nodes.find(n => n.label === label);

        links.push({
          source: node.id,
          target: target.id,
          label: 'on success'
        });
      }
    }

    if (node['on-error']) {
      for (const label of node['on-error']) {
        const target = nodes.find(n => n.label === label);

        links.push({
          source: node.id,
          target: target.id,
          label: 'on error'
        });
      }
    }
  }

  return {nodes, links};
}
