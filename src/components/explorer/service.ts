import {ExecTimeService as execTime} from '../exec-time/service';
import project = require('../project/project');
import ng = require('angular2/angular2');
import {DBService} from '../db/DBService';

import fs = require('fs');

import nPath = require('path');
import {remote} from '../electron/electron';
var  Datastore =  remote.require('nedb');
export class ExplorerService{
  private data;
  hideFileTypeList:Array<string> = [];
  fileTypeList:Array<string> = [];
  dbService:DBService;
  constructor(@ng.Inject(DBService) dbService:DBService){
    execTime.step('explorer.ExplorerService init');
    this.dbService = dbService;
  }

  isUnExpect(item){
    var unExpectList = ['node_modules','build','game.js','game_all.js','dist','Engine','git'];
    if(item[0] == '.'){
      return true;
    }

    if(unExpectList.indexOf(item)>-1){
      return true;
    }
  }



  getFileTreeByPath(path,deep?:number,unExpectList?:Array<string>){

      var dirList = fs.readdirSync(path);
      var dataList = [];
      dirList.forEach((item)=>{
        if(!this.isUnExpect(item)){
          var p = path + '/' + item;
          var is_dir = fs.statSync(p).isDirectory();
          var data = {
            name:item,
            path:p,
            is_dir:is_dir,
            children:[]
          }

          if(is_dir && deep && deep<2){
            data.children = this.getFileTreeByPath(p,deep+1);
          }

          if(!is_dir){
            var fileType = item.split('.').pop();
            if(this.fileTypeList.indexOf(fileType) == -1){
              this.fileTypeList.push(fileType);
            }
          }

          dataList.push(data);
        }

      })

      var finalList = [];
      for(let i in dataList){
        let d = dataList[i];
        if(d.is_dir){
          finalList.push(d);
        }
      }
      for(let i in dataList){
        let d = dataList[i];
        if(!d.is_dir){
          finalList.push(d);
        }
      }

      return finalList;
    }


  getExplorerDataAsync(callback:Function){
    execTime.step('getExplorerDataAsync..');

    var path = project.currentProjectPath;
    var db = this.dbService.getDb();

    if(path){

      db.find({key:'explorer.root'},(err,docs)=>{

        // if(docs && docs[0] && docs[0].value && docs[0].value.name){
        //   console.log('success load project tree from db');
        //   this.data = docs[0].value;
        //   console.log(this.data);
        // }else{
          var tree = {
            name:'Explorer',
            path:path,
            is_dir:true,
            children:this.getFileTreeByPath(path)
          };
          this.data = tree;
          db.insert({
            key:'explorer.root',
            value:tree
          },(err)=>{
            if(!err){
              console.log('success save project tree to db');
            }else{
              throw err;
            }
          })
        //}

        callback(this.data);
      })

    }


  }

  getDataAsync(callback:Function){
    this.getExplorerDataAsync((root)=>{
      this.data = {
        root:root,
        hideFileTypeList:this.hideFileTypeList,
        fileTypeList:this.fileTypeList
      };
      callback(this.data)
    });
  }

  openDir(ev){
    ev.children = this.getFileTreeByPath(ev.path);
  }

  getHideFileTypeList(){
    return this.hideFileTypeList;
  }

  updateHideFileTypeList(hideFileTypeList){
    console.log(hideFileTypeList);
    this.data.hideFileTypeList = hideFileTypeList;
  }

  getFileTypeList(){
    return this.fileTypeList;
  }

}
