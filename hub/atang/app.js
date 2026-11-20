(function(){
var D=window.PROPOSAL_DATA,$=function(s,r){return(r||document).querySelector(s)},$$=function(s,r){return[].slice.call((r||document).querySelectorAll(s))};
var fmt=function(n){return n==null?'尚未取得':n.toLocaleString('en-US')};
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

var P=[{"t": "經銷與批發通路", "s": "經銷商、團購主、餐飲通路", "who": "尋找適合長期銷售或採購的產品。關心產品定位、供貨穩定、合作方式與雙方責任。", "q": ["食品經銷", "食品批發", "團購主合作"], "steps": ["找到產品或合作入口", "了解產品與合作方向", "提供通路、品項與預計需求", "核對條件，再洽談合作"], "need": "產品資訊、可洽談合作對象、需求提交方式與聯絡入口。", "gap": "批發價、最低訂購量、供貨能力與合作區域，依實際條件個別確認。"}, {"t": "企業採購", "s": "企業團購、員工福利、送禮", "who": "替公司安排採購的人。關心適用場合、需求數量、預算、交期與對接方式。", "q": ["企業團購", "福委會團購", "企業送禮"], "steps": ["搜尋採購用途或產品", "查看企業採購資訊", "提出用途、數量、預算與時間", "確認報價與交付後訂購"], "need": "企業採購頁面，將員工團購、福利與贈禮需求分開說明。", "gap": "是否可分點寄送、禮盒包裝與付款方式，不預設已提供。"}, {"t": "宅配消費者", "s": "肉骨茶、蝦湯、鹽焗雞", "who": "想把產品買回家的人。關心買到什麼、怎麼吃、保存方式、配送與實際價格。", "q": ["肉骨茶料理包", "蝦湯宅配", "鹽焗雞宅配"], "steps": ["搜尋產品或料理需求", "了解商品型態與特色", "確認規格、保存、宅配條件", "到商城下單或先詢問"], "need": "產品頁、選購與料理內容、可確認的宅配資訊與商城入口。", "gap": "品類搜尋也包含餐廳與食譜；肉骨茶、蝦湯的宅配條件須先核定。"}];
var all={};D.cats.forEach(function(c){c.keywords.forEach(function(k){all[k.keyword]=k})});
var pt=$("#ptabs"),pp=$("#ppanes");
P.forEach(function(p,i){var b=document.createElement('button');b.className='tab'+(i?'':' on');b.innerHTML=p.t+'<small>'+p.s+'</small>';b.setAttribute('aria-pressed',i?'false':'true');b.onclick=function(){$$('.tab',pt).forEach(function(x){x.classList.remove('on');x.setAttribute('aria-pressed','false')});b.classList.add('on');b.setAttribute('aria-pressed','true');$$('.tabpane',pp).forEach(function(x,j){x.classList.toggle('on',j===i)})};pt.appendChild(b);
var d=document.createElement('div');d.className='tabpane'+(i?'':' on');
d.innerHTML='<div class="persona"><div class="box"><h3>'+p.t+'</h3><p>'+p.who+'</p><p style="margin-top:14px"><b>常見搜尋</b></p>'+p.q.map(function(q){var k=all[q];return '<span class="tag">'+q+(k?' · '+(k.vol==null?'搜尋量尚未取得':fmt(k.vol)+'/月'):'')+'</span>'}).join('')+'<p style="margin-top:12px"><b>需要的內容</b><br>'+p.need+'</p><p class="note">'+p.gap+'</p></div><div class="box"><h3>從搜尋到行動</h3><ol class="steps">'+p.steps.map(function(s){return '<li>'+s+'</li>'}).join('')+'</ol></div></div>';pp.appendChild(d)});

var G=[["產品資訊", "官網已有肉骨茶與蝦湯相關商品頁，但標題與規格資訊完整度不同。", "先確認實際販售型態，再補清楚產品名稱、內容物、規格與食用方式。", "優先"], ["合作分流", "目前檢視的導覽與商品入口，尚未清楚區分企業採購與經銷需求。", "可先共用合作頁，提供企業採購與經銷通路兩個需求入口。", "優先"], ["宅配條件", "現有鹽焗雞頁面有配送說明，不能直接推用到肉骨茶與蝦湯。", "逐品項核對保存、運送與接單條件，避免買家誤解。", "優先"], ["信任證據", "品牌、獎項與檢驗內容已有基礎，但適用品項需要對齊。", "清楚標示證據對應產品與年份，重要說明保留可核對入口。", "共用"], ["行動追蹤", "既有商城可購物；企業與經銷詢問需另辨識來源。", "先確認追蹤可行性，將商城點擊、有效詢問與成交分開記錄。", "共用"], ["餐盒定位", "餐盒保留為輔助業務，不以搜尋量作為這次資源核心。", "以地推、企業拜訪與既有客群推廣承接；網站保留基本資訊即可。", "輔助"]];
var gg=$('#gaps');G.forEach(function(g){var a=document.createElement('article');a.className='card gap';a.innerHTML='<div class="st">'+g[3]+'</div><h3>'+g[0]+'</h3><p>'+g[1]+'</p><div class="more"><b>建議做法</b><br>'+g[2]+'</div>';a.tabIndex=0;a.setAttribute('role','button');a.setAttribute('aria-expanded','false');function toggleGap(){a.classList.toggle('open');a.setAttribute('aria-expanded',a.classList.contains('open')?'true':'false')}a.onclick=toggleGap;a.onkeydown=function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();toggleGap()}};gg.appendChild(a)});


