/*
 * @author: suhongtang liurihui
 * @dec: 调起客户端的组件，含安卓（阿拉丁方案）和ios
 * @changelog:
 *     2014-8-13 贴吧app v6.3采取新的阿拉丁吊起端口，且可配置。同时需兼容旧版本，故8月底全量前安卓调起会发两个请求。@pm yangwenhui
 */
var AppStarter = new(function () {
        //规范约定所有native状态均保存在window.app下
        window.app = window.app || {};
        var fn = function () {};
        var self = this;
        var newOpenAppUri;
        var defaultOpts = {
            isIos: false,
            packageName: 'com.baidu.tieba', //如果不是贴吧主客户端，请传入包名
            downloadUrl: 'http://c.tieba.baidu.com/c/s/download/wap', //客户端下载地址，调起不成功时需要
            page: '', //调起跳转页面，PB or FRS
            param: '', //调起跳转页面相应参数，PB的话就传帖子的id，FRS就传吧名
            onFail: null,
            onSucc: null,
            host_only: false,
            locate: '', //客户端推广位置
            currentPage: '', //客户端推广所在页面
        };
        this.bind = function (obj, options) {
            var _this = this,
                opts = options;
            obj.bind('click', function () {
                return function (ev) {
                    ev.preventDefault();
                    _this.triggerAppStarter(opts);
                    return false;
                };
            }());
        };
        this.delegate = function (event, selector, options) {
            var _this = this,
                opts = options;
            $('body').on(event, selector, function () {
                return function (ev) {
                    ev.preventDefault();
                    _this.triggerAppStarter(opts);
                    return false;
                };
            }());
        };
        this.triggerAppStarter = function (opts) {
            /*对于只尝试调起的行为，对百度浏览器、百度app无效*/
            if (!opts.downloadUrl ) {
                _doFail(opts);
                return false;
            }
            (opts.isIos === undefined ? $.os.ios : opts.isIos) ? _bindIos(opts) : _bindAndroid(opts);
        };
        var _doSucc = function (opts) {
            opts.locate = opts.locate ? opts.locate : '调起成功';
            _statist(opts);
            if ($.isFunction(opts.onSucc)) {
                opts.onSucc();
            }
        };
        var _statist = function (opts) {
            
        };
        var _doFail = function (opts) {
            console.log("call fail");
        };
        var _bindAndroid = function (opts) {
            var params;
            switch (opts.page) {
            case "sfrs":
            case "frs":
                params = "S.fname=" + opts.param + ";S.type=frs;";
                break;
            case "spb":
            case "pb":
                params = "S.id=" + opts.param + ";S.type=pb;";
                params += "S.host_only=" + (opts['host_only'] || false) + ";";
                break;
            case "im":
                params = "S.groupid=" + opts.param + ";S.type=groupinfo;";
                break;
            case "livegroup":
                params = "S.groupid=" + opts.param + ";S.type=livegroup;";
                break;
            case "pay":
                params = "S.pay_type=" + opts.param['pay_type'] + ";S.props_id=" + opts.param['props_id'] + ";S.quan_num=" + opts.param['quan_num'] + ";S.is_left=" + opts.param['is_left'] + ";S.props_mon=" + opts.param['props_mon'] + ";S.type=pay;";
                break;
            case "fudaiservice":
                params = "S.barid=" + opts.param['fid'] + ";S.barname=" + opts.param['fname'] + ";S.type=officialba_msg;S.portrait=" + opts.param['favatar'] + ";";
                break;
            case "help":
                params = "S.fid=" + opts.param['fid'] + ";S.fname=" + opts.param['fname'] + ";S.type=officialba_msg";
                break;
                //其他参数暂时无法调起，走fail流程，安卓客户端支持调起首页后此处应改为调起首页
            default:
                params = "";
            }
            if (params != "") {
                params += "S.from=" + (opts['from'] || "") + ";"; /*	吊起的统计*/
                if (opts.packageName != null) {
                    var packageName = $.trim(opts.packageName) ? opts.packageName : 'com.baidu.tieba'; /*传入包名以用于扩展不同包调起功能*/
                } else {
                    var packageName = 'com.baidu.tieba';
                }
                //新版阿拉丁端口为可配置，原来是6269，先尝试用旧版，不成功再用新的
                var new_port = PageUnit.load("app_starter_conf_port");
                newOpenAppUri = 'http://127.0.0.1:6259/sendintent?intent=' + window.encodeURIComponent("#Intent;action=" + packageName +
                     ".VIEW;launchFlags=0x10000000;component=" + packageName + "/.service.WebNativeReceiver;" + params + "end") + '&t=' + (+new Date());
                if(!new_port) {
                    _executeAndroid(function () {
                        _doSucc(opts);
                    }, function () {
                        _doFail(opts);
                    });
                }
                else {
                    var old_port_uri = newOpenAppUri;
                    var new_port_uri = 'http://127.0.0.1:' + new_port + '/sendintent?intent=' + window.encodeURIComponent("#Intent;action=" + packageName +
                         ".VIEW;launchFlags=0x10000000;component=" + packageName + "/.service.WebNativeReceiver;" + params + "end") + '&t=' + (+new Date());         
                    jsonpy({
                        url: old_port_uri,
                        timeout: 400,
                        done: function (data) {
                            (data && data.error == 0) ? _doSucc(opts) : _tryAgain();
                        },
                        fail: _tryAgain
                    });
                    function _tryAgain() {
                        jsonpy({
                            url: new_port_uri,
                            timeout: 1000,
                            done: function (data) {
                                (data && data.error == 0) ? _doSucc(opts) : _doFail(opts);
                            },
                            fail: function(){
                                _doFail(opts);
                            }()
                        });
                    }
                }
            } else {
                _doFail(opts);
                return;
            }
        };
        var _bindIos = function (opts) {
            var params;
            switch (opts.page) {
            case "sfrs":
            case "frs":
                params = "jumptoforum?tname=" + opts.param;
                break;
            case "spb":
            case "pb":
                params = "jumptoforum?kz=" + opts.param;
                break;
            case "im":
                params = "jumptoforum?groupid=" + opts.param + "=groupname=" + opts.groupname;
                break;
            case "help":
                params = "jumptoforum?fid=" + opts.param['fid'] + "=fname=" + opts.param['fname'];
                break;
            case "member":
                params = "jumptoforum?membership=purchase";
                break;
            case "fudaiservice":
                params = "jumptoforum?forumId=" + opts.param['fid'] + "=forumName=" + opts.param['fname'];
                break;
                //首页或者其他参数均跳首页
            default:
                params = "";
            }
            if (opts.packageName != null) {
                var packageName = $.trim(opts.packageName) ? opts.packageName : 'com.baidu.tieba'; /*传入包名以用于扩展不同包调起功能*/
            } else {
                var packageName = 'com.baidu.tieba';
            }
			//com.baidu.tieba://jumptoforum?tname=
            var url = packageName + "://" + params;
            var d = new Date();
            setTimeout(function () {
                if (new Date() - d < 2500) {
                    _doFail(opts);
                }
            }, 2000);
            _doSucc(opts);
            setTimeout(function () {
                document.location.href = url;
            }, 100);
        };
        var _executeAndroid = function (sfn, efn) {
            jsonpy({
                url: newOpenAppUri,
                timeout: 2000,
                done: function (data) {
                    (data && data.error == 0) ? sfn() : efn();
                },
                fail: efn
            });
        };
        /**
         * zepto jsonp 在 安卓4以下版本无法出发404请求的error callback
         */
        var jsonpy = function (o) {
            var param = o;
            // random callback name in window scope
            var name = '__jsonp' + parseInt(Math.random() * 10000, 10),
                // timeout for request (no timeout by default)
                timeout = o.timeout || 2000,
                timeoutId = null,
                script = document.createElement('script'),
                // execution status: null if not executed, 'done' or 'fail'
                status = null,
                // set status to done or fail and set callback args
                // function may be called only once
                setStatus = function (success, data) {
                    if (status) {
                        return;
                    }
                    status = ['fail', 'done'][+success];
                    success && !!param.done && param.done(data);
                    !success && !!param.fail && param.fail(data);
                },
                // build url for request: simply add callback parameter to url
                buildUrl = function () {
                    return o.url + ['?', '&'][+(o.url.indexOf('?') >= 0)] + [encodeURIComponent('callback'), encodeURIComponent(name)].join('=');
                },
                // initialize jsonpy
                init = function () {
                    script.type = 'text/javascript';
                    script.src = buildUrl();
                    script.async = true;
                    script.addEventListener('error', error, true);
                },
                // perform request
                connect = function () {
                    window[name] = success;
                    document.body.appendChild(script);
                    timeoutId = timeout ? setTimeout(error, timeout) : timeoutId;
                },
                // close connection and cleanup
                close = function () {
                    if (status) {
                        return;
                    }
                    delete window[name];
                    document.body.removeChild(script);
                    if (timeoutId) {
                        clearTimeout(timeoutId);
                        timeoutId = null;
                    }
                },
                // called on request success
                success = function (data) {
                    if (status) {
                        return;
                    }
                    close();
                    setStatus(true, data);
                },
                // called on request error or timeout (if exists)
                error = function (data) {
                    if (status) {
                        return;
                    }
                    close();
                    setStatus(false, data);
                };
            init();
            connect();
        };
    })();