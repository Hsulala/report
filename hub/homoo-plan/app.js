(function(){
  var panels=[].slice.call(document.querySelectorAll('.panel')),cur=0;
  var chips=document.getElementById('chips'),fp=document.getElementById('fnavPanel'),f=document.getElementById('fnav'),fb=document.getElementById('fnavBtn');
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  panels.forEach(function(p,i){
    var t=p.dataset.title,b=document.createElement('button');b.type='button';b.className='chip';b.innerHTML='<i>'+(i+1)+'</i>'+esc(t);b.onclick=function(){go(i)};chips.appendChild(b);
    var m=document.createElement('button');m.type='button';m.textContent=(i+1)+'　'+t;m.onclick=function(){go(i);close()};fp.appendChild(m)});
  function go(i){
    cur=Math.max(0,Math.min(panels.length-1,i));
    panels[cur].scrollIntoView();
    history.replaceState(null,'','#p'+(cur+1));
  }
  function close(){f.classList.remove('open');fb.setAttribute('aria-expanded','false')}
  fb.onclick=function(){var o=f.classList.toggle('open');fb.setAttribute('aria-expanded',o?'true':'false')};
  document.addEventListener('click',function(e){if(!f.contains(e.target))close()});
  addEventListener('keydown',function(e){
    if(e.key==='Escape')close();
    if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA')return;
    });
  [].forEach.call(document.querySelectorAll('.faq button'),function(b){b.onclick=function(){var q=b.parentElement;q.classList.toggle('open');b.lastChild.textContent=q.classList.contains('open')?'－':'＋'}});

  /* keyword market */
  var KW=window.KW_DATA||[],M=window.KW_META||{},cats=['家庭餐桌','節慶送禮','教育合作'],tagc={'家庭餐桌':'t-a','節慶送禮':'t-b','教育合作':'t-c'},catNow=cats[0];
  var maxv=Math.max.apply(null,KW.map(function(k){return k.vol}));
  function fmt(n){return n.toLocaleString('en-US')}
  document.getElementById('kwMeta').innerHTML=['資料來源：'+M.source,'地區／語言：'+M.geo+'、'+M.lang,'聯播網：'+M.network,'搜尋量期間：'+M.period,'查詢日期：'+M.queried].map(function(s){return '<span class="pill">'+esc(s)+'</span>'}).join('');
  function drawKw(){
    document.getElementById('catCards').innerHTML=cats.map(function(c){
      var rows=KW.filter(function(k){return k.cat===c}),sum=rows.reduce(function(a,k){return a+k.vol},0);
      return '<button type="button" class="catcard'+(c===catNow?' on':'')+'" data-c="'+c+'"><small>'+c+'</small><b>'+fmt(sum)+'</b><span>合計月搜尋量　·　'+rows.length+' 組已查詢</span></button>'}).join('');
    [].forEach.call(document.querySelectorAll('.catcard'),function(b){b.onclick=function(){catNow=b.dataset.c;drawKw()}});
    var rows=KW.filter(function(k){return k.cat===catNow}).sort(function(a,b){return b.vol-a.vol});
    document.getElementById('kwTable').innerHTML='<tr><th>關鍵字</th><th>平均月搜尋量</th><th>廣告競爭</th><th>頁首出價（低～高）</th><th>搜尋意圖</th><th>建議內容方向</th><th>◆</th></tr>'+rows.map(function(k){
      return '<tr><td class="n">'+esc(k.keyword)+(k.chk?'<small class="chk">待確認有無商品</small>':'')+'</td><td><div class="volbar"><i style="width:'+Math.max(2,Math.round(k.vol/maxv*120))+'px"></i><b>'+fmt(k.vol)+'</b></div></td><td>'+esc(k.comp)+'</td><td>'+esc(k.bid)+'</td><td>'+esc(k.intent)+'</td><td>'+esc(k.dir)+'</td><td class="star">'+(k.pri?'◆':'')+'</td></tr>'}).join('');
  }
  drawKw();
  document.getElementById('kwNote').textContent='Google Ads 本次共回傳 '+M.candidates+' 組候選字（輸入 '+M.seeds+' 組種子字，加上 Google 列出的相關詞 '+M.related+' 組），本頁列出與和畝商品與內容方向相關的字。未列入的類型：同業品牌字、批發與餐廳採購字、異體字與注音寫法、蝦的規格數字、ptt 字尾，以及與和畝商品無關的字。Ads 查無資料的字（例如虱目魚禮盒、虱目魚背鮨）不代表沒人搜尋。標示「待確認有無商品」的字，需與和畝確認是否有對應商品再決定是否製作。長條比例以本頁最大搜尋量為基準。';
  /* peers */
  var P=window.PEER_DATA;if(P){
    document.getElementById('peerTable').innerHTML='<tr><th>同業</th><th>網站主打的字與分類</th><th>和畝可以補上的缺口</th></tr>'+P.peers.map(function(p){return '<tr><td class="n">'+esc(p.name)+'<small>'+esc(p.url)+'</small></td><td>'+esc(p.focus)+'</td><td>'+esc(p.gap)+'</td></tr>'}).join('');
    document.getElementById('peerBrands').innerHTML=P.brands.map(function(b){return '<span class="pill">'+esc(b[0])+'　'+fmt(b[1])+'</span>'}).join('');
    document.getElementById('peerOpps').innerHTML=P.opps.map(function(o){return '<div class="card"><h3>'+esc(o[0])+'</h3><p><b>'+esc(o[1])+'</b></p><p>'+esc(o[2])+'</p></div>'}).join('');
    document.getElementById('peerNote').textContent='同業網站讀取日期：'+P.read+'。僅整理公開頁面上的分類與標題寫法，不代表其排名或流量；同業品牌字只作為市場參考，不列為主推字。'}

  /* first ten */
  var ten=[['虱目魚怎麼挑？部位、產地與新鮮度一次看懂','虱目魚','110,000','家庭餐桌'],['虱目魚粥怎麼煮才不腥？部位與高湯做法','虱目魚粥','22,200','家庭餐桌'],['虱目魚肚怎麼選、怎麼煎才好吃','虱目魚肚','9,900','家庭餐桌'],['白蝦尺寸怎麼選？退冰、保存與料理','白蝦','6,600','家庭餐桌'],['無刺虱目魚真的沒有刺嗎？去刺方式與選購','無刺虱目魚','4,400','家庭餐桌'],['冷凍海鮮怎麼退冰才不失鮮','冷凍海鮮','1,600','家庭餐桌'],['台南產地送禮故事：從北門漁塭到收禮者餐桌','產地送禮（品牌故事）','—','節慶送禮'],['送長輩、客戶的海鮮禮盒怎麼選','水產禮盒／海鮮禮盒','30／10','節慶送禮'],['益生菌生態養殖，和一般養殖差在哪','養殖方式（品牌差異）','—','教育合作'],['食魚教育是什麼？學校與企業如何合作','食魚教育','480','教育合作']];
  document.getElementById('firstTen').innerHTML='<tr><th>#</th><th>文章方向（暫定）</th><th>核心關鍵字</th><th>月搜尋量</th><th>路徑</th></tr>'+ten.map(function(r,i){return '<tr><td class="n">'+('0'+(i+1)).slice(-2)+'</td><td>'+esc(r[0])+'</td><td>'+esc(r[1])+'</td><td>'+r[2]+'</td><td><span class="tag '+tagc[r[3]]+'">'+r[3]+'</span></td></tr>'}).join('');

  /* cases */
  var C=window.CASE_DATA||[];
  document.getElementById('cases').innerHTML=C.map(function(c){
    var mx=Math.max.apply(null,c.monthly.map(function(m){return m[1]})),last=c.monthly.length-1;
    var bars=c.monthly.map(function(m,i){var part=i===last&&c.gscEnd.slice(8)!=='30'&&c.gscEnd.slice(8)!=='31';
      return '<div class="'+(part?'part':'')+'" style="height:'+Math.max(2,Math.round(m[1]/mx*100))+'%" data-t="'+m[0]+'：'+fmt(m[1])+' 次點擊'+(part?'（未滿月）':'')+'"></div>'}).join('');
    return '<article class="case"><div class="case-head"><div><div class="eyebrow">'+esc(c.group)+'　·　'+esc(c.kind)+'</div><h3>'+esc(c.name)+'</h3><p class="rel">與和畝的相近處：'+esc(c.rel)+'</p></div>'+
      '<div class="case-meta"><div><b>'+fmt(c.total.clicks)+'</b>Google 點擊</div><div><b>'+fmt(c.total.impressions)+'</b>搜尋曝光</div><div><b>'+fmt(c.ai.total)+'</b>AI 搜尋曝光</div><div><b>'+(c.articles||'—')+'</b>官網文章</div></div></div>'+
      '<p style="margin-top:14px;font-weight:900;font-size:17px">'+esc(c.headline)+'</p>'+
      '<div class="case-cols"><div><h4>客戶原本的問題</h4><p>'+esc(c.challenge)+'</p><h4>執行方向</h4><p>'+esc(c.strategy)+'</p><h4>客戶回饋</h4><ul>'+c.lines.map(function(l){return '<li>'+esc(l)+'</li>'}).join('')+'</ul></div>'+
      '<div><h4>每月 Google 點擊趨勢</h4><div class="chart">'+bars+'</div><div class="axis"><span>'+c.monthly[0][0]+'</span><span>'+c.monthly[last][0]+'</span></div><p style="font-size:12.5px;margin-top:4px">統計期間 '+c.gscStart+' ～ '+c.gscEnd+'（AI 搜尋曝光為 '+c.ai.start+' ～ '+c.ai.end+'，與一般搜尋分開統計）；網站上線 '+esc(c.start.date)+'</p>'+
      '<h4>對和畝的啟發</h4><ul>'+c.take.map(function(l){return '<li>'+esc(l)+'</li>'}).join('')+'</ul><p style="margin-top:10px"><a href="'+c.link+'" target="_blank" rel="noopener">查看完整案例</a></p></div></div></article>'}).join('');


  /* icons */
  var IC=[[/^台南北門產地|^產地與傳承/,'pin'],[/^益生菌/,'drop'],[/^生態養殖/,'leaf'],[/^白金虱王/,'medal'],[/^產銷履歷/,'doc'],[/^品質與驗證|^有可信證據|^安心證據/,'shield'],[/^社會影響|^產生需求|^指定一位窗口|^延伸/,'users'],
    [/^品牌名稱分散|^內容與成交路徑斷開/,'broken'],[/^商品頁資訊偏薄/,'box'],[/^可信證據沒有系統化/,'doc'],[/^KEEP/,'check'],[/^REBUILD/,'refresh'],[/^MEASURE/,'chart'],
    [/^提出問題|^得到答案|^知道客戶真正怎麼說|^先給答案/,'chat'],[/^比較答案|^選擇方案|^提供可用素材/,'clip'],[/^建立信任/,'shield'],[/^採取行動/,'cart'],
    [/^使用者搜尋|^搜尋問題|^收錄與曝光/,'search'],[/^Google 理解|^搜尋頁最上方的整理答案/,'spark'],[/^頁面被看見|^被正確需求看見/,'eye'],[/^客人採取行動|^帶人進到正確頁面|^點擊與行動/,'click'],
    [/^理解差異|^結構清楚|^網站與技術基礎/,'layers'],[/^接住已經發生的需求/,'target'],[/^讓品牌資料|^資料一致/,'link'],[/^被引用/,'star'],[/^沒有保證出現/,'compass'],[/^每篇文章先寫/,'pen'],[/^用固定的一組/,'clip'],[/^送禮前會問/,'gift'],
    [/^承接虱目魚|^家庭餐桌/,'house'],[/^承接年節|^節慶送禮|^海鮮禮盒/,'gift'],[/^承接食魚教育|^教育與合作|^教育合作|^食魚教育/,'cap'],[/^虱目魚專區/,'fish'],[/^白蝦與鮮魚/,'shrimp'],[/^品牌故事/,'book'],
    [/^料理與做法/,'bowl'],[/^價格與選購|^平均每年投入|^頁首出價|^平均每篇成本/,'coin'],[/^營養與信任/,'leaf'],[/^情境分類|^範圍外另行確認/,'compass'],[/^平均月搜尋量|^基準線|^要等有數據/,'chart'],[/^廣告競爭程度/,'users'],
    [/^第 1 月/,'flag'],[/^第 2–3 月/,'layers'],[/^第 4–6 月/,'pen'],[/^第 7–12 月/,'chart'],[/^第 2 年/,'sprout'],[/^第 3 年/,'medal'],
    [/^搜尋與內容策略|^平均每年新文章/,'pen'],[/^成效與持續優化/,'refresh'],[/^一年方案/,'sprout'],[/^兩年方案/,'chart'],[/^三年方案/,'medal'],[/^想先小額/,'drop'],[/^三條路/,'layers'],
    [/^生意品質/,'medal'],[/^完成關鍵行動/,'cart'],[/^形成有效生意/,'check'],[/^開放數據權限/,'key']];
  function icoOf(t){for(var i=0;i<IC.length;i++)if(IC[i][0].test(t))return IC[i][1];return ''}
  function svg(n){return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="#i-'+n+'"/></svg>'}
  function decorate(){
    [].forEach.call(document.querySelectorAll('.card,.flow>div,.stats>div,.plan,.catcard,.phase'),function(el){
      if(el.querySelector('.ic'))return;
      var lab=el.querySelector('h3')||el.querySelector('.t')||el.querySelector('.num')||el.querySelector('b')||el.querySelector('small'),t=lab?lab.textContent.replace(/\s+/g,' ').trim().replace(/^[A-C]\s+/,''):'';
      if(el.classList.contains('stats')||el.parentElement.classList.contains('stats')){var b=el.querySelector('b');t=b?b.textContent.trim():t}
      if(el.classList.contains('catcard')){t=el.querySelector('small').textContent.trim()}
      if(el.classList.contains('phase')){t=(el.querySelector('b')||{textContent:''}).textContent.trim()}
      if(!t)t=el.textContent.replace(/\s+/g,' ').trim();
      var n=icoOf(t);if(!n)return;
      var s=document.createElement('span');s.className='ic';s.innerHTML=svg(n);
      if(el.classList.contains('phase'))el.querySelector('b').insertBefore(s,el.querySelector('b').firstChild);
      else if(el.classList.contains('catcard'))el.querySelector('small').insertBefore(s,el.querySelector('small').firstChild);
      else el.insertBefore(s,el.firstChild)})}
  decorate();
  /* motion */
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  function countUp(el){
    var raw=el.dataset.count;if(raw==null){raw=el.textContent;el.dataset.count=raw}
    var n=parseInt(String(raw).replace(/[^0-9]/g,''),10);if(isNaN(n)||reduce)return;
    var t0=null,dur=1100;function step(t){if(t0===null)t0=t;var p=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-p,3);el.textContent=Math.round(n*e).toLocaleString('en-US');if(p<1)requestAnimationFrame(step);else el.textContent=raw}
    el.textContent='0';requestAnimationFrame(step)}
  var io=('IntersectionObserver' in window&&!reduce)?new IntersectionObserver(function(es){es.forEach(function(e){
      if(!e.isIntersecting)return;var el=e.target;el.classList.add('in');io.unobserve(el);
      [].forEach.call(el.querySelectorAll('[data-cu]'),countUp);if(el.hasAttribute('data-cu'))countUp(el)})},{threshold:.12,rootMargin:'0px 0px -6% 0px'}):null;
  function watch(root){
    if(!io)return;
    var caseN=0;
    function sib0(el){return el.parentElement?[].indexOf.call(el.parentElement.children,el):0}
    function fxOf(el){
      if(el.matches('.sec>h2'))return 'fx-head';
      if(el.matches('.sec>.eyebrow'))return 'fx-left';
      if(el.matches('.sec>.lead,.cat-cards'))return 'fx-fade';
      if(el.matches('.dark'))return 'fx-wipe';
      if(el.matches('.stats,.catcard'))return 'fx-pop';
      if(el.matches('.plan'))return 'fx-tilt';
      if(el.matches('.case'))return (caseN++%2)?'fx-right':'fx-left';
      if(el.matches('.flow>div,.phase'))return 'fx-left';
      if(el.matches('.card'))return ['fx-scale','','fx-right'][(sib0(el))%3];
      if(el.matches('.tw,.gantt'))return 'fx-scale';
      return '';
    }
    [].forEach.call(root.querySelectorAll('.card,.plan,.dark,.case,.flow>div,.stats,.phase,.tw,.gantt,.sec>h2,.sec>.lead,.sec>.eyebrow,.catcard,.cat-cards'),function(el,i){
      if(el.classList.contains('rv'))return;
      var sib=el.parentElement?[].indexOf.call(el.parentElement.children,el):0;
      el.style.setProperty('--d',Math.min(sib,6)*.08+'s');el.classList.add('rv');var fx=fxOf(el);if(fx)el.classList.add(fx);io.observe(el)});
    [].forEach.call(root.querySelectorAll('.chart div'),function(d,i){d.style.setProperty('--d',(i*.04)+'s')});
    [].forEach.call(root.querySelectorAll('.g-bar'),function(d,i){d.style.setProperty('--d',(i*.12)+'s')});
    [].forEach.call(root.querySelectorAll('.g-row,.chart,.volbar'),function(el){if(!el.classList.contains('rv')&&!el.closest('.rv')){io.observe(el)}})}
  [].forEach.call(document.querySelectorAll('.stats b,.case-meta b'),function(b){b.setAttribute('data-cu','1')});
  watch(document);
  /* keyword table / category cards re-render */
  var _drawKw=drawKw;drawKw=function(){_drawKw();decorate();
    [].forEach.call(document.querySelectorAll('.catcard b'),function(b){countUp(b)});
    [].forEach.call(document.querySelectorAll('#kwTable tr'),function(tr,i){if(i===0)return;tr.style.setProperty('--d',(i*.05)+'s');tr.classList.add('row-in')});
    [].forEach.call(document.querySelectorAll('#kwTable .volbar i'),function(i,k){i.style.setProperty('--d',(k*.05)+'s');i.parentElement.classList.add('in')})};
  drawKw();
  var h=/^#p(\d)$/.exec(location.hash);if(h&&panels[+h[1]-1])panels[+h[1]-1].scrollIntoView();
})();