/* keywords: null is unknown, never zero-filled */
var ct=$('#ctabs'),cur=0,sortK='vol',asc=false,selKw=null;
function markButtons(root,active){$$('button',root).forEach(function(b){var on=b===active;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on?'true':'false')})}
D.cats.forEach(function(c,i){var b=document.createElement('button');b.type='button';b.className='tab'+(i?'':' on');b.setAttribute('aria-pressed',i?'false':'true');b.innerHTML=c.name+'<small>'+c.keywords.length+' 字</small>';b.onclick=function(){cur=i;selKw=null;markButtons(ct,b);renderK()};ct.appendChild(b)});
function moneyRange(k){if(k.low==null&&k.hi==null)return '尚未取得';return(k.low==null?'尚未取得':fmt(k.low))+'～'+(k.hi==null?'尚未取得':fmt(k.hi))}
function renderK(){var c=D.cats[cur],ks=c.keywords.slice();ks.sort(function(a,b){var x=a[sortK],y=b[sortK];if(x==null)return y==null?0:1;if(y==null)return -1;if(typeof x==='string')return asc?x.localeCompare(y,'zh-Hant'):y.localeCompare(x,'zh-Hant');return asc?x-y:y-x});
$('#cdesc').textContent=c.description;var known=ks.filter(function(k){return k.vol!=null}),top=known.slice().sort(function(a,b){return b.vol-a.vol})[0];
$('#ckpi').innerHTML='<div><b>'+ks.length+'</b><span>本群集研究字</span></div><div><b>'+known.length+'</b><span>有搜尋量資料</span></div><div><b>'+(ks.length-known.length)+'</b><span>尚未取得搜尋量</span></div><div><b>'+fmt(top&&top.vol)+'</b><span>'+(top?'最高：'+top.keyword:'尚無量體資料')+'</span></div>';
$('#ktb').innerHTML=ks.map(function(k){return '<tr class="kr'+(selKw===k.keyword?' sel':'')+'" data-k="'+k.keyword+'" tabindex="0"><td><b>'+k.keyword+'</b></td><td class="vol">'+fmt(k.vol)+'</td><td>'+k.intent+'</td><td>'+(k.comp||'尚未取得')+'<small>'+(k.idx==null?'':' ／ '+k.idx)+'</small></td><td>'+moneyRange(k)+'</td></tr>'}).join('');
$$('#ktb tr').forEach(function(row){function pick(){selKw=row.getAttribute('data-k');$$('#ktb tr').forEach(function(x){x.classList.remove('sel')});row.classList.add('sel');drawM(all[selKw])}row.onclick=pick;row.onkeydown=function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();pick()}}});
drawM(selKw?all[selKw]:(top||ks[0]));}
function drawM(k){$('#mtitle').textContent='「'+k.keyword+'」逐月搜尋量';var svg=$('#mchart');if(!k.monthly.length){svg.innerHTML='';svg.style.display='none';$('#msub').textContent='2026/11/20 已查詢，逐月資料尚未取得；不以近似字替代，也不補 0。';return}svg.style.display='';var pk=k.monthly.indexOf(Math.max.apply(null,k.monthly));$('#msub').textContent=D.meta.period+'；月均 '+fmt(k.vol)+'；高峰 '+ML[pk]+'（'+fmt(k.monthly[pk])+'）。'+(k.keyword==='檳城蝦麵'?'2026/10 明顯升高，原因尚未核實，不能視為穩定宅配需求。':'');bars(svg,k.monthly,ML,{hi:pk,unit:' 次',w:600,h:320});}
$$('th.s').forEach(function(th){th.tabIndex=0;function sort(){var k=th.getAttribute('data-k');if(sortK===k)asc=!asc;else{sortK=k;asc=k==='keyword'||k==='idx'}renderK()}th.onclick=sort;th.onkeydown=function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();sort()}}});renderK();
var flat=D.cats.flatMap(function(c){return c.keywords});
$('#topkpi').innerHTML=[[flat.length,'研究字詞'],[flat.filter(function(k){return k.vol!=null}).length,'有搜尋量資料'],[all['肉骨茶料理包'].vol,'肉骨茶料理包／月'],[all['企業團購'].vol,'企業團購／月']].map(function(k){return '<div class="pop"><b data-n="'+k[0]+'">'+fmt(k[0])+'</b><span>'+k[1]+'</span></div>'}).join('');
function drawS(k){var x=all[k],pk=x.monthly.indexOf(Math.max.apply(null,x.monthly));bars($('#sschart'),x.monthly,ML,{hi:pk,unit:' 次'});$('#seasonNote').textContent=k+'：月均 '+fmt(x.vol)+'；期間 '+D.meta.period+(k==='檳城蝦麵'?'。2026/10 突增至 5,400，原因未核實，非宅配訂單證據。':'。市場估計，不等於本案流量。')}
$$('#sseg button').forEach(function(b){b.onclick=function(){markButtons($('#sseg'),b);drawS(b.dataset.k)}});drawS('肉骨茶料理包');
$('#researchInsights').innerHTML=[['肉骨茶','27,100 ≠ 宅配買家','品類月均 27,100；料理包 210、調理包 140、冷凍包 10。字詞不能相加，商品型態與搜尋意圖要先分清楚。'],['蝦湯','先說清楚賣什麼','蝦湯 320、檳城蝦麵 720；蝦湯宅配尚未取得。先核對湯底、調理食品或含麵產品，再規劃產品頁。'],['B2B','量小，仍要有承接入口','企業團購 50、食品經銷 10。食品批發 1,900 範圍很廣；經銷與企業詢問品質，不能只用量體判斷。']].map(function(x){return '<article class="card fx"><div class="num">'+x[0]+'</div><h3>'+x[1]+'</h3><p>'+x[2]+'</p></article>'}).join('');

