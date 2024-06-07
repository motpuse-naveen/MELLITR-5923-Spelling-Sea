var myView=angular.module("myView",["templateUrls","ngSanitize","ngAnimate"]);myView.constant("APPCONSTANT",function(){return{ACTIVITY_LOADED:"activity_loaded",FINAL_DATA_SUBMISSION:"final_data_submission",AUDIO_STARTED:"audio_started",UPDATE_TINCAN_DATA:"updateTincanData",SAVE_TINCAN_DATA:"save_tincan_data",ORIENTATION:"orientation",RESIZE:"resize",INIT_DRAG:"init_drag"}}());var ActionManager={};ActionManager.actions={},ActionManager.registerAction=function(a){void 0==ActionManager.actions[a]&&(ActionManager.actions[a]=[])},ActionManager.registerActionHandler=function(a,n){void 0==ActionManager.actions[a]&&(ActionManager.actions[a]=[]),ActionManager.actions[a].push(n)},ActionManager.dispatchAction=function(a,n){void 0!=ActionManager.actions[a]&&ActionManager.actions[a].map(function(a){a(n)})},myView.factory("TincanAPIService",["$rootScope","$http","$sce",function(a,n,t){var e={};e.scoId="";var i={},o=null,r=null,c=null,s=null,d=null;return e.getURL=function(){var a={objectType:"Agent",account:i.account},n=encodeURI(JSON.stringify(a)),t=encodeURI(i.endpoint+"/activities/state/?activityId=https://"+e.scoId+"&");return t+=encodeURI("stateId=state&agent="+n+"&registration="+i.registration)},e.getRequestHeader=function(){return{headers:{Authorization:i.authorization.header[0].value,Accept:"application/json;charset=utf-8"}}},e.postSCOSaveData=function(a){var t=e.getURL(),i=e.getRequestHeader();return n.post(t,a,i)},e.getSCOData=function(a){var t=e.getURL(),i=e.getRequestHeader();return n.get(t,i)},e.validateTCConfigData=function(a){var n=!0;return void 0!=a.account&&void 0!=a.mode&&void 0!=a.registration&&void 0!=a.endpoint&&void 0!=a.authorization||(n=!1),1==n&&(void 0!=a.authorization.header&&void 0!=a.authorization.expiration||(n=!1)),1==n&&void 0==a.authorization.header[0].value&&(n=!1),0==n&&console.log("Invalid TCConfig Data"),n},e.receiveTCConfig=function(a){"tcConfig"==a.data.action?(d=a.source,i=a.data,void 0==i.scaledPassingScore&&(i.scaledPassingScore=.6),void 0==i.completionThreshold&&(i.completionThreshold=1),r(i),o=null):"authorization"==a.data.action?(r(a.data),o=null):"commit"==a.data.action?(c(),o=null):"GADetails"==a.data.action&&s(a.data)},e.addGADetailsWindowMessageEventListener=function(a){s=a},e.addWindowMessageEventListener=function(a){c=a,window.addEventListener("message",e.receiveTCConfig)},e.sendWindowPostMessage=function(a,n){void 0!=n&&(e.scoId=n);var t=0;return o=new Promise(function(n,e){if(r=n,null!=d)d.postMessage(a,"*");else{var i=window,o=function(n,e){n!==i&&(i=n,t++,null!=n&&n.postMessage(a,"*"),t<5&&void 0==e&&o(n.parent))};o(window.parent),window.opener!==i&&o(window.opener,!0)}})},e.updateTincanConfig=function(a){i=a},e}]);var TincanManager={};TincanManager.startTime,TincanManager.endTime,TincanManager.spentTime,TincanManager.mode="normal";var previousTime=appConfig.data.tincan.total_time_spent;TincanManager.initAfterAppLoad=function(a){previousTime=a.total_time_spent},TincanManager.recordElapsedTime=function(a,n){"normal"==TincanManager.mode&&(n?TincanManager.startTime=new Date:(TincanManager.endTime=new Date,TincanManager.spentTime=TincanManager.endTime-TincanManager.startTime,a.total_time_spent=previousTime+parseInt(TincanManager.spentTime/1e3),a.time_in_units=TincanManager.msToTime(1e3*a.total_time_spent)))},TincanManager.msToTime=function(a){var n=(parseInt(a%1e3/100),parseInt(a/1e3%60)),t=parseInt(a/6e4%60);return parseInt(a/36e5%24)+":"+t+":"+n},TincanManager.getTimeInWords=function(a){var n=a.split(":"),t=1==parseInt(n[0])?"Hour":"Hours",e=1==parseInt(n[1])?"Minute":"Minutes",i=1==parseInt(n[2])?"Second":"Seconds",o="";return parseInt(n[0])>0&&(o=o+n[0]+" "+t+","),parseInt(n[1])>0&&(o=o+" "+n[1]+" "+e+","),o=o+" "+n[2]+" "+i},TincanManager.updateTincanData=function(a,n,t){"normal"==TincanManager.mode&&(a[n]=t,TincanManager.calculateTotalScore(a),TincanManager.calculatePercentageCompleted(a),TincanManager.recordElapsedTime(a,!1))},TincanManager.calculateTotalScore=function(a){a.total_score=Math.min(parseInt(a.max_score),parseInt(a.total_score))},TincanManager.calculatePercentageCompleted=function(a){var n=100*parseInt(a.total_score)/parseInt(a.max_score);n=Math.round(100*n)/100+"%"},myView.factory("appService",["$rootScope","$http","$window","$timeout",function(a,n,t,e){var i,o={};return o.getConfigData=function(){return appConfig},o.isDevice=function(){return/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase())},o.isIpadDevice=function(){return null!=navigator.userAgent.match(/iPad/i)},o.isAndroidDevice=function(){return/(android)/i.test(navigator.userAgent)},o.getOrientation=function(a){return i},o.setOrientation=function(a){i=a},o.getWindowDimensions=function(){var a=angular.element(t);return{h:a.height(),w:a.width()}},o}]),myView.controller("mainCtrl",["$scope","$timeout","$window","appService","APPCONSTANT","TincanAPIService",function(a,n,t,e,i,o){const r=(e.isIpadDevice(),e.isAndroidDevice());var c=appConfig,s=!1,d=null,u=!1,l=null;a.reviewMode=!1,a.tcConfigData={},a.appData=null,a.commitPostMsgListener=function(){u=!0,a.saveTincanData()},a.getGADetailsDataHandler=function(a){console.log("getGADetails: ",a),l=a.GADetails},a.init=function(){console.log("Main view init"),c&&c.title&&(document.title=c.title),c&&c.precacheimages?a.precacheImages():a.loadStateInitView()},a.precacheImages=function(){for(var n=c.precacheimages,t=0,e=0;e<n.length;e++)!function(e){var i=new Image;i.src=n[e],i.addEventListener("load",function(){++t==n.length&&a.loadStateInitView()},!1)}(e)},a.loadStateInitView=function(){o.addWindowMessageEventListener(a.commitPostMsgListener);var n=window.location.search.substring(1).split("&");n.indexOf("localpersistence=true")>-1&&(s=!0),n.indexOf("tc=y")>-1?(o.addGADetailsWindowMessageEventListener(a.getGADetailsDataHandler),o.sendWindowPostMessage({action:"getGADetails",scoId:c.scoId},c.scoId).then(function(a){}),o.sendWindowPostMessage({action:"getTCConfig",scoId:c.scoId},c.scoId).then(function(n){a.tcConfigData=n,TincanManager.mode=a.tcConfigData.mode,"review"==a.tcConfigData.mode&&(a.reviewMode=!0),"normal"==a.tcConfigData.mode||"review"==a.tcConfigData.mode?(a.runAuthorizationTimer(),a.getTincanData()):a.initializeAppData()})):a.initializeAppData()},a.runAuthorizationTimer=function(){if(void 0!=a.tcConfigData.authorization&&void 0!=a.tcConfigData.authorization.expiration){var n=1e3*parseInt(a.tcConfigData.authorization.expiration)-3e5;d=setTimeout(function(){o.sendWindowPostMessage({action:"getAuthorization"}).then(function(n){a.$apply(function(){a.tcConfigData.authorization=n.authorization,a.tcConfigData.session=n.session,o.updateTincanConfig(a.tcConfigData)}),a.runAuthorizationTimer(),clearTimeout(d),d=null})},n),setTimeout(function(){o.sendWindowPostMessage({action:"getAuthorization"}).then(function(a){})},1e4)}},a.getTincanData=function(){if(s){var n=localStorage.getItem(c.scoId);n=JSON.parse(n),n&&void 0!=n.data&&void 0!=n.data.body&&(c.data.tincan=n.data.body),a.initializeAppData()}else o.getSCOData().then(function(n){void 0!=n&&null!=n&&void 0!=n.data&&void 0!=n.data.body&&(c.data.tincan=n.data.body),a.initializeAppData()},function(n){a.initializeAppData()})},a.initializeAppData=function(){c.data.tincan.userDetails=l,a.appData=c,a.initializeApp()},a.initializeApp=function(){ActionManager.registerActionHandler(i.SAVE_TINCAN_DATA,a.saveTincanData),angular.element(window).on("orientationchange",function(n){a.orientation=a.getOrientation(),r&&("portrait"==a.orientation?a.orientation="landscape":a.orientation="portrait"),e.setOrientation(a.orientation),a.$broadcast(i.ORIENTATION)}),angular.element(window).on("resize",function(n){e.isDevice()||a.$broadcast(i.RESIZE)}),a.$on(i.SAVE_TINCAN_DATA,function(){a.saveTincanData()}),TincanManager.initAfterAppLoad(a.appData.data.tincan),TincanManager.recordElapsedTime(a.appData.data.tincan,!0),n(function(){a.$broadcast(i.ACTIVITY_LOADED)},100)},a.$on("initAccessibility",function(n,t){a.initAcs(t)}),a.initAcs=function(n){var t=a.appData.data.acs;$.extend(elementsJSON.elemSeq.view_level,t);var e={language:a.appData.language};AccessibilityManager.init(elementsJSON,e,n)},a.getOrientation=function(){var a;return window.matchMedia("(orientation: portrait)").matches&&(a="portrait"),window.matchMedia("(orientation: landscape)").matches&&(a="landscape"),a},a.getPOSTData=function(n){var t=a.appData.data.tincan,e=0;Number(t.total_score)>0&&(e=Number(t.total_score)/Number(t.max_score),e=Math.round(100*(e+1e-5))/100);var i="failed";e>=Number(a.tcConfigData.scaledPassingScore)&&(i="passed");var o="incomplete";"normal"===n&&(o="completed");var r={result:{score:{scaled:e,raw:Number(t.total_score),max:Number(t.max_score)},successStatus:i,progressMeasure:e,completionStatus:o,location:"",totalTime:Number(t.total_time_spent),exit:n},body:t};return a.tcConfigData.session&&a.tcConfigData.session.id&&(r.session={id:a.tcConfigData.session.id}),r},a.sendCommitPostMessage=function(n){o.sendWindowPostMessage({action:"commit",result:n},a.appData.scoId)},a.saveTincanData=function(){n(function(){if(a.$broadcast("saveViewTincanData"),"normal"==a.tcConfigData.mode)if(s){var n={data:{result:{},body:a.appData.data.tincan}};localStorage.setItem(a.appData.scoId,JSON.stringify(n))}else{var t=a.getPOSTData("suspend");o.postSCOSaveData(t).then(function(n){u&&(u=!1,a.sendCommitPostMessage("succeeded"))},function(n){u&&(u=!1,a.sendCommitPostMessage("failed"))})}},100)},a.submitTincanData=function(){if("normal"==a.tcConfigData.mode){if(s){a.appData.data.tincan;localStorage.setItem(a.appData.scoId,JSON.stringify(a.appData.data.tincan))}else{var n=a.getPOSTData("normal");o.postSCOSaveData(n).then(function(a){},function(a){})}a.reviewMode=!0}},a.$on("SUBMIT_TINCAN_DATA",function(){console.log("SUBMIT_TINCAN_DATA"),a.submitTincanData()}),t.onbeforeunload=function(){a.saveTincanData()}}]),myView.directive("mainDirective",function(){return{retrict:"E",replace:!0,templateUrl:"templates/main.html",link:function(a,n,t){n.ready(function(){a.init()})}}});
console.log('code updated on 08-04-2021 Spelling Sea Spanish Grade 3');