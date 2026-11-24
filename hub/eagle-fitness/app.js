(function(){
"use strict";
var D=window.DATA;
function $(s,r){return (r||document).querySelector(s)}
function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))}
function esc(t){return String(t).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function fmt(n){return n.toLocaleString("en-US")}

/* ---------- 通用頁籤 ---------- */
function tabs(tabsId,items,render,def){
  var box=$("#"+tabsId); if(!box)return;
  box.innerHTML=items.map(function(it,i){return '<button class="chip" role="tab" data-i="'+i+'" aria-selected="'+(i===(def||0))+'">'+esc(it.label)+'</button>'}).join("");
  function sel(i){
    $$("button",box).forEach(function(b){b.setAttribute("aria-selected",String(+b.dataset.i===i))});
    render(items[i],i);
  }
  box.addEventListener("click",function(e){var b=e.target.closest("button");if(b)sel(+b.dataset.i)});
  box.addEventListener("keydown",function(e){
    if(e.key!=="ArrowRight"&&e.key!=="ArrowLeft")return;
    var cur=$$("button",box).findIndex(function(b){return b.getAttribute("aria-selected")==="true"});
    var n=(cur+(e.key==="ArrowRight"?1:-1)+items.length)%items.length;
    sel(n);$$("button",box)[n].focus();e.stopPropagation();e.preventDefault();
  });
  sel(def||0);
}

/* ---------- 第一章 ---------- */
var personas=[
 {label:"路徑一：從社群認識",html:'<h3>小雅，29 歲，台中上班族（虛構）</h3><ol class="steps"><li><b>滑到一支教練示範 TRX 的短影片</b><br><span class="small">覺得有趣，追蹤了粉絲專頁。目前沒有健身計畫。</span></li><li><b>幾週後又看到學員分享</b><br><span class="small">開始對「也許我也可以試試」有感覺，信任慢慢累積。</span></li><li><b>仍停在「有興趣」，需要一個再往前一步的契機</b><br><span class="small">社群讓她認識品牌，但還不一定知道怎麼開始。</span></li></ol>'},
 {label:"路徑二：從 Google 找到",html:'<h3>同一位小雅，某天晚上下班後（虛構）</h3><ol class="steps"><li><b>她搜尋「健身新手需要請教練嗎」</b><br><span class="small">這時她已經有明確需求，正在找答案。</span></li><li><b>點進一篇完整回答的文章</b><br><span class="small">文章最後連到「TRX 適合新手嗎」與教練介紹頁。</span></li><li><b>回頭看社群，發現這個品牌她早就追蹤了</b><br><span class="small">官網提供館別與預約體驗入口，她在同一晚留下諮詢。</span></li></ol>'}
];
tabs("persona-tabs",personas,function(p){$("#persona-panel").innerHTML=p.html});

var stages=[
 {label:"認識與好奇",soc:"看到教練示範、學員分享、空間氛圍，產生「好像不錯」的感覺。",goo:"搜尋「如何改善體態」「TRX 是什麼」，尋找基本知識。",mid:"社群先建立好感；搜尋提供入門解答，兩者互相補強。"},
 {label:"比較與評估",soc:"回頭翻看過往貼文與學員留言，判斷這裡適不適合。",goo:"搜尋「私人教練怎麼選」「健身教練費用」，比較不同方案。",mid:"這是最需要完整頁面的階段：教練、課程、費用說明。"},
 {label:"決定與行動",soc:"私訊詢問，或看到活動優惠而行動。",goo:"搜尋「台中健身教練」「一中健身房」，直接找地址與預約方式。",mid:"官網館別頁與預約入口，負責把決定變成預約。"}
];
tabs("stage-tabs",stages,function(s){$("#stage-panel").innerHTML='<div class="panel"><h3>社群</h3><p>'+s.soc+'</p></div><div class="panel"><h3>Google 搜尋</h3><p>'+s.goo+'</p><p class="note" style="margin-top:6px">'+s.mid+'</p></div>'});

var assets=[
 {label:"教練專業介紹頁",from:"社群上的教練日常、上課示範、專業背景",to:"每位教練一頁：專長、證照與經歷、帶領的課程、適合的學員。可被「台中健身教練推薦」這類搜尋找到。"},
 {label:"課程服務頁面",from:"TRX 懸吊、核心訓練、體態雕塑等課程貼文",to:"每種課程一頁：適合誰、怎麼上課、一堂課的流程、如何預約體驗。"},
 {label:"SEO 專業文章",from:"教練在貼文與影片中常解答的問題",to:"把常見問題寫成完整文章，例如「TRX 適合健身新手嗎」「如何降低體脂率」。"},
 {label:"FAQ 常見問題",from:"學員在留言與私訊中反覆詢問的事",to:"整理成問答頁，並放在課程頁與館別頁下方，降低詢問門檻。"},
 {label:"學員故事（需授權）",from:"學員分享的改變與心得",to:"經學員同意後，整理成故事頁，說明目標、過程與感受，不使用未授權的前後對照。"},
 {label:"分館專屬頁面",from:"各館的地點、空間與教練資訊",to:"每館一頁：地址、交通、停車、時段、該館教練與課程，與 Google 商家資料一致。"}
];
tabs("asset-tabs",assets,function(a){$("#asset-panel").innerHTML='<div class="grid g2"><div><div class="small">現有素材</div><h3>'+a.from+'</h3></div><div><div class="small">可延伸成</div><p><b>'+a.label+'</b></p><p>'+a.to+'</p></div></div>'});

/* ---------- 第二章 情境 ---------- */
var scenes=[
 {label:"台中健身教練推薦",seo:"自然搜尋結果列出多個頁面：教練介紹頁、館別頁、文章。",aio:"AI 摘要整理「怎麼選教練」的重點，並附上參考來源。",geo:"AI 問答回覆時，可能提到幾個品牌與選擇方式。"},
 {label:"健身新手需要請教練嗎",seo:"文章頁回答「需不需要」，並比較自學與請教練的差別。",aio:"摘要列出判斷重點，連結到有完整說明的頁面。",geo:"AI 回答會整理常見建議，若品牌有清楚的內容，較有機會被提及。"},
 {label:"如何降低體脂率",seo:"專業文章解釋原理、飲食與訓練的搭配。",aio:"摘要整理步驟，來源頁面需要資訊正確、說明清楚。",geo:"AI 回答偏重通則，品牌可透過專業內容建立可信度。"},
 {label:"TRX 適合健身新手嗎",seo:"課程頁與文章回答適合對象、動作難度與注意事項。",aio:"摘要簡述 TRX 特性，並列出參考頁面。",geo:"這是 Eagle Fitness 的特色領域，專業內容越完整，越容易被當成資料來源。"},
 {label:"我沒有健身經驗，台中有哪些適合新手的健身工作室？",seo:"館別頁、課程頁與文章一同出現的機會。",aio:"摘要可能整理選擇條件，不一定列出店名。",geo:"AI 可能直接列出幾間工作室，內容完整一致的品牌較容易被整理進去。"}
];
tabs("scene-tabs",scenes,function(s){$("#scene-panel").innerHTML=
 ['SEO｜自然搜尋結果:'+s.seo,'AIO｜Google AI 摘要:'+s.aio,'GEO｜生成式 AI 問答:'+s.geo].map(function(t){var p=t.split(":");return '<div class="panel"><span class="tag sim">示意</span><h3 style="margin-top:8px">'+p[0]+'</h3><p>'+p.slice(1).join(":")+'</p></div>'}).join("")});

/* ---------- 第三章 Ultra ---------- */
var U=D.ultra,arts=U.articles;
var clusters=[["費用與選擇",["/articles/gymfees","/articles/gymonthlyfee","/articles/personaltrainingfee","/articles/txggymdaypass","/articles/dropingym"]],["器材與教練課",["/articles/fitnessequipment","/articles/gymcpt"]],["皮拉提斯",["/articles/txgpilates","/articles/pilatescost","/articles/pilates","/articles/pilatescourse","/articles/yogalates"]],["場租與在地",["/articles/opengymarea","/articles/top5taichunggym","/articles/gymrecations","/articles/nantungym"]]];
$("#ultra-clusters").innerHTML='<div class="grid g4">'+clusters.map(function(c){return '<div class="rule"><h3>'+c[0]+'（'+c[1].length+' 篇）</h3>'+c[1].map(function(p){var a=arts.filter(function(x){return x.path===p})[0];return '<div class="small">'+esc(a?a.title:p)+'　'+esc(a?a.pub:"")+'</div>'}).join("")+'</div>'}).join("")+'</div>';
var s=U.site;
var L=U.live;$("#ultra-stats").innerHTML=[[fmt(L.clicks),"Google 搜尋點擊"],[L.impLabel,"Google 搜尋曝光"],[L.pos.toFixed(1),"平均排名"],["660","單月最高點擊（2026/07）"]].map(function(x){return '<div class="rule"><div class="bigstat">'+x[0]+'</div><div class="statlabel">'+x[1]+'</div></div>'}).join("");
tabs("ultra-mtabs",[{label:"每月點擊",k:1},{label:"每月曝光",k:2}],function(it){var k=it.k,m=Math.max.apply(null,L.months.map(function(x){return x[k]}));$("#ultra-mchart").innerHTML='<div class="vbars">'+L.months.map(function(x){return '<div class="vb"><span class="vn">'+fmt(x[k])+'</span><div class="vbar grow" style="height:'+Math.max(2,x[k]/m*100)+'%"></div><span class="vl">'+x[0].slice(2)+'</span></div>'}).join("")+'</div>'});
var sortKey="clicks",sortDir=-1;
function drawTable(){
 var rows=arts.slice().sort(function(a,b){var x=a[sortKey],y=b[sortKey];if(typeof x==="string")return sortDir*x.localeCompare(y);return sortDir*(x-y)});
 var max=Math.max.apply(null,arts.map(function(a){return a.clicks}));
 function th(k,l,n){return '<th class="'+(n?"n":"")+'"><button data-k="'+k+'" aria-sort="'+(sortKey===k?(sortDir<0?"descending":"ascending"):"none")+'">'+l+'</button></th>'}
 $("#ultra-table").innerHTML='<thead><tr>'+th("title","頁面")+th("pub","發布日")+th("clicks","點擊",1)+th("imp","曝光",1)+th("pos","平均排名",1)+'<th>點擊分布</th></tr></thead><tbody>'+rows.map(function(a){return '<tr><td><a href="'+a.url+'" target="_blank" rel="noopener">'+esc(a.title)+'</a></td><td>'+esc(a.pub)+'</td><td class="n">'+fmt(a.clicks)+'</td><td class="n">'+fmt(a.imp)+'</td><td class="n">'+a.pos+'</td><td style="width:22%"><div class="bar" style="width:'+Math.max(1,a.clicks/max*100)+'%"></div></td></tr>'}).join("")+'</tbody>';
}
$("#ultra-table").addEventListener("click",function(e){var b=e.target.closest("button[data-k]");if(!b)return;var k=b.dataset.k;if(sortKey===k)sortDir*=-1;else{sortKey=k;sortDir=(k==="title"||k==="pub"||k==="pos")?1:-1}drawTable()});
drawTable();
var artInfo={"/articles/gymfees":{q:"健身房費用總整理！去一次健身房多少錢？健身房費用方案怎麼選？",why:"費用是新手第一個會搜尋的問題，也是比較階段的核心。"},"/articles/fitnessequipment":{q:"健身房器材看起來都一樣？15 種健身房器材，新手必懂的使用技巧",why:"新手對器材的陌生感，被轉成一個可以搜尋的知識主題。"},"/articles/txgpilates":{q:"台中皮拉提斯教室怎麼選？課程類型、費用區間、師資專業度一次看懂！",why:"結合在地與選擇條件，接近行動階段的搜尋。"},"/articles/personaltrainingfee":{q:"健身房教練費用怎麼選？價格、課程與健身教練挑選 5 建議一次看懂",why:"直接對應「教練要花多少錢、怎麼選」的比較需求。"},"/articles/gymcpt":{q:"我應該買健身房教練課嗎？6 個關鍵問題幫你判斷",why:"回答「值不值得」的猶豫，是教練課最常見的疑慮。"}};
var artKeys=["/articles/gymfees","/articles/fitnessequipment","/articles/txgpilates","/articles/personaltrainingfee","/articles/gymcpt"];
tabs("art-tabs",artKeys.map(function(p){var a=arts.filter(function(x){return x.path===p})[0];return {label:a.title,a:a,info:artInfo[p]}}),function(it){
 var a=it.a;
 $("#art-panel").innerHTML='<div class="grid g2"><div><div class="small">文章標題</div><h3><a href="'+a.url+'" target="_blank" rel="noopener">'+esc(it.info.q)+'</a></h3><p>'+it.info.why+'</p><p class="small">發布日 '+esc(a.pub)+'｜統計期間 '+U.period+'</p><div class="grid g3" style="gap:14px"><div><div class="bigstat" style="font-size:34px">'+fmt(a.clicks)+'</div><div class="statlabel">點擊</div></div><div><div class="bigstat" style="font-size:34px">'+fmt(a.imp)+'</div><div class="statlabel">曝光</div></div><div><div class="bigstat" style="font-size:34px">'+a.pos+'</div><div class="statlabel">平均排名</div></div></div></div><div><div class="small">這篇文章帶來最多點擊的搜尋詞</div>'+(function(){var m=Math.max.apply(null,a.kws.map(function(k){return k.c}));return a.kws.map(function(k){return '<div class="barrow"><span>'+esc(k.q)+'</span><div class="bar" style="width:'+Math.max(2,k.c/m*100)+'%"></div><span>'+k.c+'</span></div>'}).join("")})()+'<p class="small" style="margin-top:12px">這代表什麼：一篇文章會同時被多種問法找到，不只是單一關鍵字。對 Eagle Fitness 的啟發：以學員真正會問的問題為題，一篇文章可以覆蓋一整組相關搜尋。</p></div></div>';
});

/* ---------- 第四章 關鍵字 ---------- */
var KS=["需求探索","方案比較","行動決策"];
var kdesc={"需求探索":"還在了解自己想要什麼","方案比較":"在比較不同的教練與課程","行動決策":"準備選擇並預約"};
tabs("kstage-tabs",KS.map(function(s){return {label:s,s:s}}),function(it){
 var gs=D.keywords.filter(function(g){return g.stage===it.s});
 $("#kstage-panel").innerHTML='<div class="panel" style="grid-column:1/-1"><p><b>'+it.s+'</b>｜'+kdesc[it.s]+'</p></div>'+gs.map(function(g){return '<div class="panel"><h3>'+g.name+'</h3><p class="small">'+g.items.slice(0,4).map(function(i){return esc(i.q)}).join("、")+'</p></div>'}).join("");
});
tabs("kg-tabs",D.keywords.map(function(g){return {label:g.name,g:g}}),function(it){
 var g=it.g,w=g.items.filter(function(i){return i.vol!=null}).sort(function(a,b){return b.vol-a.vol}),n=g.items.filter(function(i){return i.vol==null});
 var mx=Math.max.apply(null,w.map(function(i){return i.vol}).concat([1]));
 $("#kg-panel").innerHTML='<p><b>'+g.name+'</b>｜主要搜尋階段：'+g.stage+'</p>'+(w.length?'<div class="tablewrap"><table><tr><th>關鍵字</th><th>月搜尋量</th><th></th><th>廣告競爭</th><th>頁首出價（NT$）</th></tr>'+w.map(function(i){return '<tr><td>'+esc(i.q)+'</td><td class="n">'+fmt(i.vol)+'</td><td style="width:22%"><div class="bar" style="width:'+Math.max(3,i.vol/mx*100)+'%"></div></td><td>'+i.comp+'</td><td class="n">'+(i.lo!=null?i.lo.toFixed(0)+" ～ "+i.hi.toFixed(0):"—")+'</td></tr>'}).join("")+'</table></div>':'')+(n.length?'<p class="small" style="margin-top:14px">以下問題在 Google Ads 沒有足夠的搜尋量資料，但仍是學員真實會問的問題，適合作為文章主題，而不是主打關鍵字：</p><div class="btnrow">'+n.map(function(i){return '<span class="chip">'+esc(i.q)+'</span>'}).join("")+'</div>':'')+'<p class="small" style="margin-top:12px">資料來源：Google Ads 關鍵字規劃工具，2026/11/24 查詢，月搜尋量為平均值，台灣。頁首出價為廣告競價的參考區間，並非 SEO 費用。</p>';
});

/* ---------- 第五章 裝置 ---------- */

/* ---------- 第六章 方案 ---------- */
var grp=$("#plan-group"),det=$("#plan-detail");
grp.innerHTML=D.plans.map(function(p,i){return '<label class="plan"><input type="radio" name="plan" value="'+i+'"><span class="pbody"><i class="ic" data-ic="'+({y1:"flag",y2:"chart",y3:"layers"})[p.key]+'"></i><span class="pname">'+p.name+'｜'+p.tag+'</span><span class="pbig">NT$'+fmt(p.instAmt)+'</span><span class="psub">每期付款｜最多 '+p.inst+' 期｜零利率</span><span class="prow"><span>合約總價</span><b>NT$'+fmt(p.total)+'</b></span><span class="prow"><span>服務期間</span><b>'+p.months+' 個月</b></span><span class="prow"><span>SEO 文章</span><b>'+p.posts+' 篇</b></span><span class="prow"><span>平均每月投入（按服務期間攤算）</span><b>'+(p.key==="y3"?"約 ":"")+'NT$'+fmt(p.avg)+'</b></span></span></label>'}).join("");
det.innerHTML='<div class="panel" style="grid-column:1/-1"><p>請選擇一個合作期間，查看對應的服務期間與文章規劃。</p></div>';
function showPlan(p){
 var max=5;
 det.innerHTML='<div class="panel pin"><h3>'+p.name+'｜'+p.tag+'</h3><p>'+p.dir+'</p><table><tr><td>每期付款</td><td class="n">NT$'+fmt(p.instAmt)+' × 最多 '+p.inst+' 期</td></tr><tr><td>合約總價</td><td class="n">NT$'+fmt(p.total)+'</td></tr><tr><td>服務期間</td><td class="n">'+p.months+' 個月</td></tr><tr><td>SEO 文章總量</td><td class="n">'+p.posts+' 篇</td></tr></table></div><div class="panel pin"><h3>文章主題配置（初步規劃）</h3>'+D.clusters.map(function(c,i){return '<div class="barrow"><span>'+c+'</span><div class="bar grow" style="width:'+Math.max(2,p.alloc[i]/max*100)+'%;'+(p.alloc[i]?'':'opacity:.2')+'"></div><span>'+p.alloc[i]+' 篇</span></div>'}).join("")+'<div class="barrow" style="border-top:1px solid var(--line);padding-top:8px"><span><b>合計</b></span><span></span><span><b>'+p.posts+' 篇</b></span></div></div>';
}
grp.addEventListener("change",function(e){if(e.target.name==="plan")showPlan(D.plans[+e.target.value])});

/* ---------- 資料來源 ---------- */
var SRC=[
 ["Ultra Fitness 搜尋成效：Google Search Console（網域資源）","https://search.google.com/search-console","2026/11/24（資料期間 2025/07/23–2026/11/22）","19"],
 ["Google Ads 關鍵字規劃工具：關鍵字月搜尋量與頁首出價","https://ads.google.com/","2026/11/24","22"],
 ["Eagle Fitness 粉絲專頁公開資訊","https://www.facebook.com/EagleFitness01/","2026/11/24","1、2、25"],
 ["KKTIX：TRX 預約體驗（2016/09）","https://kelly352132.kktix.cc/events/352132","2026/11/24","2"],
 ["LINE 熱點：EagleFitness 體適能運動空間","https://spot.line.me/detail/493895735184464135","2026/11/24","25"],
 
 ["Ultra Fitness 官網","https://www.ultrafitness.com.tw/","2026/11/24","18–20"],
 ["瑪卡鎷網路行銷｜Ultra Fitness Google Search Console 成效資料（統計期間 2025/05/16–2026/09/05，快取更新 2026/09/20）","內部資料，可於會議中展示","2026/09/20","18–20"]
];
$("#src-table").innerHTML='<thead><tr><th>來源</th><th>連結</th><th>查閱／更新日</th><th>對應頁面</th></tr></thead><tbody>'+SRC.map(function(r){return '<tr><td>'+esc(r[0])+'</td><td>'+(r[1].indexOf("http")===0?'<a href="'+r[1]+'" target="_blank" rel="noopener">'+esc(r[1])+'</a>':esc(r[1]))+'</td><td>'+r[2]+'</td><td>'+r[3]+'</td></tr>'}).join("")+'</tbody>';
var dlg=$("#src-dialog");
$("#src-btn").addEventListener("click",function(){if(dlg.showModal)dlg.showModal();else dlg.setAttribute("open","")});
$("#src-close").addEventListener("click",function(){dlg.close?dlg.close():dlg.removeAttribute("open")});

/* ---------- 放大圖 ---------- */
var lb=document.createElement("dialog");lb.className="lb";lb.innerHTML='<button class="close" aria-label="關閉">×</button><img alt=""><p class="small"></p>';document.body.appendChild(lb);
document.addEventListener("click",function(e){var z=e.target.closest(".zoom");if(z){$("img",lb).src=z.dataset.zoom;$("img",lb).alt=$("img",z).alt;$("p",lb).textContent=z.dataset.cap||"";lb.showModal?lb.showModal():lb.setAttribute("open","");return}
 if(e.target===lb||e.target.closest(".lb .close")){lb.close?lb.close():lb.removeAttribute("open")}});
/* ---------- SVG 線條圖示 ---------- */
var MAP=[[/社群|追蹤|粉絲|FB|Facebook/,"users"],[/AI|GEO|AIO|摘要/,"spark"],[/搜尋|Google|關鍵字|找到/,"search"],[/官網|網站|品牌/,"globe"],[/文章|內容|知識|素材/,"doc"],[/教練|學員|人物/,"user"],[/館|在地|地址|地點/,"pin"],[/時間|時程|月|階段|週期|累積/,"clock"],[/成效|點擊|曝光|排名|數據|成長/,"chart"],[/負責|我們|建立|持續/,"check"],[/不承諾|限制|風險|不保證/,"shield"],[/預約|諮詢|轉換|下一步|聯絡/,"cal"],[/方案|總價|付款/,"tag"],[/路徑|流程|分工|架構/,"compass"],[/問題|FAQ|問答|常見/,"chat"],[/比較|選擇|決策/,"layers"],[/案例|同業|Ultra/,"flag"]];
function svg(n){return '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><use href="#i-'+n+'"/></svg>'}
function pick(t){for(var i=0;i<MAP.length;i++)if(MAP[i][0].test(t))return MAP[i][1];return null}
function decorate(){
 $$(".ic[data-ic]").forEach(function(el){if(!el.firstChild)el.innerHTML=svg(el.dataset.ic)});
 $$(".slide .rule, .slide .panel, .slide .node").forEach(function(el){
  if(el.querySelector(".ic")||el.dataset.noic)return;
  var FX=[["資訊要完整", "list"], ["資訊要一致", "check"], ["要被別處提到", "link"], ["服務頁面", "doc"], ["皮拉提斯", "book"], ["看意圖", "target"], ["看可行性", "check"], ["兩年", "chart"]];var all=el.textContent.replace(/\s+/g,"").trim();var fx=FX.filter(function(k){return all.indexOf(k[0])===0})[0];var t=(el.querySelector("h3,b,.statlabel")||{}).textContent||"";var n=fx?fx[1]:pick(t);
  if(!n){el.dataset.noic="1";return}
  var i=document.createElement("i");i.className="ic";i.innerHTML=svg(n);el.insertBefore(i,el.firstChild)});
 $$(".slide").forEach(function(s){
  if(s.dataset.anim)return;s.dataset.anim="1";var ch=+s.dataset.ch;
  var q=function(sel,cls,step,base){$$(sel,s).forEach(function(e,i){if(e.classList.contains("a"))return;e.classList.add("a",cls);e.style.setProperty("--d",((base||0)+i*(step||.1)).toFixed(2)+"s")})};
  q("h2","a-title");q(".lead","a-rise",0,.1);
  q(".bigstat","a-pop",.1,.15);
  q(".plan","a-flip",.14,.2);
  q(".flow .node","a-step",.13,.15);q(".steps li","a-step",.13,.15);
  if(ch===3)$$(".grid.g2>*",s).forEach(function(e,i){if(e.classList.contains("a"))return;e.classList.add("a",i%2?"a-right":"a-left");e.style.setProperty("--d",(.15+i*.12)+"s")});
  q(".grid>.rule, .grid>.panel","a-rise",.1,.15);
  q(".shot","a-zoom",0,.2);q(".tablewrap","a-rise",0,.25);q(".note","a-rise",0,.5);q(".btnrow","a-rise",0,.2);
 });
}
decorate();
if(window.MutationObserver){var mt;new MutationObserver(function(){clearTimeout(mt);mt=setTimeout(decorate,30)}).observe($("#deck"),{childList:true,subtree:true})}
/* ---------- 導覽 ---------- */
var slides=$$(".slide"),N=slides.length,cur=0;
var chs=["","從現有社群走向更多市場","認識 SEO、GEO、AIO","Ultra Fitness 同產業實績","Eagle Fitness 專屬搜尋市場與關鍵字策略","內容布局與轉換路徑","執行時程、服務內容與三種合作方案"];
var tocHtml="",last=-1;
slides.forEach(function(sl,i){var c=+sl.dataset.ch;if(c!==last){tocHtml+='<h4>'+(c?("0"+c+"　"+chs[c]):"封面")+'</h4>';last=c}tocHtml+='<a href="#s'+(i+1)+'" data-i="'+i+'">'+esc(sl.dataset.title)+'</a>'});
$("#toc-list").innerHTML=tocHtml;
var C=2*Math.PI*23,fg=$("#ring-fg");fg.style.strokeDasharray=C;
function mq(){return window.matchMedia("(min-width:900px)").matches}
function go(s){s.classList.remove("go");void s.offsetWidth;s.classList.add("go")}
function show(i,fromHash){
 cur=Math.max(0,Math.min(N-1,i));
 if(mq()){slides.forEach(function(s,k){s.classList.toggle("active",k===cur);if(k!==cur)s.classList.remove("go")});slides[cur].scrollTop=0;go(slides[cur])}
 else if(!fromHash){slides[cur].scrollIntoView({behavior:"auto"})}
 upd();
 if(history.replaceState)history.replaceState(null,"","#s"+(cur+1));
}
function upd(){
 $("#ring-n").textContent=cur+1;
 fg.style.strokeDashoffset=C*(1-(cur+1)/N);
 $$("#toc-list a").forEach(function(a){a.setAttribute("aria-current",String(+a.dataset.i===cur))});
}
function mode(){document.body.classList.toggle("deck",mq());if(mq()){slides.forEach(function(s,k){s.classList.toggle("active",k===cur)})}else{slides.forEach(function(s){s.classList.remove("active")})}}
window.addEventListener("resize",mode);mode();
$("#ring").addEventListener("click",function(){var t=$("#toc");t.hidden=!t.hidden;this.setAttribute("aria-expanded",String(!t.hidden))});
$("#prev").addEventListener("click",function(){show(cur-1)});
$("#next").addEventListener("click",function(){show(cur+1)});
$("#toc-list").addEventListener("click",function(e){var a=e.target.closest("a");if(!a)return;e.preventDefault();show(+a.dataset.i);$("#toc").hidden=true;$("#ring").setAttribute("aria-expanded","false")});
document.addEventListener("keydown",function(e){
 if(e.target.closest&&(e.target.closest("[role=tablist]")||e.target.closest("[role=radiogroup]"))&&(e.key==="ArrowLeft"||e.key==="ArrowRight"||e.key==="ArrowUp"||e.key==="ArrowDown"))return;
 if(dlg.open){if(e.key==="Escape")return;return}
 if(!mq())return;
 var el=slides[cur],atEnd=el.scrollTop+el.clientHeight>=el.scrollHeight-4,atTop=el.scrollTop<=0;
 if(e.key==="ArrowRight"||(e.key==="PageDown"&&atEnd)||(e.key===" "&&atEnd)){e.preventDefault();show(cur+1)}
 else if(e.key==="ArrowLeft"||(e.key==="PageUp"&&atTop)){e.preventDefault();show(cur-1)}
 else if(e.key==="Escape"){$("#toc").hidden=true}
});
if(window.IntersectionObserver){
 var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting&&!mq()){cur=slides.indexOf(en.target);upd()}})},{rootMargin:"-45% 0px -50% 0px"});
 var io2=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){if(!mq())en.target.classList.add("go");io2.unobserve(en.target)}})},{threshold:.12});
 slides.forEach(function(s){io2.observe(s)});
 slides.forEach(function(s){io.observe(s)});
}
var h=parseInt((location.hash||"").replace("#s",""),10);
show(h>0&&h<=N?h-1:0,true);
if(!mq()&&h>1)slides[cur].scrollIntoView();
})();