/* intent exploration */
var intents=[['產品購買','想找商品，但仍要分辨型態','肉骨茶料理包、肉骨茶冷凍包、鹽焗雞宅配','產品頁與選購說明：買到什麼、怎麼吃、怎麼買。','連到對應商城商品；產品條件不足時先詢問。'],['商業採購','想找貨源或採購方案，也可能是供應商在找通路','食品經銷、企業團購、福委會團購、團購主合作','合作資訊先分企業與經銷，讓對方帶著具體需求聯繫。','辨認身分、用途與數量；詢問不等於已簽合作。'],['內容教育','先解決問題，可能之後才考慮商品','肉骨茶做法、蝦湯料理、鹽焗雞做法','回答料理、型態差異與食用問題，再自然連到相關商品。','看閱讀與商品入口行動，不把每次閱讀當作購買意圖。']];
intents.forEach(function(x,i){var b=document.createElement('button');b.type='button';b.className='tab';b.textContent=x[0];b.onclick=function(){markButtons($('#intentTabs'),b);$('#intentBox').innerHTML='<h3>'+x[1]+'</h3><p><b>搜尋例子：</b>'+x[2]+'</p><p><b>內容承接：</b>'+x[3]+'</p><p><b>下一步：</b>'+x[4]+'</p>'};$('#intentTabs').appendChild(b);if(!i)b.click()});
/* cases */
var cb=$('#cases');
D.cases.forEach(function(c){var el=document.createElement('article');el.className='card case '+(D.cases.indexOf(c)%2?'slide-r':'slide-l');
el.innerHTML='<div class="top"><div><span class="tag">'+c.group+'</span><span class="tag">'+c.kind+'</span><h3>'+c.name+'</h3><p style="max-width:560px"><b>'+c.headline+'</b></p></div><div style="text-align:right"><div class="big">'+fmt(c.total.clicks)+'</div><small>GSC 自然搜尋點擊（'+c.totalNote+'）<br>曝光 '+fmt(c.total.impressions)+'</small></div></div>'+
'<div style="margin-top:10px"><span class="note">點擊（長條）與曝光（折線）同圖；滑過或點選看當月數字；手機圖表可左右滑動</span></div><div class="case-chart-scroll"><svg class="cs" viewBox="0 0 760 220" role="img" aria-label="案例自然搜尋點擊與曝光"></svg></div>'+
(c.challenge?'<details><summary>挑戰與做法</summary><ul><li><b>背景：</b>'+c.challenge+'</li><li><b>做法：</b>'+c.strategy+'</li></ul></details>':'')+'<details><summary>客戶回饋與觀察</summary><ul>'+c.lines.map(function(l){return '<li>'+l+'</li>'}).join('')+'</ul></details><details><summary>對阿湯的參考</summary><ul><li>'+c.rel+'</li>'+c.take.map(function(l){return '<li>'+l+'</li>'}).join('')+'</ul><p class="note">資料更新 '+c.asOf+'；GSC 累計 '+c.totalNote+'</p></details>';
var detail=document.createElement('details');detail.innerHTML='<summary>完整月份資料與統計口徑</summary><p>'+c.name+'：資料更新 '+c.asOf+'；圖表月份 '+c.monthly[0][0]+' 至 '+c.monthly[c.monthly.length-1][0]+'，累計範圍 '+c.totalNote+'。'+(c.id==='fengcang'?'首尾月份為不完整月份。':'')+'</p><div class="tw"><table><thead><tr><th>月份</th><th>自然搜尋點擊</th><th>自然搜尋曝光</th></tr></thead><tbody>'+c.monthly.map(function(m){return '<tr><td>'+m[0]+(c.id==='fengcang'&&(m[0]==='2025-05'||m[0]==='2026-09')?'（不完整）':'')+'</td><td>'+fmt(m[1])+'</td><td>'+fmt(m[2])+'</td></tr>'}).join('')+'</tbody></table></div>';el.appendChild(detail);cb.appendChild(el);var svg=$('svg.cs',el),lab=c.monthly.map(function(m){return m[0].slice(2).replace('-','/')});
dual(svg,c.monthly)});

