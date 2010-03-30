jstestdriver.listen=function(){var g=jstestdriver.extractId(window.location.toString());var b=jstestdriver.SERVER_URL+g;jstestdriver.pluginRegistrar=new jstestdriver.PluginRegistrar();jstestdriver.testCaseManager=new jstestdriver.TestCaseManager(jstestdriver.pluginRegistrar);var d=new jstestdriver.TestRunner(jstestdriver.pluginRegistrar,function(h){h()});jstestdriver.testCaseBuilder=new jstestdriver.TestCaseBuilder(jstestdriver.testCaseManager);jstestdriver.global.TestCase=jstestdriver.bind(jstestdriver.testCaseBuilder,jstestdriver.testCaseBuilder.TestCase);var f=new jstestdriver.plugins.ScriptLoader(window,document,jstestdriver.testCaseManager);var e=new jstestdriver.plugins.StylesheetLoader(window,document,jstestdriver.jQuery.browser.mozilla||jstestdriver.jQuery.browser.safari);var c=new jstestdriver.plugins.FileLoaderPlugin(f,e);var a=new jstestdriver.plugins.TestRunnerPlugin(Date,function(){jstestdriver.jQuery("body").children().remove();jstestdriver.jQuery(document).unbind();jstestdriver.jQuery(document).die()});jstestdriver.pluginRegistrar.register(new jstestdriver.plugins.DefaultPlugin(c,a,new jstestdriver.plugins.AssertsPlugin(),new jstestdriver.plugins.TestCaseManagerPlugin()));jstestdriver.testCaseManager.TestCase=jstestdriver.global.TestCase;new jstestdriver.CommandExecutor(parseInt(g),b,jstestdriver.convertToJson(jstestdriver.jQuery.post),jstestdriver.testCaseManager,d,jstestdriver.pluginRegistrar).listen()};jstestdriver.TIMEOUT=500;jstestdriver.CommandExecutor=function(f,b,c,e,d,a){this.__id=f;this.__url=b;this.__sendRequest=c;this.__testCaseManager=e;this.__testRunner=d;this.__pluginRegistrar=a;this.__boundExecuteCommand=jstestdriver.bind(this,this.executeCommand);this.__boundExecute=jstestdriver.bind(this,this.execute);this.__boundEvaluateCommand=jstestdriver.bind(this,this.evaluateCommand);this.__boundSendData=jstestdriver.bind(this,this.sendData);this.boundCleanTestManager=jstestdriver.bind(this,this.cleanTestManager);this.boundOnFileLoaded_=jstestdriver.bind(this,this.onFileLoaded);this.boundOnFileLoadedRunnerMode_=jstestdriver.bind(this,this.onFileLoadedRunnerMode);this.commandMap_={execute:jstestdriver.bind(this,this.execute),runAllTests:jstestdriver.bind(this,this.runAllTests),runTests:jstestdriver.bind(this,this.runTests),loadTest:jstestdriver.bind(this,this.loadTest),reset:jstestdriver.bind(this,this.reset),registerCommand:jstestdriver.bind(this,this.registerCommand),dryRun:jstestdriver.bind(this,this.dryRun),dryRunFor:jstestdriver.bind(this,this.dryRunFor)};this.boundOnTestDone=jstestdriver.bind(this,this.onTestDone_);this.boundOnComplete=jstestdriver.bind(this,this.onComplete_);this.boundOnTestDoneRunnerMode=jstestdriver.bind(this,this.onTestDoneRunnerMode_);this.boundOnCompleteRunnerMode=jstestdriver.bind(this,this.onCompleteRunnerMode_);this.boundSendTestResults=jstestdriver.bind(this,this.sendTestResults_);this.boundOnDataSent=jstestdriver.bind(this,this.onDataSent_);this.testsDone_=[];this.sentOn_=-1;this.done_=false};jstestdriver.CommandExecutor.prototype.executeCommand=function(a){if(a=="noop"){this.__sendRequest(this.__url,null,this.__boundExecuteCommand)}else{var b=jsonParse(a);this.commandMap_[b.command](b.parameters)}};jstestdriver.CommandExecutor.prototype.sendData=function(a){this.__sendRequest(this.__url,a,this.__boundExecuteCommand)};jstestdriver.CommandExecutor.prototype.execute=function(b){var a={done:"",type:jstestdriver.RESPONSE_TYPES.COMMAND_RESULT,response:{response:this.__boundEvaluateCommand(b),browser:{"id":this.__id}}};this.sendData(a)};jstestdriver.CommandExecutor.prototype.findScriptTagsToRemove_=function(e,l){var c=e.getElementsByTagName("script");var a=l.length;var k=c.length;var b=[];for(var g=0;g<a;g++){var h=l[g].fileSrc;for(var d=0;d<k;d++){var m=c[d];if(m.src.indexOf(h)!=-1){b.push(m);break}}}return b};jstestdriver.CommandExecutor.prototype.removeScriptTags_=function(e,f){var d=e.getElementsByTagName("head")[0];var c=f.length;for(var b=0;b<c;b++){var a=f[b];d.removeChild(a)}};jstestdriver.CommandExecutor.prototype.removeScripts=function(b,a){this.removeScriptTags_(b,this.findScriptTagsToRemove_(b,a))};jstestdriver.CommandExecutor.prototype.loadTest=function(c){var e=c[0];var d=c[1]=="true"?true:false;var b=jsonParse('{"f":'+e+"}").f;this.removeScripts(document,b);var a=new jstestdriver.FileLoader(this.__pluginRegistrar,!d?this.boundOnFileLoaded_:this.boundOnFileLoadedRunnerMode_);a.load(b)};jstestdriver.CommandExecutor.prototype.getBrowserInfo=function(){return new jstestdriver.BrowserInfo(this.__id)};jstestdriver.CommandExecutor.prototype.onFileLoaded=function(a){var b=new jstestdriver.Response(jstestdriver.RESPONSE_TYPES.FILE_LOAD_RESULT,JSON.stringify(a),this.getBrowserInfo());var c=new jstestdriver.CommandResponse(false,b);this.sendData(c)};jstestdriver.CommandExecutor.prototype.onFileLoadedRunnerMode=function(a){if(!parent.G_testRunner){parent.G_testRunner={finished_:false,success_:1,report_:"",filesLoaded_:0,isFinished:function(){return this.finished_},isSuccess:function(){return this.success_},getReport:function(){return this.report_},getNumFilesLoaded:function(){return this.filesLoaded_},setIsFinished:function(c){this.finished_=c},setIsSuccess:function(c){this.success_=c},setReport:function(c){this.report_=c},setNumFilesLoaded:function(c){this.filesLoaded_=c}}}var b=parent.G_testRunner;b.setNumFilesLoaded(a.loadedFiles.length);this.__sendRequest(this.__url,null,this.__boundExecuteCommand)};jstestdriver.CommandExecutor.prototype.runAllTests=function(b){var a=b[0];var c=b[1]=="true"?true:false;this.runTestCases_(this.__testCaseManager.getDefaultTestRunsConfiguration(),a=="true"?true:false,c)};jstestdriver.CommandExecutor.prototype.runTests=function(b){var c=jsonParse('{"expressions":'+b[0]+"}").expressions;var a=b[1];this.runTestCases_(this.__testCaseManager.getTestRunsConfigurationFor(c),a=="true"?true:false,false)};jstestdriver.CommandExecutor.prototype.runTestCases_=function(a,b,c){if(!c){this.startTestInterval_(jstestdriver.TIMEOUT);this.__testRunner.runTests(a,this.boundOnTestDone,this.boundOnComplete,b)}else{this.__testRunner.runTests(a,this.boundOnTestDoneRunnerMode,this.boundOnCompleteRunnerMode,b)}};jstestdriver.CommandExecutor.prototype.onTestDoneRunnerMode_=function(a){var b=parent.G_testRunner;b.setIsSuccess(b.isSuccess()&(a.result=="passed"));this.addTestResult(a)};jstestdriver.CommandExecutor.prototype.onCompleteRunnerMode_=function(){var a=parent.G_testRunner;a.setReport(JSON.stringify(this.testsDone_));this.testsDone_=[];a.setIsSuccess(a.isSuccess()==1?true:false);a.setIsFinished(true)};jstestdriver.CommandExecutor.prototype.startTestInterval_=function(a){this.timeout_=jstestdriver.setTimeout(this.boundSendTestResults,a)};jstestdriver.CommandExecutor.prototype.stopTestInterval_=function(){jstestdriver.clearTimeout(this.timeout_)};jstestdriver.CommandExecutor.prototype.onDataSent_=function(){if(this.done_){this.sendTestResultsOnComplete_()}else{if(this.sentOn_!=-1){var a=new Date().getTime()-this.sentOn_;this.sentOn_=-1;if(a<jstestdriver.TIMEOUT){this.startTestInterval_(jstestdriver.TIMEOUT-a)}else{this.sendTestResults_()}}}};jstestdriver.CommandExecutor.prototype.sendTestResults_=function(){this.stopTestInterval_();if(this.testsDone_.length>0){var a=new jstestdriver.Response(jstestdriver.RESPONSE_TYPES.TEST_RESULT,JSON.stringify(this.testsDone_),this.getBrowserInfo());var b=new jstestdriver.CommandResponse(false,a);this.testsDone_=[];this.sentOn_=new Date().getTime();this.__sendRequest(this.__url,b,this.boundOnDataSent)}};jstestdriver.CommandExecutor.prototype.onTestDone_=function(a){this.addTestResult(a);if((a.result=="error"||a.log!="")&&this.sentOn_==-1){this.sendTestResults_()}};jstestdriver.CommandExecutor.prototype.addTestResult=function(a){this.__pluginRegistrar.processTestResult(a);this.testsDone_.push(a)};jstestdriver.CommandExecutor.prototype.sendTestResultsOnComplete_=function(){this.stopTestInterval_();this.done_=false;this.sentOn_=-1;var a=new jstestdriver.Response(jstestdriver.RESPONSE_TYPES.TEST_RESULT,JSON.stringify(this.testsDone_),this.getBrowserInfo());var b=new jstestdriver.CommandResponse(true,a);this.testsDone_=[];this.__sendRequest(this.__url,b,this.__boundExecuteCommand)};jstestdriver.CommandExecutor.prototype.onComplete_=function(){this.done_=true;this.sendTestResultsOnComplete_()};jstestdriver.CommandExecutor.prototype.evaluateCommand=function(cmd){var res="";try{var evaluatedCmd=eval("("+cmd+")");if(evaluatedCmd){res=evaluatedCmd.toString()}}catch(e){res="Exception "+e.name+": "+e.message+"\n"+e.fileName+"("+e.lineNumber+"):\n"+e.stack}return res};jstestdriver.CommandExecutor.prototype.reset=function(){if(window.location.href.search("\\?refresh")!=-1){window.location.reload()}else{window.location.replace(window.location.href+"?refresh")}};jstestdriver.CommandExecutor.prototype.registerCommand=function(b,c){this[b]=jstestdriver.bind(this,c);var a=new jstestdriver.Response(jstestdriver.RESPONSE_TYPES.REGISTER_RESULT,"Command "+b+" registered.",this.getBrowserInfo());this.sendData(new jstestdriver.CommandResponse("",a))};jstestdriver.CommandExecutor.prototype.dryRun=function(){var a=new jstestdriver.Response(jstestdriver.RESPONSE_TYPES.TEST_QUERY_RESULT,JSON.stringify(this.__testCaseManager.getCurrentlyLoadedTest()),this.getBrowserInfo());this.sendData(new jstestdriver.CommandResponse(true,a))};jstestdriver.CommandExecutor.prototype.dryRunFor=function(a){var c=jsonParse('{"expressions":'+a[0]+"}").expressions;var b=JSON.stringify(this.__testCaseManager.getCurrentlyLoadedTestFor(c));var d=new jstestdriver.CommandResponse(true,new jstestdriver.Response(jstestdriver.RESPONSE_TYPES.TEST_QUERY_RESULT,b,this.getBrowserInfo()));this.sendData(d)};jstestdriver.CommandExecutor.prototype.listen=function(){if(window.location.href.search("\\?refresh")!=-1){var a=new jstestdriver.CommandResponse(true,new jstestdriver.Response(jstestdriver.RESPONSE_TYPES.RESET_RESULT,"Runner reset.",this.getBrowserInfo()));this.__sendRequest(this.__url+"?start",a,this.__boundExecuteCommand)}else{this.__sendRequest(this.__url+"?start",null,this.__boundExecuteCommand)}};