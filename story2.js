/* =========================================================
   2일차 ~ 7일차 · 엔딩
   ========================================================= */

/* 2일차 정보 공개 [이름, 나이, 직업] */
window.INFO=[['ex',29,'회계사'],['me',28,'음악 프로듀서'],['mg',28,'브랜드 마케터'],['hj',31,'건축가'],['js',28,'수의사'],['so',24,'대학원생'],['ca',28,'그래픽 디자이너'],['cb',26,'사진작가']];
PROFILES.dy={status:'새로운 시작 🌱'};

/* ---------- 추가 단서 ---------- */
Object.assign(CLUES,{
  mug:{day:3,t:'추억 공간 · 머그컵',x:'내가 못 보낸 머그컵의 짝이 여기 있다. {ex.s}도 버리지 않았다.',h:'추억 공간 사진에서 테이블 위를 눌러봐요.'},
  circle:{day:3,t:'추억 공간 · 달력',x:'5월 19일에 동그라미. 그 옆에 작은 글씨로 "말하기".',h:'추억 공간 사진에서 벽을 눌러봐요.'},
  ring:{day:3,t:'룸메이트의 목격',x:'{mg.s} 말로는, {ex.s} 가방에서 작은 반지 케이스가 떨어졌다.',h:''},
  allergy:{day:4,t:'땅콩',x:'"땅콩 들어간 건 주지 마세요." 말해버렸다. 다 들었다.',h:''},
  truth:{day:5,t:'진실게임',x:'"지금 마음에 있는 사람?" {ex.s|이가} 3초 있다가 "있어요"라고 했다.',h:''},
  interview:{day:6,t:'속마음 인터뷰',x:'결혼이 무서웠던 진짜 이유를 처음으로 말했다. 카메라 앞에서.',h:'인터뷰에서 결혼 질문에 솔직하게 답해봐요. 가사 메모 버전 기록을 봤다면 선택지가 하나 더 생겨요.'},
  deleted:{day:7,t:'지운 메시지',x:'"결혼 안 해도 돼. 그러니까" 그 새벽에 하려던 말.',h:''},
});
Object.assign(SIDE,{
  dyTaeo:'{dy.s} 씨가 {ex.s}한테 커피를 타줬다. 연하게.',
  jhjs:'{ca.s} 씨가 {js.s} 씨 방 앞에서 한참 서 있었다.',
  hjmg2:'{hj.s} 씨가 {mg.s} 씨 몰래 휴지를 채워놨다.',
});

