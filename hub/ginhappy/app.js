(function(){
var $=function(i){return document.getElementById(i)},ic=function(n){return '<svg class="ico"><use href="#i-'+n+'"/></svg>'};
var fn=$('fnav'),fb=$('fnavBtn'),fp=$('fnavPanel');
document.querySelectorAll('section[id^=s-]').forEach(function(s){var h=s.querySelector('h2'),e=s.querySelector('.eyebrow');var a=document.createElement('a');a.href='#'+s.id;a.textContent=e?e.textContent:h.textContent;fp.appendChild(a)});
fb.onclick=function(){var o=fn.classList.toggle('open');fb.setAttribute('aria-expanded',o)};
fp.addEventListener('click',function(){fn.classList.remove('open')});
// keywords
var KW=window.KW_DATA||[],M=window.KW_META||{},cats=[];KW.forEach(function(r){if(cats.indexOf(r.cat)<0)cats.push(r.cat)});
var f=function(n){return n.toLocaleString('en-US')};
$('kwMeta').innerHTML='<b>資料來源</b>：'+M.source+'<br>查詢條件：'+M.geo+'、'+M.lang+'、'+M.network+'、'+M.period+'（查詢日 '+M.queried+'）<br>種子詞 '+M.seeds+' 個，取得相關詞 '+M.related+' 個，共 '+M.candidates+' 個候選，留下 '+KW.length+' 個。';
$('kwSum').innerHTML=cats.map(function(c){var rs=KW.filter(function(r){return r.cat==c}),t=rs.reduce(function(a,r){return a+r.vol},0);return '<div class="card"><div class="small">'+c+'</div><div class="big">'+f(t)+'</div><div class="small">'+rs.length+' 個詞，月搜尋量合計</div></div>'}).join('');
var cur=cats[0];
function kw(){$('kwTabs').innerHTML=cats.map(function(c){return '<button aria-pressed="'+(c==cur)+'" data-c="'+c+'">'+c+'</button>'}).join('');
var rs=KW.filter(function(r){return r.cat==cur}).sort(function(a,b){return b.vol-a.vol});
$('kwTable').innerHTML='<tr><th>關鍵字</th><th>月搜尋量</th><th>廣告競爭</th><th>頁首出價 NT$</th><th>搜尋意圖</th><th>頁面方向</th></tr>'+rs.map(function(r){return '<tr><td><b>'+r.keyword+'</b> '+(r.pri?'<span class="tag p">優先</span>':'')+(r.chk?' <span class="tag c">需先確認</span>':'')+'</td><td>'+f(r.vol)+'</td><td>'+r.comp+'</td><td>'+r.bid+'</td><td>'+r.intent+'</td><td>'+r.dir+'</td></tr>'}).join('')}
$('kwTabs').onclick=function(e){var c=e.target.getAttribute('data-c');if(c){cur=c;kw()}};kw();
// cases
function chart(ms,col){var W=640,H=220,p=34,mx=Math.max.apply(null,ms.map(function(m){return m.clk}))||1,n=ms.length;
var X=function(i){return p+(W-2*p)*(n>1?i/(n-1):0)},Y=function(v){return H-p-(H-2*p)*v/mx};
var pts=ms.map(function(m,i){return X(i)+','+Y(m.clk)}).join(' ');
var s='<svg class="chart" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="每月搜尋點擊趨勢"><line x1="'+p+'" y1="'+(H-p)+'" x2="'+(W-p)+'" y2="'+(H-p)+'" stroke="#d5dfd7"/>';
s+='<polyline fill="none" stroke="'+col+'" stroke-width="2.5" points="'+pts+'"/>';
ms.forEach(function(m,i){s+='<circle cx="'+X(i)+'" cy="'+Y(m.clk)+'" r="3.5" fill="'+(m.partial?'#fff':col)+'" stroke="'+col+'"/>'});
s+='<text x="'+p+'" y="'+(H-10)+'" font-size="11" fill="#5b6b63">'+ms[0].m+'</text><text x="'+(W-p)+'" y="'+(H-10)+'" font-size="11" text-anchor="end" fill="#5b6b63">'+ms[n-1].m+'</text><text x="'+p+'" y="16" font-size="11" fill="#5b6b63">最高 '+f(mx)+' 次點擊／月</text></svg>';return s}
$('cases').innerHTML=(window.CASES||[]).map(function(c){
return '<div class="card" style="margin-bottom:22px"><span class="tag">'+c.tag+'</span><h3 style="margin-top:8px">'+c.name+'：'+c.head+'</h3><p class="small">網站 '+c.site+'｜合作開始 '+c.start+'</p>'+
'<div class="grid g3">'+c.stats.map(function(s){return '<div><div class="big">'+s[1]+'</div><div class="small">'+s[0]+'</div></div>'}).join('')+'</div><p class="small">'+c.statNote+'</p>'+
'<h3 style="margin-top:14px">每月搜尋點擊趨勢</h3>'+chart(c.months,'#1f4a37')+'<p class="small">空心點代表該月資料尚未完整。</p>'+
'<div class="tw"><table><tr><th>月份</th><th>曝光</th><th>點擊</th></tr>'+c.months.map(function(m){return '<tr><td>'+m.m+(m.partial?'（未滿月）':'')+'</td><td>'+f(m.imp)+'</td><td>'+f(m.clk)+'</td></tr>'}).join('')+'</table></div>'+
'<div class="tw" style="margin-top:12px"><table><tr><th>代表關鍵字</th><th>排名</th><th>月搜尋量</th></tr>'+c.kw.map(function(k){return '<tr><td>'+k[0]+'</td><td>'+k[1]+'</td><td>'+k[2]+'</td></tr>'}).join('')+'</table></div>'+
'<h3 style="margin-top:14px">給金喜的參考</h3><ul>'+c.learn.map(function(l){return '<li>'+l+'</li>'}).join('')+'</ul></div>'}).join('');
// plans
var P=[['一年','150,000',10,'12 個月',12,'12,500',false],['二年','180,000',15,'24 個月',24,'7,500',true],['三年','240,000',20,'36 個月',24,'10,000',false]];
$('plans').innerHTML=P.map(function(p){return '<div class="card plan'+(p[6]?' rec':'')+'">'+(p[6]?'<span class="badge">建議</span>':'')+'<h3>'+p[0]+'方案</h3><div class="price">NT$ '+p[1]+'</div><div class="small">合約總價，未稅</div><ul style="margin-top:12px"><li>合約期間共 '+p[2]+' 篇文章（含第一批 4 篇）</li><li>服務期間 '+p[3]+'</li><li>付款期數 '+p[4]+' 期，每期約 NT$ '+p[5]+'（零利率，最多 24 期）</li><li>新官網含基本購物車</li></ul></div>'}).join('')+'';
// reveal
if('IntersectionObserver' in window&&matchMedia('(prefers-reduced-motion: no-preference)').matches){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.08});document.querySelectorAll('.rv').forEach(function(el){io.observe(el)})}else document.querySelectorAll('.rv').forEach(function(el){el.classList.add('in')});
})();
