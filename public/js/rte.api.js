var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

function SCORMAPI(options) {

  $.support.cors = true;
 
  // Define SCORM 1.2 RTE API
  this.LMSGetDiagnostic = __bind(this.LMSGetDiagnostic, this);
  this.LMSGetErrorString = __bind(this.LMSGetErrorString, this);
  this.LMSGetLastError = __bind(this.LMSGetLastError, this);
  this.LMSCommit = __bind(this.LMSCommit, this);
  this.LMSSetValue = __bind(this.LMSSetValue, this);
  this.LMSGetValue = __bind(this.LMSGetValue, this);
  this.LMSFinish = __bind(this.LMSFinish, this);
  this.LMSInitialize = __bind(this.LMSInitialize, this);

  this.errorCode = 0;
  this.errorString = '';
  this.Initialized = false;
  this.Terminated = false;
  this.cmi = null;

  // SCORM 1.2 Standard Data Type Definition
  this.SCORM_PASSED = "passed";
  this.SCORM_FAILED = "failed";
  this.SCORM_COMPLETED = "completed";
  this.SCORM_BROWSED = "browsed";
  this.SCORM_INCOMPLETE = "incomplete";
  this.SCORM_NOT_ATTEMPTED = "not attempted";
  this.SCORM_BROWSE = "browse";
  this.SCORM_NORMAL = "normal";
  this.SCORM_REVIEW = "review";
  this.SCORM_ENTRY_ABINITIO = "ab-initio";
  this.SCORM_ENTRY_RESUME = "resume";
  this.SCORM_ENTRY_NORMAL = "";
  this.SCORM_CREDIT = "credit";
  this.SCORM_NO_CREDIT = "no-credit";

  this.CMIString256 = '^[\\u0000-\\uffff]{0,255}$';
  this.CMIString4096 = '^[\\u0000-\\uffff]{0,4096}$';
  this.CMITime = '^([0-2]{1}[0-9]{1}):([0-5]{1}[0-9]{1}):([0-5]{1}[0-9]{1})(\.[0-9]{1,2})?$';
  this.CMITimespan = '^([0-9]{2,4}):([0-9]{2}):([0-9]{2})(\.[0-9]{1,2})?$';
  this.CMIInteger = '^\\d+$';
  this.CMISInteger = '^-?([0-9]+)$';
  this.CMIDecimal = '^-?([0-9]{0,3})(\.[0-9]*)?$';
  this.CMIIdentifier = '^[\\u0021-\\u007E]{0,255}$';
  this.CMIFeedback = this.CMIString256; // This must be redefined
  this.CMIIndex = '[._](\\d+).';
  // Vocabulary Data Type Definition
  this.CMIStatus = '^passed$|^completed$|^failed$|^incomplete$|^browsed$';
  this.CMIStatus2 = '^passed$|^completed$|^failed$|^incomplete$|^browsed$|^not attempted$';
  this.CMIExit = '^time-out$|^suspend$|^logout$|^$';
  this.CMIType = '^true-false$|^choice$|^fill-in$|^matching$|^performance$|^sequencing$|^likert$|^numeric$';
  this.CMIResult = '^correct$|^wrong$|^unanticipated$|^neutral$|^([0-9]{0,3})?(\.[0-9]*)?$';  
  this.NAVEvent = '^previous$|^continue$';
  // Children lists
  this.cmi_children = 'core,suspend_data,launch_data,comments,objectives,student_data,student_preference,interactions';
  this.core_children = 'student_id,student_name,lesson_location,credit,lesson_status,entry,score,total_time,lesson_mode,exit,session_time';
  this.score_children = 'raw,min,max';
  this.comments_children = 'content,location,time';
  this.objectives_children = 'id,score,status';
  this.correct_responses_children = 'pattern';
  this.student_data_children = 'mastery_score,max_time_allowed,time_limit_action';
  this.student_preference_children = 'audio,language,speed,text';
  this.interactions_children = 'id,objectives,time,type,correct_responses,weighting,student_response,result,latency';
  // Data ranges
  this.score_range = '0#100';
  this.audio_range = '-1#100';
  this.speed_range = '-100#100';
  this.weighting_range = '-100#100';
  this.text_range = '-1#1';

    // language key has to be checked for language dependent strings
  this.validLanguages = {
      'aa': 'aa', 'ab': 'ab', 'ae': 'ae', 'af': 'af', 'ak': 'ak', 'am': 'am', 'an': 'an', 'ar': 'ar', 'as': 'as', 'av': 'av', 'ay': 'ay', 'az': 'az',
      'ba': 'ba', 'be': 'be', 'bg': 'bg', 'bh': 'bh', 'bi': 'bi', 'bm': 'bm', 'bn': 'bn', 'bo': 'bo', 'br': 'br', 'bs': 'bs',
      'ca': 'ca', 'ce': 'ce', 'ch': 'ch', 'co': 'co', 'cr': 'cr', 'cs': 'cs', 'cu': 'cu', 'cv': 'cv', 'cy': 'cy',
      'da': 'da', 'de': 'de', 'dv': 'dv', 'dz': 'dz', 'ee': 'ee', 'el': 'el', 'en': 'en', 'eo': 'eo', 'es': 'es', 'et': 'et', 'eu': 'eu',
      'fa': 'fa', 'ff': 'ff', 'fi': 'fi', 'fj': 'fj', 'fo': 'fo', 'fr': 'fr', 'fy': 'fy', 'ga': 'ga', 'gd': 'gd', 'gl': 'gl', 'gn': 'gn', 'gu': 'gu', 'gv': 'gv',
      'ha': 'ha', 'he': 'he', 'hi': 'hi', 'ho': 'ho', 'hr': 'hr', 'ht': 'ht', 'hu': 'hu', 'hy': 'hy', 'hz': 'hz',
      'ia': 'ia', 'id': 'id', 'ie': 'ie', 'ig': 'ig', 'ii': 'ii', 'ik': 'ik', 'io': 'io', 'is': 'is', 'it': 'it', 'iu': 'iu',
      'ja': 'ja', 'jv': 'jv', 'ka': 'ka', 'kg': 'kg', 'ki': 'ki', 'kj': 'kj', 'kk': 'kk', 'kl': 'kl', 'km': 'km', 'kn': 'kn', 'ko': 'ko', 'kr': 'kr', 'ks': 'ks', 'ku': 'ku', 'kv': 'kv', 'kw': 'kw', 'ky': 'ky',
      'la': 'la', 'lb': 'lb', 'lg': 'lg', 'li': 'li', 'ln': 'ln', 'lo': 'lo', 'lt': 'lt', 'lu': 'lu', 'lv': 'lv',
      'mg': 'mg', 'mh': 'mh', 'mi': 'mi', 'mk': 'mk', 'ml': 'ml', 'mn': 'mn', 'mo': 'mo', 'mr': 'mr', 'ms': 'ms', 'mt': 'mt', 'my': 'my',
      'na': 'na', 'nb': 'nb', 'nd': 'nd', 'ne': 'ne', 'ng': 'ng', 'nl': 'nl', 'nn': 'nn', 'no': 'no', 'nr': 'nr', 'nv': 'nv', 'ny': 'ny',
      'oc': 'oc', 'oj': 'oj', 'om': 'om', 'or': 'or', 'os': 'os', 'pa': 'pa', 'pi': 'pi', 'pl': 'pl', 'ps': 'ps', 'pt': 'pt',
      'qu': 'qu', 'rm': 'rm', 'rn': 'rn', 'ro': 'ro', 'ru': 'ru', 'rw': 'rw',
      'sa': 'sa', 'sc': 'sc', 'sd': 'sd', 'se': 'se', 'sg': 'sg', 'sh': 'sh', 'si': 'si', 'sk': 'sk', 'sl': 'sl', 'sm': 'sm', 'sn': 'sn', 'so': 'so', 'sq': 'sq', 'sr': 'sr', 'ss': 'ss', 'st': 'st', 'su': 'su', 'sv': 'sv', 'sw': 'sw',
      'ta': 'ta', 'te': 'te', 'tg': 'tg', 'th': 'th', 'ti': 'ti', 'tk': 'tk', 'tl': 'tl', 'tn': 'tn', 'to': 'to', 'tr': 'tr', 'ts': 'ts', 'tt': 'tt', 'tw': 'tw', 'ty': 'ty',
      'ug': 'ug', 'uk': 'uk', 'ur': 'ur', 'uz': 'uz', 've': 've', 'vi': 'vi', 'vo': 'vo',
      'wa': 'wa', 'wo': 'wo', 'xh': 'xh', 'yi': 'yi', 'yo': 'yo', 'za': 'za', 'zh': 'zh', 'zu': 'zu',
      'aar': 'aar', 'abk': 'abk', 'ave': 'ave', 'afr': 'afr', 'aka': 'aka', 'amh': 'amh', 'arg': 'arg', 'ara': 'ara', 'asm': 'asm', 'ava': 'ava', 'aym': 'aym', 'aze': 'aze',
      'bak': 'bak', 'bel': 'bel', 'bul': 'bul', 'bih': 'bih', 'bis': 'bis', 'bam': 'bam', 'ben': 'ben', 'tib': 'tib', 'bod': 'bod', 'bre': 'bre', 'bos': 'bos',
      'cat': 'cat', 'che': 'che', 'cha': 'cha', 'cos': 'cos', 'cre': 'cre', 'cze': 'cze', 'ces': 'ces', 'chu': 'chu', 'chv': 'chv', 'wel': 'wel', 'cym': 'cym',
      'dan': 'dan', 'ger': 'ger', 'deu': 'deu', 'div': 'div', 'dzo': 'dzo', 'ewe': 'ewe', 'gre': 'gre', 'ell': 'ell', 'eng': 'eng', 'epo': 'epo', 'spa': 'spa', 'est': 'est', 'baq': 'baq', 'eus': 'eus', 'per': 'per',
      'fas': 'fas', 'ful': 'ful', 'fin': 'fin', 'fij': 'fij', 'fao': 'fao', 'fre': 'fre', 'fra': 'fra', 'fry': 'fry', 'gle': 'gle', 'gla': 'gla', 'glg': 'glg', 'grn': 'grn', 'guj': 'guj', 'glv': 'glv',
      'hau': 'hau', 'heb': 'heb', 'hin': 'hin', 'hmo': 'hmo', 'hrv': 'hrv', 'hat': 'hat', 'hun': 'hun', 'arm': 'arm', 'hye': 'hye', 'her': 'her',
      'ina': 'ina', 'ind': 'ind', 'ile': 'ile', 'ibo': 'ibo', 'iii': 'iii', 'ipk': 'ipk', 'ido': 'ido', 'ice': 'ice', 'isl': 'isl', 'ita': 'ita', 'iku': 'iku',
      'jpn': 'jpn', 'jav': 'jav', 'geo': 'geo', 'kat': 'kat', 'kon': 'kon', 'kik': 'kik', 'kua': 'kua', 'kaz': 'kaz', 'kal': 'kal', 'khm': 'khm', 'kan': 'kan', 'kor': 'kor', 'kau': 'kau', 'kas': 'kas', 'kur': 'kur', 'kom': 'kom', 'cor': 'cor', 'kir': 'kir',
      'lat': 'lat', 'ltz': 'ltz', 'lug': 'lug', 'lim': 'lim', 'lin': 'lin', 'lao': 'lao', 'lit': 'lit', 'lub': 'lub', 'lav': 'lav',
      'mlg': 'mlg', 'mah': 'mah', 'mao': 'mao', 'mri': 'mri', 'mac': 'mac', 'mkd': 'mkd', 'mal': 'mal', 'mon': 'mon', 'mol': 'mol', 'mar': 'mar', 'may': 'may', 'msa': 'msa', 'mlt': 'mlt', 'bur': 'bur', 'mya': 'mya',
      'nau': 'nau', 'nob': 'nob', 'nde': 'nde', 'nep': 'nep', 'ndo': 'ndo', 'dut': 'dut', 'nld': 'nld', 'nno': 'nno', 'nor': 'nor', 'nbl': 'nbl', 'nav': 'nav', 'nya': 'nya',
      'oci': 'oci', 'oji': 'oji', 'orm': 'orm', 'ori': 'ori', 'oss': 'oss', 'pan': 'pan', 'pli': 'pli', 'pol': 'pol', 'pus': 'pus', 'por': 'por', 'que': 'que',
      'roh': 'roh', 'run': 'run', 'rum': 'rum', 'ron': 'ron', 'rus': 'rus', 'kin': 'kin', 'san': 'san', 'srd': 'srd', 'snd': 'snd', 'sme': 'sme', 'sag': 'sag', 'slo': 'slo', 'sin': 'sin', 'slk': 'slk', 'slv': 'slv', 'smo': 'smo', 'sna': 'sna', 'som': 'som', 'alb': 'alb', 'sqi': 'sqi', 'srp': 'srp', 'ssw': 'ssw', 'sot': 'sot', 'sun': 'sun', 'swe': 'swe', 'swa': 'swa',
      'tam': 'tam', 'tel': 'tel', 'tgk': 'tgk', 'tha': 'tha', 'tir': 'tir', 'tuk': 'tuk', 'tgl': 'tgl', 'tsn': 'tsn', 'ton': 'ton', 'tur': 'tur', 'tso': 'tso', 'tat': 'tat', 'twi': 'twi', 'tah': 'tah',
      'uig': 'uig', 'ukr': 'ukr', 'urd': 'urd', 'uzb': 'uzb', 'ven': 'ven', 'vie': 'vie', 'vol': 'vol', 'wln': 'wln', 'wol': 'wol', 'xho': 'xho', 'yid': 'yid', 'yor': 'yor', 'zha': 'zha', 'chi': 'chi', 'zho': 'zho', 'zul': 'zul'
  };

  this.DoSetLog = __bind(this.DoSetLog, this);

  this.data = {};  
  this.datamodel = {};
  this.interactions = {}; 	
  this.options = options;

  this.pingTimer= null;
  this.logSession = null;
  this.statusChanged = false;
  this.sentResult = false;
  this.scorm = 0;
  this.sco = 0;
  this.user = 0;
  this.vs = "";    

  this.connectionErrorMsg = "There is an error communicating with the server. Please try again or contact support.";  

  var ccmi = new Object();
    ccmi.comments_from_learner = new Object();
    ccmi.comments_from_learner._count = 0;
    ccmi.comments_from_lms = new Object();
    ccmi.comments_from_lms._count = 0;
    ccmi.interactions = new Object();
    ccmi.interactions._count = 0;
    ccmi.learner_preference = new Object();
    ccmi.objectives = new Object();
    ccmi.objectives._count = 0;
    ccmi.score = new Object();

  var cmi = new Object();
      cmi.core = new Object();
      cmi.core.score = new Object();
      cmi.objectives = new Object();
      cmi.student_data = new Object();
      cmi.student_preference = new Object();
      cmi.interactions = new Object();
	   
  	this.scorm = this.options.id;  	
  	this.user = this.options.user;
  	this.vs = this.options.vs;
  	this.sco = this.options.sco;

  	
    var _this = this;
    var url = window.location.protocol + '//' + window.location.host;
    var pathname = window.location.pathname;
    var pos = pathname.lastIndexOf('/');
    url = url + pathname.substring(0, pos + 1) + "course/gtrack?id=" + this.scorm + 
        '&user=' + this.user +         
        '&sco=' + this.sco + '&version=' + this.vs;

    $.getJSON(
    url,
    function (result) {
        
        var data = JSON.parse(result.data);

        if (_this.vs == data.version) {
        
            if(typeof data.cmi_core_lesson_mode == 'undefined' || 
                data.cmi_core_lesson_mode == null ||
                data.cmi_core_lesson_mode === _this.SCORM_INCOMPLETE || 
                !data.cmi_core_lesson_mode) {
            data.cmi_core_lesson_mode = _this.SCORM_NORMAL;
            }

            if(typeof data.cmi_core_lesson_status == 'undefined' || 
                data.cmi_core_lesson_status == null ||
                !data.cmi_core_lesson_status){
            data.cmi_core_lesson_status = _this.SCORM_INCOMPLETE;
            data.cmi_core_entry = _this.SCORM_ENTRY_ABINITIO;   
            } else {
            data.cmi_core_entry = _this.SCORM_ENTRY_RESUME;
            }
        } 
        console.log(data.cmi_suspend_data);
        if(typeof data.cmi_suspend_data == 'undefined' || !data.cmi_suspend_data){
            data.cmi_suspend_data = "";  
        }	
      
     
        if (_this.vs == data.version) {
           // The SCORM 1.2 data model
           var datamodel =  {
             'cmi._children':{'defaultvalue': _this.cmi_children, 'mod':'r', 'writeerror':'402'},
             'cmi._version':{'defaultvalue':'3.4', 'mod':'r', 'writeerror':'402'},
             'cmi.core._children':{'defaultvalue': _this.core_children, 'mod':'r', 'writeerror':'402'},
             'cmi.core.student_id':{'defaultvalue': '' + data.cmi_core_student_id + '', 'mod':'r', 'writeerror':'403'},
             'cmi.core.student_name':{'defaultvalue': '' + data.cmi_core_student_name + '', 'mod':'r', 'writeerror':'403'},  
             'cmi.core.lesson_location':{'defaultvalue':'' + ((typeof data.cmi_core_lesson_location != 'undefined') ? data.cmi_core_lesson_location :'') + '', 'format':_this.CMIString256, 'mod':'rw', 'writeerror':'405'},            
             'cmi.core.credit':{'defaultvalue': '', 'mod':'r', 'writeerror':'403'},
             'cmi.core.lesson_status':{'defaultvalue':'' + ((typeof data.cmi_core_lesson_status != 'undefined') ? data.cmi_core_lesson_status : '') + '', 'format':_this.CMIStatus, 'mod':'rw', 'writeerror':'405'},
             'cmi.core.entry': {'defaultvalue' : '' + data.cmi_core_entry + '', 'mod':'r', 'writeerror':'403'},
             'cmi.core.score._children':{'defaultvalue': _this.score_children, 'mod':'r', 'writeerror':'402'},
             'cmi.core.score.raw':{'defaultvalue':'' + ((typeof data.cmi_core_score_raw != 'undefined') ? data.cmi_core_score_raw :'') + '', 'format':_this.CMIDecimal, 'range':_this.score_range, 'mod':'rw', 'writeerror':'405'},        
             'cmi.core.score.max':{'defaultvalue':'' + ((typeof data.cmi_core_score_max != 'undefined') ? data.cmi_core_score_max :'') + '', 'format':_this.CMIDecimal, 'range':_this.score_range, 'mod':'rw', 'writeerror':'405'},
             'cmi.core.score.min':{'defaultvalue':'' + ((typeof data.cmi_core_score_min != 'undefined') ? data.cmi_core_score_min :'') + '', 'format':_this.CMIDecimal, 'range':_this.score_range, 'mod':'rw', 'writeerror':'405'},
             'cmi.core.total_time':{'defaultvalue':'' + ((typeof data.cmi_core_total_time != 'undefined') ? data.cmi_core_total_time :'00:00:00') +'', 'mod':'r', 'writeerror':'403'},
             'cmi.core.lesson_mode':{'defaultvalue': '' + data.cmi_core_lesson_mode + '', 'mod':'r', 'writeerror':'403'},
             'cmi.core.exit':{'defaultvalue':'' + ((typeof data.cmi_core_exit != 'undefined') ? data.cmi_core_exit :'') + '', 'format':_this.CMIExit, 'mod':'w', 'readerror':'404', 'writeerror':'405'},
             'cmi.core.session_time':{'format': _this.CMITimespan, 'mod':'w', 'defaultvalue':'00:00:00', 'readerror':'404', 'writeerror':'405'},
             'cmi.suspend_data': { 'defaultvalue': '' + ((typeof data.cmi_suspend_data) ? data.cmi_suspend_data : '') + '', 'format': _this.CMIString4096, 'mod': 'rw', 'writeerror': '405' },
             'cmi.launch_data':{'defaultvalue':'' + ((typeof data.cmi_launch_data != 'undefined') ? data.cmi_launch_data:'') + '', 'mod':'r', 'writeerror':'403'},
             'cmi.comments':{'defaultvalue':'' + ((typeof data.cmi_comments != 'undefined') ? data.cmi_comments :'') + '', 'format':this.CMIString4096, 'mod':'rw', 'writeerror':'405'},
             // deprecated evaluation attributes
             'cmi.comments_from_lms':{'mod':'r', 'writeerror':'403'},
             'cmi.objectives._children':{'defaultvalue': '' + _this.objectives_children + '', 'mod':'r', 'writeerror':'402'},
             'cmi.objectives._count':{'mod':'r', 'defaultvalue':'0', 'writeerror':'402'},
             'cmi.objectives.n.id':{'pattern':_this.CMIIndex, 'format':_this.CMIIdentifier, 'mod':'rw', 'writeerror':'405'},
             'cmi.objectives.n.score._children':{'pattern':_this.CMIIndex, 'mod':'r', 'writeerror':'402'},
             'cmi.objectives.n.score.raw':{'defaultvalue':'', 'pattern':_this.CMIIndex, 'format':_this.CMIDecimal, 'range':_this.score_range, 'mod':'rw', 'writeerror':'405'},
             'cmi.objectives.n.score.min':{'defaultvalue':'', 'pattern':_this.CMIIndex, 'format':_this.CMIDecimal, 'range':_this.score_range, 'mod':'rw', 'writeerror':'405'},
             'cmi.objectives.n.score.max':{'defaultvalue':'', 'pattern':_this.CMIIndex, 'format':_this.CMIDecimal, 'range':_this.score_range, 'mod':'rw', 'writeerror':'405'},
             'cmi.objectives.n.status':{'pattern':_this.CMIIndex, 'foramat':_this.CMIStatus2, 'mod':'rw', 'writeerror':'405'},
             'cmi.interactions._children':{'defaultvalue':_this.interactions_children, 'mod':'r', 'writeerror':'402'},
             'cmi.interactions._count': { 'defaultvalue': '0', 'mod': 'r', 'writeerror': '402' },
             'cmi.interactions.n.id':{'pattern':_this.CMIIndex, 'format':_this.CMIIdentifier, 'mod':'w', 'readerror':'404', 'writeerror':'405'},
             'cmi.interactions.n.objectives._count':{'pattern':_this.CMIIndex, 'mod':'r', 'defaultvalue':'0', 'writeerror':'402'},
             'cmi.interactions.n.objectives.n.id':{'pattern':_this.CMIIndex, 'format':_this.CMIIdentifier, 'mod':'w', 'readerror':'404', 'writeerror':'405'},
             'cmi.interactions.n.time':{'pattern':_this.CMIIndex, 'format':_this.CMITime, 'mod':'w', 'readerror':'404', 'writeerror':'405'},
             'cmi.interactions.n.type':{'pattern':_this.CMIIndex, 'format':_this.CMIType, 'mod':'w', 'readerror':'404', 'writeerror':'405'},
             'cmi.interactions.n.correct_responses._count':{'pattern':_this.CMIIndex, 'mod':'r', 'defaultvalue':'0', 'writeerror':'402'},
             'cmi.interactions.n.correct_responses.n.pattern':{'pattern':_this.CMIIndex, 'format':_this.CMIFeedback, 'mod':'w', 'readerror':'404', 'writeerror':'405'},
             'cmi.interactions.n.weighting':{'pattern':_this.CMIIndex, 'format':_this.CMIDecimal, 'range':_this.weighting_range, 'mod':'w', 'readerror':'404', 'writeerror':'405'},
             'cmi.interactions.n.student_response':{'pattern':_this.CMIIndex, 'format':_this.CMIFeedback, 'mod':'w', 'readerror':'404', 'writeerror':'405'},
             'cmi.interactions.n.result':{'pattern':_this.CMIIndex, 'format':_this.CMIResult, 'mod':'w', 'readerror':'404', 'writeerror':'405'},
             'cmi.interactions.n.latency':{'pattern':_this.CMIIndex, 'format':_this.CMITimespan, 'mod':'w', 'readerror':'404', 'writeerror':'405'},
             'nav.event':{'defaultvalue':'', 'format':_this.NAVEvent, 'mod':'w', 'readerror':'404', 'writeerror':'405'}
            };
           //
           // Datamodel inizialization
           //    
           // Navigation Object      
           var nav = new Object();
           cmi.interactions = new Object();
           for (element in datamodel) {    
             if (element.match(/\.n\./) == null) {
               if ((typeof eval('datamodel["' + element + '"].defaultvalue')) != 'undefined') {
                 eval(element+' = datamodel["' + element + '"].defaultvalue;');
               } else {
                 eval(element+' = "";');
               }
             }
           }

           console.log(datamodel);
          
           _this.data = data;
           _this.cmi = cmi;
           _this.datamodel = datamodel; 
        }
      _this.pingTimer = setInterval(_this.Ping,300000); //5 Min
    }
    );
}

