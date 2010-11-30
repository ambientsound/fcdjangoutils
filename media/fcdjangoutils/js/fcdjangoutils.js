var fcdjangoutils = {

};

String.prototype.format = function(){
    var res = "";
    var aIdx = 0;

    var idx = 0;

    while(idx < this.length){
	switch(this[idx]){
	case '%':
	    switch(this[idx+1]){
	    case '%':
		res += '%';
		idx+=2;
		break;
	    case 's':
		res += (new String(arguments[aIdx++])).toString();
		idx+=2;
		break;

	    case '(':
		var end = this.indexOf(')', idx);
		if(end == -1)
		    throw "Invalid format string";

		var name = this.substr(idx+2, end-idx-2);
		idx = end+1;
		switch(this[idx]){
		case 's':
		    res += (new String(arguments[0][name])).toString();
		    idx++;
		    break;

		default:
		    throw "Unsupported format option: '" + this[idx] + "'";

		}
		break;
	    default:
		throw "Unsupported format option: '" + this[idx+1] + "'";
	    }
	    break;

	default:
	    res += this[idx];
	    idx++;
	    break;
	}
    }

    return res;
};

fcdjangoutils.message = function(msg, id, style){
    style = style || 'message';
    var lst = $('#messages');
    var line = $('<li>').text(msg).addClass(style);
    if(id) {
	$('#' + id, lst).detach();
	line.attr('id', id);
    }
    lst.append(line);
}

fcdjangoutils.error = function(msg, id){
    fcdjangoutils.message(msg,id, 'error');
}

fcdjangoutils.warning = function(msg, id){
    fcdjangoutils.message(msg, id, 'warning');
}

fcdjangoutils.fromIsoDate = function(txt){
    var darr = txt.split("-");
    if(darr.length != 3)
	return null;
    // Input is iso date, but javascript expects
    // month component in range 0..11,
    // so we subtract one from the month
    darr[1]-= 1;
    return new Date(Date.UTC.apply(null, darr));
};

fcdjangoutils.toIsoDate = function (date){
    return "" + date.getFullYear() + "-" + (date.getMonth()+1)+"-" + date.getDate();
}

/**
 * Mangles a valid form name attribute into something that can be used as a dom id by replacing all unholy characters with underscores.
 */
fcdjangoutils.nameToId = function (name){
  return name.replace(/[^a-zA-Z0-9_]/g,'_');
};

/* Make sure the application works even if console debugging is used without an active Firebug. */
if(typeof(console) === 'undefined') {
    var console = {}
    console.log = console.error = console.info = console.debug = console.warn = console.trace = console.dir = console.dirxml = console.group = console.groupEnd = console.time = console.timeEnd = console.assert = console.profile = function() {};
}

$.extend(
  $.validator.messages,
  {
    required: gettext("This field is required."),
    remote: gettext("Please fix this field."),
    email: gettext("Please enter a valid email address."),
    url: gettext("Please enter a valid URL."),
    date: gettext("Please enter a valid date."),
    dateISO: gettext("Please enter a valid date (ISO)."),
    number: gettext("Please enter a valid number."),
    digits: gettext("Please enter only digits."),
    creditcard: gettext("Please enter a valid credit card number."),
    equalTo: gettext("Please enter the same value again."),
    accept: gettext("Please enter a value with a valid extension."),
    maxlength: $.validator.format(gettext("Please enter no more than {0} characters.")),
    minlength: $.validator.format(gettext("Please enter at least {0} characters.")),
    rangelength: $.validator.format(gettext("Please enter a value between {0} and {1} characters long.")),
    range: $.validator.format(gettext("Please enter a value between {0} and {1}.")),
    max: $.validator.format(gettext("Please enter a value less than or equal to {0}.")),
    min: $.validator.format(gettext("Please enter a value greater than or equal to {0}."))
  });
