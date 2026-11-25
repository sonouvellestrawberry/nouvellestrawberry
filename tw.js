/* ===================== 시청자 반응 (트위터 화면) ===================== */
var TW={tab:'home',sub:'rec',liked:{},rt:{},bm:{},shown:[],queue:[],fresh:[],timer:null};
var twIc={
  reply:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 12a7.5 7.5 0 017.5-7.5h1A7.5 7.5 0 0120 12a7.5 7.5 0 01-7.5 7.5H11l-5 3v-4.2A7.4 7.4 0 014 12z"/></svg>',
  rt:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9l3-3 3 3M7 6v9a3 3 0 003 3h5M20 15l-3 3-3-3M17 18V9a3 3 0 00-3-3H9"/></svg>',
  like:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 20s-7.5-4.6-9.2-9.3C1.6 7.3 4 4 7.3 4c2 0 3.6 1.2 4.7 2.8C13.1 5.2 14.7 4 16.7 4 20 4 22.4 7.3 21.2 10.7 19.5 15.4 12 20 12 20z"/></svg>',
  likeF:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 20s-7.5-4.6-9.2-9.3C1.6 7.3 4 4 7.3 4c2 0 3.6 1.2 4.7 2.8C13.1 5.2 14.7 4 16.7 4 20 4 22.4 7.3 21.2 10.7 19.5 15.4 12 20 12 20z"/></svg>',
  views:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M5 20V12M10 20V5M15 20v-9M20 20V8"/></svg>',
  bm:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 3.5h12v17l-6-4-6 4z"/></svg>',
  bmF:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 3.5h12v17l-6-4-6 4z"/></svg>',
  home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 10.5L12 3l9 7.5V21h-6v-6H9v6H3z"/></svg>',
  homeF:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5l9.5 8V21.5h-7v-6h-5v6h-7v-11z"/></svg>',
  search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="10.5" cy="10.5" r="7"/><path d="M16 16l5 5" stroke-linecap="round"/></svg>',
  bell:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 10a6 6 0 0112 0v5l2 3H4l2-3zM10 21h4"/></svg>',
  vf:'<svg width="17" height="17" viewBox="0 0 24 24" class="vf"><path fill="#1d9bf0" d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91C2.63 9.33 1.75 10.57 1.75 12s.88 2.67 2.19 3.34c-.46 1.39-.2 2.9.81 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34z"/><path fill="#fff" d="M10.5 16.2l-3.7-3.7 1.4-1.4 2.3 2.3 5.3-5.3 1.4 1.4z"/></svg>',
  pin:'<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M15 3l6 6-3 1-4 4 1 5-2 2-4-4-5 5-1-1 5-5-4-4 2-2 5 1 4-4z"/></svg>',
};
function fmtN(n){ if(n>=10000) return (n/10000).toFixed(n>=100000?0:1).replace(/\.0$/,'')+'만'; if(n>=1000) return n.toLocaleString(); return String(n); }

