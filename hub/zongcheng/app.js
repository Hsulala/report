(function(){
'use strict';
var doc=document,root=doc.documentElement;
root.classList.add('js');
var slides=[].slice.call(doc.querySelectorAll('.slide'));
var N=slides.length,cur=0;
var mq=window.matchMedia('(min-width:900px)');
var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var ring=doc.getElementById('ring'),menu=doc.getElementById('menu'),modal=doc.getElementById('srcModal');
var C=2*Math.PI*22;
var pg=ring.querySelector('.pg'),num=ring.querySelector('b');
pg.style.strokeDasharray=C;
function isDeck(){return mq.matches}
function setRing(frac){pg.style.strokeDashoffset=C*(1-Math.max(0,Math.min(1,frac)));num.textContent=cur+1}

/* ---------- 資料來源 ---------- */
var SOURCES=[
['SRC-001','總誠高空車官網（服務、據點、品牌）','zong-cheng.com.tw；2026/11/16 查閱','3'],
['SRC-002','Ahrefs 概述、關鍵字、反向連結、AI 響應','台灣；2026/11/16；第三方估算值，與 Google Ads 數字可能不同','3、6、12'],
['SRC-003','Google Ads Keyword Planner 關鍵字搜尋量、競爭程度與頁首出價','台灣、繁體中文、Google 搜尋；Google 提供的過去 12 個月平均；2026/11/16；以種子關鍵字加總誠官網查詢，地區字同日另查；Google 未回傳者標示「尚未取得」，不等於 0','4、7、8、9、14、19'],
['SRC-004','Google 搜尋「高空作業車推薦」第一頁觀察','2026/11/16 單次觀察；結果會因地區與個人化而不同','6'],
['SRC-005','宏展高空車成效頁（瑪卡鎷客戶成效）','Google Search Console；累積期間 2025/7/5～2026/11/4；月趨勢僅含完整月份至 2026/10；2026/5～8 曝光為來源頁以「萬」為單位的四捨五入值；資料更新 2026/11/7；已取得公開同意','12、16'],
['SRC-006','汯旭貿易 Search Console 匯出','hongxu1688.com.tw；網頁搜尋；2026/1/16～2026/11/13；月趨勢取完整月份 2026/3～10；11 月未滿月不納入；已取得公開同意','13、17、18'],
['SRC-007','汯旭貿易官網文章（種類、證照）','hongxu1688.com.tw/blog/awptype、/blog/mewpcertificate；2026/11/16 閱讀；文章頁未顯示發佈日期','18'],
['SRC-008','合作方案、價格與付款方式','瑪卡鎷網路行銷確認；價格皆為未稅；付款期數以雙方合約為準','19、20'],
['說明','案例為個別客戶的歷史表現','曝光與點擊不是人數、詢問或訂單；成果受季節、內容上線時間與其他行銷影響，個別成果不代表總誠可獲得相同結果，也不保證排名、AI 引用、詢問或成交','16、17、18'],
['說明','試算為情境假設','進站比例、詢問比例、成交比例與客單價為示範輸入值，不是預估或承諾；搜尋量為各字月平均加總，相近字可能由同一人搜尋，會高估不重複人數','19']
];
(function(){
  var h='<button class="x" type="button" data-close>關閉</button><h3>資料來源</h3><p class="note" style="margin-top:0">只列出本提案使用的來源、日期、口徑與對應頁碼。</p><div class="table-wrap"><table><tr><th>編號</th><th>內容</th><th>來源、日期與口徑</th><th>頁碼</th></tr>';
  SOURCES.forEach(function(s){h+='<tr><td>'+s[0]+'</td><td>'+s[1]+'</td><td>'+s[2]+'</td><td>'+s[3]+'</td></tr>'});
  h+='</table></div>';
  modal.querySelector('.src-box').innerHTML=h;
})();

/* ---------- 目錄 ---------- */
var menuOpen=false,lastFocus=null;
(function(){
  var h='',last='';
  slides.forEach(function(s,i){
    var ch=s.getAttribute('data-ch');
    if(ch!==last){h+='<h4>'+ch+'</h4>';last=ch}
    h+='<button type="button" class="item" data-go="'+i+'"><i>'+(i+1)+'</i><span>'+s.getAttribute('data-title')+'</span></button>';
  });
  h+='<div class="foot"><div class="row"><button type="button" data-prev>上一頁</button><button type="button" data-next>下一頁</button></div><button type="button" class="src" data-src>資料來源</button><div class="hintk">鍵盤：左右鍵換頁；上下鍵、Page Up／Page Down 先閱讀頁內內容。</div></div>';
  menu.innerHTML=h;
})();
function markMenu(){[].forEach.call(menu.querySelectorAll('.item'),function(b,i){b.setAttribute('aria-current',i===cur?'true':'false')})}
function openMenu(o){
  menuOpen=o;menu.classList.toggle('open',o);ring.setAttribute('aria-expanded',o?'true':'false');
  if(o){markMenu();var c=menu.querySelector('[aria-current="true"]');if(c)c.scrollIntoView({block:'center'});}
}
function openSrc(o){
  if(o){lastFocus=doc.activeElement;modal.classList.add('open');modal.querySelector('.x').focus()}
  else{modal.classList.remove('open');if(lastFocus)lastFocus.focus()}
}
ring.addEventListener('click',function(){openMenu(!menuOpen)});
menu.addEventListener('click',function(e){
  var t=e.target.closest('button');if(!t)return;
  if(t.hasAttribute('data-go')){show(+t.getAttribute('data-go'));openMenu(false)}
  else if(t.hasAttribute('data-prev'))show(cur-1);
  else if(t.hasAttribute('data-next'))show(cur+1);
  else if(t.hasAttribute('data-src')){openMenu(false);openSrc(true)}
  markMenu();
});
modal.addEventListener('click',function(e){if(e.target===modal||e.target.hasAttribute('data-close'))openSrc(false)});
doc.addEventListener('click',function(e){if(menuOpen&&!menu.contains(e.target)&&!ring.contains(e.target))openMenu(false)});

/* ---------- 換頁 ---------- */
function reveal(scope){
  [].forEach.call(scope.querySelectorAll('[data-reveal]'),function(el){
    if(el.classList.contains('in'))return;
    if(reduce){el.classList.add('in');return}
    if('IntersectionObserver' in window){io.observe(el)}else el.classList.add('in');
  });
}
var io=('IntersectionObserver' in window)?new IntersectionObserver(function(es){
  es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}});
},{threshold:.25}):null;
function show(i,noHash){
  i=Math.max(0,Math.min(N-1,i));
  cur=i;
  if(isDeck()){
    slides.forEach(function(s,k){s.classList.toggle('active',k===i)});
    slides[i].scrollTop=0;
    setRing(N>1?i/(N-1):1);
    reveal(slides[i]);
    slides[i].focus({preventScroll:true});
  }else{
    slides[i].scrollIntoView();
    setRing(progressMobile());
  }
  markMenu();
  if(!noHash){try{history.replaceState(null,'','#p'+(i+1))}catch(e){}}
}
function progressMobile(){var h=root;var m=h.scrollHeight-h.clientHeight;return m>0?h.scrollTop/m:0}
function applyMode(){
  doc.body.classList.toggle('deck-mode',isDeck());
  if(isDeck()){show(cur,true)}
  else{slides.forEach(function(s){s.classList.remove('active')});reveal(doc);setRing(progressMobile())}
}
if(mq.addEventListener)mq.addEventListener('change',applyMode);else mq.addListener(applyMode);

