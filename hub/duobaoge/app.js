(function(){
var D=window.DATA,$=function(s,r){return(r||document).querySelector(s)},$$=function(s,r){return[].slice.call((r||document).querySelectorAll(s))};
function fmt(n){return n.toLocaleString("en-US")}
function mq(){return window.matchMedia("(min-width:900px)").matches}

/* tabs */
function initTabs(box){
  var btns=$$("button",box);
  var nx=box.nextElementSibling;
  var scope=(nx&&nx.classList.contains("pane"))?box.parentNode:nx;
  var panes=$$(":scope > .pane",scope);
  btns.forEach(function(b,i){b.addEventListener("click",function(){
    btns.forEach(function(x){x.classList.remove("on")});b.classList.add("on");
    panes.forEach(function(p,j){p.classList.toggle("on",i===j)});
    if(box.dataset.chart)drawChart(box.dataset.chart,i);
  })});
}

/* keyword tabs */
(function(){
  var t=$("#kwTabs"),p=$("#kwPanes");
  D.kw.forEach(function(g,i){
    var b=document.createElement("button");b.textContent=g.g;if(!i)b.className="on";t.appendChild(b);
    var max=Math.max.apply(null,g.items.map(function(x){return x[1]}));
    var d=document.createElement("div");d.className="pane"+(i?"":" on");
    d.innerHTML='<p class="mut">'+g.d+'</p><div class="bars">'+g.items.map(function(x){
      return '<div class="row"><span>'+x[0]+'</span><div class="bar"><i style="--w:'+(x[1]/max*100).toFixed(1)+'%"></i></div><span class="n">'+fmt(x[1])+'</span></div>'}).join("")+'</div>';
    p.appendChild(d);
  });
})();

/* article tabs */
(function(){
  var t=$("#artTabs"),p=$("#artPanes");
  D.shengbaohua.forEach(function(a,i){
    var b=document.createElement("button");b.textContent=a.k;if(!i)b.className="on";t.appendChild(b);
    var d=document.createElement("div");d.className="pane card"+(i?"":" on");
    d.innerHTML='<h3>'+a.t+'</h3><p class="mut small">發佈日 '+a.pub+'</p><p>'+a.why+'</p><p><b>這篇同時被這些搜尋找到：</b>'+a.top.join("、")+'</p>';
    p.appendChild(d);
  });
})();

/* sortable table */
(function(){
  var rows=D.shengbaohua.slice(),key="imp",asc=false,tb=$("#sbhTable");
  var cols=[["k","文章主題",0],["pub","發佈日",0],["imp","曝光",1],["clk","點擊",1],["pos","平均排名",1]];
  function draw(){
    rows.sort(function(a,b){var x=a[key],y=b[key];return(x>y?1:x<y?-1:0)*(asc?1:-1)});
    tb.innerHTML="<tr>"+cols.map(function(c){return '<th class="sort'+(c[2]?" n":"")+'" data-k="'+c[0]+'">'+c[1]+(c[0]===key?(asc?" ▲":" ▼"):"")+"</th>"}).join("")+"</tr>"+
      rows.map(function(r){return "<tr><td>"+r.k+"</td><td>"+r.pub+'</td><td class="n">'+fmt(r.imp)+'</td><td class="n">'+fmt(r.clk)+'</td><td class="n">'+r.pos.toFixed(1)+"</td></tr>"}).join("");
    $$("th.sort",tb).forEach(function(h){h.addEventListener("click",function(){var k=h.dataset.k;if(k===key)asc=!asc;else{key=k;asc=(k==="k"||k==="pub"||k==="pos")}draw()})});
  }
  draw();
  $("#sbhNote").textContent="資料來源：瑪卡鎷客戶成效網站・聖寶華（更新 2026/11/07）；統計期間為各篇發佈日（或 Search Console 統計起日 2025/07/05 之後）至 2026/11/04。曝光與點擊為各篇文章網址的累計，平均排名為 Google 搜尋結果的平均名次，數字越小越前面。";
})();

/* charts */
var chartIdx={nangang:0,wabigaku:0};
function drawChart(id,i){
  var c=D.cases[id],vals=i?c.imps:c.clicks,W=960,H=300,l=56,r=24,t=30,b=44,n=vals.length;
  var max=Math.max.apply(null,vals)*1.12,x=function(k){return l+k*(W-l-r)/(n-1)},y=function(v){return t+(H-t-b)*(1-v/max)};
  var pts=vals.map(function(v,k){return x(k).toFixed(1)+","+y(v).toFixed(1)}).join(" ");
  var s='<svg viewBox="0 0 '+W+" "+H+'" role="img" aria-label="'+c.name+(i?"每月曝光":"每月點擊")+'">';
  for(var g=0;g<=4;g++){var gv=max/1.12*g/4,gy=y(gv);s+='<line x1="'+l+'" x2="'+(W-r)+'" y1="'+gy+'" y2="'+gy+'" stroke="#e6dfd4"/><text x="'+(l-8)+'" y="'+(gy+4)+'" text-anchor="end" font-size="12" fill="#6b625c">'+(gv>=10000?(gv/10000).toFixed(1)+"萬":Math.round(gv).toLocaleString())+"</text>"}
  s+='<polyline points="'+l+","+y(0)+" "+pts+" "+(W-r)+","+y(0)+'" fill="#c8102e" fill-opacity=".08" stroke="none"/>';
  s+='<polyline points="'+pts+'" fill="none" stroke="#c8102e" stroke-width="2.5" stroke-linejoin="round"/>';
  var mx=vals.indexOf(Math.max.apply(null,vals));
  vals.forEach(function(v,k){
    s+='<circle cx="'+x(k)+'" cy="'+y(v)+'" r="3.5" fill="#fff" stroke="#c8102e" stroke-width="2"/>';
    if(k===0||k===n-1||k===mx){var lab=v>=10000?(v/10000).toFixed(1)+"萬":v.toLocaleString();s+='<text x="'+x(k)+'" y="'+(y(v)-10)+'" text-anchor="middle" font-size="13" font-weight="700" fill="#231f20">'+lab+"</text>"}
    s+='<text x="'+x(k)+'" y="'+(H-16)+'" text-anchor="middle" font-size="11" fill="#6b625c">'+D.months[k].slice(2)+"</text>";
  });
  s+="</svg>";
  $("#ch-"+id).innerHTML=s;
  $("#nt-"+id).textContent=(i?"單位：次曝光":"單位：次點擊")+"（每月，完整月份，"+D.months[0]+"–"+D.months[n-1]+"；曝光 1 萬以上多為四捨五入的萬位顯示）。"+c.note+" 資料來源："+c.src+"。曝光與點擊不是人數或訂單，也受到季節、品牌活動與其他行銷影響。";
}
drawChart("nangang",0);drawChart("wabigaku",0);

/* plans */
(function(){
  var box=$("#plans"),det=$("#planDetail");
  D.plans.forEach(function(p){
    var b=document.createElement("button");b.className="plan";b.setAttribute("aria-pressed","false");
    b.innerHTML='<div class="nm">'+p.name+'</div><div class="pr">NT$'+fmt(p.instAmt)+' <small>× '+p.inst+' 期（零利率）</small></div>'+
     '<ul><li>合約總價　<b>NT$'+fmt(p.total)+'</b></li><li>服務期間　<b>'+p.months+' 個月</b></li><li>文章篇數　<b>'+p.posts+' 篇</b></li><li>平均每月投入（按服務期間攤算）　<b>NT$'+fmt(Math.round(p.avg))+'</b></li></ul>';
    b.addEventListener("click",function(){
      $$(".plan",box).forEach(function(x){x.classList.remove("on");x.setAttribute("aria-pressed","false")});
      b.classList.add("on");b.setAttribute("aria-pressed","true");
      det.innerHTML="<b>"+p.name+"</b>　"+p.dir+"<br><span class='mut small'>每期付款 NT$"+fmt(p.instAmt)+"，共 "+p.inst+" 期，合計 NT$"+fmt(p.total)+"；文章於新網站上線後開始，每月一篇。</span>";
    });
    box.appendChild(b);
  });
})();

/* sources */
var SRC=[
 ["Google 搜尋截圖","「台中沉香」、「台北沉香」、「多寶閣 沉香」，2026/11/26，定位為臺中市西屯區。"],
 ["多寶閣官網","http://www.house675559.com.tw/（2026/11/26 檢視）"],
 ["多寶閣 Facebook","facebook.com/house675559（簡介與貼文，2026/11/26 檢視）"],
 ["客戶成效網站","瑪卡鎷客戶成效戰情室：聖寶華、南港禮儀、樸道美寂，更新 2026/11/07；Google Search Console 統計期間 2025/07/05–2026/11/04。"],
 ["關鍵字搜尋量","內部關鍵字檔（聖寶華關鍵字研究），Google 關鍵字規劃工具月搜尋量估算；地區字尚未取得。"],
 ["合作方案","瑪卡鎷標準流量方案：一年 NT$150,000／10 篇；兩年 NT$240,000／20 篇；三年 NT$300,000／30 篇。"]
];
$("#srcList").innerHTML=SRC.map(function(s){return "<p><b>"+s[0]+"</b><br>"+s[1]+"</p>"}).join("");
function open(d){if(d.showModal)d.showModal()}
$("#srcBtn").addEventListener("click",function(){open($("#src"))});
$$("dialog [data-close]").forEach(function(b){b.addEventListener("click",function(){b.closest("dialog").close()})});
$$("dialog").forEach(function(d){d.addEventListener("click",function(e){if(e.target===d)d.close()})});

/* lightbox */
$$("[data-zoom]").forEach(function(z){z.addEventListener("click",function(){$("#lbi").src=$("img",z).src;open($("#lb"))})});

/* tabs init */
$$("[data-tabs]").forEach(initTabs);

/* deck */
var slides=$$(".slide"),cur=0,C=2*Math.PI*23,fg=$(".ring .fg");
fg.style.strokeDasharray=C;
function reveal(s){$$(".rv",s).forEach(function(e,i){setTimeout(function(){e.classList.add("in")},i*90)})}
function go(i){
  i=Math.max(0,Math.min(slides.length-1,i));cur=i;
  if(mq()){slides.forEach(function(s,k){s.classList.toggle("cur",k===i)});slides[i].scrollTop=0;reveal(slides[i])}
  else slides[i].scrollIntoView({behavior:"smooth"});
  prog(i);
}
function prog(i){$("#rn").textContent=i+1;fg.style.strokeDashoffset=C*(1-(i+1)/slides.length);
  $$("#tocList a").forEach(function(a,k){a.classList.toggle("cur",k===i)})}
function mode(){
  document.body.classList.toggle("deck",mq());
  if(mq()){slides.forEach(function(s,k){s.classList.toggle("cur",k===cur)});reveal(slides[cur])}
  else slides.forEach(function(s){s.classList.add("cur");$$(".rv",s).forEach(function(e){e.classList.add("in")})});
}
$("#tocList").innerHTML=slides.map(function(s,i){return '<a data-i="'+i+'"><b>'+(i+1)+"</b>"+s.dataset.t+"</a>"}).join("");
$$("#tocList a").forEach(function(a){a.addEventListener("click",function(){$("#toc").close();go(+a.dataset.i)})});
$("#ring").addEventListener("click",function(){open($("#toc"))});
$("#tp").addEventListener("click",function(){go(cur-1)});$("#tn").addEventListener("click",function(){go(cur+1)});
document.addEventListener("keydown",function(e){
  if(!mq()||document.querySelector("dialog[open]"))return;
  if(e.key==="ArrowRight"||e.key==="PageDown"){e.preventDefault();go(cur+1)}
  if(e.key==="ArrowLeft"||e.key==="PageUp"){e.preventDefault();go(cur-1)}
});
/* mobile observer */
if("IntersectionObserver"in window){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!mq()&&e.isIntersecting){cur=slides.indexOf(e.target);prog(cur)}})},{threshold:.4});
  slides.forEach(function(s){io.observe(s)});
}
window.addEventListener("resize",mode);
mode();prog(0);
})();
