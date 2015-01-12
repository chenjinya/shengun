/**
 * Created by jinyachen on 14/10/24.
 */
var JinyaScene = function(){
    this.constructor()

};
JinyaScene.prototype={
    index:0,
    count:0,
    stack:[],
    loadDoneCallback:function(){},
    loadProcessCallback:function(){},
    constructor:function(){
        this.console("Init Loading")
    },
    loadImage:function(url,callback){

        this.count++;
        this.console("Loading "+url)
        this.stack.push({key:this.index,value:url,done:0,image:null});
        var img =new Image();
        var self = this;
        img.src = url;
        img.onload = function() {
            self._loadDone(img,callback)
        };
    },
    loadImageGroup:function(imageArray){
        for ( var imageArrayIndex =0 ; imageArrayIndex < imageArray.length; imageArrayIndex++){
            this.loadImage(imageArray[i]);
        }
    },
    _loadDone:function(img,callback){
        this.index++;
        for( var i=0; i< this.stack.length; i++){
            if(img.src == this.stack[i].value){
                this.stack[i].done = 1;
                this.stack[i].image = img;
            }
        }
        callback && callback(img,this.index,this.count);
        if(this.index === this.count){
            this.loadDoneCallback(this.stack,this.count);
        }
        this._loadProcess();
    },
    loadDone:function(callback){
        this.loadDoneCallback=callback
    },
    _loadProcess:function(){
        console && console.log(this.index+"/"+this.count);
        this.loadProcessCallback(this.index,this.count)
    },
    loadProcess:function(callback){
        this.loadProcessCallback = callback;
    },
    console:function(){
        console && console.log(arguments);
    }
}