/* 手機：以視窗中線判斷目前頁、進度 */
if('IntersectionObserver' in window){
  var mid=new IntersectionObserver(function(es){
    if(isDeck())return;
    es.forEach(function(e){if(e.isIntersecting){cur=slides.indexOf(e.target);setRing(progressMobile());markMenu()}});
  },{rootMargin:'-45% 0px -50% 0px'});
  slides.forEach(function(s){mid.observe(s)});
}
var ticking=false;
window.addEventListener('scroll',function(){
  if(isDeck()||ticking)return;ticking=true;
  requestAnimationFrame(function(){setRing(progressMobile());ticking=false});
},{passive:true});

/* ---------- 鍵盤與滾輪（桌機） ---------- */
function atBottom(s){return s.scrollTop+s.clientHeight>=s.scrollHeight-3}
function atTop(s){return s.scrollTop<=0}
doc.addEventListener('keydown',function(e){
  if(e.key==='Escape'){if(modal.classList.contains('open'))openSrc(false);else if(menuOpen){openMenu(false);ring.focus()}return}
  if(!isDeck()||menuOpen||modal.classList.contains('open'))return;
  var s=slides[cur],k=e.key;
  if(k==='ArrowRight'){e.preventDefault();show(cur+1)}
  else if(k==='ArrowLeft'){e.preventDefault();show(cur-1)}
  else if(k==='ArrowDown'||k==='PageDown'||(k===' '&&!e.shiftKey&&e.target===doc.body)){
    e.preventDefault();
    if(atBottom(s)){if(!e.repeat)show(cur+1)}else s.scrollBy({top:k==='ArrowDown'?90:s.clientHeight*.85,behavior:reduce?'auto':'smooth'});
  }else if(k==='ArrowUp'||k==='PageUp'){
    e.preventDefault();
    if(atTop(s)){if(!e.repeat)show(cur-1)}else s.scrollBy({top:k==='ArrowUp'?-90:-s.clientHeight*.85,behavior:reduce?'auto':'smooth'});
  }else if(k==='Home'){e.preventDefault();show(0)}
  else if(k==='End'){e.preventDefault();show(N-1)}
});
/* 滾輪：捲到頁尾的那一下不翻頁，要停一下、再捲一次才換頁（避免用力捲過頭） */
var acc=0,lastW=0,flip=0,gestureEdge=false,needNew=false,hintT=0;
var hint=doc.createElement('div');hint.className='edge-hint';hint.setAttribute('aria-hidden','true');doc.body.appendChild(hint);
function showHint(t){hint.textContent=t;hint.classList.add('show');clearTimeout(hintT);hintT=setTimeout(function(){hint.classList.remove('show')},1600)}
doc.addEventListener('wheel',function(e){
  if(!isDeck()||menuOpen||modal.classList.contains('open'))return;
  var s=slides[cur],now=Date.now(),down=e.deltaY>0;
  if(now-lastW>220){acc=0;needNew=false;gestureEdge=down?atBottom(s):atTop(s)}  /* 新的一次捲動：記下起點是否已在頁尾／頁首 */
  lastW=now;
  var atEdge=down?atBottom(s):atTop(s);
  if(!atEdge){acc=0;return}
  if(!gestureEdge||needNew){                                  /* 這次捲動是中途才碰到邊緣（含慣性），不翻頁 */
    if(!needNew&&s.scrollHeight>s.clientHeight+4)showHint(down?'已到頁尾，再往下捲一次進入下一頁':'已到頁首，再往上捲一次回上一頁');
    return;
  }
  acc+=e.deltaY;
  if(Math.abs(acc)>200&&now-flip>800){flip=now;acc=0;needNew=true;show(cur+(down?1:-1))}
},{passive:true});
[].forEach.call(doc.querySelectorAll('[data-next]'),function(b){});
doc.addEventListener('click',function(e){
  var t=e.target.closest('[data-goto]');
  if(t&&!menu.contains(t)){e.preventDefault();show(+t.getAttribute('data-goto')-1)}
});

