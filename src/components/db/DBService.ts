import {ExecTimeService as execTime} from '../exec-time/service';
import {remote} from '../electron/electron';
import project = require('../project/project');
var  Datastore =  remote.require('nedb');
import fs = require('fs');
import nPath = require('path');
export class DBService{
  db:any
  constructor(){
    execTime.step('db.DBService init')
    this.db = new Datastore({ filename: nPath.join(project.currentProjectPath,'.IDE/tmp.db'), autoload: true });
  }

  getDb(){
    return this.db;
  }
}
