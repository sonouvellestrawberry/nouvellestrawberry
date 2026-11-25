/* ===================== 인스타그램 (공개 + 비공개 계정) ===================== */
APPS.insta={l:'Instagram', g:'<svg viewBox="0 0 62 62"><defs><radialGradient id="gi" cx=".3" cy="1.05" r="1.25"><stop offset="0" stop-color="#ffd776"/><stop offset=".25" stop-color="#f3a554"/><stop offset=".5" stop-color="#e3405f"/><stop offset=".75" stop-color="#c13584"/><stop offset="1" stop-color="#6b4fd8"/></radialGradient></defs><rect width="62" height="62" fill="url(#gi)"/><rect x="14" y="14" width="34" height="34" rx="10" fill="none" stroke="#fff" stroke-width="3.6"/><circle cx="31" cy="31" r="8" fill="none" stroke="#fff" stroke-width="3.6"/><circle cx="41.5" cy="20.5" r="2.4" fill="#fff"/></svg>'};

var IG_PUB=[
  {k:'ig1',d:'7월 30일',c:'새벽 세 시의 작업실. 2절은 아직.',l:412,cm:[['ec.s','형 2절 언제 줘요'],['_fan1','작업실 너무 예뻐요']]},
  {k:'ig2',d:'7월 2일',c:'믹스 체크 완료. 수고했어 다들',l:388,cm:[]},
  {k:'ig3',d:'6월 14일',c:'오랜만에 공연. 떨렸다',l:520,cm:[['_fan2','라이브 최고였어요']]},
  {k:'ig4',d:'5월 30일',c:'비 오는 날 커피',l:301,cm:[]},
  {k:'ig5',d:'4월 11일',c:'새 장비 들어옴',l:290,cm:[]},
  {k:'ig6',d:'3월 2일',c:'작업 레퍼런스 정리 중',l:244,cm:[]},
];
/* 방송 공개 후 공개 계정 최신 게시물에 달리는 댓글 (시간이 지날수록 늘어남) */
var IG_VIEWER=[
  [10*60+40,'hs2_watcher',SHOW.name+' 출연자 공개 보고 왔어요'],
  [11*60,'lyric_lover','프로듀서셨구나… 곡 찾아 들으러 갑니다'],
  [12*60,'x_who','X 누구예요 ㅠㅠㅠ 힌트라도'],
  [14*60+30,'poster_k','단체 포스터 보고 반함'],
  [16*60,'mug_detective','작업실 사진에 머그컵 두 개인 거 나만 봄?'],
  [18*60,'please_happy','제발 행복하세요 진심으로'],
  [20*60,'night_owl','오늘 방송 기대돼요'],
  [22*60,'sms_guess','첫 문자 누구한테 보냈어요 ㅠㅠ'],
];
var IG_PRIV=[
  {k:'privdot',d:'5월 9일',c:'.',l:9,dot:true},
  {k:'us9',d:'4월 27일',c:'7년째 같은 자리',l:12},
  {k:'us8',d:'2025년 12월 31일',c:'올해도 작업실에서 같이',l:14},
  {k:'us7',d:'2025년 2월 14일',c:'형 생일 🎂 촛불 끄기 전에 소원 뭐 빌었는지 끝까지 안 알려줌',l:13},
  {k:'us6',d:'2024년 5월 19일',c:'5주년. 형이 예약한 데',l:15},
  {k:'us5',d:'2023년 7월 30일',c:'우리의 여름',l:13},
  {k:'us4',d:'2022년 3월 11일',c:'이사 완료. 컵 두 개부터 샀다',l:11},
  {k:'us3',d:'2021년 8월 2일',c:'강릉',l:10},
  {k:'us1',d:'2019년 5월 19일',c:'오늘부터',l:8},
];
function igPubFollowers(){ const t=S.time; if(S.day===1) return 3212+(S.flags.inHouse?Math.max(0,Math.round((t-630)*38.6)):0); return 3212+30000+(S.day-2)*41000+(S.day>=2&&t>=14*60?Math.round((t-14*60)*55):0); }
function igAcct(){ return V.igAcct||'pub'; }
function igHandle(a){ return a==='pub'?IG.pub:IG.priv; }
function igRing(k,size,img){ return `<div style="width:${size}px;height:${size}px;border-radius:50%;padding:2.5px;background:conic-gradient(#feda75,#fa7e1e,#d62976,#962fbf,#4f5bd5,#feda75)"><div style="width:100%;height:100%;border-radius:50%;border:2.5px solid #fff;background:${img?`url('${img}') center/cover`:CAST[k].c};display:grid;place-items:center;color:#fff;font-weight:700">${img?'':esc(CAST[k].s[0])}</div></div>`; }
function igPostImg(p){ return p.dot?svgURI('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><rect width="300" height="300" fill="#000"/><circle cx="150" cy="150" r="3" fill="#fff"/></svg>'):photoSrc(p.k); }
function vInsta(){
  const a=igAcct(); const tab=V.igTab||'profile';
  const posts=a==='pub'?IG_PUB:IG_PRIV;
  if(V.igPost!=null) return vIgPost(a,posts[V.igPost]);
  if(V.igSub==='blocked') return vIgBlocked();
  if(V.igSub==='menu') return vIgMenu(a);
  if(V.igSub==='activity') return vIgActivity();
  let body='';
  if(tab==='home'){
    const feed=[['sis','누나네 강아지 산책 🐶','r5','2일 전',38],['ec','데모 믹스 끝. 형 2절만 오면 됨','r2','3일 전',51]];
    body=`<div style="display:flex;gap:14px;padding:6px 12px 12px;border-bottom:.5px solid var(--sep);overflow-x:auto">${['me','sis','ec'].map(k=>`<div style="text-align:center;font-size:11.5px;flex:none">${igRing(k,66)}<div style="margin-top:4px">${k==='me'?'내 스토리':esc(CAST[k].s)}</div></div>`).join('')}</div>`+
      feed.map(([k,c,img,d,l])=>`<div style="border-bottom:.5px solid var(--sep);padding-bottom:10px"><div style="display:flex;gap:8px;align-items:center;padding:8px 12px">${avatar(k,'av c','width:32px;height:32px;font-size:13px')}<b style="font-size:14px">${esc(CAST[k].s)}</b></div><div style="aspect-ratio:1;background:url('${photoSrc(img)}') center/cover"></div><div style="padding:8px 12px;font-size:14px"><b>좋아요 ${l}개</b><br><b>${esc(CAST[k].s)}</b> ${esc(c)}<div style="color:#8e8e8e;font-size:12px;margin-top:3px">${d}</div></div></div>`).join('')+`<div class="empty" style="padding:30px">모두 확인했습니다</div>`;
  } else {
    const pfp=a==='pub'?'':photoSrc('meNow');
    const fol=a==='pub'?igPubFollowers():14, fing=a==='pub'?187:31;
    body=`<div style="padding:4px 16px 0"><div style="display:flex;align-items:center;gap:20px">${igRing('me',88,a==='priv'?pfp:'')}<div style="flex:1;display:flex;justify-content:space-around;text-align:center;font-size:13.5px"><div><b style="font-size:17px;display:block">${posts.length}</b>게시물</div><div><b style="font-size:17px;display:block">${fmtN2(fol)}</b>팔로워</div><div><b style="font-size:17px;display:block">${fing}</b>팔로잉</div></div></div>
      <div style="margin-top:10px;font-size:14px;line-height:1.4"><b>${esc(a==='pub'?CAST.me.n:CAST.me.s)}</b><br>${a==='pub'?'producer · composer<br>🎧 작업 문의 DM':'🔒'}</div>
      ${a==='pub'&&S.flags.inHouse?`<div style="margin-top:8px;font-size:13px;color:#8e8e8e">오늘 팔로워 +${fmtN2(igPubFollowers()-3212)}</div>`:''}
      <div style="display:flex;gap:6px;margin:12px 0"><button data-a="toast" data-t="촬영 중에는 프로필을 바꿀 수 없어요" style="flex:1;background:#efefef;border-radius:8px;padding:7px;font-size:14px;font-weight:600">프로필 편집</button><button data-a="toast" data-t="촬영 중이에요" style="flex:1;background:#efefef;border-radius:8px;padding:7px;font-size:14px;font-weight:600">프로필 공유</button></div>
      ${a==='priv'?`<div style="display:flex;gap:16px;margin-bottom:10px;font-size:12px;text-align:center">${[['5.19','us1'],['여름','us5'],['집','us4']].map(([l,k])=>`<div><div style="width:62px;height:62px;border-radius:50%;border:1px solid #ddd;padding:3px"><div style="width:100%;height:100%;border-radius:50%;background:url('${photoSrc(k)}') center/cover"></div></div>${l}</div>`).join('')}</div>`:''}
    </div>
    <div style="display:flex;border-top:.5px solid var(--sep)"><span style="flex:1;text-align:center;padding:10px;border-bottom:1.5px solid #000">▦</span><span style="flex:1;text-align:center;padding:10px;color:#aaa">▷</span><span style="flex:1;text-align:center;padding:10px;color:#aaa">☺︎</span></div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1.5px">${posts.map((p,i)=>`<button data-a="igPost" data-i="${i}" style="aspect-ratio:4/5;background:url('${igPostImg(p)}') center/cover"></button>`).join('')}</div><div style="height:30px"></div>`;
  }
  const tabs=[['home','<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 10.5L12 3l9 7.5V21h-6v-6H9v6H3z"/></svg>'],['search',ic.search.replace('width="17" height="17"','width="25" height="25"')],['add','<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><path d="M12 8v8M8 12h8"/></svg>'],['reels','<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><path d="M3 8h18M8 3l3 5M14 3l3 5M10 12v5l4-2.5z"/></svg>'],['profile','']];
  return `<div class="view">
    <div style="padding:50px 14px 6px;display:flex;align-items:center;justify-content:space-between;background:#fff">
      ${tab==='home'?`<span style="font:italic 700 26px 'Snell Roundhand','Brush Script MT',cursive">Instagram</span><div style="display:flex;gap:18px"><button data-a="igActivity">${ic.heart}</button><button data-a="toast" data-t="촬영 중에는 DM이 제한돼요">${'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 3L2 10.5l7 3 3 7z"/><path d="M9 13.5L22 3"/></svg>'}</button></div>`:
      `<button data-a="igSwitch" style="display:flex;align-items:center;gap:4px;font-size:22px;font-weight:700;min-height:44px">${a==='priv'?'<svg width="13" height="17" viewBox="0 0 15 20" fill="#000"><path d="M2.5 8V6a5 5 0 0110 0v2h.5a2 2 0 012 2v8a2 2 0 01-2 2H2a2 2 0 01-2-2v-8a2 2 0 012-2zm2 0h6V6a3 3 0 00-6 0z"/></svg>':''}${esc(igHandle(a))} <span style="font-size:14px">⌄</span>${a==='pub'&&S.flags.inHouse?'<span style="width:8px;height:8px;border-radius:50%;background:#ff3040;display:inline-block;margin-left:4px"></span>':''}</button><div style="display:flex;gap:18px"><button data-a="toast" data-t="촬영 중에는 게시물을 올릴 수 없어요">${tabs[2][1]}</button><button data-a="igMenu"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="5" width="18" height="2" rx="1"/><rect x="3" y="11" width="18" height="2" rx="1"/><rect x="3" y="17" width="18" height="2" rx="1"/></svg></button></div>`}
    </div>
    <div class="scrl" style="background:#fff">${body}</div>
    <div class="tabbar" style="background:#fff">${tabs.map(([k,g])=>`<button data-a="igTab" data-k="${k}" style="color:#000">${k==='profile'?`<div style="width:27px;height:27px;border-radius:50%;background:${CAST.me.c};${tab==='profile'?'box-shadow:0 0 0 1.5px #fff,0 0 0 3px #000':''}"></div>`:g}</button>`).join('')}</div>
    ${homeBar()}</div>`;
}
function fmtN2(n){ return n>=10000?(n/10000).toFixed(1).replace(/\.0$/,'')+'만':n.toLocaleString(); }
function vIgPost(a,p){
  const viewers=a==='pub'&&V.igPost===0&&S.flags.inHouse?IG_VIEWER.filter(v=>S.day>1||S.time>=v[0]).concat(S.day>=2?[[0,'producer_stan','노래 다 들었어요 신곡 언제 나와요']]:[]).concat(S.day>=3?[[0,'mug_detective','추억 공간 머그컵이랑 같은 거 맞죠?']]:[]).concat(S.day>=4?[[0,'peanut_alert','땅콩 사건 보고 왔습니다']]:[]):[];
  const cms=(p.cm||[]).map(([h,x])=>[h.endsWith('.s')?CAST[h.split('.')[0]].s:h.replace('_',''),x]).concat(viewers.map(v=>[v[1],v[2]]));
  const likes=p.l+(a==='pub'&&V.igPost===0?Math.round(Math.max(0,igPubFollowers()-3212)*.31):0);
  return `<div class="view">${navBar('게시물','igBack')}
    <div class="scrl"><div class="in">
      <div style="display:flex;gap:8px;align-items:center;padding:8px 12px">${avatar('me','av c','width:32px;height:32px;font-size:13px')}<b style="font-size:14px">${esc(igHandle(a))}</b></div>
      <div style="aspect-ratio:${a==='priv'?'1':'4/5'};background:url('${igPostImg(p)}') center/cover"></div>
      <div style="display:flex;gap:16px;padding:10px 12px 4px">${ic.heart}<span>${ic.chat.replace(/26/g,'24')}</span></div>
      <div style="padding:0 12px 20px;font-size:14px;line-height:1.5"><b>좋아요 ${fmtN2(likes)}개</b><br><b>${esc(igHandle(a))}</b> ${esc(T(p.c))}
        ${cms.length?`<div style="color:#8e8e8e;margin:6px 0 2px">댓글 ${cms.length}개</div>${cms.map(([h,x])=>`<div><b>${esc(h)}</b> ${esc(T(x))}</div>`).join('')}`:''}
        <div style="color:#8e8e8e;font-size:12px;margin-top:6px">${esc(p.d)}</div>
        ${p.dot?`<div style="margin-top:16px;padding:12px;background:#f6f6f8;border-radius:10px;color:#555">헤어진 다음 날 올린 거. 사진도 없이 점 하나.</div>`:''}
      </div></div></div>${homeBar()}</div>`;
}
function vIgMenu(a){
  return `<div class="view" style="background:#fff">${navBar('설정 및 활동','igBack')}<div class="scrl"><div class="in">
    ${[['계정 센터',''],['저장됨',''],['친한 친구',a==='priv'?'6명':'0명'],['차단된 계정',a==='priv'?'1':'0','igBlocked'],['숨김 단어',''],['알림','촬영 중 · 일부 일시중지']].map(([l,r,act])=>`<button class="li" ${act?`data-a="${act}"`:'data-a="toast" data-t="촬영 중이에요"'}><div class="mid"><b style="font-weight:400">${l}</b></div><span class="rt">${r}</span><span class="chev">›</span></button>`).join('')}
  </div></div>${homeBar()}</div>`;
}
function vIgBlocked(){
  const blocked=!S.flags.igUnblocked;
  return `<div class="view" style="background:#fff">${navBar('차단된 계정','igMenuBack')}<div class="scrl"><div class="in">
    ${blocked?`<div class="li" style="--sepl:70px">${avatar('ex','av c','width:44px;height:44px')}<div class="mid"><b>${esc(IG.ex)}</b><span>${esc(CAST.ex.n)} · 5월 9일에 차단함</span></div><button data-a="igUnblock" style="background:#efefef;border-radius:8px;padding:7px 12px;font-size:14px;font-weight:600">차단 해제</button></div>`:'<div class="empty">차단한 계정이 없어요</div>'}
    <div class="gf" style="margin:12px 0;padding:0 16px">차단한 사람은 회원님의 프로필, 게시물, 스토리를 볼 수 없어요.</div>
  </div></div>${homeBar()}</div>`;
}
function vIgActivity(){
  const n=igPubFollowers()-3212;
  return `<div class="view" style="background:#fff">${navBar('알림','igBack')}<div class="scrl"><div class="in">
    ${S.flags.inHouse?`<div class="li"><div class="mid"><b style="font-weight:400"><b>hs2_watcher</b>님 외 ${fmtN2(n)}명이 회원님을 팔로우하기 시작했습니다.</b></div></div>`+IG_VIEWER.filter(v=>S.time>=v[0]).map(v=>`<div class="li"><div class="mid"><b style="font-weight:400"><b>${esc(v[1])}</b>님이 댓글을 남겼습니다: ${esc(v[2])}</b></div></div>`).join(''):'<div class="empty">새 알림 없음</div>'}
  </div></div>${homeBar()}</div>`;
}