/* ---------- 頁籤 ---------- */
[].forEach.call(doc.querySelectorAll('[data-tabs]'),function(box){
  var tabs=[].slice.call(box.querySelectorAll('.tab')),panels=[].slice.call(box.querySelectorAll('.panel'));
  function sel(t,focus){
    tabs.forEach(function(x){x.setAttribute('aria-selected',x===t?'true':'false');x.tabIndex=x===t?0:-1});
    panels.forEach(function(p){p.classList.toggle('active',p.getAttribute('data-p')===t.getAttribute('data-t'))});
    if(focus)t.focus();
  }
  tabs.forEach(function(t,i){
    t.addEventListener('click',function(){sel(t)});
    t.addEventListener('keydown',function(e){
      var n=-1;
      if(e.key==='ArrowRight'||e.key==='ArrowDown')n=(i+1)%tabs.length;
      else if(e.key==='ArrowLeft'||e.key==='ArrowUp')n=(i+tabs.length-1)%tabs.length;
      if(n>=0){e.preventDefault();e.stopPropagation();sel(tabs[n],true)}
    });
  });
  var f=tabs.filter(function(t){return t.getAttribute('aria-selected')==='true'})[0]||tabs[0];sel(f);
});

/* ---------- 方案選擇（預設不選任何方案） ---------- */
(function(){
  var cards=[].slice.call(doc.querySelectorAll('[data-plan]')),bodies=[].slice.call(doc.querySelectorAll('[data-pp]')),empty=doc.querySelector('.plan-empty');
  function pick(c){
    var k=c.getAttribute('data-plan'),was=c.classList.contains('selected');
    cards.forEach(function(x){x.classList.remove('selected');x.setAttribute('aria-pressed','false')});
    bodies.forEach(function(b){b.classList.remove('show')});
    if(!was){c.classList.add('selected');c.setAttribute('aria-pressed','true');
      bodies.forEach(function(b){if(b.getAttribute('data-pp')===k)b.classList.add('show')});}
    if(empty)empty.classList.toggle('hide',!was?true:false);
  }
  cards.forEach(function(c){
    c.addEventListener('click',function(){pick(c)});
    c.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();pick(c)}});
  });
})();

