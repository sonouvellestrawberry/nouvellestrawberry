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
  const r=npcSms(); const ks=['me','ex','mg','hj','js','so','ca','cb']; const cx=320, cy=230, R=145;
  const pos={}; ks.forEach((k,i)=>{ const a=(i/ks.length)*Math.PI*2-Math.PI/2; pos[k]=[cx+R*Math.cos(a),cy+R*Math.sin(a)]; });
  const arrows=r.map(({f,to})=>{ const [x1,y1]=pos[f],[x2,y2]=pos[to]; const dx=x2-x1,dy=y2-y1,L=Math.hypot(dx,dy); const s=34/L; return `<line x1="${x1+dx*s}" y1="${y1+dy*s}" x2="${x2-dx*s*1.2}" y2="${y2-dy*s*1.2}" stroke="${f==='me'?'#ffd400':'#ff5c8a'}" stroke-width="${f==='me'?4:3}" marker-end="url(#a${f==='me'?'y':'p'})" opacity=".95"/>`; }).join('');
  const nodes=ks.map(k=>{ const [x,y]=pos[k]; return `<circle cx="${x}" cy="${y}" r="28" fill="${CAST[k].c}" stroke="#fff" stroke-width="3"/><text x="${x}" y="${y+7}" font-size="19" fill="#fff" font-weight="800" text-anchor="middle" font-family="sans-serif">${esc(CAST[k].s)}</text>`; }).join('');
  return svgURI(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 420"><defs><marker id="ap" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="#ff5c8a"/></marker><marker id="ay" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="#ffd400"/></marker><radialGradient id="g"><stop offset="0" stop-color="#3a1f35"/><stop offset="1" stop-color="#120c16"/></radialGradient></defs><rect width="640" height="420" fill="url(#g)"/><text x="30" y="46" font-size="24" fill="#fff" font-weight="800" font-family="sans-serif">첫날 밤, 문자의 방향</text><text x="30" y="72" font-size="15" fill="#c9a" font-family="sans-serif">${esc(SHOW.name)}${SHOW.season}</text>${arrows}${nodes}</svg>`);
}

