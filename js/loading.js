/**
 * Created by jinyachen on 14/10/24.
 *
 *
 *  var l =  new JinyaLoading();
 *  l.loadImage("http://www.gangqinpuzi.com/uploads/musicscores/1412646377/0.jpg","name1");
 *  l.loadImage("http://www.gangqinpuzi.com/images/piano_nav.png","ame2")
 *  l.loadImageGroup([...]);
 *  l.loadProcess(function(i,c){
 *      console.log(arguments)
 *      $("#Jinya_loading_process_body").css("width",100*(i/c)+"%");
 *      $("#Jinya_loading_process_body").html(100*(i/c)+"%");
 *  });
 *  l.loadDone (function(s){console.log(s,"mem")})
 */

var JinyaLoading = function(){
    this.constructor()

};
JinyaLoading.prototype={
    index:0,
    count:0,
    stack:{},
    loadDoneCallback:function(){},
    loadProcessCallback:function(){},
    constructor:function(){
        this.console("Init Loading");

    },
    loadImage:function(url,name,callback){

        this.count++;
        this.console("Loading "+url)
        var img =new Image();
        var self = this;

        img.src = url;
        this.stack[name || this.count]=({key:this.index,name:name,src:img.src,done:0,image:null});
        img.onload = function() {
            self._loadDone(img,callback)
        };
    },
    loadImageGroup:function(imageArray){
        for ( var imageArrayIndex =0 ; imageArrayIndex < imageArray.length; imageArrayIndex++){
            this.loadImage(imageArray[i].url,imageArray[i].name,imageArray[i].callback || function(){});
        }
    },
    _loadDone:function(img,_callback){
        this.index++;
        var self = this;
        for( var i in  this.stack){
            if(img.src ==this.stack[i].src){
                this.stack[i].done = 1;
                this.stack[i].image = img;
                break;
            }
        }
        _callback && _callback(img,this.index,this.count);
        this._loadProcess();
        if(this.index === this.count){
            //all done

            setTimeout(function(){
                self .loadDoneCallback(self .stack,self .count);
            },1000)

        }

    },
    loadDone:function(callback){
        this.loadDoneCallback=callback
    },
    _loadProcess:function(){
        this.console(this.index+"/"+this.count);
        this.loadProcessCallback(this.index,this.count)
    },
    loadProcess:function(callback){
        this.loadProcessCallback = callback;
    },
    console:function(){
        console && console.log("JinyaProcess:",arguments);
    }
}

/*
*  example css process
* <style>
 .Jinya_orange{
 background: #f2b63c;
 border-color: #f0ad24 #eba310 #c5880d;
 background-image: -webkit-linear-gradient(top, #f8da9c 0%, #f5c462 70%, #f2b63c 100%);
 background-image: -moz-linear-gradient(top, #f8da9c 0%, #f5c462 70%, #f2b63c 100%);
 background-image: -o-linear-gradient(top, #f8da9c 0%, #f5c462 70%, #f2b63c 100%);
 background-image: linear-gradient(to bottom, #f8da9c 0%, #f5c462 70%, #f2b63c 100%);
 }
 .Jinya_process{
 -webkit-transition: width .4s ease-in-out;
 -moz-transition: width .4s ease-in-out;
 -ms-transition: width .4s ease-in-out;
 -o-transition: width .4s ease-in-out;
 transition: width .4s ease-in-out;
 }
 .Jinya_stripes{
 -webkit-background-size: 30px 30px;
 -moz-background-size: 30px 30px;
 background-size: 30px 30px;
 background-image: -webkit-gradient(linear, left top, right bottom,
 color-stop(.25, rgba(255, 255, 255, .15)), color-stop(.25, transparent),
 color-stop(.5, transparent), color-stop(.5, rgba(255, 255, 255, .15)),
 color-stop(.75, rgba(255, 255, 255, .15)), color-stop(.75, transparent),
 to(transparent));
 background-image: -webkit-linear-gradient(135deg, rgba(255, 255, 255, .15) 25%, transparent 25%,
 transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%,
 transparent 75%, transparent);
 background-image: -moz-linear-gradient(135deg, rgba(255, 255, 255, .15) 25%, transparent 25%,
 transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%,
 transparent 75%, transparent);
 background-image: -ms-linear-gradient(135deg, rgba(255, 255, 255, .15) 25%, transparent 25%,
 transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%,
 transparent 75%, transparent);
 background-image: -o-linear-gradient(135deg, rgba(255, 255, 255, .15) 25%, transparent 25%,
 transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%,
 transparent 75%, transparent);
 background-image: linear-gradient(135deg, rgba(255, 255, 255, .15) 25%, transparent 25%,
 transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%,
 transparent 75%, transparent);
 -webkit-animation: Jinya_animate-stripes 3s linear infinite;
 -moz-animation: Jinya_animate-stripes 3s linear infinite;
 }
 @-webkit-keyframes Jinya_animate-stripes {
 0% {background-position: 0 0;} 100% {background-position: 60px 0;}
 }
 @-moz-keyframes Jinya_animate-stripes {
 0% {background-position: 0 0;} 100% {background-position: 60px 0;}
 }
 .Jinya_gray{
 background-image: -webkit-linear-gradient(top, #f0f0f0 0%, #dbdbdb 70%, #cccccc 100%);
 background-image: -moz-linear-gradient(top, #f0f0f0 0%, #dbdbdb 70%, #cccccc 100%);
 background-image: -o-linear-gradient(top, #f0f0f0 0%, #dbdbdb 70%, #cccccc 100%);
 background-image: linear-gradient(to bottom, #f0f0f0 0%, #dbdbdb 70%, #cccccc 100%);
 -webkit-box-shadow: inset 0 1px rgba(255, 255, 255, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2);
 }
 #Jinya_loading_process_wrap{
 position: absolute;

 top:0;
 bottom:0;
 left:0;
 right:0;
 margin: auto;
 width:80%;
 height:40px;
 }
 #Jinya_loading_process_tip{text-align: center; margin-bottom:4px;}
 #Jinya_loading_process_background{
 background: #ebebeb;
 border-left: 1px solid transparent;
 border-right: 1px solid transparent;
 border-radius: 10px;
 position: absolute;
 width:100%;
 height:20px;}
 #Jinya_loading_process_body{
 width:0px;
 border-radius: inherit;
 height:20px;
 line-height: 20px;
 font-size:12px;
 text-align: center;
 box-shadow: inset 0 1px rgba(255, 255, 255, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2);
 }
 </style>

 <div id="Jinya_loading_process_wrap">
 <div id="Jinya_loading_process_tip">加载中...</div>
 <div id="Jinya_loading_process_background">
 <div id="Jinya_loading_process_body" class="Jinya_stripes Jinya_process Jinya_orange"></div>
 </div>
 </div>
* */