/* plans */
var PL=[{t:'一年方案',n:8,total:120000,m:12,pay:12,per:10000,avg:'10,000',list:['產品與合作入口、信任內容依約定範圍','8 篇 SEO 文章（整份合約總量）','網站正式上線後每月一篇，至約定總篇數完成','服務期間每月成效報告']},
{t:'兩年方案',n:10,total:150000,m:24,pay:24,per:6250,avg:'6,250',list:['產品與合作入口、信任內容依約定範圍','10 篇 SEO 文章（整份合約總量）','網站正式上線後每月一篇，至約定總篇數完成','服務期間每月成效報告']},
{t:'三年方案',n:15,total:180000,m:36,pay:24,per:7500,avg:'5,000',list:['產品與合作入口、信任內容依約定範圍','15 篇 SEO 文章（整份合約總量）','網站正式上線後每月一篇，至約定總篇數完成','服務期間每月成效報告']}];
var pw=$('#plans'),pd=$('#pd'),selectedPlans={};
PL.forEach(function(p,i){var a=document.createElement('article');a.className='plan flip';a.style.setProperty('--d',(i*.15)+'s');a.setAttribute('role','checkbox');a.setAttribute('aria-checked','false');a.tabIndex=0;a.innerHTML='<div class="ck"><i></i><span>選這個方案</span></div><div class="t">'+p.t+' · '+p.n+' 篇</div><small>平均每月投入（未稅）</small><div class="p">'+(p.avg.indexOf('約')===0?'約 NT$'+p.avg.slice(1).trim():'NT$'+p.avg)+'</div><div class="a">整份合約總價 NT$'+fmt(p.total)+' 未稅</div><div class="r"><span>服務期間</span><b>'+p.m+' 個月</b></div><div class="r"><span>付款期數</span><b>最多 '+p.pay+' 期</b></div><div class="r"><span>每期金額</span><b>NT$'+fmt(p.per)+'</b></div><div class="r"><span>平均每篇</span><b>NT$'+fmt(Math.round(p.total/p.n))+'</b></div>';
function tog(){selectedPlans[i]=!selectedPlans[i];a.classList.toggle('on',!!selectedPlans[i]);a.setAttribute('aria-checked',selectedPlans[i]?'true':'false');show()}
a.onclick=tog;a.onkeydown=function(e){if(e.key===' '||e.key==='Enter'){e.preventDefault();tog()}};pw.appendChild(a)});
function show(){var on=PL.filter(function(p,i){return selectedPlans[i]});
if(!on.length){pd.innerHTML='<p class="hint">勾選一個或多個方案，這裡會顯示各方案的服務期間與文章總量；可以同時選多個比較。</p>'}
else pd.innerHTML='<div class="pcols" style="--n:'+on.length+'">'+on.map(function(p){return '<div class="pcol"><b>'+p.t+'</b><div class="big2">NT$'+fmt(p.total)+' <small>未稅・'+p.n+' 篇・'+p.m+' 個月</small></div><ul>'+p.list.map(function(l){return '<li>'+l+'</li>'}).join('')+'</ul></div>'}).join('')+'</div>';
$$('#costv .row').forEach(function(r,i){r.classList.toggle('dim',on.length>0&&!selectedPlans[i]);r.classList.toggle('lit',!!selectedPlans[i])})}