//---------------------------------------------------------------------------------
//Functions to Call the SCORM API
//SCORM 1.2 RTE API LMSInitialize
SCORMAPI.prototype.LMSInitialize = function() {
  var _this = this;
  _this.errorCode = "0";
   if (!_this.Initialized) {     
    _this.DoSetLog("In SCORM_Initialize"); 
    _this.Initialized = true;
    var _this = this;
    _this.DoSetLog('Initialize : ' + this.LMSGetErrorString(_this.errorCode));
    return "true";
  } else {
    _this.errorCode = "101";
  }
  _this.DoSetLog('Initialize : ' + this.LMSGetErrorString(_this.errorCode));
  return "false";
};

//SCORM 1.2 RTE API LMSGetValue
SCORMAPI.prototype.LMSGetValue = function(element) {
  var _this = this;
  this.errorCode = "0";
 
  if (this.Initialized) {
    this.DoSetLog("In LMSGetValue"); 
    if (element !="") {
        expression = new RegExp(_this.CMIIndex,'g');     
        //elementmodel = String(element).replace(expression,'.n.');
        elementmodel = element.replace(expression,'.n.');
        if ((typeof eval('_this.datamodel["' + elementmodel + '"]')) != "undefined") {
            
            if (eval('_this.datamodel["' + elementmodel + '"].mod') != 'w') {
                element = String(element).replace(expression, "_$1.");                 
                elementIndexes = element.split('.');
                subelement = 'cmi';
                var i = 1;
                while ((i < elementIndexes.length)) {
                    subelement += '.' + elementIndexes[i++];
                }
                if (subelement == element) {
                  _this.errorCode = "0";
                  _this.DoSetLog("In LMSGetValue" + element + "=" + eval('_this.' + element));
                  
                  return eval('_this.' + element);
                } else {
                    _this.errorCode = "0"; // Need to check if it is the right errorCode
                }
            } else {
                _this.errorCode = eval('_this.datamodel["' + elementmodel + '"].readerror');
            }
        } else {
            childrenstr = '._children';
            countstr = '._count';
            if (elementmodel.substr(elementmodel.length-childrenstr.length, elementmodel.length) == childrenstr) {
                parentmodel = elementmodel.substr(0, elementmodel.length - childrenstr.length);
                if ((typeof eval('_this.datamodel["' + parentmodel + '"]')) != "undefined") {
                    _this.errorCode = "202";
                } else {
                    _this.errorCode = "201";
                }
            } else if (elementmodel.substr(elementmodel.length-countstr.length, elementmodel.length) == countstr) {
                parentmodel = elementmodel.substr(0, elementmodel.length - countstr.length);
                if ((typeof eval('_this.datamodel["' + parentmodel + '"]')) != "undefined") {
                    _this.errorCode = "203";
                } else {
                    _this.errorCode = "201";
                }
            } else {
                _this.errorCode = "201";
            }
        }
    } else {
        _this.errorCode = "201";
    }
  } else {
      this.errorCode = "301";
  }
  this.DoSetLog('GetValue(' + element + ') -> ' + this.LMSGetErrorString(this.errorCode));
  return "";
};

