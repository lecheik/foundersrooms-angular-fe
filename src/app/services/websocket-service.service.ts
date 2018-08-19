import { Injectable } from '@angular/core';
import {AppConst} from '../constants/app-const';


//var SockJs = require("sockjs-client");
import * as SockJs from 'sockjs-client';
//var Stomp = require("stompjs");

import * as Stomp from 'stompjs';


@Injectable()
export class WebsocketServiceService {

  private serverPath: string = AppConst.serverPath;
  constructor() { }
    public connect() {
        let socket = new SockJs(this.serverPath+"/ws");

        let stompClient = Stomp.over(socket);

        return stompClient;
    }
}