/* ---- 게시물 목록 ---- */
function pollPct(){
  const st=S.st,c=S.clues;
  let r={mg:30+st.mg*6,ex:8+(c.photo?9:0)+(c.cried?7:0)+(S.flags.reread?6:0)+(S.flags.lie1?5:0)+(S.rxDone.exCried&&S.rxDone.exCried!=='😆'?8:0),js:10+st.js*4,so:6+st.so*2};
  const t=Object.values(r).reduce((a,b)=>a+b,0); for(const k in r) r[k]=Math.round(r[k]/t*100); return r;
}
function tweets(){
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
  add(1,{u:'환승로그 투표방',h:'hs_poll',t:'40분',x:'{me.s} X 누구라고 봄?',l:3200,r:610,v:96000,rp:180,poll:top.map(([k,v])=>[CAST[k].s,v]),pollN:18204});
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
  const n=document.createElement('div'); n.className='nightcard'; n.innerHTML='그날 밤 11시,<br>첫 방송이 나갔다.'; $('#screen').appendChild(n);
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
    const tr=[[SHOW.tag,'42.1만'],[T(S.st.mg>=4?'{mg.s}{me.s}':'{ex.s} 울었어요'),'8.7만'],['여름 감기 문자','6.1만'],[T('{mg.s} 화장실'),'4.4만'],[T('{hj.s} 울 줄 알았어요'),'3.9만'],[T('{ex.s} 극I'),'3.2만'],['첫 문자 결과','2.9만'],[T(S.clues.photo?'{ex.s} 시선':'환승로그 단톡'),'1.4만']];
    body=tr.map((t,i)=>`<div class="tr1"><div><small>${i+1} · 엔터테인먼트 · 실시간 트렌드</small><b>${esc(t[0])}</b><small>게시물 ${t[1]}개</small></div><span style="color:#71767b">⋯</span></div>`).join('')+'<div style="height:120px"></div>';
  } else if(TW.tab==='noti'){
    head=`<div class="top"><button class="me" data-tw="menu" style="background:${CAST.me.c}"></button><span class="logo">알림</span><span style="width:32px"></span></div><div class="tabs"><button class="on">전체<i></i></button><button>멘션<i></i></button></div>`;
    body=[['@hwanseunglog_tv','님이 새 게시물을 올렸습니다: 첫날 밤, 문자는 누구에게 향했을까'],[SHOW.tag,' 관련 게시물이 많아지고 있어요'],['@x_reasoning','님의 스레드가 인기를 얻고 있어요']].map(([a,b])=>`<div class="tr1" style="justify-content:flex-start;gap:12px"><span style="color:#1d9bf0">★</span><div><b style="display:inline">${esc(a)}</b>${esc(b)}</div></div>`).join('');
  } else {
    head=`<div class="top"><button data-tw="tab" data-k="home" style="color:#e7e9ea;font-size:20px">←</button><span class="logo">관찰 노트</span><span style="width:32px"></span></div>`;
    const found=Object.keys(CLUES).filter(k=>S.clues[k]); const miss=Object.keys(CLUES).filter(k=>!S.clues[k]);
    const sides=Object.keys(S.side).filter(k=>SIDE[k]);
    const liked=TW.all.filter(t=>TW.bm[t.id]);
    body=`<div style="padding:14px 16px;color:#71767b;font-size:14px">찾은 단서 ${found.length} / ${Object.keys(CLUES).length} · 플레이어만 볼 수 있어요</div>`+
      found.map(k=>`<div class="bmk"><b>${esc(T(CLUES[k].t))}</b><p>${esc(T(CLUES[k].x))}</p></div>`).join('')+
      miss.map(k=>`<div class="bmk miss"><b>놓친 단서</b><p>${esc(T(CLUES[k].h||'다음엔 다른 선택을 해봐요.'))}</p></div>`).join('')+
      (sides.length?`<div style="padding:18px 16px 4px;color:#71767b;font-size:14px">다른 커플에 대한 메모</div>`+sides.map(k=>`<div class="bmk"><b style="color:#1d9bf0">?</b><p>${esc(T(SIDE[k]))}</p></div>`).join(''):'')+
      (liked.length?`<div style="padding:18px 16px 4px;color:#71767b;font-size:14px">북마크한 게시물</div>`+liked.map(twItem).join(''):'')+
      `<div style="padding:18px 16px 140px;color:#71767b;font-size:14px;line-height:1.7">${esc(moodLine())}</div>`;
  }
  const fresh=TW.tab==='home'&&TW.fresh.length;
  el.innerHTML=`<div class="twin"><div class="th">${head}</div>${fresh?`<button class="newpill" data-tw="fresh"><span class="avs">${TW.fresh.slice(-3).map(id=>`<i style="background:hsl(${hue(byId(id).h)} 45% 45%)"></i>`).join('')}</span>↑ 게시물 ${TW.fresh.length}개</button>`:''}<div class="feed">${body}</div>
    <button class="fab alt" data-tw="replay">↻ 다시 하기</button><button class="fab" disabled>다음 날 · 준비 중</button>
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
  else if(a==='sub'){ TW.sub=b.dataset.k; renderTw(); }
  else if(a==='tab'){ TW.tab=b.dataset.k; renderTw(); }
  else if(a==='fresh'){ TW.shown=[...TW.shown.filter(i=>byId(i).pin),...TW.fresh.reverse(),...TW.shown.filter(i=>!byId(i).pin)]; TW.fresh=[]; renderTw(); $('#tw .feed').scrollTop=0; }
  else if(a==='replay'){ showAlert('처음부터 다시 할까요?','지금 기록은 사라져요.',[['취소',()=>{}],['다시 하기',()=>{ $('#tw').classList.remove('on'); const n=S.name,p=S.pin; S=freshState(n,p); save(); bootGame(true); }]]); }
  else if(a==='menu'){ showAlert(S.name,'',[['다른 플레이어',()=>{ $('#tw').classList.remove('on'); S=null; V={screen:'setup'}; render(); }],['닫기',()=>{}]]); }
});
