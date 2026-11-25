/* ===================== 입력: 탭 / 길게 누르기 / 제스처 ===================== */
var screenEl=$('#screen');
var suppressClick=false;
function go(v,anim){ V=Object.assign({},v); V.anim=anim||null; render(); }
function originOf(el){ const r=el.getBoundingClientRect(), s=screenEl.getBoundingClientRect(), sc=s.width/screenEl.offsetWidth; return {x:(r.left+r.width/2-s.left)/sc, y:(r.top+r.height/2-s.top)/sc}; }

screenEl.addEventListener('click',e=>{
  if(suppressClick){ suppressClick=false; e.preventDefault(); return; }
  lastAct=Date.now();
  const b=e.target.closest('[data-a]'); if(!b) return;
  const a=b.dataset.a, d=b.dataset;
  switch(a){
    /* 시작 */
    case 'newp':{ const n=($('#nm').value||'').trim(); if(!n){toast('이름을 입력해 주세요');return;} if(SAVES[n]){toast('이미 있는 이름이에요');return;} newName=n; pinMode='new1'; pinBuf=''; go({screen:'pin'}); break; }
    case 'prof': pinTarget=d.n; pinMode='login'; pinBuf=''; go({screen:'pin'}); break;
    case 'pk': pinKey(d.k); break;
    case 'pkb': pinBuf=pinBuf.slice(0,-1); render(); break;
    case 'pinx': pinBuf=''; go({screen:'setup'}); break;
    /* 잠금 / 홈 */
    case 'unlock': unlock(()=>go({screen:'home'},'fadein')); break;
    case 'lnotif': unlock(()=>openFromNotif(d.k)); break;
    case 'home': if(V.screen==='lock') unlock(()=>go({screen:'home'},'fadein')); else { TYPE=null; go({screen:'home'},'fadein'); } break;
    case 'open': { const o=originOf(b.querySelector('.icon')||b); V={screen:'app',app:d.k,origin:o,anim:'zoom'}; if(d.k==='talk') V.tab='chats'; render(); break; }
    case 'toast': toast(d.t); break;
    /* 톡 */
    case 'ttab': go({screen:'app',app:'talk',tab:d.k}); break;
    case 'talkHome': TYPE=null; go({screen:'app',app:'talk',tab:'chats'},'pop'); break;
    case 'chat': TYPE=null; go({screen:'app',app:'talk',chat:d.k,tab:'chats'},'push'); break;
    case 'openProf': if(!CAST[d.k]||d.k==='pd') return; go({screen:'app',app:'talk',sub:'prof:'+d.k,tab:V.tab||'friends',retChat:V.chat},'fadein'); break;
    case 'profClose': if(V.retChat) go({screen:'app',app:'talk',chat:V.retChat}); else go({screen:'app',app:'talk',tab:V.tab||'friends'}); break;
    case 'profHist': V.hist=true; if(d.k==='ex') setTimeout(()=>addClue('status'),1200); render(); break;
    case 'histClose': V.hist=false; render(); break;
    case 'editMe': localSheet({cap:'프로필 편집',q:'프로필 사진이 아직 그 바다 사진이다.',o:[
      {l:'그대로 둔다',do:()=>{S.flags.pfpKept=true;}},
      {l:'기본 이미지로 바꾼다',do:()=>{S.myPfp='default';S.st.dist-=1;S.flags.pfpChanged=true;toast('프로필 사진을 바꿨다');}},
      {l:'상태메시지에 "." 하나만 쓴다',do:()=>{S.flags.myStatus='.';S.st.dist+=1;S.flags.mirrorDot=true;toast('상태메시지: .');}}]}); break;
    case 'pick': pick(d.c,+d.i); break;
    case 'sug': { const st=optOf(d.c); if(!st) return; startType(d.c,+d.i,T(st.o[+d.i].text||st.o[+d.i].l)); break; }
    case 'send': if(TYPE&&TYPE.chat!=='__sms'){ if(TYPE.n<TYPE.full.length){ TYPE.n=TYPE.full.length; paintType(); return; } pick(TYPE.chat,TYPE.i); } else toast('위에서 할 말을 먼저 골라요'); break;
    case 'key': if(TYPE){ TYPE.n=Math.min(TYPE.full.length,TYPE.n+3); paintType(); } else toast('위에서 할 말을 먼저 골라요'); b.animate([{transform:'scale(1.25)'},{transform:'none'}],{duration:140}); break;
    case 'idleField': toast('지금은 할 말이 떠오르지 않는다'); break;
    case 'rc': toast(S.flags.holdOne?`안 읽은 사람: ${CAST.ex.n}`:'다른 사람들이 읽는 중'); break;
    case 'exsend': localSheet({inner:true,cap:T('{ex.s}에게'),q:'같은 집에 있다. 거실 건너편에.\n보낼까.',o:[
      {l:'잘 지냈어?',do:()=>{S.flags.exSent=true;S.st.dist+=2;deliver('ex',{f:'me',x:'잘 지냈어?',tm:fmtK(S.time),rc:1});}},
      {l:'밥은 먹었어?',do:()=>{S.flags.exSent=true;S.st.dist+=2;deliver('ex',{f:'me',x:'밥은 먹었어?',tm:fmtK(S.time),rc:1});}},
      {l:'보내지 않는다',silent:true,do:()=>{S.flags.exDecl=true;}}]}); break;
    case 'sheet': pick('_sheet',+d.i); break;
    case 'lsheet': { const o=LOCAL_SHEET.o[+d.i]; LOCAL_SHEET=null; renderSheet(); o.do&&o.do(); save(); render(); break; }
    case 'delmsg': localSheet({inner:true,cap:'5월 9일 오전 2:15',q:'부재중 전화 세 통.\n그리고 2분 뒤에, 보냈다가 지운 메시지.\n\n그날 나는 전화를 받지 않았다.',o:[{l:'…',do:()=>addClue('del')}]}); break;
    case 'contactEx': go({screen:'app',app:'phone',sub:'exc',backTo:V.app==='talk'?'chatEx':'phoneBack',tab:'contacts'},'push'); break;
    case 'chatEx': go({screen:'app',app:'talk',chat:'ex'},'pop'); break;
    case 'phoneBack': go({screen:'app',app:'phone',tab:V.tab||'contacts'},'pop'); break;
    case 'photoMsg': go({screen:'app',app:'photos',sub:'v:'+d.p,items:[d.p],idx:0,fromChat:V.chat},'fadein'); break;
    case 'letter': go({screen:'app',app:'letter',sub:d.l,chatBack:V.chat},'push'); break;
    case 'letterBack': go({screen:'app',app:'talk',chat:V.chatBack||'pd'},'pop'); break;
    case 'letterEnd': localSheet({inner:true,cap:'편지를 다 읽었다',q:'세상에서 제일 사랑하는 사람입니다…\n…라고, 했다.',o:[
      {l:'…건조하네. 피식 웃는다',do:()=>{S.flags.letterDone=true;S.flags.dry=true;}},
      {l:'처음부터 끝까지 다시 읽는다',do:()=>{S.flags.letterDone=true;S.flags.reread=true;S.st.dist+=1;addClue('reread');}},
      {l:'화면을 끈다',do:()=>{S.flags.letterDone=true;S.st.dist-=1;}}]}); break;
    case 'vote': { const P=S.poll.dinner=S.poll.dinner||{}; if(!P.me){ P.me=d.v; save(); render(); } else if(P.votes&&d.v==='pasta'&&P.votes.pasta.includes('ex')) addClue('poll'); break; }
    /* 사진 */
    case 'alb': go({screen:'app',app:'photos',sub:d.k},'push'); break;
    case 'photos': go({screen:'app',app:'photos'},'pop'); break;
    case 'pv': { const items=albumItems(d.al); go({screen:'app',app:'photos',sub:'v:'+d.k,al:d.al,items,idx:+d.i},'fadein'); break; }
    case 'pvBack': if(V.fromChat) go({screen:'app',app:'talk',chat:V.fromChat}); else go({screen:'app',app:'photos',sub:V.al}); break;
    case 'vtap': if(e.target.closest('.hs')) return; V.dark=!V.dark; V.info=false; render(); break;
    case 'spot': { V.spot=+d.i; const key=V.items?V.items[V.idx||0]:'group'; const sp=((window.SPOTS&&SPOTS[key])||GROUP_SPOTS)[V.spot]; if(sp.clue) addClue(sp.clue); if(sp.side) addSide(sp.side); render(); break; }
    case 'album': { S.album=d.v; S.flags.albumDecided=true; if(d.v==='deleted'){S.st.dist-=2;S.flags.albumDel=true;} if(d.v==='keep'){S.st.sway-=1;S.flags.albumKept=true;} toast(d.v==='keep'?'그대로 뒀다':d.v==='hidden'?'가려진 항목으로 옮겼다':'앨범을 지웠다'); save(); go({screen:'app',app:'photos'},'pop'); break; }
    case 'hiddenOpen': faceId(()=>{V.unlockedHidden=true;render();}); break;
    case 'restore': S.flags.restored=true; S.st.dist+=1; toast('사진을 복구했다'); save(); render(); break;
    case 'trashSeen': S.flags.trashSeen=true; save(); render(); break;
    case 'fav': S.fav[d.k]=!S.fav[d.k]; save(); render(); break;
    case 'pinfo': V.info=!V.info; render(); break;
    /* 메모 */
    case 'notes': go({screen:'app',app:'notes'},'pop'); break;
    case 'note': go({screen:'app',app:'notes',sub:d.k},'push'); break;
    case 'ver': V.ver=true; addClue('memo'); render(); break;
    case 'lyric': typeLyric(+d.i); break;
    /* 전화 */
    case 'ptab': go({screen:'app',app:'phone',tab:d.k}); break;
    case 'call': if(d.k==='ex'&&d.m) localSheet({inner:true,cap:'5월 9일 오전 2:13',q:'헤어진 다음 날 새벽.\n세 번 울렸다. 세 번 다 안 받았다.',o:[{l:'…',do:()=>addClue('calls')}]}); else toast('촬영 중에는 전화할 수 없어요'); break;
    case 'rename': S.exName=d.n; if(d.n==='{ex}') S.st.dist-=1; save(); render(); break;
    case 'favEx': S.exFav=!S.exFav; if(!S.exFav) S.st.dist-=1; else S.st.dist+=1; save(); render(); break;
    case 'dial': V.dial=(V.dial||'')+d.k; render(); break;
    case 'vmEx': V.vmOpen=!V.vmOpen; render(); break;
    /* 캘린더 / 음성메모 / 시계 / 음악 / 사파리 */
    case 'mon': V.mon=d.m; V.day=null; render(); break;
    case 'day': V.day=+d.d; render(); break;
    case 'ev': if(d.c==='cal') localSheet({inner:true,cap:'5월 19일 · 8주년',q:T('{ex.s|이가} 만든 일정. "종로".\n종로에 뭐가 있었더라.\n\n…그날은 결국 아무 데도 안 갔다.'),o:[{l:'…',do:()=>addClue('cal')}]}); break;
    case 'vm': V.vsel=V.vsel===d.i?null:d.i; render(); break;
    case 'alarm': { const first=!S.flags.alarmSeen; S.flags.alarmSeen=true;
      const flip=()=>{ S.alarm650=!S.alarm650; S.st.dist+=S.alarm650?1:-1; S.flags.alarmOff=!S.alarm650; save(); render(); };
      if(first) localSheet({inner:true,cap:T('오전 6:50 · {ex.s} 깨우기'),q:'아직도 평일마다 울린다.\n끄는 걸 잊은 건지, 안 끈 건지.',o:[{l:'끈다',do:flip},{l:'그냥 둔다',silent:true,do:()=>{}}]}); else flip(); break; }
    case 'pl': go({screen:'app',app:'music',sub:'pl'},'push'); break;
    case 'music': go({screen:'app',app:'music'},'pop'); break;
    case 'plnote': localSheet({inner:true,cap:T('퇴근길 {me.s} · 공유 플레이리스트'),q:T('{ex.s|이가} 사흘 전에 넣은 곡.\n"여름 감기".\n\n헤어지고 석 달이 지났는데.'),o:[{l:'…',do:()=>addClue('playlist')}]}); break;
    case 'sq': V.sq=+d.i; render(); break;
    /* 인스타 */
    case 'igTab': if(d.k==='add'){ toast('촬영 중에는 게시물을 올릴 수 없어요'); return; } if(d.k==='search'||d.k==='reels'){ toast('촬영 중에는 둘러보기가 제한돼요'); return; } V.igTab=d.k; V.igPost=null; V.igSub=null; render(); break;
    case 'igSwitch': localSheet({cap:'계정 전환',q:'',o:[{l:IG.pub+(igAcct()==='pub'?'  ✓':''),do:()=>{V.igAcct='pub';V.igPost=null;}},{l:'🔒 '+IG.priv+(igAcct()==='priv'?'  ✓':''),do:()=>{V.igAcct='priv';V.igPost=null; if(!S.flags.privSeen){S.flags.privSeen=true;}}}]}); break;
    case 'igPost': V.igPost=+d.i; V.anim='push'; render(); break;
    case 'igBack': if(V.igSub==='blocked') V.igSub='menu'; else { V.igPost=null; V.igSub=null; } V.anim='pop'; render(); break;
    case 'igMenuBack': V.igSub='menu'; render(); break;
    case 'igMenu': V.igSub='menu'; V.anim='push'; render(); break;
    case 'igBlocked': if(igAcct()==='priv'){ V.igSub='blocked'; V.anim='push'; render(); } else toast('차단한 계정이 없어요'); break;
    case 'igActivity': V.igSub='activity'; V.anim='push'; render(); break;
    case 'igUnblock': localSheet({inner:true,cap:IG.ex+' 차단 해제',q:'풀면, 형이 이 계정을 다시 볼 수 있다.\n우리 사진들. 그리고 "."까지.',o:[
      {l:'차단을 푼다',do:()=>{S.flags.igUnblocked=true;S.st.dist+=2;toast('차단 해제됨');}},
      {l:'그대로 둔다',silent:true,do:()=>{S.flags.igKeptBlock=true;}}]}); break;
    /* 설정 */
    case 'hint': showHint(); break;
    case 'saveNow': save(); toast('저장했어요'); break;
    case 'logout': save(); S=null; go({screen:'setup'}); break;
    case 'reset': showAlert('처음부터 다시 할까요?','지금 기록은 사라져요.',[['취소',()=>{}],['다시 하기',()=>{const n=S.name,p=S.pin;S=freshState(n,p);save();bootGame(true);}]]); break;
    /* 문자 */
    case 'compose': composeTo=null; TYPE=null; go({screen:'app',app:'sms',sub:'compose'},'push'); break;
    case 'smsList': TYPE=null; go({screen:'app',app:'sms'},'pop'); break;
    case 'to': composeTo=d.k||null; TYPE=null; render(); break;
    case 'smsSug': { const x=(SMS_OPTS[composeTo]||SMS_OPTS._)[+d.i]; startType('__sms',+d.i,x); break; }
    case 'smsSend': { if(!TYPE||TYPE.chat!=='__sms'){ toast('보낼 문장을 먼저 골라요'); return; } if(TYPE.n<TYPE.full.length){ TYPE.n=TYPE.full.length; paintType(); return; }
      const x=TYPE.full, to=composeTo;
      showAlert('보낼까요?',`${CAST[to].n}에게\n"${x}"\n\n보내면 취소할 수 없어요.`,[['취소',()=>{}],['보내기',()=>{
        TYPE=null; S.sms.sent={to,x,tm:fmtK(S.time)}; applyFx({ex:{dist:2,smsEx:true},mg:{mg:2},hj:{hj:2},js:{js:2},so:{so:2},ca:{sway:1},cb:{sway:1}}[to]);
        save(); go({screen:'app',app:'sms',sub:'sent'}); toast('전송됨');}]]); break; }
    case 'smsIn': go({screen:'app',app:'sms',sub:'in:'+d.id},'push'); break;
    case 'smsSent': go({screen:'app',app:'sms',sub:'sent'},'push'); break;
    case 'guess': { const m=S.sms.inbox.find(x=>x.id===d.id); localSheet({cap:'익명 '+m.n,q:'누가 보냈을까?',o:['ex','mg','hj','js','so','ca','cb'].map(k=>({l:CAST[k].n,do:()=>{ m.guess=k; if(m.from==='ex'&&k==='ex') addClue('sms'); }}))}); break; }
  }
});
function typeLyric(i){
  if(lyricAnim) return;
  const opts=LYRIC_OPTS(); const n=S.notes;
  if(!n.title){ n.title=opts[i]; n.lines=[]; save(); render(); return; }
  const line=opts[i]; lyricAnim=true; render();
  let c=0; const iv=setInterval(()=>{ c++; const el=$('#lyricLine'); if(el) el.textContent=line.slice(0,c);
    if(c>=line.length){ clearInterval(iv); setTimeout(()=>{ lyricAnim=null; n.lines.push(line);
      if(line.includes('울었')||line.includes('운 ')||line.includes('운 날')) S.st.dist+=1;
      if(n.lines.length===2){ S.flags.memoDone=true; if(i===2) S.st.sway+=1; }
      if(n.lines.length===4){ S.flags.songDone=true; if(i===0) S.st.dist+=1; }
      save(); render(); },450); } },65);
}
$('#island').addEventListener('click',()=>{ lastAct=Date.now(); if($('#island').classList.contains('wide')) hideHint(); else showHint(); });
$('#banner').addEventListener('click',()=>{ const k=$('#banner').dataset.k; $('#banner').classList.remove('on'); openFromNotif(k); });
function openFromNotif(k){
  TYPE=null;
  if(k==='sms') go({screen:'app',app:'sms'},'push');
  else if(k==='mem'){ S.flags.memNotif=true; go({screen:'app',app:'photos',sub:'us'},'push'); }
  else if(CHATS[k]) go({screen:'app',app:'talk',chat:k,tab:'chats'},'push');
  else go({screen:'home'});
}
function unlock(cb){ faceId(()=>{ const v=$('#view').firstElementChild; if(v){ v.classList.add('lockout'); setTimeout(cb,280);} else cb(); }); }
function faceId(cb){ const d=document.createElement('div'); d.id='faceid'; d.innerHTML='<div><svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"><path d="M4 13V8a4 4 0 0 1 4-4h5M31 4h5a4 4 0 0 1 4 4v5M40 31v5a4 4 0 0 1-4 4h-5M13 40H8a4 4 0 0 1-4-4v-5M15 16v3M29 16v3M22 16v8h-2M16 30c3.5 3 8.5 3 12 0"/></svg></div>'; screenEl.appendChild(d); setTimeout(()=>{d.remove();cb();},450); }

