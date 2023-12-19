function SCORMapi1_2(initialData=null, url='') {
    var CMIString256 = '^[\u0000-\uffff]{0,255}$';
    var CMIString4096 = '^[\u0000-\uffff]{0,4096}$';
    var CMITime = '^([0-2]{1}[0-9]{1}):([0-5]{1}[0-9]{1}):([0-5]{1}[0-9]{1})(\.[0-9]{1,2})?$';
    var CMITimespan = '^([0-9]{2,4}):([0-9]{2}):([0-9]{2})(\\.[0-9]{1,2})?$';
    var CMIInteger = '^\d+$';
    var CMISInteger = '^-?([0-9]+)$';
    var CMIDecimal = '^-?([0-9]{0,3})(\.[0-9]*)?$';
    var CMIIdentifier = '^[\\u0021-\\u007E]{0,255}$';
    var CMIFeedback = CMIString256;
    var CMIIndex = '[._](\\d+).';
    var CMIStatus = '^passed$|^completed$|^failed$|^incomplete$|^browsed$';
    var CMIStatus2 = '^passed$|^completed$|^failed$|^incomplete$|^browsed$|^not attempted$';
    var CMIExit = '^time-out$|^suspend$|^logout$|^$';
    var CMIType = '^true-false$|^choice$|^fill-in$|^matching$|^performance$|^sequencing$|^likert$|^numeric$';
    var CMIResult = '^correct$|^wrong$|^unanticipated$|^neutral$|^([0-9]{0,3})?(\.\[0-9]{1,2})?$';
    var NAVEvent = '^previous$|^continue$';
    var cmi_children = 'core,suspend_data,launch_data,comments,objectives,student_data,student_preference,interactions';
    var core_children = 'student_id,student_name,lesson_location,credit,lesson_status,entry,score,total_time,lesson_mode,exit,session_time';
    var score_children = 'raw,min,max';
    var comments_children = 'content,location,time';
    var objectives_children = 'id,score,status';
    var correct_responses_children = 'pattern';
    var student_data_children = 'mastery_score,max_time_allowed,time_limit_action';
    var student_preference_children = 'audio,language,speed,text';
    var interactions_children = 'id,objectives,time,type,correct_responses,weighting,student_response,result,latency';
    var score_range = '0#100';
    var audio_range = '-1#100';
    var speed_range = '-100#100';
    var weighting_range = '-100#100';
    var text_range = '-1#1';

    function LMSInitialize(param) {}
    function LMSFinish(param) {}
    function LMSGetValue(element) {}
    function LMSSetValue(element, value) {}
    function LMSCommit(param) {}
    function LMSGetLastError() {}
    function LMSGetErrorString(param) {}
    function LMSGetDiagnostic(param) {}



    this.LMSInitialize = LMSInitialize;
    this.LMSFinish = LMSFinish;
    this.LMSGetValue = LMSGetValue;
    this.LMSSetValue = LMSSetValue;
    this.LMSCommit = LMSCommit;
    this.LMSGetLastError = LMSGetLastError;
    this.LMSGetErrorString = LMSGetErrorString;
    this.LMSGetDiagnostic = LMSGetDiagnostic;
    this.version = '1.0';
}        