/* FAQ */
var Q=[['SEO 多久看得到效果？','以多月趨勢、內容上線時間與季節綜合判讀，不以固定月份保證排名、詢問或訂單；每月回報交付與實際資料。'],['每月約一萬元可以全部一起做嗎？','先在原方案約定範圍內排優先順序，共用產品與信任資訊；不默認增加商城、經銷管理或業務開發服務。'],['肉骨茶與蝦湯的資料怎麼準備？','阿湯確認產品型態、規格、售價、保存與宅配條件，並提供圖片；批發價、最低量與供貨能力另依合作模式核對。'],['為什麼 B2B 字量小還要規劃？','少量搜尋也可能來自採購對象；廣泛字也可能不適合本案。以產品適配、有效詢問與實際接單條件一起判斷，不只看流量。'],['餐盒還會經營嗎？','保留為輔助業務，以地推、企業拜訪與既有客群推廣為主，本次 SEO 文章優先處理產品宅配與 B2B 需求。'],['Google 廣告與商品大量建檔包含嗎？','廣告費用、廣告帳戶管理、全站逐件商品建檔與大量文案改寫不默認包含，新增工作先確認範圍。']];
Q.forEach(function(q){var b=document.createElement('button');b.type='button';b.setAttribute('aria-expanded','false');b.innerHTML=q[0]+'<span>＋</span>';var d=document.createElement('div');d.textContent=q[1];b.onclick=function(){b.classList.toggle('open');b.setAttribute('aria-expanded',b.classList.contains('open')?'true':'false');b.lastChild.textContent=b.classList.contains('open')?'－':'＋'};$('#faq').appendChild(b);$('#faq').appendChild(d)});
/* AI evidence */
var CT=[['回答完整','分別回答買家與合作對象的問題',['產品型態、食用方式、宅配條件，以核定資料為準','企業與經銷需求分流，說明怎麼提出具體詢問','用完整問題與直接答案幫助搜尋與 AI 理解']],['有證據','每個主張對回適用產品',['品牌故事、製作資訊與可核對的照片','獎項與檢驗標示年份、範圍及對應品項','不把鹽焗雞的證據直接套用所有新品']],['資訊一致','商品與合作資訊前後一致',['官網與商城的商品名稱、內容物與規格一致','配送與付款資訊由阿湯核定後統一更新','結構化資料必須對應頁面可見內容']],['被別人提到','累積可核對的外部資訊',['合法可公開的媒體、獎項單位與合作紀錄','有內容與來源的客戶回饋','不以虛構評價或保證引用作為做法']]];
CT.forEach(function(c,i){var b=document.createElement('button');b.type='button';b.textContent=(i+1)+'　'+c[0];b.onclick=function(){markButtons($('#cites'),b);$('#citeBox').innerHTML='<h3>'+c[1]+'</h3><ul>'+c[2].map(function(x){return '<li>'+x+'</li>'}).join('')+'</ul>'};$('#cites').appendChild(b);if(!i)b.click()});