//SCORM 1.2 RTE API LMSSetValue
SCORMAPI.prototype.LMSSetValue = function (element, value) {

  var _this = this;
  if (this.Initialized) {
      this.DoSetLog("In LMSSetValue"); 
      _this.errorCode = "0";    
      if (element != "") {

          expression = new RegExp(_this.CMIIndex, 'g');
          elementmodel = String(element).replace(expression, '.n.');
          
          if ((typeof eval('_this.datamodel["' + elementmodel + '"]')) != "undefined") {
              if (eval('_this.datamodel["' + elementmodel + '"].mod') != 'r') {
                  expression = new RegExp(eval('_this.datamodel["' + elementmodel + '"].format'));
                  value = value+'';
                  matches = value.match(expression);
                  
                  if (matches != null) {                     
                      //Create dynamic data model element
                      if (element != elementmodel) {
                          elementIndexes = element.split('.');
                          subelement = 'cmi';
                          for (i = 1; i < elementIndexes.length - 1; i++) {
                              elementIndex = elementIndexes[i];
                              if (elementIndexes[i + 1].match(/^\d+$/)) {
                                  if ((typeof eval('_this.' + subelement + '.' + elementIndex)) == "undefined") {
                                      eval('_this.' + subelement + '.' + elementIndex + ' = new Object();');
                                      eval('_this.' + subelement + '.' + elementIndex + '._count = 0;');                                      
                                  }
                                  if (elementIndexes[i+1] == eval('_this.' + subelement + '.' + elementIndex + '._count')) {
                                      eval('_this.' + subelement + '.' + elementIndex + '._count++;');
                                  }
                                  if (elementIndexes[i+1] > eval('_this.' + subelement + '.' + elementIndex+'._count')) {
                                      _this.errorCode = "201";
                                  }
                                  
                                  subelement = subelement.concat('.' + elementIndex + '_' + elementIndexes[i + 1]);
                                  
                                  i++;
                              } else {
                                  subelement = subelement.concat('.' + elementIndex);
                              }
                              if ((typeof eval('_this.' + subelement)) == "undefined") {
                                  eval('_this.' + subelement+' = new Object();');
                                  if (subelement.substr(0,14) == 'cmi.objectives') {
                                      eval('_this.' + subelement+'.score = new Object();');
                                      eval('_this.' + subelement+'.score._children = _this.score_children;');
                                      eval('_this.' + subelement+'.score.raw = "";');
                                      eval('_this.' + subelement+'.score.min = "";');
                                      eval('_this.' + subelement+'.score.max = "";');
                                  }
                                  if (subelement.substr(0,16) == 'cmi.interactions') {
                                      eval('_this.' + subelement+'.objectives = new Object();');
                                      eval('_this.' + subelement+'.objectives._count = 0;');
                                      eval('_this.' + subelement+'.correct_responses = new Object();');
                                      eval('_this.' + subelement+'.correct_responses._count = 0;');
                                  }
                              }
                          }
                          element = subelement.concat('.' + elementIndexes[elementIndexes.length-1]);
                      }
                      
                      //Store data
                      if (_this.errorCode == "0") {
                          
                          if ((typeof eval('_this.datamodel["' + elementmodel + '"].range')) != "undefined") {
                              range = eval('_this.datamodel["' + elementmodel + '"].range');
                              ranges = range.split('#');
                              value = value * 1.0;
                              if ((value >= ranges[0]) && (value <= ranges[1])) {
                                  eval('_this.' + element + '=value;');
                                  _this.errorCode = "0";  
                                  _this.DoSetLog('SetValue('+element+','+ value+') -> OK ');
                                  return "true";
                              } else {
                                  _this.errorCode = eval('_this.datamodel["' + elementmodel + '"].writeerror');
                              }
                          } else {
                              if (element == 'cmi.comments') {
                                  _this.cmi.comments = _this.cmi.comments + value;
                              } else {                                
                                  eval('_this.' + element + '=value;');
                              }                              
                              _this.errorCode = "0"; 
                              _this.DoSetLog('SetValue('+element+','+ value+') -> OK ');
                              return "true";
                          }

                      }
                  } else {
                      _this.errorCode = eval('_this.datamodel["' + elementmodel + '"].writeerror');
                  }
              } else {
                  _this.errorCode = eval('_this.datamodel["' + elementmodel + '"].writeerror');
              }
          } else {
              _this.errorCode = "201";
          }
      } else {
          _this.errorCode = "201";
      }
  } else {  
      this.errorCode = "301";
  }
  this.DoSetLog('SetValue('+element+', '+value+') -> ' + this.LMSGetErrorString(this.errorCode));
  return "true";
};

