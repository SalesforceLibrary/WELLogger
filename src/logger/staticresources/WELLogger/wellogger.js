window.wellogger=function(e){var n={};function t(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}return t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:r})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(t.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var o in e)t.d(r,o,function(n){return e[n]}.bind(null,o));return r},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="",t(t.s=0)}([function(e,n,t){var r=t(1),o={};e.exports=function(e){null!=e&&Array.isArray(e)&&e.length>0&&(r.enabled("*")||r.enable("*"),r.log("==========BEGIN=========="),e.forEach(e=>{var n=o[e.nsp];n||(n=r(e.nsp),o[e.nsp]=n),e.trc?"string"==typeof e.trc?n(e.lvl,e.tst,'%s "%s"',e.msg,e.trc):n(e.lvl,e.tst,"%s %o",e.msg,e.trc):n(e.lvl,e.tst,e.msg)}),r.log("===========END==========="))}},function(e,n,t){(function(r){n.formatArgs=function(n){var t=6e4*(new Date).getTimezoneOffset(),r=new Date(this.curr-t).toISOString().slice(11,-1),i=o[this.lvl];if(n[0]=r+(this.useColors?" %c":" ")+i+(this.useColors?"%c[":"[")+this.namespace+(this.useColors?"] %c":"] ")+n[0]+(this.useColors?"%c ":" ")+"+"+e.exports.humanize(this.diff),!this.useColors)return;const c="color: "+this.color;n.splice(1,0,s[this.lvl],"color: inherit",c,"color: inherit");let a=0,u=0;n[0].replace(/%[a-zA-Z%]/g,e=>{"%%"!==e&&(a++,"%c"===e&&(u=a))}),n.splice(u,0,c)},n.save=function(e){try{e?n.storage.setItem("debug",e):n.storage.removeItem("debug")}catch(e){}},n.load=function(){let e;try{e=n.storage.getItem("debug")}catch(e){}!e&&void 0!==r&&"env"in r&&(e=r.env.DEBUG);return e},n.useColors=function(){if("undefined"!=typeof window&&window.process&&("renderer"===window.process.type||window.process.__nwjs))return!0;if("undefined"!=typeof navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))return!1;return"undefined"!=typeof document&&document.documentElement&&document.documentElement.style&&document.documentElement.style.WebkitAppearance||"undefined"!=typeof window&&window.console&&(window.console.firebug||window.console.exception&&window.console.table)||"undefined"!=typeof navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)&&parseInt(RegExp.$1,10)>=31||"undefined"!=typeof navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/)},n.storage=function(){try{return localStorage}catch(e){}}(),n.colors=["#0000CC","#0000FF","#0033CC","#0033FF","#0066CC","#0066FF","#0099CC","#0099FF","#00CC00","#00CC33","#00CC66","#00CC99","#00CCCC","#00CCFF","#3300CC","#3300FF","#3333CC","#3333FF","#3366CC","#3366FF","#3399CC","#3399FF","#33CC00","#33CC33","#33CC66","#33CC99","#33CCCC","#33CCFF","#6600CC","#6600FF","#6633CC","#6633FF","#66CC00","#66CC33","#9900CC","#9900FF","#9933CC","#9933FF","#99CC00","#99CC33","#CC0000","#CC0033","#CC0066","#CC0099","#CC00CC","#CC00FF","#CC3300","#CC3333","#CC3366","#CC3399","#CC33CC","#CC33FF","#CC6600","#CC6633","#CC9900","#CC9933","#CCCC00","#CCCC33","#FF0000","#FF0033","#FF0066","#FF0099","#FF00CC","#FF00FF","#FF3300","#FF3333","#FF3366","#FF3399","#FF33CC","#FF33FF","#FF6600","#FF6633","#FF9900","#FF9933","#FFCC00","#FFCC33"];const o={D:"DEBUG%c",I:"INFO%c ",W:"WARN%c ",E:"ERROR%c",F:"FINE%c ",N:"NONE%c "},s={E:"color: #ffffff; background-color: #cc3300; padding: 2px; border-radius: 3px;",W:"color: #ffffff; background-color: #ffcc00; padding: 2px; border-radius: 3px;",I:"color: #333333; background-color: #eeeeee; padding: 2px; border-radius: 3px;",D:"color: #666666; padding: 2px;",F:"color: #666666; padding: 2px;",N:"color: #666666; padding: 2px;"};n.log=console.debug||console.log||(()=>{}),e.exports=t(3)(n);const{formatters:i}=e.exports;i.j=function(e){try{return JSON.stringify(e)}catch(e){return"[UnexpectedJSONParseError]: "+e.message}}}).call(this,t(2))},function(e,n){var t,r,o=e.exports={};function s(){throw new Error("setTimeout has not been defined")}function i(){throw new Error("clearTimeout has not been defined")}function c(e){if(t===setTimeout)return setTimeout(e,0);if((t===s||!t)&&setTimeout)return t=setTimeout,setTimeout(e,0);try{return t(e,0)}catch(n){try{return t.call(null,e,0)}catch(n){return t.call(this,e,0)}}}!function(){try{t="function"==typeof setTimeout?setTimeout:s}catch(e){t=s}try{r="function"==typeof clearTimeout?clearTimeout:i}catch(e){r=i}}();var a,u=[],l=!1,f=-1;function d(){l&&a&&(l=!1,a.length?u=a.concat(u):f=-1,u.length&&C())}function C(){if(!l){var e=c(d);l=!0;for(var n=u.length;n;){for(a=u,u=[];++f<n;)a&&a[f].run();f=-1,n=u.length}a=null,l=!1,function(e){if(r===clearTimeout)return clearTimeout(e);if((r===i||!r)&&clearTimeout)return r=clearTimeout,clearTimeout(e);try{r(e)}catch(n){try{return r.call(null,e)}catch(n){return r.call(this,e)}}}(e)}}function p(e,n){this.fun=e,this.array=n}function g(){}o.nextTick=function(e){var n=new Array(arguments.length-1);if(arguments.length>1)for(var t=1;t<arguments.length;t++)n[t-1]=arguments[t];u.push(new p(e,n)),1!==u.length||l||c(C)},p.prototype.run=function(){this.fun.apply(null,this.array)},o.title="browser",o.browser=!0,o.env={},o.argv=[],o.version="",o.versions={},o.on=g,o.addListener=g,o.once=g,o.off=g,o.removeListener=g,o.removeAllListeners=g,o.emit=g,o.prependListener=g,o.prependOnceListener=g,o.listeners=function(e){return[]},o.binding=function(e){throw new Error("process.binding is not supported")},o.cwd=function(){return"/"},o.chdir=function(e){throw new Error("process.chdir is not supported")},o.umask=function(){return 0}},function(e,n,t){e.exports=function(e){function n(e){let n=0;for(let t=0;t<e.length;t++)n=(n<<5)-n+e.charCodeAt(t),n|=0;return r.colors[Math.abs(n)%r.colors.length]}function r(e){let t;function i(e,n,...o){if(!i.enabled)return;const s=i,c=n-(t||n);s.diff=c,s.prev=t,s.curr=n,s.lvl=e,t=n,o[0]=r.coerce(o[0]),"string"!=typeof o[0]&&o.unshift("%O");let a=0;o[0]=o[0].replace(/%([a-zA-Z%])/g,(e,n)=>{if("%%"===e)return e;a++;const t=r.formatters[n];if("function"==typeof t){const n=o[a];e=t.call(s,n),o.splice(a,1),a--}return e}),r.formatArgs.call(s,o),(s.log||r.log).apply(s,o)}return i.namespace=e,i.enabled=r.enabled(e),i.useColors=r.useColors(),i.color=n(e),i.destroy=o,i.extend=s,"function"==typeof r.init&&r.init(i),r.instances.push(i),i}function o(){const e=r.instances.indexOf(this);return-1!==e&&(r.instances.splice(e,1),!0)}function s(e,n){const t=r(this.namespace+(void 0===n?":":n)+e);return t.log=this.log,t}function i(e){return e.toString().substring(2,e.toString().length-2).replace(/\.\*\?$/,"*")}return r.debug=r,r.default=r,r.coerce=function(e){return e instanceof Error?e.stack||e.message:e},r.disable=function(){const e=[...r.names.map(i),...r.skips.map(i).map(e=>"-"+e)].join(",");return r.enable(""),e},r.enable=function(e){let n;r.save(e),r.names=[],r.skips=[];const t=("string"==typeof e?e:"").split(/[\s,]+/),o=t.length;for(n=0;n<o;n++)t[n]&&("-"===(e=t[n].replace(/\*/g,".*?"))[0]?r.skips.push(new RegExp("^"+e.substr(1)+"$")):r.names.push(new RegExp("^"+e+"$")));for(n=0;n<r.instances.length;n++){const e=r.instances[n];e.enabled=r.enabled(e.namespace)}},r.enabled=function(e){if("*"===e[e.length-1])return!0;let n,t;for(n=0,t=r.skips.length;n<t;n++)if(r.skips[n].test(e))return!1;for(n=0,t=r.names.length;n<t;n++)if(r.names[n].test(e))return!0;return!1},r.humanize=t(4),Object.keys(e).forEach(n=>{r[n]=e[n]}),r.instances=[],r.names=[],r.skips=[],r.formatters={},r.selectColor=n,r.enable(r.load()),r}},function(e,n){var t=1e3,r=60*t,o=60*r,s=24*o,i=7*s,c=365.25*s;function a(e,n,t,r){var o=n>=1.5*t;return Math.round(e/t)+" "+r+(o?"s":"")}e.exports=function(e,n){n=n||{};var u=typeof e;if("string"===u&&e.length>0)return function(e){if((e=String(e)).length>100)return;var n=/^((?:\d+)?\-?\d?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(e);if(!n)return;var a=parseFloat(n[1]);switch((n[2]||"ms").toLowerCase()){case"years":case"year":case"yrs":case"yr":case"y":return a*c;case"weeks":case"week":case"w":return a*i;case"days":case"day":case"d":return a*s;case"hours":case"hour":case"hrs":case"hr":case"h":return a*o;case"minutes":case"minute":case"mins":case"min":case"m":return a*r;case"seconds":case"second":case"secs":case"sec":case"s":return a*t;case"milliseconds":case"millisecond":case"msecs":case"msec":case"ms":return a;default:return}}(e);if("number"===u&&!1===isNaN(e))return n.long?function(e){var n=Math.abs(e);if(n>=s)return a(e,n,s,"day");if(n>=o)return a(e,n,o,"hour");if(n>=r)return a(e,n,r,"minute");if(n>=t)return a(e,n,t,"second");return e+" ms"}(e):function(e){var n=Math.abs(e);if(n>=s)return Math.round(e/s)+"d";if(n>=o)return Math.round(e/o)+"h";if(n>=r)return Math.round(e/r)+"m";if(n>=t)return Math.round(e/t)+"s";return e+"ms"}(e);throw new Error("val is not a non-empty string or a valid number. val="+JSON.stringify(e))}}]);
//# sourceMappingURL=wellogger.js.map