/* three independent calculator modes; unknown commercial inputs stay blank */
var modes=[{name:'宅配消費者',title:'宅配購買情境',keys:['肉骨茶料理包','肉骨茶調理包','肉骨茶冷凍包','肉骨茶宅配','蝦湯宅配','鹽焗雞宅配'],scope:'優先使用有商品意圖的詞；宅配長尾缺值時不試算，不借用品類大詞。',condition:'規格、售價與宅配條件須先確認。購買比例與客單價都是假設，實際購買以訂單核對。'},{name:'企業採購',title:'企業詢問情境',keys:['企業團購','公司團購','福委會團購','企業送禮'],scope:'企業送禮不只包含食品；此處僅為單一字詞條件試算，不代表全部搜尋都適合阿湯。',condition:'需確認數量、預算、包裝與交期。首次成交比例與採購金額未確認前，不試算營收；不包含後續回購。'},{name:'經銷與批發',title:'經銷合作詢問情境',keys:['食品經銷','食品經銷合作','食品批發','團購主合作'],scope:'食品批發範圍廣；團購主合作也可能是廠商在找通路，不可把全部量體當作經銷買家。',condition:'批發價、最低量、毛利、供貨與回購均未確認。只推演詢問與選填的首次採購，不計算長期經銷價值。'}];
var calcIndex=0,states=modes.map(function(m){return{key:m.keys[0],entry:5,action:1,close:'',amount:''}}),sel=$('#cKw');
function stash(){var st=states[calcIndex];st.key=sel.value;st.entry=$('#r1').value;st.action=$('#r2').value;st.close=$('#r3').value;st.amount=$('#r4').value}
function calc(){var m=modes[calcIndex],k=all[sel.value],v=k?k.vol:null,entry=+$('#r1').value,action=+$('#r2').value,close=$('#r3').value,amount=$('#r4').value;
$('#vR1').textContent=entry+'%';$('#vR2').textContent=action+'%';$('#o1').textContent=fmt(v);$('#calcConditions').textContent=m.condition;
var visits=v==null?null:v*entry/100,actions=visits==null?null:visits*action/100,closed=calcIndex===0?actions:(close.trim()===''?null:actions==null?null:actions*(+close)/100);
var invalid=(!Number.isFinite(+close)||+close<0||+close>100||!Number.isFinite(+amount)||+amount<0);
function out(n){return n==null?'尚未試算':n.toLocaleString('en-US',{maximumFractionDigits:2})}
$('#o2').textContent=out(visits);$('#o3').textContent=out(actions);$('#o4').textContent=calcIndex===0?'依實際訂單':invalid?'請檢查輸入':out(closed);$('#o5').textContent=invalid?'請輸入有效金額與 0–100% 比例':amount.trim()===''||closed==null?'尚未試算':'NT$'+out(closed*(+amount));stash();}
function setMode(i){if(sel.options.length)stash();calcIndex=i;var m=modes[i],st=states[i];markButtons($('#calcModes'),$$('#calcModes button')[i]);$('#calcTitle').textContent=m.title;$('#calcScope').textContent=m.scope;sel.innerHTML=m.keys.map(function(k){return '<option value="'+k+'">'+k+'（'+fmt(all[k].vol)+'/月）</option>'}).join('');sel.value=st.key;$('#r1').value=st.entry;$('#r2').value=st.action;$('#r3').value=st.close;$('#r4').value=st.amount;$('#b2bClose').hidden=i===0;$('#r2Label').firstChild.textContent=i===0?'假設：進站後購買比例 ':'假設：進站後詢問比例 ';$('#r4Label').textContent=i===0?'假設：平均訂單金額（NT$，選填）':'假設：首次採購金額（NT$，選填）';$('#o3Label').textContent=i===0?'假設購買／月':'假設詢問／月';$('#o4Label').textContent=i===0?'條件確認':'假設首次成交／月';calc();}
modes.forEach(function(m,i){var b=document.createElement('button');b.type='button';b.className='tab';b.textContent=m.name;b.onclick=function(){setMode(i)};$('#calcModes').appendChild(b)});
['r1','r2','r3','r4'].forEach(function(id){$('#'+id).oninput=calc});sel.onchange=calc;$('#calcReset').onclick=function(){states[calcIndex]={key:modes[calcIndex].keys[0],entry:5,action:1,close:'',amount:''};sel.innerHTML='';setMode(calcIndex)};setMode(0);
/* cost view */
var mx=Math.max.apply(null,PL.map(function(p){return p.total/p.m}));
$('#costv').innerHTML=PL.map(function(p){var mo=p.total/p.m;return '<div class="row"><b>'+p.t+'</b><div class="tr"><i style="--w:'+(mo/mx*100)+'%"></i></div><span>NT$'+fmt(Math.round(mo))+'/月 · 每篇 '+fmt(Math.round(p.total/p.n))+'</span></div>'}).join('');show();