//SCORM 1.2 RTE API LMSFinish
SCORMAPI.prototype.LMSFinish = function() {

  var result, _this = this;
  _this.errorCode = "0";

  if (_this.Initialized) {
    //_this.DoSetLog('In LMSFinish');
      _this.Initialized = false;
     
      result = _this.StoreData(this.cmi, true);
    return 'true';
  } else {
   _this.errorCode = "301";
  }
  this.DoSetLog('Terminate : ' + this.LMSGetErrorString(this.errorCode));
  return "false";
};

//SCORM 1.2 RTE API LMSCommit
SCORMAPI.prototype.LMSCommit = function (param) {

    var result, _this = this;
    this.errorCode = "0";

    if (this.Initialized) {
        this.DoSetLog('In LMSCommit');
        result = _this.StoreData(this.cmi, false);
        this.DoSetLog('Data Commited');
      return 'true';
    } else {
        this.errorCode = "301";
    } 
    this.DoSetLog('Commited: ' + _this.LMSGetErrorString(_this.errorCode));
    return "false";
};

SCORMAPI.prototype.LMSGetLastError = function() {
  return this.errorCode;
};

SCORMAPI.prototype.LMSGetErrorString = function(errNo) {
  switch (errNo) {
    case '0':
      return 'No error';
    case '101':
      return 'General exception';
    case '201':
      return 'Invalid argument error';
    case '202':
      return 'Element cannot have children';
    case '203':
      return 'Element not an array - cannot have count';
    case '301':
      return 'Not initialized';
    case '401':
      return 'Not implemented error';
    case '402':
      return 'Invalid set value, element is a keyword';
    case '403':
      return 'Element is read only';
    case '404':
      return 'Element is read only';
    case '405':
      return 'Incorrect data type';
    default:
      return 'Default error code';
  }
};