/* 길게 누르기 → 공감 */
var lp=null;
screenEl.addEventListener('pointerdown',e=>{
  const bub=e.target.closest('.bub[data-mid]');
  if(bub){ bub.classList.add('pressed'); lp=setTimeout(()=>{ bub.classList.remove('pressed'); suppressClick=true; openCtx(bub); lp=null; },430); }
  gs={x:e.clientX,y:e.clientY,t:Date.now()};
});
['pointerup','pointercancel','pointerleave'].forEach(ev=>screenEl.addEventListener(ev,()=>{ if(lp){clearTimeout(lp);lp=null;} document.querySelectorAll('.bub.pressed').forEach(b=>b.classList.remove('pressed')); }));
screenEl.addEventListener('contextmenu',e=>{ const bub=e.target.closest('.bub[data-mid]'); if(bub){ e.preventDefault(); openCtx(bub); } });
screenEl.addEventListener('dblclick',e=>{ const bub=e.target.closest('.bub[data-mid]'); if(bub){ e.preventDefault(); openCtx(bub); } });

/* 제스처: 아래에서 쓸어올리기 = 홈 / 왼쪽 가장자리 밀기 = 뒤로 */
var gs=null;
screenEl.addEventListener('pointerup',e=>{
  if(!gs) return; const s=screenEl.getBoundingClientRect(), sc=s.width/screenEl.offsetWidth;
  const x0=(gs.x-s.left)/sc, y0=(gs.y-s.top)/sc, dx=(e.clientX-gs.x)/sc, dy=(e.clientY-gs.y)/sc; gs=null;
  const H=screenEl.offsetHeight;
  if(V.screen==='lock' && dy<-70 && Math.abs(dx)<120){ suppressClick=true; unlock(()=>go({screen:'home'},'fadein')); return; }
  if((V.screen==='app') && y0>H-40 && dy<-45){ suppressClick=true; TYPE=null; go({screen:'home'},'fadein'); return; }
  if(V.screen==='app' && x0<28 && dx>70 && Math.abs(dy)<70){ const bk=$('#view [data-back]'); if(bk){ suppressClick=true; setTimeout(()=>{suppressClick=false;bk.click();},0); } }
});
document.addEventListener('keydown',e=>{
  if(V.screen==='pin'){ if(/^[0-9]$/.test(e.key)) pinKey(e.key); if(e.key==='Backspace'){pinBuf=pinBuf.slice(0,-1);render();} }
  if(e.key==='Enter'&&V.screen==='setup'&&document.activeElement&&document.activeElement.id==='nm') document.querySelector('[data-a=newp]').click();
});
/* 사진 넘기기 */
screenEl.addEventListener('scroll',e=>{
  const st=e.target; if(!st.classList||!st.classList.contains('strip')) return;
  clearTimeout(st._t); st._t=setTimeout(()=>{ const i=Math.round(st.scrollLeft/st.clientWidth); if(i!==V.idx){ V.idx=i; V.spot=null; V.info=false; V.sub='v:'+V.items[i]; render(); } },120);
  const nav=st.closest('.view');
},true);
/* 큰 제목 → 스크롤 시 작은 제목 */
screenEl.addEventListener('scroll',e=>{ const t=e.target; if(!t.classList||!t.classList.contains('scrl')) return; const nav=t.parentElement.querySelector('.nav'); if(nav) nav.classList.toggle('sc',t.scrollTop>24); },true);

/* 화면 크기: 아이폰 크기 그대로, 창에 맞게 축소 */
function fit(){
  const W=393,H=852; const mob=innerWidth<=500;
  document.body.classList.toggle('mob',mob);
  if(mob){ screenEl.style.transform=''; return; }
  const sc=Math.min(1,(innerHeight-24)/H,(innerWidth-24)/W);
  screenEl.style.transform=`translate(-50%,-50%) scale(${sc})`;
}
addEventListener('resize',fit); fit();
render();
