(this.webpackJsonpcrosswordstatswebsite=this.webpackJsonpcrosswordstatswebsite||[]).push([[0],{22:function(e,t,n){"use strict";(function(e){var r=n(6),a=n(10),s=n.n(a),c=n(20),o=n(0),i=(n(36),n(37),n(1)),u=function(){var t=Object(c.a)(s.a.mark((function t(n,r){var a,c,o,i;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return"https://vkuqm7h21l.execute-api.us-east-1.amazonaws.com/default/nic-crossword-lambda",a={auth_key:n,earliest_date:r},t.next=4,fetch("https://vkuqm7h21l.execute-api.us-east-1.amazonaws.com/default/nic-crossword-lambda",{method:"POST",header:{"Content-Type":"application/json"},body:JSON.stringify(a)});case 4:return c=t.sent,t.next=7,c.json();case 7:if(o=t.sent,console.log(o),"auth key or date not provided"===o.message||"sorry, something went wrong"===o.message){t.next=12;break}return i=e.from(o.content,"base64").toString("utf8"),t.abrupt("return",i);case 12:return t.abrupt("return");case 13:case"end":return t.stop()}}),t)})));return function(e,n){return t.apply(this,arguments)}}();t.a=function(){var e=Object(o.useState)(""),t=Object(r.a)(e,2),n=t[0],a=t[1],l=Object(o.useState)(""),b=Object(r.a)(l,2),j=b[0],d=b[1],h=Object(o.useState)(""),p=Object(r.a)(h,2),f=p[0],g=p[1],m=Object(o.useState)(!1),O=Object(r.a)(m,2),x=O[0],v=O[1];return Object(o.useEffect)((function(){var e=function(){var e=Object(c.a)(s.a.mark((function e(){var t,n,r,c;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(null===localStorage.getItem("token")){e.next=6;break}return e.next=3,u(localStorage.getItem("token"));case 3:t=e.sent,e.next=9;break;case 6:return e.next=8,u(j,f);case 8:t=e.sent;case 9:null!=t&&(n=t.indexOf("<svg "),r=new Blob([t.substr(n)],{type:"image/svg+xml"}),c=URL.createObjectURL(r),document.createElement("img").addEventListener("load",(function(){return URL.revokeObjectURL(c)}),{once:!0}),a(c));case 10:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();e()}),[j,f]),Object(i.jsx)("div",{className:"App",children:Object(i.jsx)("header",{className:"App-header",children:Object(i.jsxs)("div",{children:[x&&Object(i.jsxs)("div",{children:[""===n&&Object(i.jsx)("p",{children:"loading... (this might take a minute or two)"}),""!==n&&Object(i.jsx)("p",{children:Object(i.jsx)("img",{alt:"plot",src:n,width:"1000",height:"700"})})]}),!x&&Object(i.jsxs)("div",{children:[Object(i.jsx)("p",{children:Object(i.jsx)("a",{href:"https://github.com/nicwineburger/crosswordstatswebsite",children:"Click here for instructions on how to get your auth-key from the NYT"})}),Object(i.jsxs)("form",{onSubmit:function(e){return e.preventDefault(),v(!0),localStorage.setItem("token",j),void localStorage.setItem("date",f)},children:[Object(i.jsxs)("label",{children:["Enter your auth-key:",Object(i.jsx)("br",{}),Object(i.jsx)("input",{type:"text",value:localStorage.getItem("token"),onChange:function(e){return d(e.target.value)}})]}),Object(i.jsx)("br",{}),Object(i.jsxs)("label",{children:["Enter earliest date (YYYY-MM-DD):",Object(i.jsx)("br",{}),Object(i.jsx)("input",{type:"text",value:localStorage.getItem("date"),onChange:function(e){return g(e.target.value)}})]}),Object(i.jsx)("br",{}),Object(i.jsx)("input",{type:"submit"})]})]})]})})})}}).call(this,n(30).Buffer)},36:function(e,t,n){"use strict";n.p},37:function(e,t,n){},44:function(e,t,n){"use strict";n.r(t);n(0);var r=n(21),a=n.n(r),s=(n(29),n(50)),c=n(22),o=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,51)).then((function(t){var n=t.getCLS,r=t.getFID,a=t.getFCP,s=t.getLCP,c=t.getTTFB;n(e),r(e),a(e),s(e),c(e)}))},i=n(1);a.a.render(Object(i.jsxs)(i.Fragment,{children:[Object(i.jsx)(s.a,{}),Object(i.jsx)(c.a,{})]}),document.getElementById("root")),o()}},[[44,1,2]]]);
//# sourceMappingURL=main.10260647.chunk.js.map