SCORMAPI.prototype.LMSGetDiagnostic = function(errNo) {
  return this.LMSGetErrorString(errNo);
};

//SCORM 1.2 General API StoreData
SCORMAPI.prototype.StoreData = function(data, storetotaltime) {
  var _this = this;
  var datastring = '';
  this.statusChanged = true; 
  
  if (storetotaltime) {
        
      if (_this.cmi.core.lesson_status == _this.SCORM_NOT_ATTEMPTED) {
          data.core.lesson_status = _this.SCORM_COMPLETED;
      }
	 
      if (this.cmi.core.lesson_mode == this.SCORM_NORMAL) {
          if (this.cmi.core.credit == this.SCORM_CREDIT) {
              if (this.cmi.student_data.mastery_score !== '' && this.cmi.core.score.raw !== '') {
                  if (parseFloat(this.cmi.core.score.raw) >= parseFloat(this.cmi.student_data.mastery_score)) {
                      data.core.lesson_status = this.SCORM_PASSED;
                  } else {
                      data.core.lesson_status = this.SCORM_FAILED;
                  }
              }
          } else {
            data.core.lesson_status = this.cmi.core.lesson_status;
          }
      }

      if (this.cmi.core.lesson_mode == this.SCORM_BROWSE) {
          if (this.datamodel['cmi.core.lesson_status'].defaultvalue == '' && this.cmi.core.lesson_status == 'not attempted') {
              data.cmi.core.lesson_status = this.SCORM_BROWSE;
          }
      }
      datastring = this.CollectData(data, 'cmi');
      datastring += this.TotalTime();
  } else {
      datastring = this.CollectData(data, 'cmi');
  }
  
  delete this.data.cmi_core_student_id;
  delete this.data.cmi_core_student_name;
  delete this.data.cmi_core_score_raw;
  delete this.data.cmi_core_score_max;
  delete this.data.cmi_core_score_min;
  delete this.data.cmi_score_scaled;
  delete this.data.cmi_core_lesson_mode;
  delete this.data.cmi_core_lesson_location;
  delete this.data.cmi_core_credit;
  delete this.data.cmi_core_exit;
  delete this.data.cmi_core_entry;
  delete this.data.cmi_suspend_data;
  delete this.data.cmi_core_lesson_status;
  delete this.data.cmi_comments;
  delete this.data.cmi_core_total_time;
  delete this.data.cmi_core_session_time;  
  delete this.data.cmi_launch_data;

  var url = window.location.protocol + '//' + window.location.host;
  var pathname = window.location.pathname;
  var pos = pathname.lastIndexOf('/');
  url = url + pathname.substring(0, pos + 1) + "course/strack?scorm=" + this.scorm +
      '&user=' + this.user +
      '&sco=' + this.sco + '&version=' + this.vs;

  var myRequest = NewHttpReq();
  //DoRequests(myRequest, url, "datakey=" + datastring);
  
  
  $.ajax({
        url: url,
        dataType: 'json',
        async: true,
        type : "POST",
        data: _this.data,
        success: function(data){
        if(_this.data['cmi_core_lesson_status'] && _this.statusChanged) _this.sentResult = true;    
          return _this.errorCode = 0;
        },
        error : function(error){

        }
  });
  
  return "true";
};

