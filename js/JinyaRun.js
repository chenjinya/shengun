function jumpForum(fname){
		var call_native = "";
		if (/android/i.test(navigator.userAgent)){
    // todo : android
			call_native = "http://127.0.0.1:6257/sendintent?intent=%23Intent%3Baction%3Dcom.baidu.tieba.VIEW%3BlaunchFlags%3D0x10000000%3Bcomponent%3Dcom.baidu.tieba%2F.service.WebNativeReceiver%3BS.fname%3D"+fname+"%3BS.type%3Dfrs%3BS.from%3D%3Bend&t=1398839995246&callback=__jsonp2955"
		}

		else if (/ipad|iphone|mac/i.test(navigator.userAgent)){
		// todo : ios
			//call_native = "com.baidu.tieba://jumptoforum?tname="+fname;
			call_native = "http://tieba.baidu.com/f?kw="+fname;
			
		}else{
		
			call_native = "http://tieba.baidu.com/f?kw="+fname;
		}
		window.location.href = call_native;
	}
(function(){
    // for apple touchmove window
    document.addEventListener("touchmove",function(e){
        e.preventDefault();  
    })
	var call_native = ""
	
	
    window.requestAnimationFrame = (function(){
        return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function(/* function */ callback, /* DOMElement */ element){
          window.setTimeout(callback, 1000 / 60);
        };
      })();
    imgUrl = "http://chenjinya.cn/shengun/img/avatar.png";
    lineLink = "http://chenjinya.cn/shengun/index.html";
    descContent = '关于"棍状物"的羞羞测试';
    shareTitle = '百度贴吧-关于「棍状物」的羞羞的小测试';
    appid = '';
    var JinyaRun = function(){
        this.constuctor();
    };
    JinyaRun.prototype={
        x:0,
        y:0,
        timeLimit:300,//计时30秒
        resources:[],
        restTime:0,
        runTime:0,
        startFlag:false,
        canTouch:true,
        backgroundColor:[
            [62,62,62],
            [235,235,235]
        ],
        forumsColor:[
          "#e04c34","#52c47a","#f0c000","#fe9333","#e24aab","#1fc2cc","#a7c51c"
        ],
        backgroundColorIndex:0,
        canDeal:false,
        constuctor:function(){

            this.stage = $("#gameStage");

            this.timeCounter = $("#leftCounter");
            this.rightCounter = $("#rightCounter")
            this.dialog = $("#dialog");

            this.init();
        },
        init:function(){
            this.fullWindow();
            this.initResources();
            this.bindEvent();
        },
        fullWindow:function(){
            this.windowWidth = $(document).width();
            this.windowHeight = $(window).height();
            $("#container").width(this.windowWidth).height(this.windowHeight);
            //不能用.width.height，否则比例拉伸
            this.stage.css({width : this.windowWidth, height: this.windowHeight});

        },
        bindEvent:function(){
            var self = this;
            this.stage.on("click",".j_restart",function(){
                self.restart();
            }).on("click",".j_share",function(){
                    shareTimeline()
            }).on("touchstart",".forbidden_wrap",function(e){
				
                $(".finger_image").remove();
                self.initScan();
				
            }).on("touchstart",".index_image",function(e){
                self.pointer.x = e.touches[0].pageX;
            }).on("touchmove",".index_image",function(e){
                self.pointer._x = e.touches[0].pageX;
            }).on("touchend",".index_image",function(e){
                if(self.pointer._x - self.pointer.x >10)
                    self.showTip();
            });

        },

        initResources:function(){

            var l =  new JinyaLoading();
            var self = this;
            l.loadImage("img/index.gif","index");
            l.loadImage("img/finger.gif","finger");
            l.loadImage("img/back_image.png","background");
            l.loadImage("img/egun.png","egun");
            l.loadImage("img/yingun.png","yingun");
            l.loadImage("img/shengun.png","shengun");
            l.loadImage("img/shuangjiegun.png","shuangjiegun");
            l.loadImage("img/scan.png","scan");

            l.loadProcess(function(i,c){
                $("#Jinya_loading_process_body").css("width",100*(i/c).toFixed(1)+"%");
                $("#Jinya_loading_process_body").html(100*(i/c).toFixed(1)+"%");
            });
            l.loadDone (function(s){
                self.resources = s;

                $("#Jinya_loading_process_wrap").hide();
                self.initIndex();

            })


        },

        initIndex:function(){
            var self = this;
            this.gunArray = [];
			self.canTouch = true;
            this.gunArray.push({image:this.resources["egun"].image,text:"该物体鉴定为恶棍",forums:["伪摇","狗肉节","狮子"]});
            this.gunArray.push({image:this.resources["shengun"].image,text:"该物体鉴定为神棍",forums:["弱智儿童拘留所","民科","sy后遗症治疗"]});
            this.gunArray.push({image:this.resources["yingun"].image,text:"该物体鉴定为淫棍",forums:["一剑浣春秋","美人","送资源"]});
            this.gunArray.push({image:this.resources["shuangjiegun"].image,text:"该物体鉴定为双节棍",forums:["熊","军恋","忽然之间"]});
            /*双截棍：搞基：熊吧、军恋吧、忽然之间吧

             淫棍：福利：一剑玩春秋吧、乳此美人吧、送资源吧

             恶棍：消遣：伪摇吧、狗肉节吧、狮子吧

             神棍：猎奇：弱智儿童拘留所吧、民科吧、sy后遗症治疗吧

             */
            this.stage.css({background:"rgb("+this.backgroundColor[0].join(",")+")"})
            var indexImage = this.resources["index"].image;
            indexImage = this.resizeImage(indexImage);
            this.work = {};
            this.work.top =(this.windowHeight-indexImage.height)/2;
			this.work.left = (this.windowWidth-indexImage.width)/2;
             $(indexImage).addClass("index_image").css({top:this.work.top,left:this.work.left})
            this.stage.append(indexImage);
            this.pointer = {x:0,y:0};

        },

        finger:{},
        showTip:function(){
            var self = this;
            this.stage.append("<div class='forbidden_wrap'></div>");
            this.stage.css({background:"rgb("+this.backgroundColor[1].join(",")+")"})


                var backImage = this.resources["background"].image;
                backImage = this.resizeImage(backImage);
                $(backImage).addClass("back_image").css({top:this.work.top,left:this.work.left})
                this.stage.append(backImage);


                var fingerImage = this.resources["finger"].image;
                fingerImage = this.resizeImage(fingerImage );
                $(fingerImage).addClass("finger_image").css({top:this.work.top,left:this.work.left});
                this.stage.append(fingerImage);


            $(".index_image").remove();

        },

        initScan:function(){
			if(this.canTouch == false ) return;
			
			this.canTouch = false;
            var self = this;
            var scanImage =this.resizeImage(this.resources["scan"].image);
            this. scan={};
            this.scan.y = - scanImage.height;
            var $scanImage = $(scanImage)
            $scanImage.addClass("scan_image").css({top:0});
            this.stage.append($scanImage);
            this.scanTime = 0;
            var speed =700;
            function scroll(dr){
                if(self.scanTime < 8){
                    if(dr == true){
                        $scanImage.animate({top:self.windowHeight- $scanImage[0].height},speed,"ease",function(){ scroll(false)})
                    }else{
                        $scanImage.animate({top:$scanImage[0].height},speed,"ease",function(){ scroll(true)})
                    }
                     self.scanTime++;

                }else{
                    self.end();
                }
            }
            scroll(true)

        },
        resizeImage:function(image,scale){
                if(!image){
                    return;
                }
                if(!scale) scale=1
                var _scale = image.width/image.height;
            if(this.windowWidth / this.windowHeight > _scale){
                image.height =this.windowHeight*scale;
                image.width =image.height*_scale;

            }else{
                image.width =this.windowWidth*scale;
                image.height =image.width/_scale;
            }
            return image



        },

        start:function(){

            this.initEnv();



        },
        initEnv:function(){
            this.startFlag = true;
            this.runTime =0;
            this.restTime=0;
            this.canDeal = false;
            this.canTouch = true;

        },
        restart:function(){
            this.initEnv();

            this.stage.find(".random_forums").html("");
           $("#buttonWrap").hide();
            $(".result_image").remove();
            this.showTip();


        },
        end:function(){
            var self = this;
            this.startFlag = false;
          // setTimeout(function(){
                self.endAction()

          //  },1000);

        },
        endAction:function(){
            $(".forbidden_wrap").remove();
            this.stage.css({background:"rgb("+this.backgroundColor[0].join(",")+")"})

            this.stage.find(".scan_image").remove();
            this.gunIndex = Math.floor(Math.random()*4);
            var resultImage = this.gunArray[this.gunIndex].image;
            shareTitle = "百度贴吧-关于「棍状物」的小测试，"+this.gunArray[this.gunIndex].text;
            resultImage = this.resizeImage(resultImage);

            $(resultImage).addClass("result_image").css({top:this.work.top,left:this.work.left})
            this.stage.append(resultImage);
            var forums_html = "";
            var forums_color =0;
            for(var i =0; i<this.gunArray[this.gunIndex].forums.length; i++){

                forums_html+='<a onclick="_hmt.push([\'_trackEvent\', \'forum_jump\', \'click\',\' '+this.gunArray[this.gunIndex].forums[i]+'\']); jumpForum(\''+this.gunArray[this.gunIndex].forums[i]+'\');"  style="background: '+this.forumsColor[forums_color]+'">'+this.gunArray[this.gunIndex].forums[i]+'吧</a>';
                forums_color =Math.floor(Math.random()*this.forumsColor.length);
            }

            this.stage.find(".random_forums").html(forums_html).show().css({top:this.work.top+resultImage.height*450/590});
            this.stage.find(".back_image").remove();
            $("#buttonWrap").show().css({top:this.work.top+resultImage.height*516/590});



        }



    };

    window.Game =new JinyaRun();
})();
//=============weixin
    