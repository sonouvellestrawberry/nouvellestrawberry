/* ===================== 유틸 ===================== */
var $ = s => document.querySelector(s);
var esc = s => String(s==null?'':s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function josa(w,t){
  const ch=w.charCodeAt(w.length-1); let has=false,jong=0;
  if(ch>=0xAC00&&ch<=0xD7A3){ jong=(ch-0xAC00)%28; has=jong>0; }
  const m={'이가':['이','가'],'은는':['은','는'],'을를':['을','를'],'과와':['과','와'],'과':['과','와'],'아야':['아','야'],'이':['이',''],'으로':[(jong===8?'로':'으로'),'로'],'이랑':['이랑','랑']};
  const p=m[t]; if(!p) return t; return has?p[0]:p[1];
}
function T(str){
  return String(str).replace(/\{(\w+)(\.s)?(?:\|([^}]+))?\}/g,(all,k,s,j)=>{
    if(k==='tag') return SHOW.tag;
    const c=CAST[k]; if(!c) return all;
    const nm=s?c.s:c.n; return j? nm+josa(nm,j): nm;
  });
}
var sleep = ms => new Promise(r=>setTimeout(r,ms));
var fmtT = m => { const h=Math.floor(m/60)%24, mm=m%60; return `${h}:${String(mm).padStart(2,'0')}`; };
var fmtK = m => { const h=Math.floor(m/60)%24, mm=String(m%60).padStart(2,'0'); return (h<12?'오전 ':'오후 ')+((h%12)||12)+':'+mm; };
function hue(s){ return [...String(s)].reduce((a,c)=>a*31+c.charCodeAt(0)>>>0,7)%360; }
function svgURI(s){ return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(s); }

/* ===================== 아이콘 ===================== */
var ic = {
  back:'<svg width="12" height="21" viewBox="0 0 12 21"><path d="M10.5 1.5L1.8 10.5l8.7 9" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  sig:'<svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg>',
  wifi:'<svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor"><path d="M8.5 2.4c2.4 0 4.6.9 6.3 2.5l1.2-1.2C14 1.7 11.4.6 8.5.6S3 1.7 1 3.7l1.2 1.2C3.9 3.3 6.1 2.4 8.5 2.4zM8.5 5.9c1.4 0 2.7.5 3.7 1.4l1.2-1.2C12.1 4.9 10.4 4.1 8.5 4.1S4.9 4.9 3.6 6.1l1.2 1.2c1-.9 2.3-1.4 3.7-1.4zM8.5 9.3c-.7 0-1.3.3-1.7.7l1.7 1.8 1.7-1.8c-.4-.4-1-.7-1.7-.7z"/></svg>',
  focus:'<svg width="15" height="15" viewBox="0 0 24 24"><rect x="3" y="9" width="18" height="12" rx="2.5" fill="#bf5af2"/><path d="M3.5 8.5l1.6-4.3 15.7 2-1 2.8z" fill="#bf5af2"/></svg>',
  bat:(p,dark)=>`<svg width="27" height="13" viewBox="0 0 27 13"><rect x=".5" y=".5" width="23" height="12" rx="4" fill="none" stroke="currentColor" opacity=".35"/><rect x="2" y="2" width="${Math.max(1.5,20*p/100)}" height="9" rx="2.4" fill="${p<=20?'#ff3b30':'currentColor'}"/><path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2z" fill="currentColor" opacity=".4"/></svg>`,
  lock:'<svg width="15" height="20" viewBox="0 0 15 20" fill="#fff"><path d="M2.5 8V6a5 5 0 0110 0v2h.5a2 2 0 012 2v8a2 2 0 01-2 2H2a2 2 0 01-2-2v-8a2 2 0 012-2zm2 0h6V6a3 3 0 00-6 0z"/></svg>',
  torch:'<svg width="20" height="24" viewBox="0 0 20 24" fill="none" stroke="#fff" stroke-width="1.8"><path d="M5 2h10v4l-2 4v11a1 1 0 01-1 1H8a1 1 0 01-1-1V10L5 6z"/><circle cx="10" cy="14" r="1.4" fill="#fff"/></svg>',
  cam:'<svg width="24" height="20" viewBox="0 0 24 20" fill="none" stroke="#fff" stroke-width="1.8"><path d="M2 6a2 2 0 012-2h3l2-2.5h6L17 4h3a2 2 0 012 2v11a2 2 0 01-2 2H4a2 2 0 01-2-2z"/><circle cx="12" cy="11" r="4"/></svg>',
  plus:'<svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4v14M4 11h14"/></svg>',
  up:'<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 13V3M3.5 7.5L8 3l4.5 4.5"/></svg>',
  compose:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 4H5a1 1 0 00-1 1v14a1 1 0 001 1h14a1 1 0 001-1v-9"/><path d="M18.5 2.5l3 3L12 15l-4 1 1-4z"/></svg>',
  search:'<svg width="17" height="17" viewBox="0 0 17 17" fill="none" stroke="currentColor" stroke-width="2"><circle cx="7" cy="7" r="5.5"/><path d="M11 11l4.5 4.5" stroke-linecap="round"/></svg>',
  heart:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 20s-7.5-4.6-9.2-9.3C1.6 7.3 4 4 7.3 4c2 0 3.6 1.2 4.7 2.8C13.1 5.2 14.7 4 16.7 4 20 4 22.4 7.3 21.2 10.7 19.5 15.4 12 20 12 20z"/></svg>',
  heartF:'<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 20s-7.5-4.6-9.2-9.3C1.6 7.3 4 4 7.3 4c2 0 3.6 1.2 4.7 2.8C13.1 5.2 14.7 4 16.7 4 20 4 22.4 7.3 21.2 10.7 19.5 15.4 12 20 12 20z"/></svg>',
  share:'<svg width="22" height="24" viewBox="0 0 22 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 8H4v14h14V8h-3M11 15V1M7 5l4-4 4 4"/></svg>',
  info:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 11v6M12 7.2v.1" stroke-linecap="round"/></svg>',
  trash:'<svg width="22" height="24" viewBox="0 0 22 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 5h18M8 5V2h6v3M4 5l1 17h12l1-17"/></svg>',
  chat:'<svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M13 3C7 3 2.5 6.8 2.5 11.4c0 3 1.9 5.6 4.8 7.1l-1 4 4.3-2.6c.8.1 1.6.2 2.4.2 6 0 10.5-3.8 10.5-8.6S19 3 13 3z"/></svg>',
  chatF:'<svg width="26" height="26" viewBox="0 0 26 26" fill="currentColor"><path d="M13 3C7 3 2.5 6.8 2.5 11.4c0 3 1.9 5.6 4.8 7.1l-1 4 4.3-2.6c.8.1 1.6.2 2.4.2 6 0 10.5-3.8 10.5-8.6S19 3 13 3z"/></svg>',
  person:'<svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="13" cy="9" r="4.5"/><path d="M4 23c1-5 4.5-7.5 9-7.5s8 2.5 9 7.5"/></svg>',
  personF:'<svg width="26" height="26" viewBox="0 0 26 26" fill="currentColor"><circle cx="13" cy="9" r="5"/><path d="M3.5 23.5c1-5.5 4.8-8 9.5-8s8.5 2.5 9.5 8z"/></svg>',
  dots:'<svg width="26" height="26" viewBox="0 0 26 26" fill="currentColor"><circle cx="6" cy="13" r="2"/><circle cx="13" cy="13" r="2"/><circle cx="20" cy="13" r="2"/></svg>',
  phoneG:'<svg width="26" height="26" viewBox="0 0 26 26" fill="currentColor"><path d="M8.5 3.5c.9-.3 1.9 0 2.3.9l1.9 3.8c.4.8.2 1.8-.5 2.3L10.4 12c1.2 2.6 3.2 4.6 5.7 5.8l1.5-1.8c.6-.7 1.5-.9 2.3-.5l3.8 1.9c.9.4 1.2 1.4.9 2.3-.9 2.6-3.4 4.2-6.1 3.7-7.3-1.4-12.6-6.7-14-14C4.1 6.8 5.8 4.4 8.5 3.5z"/></svg>',
  star:'<svg width="26" height="26" viewBox="0 0 26 26" fill="currentColor"><path d="M13 2.5l3.2 6.6 7.2 1-5.2 5 1.3 7.2L13 18.9l-6.5 3.4 1.3-7.2-5.2-5 7.2-1z"/></svg>',
  clockG:'<svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="currentColor" stroke-width="2"><circle cx="13" cy="13" r="10"/><path d="M13 7v6l4 2"/></svg>',
  grid:'<svg width="26" height="26" viewBox="0 0 26 26" fill="currentColor">'+[0,1,2].map(r=>[0,1,2].map(c=>`<circle cx="${6+c*7}" cy="${6+r*7}" r="2.4"/>`).join('')).join('')+'</svg>',
  vm:'<svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="currentColor" stroke-width="2"><circle cx="7" cy="13" r="4.5"/><circle cx="19" cy="13" r="4.5"/><path d="M7 17.5h12"/></svg>',
};
/* 앱 아이콘 기본 그림 (62x62) */
var APPS = {
  talk:{l:'톡', g:'<svg viewBox="0 0 62 62"><defs><linearGradient id="gt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe76a"/><stop offset="1" stop-color="#ffd21e"/></linearGradient></defs><rect width="62" height="62" fill="url(#gt)"/><path d="M31 14c-10.5 0-19 6.6-19 14.8 0 5.2 3.5 9.8 8.8 12.4l-1.9 7.2 7.9-5.1c1.4.2 2.8.3 4.2.3 10.5 0 19-6.6 19-14.8S41.5 14 31 14z" fill="#3a2a1a"/><text x="31" y="33" font-size="9.5" font-weight="800" fill="#ffd21e" text-anchor="middle" font-family="sans-serif">TALK</text></svg>'},
  sms:{l:'메시지', g:'<svg viewBox="0 0 62 62"><defs><linearGradient id="gm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5ef777"/><stop offset="1" stop-color="#11c93d"/></linearGradient></defs><rect width="62" height="62" fill="url(#gm)"/><ellipse cx="31" cy="29" rx="19" ry="15.5" fill="#fff"/><path d="M15.5 40c-.6 3.5-2.6 6-5 7.5 4.3.4 8.6-1 11.5-3.6z" fill="#fff"/></svg>'},
  photos:{l:'사진', g:'<svg viewBox="0 0 62 62"><rect width="62" height="62" fill="#fff"/>'+['#f9a03f','#f6d03a','#7fd04b','#3fc4c6','#3c8cf2','#8a62e8','#e55ba2','#f2564f'].map((c,i)=>`<ellipse cx="31" cy="18" rx="6.4" ry="11.2" fill="${c}" opacity=".88" style="mix-blend-mode:multiply" transform="rotate(${i*45} 31 31)"/>`).join('')+'</svg>'},
  notes:{l:'메모', g:'<svg viewBox="0 0 62 62"><rect width="62" height="62" fill="#fff"/><rect width="62" height="16" fill="#fecf3e"/><rect y="15" width="62" height="1.5" fill="#e3b021"/><g stroke="#d9d9d9" stroke-width="1.3"><path d="M7 27h48M7 36h48M7 45h48"/></g><g fill="#b9b9b9"><circle cx="9" cy="8" r="1.6"/><circle cx="15" cy="8" r="1.6"/><circle cx="21" cy="8" r="1.6"/></g></svg>'},
  phone:{l:'전화', g:'<svg viewBox="0 0 62 62"><defs><linearGradient id="gp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5ef777"/><stop offset="1" stop-color="#11c93d"/></linearGradient></defs><rect width="62" height="62" fill="url(#gp)"/><path d="M22.4 14.8c1.2-.4 2.6 0 3.2 1.2l2.7 5.4c.6 1.1.3 2.5-.6 3.3l-2.6 2.3c1.7 3.7 4.5 6.5 8.1 8.2l2.2-2.6c.8-.9 2.2-1.2 3.3-.6l5.4 2.7c1.2.6 1.6 2 1.2 3.2-1.3 3.7-4.8 6-8.7 5.3C24.1 46.2 16.8 38.9 14.8 28.4c-.6-3.9 1.6-7.4 5.3-8.7z" fill="#fff" transform="translate(-1 -1)"/></svg>'},
  calendar:{l:'캘린더', g:()=>`<svg viewBox="0 0 62 62"><rect width="62" height="62" fill="#fff"/><text x="31" y="17" text-anchor="middle" font-size="10" fill="#ff3b30" font-weight="600" font-family="sans-serif">${S?DATES[S.day].w:'월요일'}</text><text x="31" y="49" text-anchor="middle" font-size="32" fill="#111" font-weight="300" font-family="sans-serif">${S?DATES[S.day].d:10}</text></svg>`},
  camera:{l:'카메라', g:'<svg viewBox="0 0 62 62"><defs><linearGradient id="gc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e8e8ec"/><stop offset="1" stop-color="#a7a7ad"/></linearGradient></defs><rect width="62" height="62" fill="url(#gc)"/><rect x="9" y="19" width="44" height="29" rx="6" fill="#2c2c2e"/><rect x="21" y="15" width="12" height="5" rx="2" fill="#2c2c2e"/><circle cx="31" cy="33.5" r="10" fill="#6e6e73"/><circle cx="31" cy="33.5" r="7" fill="#1c1c1e"/><circle cx="33" cy="31.5" r="2" fill="#5a6c8a"/><circle cx="46" cy="25" r="2" fill="#ffd60a"/></svg>'},
  clock:{l:'시계', g:()=>{ const m=(S?S.time:520); const h=(m/60)%12, mi=m%60; const ha=h*30-90, ma=mi*6-90; const r=a=>a*Math.PI/180; return `<svg viewBox="0 0 62 62"><rect width="62" height="62" fill="#000"/><circle cx="31" cy="31" r="25" fill="#fff"/>${[...Array(12)].map((_,i)=>`<text x="${31+19*Math.cos(r(i*30-60))}" y="${33.5+19*Math.sin(r(i*30-60))}" font-size="6.5" text-anchor="middle" font-family="sans-serif" fill="#000">${i+1}</text>`).join('')}<path d="M31 31L${31+11*Math.cos(r(ha))} ${31+11*Math.sin(r(ha))}" stroke="#000" stroke-width="2.6" stroke-linecap="round"/><path d="M31 31L${31+17*Math.cos(r(ma))} ${31+17*Math.sin(r(ma))}" stroke="#000" stroke-width="1.8" stroke-linecap="round"/><circle cx="31" cy="31" r="2" fill="#ff9500"/></svg>`; }},
  weather:{l:'날씨', g:'<svg viewBox="0 0 62 62"><defs><linearGradient id="gw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3d9cff"/><stop offset="1" stop-color="#1e6ad8"/></linearGradient></defs><rect width="62" height="62" fill="url(#gw)"/><circle cx="25" cy="25" r="10" fill="#ffd60a"/><path d="M22 46h22a7.5 7.5 0 000-15 10.5 10.5 0 00-19.5 3.5A6 6 0 0022 46z" fill="#fff"/></svg>'},
  music:{l:'음악', g:'<svg viewBox="0 0 62 62"><defs><linearGradient id="gmu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff6680"/><stop offset="1" stop-color="#fa233b"/></linearGradient></defs><rect width="62" height="62" fill="url(#gmu)"/><path d="M25 17l18-4.5v25a6 6 0 11-3-5.2V19l-12 3v19a6 6 0 11-3-5.2z" fill="#fff"/></svg>'},
  maps:{l:'지도', g:'<svg viewBox="0 0 62 62"><rect width="62" height="62" fill="#f2efe6"/><path d="M0 40L62 18v10L0 50z" fill="#9fd1a0"/><path d="M20 0h9l-6 62h-9z" fill="#ffd26b"/><path d="M0 22l62 20" stroke="#fff" stroke-width="5"/><circle cx="40" cy="25" r="9" fill="#ff3b30"/><circle cx="40" cy="25" r="3.5" fill="#fff"/></svg>'},
  voice:{l:'음성 메모', g:'<svg viewBox="0 0 62 62"><rect width="62" height="62" fill="#1c1c1e"/><g fill="#ff3b30">'+[8,14,24,34,22,12,18,28,16,10,6].map((h,i)=>`<rect x="${10+i*4}" y="${31-h/2}" width="2.2" height="${h}" rx="1.1"/>`).join('')+'</g></svg>'},
  settings:{l:'설정', g:'<svg viewBox="0 0 62 62"><defs><linearGradient id="gs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b8b8bd"/><stop offset="1" stop-color="#7e7e84"/></linearGradient></defs><rect width="62" height="62" fill="url(#gs)"/><circle cx="31" cy="31" r="19" fill="none" stroke="#3a3a3c" stroke-width="7" stroke-dasharray="4.2 3.25"/><circle cx="31" cy="31" r="15" fill="#d7d7dc"/><circle cx="31" cy="31" r="12" fill="none" stroke="#8e8e93" stroke-width="1.2"/><circle cx="31" cy="31" r="5" fill="#8e8e93"/><g stroke="#8e8e93" stroke-width="2">'+[0,60,120].map(a=>`<path d="M31 21v20" transform="rotate(${a} 31 31)"/>`).join('')+'</g></svg>'},
  safari:{l:'Safari', g:'<svg viewBox="0 0 62 62"><rect width="62" height="62" fill="#fff"/><circle cx="31" cy="31" r="23" fill="#1e88f7"/><circle cx="31" cy="31" r="21" fill="none" stroke="#fff" stroke-width=".8" stroke-dasharray="1 2.3"/><path d="M42 20L33.5 33.5 20 42l8.5-13.5z" fill="#fff"/><path d="M42 20L33.5 33.5l-5-5z" fill="#ff3b30"/></svg>'},
};
function appIcon(k,size){
  const a=APPS[k]; const img=ASSETS.icons[k]; const g=typeof a.g==='function'?a.g():a.g;
  if(img) return `<div class="icon" style="background-image:url('${img}')"></div>`;
  return `<div class="icon" style="overflow:hidden">${g}</div>`;
}
function miniIcon(k){ const a=APPS[k]||APPS.talk; const g=typeof a.g==='function'?a.g():a.g; const img=ASSETS.icons[k]; return img?`<div style="width:100%;height:100%;background:url('${img}') center/cover"></div>`:g.replace('<svg','<svg width="100%" height="100%"'); }
function avatar(k,cls='av',style=''){
  const c=CAST[k]||{n:'?',s:'?',c:'#999'}; const img=ASSETS.avatars[k];
  if(k==='pd') return `<div class="${cls}" style="background:#1c1c1e;${style}"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8"><rect x="3" y="9" width="18" height="11" rx="2"/><path d="M3 9l2-5 16 2-1 3M8 4.5l-1 4M13 5l-1 4M18 5.7l-1 3.3"/></svg></div>`;
  return `<div class="${cls}" style="background:${img?`url('${img}') center/cover`:c.c};${style}">${img?'':esc(k==='sis'?'누':c.s[0])}</div>`;
}