//SCORM 1.2 General API CollectData
SCORMAPI.prototype.CollectData = function(data, parent) {
    var _this = this;
    var datastring = '';
    for (property in data) {
        if (typeof data[property] == 'object') {
            datastring += this.CollectData(data[property], parent + '.' + property);
        } else {
            element = parent+'.'+property;
            expression = new RegExp(_this.CMIIndex,'g');
            elementmodel = String(element).replace(expression,'.n.');
			
            // ignore the session time element
            if (element != "cmi.core.session_time") {
                // check if this specific element is not defined in the datamodel,
                if ((eval('typeof this.datamodel["' + element + '"]')) == "undefined"
                    && (eval('typeof this.datamodel["' + elementmodel + '"]')) != "undefined") {                        
                    eval('this.datamodel["' + element + '"] = this.CloneObj(this.datamodel["' + elementmodel + '"]);');
                }

                // check if the current element exists in the datamodel

                if ((typeof eval('this.datamodel["' + element + '"]')) != "undefined") {
                    // make sure this is not a read only element
                    if (eval('this.datamodel["' + element + '"].mod') != 'r') {
                        elementstring = '&' + this.underscore(element) + '=' + encodeURIComponent(data[property]);
                        // check if the element has a default value                        
                        if ((typeof eval('this.datamodel["' + element + '"].defaultvalue')) != "undefined") {                          
                            if (eval('this.datamodel["' + element + '"].defaultvalue') != "" || 
                              element == 'cmi.core.score.raw' ||
                              element == 'cmi.core.score.max' ||
                              element == 'cmi.core.score.min' ||
                              element == 'cmi.suspend_data' ||
                              element == 'cmi.core.exit' ||
                              element == 'cmi.core.lesson_location' ||
                              element == 'cmi.comments') {
                                // append the URI fragment to the string we plan to commit
                                datastring += elementstring;
                                //this.data[this.underscore(element)] = encodeURIComponent(data[property]);
                                this.data[this.underscore(element)] = data[property];
								
                                // update the element default to reflect the current committed value
                                eval('this.datamodel["' + element+'"].defaultvalue = data[property];');                                
                            }
                        } else {
                            // append the URI fragment to the string we plan to commit
                            datastring += elementstring;
                            //this.data[this.underscore(element)] = encodeURIComponent(data[property]);
                            this.data[this.underscore(element)] = data[property];
                            // no default value for the element, so set it now
                            eval('this.datamodel["' + element + '"].defaultvalue= data[property];');
                        }
                    }
                }
            }
        }
    }
	
    return datastring;
};

