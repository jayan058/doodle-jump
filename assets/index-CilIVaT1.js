(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))e(i);new MutationObserver(i=>{for(const l of i)if(l.type==="childList")for(const v of l.addedNodes)v.tagName==="LINK"&&v.rel==="modulepreload"&&e(v)}).observe(document,{childList:!0,subtree:!0});function n(i){const l={};return i.integrity&&(l.integrity=i.integrity),i.referrerPolicy&&(l.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?l.credentials="include":i.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function e(i){if(i.ep)return;i.ep=!0;const l=n(i);fetch(i.href,l)}})();let E=document.getElementById("startButton"),Y=document.getElementById("controls");E&&E.addEventListener("click",()=>{E&&(E.style.display="none",Y&&(Y.style.display="none"),W())});let w,d=360,f=576,a,p=!1,O=52,F=52,N=d/2-O/2,R=f*7/8-F,m,L,M,x,T,o={img:null,x:N,y:R,width:O,height:F},P=0,s=0,y=-8,S=.3;function g(t){const r=D(t);return r<20&&r%2===0}function D(t){return Math.floor(Math.random()*t)}let c=[],B=60,j=18,h,I,b=0,A=0,k=!1;window.onload=()=>{w=document.getElementById("board"),w.height=f,w.width=d,a=w.getContext("2d"),m=new Image,m.src="./assets/doodler-right.png",m.onload=()=>{o.img=m},m.onerror=u,L=new Image,L.src="./assets/doodler-left.png",L.onerror=u,h=new Image,h.src="./assets/platform.png",h.onload=()=>{},h.onerror=u,I=new Image,I.src="./assets/platform-broken.png",I.onload=()=>{},I.onerror=u,M=new Image,M.src="./assets/jet-pack.png",M.onload=()=>{},M.onerror=u,x=new Image,x.src="./assets/doodler-flying.webp",x.onload=()=>{},x.onerror=u,T=new Image,T.src="./assets/trampoline.png",T.onload=()=>{},T.onerror=u};function u(){console.error("Failed to load image.")}function W(){m.complete&&h.complete&&I.complete&&(s=y,q(),requestAnimationFrame(X),document.addEventListener("keydown",C))}function X(){if(requestAnimationFrame(X),k)return;a.clearRect(0,0,w.width,w.height),o.x+=P,o.x>d?o.x=0:o.x+o.width<0&&(o.x=d),o.y<f/4&&(o.y=f/4),s+=S,o.y+=s,o.y>w.height&&(k=!0),a.drawImage(o.img,o.x,o.y,o.width,o.height);const t=2;for(let n=0;n<c.length;n++){let e=c[n];if(e.jetpack?a.drawImage(M,e.x,e.y-30,e.width,e.height+10):e.trampoline?a.drawImage(T,e.x,e.y-30,e.width,e.height+20):a.drawImage(e.img,e.x,e.y,e.width,e.height),e.moveable&&(e.x+=t,e.x>d?e.x=-e.width:e.x+e.width<0&&(e.x=d)),s<0&&o.y<f-5&&(p==!0?e.y-=y-20:e.y-=y),V(o,e))if(e.jetpack){console.log("Hello"),p=!0,p==!0?S=0:S=.3,p==!0&&(o.img=x);var r=setTimeout(()=>{p=!1,S=.3,o.img=L,e.y-=y,clearTimeout(r)},2e3)}else e.trampoline?s=y:e.broken&&o.y+o.height<=e.y+s?k=!0:!e.broken&&s>=0&&(s=y);a.drawImage(e.img,e.x,e.y,e.width,e.height)}for(;c.length>0&&c[0].y>=f;)c.shift(),J();G(),a.fillStyle="black",a.font="16px sans-serif",a.fillText(b.toString(),5,20),k&&a.fillText("Oops!! Press Space to restart",d/4,f*7/8)}function C(t){t.code==="ArrowRight"||t.code==="KeyD"?(P=4,p==!1&&(o.img=m)):t.code==="ArrowLeft"||t.code==="KeyA"?(P=-4,p==!1&&(o.img=L)):t.code==="Space"&&k&&(o={img:m,x:N,y:R,width:O,height:F},P=0,s=y,b=0,A=0,k=!1,q())}document.addEventListener("keyup",function(t){(t.code==="ArrowRight"||t.code==="ArrowLeft"||t.code==="KeyD"||t.code==="KeyA")&&(P=0)});function q(){c=[];let t={img:h,x:d/2,y:f-50,width:B,height:j,broken:!1,moveable:!1,jetpack:!1,trampoline:!1};c.push(t);let r=70;for(let n=0;n<6;n++){let e=Math.floor(Math.random()*d*3/4),i=g(200),l=g(500),v=g(100),K=g(200);n===0&&(i=!1,l=!1,v=!1,K=!1),t={img:i?I:h,x:e,y:f-r*n-150,width:B,height:j,broken:i,moveable:l,jetpack:v,trampoline:K},c.push(t),b>1e3&&(r=100),b>2e3&&(r=125),b>3e3&&(r=150)}}function J(){let t=Math.floor(Math.random()*d*3/4),r=g(200),n=g(200),e=g(100),i=g(100),l={img:r?I:h,x:t,y:-j,width:B,height:j,broken:r,moveable:n,jetpack:e,trampoline:i};c.push(l)}function V(t,r){return r.broken?!1:t.x<=r.x+r.width&&t.x+t.width>=r.x&&t.y<=r.y+r.height&&t.y+t.height>=r.y}function G(){let t=Math.floor(50*Math.random());s<0?(A+=t,b<A&&(b=A)):s>=0&&(A-=t)}const _=.2;let H=0;window.addEventListener("deviceorientation",z);function z(t){t.beta,H=t.gamma||0,P=H*_}