/* ===================== 상태 / 저장 ===================== */
var KEY='hslog_saves_v2';
function loadAll(){ try{return JSON.parse(localStorage.getItem(KEY))||{}}catch(e){return {}} }
function saveAll(o){ try{localStorage.setItem(KEY,JSON.stringify(o))}catch(e){} }
var SAVES=loadAll();
var S=null;
function save(){ if(!S) return; S.savedAt=Date.now(); SAVES[S.name]=S; saveAll(SAVES); }
function freshState(name,pin){
  const chats=JSON.parse(JSON.stringify(HISTORY)); chats.dy={msgs:[]}; let mid=1, t=1;
  for(const k of ['ec','sis','ex','pd']) chats[k].lastAt=t++;
  for(const k in chats){ chats[k].unread=0; chats[k].msgs.forEach(m=>{ m.id=mid++; if(m.x) m.x=T(m.x); }); }
  return {name,pin,day:1,time:8*60+40,battery:82,focus:false,mid,
    st:{dist:0,under:0,mg:0,hj:0,js:0,so:0,sway:0},
    flags:{},clues:{},side:{},rxDone:{},fav:{},
    chats,threads:{},pend:{},exName:'{ex.s} 🐻',exFav:true,album:'keep',alarm650:true,myPfp:'couple',
    sms:{inbox:[],sent:null},poll:{},notes:{},ended:false,started:Date.now()};
}
var CHATS = {
  pd:{t:()=>T('{pd}'),k:'pd'},
  house:{t:()=>T('{pd.s} · 하우스'),k:'house',group:true,get n(){return S&&S.day>=4?9:8;}},
  dy:{t:()=>T('{dy}'),k:'dy'},
  mg:{t:()=>T('{mg}'),k:'mg'}, hj:{t:()=>T('{hj}'),k:'hj'}, js:{t:()=>T('{js}'),k:'js'}, so:{t:()=>T('{so}'),k:'so'},
  ex:{t:()=>T(S.exName),k:'ex'},
  sis:{t:()=>T('{sis}'),k:'sis',outside:true}, ec:{t:()=>T('{ec}'),k:'ec',outside:true},
};

/* ===================== 엔진 ===================== */
var running={}, GEN=0;
function done(tid){ return S.threads[tid] && S.threads[tid].status==='done'; }
function startThread(tid){ if(!S.threads[tid]) S.threads[tid]={i:0,status:'run'}; runThread(tid); }
var LABELS={};
for(const k in SCRIPT){ LABELS[k]={}; SCRIPT[k].forEach((s,i)=>{ if(s.label) LABELS[k][s.label]=i; }); }
async function runThread(tid){
  if(running[tid]) return; running[tid]=true;
  const g=GEN, myS=S, th=S.threads[tid], steps=SCRIPT[tid];
  try{
    while(th.i<steps.length && S===myS && g===GEN && !S.ended){
      const r=await exec(steps[th.i],tid);
      if(S!==myS||g!==GEN) return;
      if(r==='pause'){ running[tid]=false; return; }
      if(typeof r==='number') th.i=r; else th.i++;
      save();
    }
    if(S===myS&&g===GEN&&th.i>=steps.length){ th.status='done'; save(); }
  } finally { if(g===GEN) running[tid]=false; }
}
async function exec(st,tid){
  if(st.label!==undefined) return;
  if(st.time!==undefined){ S.time=st.time; return; }
  if(st.start){ startThread(st.start); return; }
  if(st.sleep){ await sleep(st.sleep); return; }
  if(st.do){ st.do(); render(); return; }
  if(st.if && st.go){ return st.if()?LABELS[tid][st.go]:undefined; }
  if(st.if && !st.if()) return;
  if(st.go){ return LABELS[tid][st.go]; }
  if(st.sys){ deliver(st.sys[0],{sys:T(st.sys[1])}); return; }
  if(st.msg){
    const [chat,from,text,extra={}]=st.msg;
    const d = st.quick?300:(st.d ?? Math.min(2600,Math.max(800,500+(text||'').length*55)));
    if(extra.d && !S.chats[chat].msgs.some(m=>m.d===extra.d)) deliver(chat,{d:extra.d});
    if(isViewing(chat)){ typingIn={chat,who:from}; render(); await sleep(d); typingIn=null; } else await sleep(d*.7);
    const m={f:from,x:T(text),tm:fmtK(S.time)}; if(extra.kind){m.kind=extra.kind;m.data=extra.data;} if(extra.key) m.key=extra.key;
    deliver(chat,m); return;
  }
  if(st.choice){
    const prev=S.pend[st.choice];
    S.pend[st.choice]={tid,i:S.threads[tid].i,dl:prev&&prev.tid===tid&&prev.i===S.threads[tid].i?prev.dl:(st.timeout?Date.now()+st.timeout*1000:null)};
    save(); render(); return 'pause';
  }
  if(st.sheet){ S.pend._sheet={tid,i:S.threads[tid].i}; save(); render(); return 'pause'; }
  if(st.wait){
    S.waitHint=st.hint||null; const g=GEN;
    await new Promise(res=>{ const iv=setInterval(()=>{ if(!S||S.ended||g!==GEN){clearInterval(iv);return;} if(st.wait()){clearInterval(iv);res();} },400); });
    if(S) S.waitHint=null; return;
  }
}
function optOf(chat){ const p=S.pend[chat]; if(!p) return null; const st=SCRIPT[p.tid][p.i]; return st.choice?st:null; }
function pick(chat,idx){
  const p=S.pend[chat]; if(!p) return;
  const st=SCRIPT[p.tid][p.i]; const o=(st.choice?st.o:st.sheet.o)[idx];
  delete S.pend[chat]; TYPE=null;
  let myMsg=null;
  if(chat!=='_sheet' && !o.silent){
    myMsg={f:'me',x:T(o.text||o.l),tm:fmtK(S.time),rc:chat==='house'?7:1};
    deliver(chat,myMsg);
    if(chat==='house') countDown(myMsg);
    else { const g=GEN; setTimeout(()=>{ if(g!==GEN) return; myMsg.rc=0; render(); },1600); }
    if(o.rx){ const g=GEN; setTimeout(()=>{ if(g!==GEN) return; myMsg.rx=myMsg.rx||{}; myMsg.rx[o.rx[0]]=o.rx[1]; save(); render(); },2600); }
  }
  if(o.fx) applyFx(o.fx);
  if(o.do) o.do();
  const th=S.threads[p.tid];
  th.i = o.go!==undefined ? LABELS[p.tid][o.go] : p.i+1;
  save(); render(); lastAct=Date.now();
  const g=GEN; setTimeout(()=>{ if(g===GEN) runThread(p.tid); },500);
}
function applyFx(o){ for(const k in o){ if(k in S.st) S.st[k]+=o[k]; else S.flags[k]=o[k]; } }
function countDown(m){
  const g=GEN; const iv=setInterval(()=>{
    if(!S||g!==GEN){clearInterval(iv);return;}
    const floor=S.flags.holdOne?1:0;
    if(m.rc>floor){ m.rc--; render(); } else if(!S.flags.holdOne) clearInterval(iv);
  },900);
}
function markGroupRead(){ S.chats.house.msgs.forEach(x=>{ if(x.f==='me') x.rc=0; }); render(); }
function closeOutside(){ for(const k in CHATS){ if(CHATS[k].outside&&S.pend[k]){ const th=S.threads[S.pend[k].tid]; th.status='done'; th.i=1e9; delete S.pend[k]; } } }
function deliver(chat,m){
  const c=S.chats[chat]; if(S.day>1&&(m.f||m.sys)&&c.dayMark!==S.day){ c.dayMark=S.day; c.msgs.push({d:DATES[S.day].full,id:S.mid++}); }
  m.id=S.mid++; c.msgs.push(m); if(m.f||m.sys) c.lastAt=Date.now();
  if(m.f && m.f!=='me'){
    if(!isViewing(chat)){ c.unread=(c.unread||0)+1; notify(chat,m); }
    if(chat!=='house') c.msgs.forEach(x=>{ if(x.f==='me') x.rc=0; });
  }
  save(); render();
}
function isViewing(chat){ return V.screen==='app' && V.app==='talk' && V.chat===chat; }
var typingIn=null;
function addClue(id){
  if(S.clues[id]) return; S.clues[id]=Date.now();
  if(id!=='cried') S.st.under+=1;
  const ct=$('#clueToast'); ct.innerHTML='관찰 노트에 기록됨<br><b>'+esc(T(CLUES[id].t))+'</b>'; ct.classList.add('on');
  clearTimeout(ct._t); ct._t=setTimeout(()=>ct.classList.remove('on'),2400); save();
}
function addSide(id){ S.side[id]=true; save(); }
function receiveSms(){
  const inbox=(SMS_IN[S.day]||SMS_IN[1])();
  inbox.sort(()=>Math.random()-.5);
  inbox.forEach((m,i)=>{ m.id=S.day+'_'+i; m.n=i+1; m.read=false; m.tm=fmtK(S.time); });
  S.sms.inbox=inbox; save();
  notifyRaw('sms','메시지',`발신자 정보 없음 외 ${inbox.length-1}명`,'새 문자 '+inbox.length+'통');
  render();
}
function npcSms(){
  const r=(S.day===1?SMS_NPC[1]:(SMS_NPC[S.day]||SMS_NPC.d))();
  if(S.sms.sent&&S.day<7) r.unshift({f:'me',to:S.sms.sent.to});
  return r;
}
function animatePoll(){
  const P=S.poll.dinner; P.votes={kimchi:[],pasta:[],pork:[]}; P.votes[P.me].push('me');
  [['so','kimchi'],['js','kimchi'],['ex','pasta'],['mg','pork'],['ca','kimchi'],['cb','pork'],['hj','kimchi']].forEach(([w,v],i)=>{
    const g=GEN; setTimeout(()=>{ if(g!==GEN) return; P.votes[v].push(w); save(); render(); },700*(i+1)); });
}

