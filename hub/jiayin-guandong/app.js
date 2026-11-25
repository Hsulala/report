(function(){
"use strict";
var D=window.DATA;
function $(s,r){return (r||document).querySelector(s)}
function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))}
function esc(t){return String(t).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function fmt(n){return n.toLocaleString("en-US")}

/* ---------- 通用頁籤 ---------- */
function tabs(id,items,render,def){
  var box=$("#"+id); if(!box)return;
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

/* ---------- 同區比較表 ---------- */
var pk="rev",pd=-1;
function drawPeers(){
  var rows=D.peers.map(function(r){return {name:r[0],rate:r[1],rev:r[2],addr:r[3],ad:r[4],me:r[5]}});
  rows.sort(function(a,b){var x=a[pk],y=b[pk];if(typeof x==="string")return pd*x.localeCompare(y,"zh-Hant");return pd*(x-y)});
  var max=Math.max.apply(null,rows.map(function(r){return r.rev}));
  function th(k,l,n){return '<th class="'+(n?"n":"")+'"><button data-k="'+k+'" aria-sort="'+(pk===k?(pd<0?"descending":"ascending"):"none")+'">'+l+'</button></th>'}
  $("#peer-table").innerHTML='<thead><tr>'+th("name","商家")+th("rate","評分",1)+th("rev","評論數",1)+'<th>評論數比較</th>'+th("addr","地址（路名）")+'</tr></thead><tbody>'+rows.map(function(r){
    return '<tr'+(r.me?' class="hl"':'')+'><td>'+esc(r.name)+(r.ad?'<span class="tagad">贊助商廣告</span>':'')+'</td><td class="n">'+r.rate.toFixed(1)+'</td><td class="n">'+fmt(r.rev)+'</td><td style="width:20%"><div class="bar" style="width:'+Math.max(2,r.rev/max*100)+'%"></div></td><td>'+esc(r.addr)+'</td></tr>'}).join("")+'</tbody>';
}
$("#peer-table").addEventListener("click",function(e){var b=e.target.closest("button[data-k]");if(!b)return;var k=b.dataset.k;if(pk===k)pd*=-1;else{pk=k;pd=(k==="name"||k==="addr")?1:-1}drawPeers()});
drawPeers();

/* ---------- 關鍵字 ---------- */
tabs("kw-tabs",D.kw.map(function(g){return {label:g.name,g:g}}),function(it){
  var g=it.g,rows=g.items.slice().sort(function(a,b){return b[1]-a[1]});
  var mx=Math.max.apply(null,rows.map(function(r){return r[1]}));
  $("#kw-panel").innerHTML='<p><b>'+esc(g.name)+'</b>｜'+esc(g.desc)+'</p><div class="tablewrap"><table><thead><tr><th>搜尋詞</th><th class="n">月搜尋量</th><th></th><th>廣告競爭</th><th class="n">頁首出價（NT$）</th></tr></thead><tbody>'+rows.map(function(r){
    return '<tr><td>'+esc(r[0])+'</td><td class="n">'+fmt(r[1])+'</td><td style="width:22%"><div class="bar grow" style="width:'+Math.max(3,r[1]/mx*100)+'%"></div></td><td>'+r[2]+'</td><td class="n">'+(r[3]!=null?r[3].toFixed(0)+" ～ "+r[4].toFixed(0):"尚未取得")+'</td></tr>'}).join("")+'</tbody></table></div>';
});

/* ---------- 家長問題 ---------- */
tabs("q-tabs",D.questions.map(function(q){return {label:q.label,q:q}}),function(it){
  var q=it.q;
  $("#q-panel").innerHTML='<div class="panel pin"><h3>家長會這樣問</h3><ul class="qlist">'+q.q.map(function(x){return '<li>'+esc(x)+'</li>'}).join("")+'</ul></div><div class="panel pin"><h3>在哪裡找答案</h3><p>'+esc(q.where)+'</p><h3 style="margin-top:14px">我們怎麼回答</h3><p>'+esc(q.do)+'</p></div>';
});

/* ---------- Ultra ---------- */
var U=D.ultra;
$("#ultra-stats").innerHTML=[[fmt(U.clicks),"Google 搜尋點擊","chart"],[U.impLabel,"Google 搜尋曝光","eye"],[U.pos.toFixed(1),"平均排名","target"],["660","單月最高點擊（2026/07）","cal"]].map(function(x){return '<div class="rule"><i class="ic" data-ic="'+x[2]+'"></i><div class="bigstat">'+x[0]+'</div><div class="statlabel">'+x[1]+'</div></div>'}).join("");
tabs("ultra-mtabs",[{label:"每月點擊",k:1},{label:"每月曝光",k:2}],function(it){
  var k=it.k,m=Math.max.apply(null,U.months.map(function(x){return x[k]}));
  $("#ultra-mchart").innerHTML='<div class="vbars" role="img" aria-label="Ultra Fitness 每月Google搜尋'+(k===1?"點擊":"曝光")+'長條圖">'+U.months.map(function(x){return '<div class="vb"><span class="vn">'+fmt(x[k])+'</span><div class="vbar grow" style="height:'+Math.max(2,x[k]/m*100)+'%"></div><span class="vl">'+x[0].slice(2)+'</span></div>'}).join("")+'</div><p class="small">'+(k===1?"單位：點擊次數":"單位：曝光次數")+'，刻度為各圖自身最大值。</p>';
});

/* ---------- 方案 ---------- */
var grp=$("#plan-group"),det=$("#plan-detail");
function money(p){return p.total!=null}
grp.innerHTML=D.plans.map(function(p,i){
  var big=money(p)?'NT$'+fmt(Math.round(p.total/p.inst)):'依正式報價';
  return '<label class="plan"><input type="radio" name="plan" value="'+i+'"><span class="pbody"><span class="pname">'+p.name+'｜'+p.tag+'</span><span class="pbig" style="'+(money(p)?'':'font-size:clamp(24px,2.6vw,32px)')+'">'+big+'</span><span class="psub">每期付款（未稅）｜最多 '+p.inst+' 期｜零利率</span>'+(money(p)?'<span class="prow"><span>合約總價（未稅）</span><b>NT$'+fmt(p.total)+'</b></span>':'')+'<span class="prow"><span>服務期間</span><b>'+p.months+' 個月</b></span><span class="prow"><span>付款期數</span><b>最多 '+p.inst+' 期</b></span>'+(money(p)?'<span class="prow"><span>平均每月投入（按服務期間攤算）</span><b>NT$'+fmt(Math.round(p.total/p.months))+'</b></span>':'')+'</span></label>';
}).join("");
det.innerHTML='<div class="panel" style="grid-column:1/-1"><p>請選擇一個合作期間，查看對應的服務期間與經營內容。</p></div>';
function showPlan(p){
  det.innerHTML='<div class="panel pin"><h3>'+p.name+'｜'+p.tag+'</h3><p>'+p.dir+'</p><table><tr><td>服務期間</td><td class="n">'+p.months+' 個月</td></tr><tr><td>付款方式</td><td class="n">最多 '+p.inst+' 期，零利率</td></tr>'+(money(p)?'<tr><td>合約總價（未稅）</td><td class="n">NT$'+fmt(p.total)+'</td></tr>':'<tr><td>金額</td><td class="n">依正式報價</td></tr>')+'</table></div><div class="panel pin"><h3>每月固定的經營內容</h3><ul style="padding-left:1.2em"><li>4 則 Google 商家貼文</li><li>評論回覆</li></ul></div>';
}
if(D.plans.length===1){var r0=grp.querySelector("input");if(r0){r0.checked=true;showPlan(D.plans[0])}}
grp.addEventListener("change",function(e){if(e.target.name==="plan")showPlan(D.plans[+e.target.value])});

/* ---------- 資料來源 ---------- */
var SRC=[
 ["Google 地圖：佳音英語關東校商家頁（評分、評論、地址、貼文）","https://www.google.com/maps/place/佳音英語關東校","2026/11/24","2、10"],
 ["Google 地圖搜尋「新竹 兒童美語」（關東路周邊地圖視窗）","https://www.google.com/maps/search/新竹+兒童美語","2026/11/24","7、9"],
 ["Google 地圖搜尋「關東國小 英文補習班」","https://www.google.com/maps/search/關東國小+英文補習班","2026/11/24","8"],
 ["Google Ads 關鍵字規劃工具：月搜尋量與頁首出價（台灣）","https://ads.google.com/","2026/11/24","11"],
 ["Ultra Fitness 搜尋成效：Google Search Console（網域資源）","https://search.google.com/search-console","2026/11/24（資料期間 2025/07/23–2026/11/22）","15"],
 ["Ultra Fitness 官網","https://www.ultrafitness.com.tw/","2026/11/24","15"],
 ["佳音英語 Joy English 官網（標誌）","https://www.joy.com.tw/","2026/11/24","1"],
 ["瑪卡鎷網路行銷｜Ultra Fitness 文章層級 Google Search Console 資料（2025/05/16–2026/09/05，快取更新 2026/09/20）","內部資料，可於會議中展示","2026/09/20","15"]
];
$("#src-table").innerHTML='<thead><tr><th>來源</th><th>連結</th><th>查閱／更新日</th><th>對應頁面</th></tr></thead><tbody>'+SRC.map(function(r){return '<tr><td>'+esc(r[0])+'</td><td>'+(r[1].indexOf("http")===0?'<a href="'+encodeURI(r[1])+'" target="_blank" rel="noopener">'+esc(r[1])+'</a>':esc(r[1]))+'</td><td>'+r[2]+'</td><td>'+r[3]+'</td></tr>'}).join("")+'</tbody>';
var dlg=$("#src-dialog");
$("#src-btn").addEventListener("click",function(){if(dlg.showModal)dlg.showModal();else dlg.setAttribute("open","")});
$("#src-close").addEventListener("click",function(){dlg.close?dlg.close():dlg.removeAttribute("open")});

/* ---------- 放大圖 ---------- */
var lb=document.createElement("dialog");lb.className="lb";lb.innerHTML='<button class="close" aria-label="關閉">×</button><img alt=""><p class="small"></p>';document.body.appendChild(lb);
document.addEventListener("click",function(e){var z=e.target.closest(".zoom");if(z){$("img",lb).src=z.dataset.zoom;$("img",lb).alt=$("img",z).alt;$("p",lb).textContent=z.dataset.cap||"";lb.showModal?lb.showModal():lb.setAttribute("open","");return}
 if(e.target===lb||e.target.closest(".lb .close")){lb.close?lb.close():lb.removeAttribute("open")}});

/* ---------- SVG 線條圖示 ---------- */
var P={star:'<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.9l-5.2 2.8 1-5.9-4.3-4.1 5.9-.8z"/>',clock:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',chart:'<path d="M4 4v16h16"/><path d="M8 16v-4M12 16V8M16 16v-6"/>',target:'<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r=".8"/>',search:'<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',eye:'<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.8"/>',globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',cal:'<rect x="4" y="5.5" width="16" height="14.5" rx="2"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4"/>',chat:'<path d="M4.5 5.5h15v10h-8l-4.5 3.5v-3.5h-2.5z"/>',doc:'<path d="M6.5 3.5h8l3.5 3.5v13.5h-11.5z"/><path d="M9 11h6M9 14.5h6"/>',user:'<circle cx="12" cy="8.5" r="3.5"/><path d="M5 20c0-4 3-6 7-6s7 2 7 6"/>',pin:'<path d="M12 21s6.5-6 6.5-11a6.5 6.5 0 10-13 0c0 5 6.5 11 6.5 11z"/><circle cx="12" cy="10" r="2.3"/>'};
$$(".ic").forEach(function(el){el.innerHTML='<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(P[el.dataset.ic]||"")+'</svg>'});

/* ---------- 導覽 ---------- */
var slides=$$(".slide"),N=slides.length,cur=0;
var chs=["","從你的目標開始","家長現在看到什麼","我們先處理的項目","AI 搜尋與同類案例","合作方式"];
var tocHtml="",last=-1;
slides.forEach(function(sl,i){var c=+sl.dataset.ch;if(c!==last){tocHtml+='<h4>'+(c?("0"+c+"　"+chs[c]):"封面")+'</h4>';last=c}tocHtml+='<a href="#s'+(i+1)+'" data-i="'+i+'">'+esc(sl.dataset.title)+'</a>'});
$("#toc-list").innerHTML=tocHtml;
var C=2*Math.PI*23,fg=$("#ring-fg");fg.style.strokeDasharray=C;
function mq(){return window.matchMedia("(min-width:900px)").matches}
function show(i,fromHash){
 cur=Math.max(0,Math.min(N-1,i));
 if(mq()){slides.forEach(function(s,k){s.classList.toggle("active",k===cur)});slides[cur].scrollTop=0}
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
 if(dlg.open||lb.open)return;
 if(!mq())return;
 var el=slides[cur],atEnd=el.scrollTop+el.clientHeight>=el.scrollHeight-4,atTop=el.scrollTop<=0;
 if(e.key==="ArrowRight"||(e.key==="PageDown"&&atEnd)||(e.key===" "&&atEnd)){e.preventDefault();show(cur+1)}
 else if(e.key==="ArrowLeft"||(e.key==="PageUp"&&atTop)){e.preventDefault();show(cur-1)}
 else if(e.key==="Escape"){$("#toc").hidden=true}
});
if(window.IntersectionObserver){
 var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting&&!mq()){cur=slides.indexOf(en.target);upd()}})},{rootMargin:"-45% 0px -50% 0px"});
 var io2=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add("seen");io2.unobserve(en.target)}})},{threshold:.12});
 slides.forEach(function(s){io2.observe(s)});
 slides.forEach(function(s){io.observe(s)});
}else{slides.forEach(function(s){s.classList.add("seen")})}
var h=parseInt((location.hash||"").replace("#s",""),10);
show(h>0&&h<=N?h-1:0,true);
if(!mq()&&h>1)slides[cur].scrollIntoView();
})();