/* ---- 방송 캡처 이미지 ---- */
function capSVG(o){
  const scenes={
    sofa:`<rect width="640" height="360" fill="url(#bg)"/><rect x="60" y="210" width="520" height="90" rx="20" fill="#8a6b55"/><rect x="60" y="170" width="520" height="60" rx="20" fill="#9c7a62"/>${[150,250,360,470].map((x,i)=>`<ellipse cx="${x}" cy="210" rx="40" ry="56" fill="${['#7b6cf6','#e0794f','#3c6e8f','#e0a93b'][i]}" opacity=".85"/><circle cx="${x}" cy="135" r="30" fill="#e8c2a0"/><path d="M${x-30} 130q30-42 60 0q-8-24-30-26q-22 2-30 26" fill="#2b211c"/>`).join('')}`,
    door:`<rect width="640" height="360" fill="#23222b"/><rect x="230" y="40" width="180" height="300" fill="#3a3844"/><rect x="230" y="330" width="180" height="10" fill="#ffd98a" opacity=".85"/><circle cx="392" cy="200" r="6" fill="#bbb"/><rect x="70" y="250" width="60" height="40" rx="6" fill="#fff" opacity=".85"/><path d="M85 250q15-20 30 0" fill="#fff" opacity=".9"/>`,
    night:`<rect width="640" height="360" fill="#141a2e"/><rect x="380" y="60" width="160" height="120" fill="#24345e"/><circle cx="480" cy="100" r="18" fill="#e9e2c6" opacity=".7"/><rect x="60" y="220" width="420" height="90" rx="12" fill="#2e3550"/><ellipse cx="250" cy="215" rx="44" ry="58" fill="#3c6e8f"/><circle cx="250" cy="140" r="30" fill="#d9b394"/><path d="M220 135q30-42 60 0q-8-24-30-26q-22 2-30 26" fill="#1c1714"/><rect x="225" y="190" width="56" height="40" fill="#fffdf2" transform="rotate(-6 250 210)"/>`,
    table:`<rect width="640" height="360" fill="url(#bg)"/><rect x="40" y="230" width="560" height="130" fill="#6d5242"/>${[120,240,400,520].map((x,i)=>`<ellipse cx="${x}" cy="230" rx="40" ry="56" fill="${['#7b6cf6','#c45a7c','#e0794f','#4f8f6b'][i]}" opacity=".85"/><circle cx="${x}" cy="155" r="30" fill="#e8c2a0"/>`).join('')}<ellipse cx="320" cy="250" rx="70" ry="22" fill="#c43" opacity=".8"/>`,
  };
  const sub=esc(o.sub||''); const col=o.color||'#fff';
  return svgURI(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360"><defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f0d9bd"/><stop offset="1" stop-color="#b18b6e"/></linearGradient><filter id="b"><feGaussianBlur stdDeviation="2.2"/></filter></defs><g filter="url(#b)">${scenes[o.tone||'sofa']}</g>
    <rect x="18" y="16" width="118" height="30" rx="15" fill="#000" opacity=".45"/><text x="77" y="37" font-size="16" font-weight="800" fill="#fff" text-anchor="middle" font-family="sans-serif">${esc(SHOW.name)}${SHOW.season}</text>
    ${o.name?`<rect x="28" y="${sub?246:286}" width="${40+o.name.length*20}" height="32" rx="6" fill="#fff"/><text x="${48}" y="${sub?268:308}" font-size="19" font-weight="800" fill="${CAST[o.who]?CAST[o.who].c:'#333'}" font-family="sans-serif">${esc(o.name)}</text>`:''}
    ${sub?`<text x="320" y="326" font-size="31" font-weight="900" fill="${col}" stroke="#000" stroke-width="8" paint-order="stroke" stroke-linejoin="round" text-anchor="middle" font-family="sans-serif">${sub}</text>`:''}</svg>`);
}
function chatSVG(lines){
  let y=56, body='';
  lines.forEach(([who,text,rx])=>{
    const me=who==='me'; const w=Math.min(420,40+[...text].length*19);
    const x=me?620-w:84;
    if(!me){ body+=`<rect x="22" y="${y}" width="46" height="46" rx="17" fill="${CAST[who].c}"/><text x="45" y="${y+31}" font-size="19" fill="#fff" text-anchor="middle" font-weight="700" font-family="sans-serif">${esc(CAST[who].s[0])}</text><text x="84" y="${y+14}" font-size="15" fill="#333" font-family="sans-serif">${esc(CAST[who].n)}</text>`; }
    const by=me?y:y+22;
    body+=`<rect x="${x}" y="${by}" width="${w}" height="46" rx="16" fill="${me?'#ffe66d':'#fff'}"/><text x="${x+18}" y="${by+30}" font-size="19" fill="#111" font-family="sans-serif">${esc(text)}</text>`;
    if(rx) body+=`<rect x="${x+w-52}" y="${by+36}" width="50" height="24" rx="12" fill="#fff" stroke="#ddd"/><text x="${x+w-27}" y="${by+54}" font-size="15" text-anchor="middle">${rx}</text>`;
    y+= me?72:96;
  });
  return svgURI(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 ${y+10}"><rect width="640" height="${y+10}" fill="#b6c8d9"/><rect width="640" height="40" fill="#a9bccd"/><text x="320" y="27" font-size="16" fill="#222" text-anchor="middle" font-weight="700" font-family="sans-serif">${esc(T('{pd.s} · 하우스'))}  8</text>${body}</svg>`);
}
function smsSVG(){
  const r=npcSms().filter(x=>CAST[x.f]&&CAST[x.to]); const ks=['me','ex','mg','hj','js','so','ca','cb'].concat(S.day>=4?['dy']:[]); const cx=320, cy=230, R=145;
  const pos={}; ks.forEach((k,i)=>{ const a=(i/ks.length)*Math.PI*2-Math.PI/2; pos[k]=[cx+R*Math.cos(a),cy+R*Math.sin(a)]; });
  const arrows=r.map(({f,to})=>{ if(!pos[f]||!pos[to]) return ''; const [x1,y1]=pos[f],[x2,y2]=pos[to]; const dx=x2-x1,dy=y2-y1,L=Math.hypot(dx,dy); const s=34/L; return `<line x1="${x1+dx*s}" y1="${y1+dy*s}" x2="${x2-dx*s*1.2}" y2="${y2-dy*s*1.2}" stroke="${f==='me'?'#ffd400':'#ff5c8a'}" stroke-width="${f==='me'?4:3}" marker-end="url(#a${f==='me'?'y':'p'})" opacity=".95"/>`; }).join('');
  const nodes=ks.map(k=>{ const [x,y]=pos[k]; return `<circle cx="${x}" cy="${y}" r="28" fill="${CAST[k].c}" stroke="#fff" stroke-width="3"/><text x="${x}" y="${y+7}" font-size="19" fill="#fff" font-weight="800" text-anchor="middle" font-family="sans-serif">${esc(CAST[k].s)}</text>`; }).join('');
  return svgURI(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 420"><defs><marker id="ap" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="#ff5c8a"/></marker><marker id="ay" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="#ffd400"/></marker><radialGradient id="g"><stop offset="0" stop-color="#3a1f35"/><stop offset="1" stop-color="#120c16"/></radialGradient></defs><rect width="640" height="420" fill="url(#g)"/><text x="30" y="46" font-size="24" fill="#fff" font-weight="800" font-family="sans-serif">${S.day===7?"최종 선택":S.day===1?"첫날 밤, 문자의 방향":S.day+"일차 밤, 문자의 방향"}</text><text x="30" y="72" font-size="15" fill="#c9a" font-family="sans-serif">${esc(SHOW.name)}${SHOW.season}</text>${arrows}${nodes}</svg>`);
}

/* ---- 게시물 목록 ---- */
function pollPct(){
  const st=S.st,c=S.clues;
  let r={mg:30+st.mg*6,ex:8+(c.photo?9:0)+(c.cried?7:0)+(S.flags.reread?6:0)+(S.flags.lie1?5:0)+(S.rxDone.exCried&&S.rxDone.exCried!=='😆'?8:0),js:10+st.js*4,so:6+st.so*2};
  const t=Object.values(r).reduce((a,b)=>a+b,0); for(const k in r) r[k]=Math.round(r[k]/t*100); return r;
}
function tweets(){
  if(S.day>1) return tweetsDay(S.day);
  const st=S.st,f=S.flags,c=S.clues,rx=S.rxDone;
  const L=[];
  const add=(cond,o)=>{ if(cond){ o.id=o.h+L.length; o.x=T(o.x); if(o.quote) o.quote.x=T(o.quote.x); L.push(o);} };
  const off={u:SHOW.name+' 공식',h:'hwanseunglog_tv',vf:true,av:'#ff5c8a'};
  add(1,{...off,pin:true,t:'1시간',x:'📩 첫날 밤, 문자는 누구에게 향했을까\n오늘 밤 11시 본방송\n{tag}',l:21400,r:5300,v:880000,rp:1900,media:smsSVG()});
  add(c.cried,{u:'눈물버튼',h:'tearbtn_',t:'12분',x:'이 한 줄에 무너짐…\n{ex.s} X 누구야 진짜 누가 저렇게 만든 거야',l:11240,r:2810,v:310000,rp:402,media:chatSVG([['ex','저는 좀 울었어요.',rx.exCried&&rx.exCried!=='😆'?rx.exCried:null]])});
  add(1,{u:'민규지킴이',h:'mg_guard',t:'18분',x:'{mg.s} 소개서 읽고 화장실 들어가서 20분 동안 안 나옴ㅋㅋㅋㅋ\n단톡에서 다들 놀리는데 본인은 답장도 못 함',l:9870,r:2200,v:240000,rp:311,media:capSVG({tone:'door',sub:'(20분째 안 나오는 중)'})});
  add(1,{u:'하준민규 X설',h:'hjmg_x',t:'21분',x:'{hj.s} 이거 뭐임??? 처음 본 사람이 할 말 아니잖아\n\n{hj.s} {mg.s} X 확정',l:7720,r:1540,v:190000,rp:288,media:chatSVG([['hj','울 줄 알았어요.']])});
  add(1,{u:'추리반장',h:'detective_k',t:'25분',x:'{ex.s} 문자 "여름 감기 잘 걸리잖아요"\n\n이거 처음 본 사람이 아는 정보 아니잖아… 받은 사람 누군지 다들 알지?',l:15300,r:3900,v:402000,rp:620});
  add(rx.exCried&&rx.exCried!=='😆',{u:'과몰입러',h:'overimmerse',t:'9분',x:'{me.s} 방금 {ex.s} "울었어요"에 공감 누른 거 봤냐고!!!!!!\n아무도 반응 안 하고 넘어갔는데 {me.s}만',l:12880,r:3010,v:288000,rp:540});
  add(rx.exCried==='😆',{u:'독하다',h:'cold_uj',t:'9분',x:'{me.s}… {ex.s} "울었어요"에 웃음 공감 누름ㅋㅋㅋㅋ\n뭐야 둘이 무슨 사이야',l:6120,r:990,v:150000,rp:410});
  add(f.banter1,{u:'오늘도과몰입',h:'immerse_daily',t:'31분',x:'첫마디부터 킹받게 하는 {me.s} 뭐임ㅋㅋㅋㅋㅋ',l:5410,r:880,v:120000,rp:90,media:capSVG({tone:'sofa',name:CAST.me.s,who:'me',sub:'"'+T('{mg.s}')+' 씨 그럼 말로 하세요 ㅋㅋ"',color:'#ffe14d'})});
  add(st.mg>=4,{u:'ㅇㅇ',h:'anon_1204',t:'33분',x:'{mg.s} {me.s} 티키타카 미쳤음 이거 X 아니면 내가 하차함',l:8902,r:1200,v:210000,rp:233,quote:{u:'환승요정',h:'hs_fairy',x:'근데 X끼리 저렇게 편하게 놀 수 있나? 너무 편해서 오히려 아닌 것 같기도'}});
  const P=pollPct(); const top=Object.entries(P).sort((a,b)=>b[1]-a[1]);
  add(1,{u:SHOW.name+' 투표방',h:'hs_poll',t:'40분',x:'{me.s} X 누구라고 봄?',l:3200,r:610,v:96000,rp:180,poll:top.map(([k,v])=>[CAST[k].s,v]),pollN:18204});
  add(1,{u:'태오탐구',h:'taeo_lab',t:'44분',x:'단톡 자기소개 한 줄 쓰고 끝ㅋㅋㅋ 극I 그 자체',l:1980,r:210,v:54000,rp:41,media:chatSVG([['ex',T('{ex}입니다.')]])});
  add(c.photo,{u:'줌인전문',h:'zoomzoom',t:'47분',x:'단체사진 {ex.s} 시선 확대해봤는데 이거 {me.s} 쪽 아님?? 나만 봄???',l:7210,r:1803,v:170000,rp:350,media:photoSrc('group')});
  add(f.teaseMg,{u:'독한우진',h:'tough_uj',t:'50분',x:'우는 사람한테 이러는 거 너무 웃김ㅋㅋㅋㅋㅋㅋ',l:4990,r:700,v:99000,rp:120,media:chatSVG([['me',T('{mg.s} 씨 문 앞에 휴지 더 갖다 놓을까요')]])});
  add(f.mgSoft,{u:'다정우진',h:'soft_uj',t:'52분',x:'다들 {mg.s} 놀릴 때 {me.s}만 디엠으로 "괜찮아요?" 보낸 거 나만 설렘?',l:5320,r:801,v:110000,rp:140});
  add(f.mgRead,{u:'읽씹장인',h:'readignore',t:'55분',x:'{me.s} {mg.s} 디엠 읽씹ㅋㅋㅋ 스튜디오 다 소리지름 밀당 고수',l:2208,r:300,v:61000,rp:52});
  add(f.reread,{u:'새벽세시',h:'am_3',t:'1시간',x:'{me.s} 소개서 받고 표정 하나도 안 변했는데\n마지막 장 다시 넘겨서 끝까지 읽는 거 보고 눈물남',l:6630,r:1500,v:160000,rp:200,media:capSVG({tone:'night',name:CAST.me.s,who:'me',sub:'(다시 처음으로)'})});
  add(f.dry,{u:'ㅎㅎ',h:'smile_dot',t:'1시간',x:'{me.s} 소개서 읽고 피식 웃음ㅋㅋ X가 글 진짜 못 썼나봄',l:1704,r:120,v:41000,rp:66});
  add(f.exSent,{u:'폰압수좀',h:'phone_no',t:'1시간',x:'{ex.s} 폰 보다가 갑자기 엎어놓는 장면 봤냐 누가 연락함?',l:2870,r:330,v:70000,rp:88});
  add(f.dishes,{u:'설거지조',h:'dish_team',t:'1시간',x:'{me.s} {mg.s} 둘이 설거지하는데 거품 장난치는 거 카메라 세 대가 다 잡음ㅋㅋㅋ',l:4120,r:500,v:88000,rp:70,media:capSVG({tone:'table',sub:'(거품 전쟁 발발)'})});
  add(f.jsBanter||st.js>=3,{u:'룸메즈',h:'roommates',t:'1시간',x:'{me.s} {js.s} 룸메 첫날부터 "벽돌 베개" 드립 치고 있음ㅋㅋㅋ 둘이 친구 케미 미쳤다',l:3900,r:610,v:80000,rp:95});
  add(1,{u:'메기기다림',h:'waiting_catfish',t:'1시간',x:'{ca.s} 첫 문자 {ex.s}한테 보낸 거 실화? 판 흔들린다',l:3402,r:620,v:76000,rp:110});
  add(st.so>=2,{u:'막내온탑',h:'sion_top',t:'1시간',x:'{so.s} "형이라고 불러도 되죠??" 너무 강아지',l:2501,r:330,v:51000,rp:40});
  add(st.hj>=2,{u:'연상최고',h:'older_best',t:'1시간',x:'{hj.s} 씨가 {me.s}한테 "저만 봤을 거예요" 하는 거 이게 어른의 다정이다',l:3840,r:520,v:72000,rp:66});
  add(st.dist<0,{u:'ㅠ',h:'sad_t',t:'1시간',x:'{me.s} 오늘 {ex.s} 쪽으로 한 번도 안 쳐다봄… 일부러 피하는 거 같은데',l:1320,r:90,v:30000,rp:20});
  add(f.lie1,{u:'촉',h:'instinct',t:'1시간',x:'{mg.s}가 "{ex.s} 씨 X 있는 사람 같지 않아요?" 했을 때 {me.s} "글쎄요" 하는 거 0.5초 늦음. 나만 봤냐',l:4470,r:700,v:93000,rp:130});
  add(1,{u:'본방사수',h:'live_watch',t:'2시간',x:'본방 사수 성공 오늘 미쳤다 {tag}',l:880,r:40,v:20000,rp:12});
  add(1,{u:'준서야',h:'junseo_ya',t:'2시간',x:'{js.s} 소개서 읽고 울었다고 솔직하게 말하는 거 너무 귀여움',l:1440,r:80,v:33000,rp:18});
  add(1,{u:'X추리반',h:'x_reasoning',t:'2시간',x:'🧵 {tag} 1화 기준 X 추리\n\n1. {me.s} - {mg.s}: 다들 X라는데 난 아니라고 봄. 너무 처음 보는 사람끼리의 텐션\n2. {hj.s} - {mg.s}: "울 줄 알았어요" 끝\n3. {ex.s}: "저는 좀 울었어요" + 여름 감기 문자\n4. {js.s} - {ca.s}: 단체사진 팔짱 방향',l:9120,r:2900,v:260000,rp:510});
  return L;
}

/* ---- 화면 ---- */
function openTw(again){
  const go=()=>{
    const all=tweets(); const pinned=all.filter(t=>t.pin); const rest=all.filter(t=>!t.pin).sort((a,b)=>b.l-a.l);
    TW.all=all; TW.shown=[...pinned,...rest.slice(0,Math.max(6,rest.length-4))].map(t=>t.id);
    TW.queue=rest.slice(Math.max(6,rest.length-4)).map(t=>t.id); TW.fresh=[]; TW.tab='home';
    $('#tw').classList.add('on'); renderTw();
    clearInterval(TW.timer); TW.timer=setInterval(()=>{ if(!$('#tw').classList.contains('on')){clearInterval(TW.timer);return;} if(TW.queue.length){ TW.fresh.push(TW.queue.shift()); renderTw(true); } },7000);
  };
  if(again) return go();
  const n=document.createElement('div'); n.className='nightcard'; n.innerHTML=S.day===7&&S.ending?'그리고 일주일 뒤,<br>최종회가 나갔다.':`그날 밤 11시,<br>${['','첫','두 번째','세 번째','네 번째','다섯 번째','여섯 번째'][S.day]} 방송이 나갔다.`; $('#screen').appendChild(n);
  setTimeout(go,1400); setTimeout(()=>n.remove(),2700);
}
function byId(id){ return TW.all.find(t=>t.id===id); }
function twItem(t){
  const lk=TW.liked[t.id], rt=TW.rt[t.id], bm=TW.bm[t.id];
  const text=esc(t.x).replace(/(#\S+)/g,'<span class="tag">$1</span>');
  return `<article class="tw1">${'<div class="ava" style="background:'+(t.av||`hsl(${hue(t.h)} 45% 45%)`)+'">'+esc(t.u[0])+'</div>'}<div class="c">
    ${t.pin?`<div class="pin">${twIc.pin} 고정됨</div>`:''}
    <div class="hd"><b>${esc(t.u)}</b>${t.vf?twIc.vf:''}<span>@${esc(t.h)} · ${esc(t.t)}</span></div>
    <p>${text}</p>
    ${t.media?`<div class="media"><img src="${t.media}" alt=""></div>`:''}
    ${t.poll?`<div class="tpoll">${t.poll.map(([l,v],i)=>`<div class="o ${i===0?'top':''}"><i style="width:${v}%"></i><span>${esc(l)}</span><span>${v}%</span></div>`).join('')}<small>${fmtN(t.pollN)}표 · 최종 결과</small></div>`:''}
    ${t.quote?`<div class="qt"><div class="hd"><b>${esc(t.quote.u)}</b><span>@${esc(t.quote.h)}</span></div><p>${esc(t.quote.x)}</p></div>`:''}
    <div class="acts"><button data-tw="reply">${twIc.reply}${fmtN(t.rp)}</button><button class="rt ${rt?'on':''}" data-tw="rt" data-id="${t.id}">${twIc.rt}${fmtN(t.r+(rt?1:0))}</button><button class="lk ${lk?'on':''}" data-tw="like" data-id="${t.id}">${lk?twIc.likeF:twIc.like}${fmtN(t.l+(lk?1:0))}</button><button>${twIc.views}${fmtN(t.v)}</button><button class="bm ${bm?'on':''}" data-tw="bm" data-id="${t.id}">${bm?twIc.bmF:twIc.bm}</button></div>
  </div></article>`;
}
function renderTw(soft){
  const el=$('#tw'); const feed=el.querySelector('.feed'); const sc=feed?feed.scrollTop:0;
  let head='', body='';
  if(TW.tab==='home'){
    head=`<div class="top"><button class="me" data-tw="menu" style="background:${CAST.me.c}"></button><span class="logo">${esc(SHOW.tag)}</span><span style="width:32px"></span></div><div class="tabs"><button class="${TW.sub==='rec'?'on':''}" data-tw="sub" data-k="rec">추천<i></i></button><button class="${TW.sub==='fol'?'on':''}" data-tw="sub" data-k="fol">팔로우 중<i></i></button></div>`;
    const ids=TW.sub==='rec'?TW.shown:TW.shown.filter(id=>{const t=byId(id);return t.vf||t.poll||t.h==='x_reasoning';});
    body=ids.map(id=>twItem(byId(id))).join('')+'<div style="height:120px"></div>';
  } else if(TW.tab==='search'){
    head=`<div class="top" style="gap:12px"><button class="me" data-tw="menu" style="background:${CAST.me.c}"></button><div class="srch" style="flex:1;margin:0">${twIc.search.replace('viewBox','width="16" height="16" viewBox')} 검색</div></div><div class="tabs"><button>추천<i></i></button><button class="on">트렌드<i></i></button><button>엔터테인먼트<i></i></button></div>`;
    const tr=[[SHOW.tag,'42.1만'],[T(S.st.mg>=4?'{mg.s}{me.s}':'{ex.s} 울었어요'),'8.7만'],['여름 감기 문자','6.1만'],[T('{mg.s} 화장실'),'4.4만'],[T('{hj.s} 울 줄 알았어요'),'3.9만'],[T('{ex.s} 극I'),'3.2만'],['첫 문자 결과','2.9만'],[T(S.clues.photo?'{ex.s} 시선':SHOW.name+' 단톡'),'1.4만']];
    body=tr.map((t,i)=>`<div class="tr1"><div><small>${i+1} · 엔터테인먼트 · 실시간 트렌드</small><b>${esc(t[0])}</b><small>게시물 ${t[1]}개</small></div><span style="color:#71767b">⋯</span></div>`).join('')+'<div style="height:120px"></div>';
  } else if(TW.tab==='noti'){
    head=`<div class="top"><button class="me" data-tw="menu" style="background:${CAST.me.c}"></button><span class="logo">알림</span><span style="width:32px"></span></div><div class="tabs"><button class="on">전체<i></i></button><button>멘션<i></i></button></div>`;
    body=[['@hwanseunglog_tv','님이 새 게시물을 올렸습니다: 첫날 밤, 문자는 누구에게 향했을까'],[SHOW.tag,' 관련 게시물이 많아지고 있어요'],['@x_reasoning','님의 스레드가 인기를 얻고 있어요']].map(([a,b])=>`<div class="tr1" style="justify-content:flex-start;gap:12px"><span style="color:#1d9bf0">★</span><div><b style="display:inline">${esc(a)}</b>${esc(b)}</div></div>`).join('');
  } else {
    head=`<div class="top"><button data-tw="tab" data-k="home" style="color:#e7e9ea;font-size:20px">←</button><span class="logo">관찰 노트</span><span style="width:32px"></span></div>`;
    const avail=Object.keys(CLUES).filter(k=>(CLUES[k].day||1)<=S.day); const found=avail.filter(k=>S.clues[k]); const miss=avail.filter(k=>!S.clues[k]);
    const sides=Object.keys(S.side).filter(k=>SIDE[k]);
    const liked=TW.all.filter(t=>TW.bm[t.id]);
    body=`<div style="padding:14px 16px;color:#71767b;font-size:14px">찾은 단서 ${found.length} / ${avail.length} · 플레이어만 볼 수 있어요</div>`+
      found.map(k=>`<div class="bmk"><b>${esc(T(CLUES[k].t))}</b><p>${esc(T(CLUES[k].x))}</p></div>`).join('')+
      miss.map(k=>`<div class="bmk miss"><b>놓친 단서</b><p>${esc(T(CLUES[k].h||'다음엔 다른 선택을 해봐요.'))}</p></div>`).join('')+
      (sides.length?`<div style="padding:18px 16px 4px;color:#71767b;font-size:14px">다른 커플에 대한 메모</div>`+sides.map(k=>`<div class="bmk"><b style="color:#1d9bf0">?</b><p>${esc(T(SIDE[k]))}</p></div>`).join(''):'')+
      (liked.length?`<div style="padding:18px 16px 4px;color:#71767b;font-size:14px">북마크한 게시물</div>`+liked.map(twItem).join(''):'')+
      `<div style="padding:18px 16px 140px;color:#71767b;font-size:14px;line-height:1.7">${esc(moodLine())}</div>`;
  }
  const fresh=TW.tab==='home'&&TW.fresh.length;
  el.innerHTML=`<div class="twin"><div class="th">${head}</div>${fresh?`<button class="newpill" data-tw="fresh"><span class="avs">${TW.fresh.slice(-3).map(id=>`<i style="background:hsl(${hue(byId(id).h)} 45% 45%)"></i>`).join('')}</span>↑ 게시물 ${TW.fresh.length}개</button>`:''}<div class="feed">${body}</div>
    ${S.day<7&&!S.ending?`<button class="fab" data-tw="next">${S.day+1}일차로 →</button><button class="fab alt" data-tw="replay">↻ 다시 하기</button>`:`<button class="fab" data-tw="ending">엔딩 다시 보기</button><button class="fab alt" data-tw="replay">↻ 처음부터</button>`}
    <nav class="twnav">${[['home',TW.tab==='home'?twIc.homeF:twIc.home],['search',twIc.search],['noti',twIc.bell],['note',twIc.bm]].map(([k,g])=>`<button class="${TW.tab===k?'on':''}" data-tw="tab" data-k="${k}" aria-label="${k}">${g}${k==='noti'?'<span class="bd">3</span>':''}</button>`).join('')}</nav></div>`;
  if(soft){ const f=el.querySelector('.feed'); if(f) f.scrollTop=sc; }
}
function moodLine(){
  const st=S.st, parts=[];
  if(st.dist>=2) parts.push(T('{ex.s|과}의 거리가 조금 좁혀졌어요.')); else if(st.dist<0) parts.push(T('{ex.s|과}의 거리가 멀어졌어요.'));
  parts.push(st.under>=6?'오해의 실마리를 꽤 많이 잡았어요.':'아직 모르는 게 많아요.');
  const top=['mg','hj','js','so'].sort((a,b)=>st[b]-st[a])[0];
  if(st[top]>=3) parts.push(T(`오늘 가장 가까워진 사람은 {${top}.s}.`));
  return parts.join(' ');
}
$('#tw').addEventListener('click',e=>{
  const b=e.target.closest('[data-tw]'); if(!b) return; const a=b.dataset.tw, id=b.dataset.id;
  if(a==='like'){ TW.liked[id]=!TW.liked[id]; renderTw(true); }
  else if(a==='rt'){ TW.rt[id]=!TW.rt[id]; renderTw(true); }
  else if(a==='bm'){ TW.bm[id]=!TW.bm[id]; renderTw(true); toast(TW.bm[id]?'북마크에 추가됨':'북마크에서 삭제됨'); }
  else if(a==='reply') toast('보는 사람은 답글을 달 수 없어요');
  else if(a==='next') nextDay();
  else if(a==='ending'){ $('#tw').classList.remove('on'); showEnding(); }
  else if(a==='sub'){ TW.sub=b.dataset.k; renderTw(); }
  else if(a==='tab'){ TW.tab=b.dataset.k; renderTw(); }
  else if(a==='fresh'){ TW.shown=[...TW.shown.filter(i=>byId(i).pin),...TW.fresh.reverse(),...TW.shown.filter(i=>!byId(i).pin)]; TW.fresh=[]; renderTw(); $('#tw .feed').scrollTop=0; }
  else if(a==='replay'){ showAlert('처음부터 다시 할까요?','지금 기록은 사라져요.',[['취소',()=>{}],['다시 하기',()=>{ $('#tw').classList.remove('on'); const n=S.name,p=S.pin; S=freshState(n,p); save(); bootGame(true); }]]); }
  else if(a==='menu'){ showAlert(S.name,'',[['다른 플레이어',()=>{ $('#tw').classList.remove('on'); S=null; V={screen:'setup'}; render(); }],['닫기',()=>{}]]); }
});

/* ---- 2일차 ~ 7일차 반응 ---- */
function tweetsDay(d){
  const st=S.st,f=S.flags,c=S.clues; const L=[];
  const add=(cond,o)=>{ if(cond){ o.id=o.h+d+'_'+L.length; o.x=T(o.x); if(o.quote) o.quote.x=T(o.quote.x); L.push(o);} };
  const off={u:SHOW.name+' 공식',h:'hwanseunglog_tv',vf:true,av:'#ff5c8a'};
  const P=pollPct(); const top=Object.entries(P).sort((a,b)=>b[1]-a[1]);
  if(d===2){
    add(1,{...off,pin:true,t:'1시간',x:'📋 출연자 정보 공개\n나이와 직업이 공개된 뒤, 문자의 방향은?\n{tag}',l:18800,r:4100,v:640000,rp:1200,media:smsSVG()});
    add(1,{u:'프듀덕',h:'producer_stan',t:'10분',x:'{me.s} 프로듀서였던 거 실화냐… 인스타 팔로워 하루 만에 3만 넘음',l:12100,r:2600,v:300000,rp:300});
    add(1,{u:'회계사태오',h:'cpa_taeo',t:'14분',x:'{ex.s} 회계사ㅋㅋㅋ 단톡 "네." 한 글자 답장이 너무 회계사임',l:6400,r:900,v:140000,rp:120,media:chatSVG([['ex','네.']])});
    add(f.banter3,{u:'킹받음',h:'kingbat',t:'20분',x:'"말 놔도 돼?" "싫은데요 ㅋㅋ" {me.s} 진짜 {mg.s} 놀리는 데 재능 있음',l:7300,r:1100,v:150000,rp:140});
    add(f.dateWith==='ex',{u:'과몰입러',h:'overimmerse',t:'25분',x:'{me.s} {ex.s} 장보기 데이트 성사됨!!!!! 둘 다 서로 골랐다고!!!!\n근데 둘이 한 마디도 안 함',l:16200,r:4100,v:410000,rp:700,media:capSVG({tone:'table',sub:'(장바구니에 감기약을 넣는 태오)'.replace('태오',CAST.ex.s)})});
    add(f.dateWith==='mg',{u:'민규우진',h:'mgwj',t:'25분',x:'카트 타는 {mg.s} 밀어주는 {me.s} ㅋㅋㅋㅋㅋ 서른 다 된 사람들 맞냐',l:9900,r:2000,v:220000,rp:310,media:capSVG({tone:'sofa',sub:'(카트 탑승)'})});
    add(f.dateWith==='js'||f.jsCart,{u:'룸메즈',h:'roommates',t:'28분',x:'{me.s} {js.s} 장보기에서 카트 쟁탈전함ㅋㅋ 이건 그냥 대학 동기 아님?',l:6100,r:800,v:130000,rp:90});
    add(f.dateWith==='so',{u:'막내온탑',h:'sion_top',t:'30분',x:'"형!! 저 형 고를 줄 알았죠??" {so.s} 꼬리 보임',l:5600,r:700,v:110000,rp:80});
    add(f.liePasta,{u:'촉',h:'instinct',t:'33분',x:'{ex.s}가 "아직 파스타 좋아해?" 물었는데 {me.s} "이제 별로"\n\n아니 첫날 저녁 투표 파스타 찍었잖아요',l:11400,r:2500,v:260000,rp:380});
    add(!!S.flags.exPicked1,{u:'추리반장',h:'detective_k',t:'40분',x:'제작진 피셜 {ex.s}도 데이트 신청 {me.s} 썼대… 근데 {me.s}는 다른 사람 씀',l:13800,r:3300,v:330000,rp:560});
  } else if(d===3){
    add(1,{...off,pin:true,t:'1시간',x:'🗝 X 데이트\n각자의 X와 보낸 하루. 누가 누구와 있었을까?\n{tag}',l:24100,r:6200,v:920000,rp:2300});
    add(1,{u:'X추리반',h:'x_reasoning',t:'8분',x:'🧵 3화 X 데이트 장소로 다 들킴\n{me.s} - {ex.s}: 같은 추억 공간에 머그컵 두 개\n{mg.s} - {hj.s}: 돌아와서 또 움',l:21000,r:6100,v:540000,rp:980});
    add(f.teaseLetter,{u:'눈물버튼',h:'tearbtn_',t:'12분',x:'"형 거 좀 건조하더라" ← 첫날 소개서 얘기 7년 산 사람만 할 수 있는 말투',l:9800,r:2000,v:210000,rp:250});
    add(f.askedPocket,{u:'줌인전문',h:'zoomzoom',t:'15분',x:'{ex.s} 왼쪽 주머니 계속 만지는 거 다들 봄??? 거기 뭐 있음',l:15400,r:4200,v:390000,rp:610,media:capSVG({tone:'night',name:CAST.ex.s,who:'ex',sub:'"…아무것도."'})});
    add(f.coldDate,{u:'ㅠ',h:'sad_t',t:'18분',x:'"그런 거 이제 신경 쓰지 마" {me.s} 말에 {ex.s} 표정 무너짐',l:8800,r:1500,v:190000,rp:300});
    add(1,{u:'민규지킴이',h:'mg_guard',t:'22분',x:'{mg.s} X 데이트 다녀와서 또 화장실ㅋㅋㅋ 이번엔 {hj.s}가 휴지 채워놓음',l:11200,r:2400,v:250000,rp:330});
    add(c.mug,{u:'머그탐정',h:'mug_detective',t:'30분',x:'{me.s} 인스타 작업실 사진 머그컵이랑 추억 공간 머그컵 같은 거임\n\n제 말 맞았죠',l:19800,r:5600,v:480000,rp:900});
  } else if(d===4){
    add(1,{...off,pin:true,t:'1시간',x:'🐟 새로운 출연자가 들어왔습니다\n{tag}',l:20300,r:4800,v:780000,rp:2100,media:smsSVG()});
    add(1,{u:'메기기다림',h:'waiting_catfish',t:'7분',x:'{dy.s} 직진 미쳤음 들어오자마자 {ex.s} 커피 타줌',l:9900,r:1700,v:240000,rp:520,media:chatSVG([['dy',T('{ex.s} 씨 커피 연하게 드시죠?')]])});
    add(f.exposed,{u:'과몰입러',h:'overimmerse',t:'9분',x:'"땅콩 들어간 건 주지 마세요"\n\n{me.s} 이 한 줄로 시즌 끝냄. X 확정',l:41200,r:12800,v:1200000,rp:3200,media:chatSVG([['me','땅콩 들어간 건 주지 마세요'],['ex','알레르기 있어요. 고마워요.']])});
    add(!f.exposed,{u:'답답',h:'frustrated',t:'9분',x:'{me.s} 왜 아무 말도 안 해!!!!! 견과류 라떼라잖아!!!',l:7700,r:900,v:160000,rp:410});
    add(f.toldMg,{u:'룸메즈2',h:'roommates2',t:'15분',x:'{me.s} {mg.s} 새 룸메 첫날 밤에 서로 X 고백함ㅋㅋㅋ 비밀 지키기로 함 (방송 나감)',l:12600,r:2800,v:270000,rp:400});
    add(f.dyLie,{u:'촉',h:'instinct',t:'20분',x:'{dy.s}: "{ex.s} 씨랑 친하세요?" {me.s}: "아뇨. 별로"\n\n7년…',l:8800,r:1600,v:190000,rp:290});
  } else if(d===5){
    add(1,{...off,pin:true,t:'1시간',x:'🌊 강릉. 그리고 진실게임\n{tag}',l:26800,r:7100,v:990000,rp:2600});
    add(c.truth,{u:'눈물버튼',h:'tearbtn_',t:'6분',x:'{ex.s} "…있어요." 3초 동안 숨 참음',l:30100,r:9200,v:880000,rp:1700,media:capSVG({tone:'night',name:CAST.ex.s,who:'ex',sub:'"…있어요."',color:'#ffe14d'})});
    add(f.saidYes,{u:'과몰입러',h:'overimmerse',t:'9분',x:'{me.s} "X랑 다시 만날 생각 있어요?" "…있어요"\n\n강릉에서 이러면 반칙이지',l:28800,r:8800,v:830000,rp:1500});
    add(f.saidNo,{u:'ㅠ',h:'sad_t',t:'9분',x:'"아니요" 할 때 {ex.s} 잔 내려놓는 소리 들림…',l:12000,r:2100,v:300000,rp:600});
    add(st.so>=4,{u:'막내온탑',h:'sion_top',t:'12분',x:'{so.s} 바다 들어가서 "형도 와요!!" 하는 거 청춘 영화임',l:14400,r:3100,v:350000,rp:420,media:capSVG({tone:'sofa',sub:'"형도 와요!!"'})});
    add(f.jsLean,{u:'룸메즈',h:'roommates',t:'15분',x:'{me.s} 술 취해서 {js.s} 어깨에 기댐… 친구 케미가 이렇게 무섭다',l:10400,r:1900,v:240000,rp:360});
    add(f.lieX,{u:'촉',h:'instinct',t:'20분',x:'"이 중에 X 있어요?" "없어요" ← 시청자 전원 거짓말 탐지기 울림',l:9300,r:1300,v:210000,rp:330});
  } else if(d===6){
    add(1,{...off,pin:true,t:'1시간',x:'🎤 속마음 인터뷰\n{tag}',l:22400,r:5600,v:860000,rp:1900});
    add(1,{u:'눈물버튼',h:'tearbtn_',t:'4분',x:'{ex.s} 인터뷰\n"그날 종로에 반지 사러 갔었어요. 근데 말을 못 했어요."\n\n그래서 D-17이었냐고',l:48800,r:16100,v:1600000,rp:4200,media:capSVG({tone:'night',name:CAST.ex.s,who:'ex',sub:'"그날 종로에 반지 사러 갔었어요"',color:'#ffe14d'})});
    add(c.interview,{u:'새벽세시',h:'am_3',t:'8분',x:'{me.s} 인터뷰 "다 좋은데 그게 변할까 봐 무서웠어요"\n\n둘이 같은 걸 무서워했던 거잖아',l:36100,r:11000,v:1100000,rp:2600});
    add(f.ivNo,{u:'ㅠ',h:'sad_t',t:'10분',x:'"아니요. 끝났어요." {me.s} 진심일까',l:9000,r:1200,v:200000,rp:500});
    add(1,{u:SHOW.name+' 투표방',h:'hs_poll',t:'20분',x:'최종 선택 예측: {me.s}는 누구를?',l:9800,r:2200,v:300000,rp:900,poll:top.map(([k,v])=>[CAST[k].s,v]),pollN:52100});
    add(1,{u:'민규지킴이',h:'mg_guard',t:'25분',x:'{mg.s} "울지 마라 시온아" → 3초 뒤 "…인정" 본인이 제일 울 예정',l:8800,r:1100,v:180000,rp:200});
  } else {
    const fp=S.final? S.final.p : {}; const me=S.final?S.final.me:'ex'; const good=S.final&&S.final.good;
    add(1,{...off,pin:true,t:'방금',x:'💌 최종 선택\n일주일의 끝, 모두의 선택\n{tag}',l:88000,r:31000,v:4200000,rp:12000,media:smsSVG()});
    add(me==='ex'&&good,{u:'과몰입러',h:'overimmerse',t:'1분',x:'재회!!!!!!!!!!!!!!!!!!!\n반지 상자 주머니에 넣어주는 거 보고 울었다 진짜로',l:120000,r:40000,v:5100000,rp:9000});
    add(me==='ex'&&!good,{u:'눈물버튼',h:'tearbtn_',t:'1분',x:'{ex.s} "이번엔 내가 기다릴게"\n\n최종 선택 안 했는데 이게 제일 큰 고백임',l:91000,r:30000,v:3800000,rp:7000});
    add(me==='mg'&&good,{u:'민규우진',h:'mgwj',t:'1분',x:'민규우진 성사!!!!!! 첫날 단톡에서 싸운 둘이!!!!',l:64000,r:18000,v:2100000,rp:4000});
    add(me==='mg'&&!good,{u:'민규지킴이',h:'mg_guard',t:'1분',x:'{mg.s} 아무도 안 고름… "아직 정리가 안 됐어" 하고 또 움',l:42000,r:9000,v:1300000,rp:3000});
    add(!['ex','mg'].includes(me),{u:'환승파',h:'transfer_team',t:'1분',x:good?`{me.s} 환승 성공!! ${CAST[me].s}랑 나감`:`{me.s} 혼자 나감… ${CAST[me].s}는 다른 선택`,l:52000,r:12000,v:1700000,rp:3500});
    add(fp.ex==='me'&&me!=='ex',{u:'ㅠ',h:'sad_t',t:'2분',x:'{ex.s}는 끝까지 {me.s} 골랐다…',l:70000,r:21000,v:2600000,rp:5000});
    add(fp.mg==='hj',{u:'하준민규 X설',h:'hjmg_x',t:'2분',x:'{mg.s} {hj.s} 재회!!! "울 줄 알았어요"가 복선이었다',l:58000,r:15000,v:1900000,rp:3600});
    add(fp.ca==='js',{u:'준서야',h:'junseo_ya',t:'3분',x:'{js.s} {ca.s} 재회. 첫날 팔짱 방향이 맞았다',l:21000,r:4000,v:600000,rp:800});
    add(1,{u:'메기기다림',h:'waiting_catfish',t:'3분',x:'{dy.s}는 {ex.s} 골랐는데 {ex.s}는… 메기의 일주일',l:18000,r:3000,v:500000,rp:900});
  }
  add(1,{u:'본방사수',h:'live_watch',t:'1시간',x:`${d}화 본방 사수 성공 {tag}`,l:900+d*300,r:40,v:20000,rp:12});
  return L;
}
