(function(){
var D=window.PROPOSAL_DATA,$=function(s,r){return(r||document).querySelector(s)},$$=function(s,r){return[].slice.call((r||document).querySelectorAll(s))};
var fmt=function(n){return n==null?'—':n.toLocaleString('en-US')};
var tip=$('#tip');
function showTip(e,t){tip.textContent=t;tip.style.display='block';var x=e.clientX+12,y=e.clientY-34;if(x>innerWidth-170)x=innerWidth-170;tip.style.left=x+'px';tip.style.top=y+'px'}
function hideTip(){tip.style.display='none'}
function bars(svg,vals,labels,opt){opt=opt||{};var W=opt.w||760,H=opt.h||240,pl=46,pb=30,pt=14,n=vals.length,max=Math.max.apply(null,vals)||1,bw=(W-pl)/n,s='';
for(var g=0;g<=4;g++){var y=pt+(H-pb-pt)*g/4;s+='<line x1="'+pl+'" x2="'+W+'" y1="'+y+'" y2="'+y+'" stroke="#ecd5bf" stroke-dasharray="3 4"/><text x="'+(pl-6)+'" y="'+(y+4)+'" text-anchor="end" font-size="11" fill="#6b5b50">'+fmt(Math.round(max*(1-g/4)))+'</text>'}
vals.forEach(function(v,i){var h=(H-pb-pt)*v/max,x=pl+i*bw+bw*.15,y=H-pb-h,col=opt.hi!=null&&i===opt.hi?'#c8201b':'#ffb71b';
s+='<rect class="b" data-i="'+i+'" x="'+x+'" y="'+y+'" width="'+bw*.7+'" height="'+Math.max(h,1)+'" rx="4" fill="'+col+'"/>';
if(n<=18)s+='<text x="'+(x+bw*.35)+'" y="'+(H-10)+'" text-anchor="middle" font-size="11" fill="#6b5b50">'+labels[i]+'</text>'});
svg.setAttribute('viewBox','0 0 '+W+' '+H);svg.innerHTML=s;
$$('rect.b',svg).forEach(function(r){var i=+r.getAttribute('data-i');r.addEventListener('mousemove',function(e){showTip(e,labels[i]+'：'+fmt(vals[i])+(opt.unit||''))});r.addEventListener('mouseleave',hideTip);r.addEventListener('click',function(e){showTip(e,labels[i]+'：'+fmt(vals[i])+(opt.unit||''))})})}
function dual(svg,rows){var W=760,H=240,pl=46,pr=54,pb=30,pt=22,n=rows.length,mc=Math.max.apply(null,rows.map(function(r){return r[1]}))||1,mi=Math.max.apply(null,rows.map(function(r){return r[2]}))||1,bw=(W-pl-pr)/n,s='';
for(var g=0;g<=4;g++){var y=pt+(H-pb-pt)*g/4;s+='<line x1="'+pl+'" x2="'+(W-pr)+'" y1="'+y+'" y2="'+y+'" stroke="#ecd5bf" stroke-dasharray="3 4"/><text x="'+(pl-6)+'" y="'+(y+4)+'" text-anchor="end" font-size="11" fill="#b8730a">'+fmt(Math.round(mc*(1-g/4)))+'</text><text x="'+(W-pr+6)+'" y="'+(y+4)+'" font-size="11" fill="#c8201b">'+fmt(Math.round(mi*(1-g/4)))+'</text>'}
s+='<text x="'+pl+'" y="12" font-size="11" fill="#b8730a" font-weight="700">■ 點擊（左軸）</text><text x="'+(pl+110)+'" y="12" font-size="11" fill="#c8201b" font-weight="700">● 曝光（右軸）</text>';
var pts=[];rows.forEach(function(r,i){var h=(H-pb-pt)*r[1]/mc,x=pl+i*bw+bw*.2,y=H-pb-h;s+='<rect class="b" data-i="'+i+'" x="'+x+'" y="'+y+'" width="'+bw*.6+'" height="'+Math.max(h,1)+'" rx="4" fill="#ffb71b"/><text x="'+(x+bw*.3)+'" y="'+(H-10)+'" text-anchor="middle" font-size="11" fill="#6b5b50">'+r[0].slice(2).replace('-','/')+'</text>';pts.push([pl+i*bw+bw*.5,pt+(H-pb-pt)*(1-r[2]/mi)])});
s+='<polyline fill="none" stroke="#c8201b" stroke-width="2.5" points="'+pts.map(function(p){return p[0]+','+p[1]}).join(' ')+'"/>'+pts.map(function(p,i){return '<circle class="b" data-i="'+i+'" cx="'+p[0]+'" cy="'+p[1]+'" r="5" fill="#fff" stroke="#c8201b" stroke-width="2.5"/>'}).join('');
svg.setAttribute('viewBox','0 0 '+W+' '+H);svg.innerHTML=s;
$$('.b',svg).forEach(function(r){var i=+r.getAttribute('data-i'),t=rows[i][0].replace('-','/')+'：點擊 '+fmt(rows[i][1])+'｜曝光 '+fmt(rows[i][2]);r.addEventListener('mousemove',function(e){showTip(e,t)});r.addEventListener('mouseleave',hideTip);r.addEventListener('click',function(e){showTip(e,t)})})}
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
function drawM(k,auto){var pk=k.monthly.indexOf(Math.max.apply(null,k.monthly));$('#mtitle').textContent='「'+k.keyword+'」逐月搜尋量';$('#msub').textContent='2025/11–2026/10；月均 '+fmt(k.vol)+'；高峰在 '+ML[pk]+'（'+fmt(k.monthly[pk])+'）'+(auto?'（預設顯示本類最高量字，點選上表可切換）':'');bars($('#mchart'),k.monthly,ML,{hi:pk,unit:' 次',w:520,h:300})}
$$('th.s').forEach(function(th){th.onclick=function(){var k=th.getAttribute('data-k');if(sortK===k)asc=!asc;else{sortK=k;asc=k==='keyword'||k==='idx'}renderK()}});
renderK();
bars($('#catchart'),D.cats.map(function(c){return c.keywords.reduce(function(s,k){return s+k.vol},0)}),D.cats.map(function(c){return c.name}),{h:220,unit:' 次/月'});


/* cases */
var cb=$('#cases');
D.cases.forEach(function(c){var el=document.createElement('article');el.className='card case '+(D.cases.indexOf(c)%2?'slide-r':'slide-l');
el.innerHTML='<div class="top"><div><span class="tag">'+c.group+'</span><span class="tag">'+c.kind+'</span><h3>'+c.name+'</h3><p style="max-width:560px"><b>'+c.headline+'</b></p></div><div style="text-align:right"><div class="big">'+fmt(c.total.clicks)+'</div><small>GSC 自然搜尋點擊（'+c.totalNote+'）<br>曝光 '+fmt(c.total.impressions)+'</small></div></div>'+
'<div style="margin-top:10px"><span class="note">點擊（長條）與曝光（折線）同圖；滑過或點選看當月數字</span></div><svg class="cs" viewBox="0 0 760 220"></svg>'+
(c.challenge?'<details><summary>挑戰與做法</summary><ul><li><b>背景：</b>'+c.challenge+'</li><li><b>做法：</b>'+c.strategy+'</li></ul></details>':'')+'<details><summary>客戶回饋與觀察</summary><ul>'+c.lines.map(function(l){return '<li>'+l+'</li>'}).join('')+'</ul></details><details><summary>對阿湯的參考</summary><ul><li>'+c.rel+'</li>'+c.take.map(function(l){return '<li>'+l+'</li>'}).join('')+'</ul><p class="note">資料更新 '+c.asOf+'；GSC 累計 '+c.totalNote+'</p></details>';
cb.appendChild(el);var svg=$('svg.cs',el),lab=c.monthly.map(function(m){return m[0].slice(2).replace('-','/')});
dual(svg,c.monthly)});

/* plans */
var PL=[{t:'一年方案',n:10,total:150000,m:12,pay:12,per:12500,avg:'12,500',fit:'先建立企業訂購專區與核心內容',list:['企業訂購專區與信任頁','10 篇 SEO 文章','每月成效報告']},
{t:'兩年方案',n:15,total:180000,m:24,pay:24,per:7500,avg:'7,500',fit:'持續擴充主題，跨過年節與檔期',list:['含一年方案全部內容','15 篇 SEO 文章（整份合約總量）','第二年依數據規劃下一批內容'],rec:1},
{t:'三年方案',n:20,total:240000,m:36,pay:24,per:10000,avg:'約 6,667',fit:'長期累積搜尋資產',list:['含兩年方案全部內容','20 篇 SEO 文章（整份合約總量）','跨年度比較成效與調整策略']}];
var pw=$('#plans'),pd=$('#pd'),sel2={};
PL.forEach(function(p,i){delete p.rec;var a=document.createElement('article');a.className='plan flip';a.style.setProperty('--d',(i*.15)+'s');a.setAttribute('role','checkbox');a.setAttribute('aria-checked','false');a.tabIndex=0;a.innerHTML='<div class="ck"><i></i><span>選這個方案</span></div><div class="t">'+p.t+' · '+p.n+' 篇</div><small>平均每月投入（未稅）</small><div class="p">'+(p.avg.indexOf('約')===0?'約 NT$'+p.avg.slice(1).trim():'NT$'+p.avg)+'</div><div class="a">整份合約總價 NT$'+fmt(p.total)+' 未稅</div><div class="r"><span>服務期間</span><b>'+p.m+' 個月</b></div><div class="r"><span>付款期數</span><b>最多 '+p.pay+' 期</b></div><div class="r"><span>每期金額</span><b>NT$'+fmt(p.per)+'</b></div><div class="r"><span>平均每篇</span><b>NT$'+fmt(Math.round(p.total/p.n))+'</b></div>';
function tog(){sel2[i]=!sel2[i];a.classList.toggle('on',!!sel2[i]);a.setAttribute('aria-checked',sel2[i]?'true':'false');show()}
a.onclick=tog;a.onkeydown=function(e){if(e.key===' '||e.key==='Enter'){e.preventDefault();tog()}};pw.appendChild(a)});
function show(){var on=PL.filter(function(p,i){return sel2[i]});
if(!on.length){pd.innerHTML='<p class="hint">勾選一個或多個方案，這裡會亮出各方案的內容與適合情境；可以同時選多個比較。</p>'}
else pd.innerHTML='<div class="pcols" style="--n:'+on.length+'">'+on.map(function(p){return '<div class="pcol"><b>'+p.t+'</b><div class="big2">NT$'+fmt(p.total)+' <small>未稅・'+p.n+' 篇・'+p.m+' 個月</small></div><p class="fit">適合：'+p.fit+'</p><ul>'+p.list.map(function(l){return '<li>'+l+'</li>'}).join('')+'</ul></div>'}).join('')+'</div>';
$$('#costv .row').forEach(function(r,i){r.classList.toggle('dim',on.length>0&&!sel2[i]);r.classList.toggle('lit',!!sel2[i])})}

/* faq */
var Q=[['SEO 多久看得到效果？','需要多個月的趨勢判讀，我們不承諾特定排名、流量或訂單；每月報告會用 Search Console 與詢問紀錄追蹤。'],['阿湯已有口碑，還需要 SEO 嗎？','口碑帶來回頭客與介紹；SEO 補的是第一次搜尋的人，尤其是想大量訂購、需要比較條件的企業客。'],['需要阿湯提供什麼？','餐盒與團購條件、獎項與檢驗文件、訂單與詢問紀錄；商品事實與圖片由阿湯確認，我們負責撰寫與上架。'],['Google 廣告包含在方案內嗎？','不包含。廣告費用與帳戶管理另計，可視預算再評估。'],['搜尋量準確嗎？','來自 Google Ads 關鍵字規劃工具的月平均估計，用來判斷優先順序，不等於實際流量。']];
var fq=$('#faq');Q.forEach(function(q){var b=document.createElement('button');b.type='button';b.innerHTML=q[0]+'<span>＋</span>';var d=document.createElement('div');d.textContent=q[1];b.onclick=function(){b.classList.toggle('open');b.lastChild.textContent=b.classList.contains('open')?'－':'＋'};fq.appendChild(b);fq.appendChild(d)});


/* top KPIs (count-up) */
var allK=[];D.cats.forEach(function(c){c.keywords.forEach(function(k){allK.push(k)})});
var totV=allK.reduce(function(s,k){return s+k.vol},0);
$('#topkpi').innerHTML=[[allK.length,'收錄關鍵字','pop'],[D.cats.length,'搜尋主題類別','pop'],[all['會議餐盒'].vol,'會議餐盒 月均搜尋','pop'],[all['聖誕大餐'].vol,'聖誕大餐 月均搜尋','pop']].map(function(k,i){return '<div class="pop" style="--d:'+i*.12+'s"><b id="tk'+i+'" data-n="'+k[0]+'">0</b><span>'+k[1]+'</span></div>'}).join('');

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


/* calculator */
var sel=$('#cKw');['會議餐盒','鹽焗雞','鹽焗雞腿','台中會議餐盒','冬至拜拜','聖誕大餐','普渡供品'].forEach(function(k){var o=document.createElement('option');o.value=k;o.textContent=k+'（'+fmt(all[k].vol)+'/月）';sel.appendChild(o)});
function calc(){var v=all[sel.value].vol,r1=+$('#r1').value,r2=+$('#r2').value,r3=+$('#r3').value,p=+$('#r4').value||0;$('#vR1').textContent=r1+'%';$('#vR2').textContent=r2+'%';$('#vR3').textContent=r3+'%';
var vis=Math.round(v*r1/100),inq=vis*r2/100,deal=inq*r3/100,rev=deal*p;$('#o1').textContent=fmt(v);$('#o2').textContent=fmt(vis);$('#o3').textContent=inq.toFixed(1);$('#o4').textContent=deal.toFixed(1);$('#o5').textContent='NT$'+fmt(Math.round(rev));}
['r1','r2','r3','r4'].forEach(function(id){$('#'+id).oninput=calc});sel.onchange=calc;
$$('.calc .chk button').forEach(function(b){b.onclick=function(){$$('.calc .chk button').forEach(function(x){x.classList.remove('on')});b.classList.add('on');$('#r1').value=b.getAttribute('data-r');calc()}});calc();

/* cost view */
var mx=Math.max.apply(null,PL.map(function(p){return p.total/p.m}));
$('#costv').innerHTML=PL.map(function(p){var mo=p.total/p.m;return '<div class="row"><b>'+p.t+'</b><div class="tr"><i style="--w:'+(mo/mx*100)+'%"></i></div><span>NT$'+fmt(Math.round(mo))+'/月 · 每篇 '+fmt(Math.round(p.total/p.n))+'</span></div>'}).join('');show();

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

/* 祭祀類略過 */
(function(){var RN='拜拜與祭祀全雞',ri=D.cats.map(function(c){return c.name}).indexOf(RN),skip=false,btn=$('#riteBtn');
function catSum(c){return c.keywords.reduce(function(s,k){return s+k.vol},0)}
function apply(){var cs=D.cats.filter(function(c){return !(skip&&c.name===RN)});
$$('.tab',ct)[ri].style.display=skip?'none':'';$$('#sseg button[data-rite]').forEach(function(b){b.style.display=skip?'none':''});$('#riteCard').style.display=skip?'none':'';
if(skip&&cur===ri){$$('.tab',ct)[0].click()}if(skip){var on=$('#sseg button.on');if(on&&on.hasAttribute('data-rite'))$$('#sseg button')[0].click()}
var n=cs.reduce(function(s,c){return s+c.keywords.length},0);$('#tk0').textContent=fmt(n);$('#tk1').textContent=fmt(cs.length);
bars($('#catchart'),cs.map(catSum),cs.map(function(c){return c.name}),{h:220,unit:' 次/月'});
btn.textContent=skip?'已略過祭祀類（再按一次恢復）':'不做祭祀類，略過這一部分';btn.classList.toggle('on',skip)}
btn.onclick=function(){skip=!skip;apply()}})();

})();