/* ===================== 렌더 ===================== */
var V={screen:'setup'};
var lastAct=Date.now();
var TYPE=null;
function render(){
  if(!S && V.screen!=='setup' && V.screen!=='pin') V.screen='setup';
  renderSB();
  const el=$('#view');
  let html='';
  try{
    if(V.screen==='setup') html=vSetup();
    else if(V.screen==='pin') html=vPin();
    else if(V.screen==='lock') html=vLock();
    else if(V.screen==='home') html=vHome();
    else html=vApp();
  }catch(e){ console.error(e); html=`<div class="view"><div class="empty">화면 오류: ${esc(e.message)}</div></div>`; }
  const key=V.screen+'|'+(V.app||'')+'|'+(V.chat||'')+'|'+(V.sub||'')+'|'+(V.tab||'');
  const changed=el.dataset.key!==key;
  if(!changed && el._last===html){ afterRender(false); return; }
  const body=el.querySelector('.chatbody'); const atBottom=body?(body.scrollHeight-body.scrollTop-body.clientHeight<90):true;
  const sc=el.querySelector('.scrl'); const prevScroll=sc?sc.scrollTop:null;
  const strip=el.querySelector('.strip'); const prevStrip=strip?strip.scrollLeft:null;
  el.dataset.key=key; el._last=html; el.innerHTML=html;
  const v=el.firstElementChild;
  if(v){
    if(changed && V.anim){ v.classList.add(V.anim); if(V.anim==='zoom'&&V.origin){ v.style.setProperty('--ox',V.origin.x+'px'); v.style.setProperty('--oy',V.origin.y+'px'); } }
  }
  V.anim=null;
  const nb=el.querySelector('.chatbody'); if(nb){ if(atBottom||changed) nb.scrollTop=nb.scrollHeight; else if(body) nb.scrollTop=body.scrollTop; }
  if(!changed && prevScroll!=null){ const s=el.querySelector('.scrl'); if(s) s.scrollTop=prevScroll; }
  const ns=el.querySelector('.strip'); if(ns){ if(!changed && prevStrip!=null) ns.scrollLeft=prevStrip; else if(V.idx) ns.scrollLeft=V.idx*ns.clientWidth; }
  afterRender(true);
}
function afterRender(full){
  renderSheet();
  if(V.screen==='app' && V.app==='talk' && V.chat) afterChatOpen(V.chat);
  if(TYPE && full) paintType();
}
function renderSB(){
  const sb=$('#sb');
  if(!S||V.screen==='setup'||V.screen==='pin'){ sb.innerHTML=''; return; }
  const light = V.screen!=='app' || ['voice','clock','camera','prof'].includes(V.app) || (V.app==='talk'&&V.sub&&String(V.sub).startsWith('prof')) || (V.app==='photos'&&V.dark);
  sb.className=light?'light':'dark';
  sb.innerHTML=`<span class="l">${fmtT(S.time)}${S.focus?ic.focus:''}</span><span class="r">${ic.sig}${ic.wifi}${ic.bat(S.battery)}</span>`;
}
function navBar(title,back,opts={}){
  const {right='',big=false,backLabel=''}=opts;
  return `<div class="nav ${big?'big':''}"><div class="row"><button class="bk" data-a="${back}" data-back>${ic.back}${esc(backLabel)}</button><div class="tt">${esc(title)}</div><div class="rb">${right}</div></div>${big?`<h2>${esc(title)}</h2>`:''}</div>`;
}
var homeBar=(w)=>`<div class="homebar ${w?'w':''}"></div><div class="homehit" data-a="home"></div>`;

/* ---------- 시작 / 비밀번호 ---------- */
var pinBuf='', pinMode=null, pinTarget=null, pinFirst='', newName='';
function vSetup(){
  const names=Object.keys(SAVES);
  return `<div class="view fadein" id="setup"><div class="in">
    <div style="width:72px;height:72px;border-radius:17px;overflow:hidden;box-shadow:0 4px 14px rgba(0,0,0,.15)">${miniIcon('talk')}</div>
    <h1>${esc(SHOW.name)}</h1>
    <p>헤어진 지 3개월.<br>7년을 함께한 사람이 같은 집에 있다.</p>
    ${names.length?`<div class="profs"><div class="gl" style="padding:0 4px 8px">이어하기</div>${names.map(n=>{const s=SAVES[n];return `<button class="li" data-a="prof" data-n="${esc(n)}"><div class="av c" style="width:40px;height:40px;background:hsl(${hue(n)} 50% 55%);font-size:16px">${esc(n[0])}</div><div class="mid"><b>${esc(n)}</b><span>${s.ending?'엔딩 봄':(s.day||1)+'일차 · '+(s.ended?'끝':fmtK(s.time))} · 단서 ${Object.keys(s.clues||{}).length}개</span></div><span class="chev">›</span></button>`}).join('')}</div>`:''}
    <div style="width:100%;margin-top:${names.length?18:4}px">
      <input id="nm" maxlength="10" placeholder="플레이어 이름" autocomplete="off">
      <button class="big" data-a="newp">새로 시작</button>
    </div>
    <div style="flex:1"></div>
    <small style="color:#999;font-size:12.5px">이름과 4자리 비밀번호로 이 기기에 저장돼요.</small>
  </div></div>`;
}
function vPin(){
  const msg = pinMode==='new1'?'비밀번호 4자리 정하기':pinMode==='new2'?'한 번 더 입력':`${esc(pinTarget)}`;
  const k=[['1',''],['2','ABC'],['3','DEF'],['4','GHI'],['5','JKL'],['6','MNO'],['7','PQRS'],['8','TUV'],['9','WXYZ']];
  return `<div class="view pinv fadein">
    <p>${msg}<small>${pinMode==='login'?'비밀번호를 입력하세요':'이어서 할 때 필요해요'}</small></p>
    <div class="pdots" id="pdots">${[0,1,2,3].map(i=>`<i class="${i<pinBuf.length?'on':''}"></i>`).join('')}</div>
    <div class="keys">${k.map(([n,l])=>`<button data-a="pk" data-k="${n}">${n}<small>${l}</small></button>`).join('')}
      <button class="nb" data-a="pinx">취소</button><button data-a="pk" data-k="0">0</button><button class="nb" data-a="pkb">지우기</button></div>
  </div>`;
}
function pinKey(k){
  if(pinBuf.length>=4) return; pinBuf+=k; render();
  if(pinBuf.length<4) return;
  setTimeout(()=>{
    if(pinMode==='new1'){ pinFirst=pinBuf; pinBuf=''; pinMode='new2'; render(); }
    else if(pinMode==='new2'){ if(pinBuf===pinFirst){ S=freshState(newName,pinBuf); save(); pinBuf=''; bootGame(true); } else { shake(); pinMode='new1'; pinFirst=''; } }
    else if(pinMode==='login'){ const s=SAVES[pinTarget]; if(s&&s.pin===pinBuf){ S=s; pinBuf=''; continueMenu(); } else shake(); }
  },160);
}
function shake(){ const d=$('#pdots'); d&&d.classList.add('shake'); if(navigator.vibrate) try{navigator.vibrate(80)}catch(e){} setTimeout(()=>{pinBuf='';render();},420); }
function continueMenu(){
  V={screen:'setup'}; render();
  showAlert(S.name, S.ending?'엔딩을 봤어요.':S.ended?`${S.day}일차를 끝냈어요.`:`${S.day}일차 ${fmtK(S.time)}에서 멈췄어요.`,
    [['처음부터',()=>{const n=S.name,p=S.pin;S=freshState(n,p);save();bootGame(true);}],[S.ended?(S.ending?'엔딩 다시 보기':'반응 보기'):'이어하기',()=>{ bootGame(false); if(S.ending) showEnding(); else if(S.ended) openTw(true); }]]);
}
function bootGame(fresh){
  GEN++; running={}; typingIn=null; TYPE=null; LOCAL_SHEET=null;
  V={screen:'lock'}; lastAct=Date.now();
  if(fresh){ S.threads={}; startThread('main'); }
  else { if(!S.flags.holdOne) S.chats.house.msgs.forEach(x=>{ if(x.f==='me') x.rc=0; }); for(const t in S.threads){ if(S.threads[t].status==='run') runThread(t); } }
  render();
}

/* ---------- 잠금화면 ---------- */
function notifList(){
  const out=[];
  for(const k in S.chats){ const c=S.chats[k]; if(c.unread>0){ const last=[...c.msgs].reverse().find(m=>m.f&&m.f!=='me'); if(last) out.push({k,app:'talk',title:CHATS[k].t(),x:(k==='house'?CAST[last.f].s+': ':'')+msgPreview(last),tm:last.tm,n:c.unread,at:c.lastAt||0}); } }
  if(S.sms.inbox.some(m=>!m.read)) out.push({k:'sms',app:'sms',title:'발신자 정보 없음',x:'새 문자 '+S.sms.inbox.filter(m=>!m.read).length+'통',tm:'지금',at:Date.now()});
  if(!S.flags.memNotif) out.push({k:'mem',app:'photos',title:'추억',x:'우리의 여름 · 2023',tm:'어제',at:0});
  return out.sort((a,b)=>b.at-a.at);
}
function vLock(){
  const ns=notifList(); const show=ns.slice(0,4); const more=ns.length-show.length;
  return `<div class="view" id="lock" style="${ASSETS.lockWallpaper?`background-image:url('${ASSETS.lockWallpaper}')`:''}">
    <div class="lk">${ic.lock}</div>
    <div class="dt">8월 ${DATES[S.day].d}일 ${DATES[S.day].w}</div><div class="tm">${fmtT(S.time)}</div>
    <div class="ns">${ns.length?`<div class="nh"><span>알림 센터</span></div>`:''}${show.map((n,i)=>`<button class="ln ${i===show.length-1&&more>0?'stack':''}" data-a="lnotif" data-k="${n.k}"><div class="a">${miniIcon(n.app)}</div><div class="m"><b>${esc(n.title)}<span>${esc(n.tm)}</span></b><div>${esc(n.x)}</div>${n.n>1?`<div style="opacity:.7;font-size:13px">추가 알림 ${n.n-1}개</div>`:''}</div></button>`).join('')}${more>0?`<div style="text-align:center;font-size:13px;opacity:.8;margin-top:6px">알림 ${more}개 더</div>`:''}</div>
    <div class="bot"><button class="ci" data-a="toast" data-t="촬영 중에는 손전등을 켤 수 없어요">${ic.torch}</button><button class="ci" data-a="toast" data-t="하우스 안 촬영은 제작진만 해요">${ic.cam}</button></div>
    <div class="sw">쓸어올려 열기</div>
    ${homeBar(true)}
  </div>`;
}
function msgPreview(m){ if(m.kind==='info') return '출연자 정보 공개'; if(m.kind==='photo') return '사진'; if(m.kind==='letter') return '파일: X 소개서.pdf'; if(m.kind==='poll') return '투표: 오늘 저녁 뭐 먹어요?'; if(m.del) return '삭제된 메시지입니다.'; return m.x; }

/* ---------- 홈 ---------- */
function talkUnread(){ let n=0; for(const k in S.chats){ if(CHATS[k].outside&&S.focus) continue; n+=S.chats[k].unread||0; } return n; }
function vHome(){
  const badge={talk:talkUnread(),sms:S.sms.inbox.filter(m=>!m.read).length+(S.flags.smsOpen&&!S.sms.sent?1:0)};
  const one=k=>`<button class="app" data-a="open" data-k="${k}">${appIcon(k)}${badge[k]?`<span class="badge" style="position:absolute;top:-6px;right:0">${badge[k]}</span>`:''}${APPS[k].l}</button>`;
  const grid=['photos','notes','insta','camera','clock','music','maps','voice','settings'];
  const ev=S.day>1?[`하우스 생활 ${S.day}일차`,S.day===7?'최종 선택':'오늘']:S.flags.inHouse?['하우스 생활 1일차','오늘']:[SHOW.name+' 입소','오전 10:30'];
  return `<div class="view" id="home" style="${ASSETS.homeWallpaper?`background-image:url('${ASSETS.homeWallpaper}')`:''}">
    <div class="hwrap">
      <div class="widgets">
        <button class="wg cal" data-a="open" data-k="calendar"><small>${DATES[S.day].w}</small><div class="d">${DATES[S.day].d}</div><div class="e">${esc(ev[0])}<span>${esc(ev[1])}</span></div></button>
        <button class="wg wx" data-a="open" data-k="weather"><b>${esc(SHOW.place)} ➤</b><div class="t">${S.time<18*60?29:24}°</div><small>${S.time<19*60?'☀︎ 맑음':'☾ 맑음'}<br>최고:31° 최저:22°</small></button>
      </div>
      <div class="wlab"><span>캘린더</span><span>날씨</span></div>
      <div class="grid">${grid.map(one).join('')}</div>
    </div>
    <div class="spot">${ic.search} 검색</div>
    <div class="dock">${['phone','safari','sms','talk'].map(k=>`<button class="app" data-a="open" data-k="${k}" style="width:62px">${appIcon(k)}${badge[k]?`<span class="badge" style="position:absolute;top:-6px;right:-7px">${badge[k]}</span>`:''}</button>`).join('')}</div>
    ${homeBar(true)}
  </div>`;
}

/* ---------- 앱 라우팅 ---------- */
function vApp(){
  const a=V.app;
  if(a==='talk') return V.chat?vChat(V.chat):(V.sub&&String(V.sub).startsWith('prof')?vProfile(V.sub.slice(5)):vTalkHome());
  if(a==='sms') return vSms();
  if(a==='photos') return vPhotos();
  if(a==='notes') return vNotes();
  if(a==='phone') return vPhone();
  if(a==='calendar') return vCal();
  if(a==='voice') return vVoice();
  if(a==='settings') return vSettings();
  if(a==='letter') return vLetter();
  if(a==='music') return vMusic();
  if(a==='clock') return vClock();
  if(a==='safari') return vSafari();
  if(a==='weather') return vWeather();
  if(a==='camera') return vCamera();
  if(a==='maps') return vMaps();
  if(a==='insta') return vInsta();
  return `<div class="view">${navBar('','home')}<div class="empty">준비 중</div>${homeBar()}</div>`;
}

