///////////////////////////////////////////////////////////////////////////////
// 共用功能

var syntaxHighlight = function (json) {
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
    var cls = 'number';
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'key';
      } else {
        cls = 'string';
      }
    } else if (/true|false/.test(match)) {
      cls = 'boolean';
    } else if (/null/.test(match)) {
      cls = 'null';
    }
    return '<span class="' + cls + '">' + match + '</span>';
  });
};

var addCodeToLog = function (code) {
  var pre = document.createElement('pre');
  pre.innerHTML = code;
  $(".logs").append(pre);
};

var addJsonToLog = function (input, obj_name) {
  obj_name = typeof obj_name !== 'undefined' ? obj_name : '';

  if (typeof input === 'object') {
    var pretty_json = JSON.stringify(input, undefined, 2);
    if (obj_name != '') {
      addCodeToLog(obj_name + '<br>' + syntaxHighlight(pretty_json));
    } 
    else {
      addCodeToLog(syntaxHighlight(pretty_json));
    }
  } else {
    addCodeToLog(input);
  }
};

var addToLog = function (txt) {
  $(".logs").append("<br>").append(txt);
};

var addBoldToLog = function (txt) {
  addToLog('<b>' + txt + '</b>');
};

var addMomentToLog = function (moment) {
  addBoldToLog(moment.format('YYYY-MM-DD HH:mm:ss.SSS Z'));
};

var addBarToLog = function () {
  $(".logs").append("<hr>");
};