/* ---------- 長條圖 ---------- */
[].forEach.call(doc.querySelectorAll('.bars'),function(b){
  var rows=[].slice.call(b.querySelectorAll('.brow')),mx=0;
  rows.forEach(function(r){mx=Math.max(mx,+r.getAttribute('data-v'))});
  rows.forEach(function(r){
    var v=+r.getAttribute('data-v');
    r.innerHTML='<span>'+r.getAttribute('data-l')+'</span><span class="bt"><span class="bfill" style="width:'+(v/mx*100).toFixed(1)+'%"></span></span><b>'+(r.getAttribute('data-t')||v.toLocaleString('en-US'))+'</b>';
  });
});

/* ---------- 案例雙曲線 ---------- */
var CASES={
macro:{
  labels:['25/08','25/09','25/10','25/11','25/12','26/01','26/02','26/03','26/04','26/05','26/06','26/07','26/08','26/09','26/10'],
  clicks:[79,75,77,134,106,143,102,156,181,244,485,959,1116,1192,1241],
  imps:[3513,4213,4858,6573,4862,5566,3837,5819,6664,10000,17000,32000,37000,36395,40145],
  approx:[9,10,11,12],mark:7,markText:'2026/3/26 新網站與首批文章上線',
  cn:'每月自然搜尋點擊',in_:'每月搜尋曝光'
},
hx:{
  labels:['26/03','26/04','26/05','26/06','26/07','26/08','26/09','26/10'],
  clicks:[51,64,96,147,202,203,256,348],
  imps:[378,964,2305,4994,7257,7612,9757,15018],
  approx:[],mark:0,markText:'2026 年 3 月首批文章上線',
  cn:'每月自然搜尋點擊',in_:'每月搜尋曝光'
}};
function nice(m){var p=Math.pow(10,Math.floor(Math.log10(m))),f=m/p;var n=f<=1?1:f<=2?2:f<=2.5?2.5:f<=5?5:10;return n*p}
function fmt(n){return n.toLocaleString('en-US')}
function buildDual(el){
  var d=CASES[el.getAttribute('data-chart')];if(!d)return;
  var W=760,H=300,L=54,R=62,T=18,B=34,n=d.labels.length,iw=W-L-R,ih=H-T-B;
  var mc=nice(Math.max.apply(null,d.clicks)),mi=nice(Math.max.apply(null,d.imps));
  function x(i){return L+(n>1?i*iw/(n-1):iw/2)}
  function yc(v){return T+ih-v/mc*ih}
  function yi(v){return T+ih-v/mi*ih}
  var s='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+d.cn+'與'+d.in_+'折線圖">';
  for(var g=0;g<=4;g++){
    var gy=T+ih-g*ih/4;
    s+='<line class="gl" x1="'+L+'" x2="'+(W-R)+'" y1="'+gy+'" y2="'+gy+'"/>';
    s+='<text x="'+(L-8)+'" y="'+(gy+4)+'" text-anchor="end" fill="#217dbb">'+fmt(Math.round(mc*g/4))+'</text>';
    s+='<text x="'+(W-R+8)+'" y="'+(gy+4)+'" fill="#b86300">'+fmt(Math.round(mi*g/4))+'</text>';
  }
  var step=n>10?2:1;
  d.labels.forEach(function(l,i){if(i%step===0||i===n-1)s+='<text x="'+x(i)+'" y="'+(H-10)+'" text-anchor="middle">'+l+'</text>'});
  s+='<line class="sl" id="sl" x1="0" x2="0" y1="'+T+'" y2="'+(T+ih)+'" style="display:none"/>';
  var pc=d.clicks.map(function(v,i){return (i?'L':'M')+x(i).toFixed(1)+' '+yc(v).toFixed(1)}).join(' ');
  var pi=d.imps.map(function(v,i){return (i?'L':'M')+x(i).toFixed(1)+' '+yi(v).toFixed(1)}).join(' ');
  s+='<path class="line l-i" pathLength="1" d="'+pi+'"/><path class="line l-c" pathLength="1" d="'+pc+'"/>';
  d.labels.forEach(function(l,i){
    s+='<circle class="pt pi" data-i="'+i+'" cx="'+x(i)+'" cy="'+yi(d.imps[i])+'" r="4"/>';
    s+='<circle class="pt pc" data-i="'+i+'" cx="'+x(i)+'" cy="'+yc(d.clicks[i])+'" r="4.5"/>';
  });
  s+='<text x="'+L+'" y="10" fill="#217dbb" font-weight="700">左軸：點擊</text><text x="'+(W-R)+'" y="10" text-anchor="end" fill="#b86300" font-weight="700">右軸：曝光</text>';
  s+='</svg>';
  var mon='<div class="months" role="group" aria-label="選擇月份">';
  d.labels.forEach(function(l,i){mon+='<button type="button" data-i="'+i+'" aria-pressed="false">20'+l.replace('/','/')+'</button>'});
  mon+='</div>';
  var tb='<details class="more"><summary>展開完整逐月數據</summary><div class="table-wrap"><table class="sm"><tr><th>月份</th><th class="num">自然點擊</th><th class="num">搜尋曝光</th></tr>';
  d.labels.forEach(function(l,i){var ap=d.approx.indexOf(i)>=0;tb+='<tr><td>20'+l+'</td><td class="num">'+fmt(d.clicks[i])+'</td><td class="num">'+(ap?'約 ':'')+fmt(d.imps[i])+'</td></tr>'});
  tb+='</table></div>'+(d.approx.length?'<p class="note">標示「約」的月份，來源頁以「萬」為單位四捨五入顯示，故為近似值。</p>':'')+'</details>';
  el.innerHTML='<div class="readout" aria-live="polite"></div>'+s+mon+'<div class="legend"><span><i style="background:#217dbb"></i>每月自然搜尋點擊</span><span><i style="background:#f28c1b"></i>每月搜尋曝光</span></div><p class="note" style="margin-top:6px">兩條線使用不同刻度（左軸點擊、右軸曝光），線的高低不能直接比較數量；請看各自的上升趨勢。只含完整月份。</p>'+tb;
  var ro=el.querySelector('.readout'),pts=el.querySelectorAll('.pt'),btns=el.querySelectorAll('.months button'),sl=el.querySelector('#sl');
  function sel(i){
    var ap=d.approx.indexOf(i)>=0;
    ro.innerHTML='<small>20'+d.labels[i]+'</small><b class="ck">'+fmt(d.clicks[i])+' <small>次點擊</small></b><b class="im">'+(ap?'約 ':'')+fmt(d.imps[i])+' <small>次曝光</small></b>'+(i===d.mark?'<small>'+d.markText+'</small>':'');
    [].forEach.call(pts,function(p){p.classList.toggle('sel',+p.getAttribute('data-i')===i)});
    [].forEach.call(btns,function(b){b.setAttribute('aria-pressed',+b.getAttribute('data-i')===i?'true':'false')});
    sl.setAttribute('x1',x(i));sl.setAttribute('x2',x(i));sl.style.display='';
  }
  [].forEach.call(pts,function(p){p.addEventListener('click',function(){sel(+p.getAttribute('data-i'))})});
  [].forEach.call(btns,function(b){b.addEventListener('click',function(){sel(+b.getAttribute('data-i'))})});
  sel(n-1);
}
[].forEach.call(doc.querySelectorAll('[data-chart]'),buildDual);