/* ---------- 톡 ---------- */
function friendsList(){
  const base=['pd','sis','ec']; const house=S.flags.inHouse?['ex','mg','hj','js','so','ca','cb'].concat(S.day>=4?['dy']:[]):['ex'];
  return {fav:S.exFav?['ex']:[], all:[...new Set([...house,...base])]};
}
function vTalkHome(){
  const tab=V.tab||'chats';
  let body='';
  if(tab==='friends'){
    const F=friendsList();
    const row=k=>`<button class="li" data-a="openProf" data-k="${k}" style="--sepl:76px">${avatar(k)}<div class="mid"><b>${esc(k==='ex'?T(S.exName):CAST[k].n)}</b><span>${esc(T(PROFILES[k].status||''))}</span></div></button>`;
    body=`<div class="scrl"><div class="in">
      <button class="li" data-a="openProf" data-k="me" style="padding:12px 16px">${avatar('me','av','width:58px;height:58px;border-radius:22px;'+(S.myPfp==='couple'?`background:url('${photoSrc('meNow')}') center/cover`:''))}<div class="mid"><b style="font-size:18px">${esc(CAST.me.n)}</b><span>${esc(S.flags.myStatus||'상태메시지를 입력해 주세요')}</span></div></button>
      ${F.fav.length?`<div class="gl" style="padding:14px 16px 4px">즐겨찾기 ${F.fav.length}</div>${F.fav.map(row).join('')}`:''}
      <div class="gl" style="padding:14px 16px 4px">친구 ${F.all.length}</div>${F.all.map(row).join('')}
    </div></div>`;
  } else if(tab==='chats'){
    const order=Object.keys(CHATS).filter(k=>S.chats[k].msgs.length).sort((a,b)=>(S.chats[b].lastAt||0)-(S.chats[a].lastAt||0));
    body=`<div class="scrl"><div class="in">${order.map(k=>{ const c=S.chats[k]; const ms=c.msgs; let m={}; for(let i=ms.length-1;i>=0;i--) if(ms[i].tm){m=ms[i];break;}
      const lockd=CHATS[k].outside&&S.focus;
      return `<button class="li" data-a="chat" data-k="${k}" style="--sepl:76px">${k==='house'?`<div class="av" style="background:#ffe66d;color:#3a2a1a;font-size:13px;display:grid;grid-template-columns:1fr 1fr;padding:5px;gap:2px">${['me','ex','mg','so'].map(x=>`<i style="background:${CAST[x].c};border-radius:6px"></i>`).join('')}</div>`:avatar(CHATS[k].k)}<div class="mid"><b>${esc(CHATS[k].t())}${CHATS[k].group?` <span style="display:inline;color:#999;font-weight:400;font-size:15px">${CHATS[k].n}</span>`:''}</b><span>${lockd?'촬영 중에는 외부 대화방이 잠겨요':esc(m.f?msgPreview(m):'')}</span></div><div class="rt">${esc(m.tm||'')}${c.unread&&!lockd?`<span class="badge" style="background:#ff5b3a">${c.unread}</span>`:''}</div></button>`;}).join('')}</div></div>`;
  } else {
    body=`<div class="scrl"><div class="in" style="padding:10px 0"><div class="group"><div class="li"><div class="mid"><b>알림</b><span>촬영 중 · 출연자 대화만 알림</span></div></div><div class="li"><div class="mid"><b>저장 공간</b><span>사진 2,184장 · 대화 9개</span></div></div></div></div></div>`;
  }
  const t={friends:'친구',chats:'채팅',more:'더보기'}[tab];
  return `<div class="view ${V.anim===undefined?'':''}" style="background:#fff">
    <div class="nav" style="background:#fff"><div class="row"><button class="bk" data-a="home" data-back>${ic.back}</button><div class="tt"></div><div class="rb" style="color:#111">${ic.search}</div></div><h2 style="font-size:24px;margin-top:-4px">${t}</h2></div>
    ${body}
    <div class="tabbar">${[['friends','친구',ic.person,ic.personF],['chats','채팅',ic.chat,ic.chatF],['more','더보기',ic.dots,ic.dots]].map(([k,l,a,b])=>`<button class="${tab===k?'on':''}" data-a="ttab" data-k="${k}" style="${tab===k?'color:#111':''}">${tab===k?b:a}<span>${l}</span>${k==='chats'&&talkUnread()?`<span class="badge" style="position:absolute;margin:-2px 0 0 26px;height:17px;min-width:17px;font-size:11px">${talkUnread()}</span>`:''}</button>`).join('')}</div>
  </div>`;
}
function vProfile(k){
  const P=PROFILES[k]||{}; const c=CAST[k]; const isMe=k==='me';
  const pfp = isMe ? (S.myPfp==='couple'?photoSrc('meNow'):'') : (k==='ex'?photoSrc('exNow'):'');
  if(V.hist) return vHist(k);
  const chatOk=S.chats[k]&&S.chats[k].msgs.length;
  return `<div class="view prof fadein" style="background:linear-gradient(180deg,hsl(${hue(c.n)} 22% 52%),hsl(${hue(c.n)} 25% 22%))">
    <button class="x" data-a="profClose" data-back>✕</button>
    <button class="ph" data-a="profHist" data-k="${k}" style="background:${pfp?`url('${pfp}') center/cover`:c.c}">${pfp?'':esc(k==='sis'?'누':c.s[0])}</button>
    <h3>${esc(k==='ex'?T(S.exName):c.n)}</h3>
    <div class="stt">${esc(T(isMe?(S.flags.myStatus||''):(P.status||'')))}</div>
    <div class="acts">
      ${isMe?`<button data-a="editMe">${ic.compose}<span>프로필 편집</span></button>`:`<button data-a="${chatOk?'chat':'toast'}" data-k="${k}" data-t="아직 대화한 적이 없어요">${ic.chat}<span>1:1 채팅</span></button><button data-a="toast" data-t="촬영 중에는 통화할 수 없어요">${ic.phoneG}<span>통화하기</span></button>`}
    </div>
  </div>`;
}
function vHist(k){
  const P=PROFILES[k]||{}; const h=(k==='me'&&S.myPfp!=='couple')?[{img:'',d:'오늘',x:'기본 이미지'}].concat(P.hist||[]):(P.hist||[]);
  return `<div class="hist fadein">
    <div class="top"><button data-a="histClose" data-back style="color:#fff;font-size:17px;min-height:44px">${ic.back}</button><span style="font-size:15px">${esc(k==='ex'?T(S.exName):CAST[k].n)}</span><span style="width:30px"></span></div>
    <div class="pics">${h.length?h.map(p=>`<div class="pic"><div style="background:${p.img?`url('${photoSrc(p.img)}') center/cover`:'#333'}"></div><p>${esc(T(p.x||''))}<small>${esc(p.d)}</small></p></div>`).join(''):`<div class="pic"><div style="background:${CAST[k].c}"></div><p>기본 프로필<small>-</small></p></div>`}</div>
    ${P.statusHist?`<div style="padding:10px 20px 40px"><div style="color:#888;font-size:12.5px;margin-bottom:6px">상태메시지 기록</div>${P.statusHist.map(([d,s])=>`<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #222;font-size:15px"><span>${esc(T(s))}</span><span style="color:#888;font-size:13px">${esc(d)}</span></div>`).join('')}</div>`:'<div style="height:40px"></div>'}
  </div>`;
}
function vChat(k){
  const c=S.chats[k], meta=CHATS[k];
  const ms=c.msgs; let html='';
  const vis=ms.filter(m=>!(m.d===undefined&&m.sys===undefined&&!m.f));
  ms.forEach((m,i)=>{
    if(m.d){ html+=`<div class="datesep">${esc(m.d)}</div>`; return; }
    if(m.sys){ html+=`<div class="sysm">${esc(m.sys)}</div>`; return; }
    const prev=ms[i-1], next=ms[i+1];
    const me=m.f==='me';
    const first=!prev||prev.f!==m.f||prev.d||prev.sys;
    const showTime=!next||next.f!==m.f||next.tm!==m.tm||next.d||next.sys;
    let inner;
    if(m.kind==='photo') inner=`<div class="card" data-a="photoMsg" data-p="${m.data}"><div class="ph" style="background-image:url('${photoSrc(m.data)}')"></div></div>`;
    else if(m.kind==='letter') inner=`<div class="letter-card" data-a="letter" data-l="${m.data}"><b>${m.data==='mine'?'X 소개서 (제출본).pdf':'X 소개서.pdf'}</b><span>${m.data==='mine'?'유효기간: ~ 2026. 8. 21.':'열람 가능: '+esc(CAST.me.s)+'님만'}</span></div>`;
    else if(m.kind==='poll') inner=pollCard();
    else if(m.kind==='info') inner=infoCard();
    else if(m.del) inner=`<div class="bub del" data-a="delmsg">삭제된 메시지입니다.</div>`;
    else inner=`<div class="bub" data-mid="${m.id}">${esc(m.x)}${m.rx&&Object.keys(m.rx).length?`<span class="rxs">${Object.values(m.rx).join('')}${Object.keys(m.rx).length>1?' '+Object.keys(m.rx).length:''}</span>`:''}</div>`;
    const rc = me && m.rc>0 ? `<span class="rc" data-a="rc">${m.rc}</span>`:'';
    const hasrx=m.rx&&Object.keys(m.rx).length;
    html+=`<div class="mrow ${me?'me':''} ${first?'first':'cont'} ${hasrx?'hasrx':''}">${!me?(first?`<div data-a="openProf" data-k="${m.f}">${avatar(m.f)}</div>`:'<div class="sp"></div>'):''}<div class="mcol">${!me&&first?`<div class="who">${esc(m.f==='ex'?T(S.exName):(CAST[m.f]?CAST[m.f].n:''))}</div>`:''}<div class="bwrap">${inner}<div class="meta2">${rc}${showTime?`<span>${esc(m.tm||'')}</span>`:''}</div></div></div></div>`;
  });
  const tw = (typingIn&&typingIn.chat===k)?typingIn.who:(k==='ex'&&S.flags.exTypingNow?'ex':null);
  if(tw) html+=`<div class="mrow first">${avatar(tw)}<div class="mcol"><div class="who">${esc(CAST[tw].n)}</div><div class="bub typing"><i></i><i></i><i></i></div></div></div>`;
  return `<div class="view talk ${V.anim?'':''}">
    ${navBar(meta.t()+(meta.group?'  '+meta.n:''),'talkHome',{right:`<button data-a="toast" data-t="검색은 아직 안 돼요">${ic.search}</button><button data-a="${k==='ex'?'contactEx':'toast'}" data-t="채팅방 설정">${'<svg width="20" height="16" viewBox="0 0 20 16" fill="currentColor"><rect y="0" width="20" height="2" rx="1"/><rect y="7" width="20" height="2" rx="1"/><rect y="14" width="20" height="2" rx="1"/></svg>'}</button>`})}
    <div class="chatbody" style="${ASSETS.chatWallpaper?`background-image:url('${ASSETS.chatWallpaper}')`:''}"><div class="cin">${html}</div></div>
    ${composer(k)}
    ${homeBar()}
  </div>`;
}
function composer(k){
  const meta=CHATS[k]||{};
  if(meta.outside && S.focus) return `<div class="composer"><div class="locked">촬영 중에는 외부 연락을 할 수 없어요.</div></div>`;
  const st=optOf(k);
  if(st){
    const p=S.pend[k]; const left=p.dl?Math.max(0,Math.round((p.dl-Date.now())/1000)):null;
    const vis=st.o.map((o,i)=>[o,i]).filter(([o])=>!o.if||o.if()); const sil=vis.filter(([o])=>o.silent); const say=vis.filter(([o])=>!o.silent);
    const typed=TYPE&&TYPE.chat===k;
    return `<div class="composer">
      <div class="cbar"><button class="plus">${ic.plus}</button><div class="field" id="tf">${typed?esc(TYPE.full.slice(0,TYPE.n))+'<span class="caret"></span>':'<span class="ph">메시지 입력</span>'}</div><button class="send ${typed&&TYPE.n>=TYPE.full.length?'on':''}" id="sendbtn" data-a="send">${ic.up}</button></div>
      <div class="sugs">
        ${left!==null?`<div class="tbar"><i style="width:${Math.min(100,left/st.timeout*100)}%"></i></div>`:''}
        <div class="sh"><span>${left!==null?`답장을 기다리는 중 · ${left}초`:'할 말 고르기'}</span>${sil.map(([o,i])=>`<button data-a="pick" data-c="${k}" data-i="${i}">${esc(T(o.l))}</button>`).join('')}</div>
        ${say.map(([o,i])=>`<button class="sug ${typed&&TYPE.i===i?'sel':''}" data-a="sug" data-c="${k}" data-i="${i}">${esc(T(o.l))}</button>`).join('')}
      </div>
      ${keyboard()}
    </div>`;
  }
  const exsend = k==='ex' && S.flags.inHouse && !S.flags.exSent && !S.flags.exDecl;
  return `<div class="composer"><div class="idlebar"><button class="plus">${ic.plus}</button><div class="field" data-a="${exsend?'exsend':'idleField'}"><span class="ph">${exsend?'무슨 말을 할까…':'메시지 입력'}</span></div><button class="send">${ic.up}</button></div></div>`;
}
function keyboard(){
  const r1='ㅂㅈㄷㄱㅅㅛㅕㅑㅐㅔ',r2='ㅁㄴㅇㄹㅎㅗㅓㅏㅣ',r3='ㅋㅌㅊㅍㅠㅜㅡ';
  const k=s=>[...s].map(c=>`<button class="k" data-a="key">${c}</button>`).join('');
  return `<div class="kb"><div class="r">${k(r1)}</div><div class="r" style="padding:0 5%">${k(r2)}</div><div class="r"><button class="k g" data-a="key">⇧</button>${k(r3)}<button class="k g" data-a="key">⌫</button></div><div class="r"><button class="k g" data-a="key">123</button><button class="k g" data-a="key">☺︎</button><button class="k sp" data-a="key">스페이스</button><button class="k ret" data-a="send">보내기</button></div></div>`;
}
var typeTimer=null;
function startType(chat,i,full){
  TYPE={chat,i,full,n:0}; render(); clearInterval(typeTimer);
  typeTimer=setInterval(()=>{ if(!TYPE){clearInterval(typeTimer);return;} TYPE.n=Math.min(TYPE.full.length,TYPE.n+1); paintType(); if(TYPE.n>=TYPE.full.length) clearInterval(typeTimer); },38);
}
function paintType(){
  const f=$('#tf'); if(!f||!TYPE) return; f.innerHTML=esc(TYPE.full.slice(0,TYPE.n))+'<span class="caret"></span>';
  const b=$('#sendbtn'); if(b) b.classList.toggle('on',TYPE.n>=TYPE.full.length);
}
function afterChatOpen(k){
  const c=S.chats[k]; if(c.unread){ c.unread=0; save(); renderSB(); }
  if(k==='ex' && S.flags.inHouse && !S.flags.exTypingShown){
    S.flags.exTypingShown=true; save(); const g=GEN;
    setTimeout(()=>{ if(g!==GEN||!isViewing('ex')) {S.flags.exTypingShown=false;return;} S.flags.exTypingNow=true; render(); setTimeout(()=>{ S.flags.exTypingNow=false; render(); addClue('typing'); },3800); },1500);
  }
}
function infoCard(){
  const rows=INFO.map(([k,a,j])=>`<div style="display:flex;justify-content:space-between;gap:10px;padding:5px 0;border-bottom:.5px solid #eee;font-size:14px"><b style="font-weight:600">${esc(CAST[k].n)}</b><span style="color:#555">${a} · ${esc(j)}</span></div>`).join('');
  return `<div class="poll" style="width:260px"><b>출연자 정보 공개</b>${rows}</div>`;
}
function pollCard(){
  const P=S.poll.dinner||{}; const opts=[['kimchi','김치찌개'],['pasta','파스타'],['pork','삼겹살']];
  const votes=P.votes||{kimchi:[],pasta:[],pork:[]}; const tot=Object.values(votes).reduce((a,b)=>a+b.length,0)||1;
  return `<div class="poll"><b>오늘 저녁 뭐 먹어요?</b>${opts.map(([id,l])=>`<button class="po ${P.me===id?'sel':''}" data-a="vote" data-v="${id}"><i class="fill" style="transform:scaleX(${P.me?votes[id].length/tot:0})"></i><span><span>${P.me===id?'✓ ':''}${l}</span><span>${P.me?votes[id].length:''}</span></span>${P.me&&votes[id].length?`<small>${votes[id].map(w=>CAST[w].s).join(', ')}</small>`:''}</button>`).join('')}<small style="color:#999;font-size:12px">${P.me?'참여 '+Object.values(votes).reduce((a,b)=>a+b.length,0)+'명':'1개 선택 · 실명 투표'}</small></div>`;
}

