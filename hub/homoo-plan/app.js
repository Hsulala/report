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
      return '<button type="button" class="catcard'+(c===catNow?' on':'')+'" data-c="'+c+'"><small>'+c+'</small><b>'+fmt(sum)+'</b><span>合計月搜尋量　·　'+rows.length+' 組已確認</span></button>'}).join('');
    [].forEach.call(document.querySelectorAll('.catcard'),function(b){b.onclick=function(){catNow=b.dataset.c;drawKw()}});
    var rows=KW.filter(function(k){return k.cat===catNow}).sort(function(a,b){return b.vol-a.vol});
    document.getElementById('kwTable').innerHTML='<tr><th>關鍵字</th><th>平均月搜尋量</th><th>廣告競爭</th><th>頁首出價（低～高）</th><th>搜尋意圖</th><th>建議內容方向</th><th>◆</th></tr>'+rows.map(function(k){
      return '<tr><td class="n">'+esc(k.keyword)+'</td><td><div class="volbar"><i style="width:'+Math.max(2,Math.round(k.vol/maxv*120))+'px"></i><b>'+fmt(k.vol)+'</b></div></td><td>'+esc(k.comp)+'</td><td>'+esc(k.bid)+'</td><td>'+esc(k.intent)+'</td><td>'+esc(k.dir)+'</td><td class="star">'+(k.pri?'◆':'')+'</td></tr>'}).join('');
  }
  drawKw();
  document.getElementById('kwNote').textContent='Google Ads 共回傳 '+M.candidates+' 組相關候選字，本頁僅列出已確認並整理的題目；完整可能性池、競爭程度與頁首出價，將於正式合作的關鍵字報告中補齊。長條比例以本頁最大搜尋量為基準。';

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
  var _drawKw=drawKw;drawKw=function(){_drawKw();
    [].forEach.call(document.querySelectorAll('.catcard b'),function(b){countUp(b)});
    [].forEach.call(document.querySelectorAll('#kwTable tr'),function(tr,i){if(i===0)return;tr.style.setProperty('--d',(i*.05)+'s');tr.classList.add('row-in')});
    [].forEach.call(document.querySelectorAll('#kwTable .volbar i'),function(i,k){i.style.setProperty('--d',(k*.05)+'s');i.parentElement.classList.add('in')})};
  drawKw();
  var h=/^#p(\d)$/.exec(location.hash);if(h&&panels[+h[1]-1])panels[+h[1]-1].scrollIntoView();
})();