/* 추억 공간 사진 */
window.SPOTS = window.SPOTS || {};
SPOTS.group = GROUP_SPOTS;
SPOTS.xroom = [
  {x:30,y:62,clue:'mug',t:'머그컵 두 개. 하나는 내가 못 보낸 거고, 하나는… 형이 가져간 거였다.'},
  {x:74,y:30,clue:'circle',t:'달력. 5월 19일에 동그라미. 그 옆에 작은 글씨로 "말하기".'},
  {x:55,y:66,t:'둘이 같이 쓰던 담요. 아직 섬유유연제 냄새가 똑같다.'},
  {x:14,y:28,t:'액자. 강릉 사진. 둘 다 눈을 감았다.'},
];
window.PH_EXTRA={}; PH_EXTRA.xroom=()=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="#efe4d4"/><rect y="210" width="400" height="90" fill="#b89474"/><rect x="30" y="50" width="50" height="62" fill="#fff" stroke="#8a6b55" stroke-width="4"/><rect x="36" y="56" width="38" height="50" fill="#9ad1d4"/><rect x="260" y="40" width="80" height="100" fill="#fff" stroke="#999"/>${[0,1,2,3,4].map(r=>[0,1,2,3,4,5,6].map(c=>`<rect x="${266+c*10}" y="${60+r*14}" width="8" height="10" fill="#eee"/>`).join('')).join('')}<circle cx="296" cy="102" r="8" fill="none" stroke="#e33" stroke-width="2"/><rect x="60" y="200" width="200" height="16" fill="#7a5a44"/><rect x="100" y="172" width="20" height="28" rx="3" fill="#fff"/><rect x="128" y="172" width="20" height="28" rx="3" fill="#cfe3f1"/><rect x="180" y="190" width="80" height="20" rx="6" fill="#d9a6a6"/></svg>`;

/* ---------- 날짜 시작 / 공통 ---------- */
function dayStart(d,t){
  if(S.sms && (S.sms.sent||S.sms.inbox.length)) (S.smsHist=S.smsHist||[]).push(Object.assign({day:S.day},S.sms));
  S.day=d; S.time=t; S.ended=false; S.sms={inbox:[],sent:null}; S.flags.smsOpen=false; S.focus=true; S.battery=Math.min(100,S.battery+60);
  save();
}
const night=(cap,q)=>[
  {do:()=>{S.time=22*60;}},
  {msg:['pd','pd','오늘의 문자를 보내주세요.']},
  {do:()=>{S.flags.smsOpen=true;}},
  {wait:()=>S.sms.sent, hint:['메시지 앱에서 오늘의 문자를 보내요.']},
  {sleep:2500},{do:()=>{S.time=22*60+40;}},{do:()=>receiveSms()},
  {wait:()=>S.sms.inbox.every(m=>m.read), hint:['문자가 왔어요.']},
  {sleep:3000},{do:()=>{S.time=23*60+30;}},
  {sheet:{inner:true,cap,q,o:[{l:'폰을 내려놓는다'}]}},
  {do:()=>endDay()},
];

/* ---------- 날마다 받는 익명 문자 ---------- */
window.SMS_IN = {
  1:()=>{ const a=[{from:'mg',x:'소파 끝자리 말고 내일은 제 옆에 앉아요. 비워둘게요.'},{from:'ex',x:'에어컨 너무 세게 틀고 자지 마요. 여름 감기 잘 걸리잖아요.'}];
    if(S.st.js>=2||(S.sms.sent&&S.sms.sent.to==='js')) a.push({from:'js',x:'룸메라서 다행이에요. 내일 아침은 제가 할게요.'}); else if(S.st.so>=2) a.push({from:'so',x:'오늘 처음 본 사람 중에 제일 좋았어요!! (누군지 맞혀보세요)'}); return a; },
  2:()=>{ const a=[{from:'ex',x:'아침 안 먹는 거 여전하네요. 오늘은 먹어요.'}];
    if(S.st.mg>=4) a.push({from:'mg',x:'동갑인 거 알고 나니까 더 편해짐. 내일도 장난칠 거임'});
    if(S.st.js>=4) a.push({from:'js',x:'야 내일 아침 내가 먼저 일어난다'});
    if(S.st.hj>=3) a.push({from:'hj',x:'오늘 웃는 거 처음 제대로 봤어요.'}); return a; },
  3:()=>{ const a=[]; if(S.st.dist>=3) a.push({from:'ex',x:'오늘 고마웠어요. 컵, 아직 있어요.'}); else a.push({from:'ex',x:'오늘 미안했어요.'});
    if(S.st.mg>=5) a.push({from:'mg',x:'오늘 X 데이트 어땠어요? 난 망함ㅋㅋ'});
    if(S.st.so>=3) a.push({from:'so',x:'형 내일은 저랑도 얘기해요!!'}); return a; },
  4:()=>{ const a=[]; if(S.st.dist>=3) a.push({from:'ex',x:'땅콩 얘기, 고마워요.'});
    if(S.st.mg>=6) a.push({from:'mg',x:'룸메 됐으니까 오늘 밤 수다 각'});
    if(S.st.js>=5) a.push({from:'js',x:'방 바뀌니까 허전하다. 코골이 그리움'});
    if(S.st.hj>=4) a.push({from:'hj',x:'오늘 표정 안 좋던데. 괜찮아요?'});
    if(!a.length) a.push({from:'cb',x:'힘내요.'}); return a; },
  5:()=>{ const a=[]; if(S.st.dist>=4) a.push({from:'ex',x:'바다 앞에서 생각났어요. 강릉.'});
    if(S.st.so>=4) a.push({from:'so',x:'오늘 데이트 진짜 좋았어요. 형이 웃는 거 계속 생각남'});
    if(S.st.mg>=7) a.push({from:'mg',x:'진실게임 때 대답, 진짜였어요?'});
    if(S.st.js>=6) a.push({from:'js',x:'술 취한 거 다 봤다 ㅋ 내일 놀릴 거임'});
    if(!a.length) a.push({from:'hj',x:'내일 인터뷰, 솔직하게 해요.'}); return a; },
  6:()=>{ const a=[]; if(S.st.dist>=5) a.push({from:'ex',x:'내일 할 말 있어요.'}); else a.push({from:'ex',x:'잘 자요.'});
    const top=['mg','hj','js','so'].sort((x,y)=>S.st[y]-S.st[x])[0]; if(S.st[top]>=5) a.push({from:top,x:{mg:'내일 나 누구 고를지 알아요?',hj:'내일, 후회 없이 골라요.',js:'친구로든 뭐로든 내일 보자',so:'형 내일 저 기다릴 거예요'}[top]}); return a; },
};
window.SMS_NPC = {
  1:()=>[{f:'mg',to:'me'},{f:'ex',to:'me'},{f:'hj',to:'mg'},{f:'ca',to:'ex'},{f:'js',to:S.sms.inbox.some(m=>m.from==='js')?'me':'ca'},{f:'so',to:S.sms.inbox.some(m=>m.from==='so')?'me':'hj'},{f:'cb',to:'js'}],
  7:()=>{ const f=S.final; if(!f) return []; return Object.entries(Object.assign({me:f.me},f.p)).filter(([a,b])=>b).map(([a,b])=>({f:a,to:b})); },
  d:()=>{ const r=S.sms.inbox.map(m=>({f:m.from,to:'me'})); const has=k=>r.some(x=>x.f===k);
    if(!has('ex')) r.push({f:'ex',to:'me'}); if(!has('mg')) r.push({f:'mg',to:'hj'}); if(!has('hj')) r.push({f:'hj',to:'mg'});
    if(!has('js')) r.push({f:'js',to:'ca'}); if(!has('so')) r.push({f:'so',to:'cb'}); r.push({f:'ca',to:S.day>=4?'js':'ex'});
    if(S.day>=4) r.push({f:'dy',to:'ex'}); return r; },
};

/* =========================================================
   2일차 · 정보 공개 + 첫 데이트
   ========================================================= */
SCRIPT.d2=[
  {do:()=>dayStart(2,8*60+10)},
  {msg:['js','js',' 일어났냐']},
  {msg:['js','js','내기 내가 이김 ㅋ 6시 50분 기상']},
  {choice:'js',o:[
    {l:'6시 50분에 알람이 울려서 그래…',fx:{js:1,alarmTalk:true},go:'al'},
    {l:'반칙. 알람 쓴 거 아니야?',fx:{js:2}},
    {l:'읽고 다시 자기',silent:true,fx:{}},
  ]},
  {msg:['js','js','쓰긴 뭘 써 ㅋㅋ 체질임']},{go:'h'},
  {label:'al'},{msg:['js','js','? 너 그 시간에 왜 알람 있음']},{msg:['js','js','아 됐다 안 물어봄 ㅋ']},
  {label:'h'},
  {msg:['house','so','아침 김치볶음밥 누가 했어요?? 미쳤다']},
  {msg:['house','js','저요 ㅋ 룸메가 안 일어나서 혼자 함'],d:1600},
  {msg:['house','mg','룸메가 누군데 ㅋㅋㅋ'],d:1200},
  {choice:'house',o:[
    {l:'저요. 근데 맛있었어요',fx:{js:1}},
    {l:'볶음밥 좀 짜던데요',fx:{js:2,mg:1},rx:['js','😆']},
    {l:'구경만 하기',silent:true,fx:{}},
  ]},
  {msg:['house','js','아 진짜 ㅋㅋㅋㅋ'],d:1200},
  {sleep:1500},
  {msg:['pd','pd','오늘 오후 2시, 출연자 정보(나이, 직업)가 공개됩니다.']},
  {sleep:2500},
  {do:()=>{S.time=14*60;}},
  {msg:['pd','pd','',{kind:'info'}]},
  {do:()=>{S.flags.infoOpen=true; notifyRaw('insta','Instagram','hs2_watcher님 외 1.2만 명이 회원님을 팔로우하기 시작했습니다','지금');}},
  {msg:['house','so','{me.s} 형 프로듀서였어요????'],d:1800},
  {msg:['house','ca','헐 저 그 노래 알아요'],d:1500},
  {msg:['house','mg','아 동갑이네? 말 놔도 돼?'],d:1700},
  {choice:'house',o:[
    {l:'응 놔',fx:{mg:2},rx:['mg','👍']},
    {l:'싫은데요 ㅋㅋ',fx:{mg:2,banter3:true},rx:['mg','😆'],go:'no'},
    {l:'편하게 하세요',fx:{mg:1}},
  ]},
  {msg:['house','mg','오케이 우진아 ㅋㅋ'],d:1200},{go:'x'},
  {label:'no'},{msg:['house','mg','아 왜 ㅋㅋㅋㅋ 그럼 나만 놓을게'],d:1300},
  {label:'x'},
  {msg:['house','hj','{ex.s} 씨 회계사셨구나. 딱 그럴 것 같았어요.'],d:2000},
  {msg:['house','ex','네.'],d:2600},
  {msg:['js','js','야 동갑 ㅋㅋㅋ 이제 반말이다'],d:1500},
  {choice:'js',o:[
    {l:'어 반말해 친구야',fx:{js:2}},
    {l:'그래도 난 존댓말 쓸게요 ㅋ',fx:{js:1,jsTease:true}},
  ]},
  {msg:['js','js','ㅋㅋㅋ 너 진짜 피곤한 스타일이다 좋아']},
  {sleep:2000},
  {do:()=>{S.time=16*60;}},
  {msg:['pd','pd','첫 데이트 신청: 함께 장 보러 갈 사람을 한 명 골라주세요. 서로 고르면 데이트가 성사됩니다.']},
  {choice:'pd',o:[
    {l:'{ex}',fx:{date1:'ex'}},{l:'{mg}',fx:{date1:'mg'}},{l:'{hj}',fx:{date1:'hj'}},{l:'{js}',fx:{date1:'js'}},{l:'{so}',fx:{date1:'so'}},
  ]},
  {sleep:2500},
  {do:()=>{ const p=S.flags.date1; const back={ex:S.st.dist>=2,mg:S.st.mg>=4,hj:S.st.hj>=2,js:true,so:S.st.so>=2}[p]; S.flags.date1ok=!!back; S.flags.dateWith=back?p:'js'; }},
  {msg:['pd','pd','데이트 결과가 나왔습니다. 오후 5시에 출발해주세요.']},
  {sheet:{inner:true,cap:'오후 5:00 · 장보기 데이트',q:'결과를 확인했다.',o:[{l:'누구랑 가는지 본다'}]}},
  {if:()=>S.flags.dateWith==='ex',go:'dex'},
  {if:()=>S.flags.dateWith==='mg',go:'dmg'},
  {if:()=>S.flags.dateWith==='hj',go:'dhj'},
  {if:()=>S.flags.dateWith==='so',go:'dso'},
  /* 준서 (기본) */
  {sheet:{inner:true,q:'{js.s}. 서로 골랐다. 아니면 둘 다 아무도 안 골라준 건지도.\n카트를 서로 밀겠다고 싸웠다.',o:[
    {l:'카트에 몰래 과자를 넣는다',fx:{js:2,jsCart:true}},{l:'얌전히 장만 본다',fx:{js:1}}]}},
  {sheet:{inner:true,q:'"야. 너 X 누군지 나 알 것 같아."\n{js.s|이가} 계산대 앞에서 말했다.',o:[
    {l:'"누군데?"',fx:{js:1,jsKnows:true}},{l:'"모르는 게 좋을걸"',fx:{js:2}},{l:'못 들은 척한다',fx:{}}]}},
  {go:'dend'},
  {label:'dex'},
  {sheet:{inner:true,q:'{ex.s}. 서로 골랐다.\n제작진이 웃었다. 우리만 안 웃었다.',o:[{l:'…'}]}},
  {sheet:{inner:true,q:'형이 장바구니에 아무 말 없이 감기약을 넣었다.',o:[
    {l:'"그거 왜 넣어"',fx:{dist:1}},{l:'모른 척한다',fx:{}},{l:'몰래 빼서 다시 넣어둔다',fx:{dist:-1}}]}},
  {sheet:{inner:true,q:'"아직 파스타 좋아해?"\n형이 진열대를 보며 물었다.',o:[
    {l:'"응"',fx:{dist:2}},{l:'"이제 별로"',fx:{dist:-1,liePasta:true}}]}},
  {go:'dend'},
  {label:'dmg'},
  {sheet:{inner:true,q:'{mg.s}. 서로 골랐다.\n마트 입구에서부터 카트를 타겠다고 했다.',o:[
    {l:'밀어준다',fx:{mg:2,mgCart:true}},{l:'"서른 다 돼서 뭐 하는 거야"',fx:{mg:1}}]}},
  {sheet:{inner:true,q:'시식 코너에서 {mg.s|이가} 갑자기 조용해졌다.\n"…형이 이거 좋아했는데."\n누구 얘기인지 묻지 않았다.',o:[
    {l:'"하준 씨?"',fx:{mg:1,mgOuted:true}},{l:'그냥 하나 더 집어준다',fx:{mg:2}}]}},
  {go:'dend'},
  {label:'dhj'},
  {sheet:{inner:true,q:'{hj.s}. 서로 골랐다.\n말이 별로 없는데, 불편하지 않았다.',o:[
    {l:'조용히 걷는다',fx:{hj:2}},{l:'먼저 말을 건다',fx:{hj:1}}]}},
  {sheet:{inner:true,q:'"{mg.s} 씨, 원래 저렇게 시끄러워요?"\n{hj.s} 씨가 물었다. 웃고 있었다.',o:[
    {l:'"하준 씨가 더 잘 알 것 같은데요"',fx:{hj:1,hjOuted:true}},{l:'"좋은 사람 같아요"',fx:{hj:1}}]}},
  {go:'dend'},
  {label:'dso'},
  {sheet:{inner:true,q:'{so.s}. 서로 골랐다.\n"형!! 저 형 고를 줄 알았죠??"',o:[
    {l:'"몰랐어"',fx:{so:1}},{l:'머리를 헝클어준다',fx:{so:2}}]}},
  {label:'dend'},
  {do:()=>{S.time=19*60+30;}},
  {msg:['house','so','오늘 장보기 조 누구누구였어요?? 저만 궁금해요?'],d:1500},
  {msg:['house','ca','{ex.s} 씨는 아무도 안 골랐대요'],d:1800,if:()=>S.flags.dateWith!=='ex'&&S.st.dist<2},
  {do:()=>{ if(S.flags.dateWith!=='ex'&&S.st.dist>=2) S.flags.exPicked1=true; }},
  {sleep:1500},
  ...night('오후 11:30 · 2일차가 끝났다','다들 나이를 알게 됐다.\n아무도 우리가 7년을 만났다는 건 모른다.'),
];

/* =========================================================
   3일차 · X 데이트 / 추억 공간
   ========================================================= */
SCRIPT.d3=[
  {do:()=>dayStart(3,9*60)},
  {msg:['pd','pd','오늘은 X 데이트입니다. 각자의 X와 하루를 보내게 됩니다. 다른 출연자에게는 공개되지 않아요.']},
  {msg:['house','so','오늘 다들 어디 가요??'],d:1800},
  {msg:['house','mg','비밀 ㅋ'],d:1400},
  {msg:['house','mg','아 나 오늘 진짜 쉬고 싶다'],d:1600},
  {sleep:1200},
  {msg:['pd','pd','{me.s}님, 오늘의 장소는 "추억 공간"입니다. 두 분이 함께 살던 집의 물건 일부를 옮겨두었습니다.']},
  {msg:['pd','pd','',{kind:'photo',data:'xroom'}]},
  {wait:()=>S.flags.sawXroom, hint:['제작진이 보낸 추억 공간 사진을 열어봐요.','사진 속 물건을 하나씩 눌러봐요.']},
  {sleep:1500},
  {do:()=>{S.time=13*60;}},
  {sheet:{inner:true,cap:'오후 1:00 · 추억 공간',q:'{ex.s|이가} 먼저 와 있었다.\n커피를 시켜 놨다. 형 건 연하게, 내 건 아직 진하게.',o:[
    {l:'"형 아직 내 거 진하게 시키네"',fx:{dist:1}},{l:'말없이 앉는다',fx:{}}]}},
  {sheet:{inner:true,q:'"편지… 잘 읽었어."',o:[
    {l:'"형 거 좀 건조하더라"',fx:{dist:1,teaseLetter:true}},
    {l:'"마지막 줄. 그거 무슨 뜻이야"',fx:{dist:2,under:1},if:()=>S.flags.reread},
    {l:'"그 얘기 하지 말자"',fx:{dist:-1}}]}},
  {sheet:{inner:true,q:'형이 계속 왼쪽 주머니에 손을 넣었다 뺐다 한다.',o:[
    {l:'"주머니에 뭐 있어?"',fx:{askedPocket:true,under:1}},
    {l:'모른 척한다',fx:{}}]}},
  {if:()=>S.flags.askedPocket,go:'pk'},{go:'pk2'},
  {label:'pk'},{sheet:{inner:true,q:'"…아무것도."\n형이 손을 뺐다. 주머니가 각져 있었다.',o:[{l:'…'}]}},
  {label:'pk2'},
  {sheet:{inner:true,q:'에어컨 바람이 세다.\n"추워? 너 여름에…"\n형이 말하다 멈췄다.',o:[
    {l:'"여름 감기. 알아. 문자 봤어"',fx:{dist:2},if:()=>S.clues.sms},
    {l:'"괜찮아"',fx:{}},
    {l:'"그런 거 이제 신경 쓰지 마"',fx:{dist:-2,coldDate:true}}]}},
  {sheet:{inner:true,q:'헤어지기 전 형이 말했다.\n"…그날 전화. 받았으면 뭐라고 했을 거야?"',o:[
    {l:'"몰라. 지금도 모르겠어"',fx:{dist:1}},
    {l:'"형이 먼저 말해"',fx:{dist:1,under:1}},
    {l:'대답하지 않는다',fx:{dist:-1}}]}},
  {do:()=>{S.time=18*60;}},
  {if:()=>S.st.dist>=3,go:'msgOK'},{go:'afterX'},
  {label:'msgOK'},
  {msg:['ex','ex','오늘 고마웠어.'],d:2600},
  {choice:'ex',o:[
    {l:'나도',fx:{dist:1}},
    {l:'형 컵 아직 갖고 있었네',fx:{dist:2},if:()=>S.clues.mug},
    {l:'읽고 답하지 않기',silent:true,fx:{dist:-1}},
  ]},
  {label:'afterX'},
  {sleep:1500},
  {msg:['mg','mg','우진아']},
  {msg:['mg','mg','오늘 X 데이트 다녀왔어? 난 다녀와서 또 움ㅋㅋㅋ 아니 안 움'],d:2200},
  {choice:'mg',o:[
    {l:'울었네',fx:{mg:2}},
    {l:'괜찮아?',fx:{mg:2,mgSoft:true}},
  ]},
  {msg:['mg','mg','아 근데 이상한 거 봄']},
  {msg:['mg','mg','태오 형 가방 열 때 작은 상자 떨어졌는데'],d:2000},
  {msg:['mg','mg','반지 케이스 같았어. 형이 엄청 빨리 주워서 넣음'],d:2200},
  {do:()=>{addClue('ring');}},
  {choice:'mg',o:[
    {l:'…',fx:{}},
    {l:'다른 사람한테 말하지 마',fx:{mgSus:1,mg:1},go:'secret'},
    {l:'반지? 누구한테 주려고',fx:{},go:'who'},
  ]},
  {msg:['mg','mg','? 왜 말이 없어']},{go:'e3'},
  {label:'secret'},{msg:['mg','mg','…오케이. 근데 너 지금 표정 다 보임 ㅋ']},{go:'e3'},
  {label:'who'},{msg:['mg','mg','그걸 내가 어떻게 알아 ㅋㅋ 근데 형 그거 들고 다니는 듯. 매일']},
  {label:'e3'},
  ...night('오후 11:30 · 3일차가 끝났다','반지.\n그날 종로에 간다고 했던 건.'),
];

/* =========================================================
   4일차 · 메기 입소 + 룸메이트 재배정
   ========================================================= */
SCRIPT.d4=[
  {do:()=>dayStart(4,10*60)},
  {msg:['pd','pd','오늘 새로운 출연자가 들어옵니다.']},
  {sleep:2500},
  {sys:['house','{dy.s}님이 들어왔습니다.']},
  {msg:['house','dy','안녕하세요! {dy}입니다 😊 늦게 와서 죄송해요~']},
  {msg:['house','so','헉 메기다'],d:1300},
  {msg:['house','mg','오 환영합니다 ㅋㅋ'],d:1500},
  {msg:['house','dy','다들 친해 보이셔서 부러워요. 저도 끼워주세요!'],d:2000},
  {sleep:2000},
  {msg:['dy','dy','{me.s} 씨 맞죠? 프로듀서님!']},
  {msg:['dy','dy','혹시 {ex.s} 씨랑 친하세요? 둘이 분위기가 좀 특별해 보여서요 ㅎㅎ'],d:2200},
  {choice:'dy',o:[
    {l:'아뇨. 별로',fx:{dist:-1,dyLie:true}},
    {l:'왜요?',fx:{},go:'why'},
    {l:'오래 알았어요',fx:{dist:1,dyHonest:true},go:'hon'},
  ]},
  {msg:['dy','dy','아 그렇구나 ㅎㅎ 다행이다']},{go:'r'},
  {label:'why'},{msg:['dy','dy','그냥요~ 제 스타일이셔서 ㅎㅎ']},{go:'r'},
  {label:'hon'},{msg:['dy','dy','오래요? 얼마나요?']},{msg:['dy','dy','아 이런 거 물어보면 안 되나 ㅎㅎ 잊어주세요~']},
  {label:'r'},
  {sleep:2000},
  {do:()=>{S.time=13*60;}},
  {msg:['pd','pd','룸메이트가 바뀝니다.\n{ex.s} · {dy.s}\n{me.s} · {mg.s}\n{js.s} · {hj.s}\n{so.s} · {ca.s}\n{cb.s} (1인실)']},
  {msg:['mg','mg','우리 룸메됨 ㅋㅋㅋㅋ'],d:1800},
  {msg:['mg','mg','태오 형 메기랑 같은 방 ㅋㅋ 판 재밌어진다'],d:1800},
  {choice:'mg',o:[
    {l:'재밌긴 뭐가 재밌어',fx:{mgSus:1},go:'mad'},
    {l:'잘 됐네',fx:{dist:-1}},
    {l:'너 하준 씨랑 떨어져서 섭섭한 거 아니고?',fx:{mg:2,hjOuted:true},if:()=>S.side.hjcry||S.side.hjmg},
  ]},
  {msg:['mg','mg','ㅋㅋ 아무튼 오늘 밤 수다 각']},{go:'c'},
  {label:'mad'},{msg:['mg','mg','오… 우진아 너 지금 질투함?']},{msg:['mg','mg','아 알겠어 알겠어 안 물어봄']},
  {label:'c'},
  {sleep:2000},
  {do:()=>{S.time=15*60+30;}},
  {msg:['house','dy','{ex.s} 씨 커피 연하게 드시죠? 제가 탔어요 ☕']},
  {do:()=>addSide('dyTaeo')},
  {msg:['house','so','오~~~~'],d:1200},
  {msg:['house','ca','메기 직진이다'],d:1500},
  {msg:['house','dy','다음엔 견과류 라떼 해드릴게요 ㅎㅎ 고소해서 맛있어요'],d:2000},
  {choice:'house',o:[
    {l:'땅콩 들어간 건 주지 마세요',fx:{dist:2,exposed:true},go:'ex'},
    {l:'아무 말도 하지 않기',silent:true,fx:{sway:1}},
  ]},
  {go:'e'},
  {label:'ex'},
  {do:()=>addClue('allergy')},
  {msg:['house','dy','…네?'],d:1500},
  {msg:['house','so','??'],d:1100},
  {msg:['house','mg','ㅋㅋㅋㅋㅋ 아니 우진이 그걸 어떻게 알아'],d:1500},
  {msg:['house','js','야'],d:1200},
  {msg:['house','ex','알레르기 있어요. 고마워요.'],d:3000},
  {msg:['ex','ex','…땅콩은 왜.'],d:2600},
  {choice:'ex',o:[
    {l:'형 죽을 뻔한 거 내가 봤잖아',fx:{dist:2}},
    {l:'그냥',fx:{dist:1}},
    {l:'읽고 답하지 않기',silent:true,fx:{}},
  ]},
  {label:'e'},
  {sleep:2000},
  {do:()=>{S.time=21*60;}},
  {msg:['mg','mg','룸메 첫날 밤 ㅋㅋ']},
  {msg:['mg','mg','근데 진지하게 물어봐도 돼?'],d:1800},
  {msg:['mg','mg','태오 형이 X지?'],d:2400},
  {choice:'mg',o:[
    {l:'응',fx:{mg:2,toldMg:true,under:1}},
    {l:'아니',fx:{mgSus:1}},
    {l:'너는 하준 씨지?',fx:{mg:2},go:'back'},
  ]},
  {msg:['mg','mg','…그럴 줄 알았어']},{msg:['mg','mg','비밀 지킬게. 대신 나도 하나 말함']},{msg:['mg','mg','나 하준이 형이 X야. 다들 알겠지만 ㅋㅋ']},{do:()=>addSide('hjmg2')},{go:'e4'},
  {label:'back'},{msg:['mg','mg','ㅋㅋㅋㅋ 아 이건 반칙이지']},{msg:['mg','mg','…응. 3년 만났어. 내가 너무 시끄러워서 헤어짐']},
  {label:'e4'},
  ...night('오후 11:30 · 4일차가 끝났다','{dy.s} 씨 방에서 웃음소리가 들렸다.\n형 웃음소리였는지는 모르겠다.'),
];

/* =========================================================
   5일차 · 여행 + 랜덤 데이트 + 술자리
   ========================================================= */
SCRIPT.d5=[
  {do:()=>dayStart(5,9*60+30)},
  {msg:['pd','pd','오늘은 1박 2일 여행입니다. 목적지는 강릉입니다.']},
  {sheet:{inner:true,cap:'오전 9:30',q:'강릉.\n2021년 8월 2일. 둘 다 눈 감고 찍은 사진.',o:[{l:'사진 앱을 열어본다',do:()=>{S.flags.gangneungMemo=true;}},{l:'창밖을 본다'}]}},
  {msg:['house','so','바다다!!!!!'],d:1800},
  {msg:['house','dy','{ex.s} 씨 옆자리 앉아도 돼요? ㅎㅎ'],d:2000},
  {msg:['house','js','버스 단톡 왜 하냐고 ㅋㅋ 다 옆에 있는데'],d:1600},
  {sleep:2500},
  {do:()=>{S.time=13*60;}},
  {msg:['pd','pd','랜덤 데이트: 카드를 한 장 골라주세요. 카드에 적힌 사람과 오후를 보냅니다.']},
  {sheet:{cap:'카드 4장이 엎어져 있다',q:'어떤 카드?',o:[{l:'첫 번째'},{l:'두 번째'},{l:'세 번째'},{l:'네 번째'}]}},
  {sheet:{inner:true,q:'카드 뒷면에 적힌 이름.\n\n{so}',o:[{l:'…막내다'}]}},
  {msg:['so','so','형!!!!! 저예요!!!!!']},
  {msg:['so','so','저 사실 카드 뭐 나올지 기도했어요'],d:1800},
  {choice:'so',o:[
    {l:'누구 나오길?',fx:{so:2}},
    {l:'기도 효과 좋네',fx:{so:1}},
  ]},
  {msg:['so','so','당연히 형이죠 ㅎㅎ']},
  {sheet:{inner:true,cap:'오후 2:00 · 강릉 바다',q:'{so.s|이가} 신발을 벗고 바다로 뛰어들었다.\n"형도 와요!!"',o:[
    {l:'따라 들어간다',fx:{so:2,soSea:true}},{l:'모래사장에서 사진을 찍어준다',fx:{so:1}}]}},
  {sheet:{inner:true,q:'"형. 저 진짜 형 좋아요. 장난 아니고."\n{so.s|이가} 웃지 않고 말했다.',o:[
    {l:'"고마워"',fx:{so:1}},{l:'"나 아직 정리 안 된 사람 있어"',fx:{so:-1,dist:1,honestSo:true}},{l:'"나도 너 좋아"',fx:{so:3,soYes:true}}]}},
  {msg:['house','ca','{ex.s} 씨는 {dy.s} 씨랑 걸렸대요'],d:2000},
  {sleep:2000},
  {do:()=>{S.time=22*60;}},
  {msg:['pd','pd','오늘 밤은 숙소 거실에서 술자리가 있습니다. 문자는 술자리 후에 보내요.']},
  {sheet:{inner:true,cap:'밤 10:00 · 진실게임',q:'병이 돌다가 내 앞에서 멈췄다.\n{dy.s}: "이 중에 X 있어요?"',o:[
    {l:'"있어요"',fx:{dist:1,truthX:true}},{l:'"없어요"',fx:{dist:-1,lieX:true}}]}},
  {sheet:{inner:true,q:'다음은 형 차례였다.\n{dy.s}: "지금 마음에 있는 사람 있어요?"\n\n형이 3초 있다가 말했다.\n"…있어요."',o:[{l:'…',do:()=>addClue('truth')}]}},
  {sheet:{inner:true,q:'{mg.s|이가} 나를 보며 물었다.\n"X랑 다시 만날 생각 있어요?"',o:[
    {l:'"모르겠어요"',fx:{}},{l:'"아니요"',fx:{dist:-2,saidNo:true}},{l:'"…있어요"',fx:{dist:2,under:1,saidYes:true}}]}},
  {sheet:{inner:true,q:'술자리가 끝나고 마당.\n{js.s|이가} 옆에 앉았다.\n"너 오늘 대답, 진짜야?"',o:[
    {l:'"진짜야"',fx:{js:1}},{l:'"몰라. 술 마셨잖아"',fx:{js:2}},{l:'{js.s} 어깨에 기댄다',fx:{js:3,jsLean:true}}]}},
  {do:()=>{S.time=23*60;}},
  {msg:['pd','pd','오늘의 문자를 보내주세요.']},
  {do:()=>{S.flags.smsOpen=true;}},
  {wait:()=>S.sms.sent, hint:['메시지 앱에서 오늘의 문자를 보내요.']},
  {sleep:2500},{do:()=>{S.time=23*60+30;}},{do:()=>receiveSms()},
  {wait:()=>S.sms.inbox.every(m=>m.read), hint:['문자가 왔어요.']},
  {sleep:2000},
  {sheet:{inner:true,cap:'새벽 0:20 · 5일차가 끝났다',q:'"있어요."\n누구를 말한 걸까. 형은.',o:[{l:'폰을 내려놓는다'}]}},
  {do:()=>endDay()},
];

/* =========================================================
   6일차 · 속마음 인터뷰 + 마지막 편지 + 노래
   ========================================================= */
SCRIPT.d6=[
  {do:()=>dayStart(6,10*60)},
  {msg:['pd','pd','오늘은 속마음 인터뷰가 있습니다. 답변은 방송에 그대로 나갑니다.']},
  {sheet:{cap:'인터뷰 · 질문 1',q:'"X에게 아직 감정이 남아 있나요?"',o:[
    {l:'"네."',fx:{dist:2,ivYes:true}},{l:'"모르겠어요. 그게 제일 무서워요."',fx:{dist:1,under:1}},{l:'"아니요. 끝났어요."',fx:{dist:-2,ivNo:true}}]}},
  {sheet:{cap:'인터뷰 · 질문 2',q:'"지금 가장 마음이 가는 사람은?"',o:[
    {l:'{ex.s}',fx:{dist:2,iv2:'ex'}},{l:'{mg.s}',fx:{mg:2,iv2:'mg'}},{l:'{hj.s}',fx:{hj:2,iv2:'hj'}},{l:'{js.s}',fx:{js:2,iv2:'js'}},{l:'{so.s}',fx:{so:2,iv2:'so'}}]}},
  {sheet:{cap:'인터뷰 · 질문 3',q:'"헤어진 이유를 말해줄 수 있나요?"',o:[
    {l:'"결혼 얘기에서 싸웠어요. 제가 싫다고 했어요."',fx:{}},
    {l:'"싫었던 게 아니에요. 다 좋은데, 그게 변할까 봐 무서웠어요. 결혼하고 나서 형이 날 안 좋아하면… 그땐 어디로 돌아가요."',fx:{under:2,dist:1},do:()=>addClue('interview'),if:()=>S.clues.memo},
    {l:'"말하고 싶지 않아요."',fx:{dist:-1}}]}},
  {sleep:1500},
  {do:()=>{S.time=15*60;}},
  {msg:['pd','pd','마지막 편지를 한 사람에게 쓸 수 있습니다. 내일 최종 선택 전에 전달됩니다.']},
  {choice:'pd',o:[
    {l:'{ex}에게',fx:{letterTo:'ex',dist:2}},{l:'{mg}에게',fx:{letterTo:'mg',mg:2}},{l:'{hj}에게',fx:{letterTo:'hj',hj:2}},{l:'{js}에게',fx:{letterTo:'js',js:2}},{l:'{so}에게',fx:{letterTo:'so',so:2}},
  ]},
  {sheet:{inner:true,cap:'편지 대신',q:'편지를 쓰려다 메모를 열었다.\n2절을 끝내야겠다.',o:[{l:'메모를 연다',do:()=>{S.flags.memo6Open=true;}}]}},
  {wait:()=>S.flags.songDone, hint:['메모 앱 가사 폴더에서 2절을 끝내요.']},
  {sleep:1500},
  {do:()=>{S.time=19*60;}},
  {msg:['house','so','내일이 마지막이라니 ㅠㅠㅠ'],d:1500},
  {msg:['house','mg','울지 마라 시온아'],d:1400},
  {msg:['house','js','니가 제일 많이 울 듯'],d:1300},
  {msg:['house','mg','…인정'],d:2200},
  {if:()=>S.st.dist>=5,go:'tx'},{go:'n6'},
  {label:'tx'},
  {msg:['ex','ex','내일 할 말 있어.'],d:2800},
  {choice:'ex',o:[
    {l:'나도',fx:{dist:2,bothTalk:true}},
    {l:'지금 해',fx:{dist:1}},
    {l:'읽고 답하지 않기',silent:true,fx:{}},
  ]},
  {label:'n6'},
  ...night('오후 11:30 · 6일차가 끝났다','내일이 마지막.\n가사는 끝냈다. 말은 아직이다.'),
];

/* =========================================================
   7일차 · 최종 선택
   ========================================================= */
SCRIPT.d7=[
  {do:()=>dayStart(7,9*60)},
  {msg:['pd','pd','오늘은 최종 선택의 날입니다. 오후 6시까지 한 사람을 골라주세요. 서로를 고르면 함께 나갑니다.']},
  {if:()=>S.st.under>=6,go:'reveal'},{go:'pick'},
  {label:'reveal'},
  {sleep:3000},
  {msg:['ex','ex','5월 9일에 보내려다 지운 거.'],d:3000},
  {msg:['ex','ex','결혼 안 해도 돼. 그러니까'],d:2600},
  {msg:['ex','ex','그러니까 가지 마. 그 말 하려고 했어.'],d:3200},
  {do:()=>addClue('deleted')},
  {choice:'ex',o:[
    {l:'왜 안 보냈어',fx:{dist:1}},
    {l:'반지는',fx:{dist:2},if:()=>S.clues.ring},
    {l:'…',fx:{}},
  ]},
  {msg:['ex','ex','이따 말할게.']},
  {label:'pick'},
  {sleep:2000},
  {do:()=>{S.time=17*60;}},
  {msg:['pd','pd','최종 선택을 해주세요.']},
  {choice:'pd',o:[
    {l:'{ex}',fx:{final:'ex'}},{l:'{mg}',fx:{final:'mg'}},{l:'{hj}',fx:{final:'hj'}},{l:'{js}',fx:{final:'js'}},{l:'{so}',fx:{final:'so'}},
  ]},
  {sheet:{inner:true,cap:'오후 6:00',q:'모두 거실에 모였다.\n한 사람씩 문자를 확인한다.',o:[{l:'폰을 켠다'}]}},
  {do:()=>finalResult()},
  {wait:()=>S.sms.inbox.every(m=>m.read), hint:['최종 선택 결과가 문자로 왔어요.']},
  {sleep:2500},
  {do:()=>showEnding()},
];

/* ---------- 최종 결과 ---------- */
function finalPicks(){
  const st=S.st, me=S.flags.final;
  const reunion = st.under>=7 && st.dist>=6;
  const top=['mg','hj','js','so'].sort((a,b)=>st[b]-st[a])[0];
  const p={};
  p.ex = reunion?'me':null;
  p.mg = (st.mg>=10 && top==='mg') ? 'me' : null;
  p.hj = (st.hj>=7 && top==='hj') ? 'me' : null;
  p.js = (st.js>=9 && top==='js') ? 'me' : 'ca';
  p.so = (st.so>=7 && top==='so') ? 'me' : null;
  p.dy = 'ex'; p.ca = p.js==='ca'?'js':null; p.cb=null;
  const good = p[me]==='me';
  if(me==='ex'&&good){ p.mg='hj'; p.hj='mg'; }
  return {p,good,me};
}
function finalResult(){
  const r=finalPicks(); S.final=r; save();
  const who=r.me;
  if(r.good) S.sms.inbox=[{id:'f',from:who,x:FINAL_MSG[who].good,n:1,read:false,reveal:true,tm:fmtK(S.time)}];
  else S.sms.inbox=[{id:'f',from:'pd',x:'선택한 사람이 다른 선택을 했습니다.',n:1,read:false,reveal:true,tm:fmtK(S.time)}];
  notifyRaw('sms','메시지','최종 선택 결과','지금'); render();
}
window.FINAL_MSG={
  ex:{good:'나도 너.'}, mg:{good:'야 나도 너 골랐어 ㅋㅋㅋ 울지 마라'}, hj:{good:'같이 나가요. 천천히 가요.'},
  js:{good:'친구야. 나도 너다'}, so:{good:'형!!!!!! 저도요!!!!!'},
};
window.ENDINGS = {
  ex_good:{t:'재회 · 그러니까',x:'거실 한가운데서 형이 왼쪽 주머니에 손을 넣었다.\n작은 상자. 열지는 않았다.\n\n"지금 받으라는 거 아니야. 결혼 안 해도 돼.\n네가 무서울 때마다 꺼내 보라고. 내가 아직 여기 있다는 거."\n\n나는 상자를 받아서 내 주머니에 넣었다.\n그날 밤 {mg.s}와 {hj.s}도 같이 나갔다.\n\n그리고 2절 마지막 줄을 고쳤다.'},
  ex_bad:{t:'재회 · 주머니',x:'오해는 다 풀렸다. 종로도, D-17도, 그 새벽 전화도.\n\n형은 아무도 고르지 않았다.\n"너 무서운 거, 이제 알아서. 이번엔 내가 기다릴게."\n\n반지는 끝까지 형 주머니에 있었다.\n나는 혼자 문을 나섰다. 알람은 아직 6시 50분이다.'},
  mg_good:{t:'{mg.s} · 시끄러운 사랑',x:'"야 우리 첫날 단톡에서 싸운 거 기억나?"\n\n차에 타자마자 {mg.s|이가} 떠들기 시작했다.\n울다가 웃다가, 휴지 한 통을 다 썼다.\n\n조용한 걸 좋아했던 사람은 이 시끄러움을 못 견뎠다는데,\n나는 이 시끄러움이 좋았다.'},
  mg_bad:{t:'{mg.s} · 아무도',x:'{mg.s}는 아무도 고르지 않았다.\n\n"미안. 너 좋아. 진짜로. 근데 아직 나 정리가 안 됐어."\n{hj.s} 씨에게도 가지 않았다.\n\n마지막 날 밤, 화장실 앞에 휴지를 한 통 두고 나왔다.'},
  tr_good:{t:'환승 · 새로운 사람',x:'{p.s|과} 같이 문을 나섰다.\n\n뒤에서 누군가 나를 보는 게 느껴졌지만 돌아보지 않았다.\n7년은 7년대로 두기로 했다.\n\n휴대폰을 켜고, 6시 50분 알람을 지웠다.'},
  tr_bad:{t:'환승 · 혼자',x:'{p.s|은는} 다른 선택을 했다.\n\n이상하게 서운하지 않았다.\n모두가 누군가와 나가는 동안, 나는 혼자 캐리어를 끌었다.\n\n처음으로, 누구의 무엇도 아닌 채로.'},
};
function endingId(){ const r=S.final; if(!r) return null; const k=r.me==='ex'?'ex':r.me==='mg'?'mg':'tr'; return k+'_'+(r.good?'good':'bad'); }
function showEnding(){
  const id=endingId(); const E=ENDINGS[id]; S.ending=id; S.ended=true;
  let col={}; try{ col=JSON.parse(localStorage.getItem('hslog_endings')||'{}'); }catch(e){}
  col[id]=1; try{ localStorage.setItem('hslog_endings',JSON.stringify(col)); }catch(e){}
  save();
  const p=CAST[S.final.me];
  const txt=E.x.replace(/\{p\.s(\|[^}]+)?\}/g,(m,j)=>j?p.s+josa(p.s,j.slice(1)):p.s);
  const d=document.createElement('div'); d.id='ending';
  d.innerHTML=`<div class="eb"><small>엔딩 ${Object.keys(col).length} / 6</small><h2>${esc(T(E.t).replace(/\{p\.s\}/g,p.s))}</h2><p>${esc(T(txt))}</p>
    ${S.notes.title?`<div class="song"><b>${esc(S.notes.title)}</b>${esc((S.notes.lines||[]).slice(-1)[0]||'')}</div>`:''}
    <button data-e="tw">시청자 반응 보기</button><button data-e="again" class="ghost">처음부터 다시</button></div>`;
  d.onclick=e=>{ const b=e.target.closest('button'); if(!b) return; if(b.dataset.e==='tw'){ d.remove(); openTw(false); } else { d.remove(); const n=S.name,pp=S.pin; S=freshState(n,pp); save(); bootGame(true); } };
  $('#screen').appendChild(d);
}