/* ---------- 문자 (iMessage) ---------- */
function vSms(){
  const sub=V.sub;
  if(sub==='compose') return vCompose();
  if(sub && sub.startsWith('in:')){
    const m=S.sms.inbox.find(x=>x.id===sub.slice(3)); if(!m.read){ m.read=true; save(); }
    return `<div class="view ims">
      <div class="nav"><div class="row"><button class="bk" data-a="smsList" data-back>${ic.back}</button><div class="tt"></div><div class="rb"></div></div><div class="imhead">${m.reveal?avatar(m.from,'av c')+esc(CAST[m.from].n):`<div class="av c" style="background:linear-gradient(#a5a8b0,#868991)"><svg width="30" height="30" viewBox="0 0 26 26" fill="#fff"><circle cx="13" cy="9" r="5"/><path d="M3.5 23.5c1-5.5 4.8-8 9.5-8s8.5 2.5 9.5 8z"/></svg></div>발신자 정보 없음`} ›</div></div>
      <div class="chatbody"><div class="cin"><div class="imtime"><b>문자 메시지</b><br>오늘 ${esc(m.tm)}</div>
      <div class="mrow"><div class="mcol" style="max-width:78%"><div class="bub tail">${esc(T(m.x))}</div></div></div>
      ${m.guess?`<div class="imtime">내 추측: ${esc(CAST[m.guess].n)}</div>`:''}</div></div>
      ${m.reveal?'<div class="composer"><div class="locked">최종 선택 결과</div></div>':''}<div class="composer" style="${m.reveal?'display:none':''}"><div class="idlebar" style="flex-direction:column;align-items:stretch"><button class="opt" data-a="guess" data-id="${m.id}" style="text-align:center">${m.guess?'추측 바꾸기':'보낸 사람 추측하기'}</button><div style="text-align:center;color:#999;font-size:12.5px">익명 문자에는 답장할 수 없어요</div></div></div>${homeBar()}</div>`;
  }
  if(sub==='sent'){
    const s=S.sms.sent;
    return `<div class="view ims"><div class="nav"><div class="row"><button class="bk" data-a="smsList" data-back>${ic.back}</button><div class="tt"></div><div class="rb"></div></div><div class="imhead">${avatar(s.to,'av c')}${esc(CAST[s.to].n)} ›</div></div>
      <div class="chatbody"><div class="cin"><div class="imtime"><b>문자 메시지</b><br>오늘 ${esc(s.tm)}</div><div class="mrow me"><div class="mcol"><div class="bub tail">${esc(s.x)}</div><div class="dlv">전송됨</div></div></div></div></div>
      <div class="composer"><div class="locked">한 번만 보낼 수 있어요</div></div>${homeBar()}</div>`;
  }
  const rows=[];
  S.sms.inbox.forEach(m=>rows.push(`<button class="li" data-a="smsIn" data-id="${m.id}">${!m.read?'<i class="dot"></i>':'<i style="width:2px"></i>'}<div class="av c" style="background:linear-gradient(#a5a8b0,#868991);width:44px;height:44px"><svg width="26" height="26" viewBox="0 0 26 26" fill="#fff"><circle cx="13" cy="9" r="5"/><path d="M3.5 23.5c1-5.5 4.8-8 9.5-8s8.5 2.5 9.5 8z"/></svg></div><div class="mid"><b>익명 ${m.n}</b><span style="white-space:normal;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical">${esc(T(m.x))}</span></div><div class="rt">${esc(m.tm.replace(/^(오전|오후) /,''))} ›</div></button>`));
  (S.smsHist||[]).slice().reverse().forEach(h=>{ rows.push(`<div class="gl" style="padding:14px 16px 4px">${h.day}일차</div>`); (h.inbox||[]).forEach(m=>rows.push(`<div class="li" style="opacity:.75"><i style="width:2px"></i><div class="av c" style="background:#b8bac0;width:40px;height:40px"></div><div class="mid"><b>익명 ${m.n}${m.guess?' · 추측: '+esc(CAST[m.guess].s):''}</b><span>${esc(T(m.x))}</span></div></div>`)); if(h.sent) rows.push(`<div class="li" style="opacity:.75"><i style="width:2px"></i>${avatar(h.sent.to,'av c','width:40px;height:40px')}<div class="mid"><b>${esc(CAST[h.sent.to].n)}</b><span>${esc(h.sent.x)}</span></div></div>`); });
  if(S.sms.sent) rows.unshift(`<button class="li" data-a="smsSent"><i style="width:2px"></i>${avatar(S.sms.sent.to,'av c','width:44px;height:44px')}<div class="mid"><b>${esc(CAST[S.sms.sent.to].n)}</b><span>${esc(S.sms.sent.x)}</span></div><div class="rt">${esc(S.sms.sent.tm.replace(/^(오전|오후) /,''))} ›</div></button>`);
  return `<div class="view">
    <div class="nav big"><div class="row"><button class="bk" data-a="home" data-back>${ic.back}</button><div class="tt">메시지</div><div class="rb">${S.flags.smsOpen&&!S.sms.sent?`<button data-a="compose">${ic.compose}</button>`:''}</div></div><h2>메시지</h2></div>
    <div class="sf"><div class="bar" style="margin:0 16px 8px">${ic.search} 검색</div></div>
    <div class="scrl imlist"><div class="in">${rows.join('')||`<div class="empty">${S.flags.smsOpen?'오른쪽 위 연필 버튼으로 첫 문자를 보내요':'익명 문자는 밤 10시에 열려요'}</div>`}</div></div>${homeBar()}</div>`;
}
var composeTo=null;
function vCompose(){
  const ppl=['ex','mg','hj','js','so','ca','cb'];
  const opts=composeTo?(SMS_OPTS[composeTo]||SMS_OPTS._):[];
  const typed=TYPE&&TYPE.chat==='__sms';
  return `<div class="view ims">
    <div class="nav"><div class="row"><span style="width:60px"></span><div class="tt">새로운 메시지</div><div class="rb"><button data-a="smsList" data-back style="font-size:17px">취소</button></div></div></div>
    <div style="padding:10px 16px;border-bottom:.5px solid var(--sep);font-size:16px;display:flex;gap:6px;align-items:center"><span style="color:#8e8e93">받는 사람:</span>${composeTo?`<span style="background:#e5f0ff;color:var(--blue);border-radius:6px;padding:2px 8px" data-a="to" data-k="">${esc(CAST[composeTo].n)}</span>`:'<span class="caret"></span>'}</div>
    <div class="scrl"><div class="in">
      ${!composeTo?ppl.map(k=>`<button class="li" data-a="to" data-k="${k}" style="--sepl:68px">${avatar(k,'av c','width:40px;height:40px;font-size:15px')}<div class="mid"><b>${esc(CAST[k].n)}</b><span>출연자 · 익명 전송</span></div></button>`).join(''):'<div class="empty" style="padding:30px">한 사람에게, 한 번만.</div>'}
    </div></div>
    ${composeTo?`<div class="composer"><div class="cbar"><button class="plus">${ic.plus}</button><div class="field" id="tf">${typed?esc(TYPE.full.slice(0,TYPE.n))+'<span class="caret"></span>':'<span class="ph">문자 메시지</span>'}</div><button class="send ${typed&&TYPE.n>=TYPE.full.length?'on':''}" id="sendbtn" data-a="smsSend">${ic.up}</button></div>
      <div class="sugs"><div class="sh"><span>보낼 문장 고르기</span></div>${opts.map((o,i)=>`<button class="sug ${typed&&TYPE.i===i?'sel':''}" data-a="smsSug" data-i="${i}">${esc(o)}</button>`).join('')}</div>${keyboard()}</div>`:''}
  </div>`;
}

