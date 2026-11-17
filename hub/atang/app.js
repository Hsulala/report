(function(){
var D=window.PROPOSAL_DATA,$=function(s,r){return(r||document).querySelector(s)},$$=function(s,r){return[].slice.call((r||document).querySelectorAll(s))};
var fmt=function(n){return n==null?'—':n.toLocaleString('en-US')};
var tip=$('#tip');
function showTip(e,t){tip.textContent=t;tip.style.display='block';var x=e.clientX+12,y=e.clientY-34;if(x>innerWidth-170)x=innerWidth-170;tip.style.left=x+'px';tip.style.top=y+'px'}
function hideTip(){tip.style.display='none'}
function bars(svg,vals,labels,opt){opt=opt||{};var W=760,H=opt.h||240,pl=46,pb=30,pt=14,n=vals.length,max=Math.max.apply(null,vals)||1,bw=(W-pl)/n,s='';
for(var g=0;g<=4;g++){var y=pt+(H-pb-pt)*g/4;s+='<line x1="'+pl+'" x2="'+W+'" y1="'+y+'" y2="'+y+'" stroke="#ecd5bf" stroke-dasharray="3 4"/><text x="'+(pl-6)+'" y="'+(y+4)+'" text-anchor="end" font-size="11" fill="#6b5b50">'+fmt(Math.round(max*(1-g/4)))+'</text>'}
vals.forEach(function(v,i){var h=(H-pb-pt)*v/max,x=pl+i*bw+bw*.15,y=H-pb-h,col=opt.hi!=null&&i===opt.hi?'#c8201b':'#ffb71b';
s+='<rect class="b" data-i="'+i+'" x="'+x+'" y="'+y+'" width="'+bw*.7+'" height="'+Math.max(h,1)+'" rx="4" fill="'+col+'"/>';
if(n<=18)s+='<text x="'+(x+bw*.35)+'" y="'+(H-10)+'" text-anchor="middle" font-size="11" fill="#6b5b50">'+labels[i]+'</text>'});
svg.setAttribute('viewBox','0 0 '+W+' '+H);svg.innerHTML=s;
$$('rect.b',svg).forEach(function(r){var i=+r.getAttribute('data-i');r.addEventListener('mousemove',function(e){showTip(e,labels[i]+'：'+fmt(vals[i])+(opt.unit||''))});r.addEventListener('mouseleave',hideTip);r.addEventListener('click',function(e){showTip(e,labels[i]+'：'+fmt(vals[i])+(opt.unit||''))})})}
var ML=D.meta.months.map(function(m){return m.slice(2).replace('-','/')});

/* personas */
var P=[{t:'企業訂購',s:'會議、活動、辦公室',who:'替公司找餐點的人：在意份量、準時、衛生與訂購流程。',q:['會議餐盒','台中會議餐盒','辦公室團購'],steps:['搜尋「會議餐盒」找供應商','比較份量、價格、預訂時間','確認配送範圍與付款','詢問、下單'],need:'企業訂購專區：規格、份量、預訂方式、配送範圍、合作紀錄。',gap:'官網目前沒有獨立專區，這是阿湯有經驗卻還沒被搜尋承接的路。'},
{t:'個人購買',s:'加菜、宅配、送人',who:'想吃道地鹽焗雞的人：在意食材來源、有沒有添加、怎麼買到。',q:['鹽焗雞','鹽焗雞腿','台中鹽焗雞'],steps:['搜尋「鹽焗雞」','看獎項、檢驗與評價','確認宅配、保存與運費','商城下單'],need:'獎項與檢驗整理頁、商品頁宅配與保存資訊、清楚的商城入口。',gap:'獎項與 SGS 說明分散在首頁與常見問題，缺少集中的信任頁。'},
{t:'找作法的人',s:'想自己做、不一定購買',who:'搜尋「鹽焗雞做法」「鹽焗雞粉」的人：不一定馬上購買，但會接觸到品牌。',q:['鹽焗雞做法','鹽焗雞粉','鹽焗雞腿做法'],steps:['搜尋作法或鹽焗雞粉','閱讀做法與火候','發現現成的更省事','連到商品頁'],need:'食用與作法內容，自然連到商品，讓想偷懶的人直接買現成。',gap:'官網有一雞多吃食譜，但以圖文呈現，尚未整理成問答。'}];
var all={};D.cats.forEach(function(c){c.keywords.forEach(function(k){all[k.keyword]=k})});
var pt=$('#ptabs'),pp=$('#ppanes');
P.forEach(function(p,i){var b=document.createElement('button');b.className='tab'+(i?'':' on');b.innerHTML=p.t+'<small>'+p.s+'</small>';b.onclick=function(){$$('.tab',pt).forEach(function(x){x.classList.remove('on')});b.classList.add('on');$$('.tabpane',pp).forEach(function(x,j){x.classList.toggle('on',j===i)})};pt.appendChild(b);
var d=document.createElement('div');d.className='tabpane'+(i?'':' on');
d.innerHTML='<div class="persona"><div class="box"><h3>'+p.t+'</h3><p>'+p.who+'</p><p style="margin-top:14px"><b>常見搜尋</b></p>'+p.q.map(function(q){var k=all[q];return '<span class="tag">'+q+(k?' · '+fmt(k.vol)+'/月':'')+'</span>'}).join('')+'<p style="margin-top:12px"><b>需要的內容</b><br>'+p.need+'</p><p class="note">'+p.gap+'</p></div><div class="box"><h3>從搜尋到行動</h3><ol class="steps">'+p.steps.map(function(s){return '<li>'+s+'</li>'}).join('')+'</ol></div></div>';pp.appendChild(d)});

/* gaps */
var G=[['企業訂購','官網最新消息有一則辦公室團購文章，但沒有專區、流程與規格說明。','建立企業訂購專區：份量、預訂時間、配送、付款與合作紀錄。','優先'],
['團購分類','商城有「團購聚餐最划算」分類，但沒說明包含哪些商品與適用對象。','補上適用情境、份量與訂購條件。','優先'],
['信任證據','獎項與 SGS 說明分散在首頁與常見問題。','整理成獨立頁，並提供證書與報告原文。','次要'],
['官網到商城','官網首頁與商城是不同頁面，需要從首頁導向商城。','在內容頁加入明確的商城入口與商品連結。','次要'],
['產能說明','常見問題標示日產限 50 隻，大量訂購需先說明接單與預訂方式。','寫清楚預訂天數與接單方式，避免客人撲空。','優先'],
['最新消息','可見三則消息，沒有發布日期，看不出是否持續更新。','標示日期並持續更新，讓搜尋系統與客人看見官網在經營。','次要']];
var gg=$('#gaps');G.forEach(function(g){var a=document.createElement('article');a.className='card gap';a.innerHTML='<div class="st">'+g[3]+'</div><h3>'+g[0]+'</h3><p>'+g[1]+'</p><div class="more"><b>建議做法</b><br>'+g[2]+'</div>';a.onclick=function(){a.classList.toggle('open')};gg.appendChild(a)});

/* keywords */
var ct=$('#ctabs'),cur=0,sortK='vol',asc=false,selKw=null;
D.cats.forEach(function(c,i){var b=document.createElement('button');b.className='tab'+(i?'':' on');b.innerHTML=c.name+'<small>'+c.keywords.length+' 字</small>';b.onclick=function(){cur=i;selKw=null;$$('.tab',ct).forEach(function(x,j){x.classList.toggle('on',j===i)});renderK()};ct.appendChild(b)});
function pill(c){return '<span class="pill '+(c==='低'?'l':c==='中'?'m':'h')+'">'+c+'</span>'}
function renderK(){var c=D.cats[cur],ks=c.keywords.slice();ks.sort(function(a,b){var x=a[sortK],y=b[sortK];if(typeof x==='string')return asc?x.localeCompare(y):y.localeCompare(x);return asc?x-y:y-x});
$('#cdesc').textContent=c.description;var tot=c.keywords.reduce(function(s,k){return s+k.vol},0),top=c.keywords.slice().sort(function(a,b){return b.vol-a.vol})[0];
$('#ckpi').innerHTML='<div><b>'+c.keywords.length+'</b><span>收錄關鍵字</span></div><div><b>'+fmt(tot)+'</b><span>月均搜尋量加總</span></div><div><b>'+fmt(top.vol)+'</b><span>最高：'+top.keyword+'</span></div><div><b>'+c.keywords.filter(function(k){return k.comp==='低'}).length+'</b><span>廣告競爭低的字</span></div>';
var max=Math.max.apply(null,c.keywords.map(function(k){return k.vol}));
$('#ktb').innerHTML=ks.map(function(k){return '<tr class="kr'+(selKw===k.keyword?' sel':'')+'" data-k="'+k.keyword+'"><td><b>'+k.keyword+'</b></td><td class="vol">'+fmt(k.vol)+'</td><td style="min-width:120px"><div class="bar" style="width:'+Math.max(2,k.vol/max*100)+'%"></div></td><td>'+pill(k.comp)+' <small>'+k.idx+'</small></td><td>'+(k.low!=null?k.low+'–'+k.hi:'—')+'</td></tr>'}).join('');
$$('#ktb tr').forEach(function(r){r.onclick=function(){selKw=r.getAttribute('data-k');$$('#ktb tr').forEach(function(x){x.classList.remove('sel')});r.classList.add('sel');drawM(all[selKw])}});
drawM(selKw?all[selKw]:top,!selKw)}
function drawM(k,auto){var pk=k.monthly.indexOf(Math.max.apply(null,k.monthly));$('#mtitle').textContent='「'+k.keyword+'」逐月搜尋量';$('#msub').textContent='2025/11–2026/10；月均 '+fmt(k.vol)+'；高峰在 '+ML[pk]+'（'+fmt(k.monthly[pk])+'）'+(auto?'（預設顯示本類最高量字，點選上表可切換）':'');bars($('#mchart'),k.monthly,ML,{hi:pk,unit:' 次'})}
$$('th.s').forEach(function(th){th.onclick=function(){var k=th.getAttribute('data-k');if(sortK===k)asc=!asc;else{sortK=k;asc=k==='keyword'||k==='idx'}renderK()}});
renderK();
bars($('#catchart'),D.cats.map(function(c){return c.keywords.reduce(function(s,k){return s+k.vol},0)}),D.cats.map(function(c){return c.name}),{h:220,unit:' 次/月'});

/* first batch */
var F=[['會議餐盒怎麼訂？份量、預訂與配送一次看','會議餐盒','企業訂購專區'],['台中會議餐盒怎麼選？5 個條件','台中會議餐盒','企業訂購專區'],['辦公室團購美食怎麼選？','辦公室團購','企業訂購專區'],['鹽焗雞怎麼做？火候與步驟','鹽焗雞做法','商品頁'],['鹽焗雞粉和現成鹽焗雞差在哪？','鹽焗雞粉','商品頁'],['鹽焗雞腿怎麼加熱才好吃？','鹽焗雞腿','商品頁'],['鹽焗雞是什麼？古法做法與特色','鹽焗雞','品牌故事與商城'],['年菜怎麼選？雞肉類年菜（需確認）','年菜推薦','年菜／禮盒頁'],['台中伴手禮推薦：鹹食送禮（需確認）','台中伴手禮推薦','禮盒頁'],['無添加是什麼意思？獎項與 SGS 說明','—','信任頁']];
$('#first').innerHTML=F.map(function(f,i){var k=all[f[1]];return '<tr><td>'+(i+1)+'</td><td><b>'+f[0]+'</b></td><td>'+f[1]+'</td><td class="vol">'+(k?fmt(k.vol):'品牌資訊')+'</td><td>'+f[2]+'</td></tr>'}).join('');

/* cases */
var cb=$('#cases');
D.cases.forEach(function(c){var el=document.createElement('article');el.className='card case '+(D.cases.indexOf(c)%2?'slide-r':'slide-l');
el.innerHTML='<div class="top"><div><span class="tag">'+c.group+'</span><span class="tag">'+c.kind+'</span><h3>'+c.name+'</h3><p style="max-width:560px"><b>'+c.headline+'</b></p></div><div style="text-align:right"><div class="big">'+fmt(c.total.clicks)+'</div><small>自然搜尋點擊（'+c.gscStart.slice(0,7).replace('-','/')+'–'+c.gscEnd.slice(0,7).replace('-','/')+'）<br>曝光 '+fmt(c.total.impressions)+'</small></div></div>'+
'<div style="margin-top:10px"><span class="note">圖表</span><span class="seg"><button class="on" data-m="1">點擊</button><button data-m="2">曝光</button></span></div><svg class="cs" viewBox="0 0 760 220"></svg>'+
'<details><summary>挑戰與做法</summary><ul><li><b>背景：</b>'+c.challenge+'</li><li><b>做法：</b>'+c.strategy+'</li></ul></details><details><summary>客戶回饋與觀察</summary><ul>'+c.lines.map(function(l){return '<li>'+l+'</li>'}).join('')+'</ul></details><details><summary>對阿湯的參考</summary><ul><li>'+c.rel+'</li>'+c.take.map(function(l){return '<li>'+l+'</li>'}).join('')+'</ul><p class="note">文章數：'+c.articles+' 篇（'+c.articleScope+'），資料更新 '+c.asOf+'</p></details>';
cb.appendChild(el);var svg=$('svg.cs',el),lab=c.monthly.map(function(m){return m[0].slice(2).replace('-','/')});
function draw(m){bars(svg,c.monthly.map(function(r){return r[m]}),lab,{h:220,unit:m===1?' 次點擊':' 次曝光'})}draw(1);
$$('.seg button',el).forEach(function(b){b.onclick=function(){$$('.seg button',el).forEach(function(x){x.classList.remove('on')});b.classList.add('on');draw(+b.getAttribute('data-m'))}})});

/* plans */
var PL=[{t:'一年方案',n:10,total:150000,m:12,pay:12,per:12500,avg:'12,500',fit:'先建立企業訂購專區與核心內容',list:['企業訂購專區與信任頁','10 篇 SEO 文章','每月成效報告']},
{t:'兩年方案',n:15,total:180000,m:24,pay:24,per:7500,avg:'7,500',fit:'持續擴充主題，跨過年節與檔期',list:['含一年方案全部內容','15 篇 SEO 文章（整份合約總量）','第二年依數據規劃下一批內容'],rec:1},
{t:'三年方案',n:20,total:240000,m:36,pay:24,per:10000,avg:'約 6,667',fit:'長期累積搜尋資產',list:['含兩年方案全部內容','20 篇 SEO 文章（整份合約總量）','跨年度比較成效與調整策略']}];
var pw=$('#plans'),pd=$('#pd');
PL.forEach(function(p,i){var a=document.createElement('article');a.className='plan flip'+(p.rec?' on':'');a.style.setProperty('--d',(i*.15)+'s');a.innerHTML=(p.rec?'<div class="flag">建議方案</div>':'')+'<div class="t">'+p.t+' · '+p.n+' 篇</div><small>平均每月投入（未稅）</small><div class="p">'+(p.avg.indexOf('約')===0?'約 NT$'+p.avg.slice(1).trim():'NT$'+p.avg)+'</div><div class="a">整份合約總價 NT$'+fmt(p.total)+' 未稅</div><div class="r"><span>服務期間</span><b>'+p.m+' 個月</b></div><div class="r"><span>付款期數</span><b>最多 '+p.pay+' 期</b></div><div class="r"><span>每期金額</span><b>NT$'+fmt(p.per)+'</b></div><div class="r"><span>平均每篇</span><b>NT$'+fmt(Math.round(p.total/p.n))+'</b></div>';
a.onclick=function(){$$('.plan').forEach(function(x){x.classList.remove('on')});a.classList.add('on');show(p)};pw.appendChild(a);if(p.rec)show(p)});
function show(p){pd.innerHTML='<b>'+p.t+'</b>｜適合：'+p.fit+'<ul>'+p.list.map(function(l){return '<li>'+l+'</li>'}).join('')+'</ul>'}

/* faq */
var Q=[['SEO 多久看得到效果？','需要多個月的趨勢判讀，我們不承諾特定排名、流量或訂單；每月報告會用 Search Console 與詢問紀錄追蹤。'],['阿湯已有口碑，還需要 SEO 嗎？','口碑帶來回頭客與介紹；SEO 補的是第一次搜尋的人，尤其是想大量訂購、需要比較條件的企業客。'],['需要阿湯提供什麼？','餐盒與團購條件、獎項與檢驗文件、訂單與詢問紀錄；商品事實與圖片由阿湯確認，我們負責撰寫與上架。'],['Google 廣告包含在方案內嗎？','不包含。廣告費用與帳戶管理另計，可視預算再評估。'],['搜尋量準確嗎？','來自 Google Ads 關鍵字規劃工具的月平均估計，用來判斷優先順序，不等於實際流量。']];
var fq=$('#faq');Q.forEach(function(q){var b=document.createElement('button');b.type='button';b.innerHTML=q[0]+'<span>＋</span>';var d=document.createElement('div');d.textContent=q[1];b.onclick=function(){b.classList.toggle('open');b.lastChild.textContent=b.classList.contains('open')?'－':'＋'};fq.appendChild(b);fq.appendChild(d)});


/* top KPIs (count-up) */
var allK=[];D.cats.forEach(function(c){c.keywords.forEach(function(k){allK.push(k)})});
var totV=allK.reduce(function(s,k){return s+k.vol},0);
$('#topkpi').innerHTML=[[allK.length,'收錄關鍵字','pop'],[D.cats.length,'搜尋主題類別','pop'],[all['會議餐盒'].vol,'會議餐盒 月均搜尋','pop'],[all['台中伴手禮'].vol,'台中伴手禮 月均搜尋','pop']].map(function(k,i){return '<div class="pop" style="--d:'+i*.12+'s"><b data-n="'+k[0]+'">0</b><span>'+k[1]+'</span></div>'}).join('');

/* seasonal toggle */
var ss=$('#sseg');
function drawS(k){var v=all[k].monthly;var pk=v.indexOf(Math.max.apply(null,v));bars($('#sschart'),v,ML,{hi:pk,unit:' 次'});$('#sschart').parentNode.querySelector('.sub').firstChild.textContent=k+'：月均 '+fmt(all[k].vol)+'，高峰 '+ML[pk]+'（'+fmt(v[pk])+'）。'}
$$('button',ss).forEach(function(b){b.onclick=function(){$$('button',ss).forEach(function(x){x.classList.remove('on')});b.classList.add('on');drawS(b.getAttribute('data-k'))}});drawS('會議餐盒');

/* funnel */
var FN=[['產生需求',90,'阿湯口碑與社群已有基礎'],['開始搜尋',45,'搜尋時看得到阿湯的頁面還少'],['比較選項',25,'缺企業訂購規格與流程說明（最大缺口）'],['建立信任',55,'獎項與 SGS 有，但分散在首頁與常見問題'],['詢問或下單',70,'商城與電話已可行動，需從內容導入']];
$('#fun').innerHTML=FN.map(function(f){return '<div class="row"><span>'+f[0]+'</span><div class="tr"><i style="--w:'+f[1]+'%"></i></div><small>'+f[2]+'</small></div>'}).join('');
$$('#fun .row').forEach(function(r){r.style.gridTemplateColumns='90px 1fr 1.2fr'});

/* AI cites */
var CT=[['回答完整','把客人會問的問題，一次回答清楚',['會議餐盒要訂幾人份、提前幾天、怎麼配送','鹽焗雞怎麼加熱、保存多久、宅配運費','用問答與清楚的小標題整理，AI 才容易摘錄']],['有證據','用實際的製作與獎項證明',['國家品質金獎、歐盟 2 星無添加美食大獎的證書與年份','SGS 檢驗說明提供報告原文','製作過程、食材來源與實拍照片']],['資訊一致','公司資訊在每個地方都一樣',['名稱、電話、營業時間在官網、Google 商家與社群一致','商城與官網的商品名稱、規格相同','加上結構化資料標示，讓搜尋引擎讀懂內容類型']],['被別人提到','可信的外部網站提到阿湯',['媒體報導、美食獎項頒發單位的公開頁面','在地與餐飲相關名錄','評價與回應持續維護']]];
var cb2=$('#cites'),cbx=$('#citeBox');
CT.forEach(function(c,i){var b=document.createElement('button');b.type='button';b.textContent=(i+1)+'　'+c[0];b.onclick=function(){$$('button',cb2).forEach(function(x){x.classList.remove('on')});b.classList.add('on');cbx.innerHTML='<h3>'+c[1]+'</h3><ul>'+c[2].map(function(x){return '<li>'+x+'</li>'}).join('')+'</ul>'};cb2.appendChild(b);if(!i)b.click()});

/* article anatomy */
var AR=[['先給答案：會議餐盒建議提前 3 天預訂（示例數字，發布前與阿湯核對）','搜尋的人想先看到結論，AI 摘要也偏好擷取前段直接答案。'],['份量與內容：一人份包含哪些、可否加購','比較階段最需要規格，寫在文字裡才讀得到。'],['怎麼訂：預訂、付款、配送範圍','把「怎麼訂」一次講完，就不必再來回詢問。'],['信任證據：獎項、SGS 說明與過去合作','建立信任，也提供可核對的來源。'],['下一步：詢價入口與電話','讓有興趣的人一步到詢問。']];
$('#art').innerHTML=AR.map(function(a,i){return '<div class="seg1'+(i?'':' on')+'"><b>'+a[0]+'</b><div class="why">▸ '+a[1]+'</div></div>'}).join('')+'<p class="note">示例，非實際文章；餐盒規格、接單條件與產能需先與阿湯確認。</p>';
$$('#art .seg1').forEach(function(d){d.onclick=function(){$$('#art .seg1').forEach(function(x){x.classList.remove('on')});d.classList.add('on')}});

/* calculator */
var sel=$('#cKw');['會議餐盒','鹽焗雞','鹽焗雞腿','台中會議餐盒','餐盒推薦','台中伴手禮'].forEach(function(k){var o=document.createElement('option');o.value=k;o.textContent=k+'（'+fmt(all[k].vol)+'/月）';sel.appendChild(o)});
function calc(){var v=all[sel.value].vol,r1=+$('#r1').value,r2=+$('#r2').value,r3=+$('#r3').value,p=+$('#r4').value||0;$('#vR1').textContent=r1+'%';$('#vR2').textContent=r2+'%';$('#vR3').textContent=r3+'%';
var vis=Math.round(v*r1/100),inq=vis*r2/100,deal=inq*r3/100,rev=deal*p;$('#o1').textContent=fmt(v);$('#o2').textContent=fmt(vis);$('#o3').textContent=inq.toFixed(1);$('#o4').textContent=deal.toFixed(1);$('#o5').textContent='NT$'+fmt(Math.round(rev));
$('#be').innerHTML=PL.map(function(pl){var mo=pl.total/pl.m,need=p?mo/p:0;return '<tr><td>'+pl.t+'</td><td>'+fmt(Math.round(mo))+'</td><td>'+need.toFixed(1)+' 單</td><td>'+(r3?(need/(r3/100)).toFixed(1):'—')+' 件</td></tr>'}).join('')}
['r1','r2','r3','r4'].forEach(function(id){$('#'+id).oninput=calc});sel.onchange=calc;
$$('.calc .chk button').forEach(function(b){b.onclick=function(){$$('.calc .chk button').forEach(function(x){x.classList.remove('on')});b.classList.add('on');$('#r1').value=b.getAttribute('data-r');calc()}});calc();

/* cost view */
var mx=Math.max.apply(null,PL.map(function(p){return p.total/p.m}));
$('#costv').innerHTML=PL.map(function(p){var mo=p.total/p.m;return '<div class="row"><b>'+p.t+'</b><div class="tr"><i style="--w:'+(mo/mx*100)+'%"></i></div><span>NT$'+fmt(Math.round(mo))+'/月 · 每篇 '+fmt(Math.round(p.total/p.n))+'</span></div>'}).join('');

/* floating nav + reveal */
var np=$('#fnavPanel'),ns=$$('.panel');ns.forEach(function(s){var a=document.createElement('a');a.href='#'+s.id;a.textContent=s.getAttribute('data-title');a.onclick=function(){$('#fnav').classList.remove('open')};np.appendChild(a)});
$('#fnavBtn').onclick=function(){$('#fnav').classList.toggle('open')};
var ticking=false;addEventListener('scroll',function(){if(ticking)return;ticking=true;requestAnimationFrame(function(){ticking=false;var cur=ns[0].id;ns.forEach(function(s){if(s.getBoundingClientRect().top<innerHeight*.4)cur=s.id});$$('a',np).forEach(function(a){a.classList.toggle('on',a.getAttribute('href')==='#'+cur)})})},{passive:true});
function countUp(el){var n=+el.getAttribute('data-n'),t0=null;(function f(t){if(!t0)t0=t;var p=Math.min((t-t0)/900,1);el.textContent=fmt(Math.round(n*(1-Math.pow(1-p,3))));if(p<1)requestAnimationFrame(f)})(performance.now())}
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
$$('[data-n]').forEach(function(e){if(reduce)e.textContent=fmt(+e.getAttribute('data-n'))});
var sel2='.fx,.pop,.flip,.slide-l,.slide-r,.cost';
$$('.card,.flow>div,.chartbox,.stats>div,.kpis>div,.timeline>div,.term').forEach(function(e){if(!e.matches('.fx,.pop,.flip,.slide-l,.slide-r')&&!e.closest('.fx,.pop,.flip,.slide-l,.slide-r'))e.classList.add('fx')});
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');$$('[data-n]',e.target).forEach(function(n){if(!reduce)countUp(n)});if(e.target.hasAttribute&&e.target.hasAttribute('data-n')&&!reduce)countUp(e.target);io.unobserve(e.target)}})},{threshold:.08,rootMargin:'0px 0px -4% 0px'});
$$(sel2).forEach(function(e,i){e.style.setProperty('--d',e.style.getPropertyValue('--d')||((i%4)*.08)+'s');io.observe(e)});
})();
