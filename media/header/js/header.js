/* hashtable */
var Hashtable=(function(){var p="function";var n=(typeof Array.prototype.splice==p)?function(s,r){s.splice(r,1)}:function(u,t){var s,v,r;if(t===u.length-1){u.length=t}else{s=u.slice(t+1);u.length=t;for(v=0,r=s.length;v<r;++v){u[t+v]=s[v]}}};function a(t){var r;if(typeof t=="string"){return t}else{if(typeof t.hashCode==p){r=t.hashCode();return(typeof r=="string")?r:a(r)}else{if(typeof t.toString==p){return t.toString()}else{try{return String(t)}catch(s){return Object.prototype.toString.call(t)}}}}}function g(r,s){return r.equals(s)}function e(r,s){return(typeof s.equals==p)?s.equals(r):(r===s)}function c(r){return function(s){if(s===null){throw new Error("null is not a valid "+r)}else{if(typeof s=="undefined"){throw new Error(r+" must not be undefined")}}}}var q=c("key"),l=c("value");function d(u,s,t,r){this[0]=u;this.entries=[];this.addEntry(s,t);if(r!==null){this.getEqualityFunction=function(){return r}}}var h=0,j=1,f=2;function o(r){return function(t){var s=this.entries.length,v,u=this.getEqualityFunction(t);while(s--){v=this.entries[s];if(u(t,v[0])){switch(r){case h:return true;case j:return v;case f:return[s,v[1]]}}}return false}}function k(r){return function(u){var v=u.length;for(var t=0,s=this.entries.length;t<s;++t){u[v+t]=this.entries[t][r]}}}d.prototype={getEqualityFunction:function(r){return(typeof r.equals==p)?g:e},getEntryForKey:o(j),getEntryAndIndexForKey:o(f),removeEntryForKey:function(s){var r=this.getEntryAndIndexForKey(s);if(r){n(this.entries,r[0]);return r[1]}return null},addEntry:function(r,s){this.entries[this.entries.length]=[r,s]},keys:k(0),values:k(1),getEntries:function(s){var u=s.length;for(var t=0,r=this.entries.length;t<r;++t){s[u+t]=this.entries[t].slice(0)}},containsKey:o(h),containsValue:function(s){var r=this.entries.length;while(r--){if(s===this.entries[r][1]){return true}}return false}};function m(s,t){var r=s.length,u;while(r--){u=s[r];if(t===u[0]){return r}}return null}function i(r,s){var t=r[s];return(t&&(t instanceof d))?t:null}function b(t,r){var w=this;var v=[];var u={};var x=(typeof t==p)?t:a;var s=(typeof r==p)?r:null;this.put=function(B,C){q(B);l(C);var D=x(B),E,A,z=null;E=i(u,D);if(E){A=E.getEntryForKey(B);if(A){z=A[1];A[1]=C}else{E.addEntry(B,C)}}else{E=new d(D,B,C,s);v[v.length]=E;u[D]=E}return z};this.get=function(A){q(A);var B=x(A);var C=i(u,B);if(C){var z=C.getEntryForKey(A);if(z){return z[1]}}return null};this.containsKey=function(A){q(A);var z=x(A);var B=i(u,z);return B?B.containsKey(A):false};this.containsValue=function(A){l(A);var z=v.length;while(z--){if(v[z].containsValue(A)){return true}}return false};this.clear=function(){v.length=0;u={}};this.isEmpty=function(){return !v.length};var y=function(z){return function(){var A=[],B=v.length;while(B--){v[B][z](A)}return A}};this.keys=y("keys");this.values=y("values");this.entries=y("getEntries");this.remove=function(B){q(B);var C=x(B),z,A=null;var D=i(u,C);if(D){A=D.removeEntryForKey(B);if(A!==null){if(!D.entries.length){z=m(v,C);n(v,z);delete u[C]}}}return A};this.size=function(){var A=0,z=v.length;while(z--){A+=v[z].entries.length}return A};this.each=function(C){var z=w.entries(),A=z.length,B;while(A--){B=z[A];C(B[0],B[1])}};this.putAll=function(H,C){var B=H.entries();var E,F,D,z,A=B.length;var G=(typeof C==p);while(A--){E=B[A];F=E[0];D=E[1];if(G&&(z=w.get(F))){D=C(F,z,D)}w.put(F,D)}};this.clone=function(){var z=new b(t,r);z.putAll(w);return z}}return b})();
/* number formatter */
;(function(k){var a=new Hashtable();var f=["ae","au","ca","cn","eg","gb","hk","il","in","jp","sk","th","tw","us"];var b=["at","br","de","dk","es","gr","it","nl","pt","tr","vn"];var i=["cz","fi","fr","ru","se","pl"];var d=["ch"];var g=[[".",","],[",","."],[","," "],[".","'"]];var c=[f,b,i,d];function j(n,l,m){this.dec=n;this.group=l;this.neg=m}function h(){for(var l=0;l<c.length;l++){localeGroup=c[l];for(var m=0;m<localeGroup.length;m++){a.put(localeGroup[m],l)}}}function e(l,r){if(a.size()==0){h()}var q=".";var o=",";var p="-";if(r==false){if(l.indexOf("_")!=-1){l=l.split("_")[1].toLowerCase()}else{if(l.indexOf("-")!=-1){l=l.split("-")[1].toLowerCase()}}}var n=a.get(l);if(n){var m=g[n];if(m){q=m[0];o=m[1]}}return new j(q,o,p)}k.fn.formatNumber=function(l,m,n){return this.each(function(){if(m==null){m=true}if(n==null){n=true}var p;if(k(this).is(":input")){p=new String(k(this).val())}else{p=new String(k(this).text())}var o=k.formatNumber(p,l);if(m){if(k(this).is(":input")){k(this).val(o)}else{k(this).text(o)}}if(n){return o}})};k.formatNumber=function(q,w){var w=k.extend({},k.fn.formatNumber.defaults,w);var l=e(w.locale.toLowerCase(),w.isFullLocale);var n=l.dec;var u=l.group;var o=l.neg;var m="0#-,.";var t="";var s=false;for(var r=0;r<w.format.length;r++){if(m.indexOf(w.format.charAt(r))==-1){t=t+w.format.charAt(r)}else{if(r==0&&w.format.charAt(r)=="-"){s=true;continue}else{break}}}var v="";for(var r=w.format.length-1;r>=0;r--){if(m.indexOf(w.format.charAt(r))==-1){v=w.format.charAt(r)+v}else{break}}w.format=w.format.substring(t.length);w.format=w.format.substring(0,w.format.length-v.length);var p=new Number(q);return k._formatNumber(p,w,v,t,s)};k._formatNumber=function(m,q,n,I,t){var q=k.extend({},k.fn.formatNumber.defaults,q);var G=e(q.locale.toLowerCase(),q.isFullLocale);var F=G.dec;var w=G.group;var l=G.neg;var z=false;if(isNaN(m)){if(q.nanForceZero==true){m=0;z=true}else{return null}}if(n=="%"){m=m*100}var B="";if(q.format.indexOf(".")>-1){var H=F;var u=q.format.substring(q.format.lastIndexOf(".")+1);if(q.round==true){m=new Number(m.toFixed(u.length))}else{var M=m.toString();M=M.substring(0,M.lastIndexOf(".")+u.length+1);m=new Number(M)}var A=m%1;var C=new String(A.toFixed(u.length));C=C.substring(C.lastIndexOf(".")+1);for(var J=0;J<u.length;J++){if(u.charAt(J)=="#"&&C.charAt(J)!="0"){H+=C.charAt(J);continue}else{if(u.charAt(J)=="#"&&C.charAt(J)=="0"){var r=C.substring(J);if(r.match("[1-9]")){H+=C.charAt(J);continue}else{break}}else{if(u.charAt(J)=="0"){H+=C.charAt(J)}}}}B+=H}else{m=Math.round(m)}var v=Math.floor(m);if(m<0){v=Math.ceil(m)}var E="";if(q.format.indexOf(".")==-1){E=q.format}else{E=q.format.substring(0,q.format.indexOf("."))}var L="";if(!(v==0&&E.substr(E.length-1)=="#")||z){var x=new String(Math.abs(v));var p=9999;if(E.lastIndexOf(",")!=-1){p=E.length-E.lastIndexOf(",")-1}var o=0;for(var J=x.length-1;J>-1;J--){L=x.charAt(J)+L;o++;if(o==p&&J!=0){L=w+L;o=0}}if(E.length>L.length){var K=E.indexOf("0");if(K!=-1){var D=E.length-K;var s=E.length-L.length-1;while(L.length<D){var y=E.charAt(s);if(y==","){y=w}L=y+L;s--}}}}if(!L&&E.indexOf("0",E.length-1)!==-1){L="0"}B=L+B;if(m<0&&t&&I.length>0){I=l+I}else{if(m<0){B=l+B}}if(!q.decimalSeparatorAlwaysShown){if(B.lastIndexOf(F)==B.length-1){B=B.substring(0,B.length-1)}}B=I+B+n;return B};k.fn.parseNumber=function(l,m,o){if(m==null){m=true}if(o==null){o=true}var p;if(k(this).is(":input")){p=new String(k(this).val())}else{p=new String(k(this).text())}var n=k.parseNumber(p,l);if(n){if(m){if(k(this).is(":input")){k(this).val(n.toString())}else{k(this).text(n.toString())}}if(o){return n}}};k.parseNumber=function(s,x){var x=k.extend({},k.fn.parseNumber.defaults,x);var m=e(x.locale.toLowerCase(),x.isFullLocale);var p=m.dec;var v=m.group;var q=m.neg;var l="1234567890.-";while(s.indexOf(v)>-1){s=s.replace(v,"")}s=s.replace(p,".").replace(q,"-");var w="";var o=false;if(s.charAt(s.length-1)=="%"||x.isPercentage==true){o=true}for(var t=0;t<s.length;t++){if(l.indexOf(s.charAt(t))>-1){w=w+s.charAt(t)}}var r=new Number(w);if(o){r=r/100;var u=w.indexOf(".");if(u!=-1){var n=w.length-u-1;r=r.toFixed(n+2)}else{r=r.toFixed(w.length-1)}}return r};k.fn.parseNumber.defaults={locale:"us",decimalSeparatorAlwaysShown:false,isPercentage:false,isFullLocale:false};k.fn.formatNumber.defaults={format:"#,###.00",locale:"us",decimalSeparatorAlwaysShown:false,nanForceZero:true,round:true,isFullLocale:false};Number.prototype.toFixed=function(l){return k._roundNumber(this,l)};k._roundNumber=function(n,m){var l=Math.pow(10,m||0);var o=String(Math.round(n*l)/l);if(m>0){var p=o.indexOf(".");if(p==-1){o+=".";p=0}else{p=o.length-(p+1)}while(p<m){o+="0";p++}}return o}})(jQuery);
/*! http://mths.be/placeholder v2.0.7 by @mathias */
;(function(f,h,$){var a='placeholder' in h.createElement('input'),d='placeholder' in h.createElement('textarea'),i=$.fn,c=$.valHooks,k,j;if(a&&d){j=i.placeholder=function(){return this};j.input=j.textarea=true}else{j=i.placeholder=function(){var l=this;l.filter((a?'textarea':':input')+'[placeholder]').not('.placeholder').bind({'focus.placeholder':b,'blur.placeholder':e}).data('placeholder-enabled',true).trigger('blur.placeholder');return l};j.input=a;j.textarea=d;k={get:function(m){var l=$(m);return l.data('placeholder-enabled')&&l.hasClass('placeholder')?'':m.value},set:function(m,n){var l=$(m);if(!l.data('placeholder-enabled')){return m.value=n}if(n==''){m.value=n;if(m!=h.activeElement){e.call(m)}}else{if(l.hasClass('placeholder')){b.call(m,true,n)||(m.value=n)}else{m.value=n}}return l}};a||(c.input=k);d||(c.textarea=k);$(function(){$(h).delegate('form','submit.placeholder',function(){var l=$('.placeholder',this).each(b);setTimeout(function(){l.each(e)},10)})});$(f).bind('beforeunload.placeholder',function(){$('.placeholder').each(function(){this.value=''})})}function g(m){var l={},n=/^jQuery\d+$/;$.each(m.attributes,function(p,o){if(o.specified&&!n.test(o.name)){l[o.name]=o.value}});return l}function b(m,n){var l=this,o=$(l);if(l.value==o.attr('placeholder')&&o.hasClass('placeholder')){if(o.data('placeholder-password')){o=o.hide().next().show().attr('id',o.removeAttr('id').data('placeholder-id'));if(m===true){return o[0].value=n}o.focus()}else{l.value='';o.removeClass('placeholder');l==h.activeElement&&l.select()}}}function e(){var q,l=this,p=$(l),m=p,o=this.id;if(l.value==''){if(l.type=='password'){if(!p.data('placeholder-textinput')){try{q=p.clone().attr({type:'text'})}catch(n){q=$('<input>').attr($.extend(g(this),{type:'text'}))}q.removeAttr('name').data({'placeholder-password':true,'placeholder-id':o}).bind('focus.placeholder',b);p.data({'placeholder-textinput':q,'placeholder-id':o}).before(q)}p=p.removeAttr('id').hide().prev().attr('id',o).show()}p.addClass('placeholder');p[0].value=p.attr('placeholder')}else{p.removeClass('placeholder')}}}(this,document,jQuery));
/* Modernizr 2.6.2 (Custom Build) | MIT & BSD */
;window.Modernizr=function(a,b,c){function w(a){i.cssText=a}function x(a,b){return w(prefixes.join(a+";")+(b||""))}function y(a,b){return typeof a===b}function z(a,b){return!!~(""+a).indexOf(b)}function A(a,b){for(var d in a){var e=a[d];if(!z(e,"-")&&i[e]!==c)return b=="pfx"?e:!0}return!1}function B(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:y(f,"function")?f.bind(d||b):f}return!1}function C(a,b,c){var d=a.charAt(0).toUpperCase()+a.slice(1),e=(a+" "+m.join(d+" ")+d).split(" ");return y(b,"string")||y(b,"undefined")?A(e,b):(e=(a+" "+n.join(d+" ")+d).split(" "),B(e,b,c))}var d="2.6.2",e={},f=b.documentElement,g="modernizr",h=b.createElement(g),i=h.style,j,k={}.toString,l="Webkit Moz O ms",m=l.split(" "),n=l.toLowerCase().split(" "),o={},p={},q={},r=[],s=r.slice,t,u={}.hasOwnProperty,v;!y(u,"undefined")&&!y(u.call,"undefined")?v=function(a,b){return u.call(a,b)}:v=function(a,b){return b in a&&y(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=s.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(s.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(s.call(arguments)))};return e}),o.boxshadow=function(){return C("boxShadow")};for(var D in o)v(o,D)&&(t=D.toLowerCase(),e[t]=o[D](),r.push((e[t]?"":"no-")+t));return e.addTest=function(a,b){if(typeof a=="object")for(var d in a)v(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof enableClasses!="undefined"&&enableClasses&&(f.className+=" "+(b?"":"no-")+a),e[a]=b}return e},w(""),h=j=null,e._version=d,e._domPrefixes=n,e._cssomPrefixes=m,e.testProp=function(a){return A([a])},e.testAllProps=C,e}(this,this.document);
/* after transition plugin */
;(function(e){"use strict";e.Transitions={_names:{transition:"transitionend",OTransition:"oTransitionEnd",WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend"},_parseTimes:function(e){var t,n=e.split(/,\s*/);for(var r=0;r<n.length;r++)t=n[r],n[r]=parseFloat(t),t.match(/\ds/)&&(n[r]=n[r]*1e3);return n},getEvent:function(){var e=!1;for(var t in this._names)if(typeof document.body.style[t]!="undefined"){e=this._names[t];break}return this.getEvent=function(){return e},e},animFrame:function(e){var t=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.msRequestAnimationFrame;return t?this.animFrame=function(e){return t.call(window,e)}:this.animFrame=function(e){return setTimeout(e,10)},this.animFrame(e)},isSupported:function(){return this.getEvent()!==!1}},e.extend(e.fn,{afterTransition:function(t,n){typeof n=="undefined"&&(n=t,t=1);if(!e.Transitions.isSupported()){for(var r=0;r<this.length;r++)n.call(this[r],{type:"aftertransition",elapsedTime:0,propertyName:"",currentTarget:this[r]});return this}for(var r=0;r<this.length;r++){var i=e(this[r]),s=i.css("transition-property").split(/,\s*/),o=i.css("transition-duration"),u=i.css("transition-delay");o=e.Transitions._parseTimes(o),u=e.Transitions._parseTimes(u);var a,f,l,c,h;for(var p=0;p<s.length;p++)a=s[p],f=o[o.length==1?0:p],l=u[u.length==1?0:p],c=l+f*t,h=f*t/1e3,function(t,r,i,s){setTimeout(function(){e.Transitions.animFrame(function(){n.call(t[0],{type:"aftertransition",elapsedTime:s,propertyName:r,currentTarget:t[0]})})},i)}(i,a,c,h)}return this},transitionEnd:function(t){for(var n=0;n<this.length;n++)this[n].addEventListener(e.Transitions.getEvent(),function(e){t.call(this,e)});return this}})}).call(this,jQuery);

var Utils = {
	getPlural: function (num, forms) {
		var n = num % 100;
		var n1 = num % 10;
		
		if (n > 10 && n < 20)
		{
			return forms[2];
		}
		else if (n1 > 1 && n1 < 5)
		{
			return forms[1];
		}
		else if (n1 == 1)
		{
			return forms[0];
		} else {
			return forms[2];
		}
	}	
};

var HeaderBlock = Backbone.View.extend({
    clicked: false,
    observeClick: function () {
        $(document).click(_.bind(function (event) {
            if (!this.clicked) {
                this.blur();
            }
            this.clicked = false;
        }, this));
        this.$el.on('click', _.bind(function () {
            this.clicked = true;
        }, this));
    },
    observeEsc: function () {
        $(document).keyup(_.bind(function (event) {
            if (event.which == 27) {
                this.blur();
            }
        }, this));
    },
    observeScroll: function () {
    	$(document).scroll(_.bind(function (event) {
            this.blur();
        }, this));
    }
});

var CatalogueItemModel = Backbone.Model.extend({
	numbers: ['price'],
	numberFormat: {format:"#,###.##", locale:"ru"},
	autoFormatNumbers: function () {
		function formatNumber () {
			this.obj.set(this.attr + 'Formatted', $.formatNumber(this.obj.get(this.attr), this.obj.numberFormat));
		};
		for (var i = 0; i < this.numbers.length; i++) {
			var attr = this.numbers[i];
			this.bind('change:' + attr, formatNumber, {obj: this, attr: attr});
			formatNumber.call({obj: this, attr: attr});
		}
	},
	initialize: function () {
		this.autoFormatNumbers();
	}
});
 
var SearchItem = Backbone.View.extend({
    tagName: 'li',
    initialize: function () {
        this.template = _.template($('#t-search-item').html());
        
        this.model.bind('change', this.render, this);
        this.model.bind('destroy', this.remove, this);
    },
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
    }
});
var SearchResults = Backbone.Collection.extend({
    model: CatalogueItemModel,
    query: '',
    url: function () {
        return '/_terminal/search/lite/items.json?term=' + encodeURIComponent(this.query);
    },
    comparator: function (model) {
        return [model.get('type')];
    }
});
var HeaderSearch = HeaderBlock.extend({
    timeout: null,
    requests: 1,
    position: -1,
    events: {
    	'keydown': 'navigate',
        'focus .bb-query-field': 'focus',
        'keyup .bb-query-field': 'updateQuery',
        'click .bb-query-submit': 'sendQuery',
        'click .bb-result-all-link': 'submit'
    },
    initialize: function () {
    	this.$('.bb-query-field').placeholder();
    	if (Modernizr.boxshadow) {
    		this.$('.bb-query-field').parent().addClass('with-box-shadow');
    	}
    	
        this.collection = new SearchResults();
        this.collection.bind('reset', this.addAll, this);
        this.collection.bind('add remove reset', this.showResults, this);
        this.showResults();
        
        this.observeClick();
        this.observeEsc();
    },
    // Показ результатов
    add: function (model) {
        var item = new SearchItem({model: model});
        item.render();
        this.$(".bb-result-items").append(item.el);
    },
    addAll: function () {
        this.$(".bb-result-items").empty();
        this.collection.each(this.add, this);
    },
    showResults: function () {
    	this.requests--;
    	if (!this.requests) {
    		 this.$el.removeClass('is-reload');
    	}
    	if (this.position > -1) {
    		this.focusField();
    	}
    	
    	if (this.collection.length > 0) {
            $('.header-search-result').show();
            this.$('.bb-result').show();
            this.$('.bb-empty').hide();
        } else if (this.collection.query.length > 3) {
            $('.header-search-result').show();
            this.$('.bb-empty').show();
            this.$('.bb-result').hide();
        } else {
            $('.header-search-result').hide();
        	this.$('.bb-empty, .bb-result').hide();
        }
    },
    // Реакция блока
    focus: function () {
        this.position = -1;
    	this.$el.addClass('is-selected');
        if ( this.collection.query.length > 0) {
            $('.header-search-result').show();
        }
    },
    focusField: function () {
    	this.position = -1;
    	this.$('.bb-query-field').focus().val(this.$('.bb-query-field').val());
    },
    blur: function () {
        this.$el.removeClass('is-selected');
        this.$('.bb-query-field').blur();
        $('.header-search-result').hide();
    },
    // Запросы к серверу
    updateQuery: function (event) {
    	if (_.indexOf([16, 17, 18, 27, 37, 38, 39, 40, 91, 93], event.which) > -1) {
    		return;
    	}
    	
    	this.$el.addClass('is-reload');
        /*
    	if (this.collection.length) {
        	this.$el.addClass('is-reload');
        } else {
        	this.$el.addClass('is-load');
        }
        */
    	
    	this.collection.query = this.$('.bb-query-field').val();
        
        clearTimeout(this.timeout);
        this.timeout = setTimeout(_.bind(this.sendQuery, this), 800);
    },
    sendQuery: function () {
        this.requests++;
    	if (this.collection.query.length > 1) {
            this.collection.fetch();
        } else {
            this.collection.reset();
        }
    },
    navigate: function (event) {
    	// 40 - down
    	// 38 - up
    	if (this.collection.length && _.indexOf([13, 38, 40], event.which) > -1) {
    		if (event.which == 13 && this.position > -1 && this.position < this.collection.length) {
    			document.location.href = this.$('.bb-result-items .is-current').attr('href');
    			return false;
    		} else if (event.which == 40) {
    			event.preventDefault();
    			this.position++;
    		} else if (event.which == 38) {
    			event.preventDefault();
    			this.position--;
    		}
    		
    		this.$('.is-current').removeClass('is-current');
    		if (this.position >= this.collection.length) {
    			this.position = this.collection.length;
    			this.$('.header-search-result-controls').addClass('is-current');
    		} else if (this.position > -1) {
    			this.$('.bb-result-items a').eq(this.position).addClass('is-current');
    		}
    	}
    },
    submit: function (event) {
    	event.preventDefault();
    	this.$('form').submit();
    }
});

var HeaderRegionSelect = HeaderBlock.extend({
    events: {
        'click .bb-list-opener': 'toggle',
        'click .bb-region-selector': 'selectRegion',
        'click .bb-region-selector-hint': 'selectRegionByHint',
        'click .bb-region-hint-close': 'closeHint'
    },
    initialize: function () {
        this.observeClick();
        this.observeEsc();
    },
    closeHint: function () {
    	try {
    		ga('send', 'event', 'Region', 'HintClose');
    	}  catch(err) {}
        this.$('.bb-region-hint').fadeOut(333, function () {
        	$(this).remove();
        	$.cookie('region-hint', 'closed', { expires: 365, path: '/', domain: '.kuvalda.ru' });
        });
    },
    open: function () {
        this.$el.addClass('is-selected');
    },
    close: function () {
        this.$el.removeClass('is-selected');
    },
    toggle: function (event) {
        event ? event.preventDefault() : null;
        this.$el.toggleClass('is-selected');
    },
    blur: function () {
        this.close();
    },
    selectRegion: function (event) {
    	event ? event.preventDefault() : null;
    	if (this.isLoading) {
    		return;
    	}
    	
    	$(event.currentTarget).addClass('is-loading');
    	this.isLoading = true;
    	
    	try {
    		ga('send', 'event', 'Region', 'SelectRegion', $(event.currentTarget).text());
    	}  catch(err) {}
    	
    	$.post(document.location.href, {
    		'object': 'location',
    		'mode': 'regions',
    		'action': 'set',
    		'data[regionId]': $(event.currentTarget).data('id')
    	}, function () {
    		document.location.reload();
    	});
    },
    selectRegionByHint: function (event) {
    	event ? event.preventDefault() : null;
    	if (this.isLoading) {
    		return;
    	}
    	
    	$(event.currentTarget).addClass('is-loading');
    	this.isLoading = true;
    	
    	try {
    		ga('send', 'event', 'Region', 'SelectRegionByHint', $(event.currentTarget).data('name'));
    	}  catch(err) {}
    	
    	$.post(document.location.href, {
    		'object': 'location',
    		'mode': 'regions',
    		'action': 'set',
    		'data[regionId]': $(event.currentTarget).data('id')
    	}, function () {
    		document.location.reload();
    	});
    }
});



var HeaderCompareItemViewModel = function (data) {
	data.id = data.id.toString();
	ko.mapping.fromJS(data, {}, this);
	
	// mark new item
	this.isNew = ko.observable(true);
	_.delay(this.isNew, 10, false);
	
	// fade out removed item
	this.isRemoved = ko.observable(false);
	
	this.priceFormatted = ko.computed(function () {
		return $.formatNumber(this.price(), {format: '#,###.##', locale: 'ru'});
	}, this);
	this.compareUrl = ko.computed(function () {
		return '/catalog/compare/' + this.compareGroupId() + '/';
	}, this);
}
var HeaderCompareGroupViewModel = function (data) {
	this.options = {
		mapping: {
			'items': {
				create: function (options) {
					return new HeaderCompareItemViewModel(options.data);
				},
				key: function (data) {
					return ko.utils.unwrapObservable(data.id);
				}
			}
		}
	};
	
	data.id = data.id.toString();
	ko.mapping.fromJS(data, this.options.mapping, this);
	
	this.url = ko.computed(function () {
		return '/catalog/compare/' + this.id() + '/';
	}, this);
};

var HeaderCompareViewModel = function (el) {
	var self = this;
	self.el = el;
	_.extend(self, Backbone.Events);
	self.options = {
		abortTimeout: 10000,
		animationTime: 2000,
		dataUrl: '/_terminal/catalogue/main/compare.json',
		addUrl: '/_terminal/catalogue/main/compare/add/',
		removeUrl: '/_terminal/catalogue/main/compare/remove/',
		mapping: {
			create: function (options) {
				// console.log(ko.utils.unwrapObservable(options.parent.id));
				return new HeaderCompareGroupViewModel(options.data);
			},
			key: function (data) {
				return ko.utils.unwrapObservable(data.id);
			}
		}
	};
	
	// Groups
	self.groups = ko.mapping.fromJS([], self.options.mapping);
	self.removeGroup = function (id, silent) {
		var id = id.toString();
		
		self.groups.mappedRemove({id: id});
		
		self.trigger('group:removed', id);
		if (!silent) {
			$.post(self.options.removeUrl, {groupId: id}, 'json');
		}
		self.playAnimation();
	};
	
	// Items
	self.getItemGroup = function (id) {
		var id = id.toString();
		return _.find(self.groups(), function (group) { return group.items.mappedIndexOf({id: id}) > -1; });
	};
	self.getItem = function (id) {
		var id = id.toString();
		var group = self.getItemGroup(id);
		if (group) {
			var index = group.items.mappedIndexOf({id: id});
			return group.items()[index];
		}
	};
	self.isItemExists = function (id) {
		return self.getItemGroup(id) ? true : false;
	};
	self.getItemSimilarCount = function (id) {
		var group = self.getItemGroup(id);
		if (group) {
			return group.items().length - 1;
		}
		return 0;
	};
	self.removeItem = function (id, silent) {
		var id = id.toString();
		_.map(self.groups(), function (group) {
			group.items.mappedRemove({id: id});
		});
		
		self.trigger('item:removed', id);
		if (!silent) {
			$.post(self.options.removeUrl, {itemId: id}, 'json');
		}
		self.playAnimation();
	};
	self.removeItemView = function (item, event) {
		item.isRemoved(true);
		_.delay(self.removeItem, 500, ko.utils.unwrapObservable(item.id));
	};
	self.put = function (options) {
		var data = {};
    	if (options.id) {
    		data = {id: options.id};
    	} else if (options.form) {
    		data = options.form;
    	} else if (options.items) {
    		data = {items: options.items};
    	}
    	
    	var xhr = $.post(self.options.addUrl, data, self.parseResponse, 'json');
    	xhr.success(self.playAnimation);
    	xhr.success(function () {
    		self.trigger('item:added', options.id)
    	});
	};
	self.parseResponse = function (data) {
		ko.mapping.fromJS(data, self.options.mapping, self.groups);
	};
	
	
	// Animation
	self.isAnimated = ko.observable(false);
	self.playAnimation = function () {
		self.isAnimated(true);
		_.delay(self.isAnimated, self.options.animationTime, false);
	};
	
	// Items count
	self.itemsCount = ko.computed(function () {
		var groups = self.groups();
		return _.reduce(groups, function (memo, group) {
			return memo + group.items().length;
		}, 0);
	});
	self.itemsCountDimension = ko.computed(function () {
		return Utils.getPlural(self.itemsCount(), ['товар', 'товара', 'товаров']);
	});
	self.itemsCount.subscribe(function (value) {
		if (!value) {
			self.close();
		}
	});
	
	// open, close and toggle 
	self.isOpened = ko.observable(false);
	self.open = function () {
		if (self.itemsCount()) {
			self.isOpened(true);
		}
	};
	self.close = function () {
		self.isOpened(false);
	};
	self.toggle = function () {
		self.isOpened() ? self.close() : self.open();
	};
	
	// mini or full style
	self.windowHeight = ko.observable($(window).height());
	$(window).resize(function () {
		self.windowHeight($(window).height());
	});
	self.isMini = ko.computed(function () {
    	// group height ~70px
    	// item height ~82px
		
		var groups = self.groups();
		var groupsCount = groups.length;
		var itemsCount = self.itemsCount();
		
		var windowHeight = self.windowHeight();
		var headerHeight = $('.header').height();
		
		if (groupsCount * 70 + itemsCount * 82 + 1 > windowHeight - headerHeight) {
			return true;
		} else {
			return false;
		}
	}).extend({ throttle: 500 });
	
	// observe esc button
	$(document).keyup(function (event) {
        if (event.which == 27) {
            self.close();
        }
    });
	
	// observe click on other element
	self.isClicked = ko.observable(false);
	$(self.el).click(function () {
		self.isClicked(true);
	});
	$(document).click(function (event) {
		if (!self.isClicked()) {
			self.close();
		}
		self.isClicked(false);
	});
	/*
	$(document).click(function (event) {
		if ($(event.target).closest(self.el).length == 0) {
			self.close();
		}
	});
	*/
	
	// Load data
	self.isReady = ko.observable(false);
	$.get(self.options.dataUrl, function (data) {
		self.parseResponse(data);
		self.isReady(true);
		self.trigger('reset');
	}, 'json');
};

var HeaderCompare = HeaderBlock.extend({
	isAnimated: false,
	smoothTimeout: 0, // сглаживание
	abortTimeout: 10000, // отмена запроса, если нет ответа
	events: {
        'click .bb-list-opener': 'toggle'
    },
    initialize: function () {
    	this.observeClick();
        this.observeEsc();
        
        $(window).resize(_.bind(this.toggleStyle, this));
        this.views = {};
        this.groups = new CompareGroups();
        
        if (this.options.smoothTimeout) {
    		this.smoothTimeout = this.options.smoothTimeout;
    	}
    	if (this.options.abortTimeout) {
    		this.groups.abortTimeout = this.abortTimeout;
    	}
    	
    	this.countTemplate = _.template($('#t-compare-count').html());

    	this.groups.bind('reset', this.addAll, this);
    	this.groups.bind('remove', this.removeGroupView, this);
        this.groups.bind('reset remove items:changed', this.render, this);
        this.groups.bind('item:removed', function (id) {
        	this.trigger('item:removed', id);
        }, this);
        this.groups.bind('reset', function (id) {
        	this.trigger('reset');
        }, this);
        
        this.groups.bind('put:success put:errror', this.parsePutResponse, this);
        
        this.groups.bind('compare:updated', this.addAll, this);
        this.groups.bind('compare:updated', this.render, this);
        this.groups.bind('compare:updated', this.playAnimation, this);
        
        this.groups.fetch();
    },
    toggleEmptyFlag: function () {
    	this.groups.totalCount ? this.$el.removeClass('is-empty') : this.$el.addClass('is-empty');
    	if (!this.groups.totalCount) {
    		this.close();
    	}
    },
    // подстраивание стиля оформления корзины под высоту экрана
    toggleStyle: function () {
    	// group height ~70px
    	// item height ~82px
    	if (this.groups.length * 70 + this.groups.totalCount * 82 + 1 > $(window).height() - $('.header').height()) {
    		this.$('.bb-compare-groups').addClass('is-short');
    	} else {
    		this.$('.bb-compare-groups').removeClass('is-short');
    	}
    },
    updateCaption: function () {
    	var countData = {
			count: this.groups.totalCount,
			dimension: Utils.getPlural(this.groups.totalCount, ['товар', 'товара', 'товаров']) 
    	};
    	this.$('.bb-list-count').html(this.countTemplate(countData));
    },
    render: function () {
    	this.$el.show();
    	this.toggleStyle();
    	this.toggleEmptyFlag();
    	this.updateCaption();
    },
    put: function (options) {
    	var xhr = this.groups.put(options);
    	xhr.time = (new Date()).getTime() + this.smoothTimeout;
    	xhr.successCallback = options.success;
    	xhr.errorCallback = options.error;
    },
    parsePutResponse: function (xhr, status, response) {
    	var offset = xhr.time - new Date().getTime();
		if (offset <= 0) {
			switch (status) {
				case 'success':
					this.trigger('put:success');
					if (_.isFunction(xhr.successCallback)) {
						xhr.successCallback(response);
					}
				break;
				case 'error':
					this.trigger('put:error');
					if (_.isFunction(xhr.errorCallback)) {
						xhr.errorCallback();
					}
				break;
			}
		} else {
			setTimeout(_.bind(this.parsePutResponse, this, xhr, status), offset);
		}
    },
    playAnimation: function () {
    	if (!this.isAnimated) {
    		this.isAnimated = true;
    		this.$('.header-compare-info-icon').addClass('is-animated');
    		_.delay(function (self) {
    			self.isAnimated = false;
    			this.$('.header-compare-info-icon').removeClass('is-animated');
    		}, 2000, this);
    	}
    },
    removeGroupView: function (model) {
    	var id = _.isObject(model) ? model.id : model;
    	this.views[id] = null;
    },
    removeGroup: function (id) {
    	this.groups.removeGroup(id);
    },
    removeItem: function (id) {
    	console.log('HeaderCompare:removeItem');
    	this.groups.removeItem(id);
    },
    isItemExists: function (id) {
    	for (var i = 0; i < this.groups.length; i++) {
    		if (this.groups.models[i].items.get(id)) {
    			return true;
    		}
    	}
    	return false;
    },
    add: function (model) {
    	if (_.has(this.views, model.id) && this.views[model.id]) {
			//this.views[model.id].render();
		} else {
			var group = new CompareGroup({model: model});
			this.$(".bb-compare-groups").append(group.el);
			this.views[model.id] = group;
		}
    },
    addAll: function () {
    	this.groups.each(this.add, this);
    },
	open: function () {
        if (this.groups.totalCount) {
        	this.$el.addClass('is-selected');
        }
    },
    close: function () {
        this.$el.removeClass('is-selected');
    },
    toggle: function (event) {
        if (this.groups.totalCount) {
        	event ? event.preventDefault() : null;
        	this.$el.toggleClass('is-selected');
        }
    },
    blur: function () {
        this.close();
    }
});


var HeaderAuthBlock = HeaderBlock.extend({
    user: false,
	signinUrl: '/_terminal/member/auth/user.json',
    signoutUrl: '/_terminal/member/auth/logout',
	events: {
        'click .bb-list-opener': 'toggle',
        'submit .bb-auth-login': 'login',
        'submit .bb-auth-logout': 'logout'
    },
    initialize: function () {
        $.get(this.signinUrl, _.bind(function (response) {
        	this.$el.show();
        	if (response.isAuth) {
        		this.user = response.user;
        		this.render();
        	}
        }, this), 'json');
    	this.observeClick();
        this.observeEsc();
    },
    showError: function (mode) {
    	this.$el.addClass('is-incorrect-' + mode);
    	this.$el.addClass('is-incorrect is-incorrect-animation');
    	setTimeout(_.bind(function () {
    		this.$el.removeClass('is-incorrect-animation');
    	}, this), 1100);
    },
    hideError: function () {
        this.$el.removeClass('is-incorrect');
        this.$el.removeClass('is-incorrect-notFound');
        this.$el.removeClass('is-incorrect-notActive');
    },
    showProcess: function () {
    	this.$el.addClass('is-process');
    },
    hideProcess: function () {
    	this.$el.removeClass('is-process');
    },
    open: function () {
        this.$el.addClass('is-selected');
    },
    close: function () {
        this.$el.removeClass('is-selected');
    },
    toggle: function (event) {
        event ? event.preventDefault() : null;
        this.$el.toggleClass('is-selected');
    },
    blur: function () {
        this.close();
    },
    login: function (event) {
    	event ? event.preventDefault() : null;
    	this.showProcess();
    	$.post(this.signinUrl, {email: $('.bb-auth-field-email').val(), password: $('.bb-auth-field-password').val()}, _.bind(this.parseResponse, this), 'json');
    },
    logout: function (event) {
    	event ? event.preventDefault() : null;
    	this.showProcess();
    	$.post(this.signoutUrl);
    	
    	setTimeout(_.bind(function () {
    		this.hideProcess();
    		this.user = false;
    		this.render();
    	}, this), 1000);
    },
    parseResponse: function (response) {
    	setTimeout(_.bind(function () {
    		this.hideProcess();
    		if (typeof response == 'object' && response.success) {
    			this.hideError();
    			this.user = response.user;
    			this.render();
    		} else if (typeof response == 'object' && response.needActivate) {
    			this.showError('notActive');
    		} else {
    			this.showError('notFound');
    		}
    	}, this), 1000);
    },
    render: function () {
    	if (this.user) {
    		this.$el.addClass('is-signed-in');
    		var name = this.user.name.length > 30 ? this.user.name.substring(0, 30) + '…' : this.user.name;
    		this.$('.bb-trigger').html(name);
    		this.$('.bb-userinfo').html(_.template($('#t-auth-userinfo').html(), this.user));

            //add notification block
            var $notification_block = $('<div class="header-notifications">\
                                            <a rel="nofollow" href="#" class="header-notifications-open-list-link"><span></span></a>\
                                            <div class="header-notifications-new-count"></div>\
                                            <div class="header-notifications-list-wrapper"></div>\
                                        </div>');
            this.$el.find('.header-auth-wrapper').append($notification_block);

    	} else {
    		this.$el.removeClass('is-signed-in');
    		this.$('.bb-trigger').html('Личный кабинет');

            //remove notification block
    	}
    }
});

var Header = function (options) {
	self.options = {
		el: null,
		fixedIfExists: null,
		fixedClassName: 'is-fixed',
		cloneClassName: 'header-clone',
		fixAfter: 36
	};
	_.extend(self.options, options);
	
	if (!self.options.el || !self.options.fixedIfExists || !$(self.options.fixedIfExists).length) {
		return;
	}
	
	self.$el = $(self.options.el);
	
	self.makeClone = function () {
		self.$clone = $(document.createElement('DIV'));
		self.$clone.addClass(self.options.cloneClassName);
		self.$clone.hide();
		self.$el.before(self.$clone);
	};
	self.fix = function () {
		self.$el.addClass(self.options.fixedClassName);
		self.$clone.show();
		
		document.auth.blur();
		document.search.blur();
	};
	self.unfix = function () {
		self.$el.removeClass(self.options.fixedClassName);
		self.$clone.hide();
	};
	self.onScroll = function (event) {
		if ($(window).scrollTop() >= self.options.fixAfter) {
			self.fix();
		} else {
			self.unfix();
		}
	}
	
	self.makeClone();
	$(window).scroll(self.onScroll);
}

function headerInit() {
	document.search = new HeaderSearch({
        el: $('.header-search').get(0)
    });
    document.regionSelect = new HeaderRegionSelect({
        el: $('.header-region').get(0)
    });
    /*
    document.compare = new HeaderCompare({
    	el: $('.header-compare').get(0)
    });
    */
    var compareElement = $('.header-compare').get(0);
    document.compare = new HeaderCompareViewModel(compareElement);
    ko.applyBindings(document.compare, compareElement);
    
    document.auth = new HeaderAuthBlock({
        el: $('.header-auth').get(0)
    });
    document.header = new Header({
    	el: $('.header').get(0),
    	fixedIfExists: 'form.order, .js-order, .fixed-header'
    });
}

$(document).ready(function () {
    headerInit();
});