/* ---------- 사진 ---------- */
var PALS=[['#f6c28b','#e07a5f'],['#9ad1d4','#3d5a80'],['#cdb4db','#6d597a'],['#ffd6a5','#b5838d'],['#a8dadc','#457b9d'],['#f1faee','#e63946'],['#b7e4c7','#2d6a4f'],['#ffe5ec','#fb6f92']];
function photoSrc(k){ if(ASSETS.photos[k]) return ASSETS.photos[k]; const f=PH[k]||(window.PH_EXTRA&&PH_EXTRA[k]); return svgURI(f?f():PH._(k)); }
var PH={
  _:(k)=>{ const h=hue(k); const [a,b]=PALS[h%PALS.length];
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="300" height="300" fill="url(#g)"/><circle cx="${60+h%180}" cy="${70+h%60}" r="${30+h%30}" fill="#fff" opacity=".25"/><rect y="200" width="300" height="100" fill="#000" opacity=".12"/></svg>`; },
  meNow:()=>PH.sea(), exOld:()=>PH.sea(),
  sea:()=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd3a5"/><stop offset=".55" stop-color="#f6a28c"/><stop offset=".56" stop-color="#4f7fa8"/><stop offset="1" stop-color="#2a4c6e"/></linearGradient></defs><rect width="300" height="300" fill="url(#s)"/><circle cx="150" cy="160" r="26" fill="#ffe3b8" opacity=".9"/><rect y="230" width="300" height="70" fill="#e9d3b4"/><g fill="#2a2a32"><ellipse cx="128" cy="232" rx="12" ry="24"/><circle cx="128" cy="200" r="9"/><ellipse cx="160" cy="234" rx="12" ry="23"/><circle cx="160" cy="203" r="9"/></g></svg>`,
  shot1:()=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><defs><linearGradient id="n" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b1a2a"/><stop offset="1" stop-color="#3a2a2a"/></linearGradient><radialGradient id="w"><stop offset="0" stop-color="#ffe7b0"/><stop offset="1" stop-color="#ffb35c" stop-opacity="0"/></radialGradient></defs><rect width="300" height="300" fill="url(#n)"/><rect x="70" y="90" width="160" height="120" fill="#2a2230" stroke="#c9a36a" stroke-width="3"/><circle cx="150" cy="150" r="70" fill="url(#w)" opacity=".8"/>${[110,150,190].map(x=>`<circle cx="${x}" cy="160" r="7" fill="none" stroke="#ffe9b8" stroke-width="3"/>`).join('')}<rect x="10" y="10" width="280" height="3" rx="1.5" fill="#fff" opacity=".9"/><circle cx="24" cy="32" r="10" fill="#3c6e8f"/><circle cx="24" cy="32" r="11" fill="none" stroke="#3c3" stroke-width="2"/><text x="40" y="37" font-size="12" fill="#fff" font-family="sans-serif">${IG.ex}  친한 친구 · 3시간</text><rect x="105" y="230" width="90" height="34" rx="8" fill="#fff"/><text x="150" y="254" font-size="18" font-weight="800" text-anchor="middle" fill="#111" font-family="sans-serif">D-17</text></svg>`,
  exNow:()=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><rect width="300" height="300" fill="#0b0b0c"/></svg>`,
  cover:()=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><defs><linearGradient id="c" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2b3a67"/><stop offset="1" stop-color="#e58f65"/></linearGradient></defs><rect width="300" height="300" fill="url(#c)"/><g stroke="#fff" stroke-width="3" opacity=".7"><path d="M40 210h220M40 230h160"/></g><circle cx="220" cy="90" r="34" fill="#ffd9a0" opacity=".9"/></svg>`,
  group:()=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3e3cf"/><stop offset="1" stop-color="#c9a98a"/></linearGradient></defs><rect width="400" height="300" fill="url(#g)"/><rect y="210" width="400" height="90" fill="#7c5f4b"/><rect x="20" y="40" width="80" height="110" fill="#fff" opacity=".35"/><rect x="300" y="30" width="70" height="90" fill="#fff" opacity=".3"/>${GROUP_SPOTS.map(p=>{const x=p.x*4,y=p.y*3;const c=CAST[p.who].c;const turn=p.who==='ex'?-10:0;return `<g transform="translate(${x} ${y})"><ellipse cx="0" cy="78" rx="34" ry="46" fill="${c}"/><circle cx="${turn}" cy="0" r="24" fill="#f0c9a6"/><path d="M${-24+turn} -4 q24 -34 48 0 q-6 -20 -24 -22 q-18 2 -24 22" fill="#2b211c"/>${p.who==='mg'?'<path d="M-48 -40 l6 -22 m6 22 l4 -22" stroke="#f0c9a6" stroke-width="5" stroke-linecap="round"/>':''}</g>`}).join('')}</svg>`,
};
var ALBUM_US=[
  ['us1','2019년 5월 19일','학교 앞. 처음 사귄 날'],['us2','2020년 12월 24일','첫 크리스마스'],['us3','2021년 8월 2일','강릉'],
  ['us4','2022년 3월 11일','이사한 날, 박스 위에서'],['us5','2023년 7월 30일','우리의 여름'],['us6','2024년 5월 19일','5주년. {ex.s|이가} 예약한 곳'],
  ['us7','2025년 2월 14일','{ex.s} 생일'],['us8','2025년 12월 31일','작업실에서 맞은 새해'],['us9','2026년 4월 27일','마지막으로 같이 찍은 사진'],
];
var PMETA={
  us1:['iPhone 8 · 와이드 카메라','서울 학교 정문 앞'],us3:['iPhone XS','강릉 안목해변'],us5:['iPhone 13','양양'],
  us6:['iPhone 14 Pro','라온 (서울)','8주년에도 여기를 예약했었다.'],us7:['iPhone 14 Pro','우리 집'],
  us9:['{ex.s}의 iPhone','우리 집','AirDrop으로 받음. {ex.s|이가} 찍어서 보내준 사진.'],
  group:['제작진 · 공유 앨범',SHOW.place+' 하우스'],shot1:['스크린샷 · Instagram','종로','{ex.s}의 "친한 친구" 스토리를 캡처함. 24시간 뒤에 사라지는 거라서.'],sleep:['iPhone 15','우리 집','삭제한 날: 7월 17일 오전 3:02'],
};
var RECENT=['r1','r2','r3','r4','r5','r6','r7','r8','r9','r10','r11','r12'];
var PCAP={
  r1:['오늘 오전 7:58','캐리어. 너무 많이 쌌나'],r2:['어제','작업실 모니터. 2절 비어 있음'],r3:['어제','{ec.s|이가} 보낸 고양이'],r4:['8월 7일','아이스 아메리카노'],r5:['8월 5일','누나네 강아지'],r6:['8월 1일','스크린샷: 출연 계약서'],
  r7:['7월 28일','한강'],r8:['7월 21일','스크린샷: 출연 확정'],r9:['7월 18일','작업실 창문, 비'],r10:['7월 2일','믹스 체크 메모'],r11:['6월 20일','편의점 김밥'],r12:['6월 3일','이삿짐 박스 두 개'],
  shot1:['5월 2일 · 스크린샷','{ex.s}의 친한 친구 스토리. 종로, 불 켜진 쇼윈도. "D-17".\n그땐 무슨 뜻인지 몰랐다.'],
  xroom:[`8월 ${DATES[3].d}일 · 추억 공간`,'물건을 눌러봐요'],
  sleep:['7월 17일 · 삭제됨','잠든 {ex.s}. 헤어지기 전 사진. 지운 게 3주 전.'],group:['오늘 오후 2:10','사람을 눌러봐요'],
};
function albumItems(a){ if(a==='shots') return ['shot1','r6','r8']; if(a==='us') return ALBUM_US.map(x=>x[0]); if(a==='recent') return RECENT; if(a==='house') return S.flags.groupPosted?['group']:[]; if(a==='trash') return (S.flags.restored?[]:['sleep']).concat(S.album==='deleted'?ALBUM_US.map(x=>x[0]):[]); if(a==='fav') return Object.keys(S.fav).filter(k=>S.fav[k]); return []; }
function capOf(k){ const u=ALBUM_US.find(a=>a[0]===k); return u?[u[1],u[2]]:(PCAP[k]||['','']); }
function vPhotos(){
  const sub=V.sub||'';
  if(sub.startsWith('v:')) return vViewer(sub.slice(2));
  if(sub==='us' && S.album==='hidden' && !V.unlockedHidden) return `<div class="view">${navBar('가려진 항목','photos',{backLabel:'앨범'})}<div class="empty"><svg width="40" height="40" viewBox="0 0 15 20" fill="#c7c7cc"><path d="M2.5 8V6a5 5 0 0110 0v2h.5a2 2 0 012 2v8a2 2 0 01-2 2H2a2 2 0 01-2-2v-8a2 2 0 012-2zm2 0h6V6a3 3 0 00-6 0z"/></svg><br><br>이 앨범은 잠겨 있어요<br><br><button class="opt" data-a="hiddenOpen" style="display:inline-block;color:var(--blue)">앨범 보기</button></div>${homeBar()}</div>`;
  if(['us','recent','house','trash','fav','shots'].includes(sub)){
    const items=albumItems(sub); const deleted=sub==='us'&&S.album==='deleted';
    const title={shots:'스크린샷',us:S.album==='hidden'?'가려진 항목':'우리',recent:'최근 항목',house:CAST.pd.s+' · 하우스',trash:'최근 삭제된 항목',fav:'즐겨찾는 항목'}[sub];
    return `<div class="view">${navBar(title,'photos',{backLabel:'앨범',big:true})}
      <div class="scrl">
      ${sub==='trash'?'<div class="gf" style="margin:0;padding:4px 16px 10px">항목은 영구 삭제되기 전 최대 30일 동안 표시됩니다.</div>':''}
      ${sub==='us'&&!deleted?'<div class="gf" style="margin:0;padding:0 16px 10px">2,184장 · 2019년 5월 – 2026년 4월</div>':''}
      ${deleted?'<div class="empty">앨범을 지웠어요.<br>사진은 최근 삭제된 항목에 있어요.</div>':items.length?`<div class="pgrid">${items.map((k,i)=>`<button data-a="pv" data-k="${k}" data-al="${sub}" data-i="${i}" style="background-image:url('${photoSrc(k)}')">${sub==='trash'?`<small>${k==='sleep'?'7':'30'}일</small>`:''}</button>`).join('')}</div>${sub==='us'?'<div class="gf" style="text-align:center;margin:12px 0 30px">외 2,175장</div>':''}`:'<div class="empty">사진 없음</div>'}
      ${sub==='us'&&!S.flags.albumDecided&&S.flags.pdNear?`<div style="padding:16px 16px 40px" class="in"><div class="gl" style="padding:0 4px 8px">입소 전에 이 앨범을 어떻게 할까</div><div class="opts">
        <button class="opt" data-a="album" data-v="keep">그대로 둔다</button>
        <button class="opt" data-a="album" data-v="hidden">가려진 항목으로 옮긴다</button>
        <button class="opt" data-a="album" data-v="deleted">앨범을 지운다</button></div></div>`:''}
      </div>${homeBar()}</div>`;
  }
  const albums=[['recent','최근 항목','1,402','r1'],['fav','즐겨찾는 항목',String(albumItems('fav').length),albumItems('fav')[0]||''],
    S.album==='hidden'?null:['us','우리',S.album==='deleted'?'0':'2,184',S.album==='deleted'?'':'us5'],
    ['house',CAST.pd.s+' · 하우스',S.flags.groupPosted?'1':'0',S.flags.groupPosted?'group':''],['shots','스크린샷','3','shot1']].filter(Boolean);
  const util=[['trash','최근 삭제된 항목',String(albumItems('trash').length)]]; if(S.album==='hidden') util.unshift(['us','가려진 항목','🔒']);
  return `<div class="view">${navBar('앨범','home',{big:true})}
    <div class="scrl"><div class="albums">${albums.map(([k,l,n,p])=>`<button class="alb" data-a="alb" data-k="${k}"><div class="th" style="${p?`background-image:url('${photoSrc(p)}')`:''}"></div><b>${esc(l)}</b><span>${n}</span></button>`).join('')}</div>
    <div class="in"><div class="gl" style="padding:6px 16px">유틸리티</div><div class="group" style="margin:0 16px 30px">${util.map(([k,l,n])=>`<button class="li" data-a="alb" data-k="${k}"><div class="mid"><b style="font-weight:400;color:var(--blue)">${esc(l)}</b></div><span class="rt">${n}</span><span class="chev">›</span></button>`).join('')}</div></div>
    </div>${homeBar()}</div>`;
}
function vViewer(k){
  const al=V.al||'recent'; const items=V.items||[k]; const idx=V.idx||0; const cur=items[idx]||k;
  const cap=capOf(cur);
  const meta=PMETA[cur];
  let slides=items.map((key,i)=>{
    let spots='';
    const SP=(window.SPOTS&&SPOTS[key])||(key==='group'?GROUP_SPOTS:null); if(SP) spots=SP.map((p,j)=>`<button class="hs ${V.spot===j?'found':''}" style="left:${p.x}%;top:${p.y}%" data-a="spot" data-i="${j}" aria-label="${esc(p.who?CAST[p.who].n:'물건')}"></button>`).join('');
    return `<div class="slide"><div class="pic" data-a="vtap" style="background-image:url('${photoSrc(key)}');aspect-ratio:${key==='group'||key==='xroom'?'4/3':'1'}">${spots}</div></div>`;
  }).join('');
  if(cur==='group' && !S.flags.sawGroup){ S.flags.sawGroup=true; save(); }
  if(cur==='shot1' && !S.clues.story) setTimeout(()=>addClue('story'),900);
  const SPc=(window.SPOTS&&SPOTS[cur]); const capText = SPc&&V.spot!=null ? T(SPc[V.spot].t) : T(cap[1]);
  if(cur==='xroom' && !S.flags.sawXroom){ S.flags.sawXroom=true; save(); }
  return `<div class="viewer ${V.dark?'dark':''}">
    <div class="vt"><button data-a="pvBack" data-back>${ic.back}</button><div class="ttl" id="vttl"><b>${esc(cap[0])}</b></div><button data-a="toast" data-t="편집은 할 수 없어요">편집</button></div>
    <div class="strip" id="strip">${slides}</div>
    <div class="cap" id="vcap">${esc(capText)}${cur==='sleep'&&!S.flags.restored&&!S.flags.trashSeen?`<div class="opts" style="margin-top:12px"><button class="opt" data-a="restore">복구한다</button><button class="opt ghost" data-a="trashSeen">그냥 둔다</button></div>`:''}</div>
    <div class="vb"><button data-a="toast" data-t="촬영 중에는 공유할 수 없어요">${ic.share}</button><button data-a="fav" data-k="${cur}" style="${S.fav[cur]?'color:#ff2d55':''}">${S.fav[cur]?ic.heartF:ic.heart}</button><button data-a="pinfo">${ic.info}</button><button data-a="toast" data-t="입소 전에는 앨범 단위로만 정리할 수 있어요">${ic.trash}</button></div>
    ${V.info&&meta?`<div class="info" data-a="pinfo"><b>${esc(cap[0])}</b><div class="r">${esc(T(meta[0]))}<br>${esc(T(meta[1]))}${meta[2]?'<br><br>'+esc(T(meta[2])):''}</div><div class="mp"></div></div>`:''}
    ${V.info&&!meta?`<div class="info" data-a="pinfo"><b>${esc(cap[0])}</b><div class="r">iPhone 15 · 정보 없음</div></div>`:''}
    ${homeBar(V.dark)}
  </div>`;
}

/* ---------- 메모 ---------- */
var lyricAnim=null;
function vNotes(){
  const sub=V.sub||'';
  const notes=[
    {id:'song',t:'이름 없는 노래',d:'7월 30일',p:'[1절] 불 꺼진 방에 남은 건'},
    {id:'box',t:'정리할 것',d:'5월 20일',p:'{ex.s} 짐 → 박스 두 개'},
    {id:'pack',t:'입소 준비물',d:'8월 9일',p:'충전기, 편한 옷, 수면안대'},
  ];
  if(S.flags.memoOpen){ const n=S.notes; notes.unshift({id:'today',t:n.title||'새로운 메모',d:`8월 ${DATES[1].d}일`,p:(n.lines&&n.lines[0])||'추가 텍스트 없음'}); }
  if(!sub) return `<div class="view notes">${navBar('가사','home',{big:true,backLabel:' 폴더'})}
    <div class="scrl"><div class="in"><div class="sf"><div class="bar">${ic.search} 검색</div></div><div class="gl" style="padding:8px 32px">${S.flags.memoOpen?'오늘':'지난 30일'}</div><div class="group nlist" style="background:#f6f6f8">${notes.map(n=>`<button class="li" data-a="note" data-k="${n.id}" style="background:#f6f6f8"><b>${esc(T(n.t))}</b><span>${esc(n.d)}  <span style="display:inline;color:#888">${esc(T(n.p))}</span></span></button>`).join('')}</div>
    <div class="gf" style="text-align:center;margin-top:0">메모 ${notes.length}개</div></div></div>${homeBar()}</div>`;
  let body='';
  if(sub==='song'){
    body=`<div class="nd">2026년 7월 30일 오전 3:12</div><h3>이름 없는 노래</h3>
[1절]
불 꺼진 방에 남은 건
네가 고른 컵 두 개
하나는 씻어 두고
하나는 아직 못 치웠어

[2절]
${V.ver?`<div class="ver"><b>이전 버전 · 5월 2일 오후 11:40</b>

[2절]
<span class="strike">지금이 너무 좋아서 무서워</span>
<span class="strike">다 좋은데 이게 변할까 봐</span>
<span class="strike">결혼하고 나서 네가 날 안 좋아하면</span>
<span class="strike">그땐 어디로 돌아가</span>

<small style="color:#999">5월 9일 오전 2:31에 4줄 삭제됨</small></div>`:`<span style="color:#bbb">(비어 있음)</span>

<button class="opt ghost" data-a="ver" style="font-size:14px">버전 기록 보기</button>`}`;
  } else if(sub==='box'){
    body=T(`<div class="nd">2026년 5월 20일 오후 4:02</div><h3>정리할 것</h3>{ex.s} 짐 → 박스 두 개
☑ 겨울 코트
☑ 책 (회사 거)
☑ 충전기 두 개 (하나는 내 거 같은데)
☐ 머그컵 → 버릴까

<span class="strike">돌려주기</span>
택배로 보냄 (5/23)
머그컵은 못 보냄`);
  } else if(sub==='pack'){
    body=`<div class="nd">2026년 8월 9일 오후 11:20</div><h3>입소 준비물</h3>☑ 충전기
☑ 편한 옷 3벌
☑ 수면안대
☑ 노트, 펜
☐ 감기약 (여름 감기 조심)
☐ 편지 <span style="color:#999">← 가져가지 말 것</span>`;
  } else if(sub==='today'){
    const n=S.notes; const lines=n.lines||[];
    const need = !n.title || (lines.length<2 && S.flags.memoOpen) || (lines.length<4 && S.flags.memo6Open);
    const opts=need?LYRIC_OPTS():[];
    body=`<div class="nd">8월 ${DATES[1].d}일${lines.length>2?` · 8월 ${DATES[6].d}일 수정`:''}</div><h3>${n.title?esc(n.title):'<span style="color:#ccc">제목</span>'}</h3>${lines.length>0?'[2절]\n':''}${lines.map((l,i)=>(i===2?'\n':'')+esc(l)).join('\n')}${need&&n.title?'\n<span id="lyricLine"></span><span class="caret" style="background:#e1a600"></span>':''}
${need&&!lyricAnim?`<div class="gl" style="padding:18px 0 6px;font-size:13px">${!n.title?'곡 제목부터':'다음 줄'}</div><div class="opts" style="font-size:15px">${opts.map((o,i)=>`<button class="opt" data-a="lyric" data-i="${i}" style="font-family:inherit">${esc(o)}</button>`).join('')}</div>`:''}`;
  }
  return `<div class="view notes">${navBar('','notes',{backLabel:' 가사',right:`<button data-a="toast" data-t="공유할 수 없어요">${ic.share}</button>`})}<div class="notebody">${body}</div>${homeBar()}</div>`;
}

/* ---------- 전화 ---------- */
function vPhone(){
  const tab=V.tab||'recent';
  if(V.sub==='exc') return vContactEx();
  let body='', title={fav:'즐겨찾기',recent:'최근 기록',contacts:'연락처',keypad:'',vm:'음성 사서함'}[tab];
  if(tab==='recent'){
    const calls=[['ec','8월 7일','휴대전화'],['sis','8월 3일','휴대전화'],['pd','7월 21일','휴대전화'],['sis','6월 2일','휴대전화'],['ec','5월 27일','휴대전화'],
      ['ex','5월 9일','휴대전화','miss',3],['ex','5월 8일','휴대전화 · 발신 취소'],['ex','5월 8일','휴대전화']];
    body=`<div class="seg" style="margin:0 60px 8px"><button class="on">모두</button><button>부재중</button></div>`+calls.map(([k,d,t,miss,n])=>`<button class="li" data-a="call" data-k="${k}" data-m="${miss||''}" style="--sepl:16px"><div class="mid"><b style="${miss?'color:var(--red)':''};font-weight:500">${esc(k==='ex'?T(S.exName):CAST[k].n)}${n?` (${n})`:''}</b><span>${esc(t)}</span></div><div class="rt" style="flex-direction:row;align-items:center;gap:10px">${esc(d)}<span style="color:var(--blue)">${ic.info.replace('width="24" height="24"','width="22" height="22"')}</span></div></button>`).join('');
  } else if(tab==='contacts'){
    body=`<div class="sf"><div class="bar" style="margin:0 16px 8px">${ic.search} 검색</div></div><button class="li" style="padding:12px 16px">${avatar('me','av c','width:56px;height:56px')}<div class="mid"><b style="font-size:19px">${esc(CAST.me.n)}</b><span>내 카드</span></div></button>`+['ec','sis','ex','pd'].map(k=>`<button class="li" data-a="${k==='ex'?'contactEx':'toast'}" data-t="외부 연락은 제한돼요"><div class="mid"><b style="font-weight:400">${esc(k==='ex'?T(S.exName):CAST[k].n)}</b></div></button>`).join('');
  } else if(tab==='fav'){
    body=(S.exFav?[['ex','휴대전화']]:[]).concat([['sis','휴대전화']]).map(([k,t])=>`<button class="li" data-a="${k==='ex'?'contactEx':'toast'}" data-t="외부 연락은 제한돼요" style="--sepl:70px">${avatar(k,'av c','width:42px;height:42px;font-size:15px')}<div class="mid"><b style="font-weight:500">${esc(k==='ex'?T(S.exName):CAST[k].n)}</b><span>${t}</span></div></button>`).join('');
  } else if(tab==='keypad'){
    const k=[['1',''],['2','ABC'],['3','DEF'],['4','GHI'],['5','JKL'],['6','MNO'],['7','PQRS'],['8','TUV'],['9','WXYZ'],['*',''],['0','+'],['#','']];
    body=`<div style="text-align:center;font-size:36px;height:70px;margin-top:20px">${esc(V.dial||'')}</div><div class="keys" style="margin:0 auto">${k.map(([n,l])=>`<button data-a="dial" data-k="${n}" style="background:#e5e5ea;color:#000">${n}<small>${l}</small></button>`).join('')}</div><div style="text-align:center;margin-top:18px"><button data-a="toast" data-t="촬영 중에는 전화할 수 없어요" style="width:78px;height:78px;border-radius:50%;background:var(--green);color:#fff;display:inline-grid;place-items:center">${ic.phoneG}</button></div>`;
  } else {
    body=`<button class="li" data-a="vmEx"><div class="mid"><b>${esc(T(S.exName))}</b><span>5월 9일 오전 2:14 · 0:04</span></div><div class="rt">${ic.info.replace('width="24" height="24"','width="22" height="22"')}</div></button>${V.vmOpen?`<div style="padding:12px 16px;color:#555;font-size:15px;line-height:1.6;white-space:pre-wrap">(4초. 숨소리.)\n(그리고 끊김.)</div>`:''}`;
  }
  const tabs=[['fav','즐겨찾기',ic.star],['recent','최근 기록',ic.clockG],['contacts','연락처',ic.personF],['keypad','키패드',ic.grid],['vm','음성 사서함',ic.vm]];
  return `<div class="view">${tab==='keypad'?'<div style="height:50px"></div>':navBar(title,'home',{big:true})}<div class="scrl"><div class="in">${body}</div></div>
    <div class="tabbar">${tabs.map(([k,l,g])=>`<button class="${tab===k?'on':''}" data-a="ptab" data-k="${k}">${g}<span>${l}</span>${k==='vm'?'<span class="badge" style="position:absolute;margin:-4px 0 0 24px;height:17px;min-width:17px;font-size:11px">1</span>':''}</button>`).join('')}</div>
  </div>`;
}
function vContactEx(){
  return `<div class="view" style="background:#f2f2f7">${navBar('',V.backTo||'phoneBack',{right:'<button data-a="toast" data-t="편집할 수 없어요" style="font-size:17px">편집</button>'})}
    <div class="scrl"><div class="in"><div style="text-align:center;padding:6px 16px 18px">${avatar('ex','av c','width:100px;height:100px;margin:0 auto;font-size:38px')}<h2 style="margin:10px 0 0;font-size:28px;font-weight:600">${esc(T(S.exName))}</h2></div>
    <div class="group"><div class="li" style="flex-direction:column;align-items:flex-start;gap:2px"><span style="font-size:14px">휴대전화</span><span style="color:var(--blue);font-size:17px">010-••••-0219</span></div></div>
    <div class="group"><div class="li" style="flex-direction:column;align-items:flex-start;gap:2px"><span style="font-size:14px">메모</span><span>${esc(T('생일 2월 14일 · 땅콩 알레르기 · 커피는 연하게'))}</span></div></div>
    <div class="gl">이름 바꾸기</div>
    <div class="group">${['{ex.s} 🐻','{ex.s}','{ex}'].map(n=>`<button class="li" data-a="rename" data-n="${esc(n)}"><div class="mid"><b style="font-weight:400">${esc(T(n))}</b></div>${S.exName===n?'<span style="color:var(--blue)">✓</span>':''}</button>`).join('')}</div>
    <div class="group"><button class="li" data-a="favEx"><div class="mid"><b style="font-weight:400;color:var(--blue)">${S.exFav?'즐겨찾기에서 제거':'즐겨찾기에 추가'}</b></div></button><button class="li" data-a="toast" data-t="차단할 수 없었다"><div class="mid"><b style="font-weight:400;color:var(--red)">이 발신자 차단하기</b></div></button></div>
    </div></div>${homeBar()}</div>`;
}

/* ---------- 캘린더 ---------- */
function vCal(){
  const m=V.mon||'8';
  const start=m==='5'?5:((('일월화수목금토'.indexOf(DATES[1].w[0])-(DATES[1].d-1))%7)+7)%7;
  const ev=m==='5'?{8:1,19:1,2:1,9:0}:{[DATES[1].d]:1,[DATES[1].d-3]:1,[DATES[1].d+4]:1};
  const sel=V.day||(m==='5'?19:DATES[S.day].d);
  const list=m==='5'?({19:[['#ff2d55','8주년','하루 종일 · 캘린더: 우리'],['#0a84ff','종로','오후 6:00 · 만든 사람: '+CAST.ex.s,'cal'],['#0a84ff','라온 (2인 예약)','오후 7:30 · 만든 사람: '+CAST.ex.s,'cal']],8:[['#ff9500','믹스 마감','하루 종일']],2:[['#34c759','작업실 미팅','오후 3:00']]}[sel]||[])
    :({[DATES[1].d]:[['#af52de',SHOW.name+' 입소','오전 10:30 · '+SHOW.place]],[DATES[1].d-3]:[['#ff9500','데모 2절 마감 (연기됨)','하루 종일']],[DATES[1].d+4]:[['#ff9500',CAST.ec.s+' 마감','하루 종일']]}[sel]||[]);
  let cells=''; for(let i=0;i<start;i++) cells+='<i></i>';
  for(let d=1;d<=31;d++) cells+=`<button class="${ev[d]?'ev':''} ${d===sel?'sel':''} ${m==='8'&&d===DATES[S.day].d?'today':''}" data-a="day" data-d="${d}"><i>${d}</i></button>`;
  return `<div class="view cal">
    <div class="nav" style="background:#fff"><div class="row"><button class="bk" data-a="home" data-back style="color:var(--red)">${ic.back} 2026년</button><div class="tt"></div><div class="rb" style="color:var(--red)"><button data-a="mon" data-m="${m==='8'?'5':'8'}" style="font-size:15px">${m==='8'?'‹ 5월로':'8월로 ›'}</button></div></div><h2>${m}월</h2></div>
    <div class="scrl"><div class="mgrid">${['일','월','화','수','목','금','토'].map(d=>`<span>${d}</span>`).join('')}${cells}</div>
    <div class="evl">${list.length?list.map(([c,t,s,cl])=>`<button class="ev1" data-a="ev" data-c="${cl||''}"><i style="background:${c}"></i><div><b>${esc(t)}</b><div style="color:#888;font-size:13.5px">${esc(s)}</div></div></button>`).join(''):'<div class="empty" style="padding:24px">이벤트 없음</div>'}</div>
    <div class="gf" style="text-align:center;margin:10px 0 30px">공유 캘린더 "우리" · ${esc(CAST.ex.s)}와 공유 중</div></div>${homeBar()}</div>`;
}

/* ---------- 음성 메모 / 시계 / 음악 / 사파리 / 날씨 / 카메라 / 지도 ---------- */
function vVoice(){
  const list=[['데모_0423_2절','4월 23일','2:14','허밍. 2절 멜로디만 있고 가사는 없다.'],['새로운 녹음 12','5월 9일','0:41','(한참 숨소리)\n…받으면 뭐라고 해야 돼.\n(녹음 끝)'],['작업실_0730','7월 30일','5:02','기타 코드 진행. 끝에 혼잣말: "이건 못 쓰겠다."']];
  return `<div class="view" style="background:#000;color:#fff">
    <div class="nav big" style="background:#000"><div class="row"><button class="bk" data-a="home" data-back>${ic.back}</button><div class="tt">모든 녹음</div><div class="rb">편집</div></div><h2>모든 녹음</h2></div>
    <div class="scrl"><div class="in">${list.map(([t,d,l,x],i)=>`<button class="li" data-a="vm" data-i="${i}" style="background:#000;flex-direction:column;align-items:stretch;--sepl:16px"><div style="display:flex;justify-content:space-between"><b style="font-size:17px">${esc(t)}</b></div><div style="display:flex;justify-content:space-between;color:#8e8e93;font-size:14px"><span>${esc(d)}</span><span>${l}</span></div>${V.vsel==String(i)?`<div class="wave">${Array.from({length:50},(_,j)=>`<i style="height:${6+Math.abs(Math.sin(j*1.7+i))*30}px"></i>`).join('')}</div><div style="color:#ddd;font-size:15px;white-space:pre-wrap;text-align:left;margin-bottom:6px">${esc(x)}</div>`:''}</button>`).join('')}</div></div>
    <div style="display:grid;place-items:center;padding:16px 0 40px;background:#1c1c1e"><button data-a="toast" data-t="촬영 중에는 녹음할 수 없어요" style="width:62px;height:62px;border-radius:50%;border:3px solid #fff;display:grid;place-items:center"><i style="width:50px;height:50px;border-radius:50%;background:#ff3b30;display:block"></i></button></div>${homeBar(true)}</div>`;
}
function vClock(){
  const al=[['6:50','오전',T('{ex.s} 깨우기'),'주중',S.alarm650,'a650'],['7:40','오전','알람','주중',false,''],['2:00','오전','작업 끝','안 함',false,'']];
  return `<div class="view" style="background:#000;color:#fff">
    <div class="nav big" style="background:#000"><div class="row"><span class="bk" style="color:#ff9f0a">편집</span><div class="tt">알람</div><div class="rb" style="color:#ff9f0a">${ic.plus}</div></div><h2>알람</h2></div>
    <div class="scrl">${al.map(([t,ap,l,r,on,id])=>`<div class="alarm ${on?'':'off'}"><div class="t"><b>${t}<small>${ap}</small></b><span>${esc(l)}, ${r}</span></div><button class="tg ${on?'on':''}" data-a="${id?'alarm':'toast'}" data-t="그건 그냥 둔다" aria-label="알람 켜기 끄기"></button></div>`).join('')}</div>
    <div class="tabbar" style="background:#111;border-color:#222">${['세계 시계','알람','스톱워치','타이머'].map((l,i)=>`<button style="color:${i===1?'#ff9f0a':'#888'}">${ic.clockG}<span>${l}</span></button>`).join('')}</div>${homeBar(true)}</div>`;
}
function vMusic(){
  const tracks=['여름 감기','퇴근길','두 번째 겨울','신호 대기','파란 불','늦은 저녁','그날 밤 편의점','우산 하나','네가 고른 노래','처음 그 자리'];
  if(V.sub==='pl') return `<div class="view">${navBar('','music',{backLabel:' 보관함',right:'<span>⋯</span>'})}
    <div class="scrl"><div class="in"><div style="text-align:center;padding:4px 16px 14px"><div style="width:220px;height:220px;margin:0 auto;border-radius:10px;background:url('${photoSrc('cover')}') center/cover;box-shadow:0 10px 30px rgba(0,0,0,.2)"></div><h2 style="font-size:22px;margin:14px 0 2px">퇴근길 ${esc(CAST.me.s)}</h2><div style="color:#fa233b;font-size:17px">${esc(CAST.ex.s)}</div><div style="color:#888;font-size:13px;margin-top:4px">공유 플레이리스트 · 참여자 2명</div></div>
    <button class="li" data-a="plnote" style="background:#fff4f5;margin:0 16px 10px;border-radius:12px;width:calc(100% - 32px)"><div class="mid"><b style="font-size:14px;font-weight:600">${esc(CAST.ex.s)}님이 곡을 추가했습니다</b><span>3일 전 · "여름 감기"</span></div></button>
    ${tracks.map((t,i)=>`<button class="track" data-a="${i===0?'plnote':'toast'}" data-t="촬영 중에는 재생할 수 없어요"><div class="art" style="background-image:url('${photoSrc('t'+i)}')"></div><div class="mid"><b>${esc(t)}</b><span>${i===0?'추가한 사람: '+esc(CAST.ex.s)+' · 8월 7일':'추가한 사람: '+esc(i%3?CAST.ex.s:CAST.me.s)}</span></div></button>`).join('')}</div></div>${homeBar()}</div>`;
  return `<div class="view">${navBar('보관함','home',{big:true})}<div class="scrl"><div class="in">
    ${['플레이리스트','아티스트','앨범','노래'].map(l=>`<div class="li" style="color:#fa233b;font-size:19px"><div class="mid"><b style="font-weight:400;color:#fa233b">${l}</b></div><span class="chev">›</span></div>`).join('')}
    <div class="gl" style="padding:18px 16px 8px;font-size:20px;font-weight:700;color:#000">최근 추가된 항목</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;padding:0 16px"><button data-a="pl" style="text-align:left"><div style="aspect-ratio:1;border-radius:8px;background:url('${photoSrc('cover')}') center/cover"></div><b style="display:block;font-weight:400;margin-top:6px;font-size:14px">퇴근길 ${esc(CAST.me.s)}</b><span style="color:#888;font-size:13px">${esc(CAST.ex.s)}</span></button><button data-a="toast" data-t="촬영 중에는 재생할 수 없어요" style="text-align:left"><div style="aspect-ratio:1;border-radius:8px;background:url('${photoSrc('demo')}') center/cover"></div><b style="display:block;font-weight:400;margin-top:6px;font-size:14px">작업 레퍼런스</b><span style="color:#888;font-size:13px">${esc(CAST.me.s)}</span></button></div>
  </div></div>${homeBar()}</div>`;
}
function vSafari(){
  const q=['결혼 무서운 거 정상인가요','헤어지고 3개월',SHOW.name+' 시즌1 최종 선택','여름 감기 빨리 낫는 법','종로 반지'];
  return `<div class="view" style="background:#f2f2f7"><div style="height:56px"></div><div class="scrl"><div class="in" style="padding:10px 16px">
    <div style="font-size:21px;font-weight:700;margin:10px 0">즐겨찾기</div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;text-align:center;font-size:12px">${['포털','메일','음원','작업실 클라우드'].map((l,i)=>`<div><div style="width:60px;height:60px;margin:0 auto 5px;border-radius:13px;background:hsl(${i*80} 60% 55%);display:grid;place-items:center;color:#fff;font-size:22px;font-weight:700">${l[0]}</div>${l}</div>`).join('')}</div>
    <div style="font-size:21px;font-weight:700;margin:26px 0 8px">최근 검색</div>
    <div class="group" style="margin:0">${q.map((x,i)=>`<button class="li" data-a="sq" data-i="${i}"><span style="color:#8e8e93">${ic.search}</span><div class="mid"><b style="font-weight:400">${esc(x)}</b></div></button>`).join('')}</div>
    ${V.sq!=null?`<div style="background:#fff;border-radius:12px;padding:14px;margin-top:14px;font-size:15px;line-height:1.6;white-space:pre-wrap">${esc(['검색 날짜: 5월 9일 오전 3:40\n\n…끝까지 읽지 않았다.','검색 날짜: 8월 8일 오전 1:12','검색 날짜: 7월 22일 오후 11:58\n시즌1 최종 선택: 재회 2쌍, 환승 1쌍, 혼자 1명.','검색 날짜: 8월 9일 오후 11:02','검색 날짜: 5월 19일 오후 6:20\n\n8주년이었던 날. 이걸 왜 검색했더라.'][V.sq])}</div>`:''}
  </div></div>
  <div style="background:rgba(249,249,249,.95);padding:8px 14px 34px;border-top:.5px solid var(--sep)"><div style="background:#fff;border-radius:12px;padding:11px;text-align:center;color:#8e8e93;box-shadow:0 1px 6px rgba(0,0,0,.08)">${ic.search} 검색 또는 웹사이트 이름 입력</div><div style="display:flex;justify-content:space-around;color:var(--blue);padding-top:12px"><button data-a="home">${ic.back}</button><span style="opacity:.3">›</span>${ic.share}<span>☐</span><span>⧉</span></div></div>
  ${homeBar()}</div>`;
}
function vWeather(){
  const hrs=[...Array(8)].map((_,i)=>{const h=Math.floor(S.time/60)+i;return [i?((h%24)+'시'):'지금',29-Math.max(0,h-17)];});
  return `<div class="view" style="background:linear-gradient(#2a6fd6,#5aa7f0);color:#fff;text-align:center"><div class="scrl"><div class="in" style="padding:90px 20px 40px">
    <div style="font-size:32px">${esc(SHOW.place)}</div><div style="font-size:96px;font-weight:200;line-height:1">${hrs[0][1]}°</div><div style="font-size:19px">맑음</div><div style="font-size:17px">최고:31° 최저:22°</div>
    <div style="background:rgba(0,0,0,.12);border-radius:14px;padding:12px;margin-top:30px;text-align:left"><div style="font-size:13px;opacity:.8;border-bottom:1px solid rgba(255,255,255,.2);padding-bottom:8px">오늘 밤 기온 22°. 일교차 큼. 에어컨 주의.</div><div style="display:flex;justify-content:space-between;padding-top:10px;font-size:15px">${hrs.map(([h,t])=>`<div style="text-align:center">${h}<br>☀︎<br>${t}°</div>`).join('')}</div></div>
  </div></div>${homeBar(true)}</div>`;
}
function vCamera(){
  return `<div class="view cam"><div class="vf"><div style="position:absolute;inset:0;display:grid;place-items:center;color:#aaa;font-size:14px">${S.flags.inHouse?'하우스 안 촬영은 제작진만 할 수 있어요':'…'}</div></div>
    <div class="modes"><span>시네마틱</span><span>비디오</span>사진<span>인물 사진</span><span>파노라마</span></div>
    <button class="shut" data-a="toast" data-t="${S.flags.inHouse?'촬영 제한 구역':'찰칵'}"><i></i></button>${homeBar(true)}</div>`;
}
function vMaps(){
  return `<div class="view" style="background:#eef0e8"><div style="flex:1;position:relative;background:linear-gradient(115deg,transparent 46%,#fff 46%,#fff 49%,transparent 49%),linear-gradient(25deg,#dfe8d0 0 30%,transparent 30%),radial-gradient(circle at 70% 30%,#b9dcf0 0 18%,transparent 18%),#eef0e8">
    <div style="position:absolute;left:50%;top:45%;transform:translate(-50%,-100%);text-align:center"><div style="width:30px;height:30px;border-radius:50%;background:#ff3b30;border:3px solid #fff;margin:0 auto;box-shadow:0 2px 8px rgba(0,0,0,.3)"></div><div style="background:#fff;border-radius:8px;padding:4px 8px;font-size:13px;margin-top:4px;box-shadow:0 2px 6px rgba(0,0,0,.15)">${esc(SHOW.place)} 하우스</div></div></div>
    <div style="background:#fff;border-radius:14px 14px 0 0;padding:14px 16px 40px;box-shadow:0 -4px 20px rgba(0,0,0,.1)"><div class="sf"><div class="bar" style="margin:0">${ic.search} 지도 검색</div></div><div style="color:#888;font-size:13px;margin-top:10px">최근: 라온 · 종로 · 학교 정문</div></div>${homeBar()}</div>`;
}

/* ---------- 설정 ---------- */
function vSettings(){
  const row=(c,g,l,r,a='')=>`<button class="li" ${a?`data-a="${a}"`:''} style="--sepl:58px"><div class="setico" style="background:${c}">${g}</div><div class="mid"><b style="font-weight:400">${l}</b></div><span class="rt" style="flex-direction:row;gap:6px">${r}<span class="chev">›</span></span></button>`;
  const w='<svg viewBox="0 0 20 20" fill="#fff"><circle cx="10" cy="10" r="4"/></svg>';
  return `<div class="view" style="background:#f2f2f7">${navBar('설정','home',{big:true})}
    <div class="scrl"><div class="in">
      <div class="sf"><div class="bar" style="margin:0 16px 14px">${ic.search} 검색</div></div>
      <div class="group"><button class="li" style="padding:12px 16px">${avatar('me','av c','width:60px;height:60px')}<div class="mid"><b style="font-size:21px;font-weight:400">${esc(CAST.me.n)}</b><span style="font-size:13px">플레이어: ${esc(S.name)}</span></div><span class="chev">›</span></button></div>
      <div class="group">${row('#5e5ce6',ic.focus.replace('#bf5af2','#fff').replace('#bf5af2','#fff'),'집중 모드',S.focus?'촬영 중':'끔')}${row('#34c759',w,'배터리',S.battery+'%')}${row('#007aff',w,'배경화면','')}${row('#ff3b30',w,'알림','')}</div>
      <div class="gl">게임</div>
      <div class="group">${row('#ffd60a','<b style="color:#000">?</b>','힌트 보기','','hint')}${row('#8e8e93',w,'지금 저장하기','','saveNow')}${row('#8e8e93',w,'저장하고 나가기','','logout')}${row('#ff3b30',w,'처음부터 다시','','reset')}</div>
      <div class="gf">저장은 이 브라우저에만 남아요. 다른 기기에서는 이어할 수 없어요.</div>
    </div></div>${homeBar()}</div>`;
}

/* ---------- 편지 ---------- */
function vLetter(){
  const L=LETTERS[V.sub]; const theirs=V.sub==='theirs';
  const body=L.body.map((p,i)=>{ const t=esc(T(p)); return (theirs&&i===L.body.length-1&&S.flags.reread)?`<span class="hl">${t}</span>`:t; }).join('\n\n');
  return `<div class="view">
    <div class="paper scrl"><div class="in"><h3>${esc(T(L.title))}</h3>${body}
      ${theirs&&!S.flags.letterDone?`<div class="end"><button class="opt" data-a="letterEnd" style="width:100%;text-align:center">다 읽었다</button></div>`:''}</div>
    </div>
    <div style="position:absolute;top:50px;left:8px"><button data-a="letterBack" data-back style="color:#7a6a55;font-size:17px;min-height:44px;display:flex;align-items:center;gap:5px;padding:0 8px">${ic.back} 닫기</button></div>
    ${homeBar()}</div>`;
}

/* ---------- 시트 / 알럿 / 토스트 / 배너 / 공감 ---------- */
var LOCAL_SHEET=null;
function renderSheet(){
  let el=$('#sheet'); const p=S&&S.pend._sheet;
  if(!p&&!LOCAL_SHEET){ if(el) el.remove(); return; }
  const st=LOCAL_SHEET||SCRIPT[p.tid][p.i].sheet;
  const sig=LOCAL_SHEET?('L'+LOCAL_SHEET.q):('P'+p.tid+p.i); if(el&&el.dataset.sig===sig) return; if(el) el.remove();
  const d=document.createElement('div'); d.id='sheet'; d.dataset.sig=sig;
  d.innerHTML=`<div class="sh"><div class="q ${st.inner?'inner':''}">${st.cap?`<small>${esc(T(st.cap))}</small>`:''}${esc(T(st.q))}</div><div class="opts">${st.o.map((o,i)=>(o.if&&!o.if())?'':`<button class="opt ${o.silent?'ghost':''}" data-a="${LOCAL_SHEET?'lsheet':'sheet'}" data-i="${i}">${esc(T(o.l))}</button>`).join('')}</div></div>`;
  $('#screen').appendChild(d);
}
function localSheet(o){ LOCAL_SHEET=o; renderSheet(); }
function showAlert(title,msg,btns){
  const d=document.createElement('div'); d.className='alert';
  d.innerHTML=`<div class="box"><p><b>${esc(title)}</b>${esc(msg)}</p><div>${btns.map((b,i)=>`<button data-i="${i}">${esc(b[0])}</button>`).join('')}</div></div>`;
  d.onclick=e=>{ const b=e.target.closest('button'); if(!b) return; e.stopPropagation(); d.remove(); btns[+b.dataset.i][1](); };
  $('#screen').appendChild(d);
}
function toast(t){ const el=$('#toast'); el.textContent=t; el.classList.add('on'); clearTimeout(el._t); el._t=setTimeout(()=>el.classList.remove('on'),1800); }
var bannerT=null;
function notify(chat,m){
  if(CHATS[chat].outside && S.focus) return;
  notifyRaw(chat,CHATS[chat].t(),(chat==='house'?CAST[m.f].s+': ':'')+msgPreview(m),'지금');
}
function notifyRaw(k,title,x,tm){
  if(!S||V.screen==='lock'||V.screen==='setup'||V.screen==='pin'){ return; }
  const b=$('#banner');
  const isChat=CHATS[k]&&k!=='house'&&k!=='pd';
  b.innerHTML=`<div class="a">${isChat?avatar(CHATS[k].k,'av','width:38px;height:38px;border-radius:10px;font-size:15px'):miniIcon(k==='sms'?'sms':'talk')}</div><div class="m"><b>${esc(title)}<span>${esc(tm)}</span></b><div>${esc(x)}</div></div>`;
  b.dataset.k=k; b.classList.add('on'); clearTimeout(bannerT); bannerT=setTimeout(()=>b.classList.remove('on'),3400);
}
function openCtx(bub){
  const mid=+bub.dataset.mid; const k=V.chat; const m=S.chats[k].msgs.find(x=>x.id===mid); if(!m) return;
  const r=bub.getBoundingClientRect(), sr=$('#screen').getBoundingClientRect();
  const top=Math.max(60,r.top-sr.top-60); const left=Math.min(sr.width-290,Math.max(10,r.left-sr.left-(m.f==='me'?150:0)));
  const d=document.createElement('div'); d.id='ctx';
  const mine=(m.rx||{}).me;
  d.innerHTML=`<div class="rxbar" style="top:${top}px;left:${left}px">${['❤️','👍','😆','😮','😢','🙏'].map(e=>`<button data-e="${e}" class="${mine===e?'on':''}">${e}</button>`).join('')}</div>
    <div class="menu" style="top:${Math.min(sr.height-150,r.bottom-sr.top+10)}px;left:${Math.min(sr.width-240,Math.max(10,r.left-sr.left))}px"><button data-m="copy">복사 <span>⧉</span></button><button data-m="reply">답장 <span>↩︎</span></button></div>`;
  d.onclick=e=>{ e.stopPropagation(); const b=e.target.closest('button'); d.remove(); if(!b) return;
    if(b.dataset.e){ react(k,m,b.dataset.e); }
    else if(b.dataset.m==='copy') toast('복사됨'); else toast('지금은 답장할 말이 없다'); };
  $('#screen').appendChild(d);
}
function react(k,m,e){
  m.rx=m.rx||{}; if(m.rx.me===e) delete m.rx.me; else m.rx.me=e;
  if(m.key && !S.rxDone[m.key] && m.rx.me){ const F=REACT_FX[m.key]; const f=F&&(F[e]||F['*']); if(f){ applyFx(f); S.rxDone[m.key]=e; } }
  if(k==='house'&&m.rx.me) toast(`${CAST.me.s}님이 ${e} 공감했어요`);
  save(); render();
}

/* ---------- 힌트 ---------- */
var hintSeen={};
function computeHint(){
  if(!S) return null;
  if(S.pend._sheet||LOCAL_SHEET) return '화면 아래 선택지를 골라요.';
  for(const k in S.pend){ if(k==='_sheet'||(CHATS[k].outside&&S.focus)) continue; return T(`${CHATS[k].t()} 대화방에서 답장을 기다려요.`); }
  if(talkUnread()) return '톡에 안 읽은 메시지가 있어요.';
  if(S.sms.inbox.some(m=>!m.read)) return '메시지 앱에 문자가 왔어요.';
  if(S.waitHint){ const key=S.waitHint[0]; hintSeen[key]=(hintSeen[key]||0)+1; return T(S.waitHint[Math.min(S.waitHint.length-1,hintSeen[key]-1)]); }
  const miss=Object.keys(CLUES).filter(k=>!S.clues[k]&&CLUES[k].h&&clueAvailable(k));
  if(miss.length) return '혹시… '+T(CLUES[miss[Math.floor(Math.random()*miss.length)]].h);
  return '지금은 기다리는 중. 폰을 둘러봐도 좋아요.';
}
function clueAvailable(k){
  if(k==='typing') return S.flags.inHouse; if(k==='photo') return S.flags.groupPosted; if(k==='poll') return S.poll.dinner&&S.poll.dinner.me;
  if(k==='reread') return S.flags.letterPosted&&!S.flags.letterDone; return true;
}
var islandT=null;
function showHint(){
  const h=computeHint(); if(!h) return;
  const is=$('#island'); is.querySelector('.tx').innerHTML='<b>힌트</b>'+esc(h); is.classList.add('wide');
  clearTimeout(islandT); islandT=setTimeout(()=>is.classList.remove('wide'),3000);
}
function hideHint(){ $('#island').classList.remove('wide'); clearTimeout(islandT); }

/* ---------- 타이머들 ---------- */
setInterval(()=>{ if(!S||S.ended||V.screen==='setup'||V.screen==='pin'||$('#tw').classList.contains('on')) return; if(Date.now()-lastAct>35000){ lastAct=Date.now(); showHint(); } },2000);
setInterval(()=>{
  if(!S||S.ended) return;
  for(const k in S.pend){ const p=S.pend[k]; if(p.dl&&Date.now()>p.dl){ const st=SCRIPT[p.tid][p.i]; pick(k,st.onTimeout); return; } }
  if(V.screen==='app'&&V.app==='talk'&&V.chat&&S.pend[V.chat]&&S.pend[V.chat].dl){
    const p=S.pend[V.chat], st=SCRIPT[p.tid][p.i], left=Math.max(0,Math.round((p.dl-Date.now())/1000));
    const bar=document.querySelector('.sugs .tbar i'); if(bar) bar.style.width=Math.min(100,left/st.timeout*100)+'%';
    const sh=document.querySelector('.sugs .sh span'); if(sh) sh.textContent=`답장을 기다리는 중 · ${left}초`;
  }
},1000);
setInterval(()=>{ if(!S||S.ended||V.screen==='setup'||V.screen==='pin') return; S.time++; if(Math.random()<.35) S.battery=Math.max(5,S.battery-1); renderSB(); },30000);

/* ===================== 하루 끝 ===================== */
function endDay(){
  S.ended=true; save(); V={screen:'lock'}; render();
  setTimeout(()=>openTw(false),1600);
}
function nextDay(){
  if(S.day>=7) return;
  $('#tw').classList.remove('on'); GEN++; running={};
  const d=S.day+1; S.ended=false; S.threads['d'+d]={i:0,status:'run'}; save();
  V={screen:'lock'}; render(); lastAct=Date.now(); runThread('d'+d);
}