/* floating nav + reveal */
var np=$('#fnavPanel'),ns=$$('.panel');ns.forEach(function(s){var a=document.createElement('a');a.href='#'+s.id;a.textContent=s.getAttribute('data-title');a.onclick=function(){$('#fnav').classList.remove('open');$('#fnavBtn').setAttribute('aria-expanded','false')};np.appendChild(a)});
$('#fnavBtn').setAttribute('aria-expanded','false');$('#fnavBtn').onclick=function(){$('#fnav').classList.toggle('open');this.setAttribute('aria-expanded',$('#fnav').classList.contains('open')?'true':'false')};document.addEventListener('keydown',function(e){if(e.key==='Escape'){$('#fnav').classList.remove('open');$('#fnavBtn').setAttribute('aria-expanded','false')}});
var ticking=false;addEventListener('scroll',function(){if(ticking)return;ticking=true;requestAnimationFrame(function(){ticking=false;var cur=ns[0].id;ns.forEach(function(s){if(s.getBoundingClientRect().top<innerHeight*.4)cur=s.id});$$('a',np).forEach(function(a){a.classList.toggle('on',a.getAttribute('href')==='#'+cur)})})},{passive:true});
function countUp(el){var n=+el.getAttribute('data-n'),t0=null;(function f(t){if(!t0)t0=t;var p=Math.min((t-t0)/900,1);el.textContent=fmt(Math.round(n*(1-Math.pow(1-p,3))));if(p<1)requestAnimationFrame(f)})(performance.now())}
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
$$('[data-n]').forEach(function(e){if(reduce)e.textContent=fmt(+e.getAttribute('data-n'))});
var revealSelector='.fx,.pop,.flip,.slide-l,.slide-r,.cost';
$$('.card,.flow>div,.chartbox,.stats>div,.kpis>div,.timeline>div,.term').forEach(function(e){if(!e.matches('.fx,.pop,.flip,.slide-l,.slide-r')&&!e.closest('.fx,.pop,.flip,.slide-l,.slide-r'))e.classList.add('fx')});
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');$$('[data-n]',e.target).forEach(function(n){if(!reduce)countUp(n)});if(e.target.hasAttribute&&e.target.hasAttribute('data-n')&&!reduce)countUp(e.target);io.unobserve(e.target)}})},{threshold:.08,rootMargin:'0px 0px -4% 0px'});
$$(revealSelector).forEach(function(e,i){e.style.setProperty('--d',e.style.getPropertyValue('--d')||((i%4)*.08)+'s');io.observe(e)});


})();
