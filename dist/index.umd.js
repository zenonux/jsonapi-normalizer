var m=Object.defineProperty;var u=Object.getOwnPropertySymbols;var A=Object.prototype.hasOwnProperty,b=Object.prototype.propertyIsEnumerable;var c=(l,s,o)=>s in l?m(l,s,{enumerable:!0,configurable:!0,writable:!0,value:o}):l[s]=o,h=(l,s)=>{for(var o in s||(s={}))A.call(s,o)&&c(l,o,s[o]);if(u)for(var o of u(s))b.call(s,o)&&c(l,o,s[o]);return l};(function(l,s){typeof exports=="object"&&typeof module!="undefined"?module.exports=s():typeof define=="function"&&define.amd?define(s):(l=typeof globalThis!="undefined"?globalThis:l||self,l.JsonapiNormalizer=s())})(this,function(){"use strict";class l{static transform(t){let{data:i,included:e,meta:r,links:a}=t,p={},d=e.length>0?y(e):null;return Array.isArray(i)?p=i.map(_=>s(_,d)):p=s(i,d),{data:p,meta:r,links:a}}}function s(n,t){let i=h({id:n.id},n.attributes);if(n.relationships&&t){let e=Object.keys(n.relationships).map(a=>({property:a,data:n.relationships[a].data})).filter(a=>!Array.isArray(a.data)||a.data.length>0),r=o(t,e);Object.keys(r).forEach(a=>{i[a]=r[a]})}return i}function o(n,t){let i={};return Object.keys(t).forEach(e=>{if(Array.isArray(t[e].data))i[t[e].property]=[],t[e].data.forEach(r=>{let a=r.type+"_"+r.id;i[t[e].property].push(n[a]),f(a,n)});else{let r=t[e].data.type+"_"+t[e].data.id;i[t[e].property]=n[r],f(r,n)}}),i}function f(n,t){let i=t[n];i._relationships&&(Object.keys(i._relationships).forEach(e=>{if(Array.isArray(i._relationships[e]))i[e]=[],i._relationships[e].forEach(r=>{i[e].push(t[r])});else{let r=i._relationships[e];i[e]=t[r]}}),delete i._relationships)}function y(n){let t={};for(let i=0;i<n.length;i++){let e=n[i],r=e.type+"_"+e.id;t[r]=h({id:e.id},e.attributes),e.relationships&&Object.keys(e.relationships).forEach(a=>{let p=e.relationships[a].data;t[r]._relationships=t[r]._relationships||{},Array.isArray(p)?(t[r]._relationships[a]=[],p.forEach(d=>{t[r]._relationships[a].push(d.type+"_"+d.id)})):t[r]._relationships[a]=p.type+"_"+p.id})}return t}return l});
