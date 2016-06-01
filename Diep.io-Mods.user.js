// ==UserScript==
// @name        Diep.io Mods (evergreen)
// @description Autospawn, autofire, dark theme, shortcuts and more
// @version     26
// @author      condoriano
// @namespace   diepiormod
// @include     http://diep.io/*
// @include     https://diep.io/*
// @run-at      document-start
// @grant       GM_xmlhttpRequest
// @connect     greasyfork.org
// @connect     diep.io
// ==/UserScript==

// v26 = Fixed Upgrade Pop-Up

if(navigator.userAgent.toLowerCase().indexOf('firefox') != -1) {
	window.addEventListener('beforescriptexecute', function(e) {
		var done = false;
		if(e.target.src.indexOf('d.js') != -1) {
			var q = e.target;
			e.preventDefault();
			e.stopPropagation();
			GM_xmlhttpRequest({
				method: "GET",
				url: "http://diep.io/d.js",
				onload: function(f) {
					var oriScript = f.responseText;
					GM_xmlhttpRequest({
						method: "GET",
						url: "https://greasyfork.org/scripts/20114-diepiomod/code/diepiomod.js",
						onload: function(g) {
							var modScript = g.responseText;
							var finalScript = combineScript(oriScript, modScript);
							var s = document.createElement('script'); s.textContent = finalScript; q.parentElement.insertBefore(s, q); q.remove();
							done = true;
						}
					});
				}
			});
		}
		if(done) window.removeEventListener(e.type, arguments.callee, true);
	}, true);
}
else {
	window.stop();
	GM_xmlhttpRequest({
		method: "GET",
		url: "http://diep.io",
		onload: function(e) {
			var diepDOM = e.responseText;
			GM_xmlhttpRequest({
				method: "GET",
				url: "http://diep.io/d.js",
				onload: function(f) {
					var oriScript = f.responseText;
					GM_xmlhttpRequest({
						method: "GET",
						url: "https://greasyfork.org/scripts/20114-diepiomod/code/diepiomod.js",
						onload: function(g) {
							var modScript = g.responseText;
							var finalScript = combineScript(oriScript, modScript);
							diepDOM = diepDOM.replace(/<script src="d\.js" async><\/script>/i, '');
							diepDOM = diepDOM.replace(/<\/body>/i, '<script>' + finalScript + '</script></body>');
							document.open();
							document.write(diepDOM);
							document.close();
						}
					});
				}
			});
		}
	});
}

function combineScript(a, b) {
	a = a.replace(/function\(([^()]*)\){([^{}]*)fillStyle=([^{}]*)}/, 'function($1){$2fillStyle=onCanvasFill($3)}');
	a = a.replace(/function\(([^()]*)\){([^{}]*)strokeStyle=([^{}]*)}/, 'function($1){$2strokeStyle=onCanvasStroke($3)}');
	a = a.replace(/\(function\((.)\){/i, '(function($1){' + b);
	return a;
}