/* ---------- 效益試算 ---------- */
[].forEach.call(doc.querySelectorAll('[data-roi]'),function(box){
  function q(s){return box.querySelector(s)}
  function fmt(n,d){return n.toLocaleString('en-US',{maximumFractionDigits:d||0,minimumFractionDigits:d||0})}
  function out(k,v){q('[data-o="'+k+'"]').textContent=v}
  function calc(){
    var vol=0;[].forEach.call(box.querySelectorAll('[data-g]'),function(c){if(c.checked)vol+=+c.getAttribute('data-g')});
    var r1=+q('[data-r="rate1"]').value,r2=+q('[data-r="rate2"]').value,r3=+q('[data-r="rate3"]').value;
    var price=Math.max(0,+q('[data-price]').value||0);
    out('rate1',r1+'%');out('rate2',r2+'%');out('rate3',r3+'%');
    var visit=vol*r1/100,inq=visit*r2/100,deal=inq*r3/100,rev=deal*price;
    out('vol',fmt(vol));out('visit',fmt(visit));out('inq',fmt(inq,1));out('deal',fmt(deal,2));
    out('rev',price?'約 NT$ '+fmt(Math.round(rev/100)*100):'請輸入客單價');
    [].forEach.call(box.querySelectorAll('[data-cost]'),function(tr){
      var need=price?(+tr.getAttribute('data-cost'))/price:0;
      tr.querySelector('[data-c="d"]').textContent=price?'約 '+fmt(need,need<10?2:1)+' 單':'—';
      tr.querySelector('[data-c="i"]').textContent=price&&r3?'約 '+fmt(need/(r3/100),1)+' 件':'—';
    });
  }
  box.addEventListener('input',calc);box.addEventListener('change',calc);
  [].forEach.call(box.querySelectorAll('[data-set]'),function(b){b.addEventListener('click',function(){q('[data-r="rate1"]').value=b.getAttribute('data-set');calc()})});
  calc();
});

/* ---------- 啟動 ---------- */
var m=/^#p(\d+)$/.exec(location.hash);
if(m)cur=Math.max(0,Math.min(N-1,+m[1]-1));
applyMode();
if(!isDeck()){reveal(doc);if(m)slides[cur].scrollIntoView()}
setTimeout(function(){[].forEach.call(doc.querySelectorAll('[data-reveal]'),function(el){if(isDeck()&&!slides[cur].contains(el))return;el.classList.add('in')})},2500);
window.addEventListener('hashchange',function(){var h=/^#p(\d+)$/.exec(location.hash);if(h)show(+h[1]-1,true)});
})();