SCORMAPI.prototype.underscore = function(str) {
    str = String(str).replace(/.N/g,".");
    return str.replace(/\./g,"__");
}

SCORMAPI.prototype.CloneObj = function(obj){
    if(obj == null || typeof(obj) != 'object') {
        return obj;
    }

    var temp = new obj.constructor(); // changed (twice)
    for(var key in obj) {
        temp[key] = this.CloneObj(obj[key]);
    }

    return temp;
};

SCORMAPI.prototype.AddTime = function(first, second) {
  var sFirst = first.split(":");
  var sSecond = second.split(":");
  var cFirst = sFirst[2].split(".");
  var cSecond = sSecond[2].split(".");
  var change = 0;

  FirstCents = 0;  //Cents
  if (cFirst.length > 1) {
      FirstCents = parseInt(cFirst[1], 10);
  }

  SecondCents = 0;

  if (cSecond.length > 1) {
      SecondCents = parseInt(cSecond[1], 10);
  }

  var cents = FirstCents + SecondCents;

  change = Math.floor(cents / 100);
  cents = cents - (change * 100);

  if (Math.floor(cents) < 10) {
      cents = "0" + cents.toString();
  }

  var secs = parseInt(cFirst[0],10)+parseInt(cSecond[0],10) + change;  //Seconds

  change = Math.floor(secs / 60);
  secs = secs - (change * 60);

  if (Math.floor(secs) < 10) {
      secs = "0" + secs.toString();
  }

  mins = parseInt(sFirst[1],10)+parseInt(sSecond[1],10) + change;   //Minutes
  change = Math.floor(mins / 60);
  mins = mins - (change * 60);

  if (mins < 10) {
      mins = "0" + mins.toString();
  }

  hours = parseInt(sFirst[0],10)+parseInt(sSecond[0],10) + change;  //Hours

  if (hours < 10) {
      hours = "0" + hours.toString();
  }

  if (cents != '0') {
      return hours + ":" + mins + ":" + secs + '.' + cents;
  } else {
      return hours + ":" + mins + ":" + secs;
  }
};

SCORMAPI.prototype.TotalTime = function() {
  
  if (this.cmi.core.total_time == "null") {
		total_time = "00:00:00";
  } else {
		total_time = this.cmi.core.total_time;
  }

  if (this.cmi.core.session_time == "null") {
	  session_time = "00:00:00";
  } else {
		session_time = this.cmi.core.session_time;
  }

  var total_time = this.AddTime(total_time, session_time);

  this.data[this.underscore('cmi__core__session_time')] = this.cmi.core.session_time;
  this.data[this.underscore('cmi__core__total_time')] = total_time;
 
  return '&' + this.underscore('cmi.core.total_time') + '=' + encodeURIComponent(total_time);
};

SCORMAPI.prototype.DoSetLog = function(log) {
    console.log(log);
};