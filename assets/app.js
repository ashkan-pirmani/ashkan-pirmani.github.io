/* ============================================================
   Ashkan Pirmani. Version 2.
   Everything here is an extra. With script off, every page still
   reads top to bottom: the pathway shows all five steps, the figures
   show their static version, and the menu is a row of links.
   ============================================================ */

var REDUCED = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches);

/* ------------------------------------------------------------
   Header: a hairline once you scroll, and the menu on a phone.
   ------------------------------------------------------------ */
(function(){
  var head=document.getElementById('site-head');
  if(!head) return;
  function stuck(){ head.classList.toggle('stuck',window.scrollY>4); }
  window.addEventListener('scroll',stuck,{passive:true}); stuck();

  var btn=head.querySelector('.menu-btn'), nav=document.getElementById('site-nav');
  if(!btn||!nav) return;
  function set(open){
    btn.setAttribute('aria-expanded',String(open));
    nav.classList.toggle('open',open);
  }
  btn.addEventListener('click',function(){ set(btn.getAttribute('aria-expanded')!=='true'); });
  nav.addEventListener('click',function(e){ if(e.target.closest('a')) set(false); });
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'&&btn.getAttribute('aria-expanded')==='true'){ set(false); btn.focus(); }
  });
  document.addEventListener('click',function(e){
    if(btn.getAttribute('aria-expanded')==='true'&&!head.contains(e.target)) set(false);
  });
  window.addEventListener('resize',function(){ if(window.innerWidth>760) set(false); });
})();

/* ------------------------------------------------------------
   How I work. Five steps, one panel at a time. Arrow keys, Home and
   End move between steps, as they do in any set of tabs. The red line
   runs from the first step to the one you are on.
   ------------------------------------------------------------ */
(function(){
  var root=document.querySelector('[data-path]');
  if(!root) return;
  var tabs=[].slice.call(root.querySelectorAll('[role="tab"]'));
  var fill=root.querySelector('.path-fill');
  function show(i,focus){
    tabs.forEach(function(t,j){
      var on=j===i, p=document.getElementById(t.getAttribute('aria-controls'));
      t.setAttribute('aria-selected',String(on));
      t.tabIndex=on?0:-1;
      t.classList.toggle('done',j<i);
      if(p) p.classList.toggle('on',on);
    });
    if(fill) fill.style.width=(i/(tabs.length-1)*100)+'%';
    if(focus) tabs[i].focus();
  }
  tabs.forEach(function(t,i){
    t.addEventListener('click',function(){ show(i,false); });
    t.addEventListener('keydown',function(e){
      var n=tabs.length, k=e.key, to=null;
      if(k==='ArrowRight'||k==='ArrowDown') to=(i+1)%n;
      else if(k==='ArrowLeft'||k==='ArrowUp') to=(i-1+n)%n;
      else if(k==='Home') to=0;
      else if(k==='End') to=n-1;
      if(to!==null){ e.preventDefault(); show(to,true); }
    });
  });
  show(0,false);
})();

/* ------------------------------------------------------------
   Story pages: the contents list marks the section you are reading.
   ------------------------------------------------------------ */
(function(){
  var links=[].slice.call(document.querySelectorAll('.toc a[href^="#"]'));
  if(!links.length) return;
  var targets=links.map(function(a){ return document.getElementById(a.getAttribute('href').slice(1)); });
  var LINE=140;
  function mark(){
    var cur=-1;
    for(var i=0;i<targets.length;i++){
      if(targets[i]&&targets[i].getBoundingClientRect().top<=LINE) cur=i;
    }
    if(window.innerHeight+window.scrollY>=document.documentElement.scrollHeight-2) cur=targets.length-1;
    links.forEach(function(a,i){ a.classList.toggle('on',i===cur); });
  }
  window.addEventListener('scroll',mark,{passive:true});
  window.addEventListener('resize',mark,{passive:true});
  mark();
})();

/* ------------------------------------------------------------
   In-page links glide. The browser's own smooth scroll is over in a
   blink and reads as a jump; this one eases in and out over about a
   second, and gives way the moment the reader scrolls.
   ------------------------------------------------------------ */
(function(){
  if(REDUCED) return;
  var raf=0;
  function stop(){ if(raf){ cancelAnimationFrame(raf); raf=0; document.documentElement.style.scrollBehavior=''; } }
  ['wheel','touchstart','keydown'].forEach(function(t){ window.addEventListener(t,stop,{passive:true}); });
  document.addEventListener('click',function(e){
    if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey) return;
    var a=e.target.closest&&e.target.closest('a[href^="#"]'); if(!a||a.classList.contains('skip')) return;
    var id=decodeURIComponent(a.getAttribute('href').slice(1)); if(!id) return;
    var t=document.getElementById(id); if(!t) return;
    e.preventDefault(); stop();
    var html=document.documentElement, pad=parseFloat(getComputedStyle(html).scrollPaddingTop)||0;
    var y0=window.scrollY, y1=id==='top'?0:Math.max(0,Math.min(t.getBoundingClientRect().top+y0-pad,html.scrollHeight-window.innerHeight));
    var dist=Math.abs(y1-y0), dur=Math.min(1200,650+dist*.3), t0=null;
    html.style.scrollBehavior='auto';
    function step(now){
      if(t0===null) t0=now; var q=Math.min(1,(now-t0)/dur), k=q<.5?4*q*q*q:1-Math.pow(-2*q+2,3)/2;
      window.scrollTo(0,y0+(y1-y0)*k);
      if(q<1){ raf=requestAnimationFrame(step); } else { raf=0; html.style.scrollBehavior=''; if(history.replaceState) history.replaceState(null,'','#'+id); }
    }
    raf=requestAnimationFrame(step);
  });
})();

/* ------------------------------------------------------------
   Anything folded is open on paper.
   ------------------------------------------------------------ */
(function(){
  function openAll(){
    var d=document.querySelectorAll('details');
    for(var i=0;i<d.length;i++) d[i].open=true;
  }
  window.addEventListener('beforeprint',openAll);
})();

/* ============================================================
   FIGURES WITH CONTROLS. Every number is from the paper cited
   under the figure.
   ============================================================ */
(function(){
  var NS='http://www.w3.org/2000/svg';
  function el(n,a,txt){
    var e=document.createElementNS(NS,n);
    for(var k in a){
      /* a class sets the default size; an explicit size has to beat it */
      if(k==='font-size') e.style.fontSize=a[k]+'px'; else e.setAttribute(k,a[k]);
    }
    if(txt!=null) e.textContent=txt;
    return e;
  }
  function clear(n){ while(n.firstChild) n.removeChild(n.firstChild); }
  function toggle(label,key,pressed,onclick){
    var b=document.createElement('button');
    b.type='button'; b.className='tog'+(key?' key':'');
    b.setAttribute('aria-pressed',String(pressed));
    b.innerHTML='<span class="sw" aria-hidden="true"></span>'+label;
    b.addEventListener('click',onclick);
    return b;
  }

  /* ---------------------------------------------------------
     FLkit. The point is not how many roles there are. It is that
     the material is scattered, there is a wall in front of it, and
     somebody put it in order with a door per person.
     --------------------------------------------------------- */
  (function(){
    var svg=document.getElementById('flkit-viz');
    if(!svg) return;
    var stage=svg.parentNode;
    var wrap=document.getElementById('flkit-state'), sayEl=document.getElementById('flkit-say');
    var STAGES=['Governance','Infrastructure','Wrangling','Analysis'];
    var DOORS=['a lawyer','an engineer','a data steward','a clinician'];   /* the person each stage matters most to */
    var BITS=['consent','data agreement','ethics','GDPR','Flower','Docker','servers','ports','schemas',
              'missingness','codebooks','units','metrics','validation','baselines','roles',
              'glossary','audit','templates','who signs','which framework','where to start',
              'review board','pseudonyms','key exchange','firewalls','harmonization','drop out',
              'aggregation','seeds','sample size','who owns the model'];
    var state=0;
    function isNarrow(){ return (stage.clientWidth||640)<470; }
    var COLW=128,GAPX=10,GRIDX=(640-(4*COLW+3*GAPX))/2;
    var NCOLW=176,NGAPX=10,NGRIDX=(380-(2*NCOLW+NGAPX))/2;
    var NROWH=24,NBLOCK=8*NROWH+80,NTOP=74;
    function nTop(s){ return NTOP+Math.floor(s/2)*NBLOCK; }
    function scatter(i){
      var r1=Math.sin(i*127.1)*43758.5453, r2=Math.sin(i*311.7)*24634.6345;
      r1-=Math.floor(r1); r2-=Math.floor(r2);
      return isNarrow()?[8+r1*150,50+r2*196]:[14+r1*150,52+r2*188];
    }
    function tilt(i){ var r=Math.sin(i*57.3)*1234.567; return ((r-Math.floor(r))-0.5)*26; }
    function ordered(i){
      var s=i%4,row=Math.floor(i/4);
      if(isNarrow()) return [NGRIDX+(s%2)*(NCOLW+NGAPX),nTop(s)+row*NROWH];
      return [GRIDX+s*(COLW+GAPX),66+row*26];
    }
    function draw(){
      clear(svg);
      var narrow=isNarrow(), W=narrow?380:640, after=state===1;
      var cw=narrow?NCOLW:COLW, gx=narrow?NGRIDX:GRIDX, gp=narrow?NGAPX:GAPX;
      svg.appendChild(el('text',{x:18,y:22,'class':'fx-tk','font-size':13},after?'GATHERED, AND IN ORDER':'EVERYTHING YOU NEED, SOMEWHERE'));
      var wx=narrow?336:312;
      if(!after){
        for(var b=0;b<9;b++) svg.appendChild(el('rect',{x:wx,y:44+b*22,width:26,height:19,'class':'fx-wall'}));
        svg.appendChild(el('text',{x:narrow?(W-14):(wx+13),y:narrow?272:254,'text-anchor':narrow?'end':'middle',
          'class':'fx-tm','font-size':narrow?13:12},'this is where many teams stop'));
        /* what the team came for, on the far side of the wall */
        if(!narrow){
          svg.appendChild(el('rect',{x:380,y:92,width:230,height:104,'class':'fx-goal'}));
          svg.appendChild(el('text',{x:495,y:138,'text-anchor':'middle','class':'fx-tb','font-size':15},'Your first study'));
          svg.appendChild(el('text',{x:495,y:160,'text-anchor':'middle','class':'fx-tm','font-size':12.5},'across centers that keep their data'));
        }
      }
      BITS.forEach(function(name,i){
        var q=after?ordered(i):scatter(i), rot=after?0:tilt(i);
        var g=el('g',{transform:'translate('+q[0].toFixed(1)+','+q[1].toFixed(1)+') rotate('+rot.toFixed(1)+')'});
        if(!REDUCED) g.style.transition='transform .6s cubic-bezier(.2,.8,.25,1)';
        g.appendChild(el('rect',{x:0,y:-13,width:after?cw-8:Math.max(44,name.length*(narrow?7.3:6.9)+12),height:20,
          'class':'fx-chip'+(after?' on':'')}));
        g.appendChild(el('text',{x:6,y:1.5,'class':'fx-tm','font-size':narrow?13:12},name));
        svg.appendChild(g);
      });
      if(after){
        for(var i=0;i<4;i++){
          var x=gx+(narrow?(i%2):i)*(cw+gp), mid=x+(cw-8)/2, top=narrow?nTop(i):64;
          svg.appendChild(el('text',{x:x,y:top-18,'class':'fx-tb','font-size':narrow?14:12.5},STAGES[i]));
          var dy=narrow?(top+8*NROWH+26):284;
          svg.appendChild(el('path',{d:'M'+mid+' '+dy+'l0 -14','class':'fx-sred','stroke-width':1.4}));
          svg.appendChild(el('path',{d:'M'+mid+' '+(dy-16)+'l-4 8l8 0z','class':'fx-red'}));
          svg.appendChild(el('text',{x:mid,y:dy+16,'text-anchor':'middle','class':'fx-tr','font-size':narrow?13:12},DOORS[i]));
        }
        var footY=narrow?(nTop(2)+8*NROWH+66):324;
        svg.appendChild(el('text',{x:gx,y:footY,'class':'fx-tm','font-size':13},'One door each. Nobody has to read all of it.'));
        svg.setAttribute('viewBox',narrow?('0 0 380 '+(footY+18)):'0 0 640 334');
      }else{
        svg.setAttribute('viewBox',narrow?'0 0 380 300':'0 0 640 334');
      }
    }
    function apply(){
      draw();
      sayEl.innerHTML=state===0
        ?'<b>Before.</b> None of this is secret. It is spread across framework documentation, legal '+
         'templates, glossaries and people who have done it once. A team that has never run a study '+
         'like this cannot tell which piece it needs first.'
        :'<b>After.</b> The same material, in the order the decisions actually happen, with a way in '+
         'for each kind of person on the team. A lawyer never has to read the training code. An '+
         'engineer never has to read the consent templates.';
      [].forEach.call(wrap.children,function(b,i){ b.setAttribute('aria-pressed',String(i===state)); });
    }
    ['Before FLkit','With FLkit'].forEach(function(lbl,i){
      wrap.appendChild(toggle(lbl,i===1,i===state,function(){ state=i; apply(); }));
    });
    apply();
    var rt,wasNarrow=isNarrow();
    window.addEventListener('resize',function(){
      clearTimeout(rt);
      rt=setTimeout(function(){ var n=isNarrow(); if(n!==wasNarrow){ wasNarrow=n; draw(); } },160);
    });
  })();
})();

/* ------------------------------------------------------------
   Three ways into one study. The site's one signature figure.
   Each route is a row; a path runs from each row to the study. Press a
   route and its path, its row and its sentence take the front for 300ms
   of transition, then stay. "All routes" brings the overview back. With
   no script, the rows, the total and the first sentence are the figure.
   ------------------------------------------------------------ */
(function(){
  var NS='http://www.w3.org/2000/svg';
  var figs=document.querySelectorAll('.gd');
  Array.prototype.forEach.call(figs,function(fig){
    var btns=[].slice.call(fig.querySelectorAll('.gd-r')),
        all=fig.querySelector('.gd-all'),
        says=[].slice.call(fig.querySelectorAll('.gd-says p')),
        tl=fig.querySelector('.gd-tl'), tn=fig.querySelector('.gd-tn'),
        flow=fig.querySelector('.gd-flow'), svg=fig.querySelector('.gd-paths'),
        node=fig.querySelector('.gd-node'), routes=fig.querySelector('.gd-routes');
    var TOTAL=tn.textContent, LABEL=tl.textContent;

    /* the paths are drawn from where the rows really are, so they survive any wrap */
    function draw(){
      if(!svg||!flow.offsetParent) return;
      while(svg.firstChild) svg.removeChild(svg.firstChild);
      var fr=flow.getBoundingClientRect(), W=fr.width, H=fr.height;
      var nr=node.getBoundingClientRect(), ny=nr.top-fr.top+nr.height/2, nx=nr.left-fr.left-6;
      svg.setAttribute('viewBox','0 0 '+W+' '+H);
      btns.forEach(function(b){
        var r=b.getBoundingClientRect(), y=r.top-fr.top+r.height/2;
        var p=document.createElementNS(NS,'path');
        p.setAttribute('d','M0 '+y.toFixed(1)+' C'+(nx*.55).toFixed(1)+' '+y.toFixed(1)+' '+(nx*.45).toFixed(1)+' '+ny.toFixed(1)+' '+nx.toFixed(1)+' '+ny.toFixed(1));
        p.setAttribute('class','gd-p');
        p.setAttribute('data-r',b.getAttribute('data-r'));
        svg.appendChild(p);
      });
      var tip=document.createElementNS(NS,'path');
      tip.setAttribute('d','M'+(nx-1)+' '+(ny-5)+' l7 5 l-7 5z');
      tip.setAttribute('class','gd-tip');
      svg.appendChild(tip);
      mark(fig.getAttribute('data-sel'));
    }
    function mark(r){
      [].forEach.call(svg?svg.querySelectorAll('.gd-p'):[],function(p){
        p.classList.toggle('on',p.getAttribute('data-r')===r);
      });
    }
    function set(r){
      fig.setAttribute('data-sel',r);
      btns.forEach(function(b){ b.setAttribute('aria-pressed',String(b.getAttribute('data-r')===r)); });
      /* a reset, not a fourth toggle: it does nothing while the overview is already showing */
      if(all) all.setAttribute('aria-disabled',String(r==='all'));
      says.forEach(function(p){ p.hidden=p.getAttribute('data-for')!==r; });
      mark(r);
      if(r==='all'){ tl.textContent=LABEL; tn.textContent=TOTAL; return; }
      var n=+fig.querySelector('.gd-r[data-r="'+r+'"]').getAttribute('data-n');
      tl.textContent='Records contributed through this route';
      tn.innerHTML=n.toLocaleString('en')+' <small>of '+TOTAL+'</small>';
    }
    btns.forEach(function(b){
      b.addEventListener('click',function(){
        set(b.getAttribute('aria-pressed')==='true'?'all':b.getAttribute('data-r'));
      });
    });
    if(all) all.addEventListener('click',function(){ set('all'); });
    fig.addEventListener('keydown',function(e){ if(e.key==='Escape') set('all'); });
    draw();
    var rt;
    window.addEventListener('resize',function(){ clearTimeout(rt); rt=setTimeout(draw,120); });
    if(document.fonts&&document.fonts.ready) document.fonts.ready.then(draw);
    window.addEventListener('load',draw);
  });
})();

/* ------------------------------------------------------------
   Arriving. Blocks fade up as they come into view, cards one after another,
   and the drawings in the panels draw themselves. Only when motion is welcome;
   otherwise nothing is hidden in the first place.
   ------------------------------------------------------------ */
(function(){
  if(REDUCED||!('IntersectionObserver' in window)) return;
  var FADE='.sec-h,.bring-intro,.qc-item,.r3,.path,.me-photo,.me-text,.contact-in,.page-head .lede,.facts,'+
           '.result,.gd,.lead-work,.feature,.row,.note-row,.cv-sec,.route,.prose > figure,.next-story,.deep-head';
  var MARK='.deep';                     /* marked as seen, never hidden: a dark band cannot fade from white */
  var fade=[].slice.call(document.querySelectorAll(FADE)).filter(function(e){ return !e.closest('.hero'); });
  var mark=[].slice.call(document.querySelectorAll(MARK));
  if(!fade.length&&!mark.length) return;
  fade.forEach(function(e){
    e.classList.add('rv');
    /* siblings of the same kind arrive one after another */
    var sib=[].filter.call(e.parentNode.children,function(x){ return x.className===e.className; });
    if(sib.length>1) e.style.setProperty('--i',sib.indexOf(e)%6);
  });
  document.documentElement.classList.add('rv-on');
  var io=new IntersectionObserver(function(es){
    es.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } });
  },{rootMargin:'0px 0px -6% 0px',threshold:.08});
  fade.concat(mark).forEach(function(e){ io.observe(e); });
  /* drawings draw themselves once they are well in view */
  var arts=[].slice.call(document.querySelectorAll('.art'));
  var io2=new IntersectionObserver(function(es){
    es.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('in'); io2.unobserve(en.target); } });
  },{rootMargin:'0px 0px -12% 0px',threshold:.3});
  arts.forEach(function(e){ io2.observe(e); });
})();

/* ============================================================
   THE THREAD. The story of the work, in the left margin.
   It starts as a trail of grey records beside the headline. As you
   read past them they turn red: records becoming evidence. From the
   work on it is one red line, with a word at every section, and at
   the invitation it curls into a loop, the way FLkit's does: your
   question starts the next study. Only where the margin has room.
   ============================================================ */
(function(){
  var STOPS=[['.hero-h','records'],['#work-h','evidence'],['#approach-h','judgment'],
             ['#me-h','people'],['#next-h','direction'],['#contact-h','your question']];
  var stops=STOPS.map(function(s){ return {el:document.querySelector(s[0]), word:s[1]}; }).filter(function(s){ return s.el; });
  if(stops.length<3) return;
  var NS='http://www.w3.org/2000/svg', svg=document.createElementNS(NS,'svg');
  var recs=[], nodes=[], words=[], ink=null, L=0, ys=[], x=0;
  svg.setAttribute('class','thread'); svg.setAttribute('aria-hidden','true');
  document.body.appendChild(svg);
  function el(n,a,t){var e=document.createElementNS(NS,n);for(var k in a)e.setAttribute(k,a[k]);if(t)e.textContent=t;return e;}
  function seg(a,b,i){ var h=b-a, sw=i%2?14:-14; return ' C'+(x+sw)+' '+(a+h*.35)+' '+(x-sw)+' '+(a+h*.65)+' '+x+' '+b; }
  function build(){
    while(svg.firstChild) svg.removeChild(svg.firstChild);
    recs=[]; nodes=[]; words=[];
    var w=document.querySelector('.hero .wrap'), wr=w.getBoundingClientRect(), pad=parseFloat(getComputedStyle(w).paddingLeft)||0;
    x=wr.left+pad-54;
    if(x<22||window.innerWidth<1280){ svg.style.display='none'; return; }
    svg.style.display='';
    var docH=document.documentElement.scrollHeight;
    svg.setAttribute('height',docH); svg.setAttribute('viewBox','0 0 '+window.innerWidth+' '+docH);
    ys=stops.map(function(s){ var r=s.el.getBoundingClientRect(); return r.top+window.scrollY+Math.min(26,r.height/2); });
    /* the dark bands: How I think, and the ending */
    var bands=[].slice.call(document.querySelectorAll('.deep,.contact')).map(function(e){ var r=e.getBoundingClientRect(); return [r.top+window.scrollY,r.bottom+window.scrollY]; });
    function dark(y){ return bands.some(function(b){ return y>b[0]&&y<b[1]; }); }
    /* 1. the records: a dotted trail from the headline to the work */
    var guide=el('path',{d:'M'+x+' '+ys[0]+seg(ys[0],ys[1],1),fill:'none'}); svg.appendChild(guide);
    var gl=guide.getTotalLength();
    for(var l=16;l<gl-10;l+=11){ var pt=guide.getPointAtLength(l), c=el('circle',{cx:pt.x.toFixed(1),cy:pt.y.toFixed(1),r:1.9,'class':'rec'}); recs.push({c:c,y:pt.y}); svg.appendChild(c); }
    svg.removeChild(guide);
    /* 2. one line from the work to the invitation, ending in a loop */
    var d='M'+x+' '+ys[1];
    for(var i=2;i<ys.length;i++) d+=seg(ys[i-1],ys[i],i);
    var yl=ys[ys.length-1];
    d+=' C'+x+' '+(yl+34)+' '+(x+42)+' '+(yl+46)+' '+(x+42)+' '+(yl+20)+' C'+(x+42)+' '+(yl-2)+' '+(x+12)+' '+(yl+2)+' '+(x+3)+' '+(yl+16);
    svg.appendChild(el('path',{d:d,'class':'track'}));
    ink=el('path',{d:d,'class':'ink'}); svg.appendChild(ink);
    L=ink.getTotalLength(); ink.style.strokeDasharray=L; ink.style.strokeDashoffset=REDUCED?0:L;
    /* 3. a word at every section, reading up the margin */
    ys.forEach(function(y,i){
      var c=el('circle',{cx:x,cy:y,r:4.5,'class':'node'+(dark(y)?' dk':'')});
      var t=el('text',{x:x-7,y:y+14,'text-anchor':'end',transform:'rotate(-90 '+(x-7)+' '+(y+14)+')','class':'word'+(dark(y)?' dk':'')},stops[i].word);
      svg.appendChild(c); svg.appendChild(t); nodes.push(c); words.push(t);
    });
    update();
  }
  function update(){
    if(!ink||svg.style.display==='none') return;
    var line=window.scrollY+window.innerHeight*.55;
    /* the page ends before the reading line can reach the last word; at the bottom, it is read */
    if(window.innerHeight+window.scrollY>=document.documentElement.scrollHeight-4) line=1e9;
    recs.forEach(function(r){ r.c.classList.toggle('on',REDUCED||r.y<=line); });
    var p=(line-ys[1])/(ys[ys.length-1]+40-ys[1]); p=Math.max(0,Math.min(1,p)); if(REDUCED) p=1;
    ink.style.strokeDashoffset=L*(1-p);
    nodes.forEach(function(c,i){ var on=REDUCED||ys[i]<=line; c.classList.toggle('on',on); words[i].classList.toggle('on',on); });
  }
  build();
  window.addEventListener('scroll',update,{passive:true});
  var rt; window.addEventListener('resize',function(){ clearTimeout(rt); rt=setTimeout(build,150); });
  window.addEventListener('load',build);
  if(document.fonts&&document.fonts.ready) document.fonts.ready.then(build);
})();

/* ------------------------------------------------------------
   Travellers. On the home page cards, results ride the routes into
   the study, and a dot goes once around FLkit's loop.
   ------------------------------------------------------------ */
(function(){
  if(REDUCED) return;
  var NS='http://www.w3.org/2000/svg';
  function ride(svg,paths,cls,dur,count,gap){
    paths.forEach(function(p,k){
      var L=p.getTotalLength();
      for(var j=0;j<count;j++){
        (function(delay){
          var c=document.createElementNS(NS,'circle'); c.setAttribute('r',svg.classList.contains('qc-loop')?3:2.6);
          c.setAttribute('class','mover'+(cls[k]||'')); svg.appendChild(c);
          var t0=null;
          function step(ts){ if(t0===null) t0=ts; var q=(ts-t0-delay)/dur;
            if(q<0){ c.style.opacity=0; requestAnimationFrame(step); return; }
            if(q>1){ c.remove(); return; }
            var pt=p.getPointAtLength(L*(1-Math.pow(1-q,2)));
            c.setAttribute('cx',pt.x); c.setAttribute('cy',pt.y); c.style.opacity=q<.12?q/.12:(q>.9?(1-q)/.1:1);
            requestAnimationFrame(step); }
          requestAnimationFrame(step);
        })(j*gap+k*120);
      }
    });
  }
  document.querySelectorAll('.qc-item').forEach(function(card){
    var busy=false;
    function go(){
      if(busy) return; busy=true; setTimeout(function(){busy=false;},1700);
      var flow=card.querySelector('.qc-flow'), loop=card.querySelector('.qc-loop');
      if(flow) ride(flow,[].slice.call(flow.querySelectorAll('path')),[' g',' g',''],1300,2,260);
      if(loop) ride(loop,[loop.querySelector('.bend')],[''],1500,1,0);
    }
    card.addEventListener('mouseenter',go);
    card.addEventListener('focusin',go);
  });
})();

/* ------------------------------------------------------------
   Drawings stay legible. A drawing scales with its column, so on a narrow
   phone its labels could fall under 11px. Measure, and enlarge just those.
   ------------------------------------------------------------ */
(function(){
  var arts=[].slice.call(document.querySelectorAll('svg.art, svg.rc-art, svg.tryit-art'));
  if(!arts.length) return;
  arts.forEach(function(svg){ [].forEach.call(svg.querySelectorAll('text'),function(t){
    t.setAttribute('data-fs',parseFloat(getComputedStyle(t).fontSize)||13.5); }); });
  function fit(){
    arts.forEach(function(svg){
      var vb=svg.viewBox&&svg.viewBox.baseVal, w=svg.getBoundingClientRect().width;
      if(!vb||!vb.width||!w) return;
      var sc=w/vb.width;
      [].forEach.call(svg.querySelectorAll('text'),function(t){
        var base=+t.getAttribute('data-fs');
        t.style.fontSize=(base*sc<11? 11/sc : base)+'px';
      });
    });
  }
  fit();
  var rt; window.addEventListener('resize',function(){ clearTimeout(rt); rt=setTimeout(fit,120); });
})();

/* ------------------------------------------------------------
   Email. The address is never in the served HTML as one string, so a
   harvester scraping the page gets three unrelated attributes. A person
   gets a normal clickable mailto.
   ------------------------------------------------------------ */
(function(){
  var links=document.querySelectorAll('a[data-mailto]');
  Array.prototype.forEach.call(links,function(a){
    var addr=a.getAttribute('data-u')+'@'+a.getAttribute('data-h')+'.'+a.getAttribute('data-t');
    a.setAttribute('href','mailto:'+addr);
    a.removeAttribute('data-u');a.removeAttribute('data-h');a.removeAttribute('data-t');
    var slot=a.querySelector('[data-mail]');
    if(slot) slot.textContent=addr;
  });
})();

/* ============================================================
   Extras. Every piece here acts out something true about the work.
   Each one checks for reduced motion, and without script the page
   underneath already says everything on its own.
   ============================================================ */

function _prng(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function _tok(n,fb){ return getComputedStyle(document.documentElement).getPropertyValue(n).trim()||fb; }
function _hex(h){ var m=/^#?([0-9a-f]{6})$/i.exec(h||''); if(!m) return [17,17,17]; var n=parseInt(m[1],16); return [n>>16&255,n>>8&255,n&255]; }
var FINE=!!(window.matchMedia&&window.matchMedia('(pointer:fine)').matches);

/* ============================================================
   1. "SCATTERED", WHEN YOU POINT AT IT.
   The headline is plain text. Under the red line sits a
   small network of records. Pointing at "scattered." lets a few of its
   dots drift apart, some of them linked like sites in a network, and
   they settle back into the word. Nothing moves on its own.
   ============================================================ */
(function(){
  var hero=document.querySelector('.hero'), cv=hero&&hero.querySelector('.hero-field'), h1=hero&&hero.querySelector('.hero-h');
  if(!cv||!h1||!cv.getContext) return;
  var ctx=cv.getContext('2d'), dpr=Math.min(2,window.devicePixelRatio||1), W=0, H=0, INK, RED;
  var words=[].slice.call(h1.querySelectorAll('.w.dw')), rule=[], links=[], fx=null, raf=0;
  var word=words.filter(function(w){ return /^scattered/.test(w.textContent); })[0];
  function box(e){ var x=0,y=0,n=e; while(n&&n!==hero){ x+=n.offsetLeft; y+=n.offsetTop; n=n.offsetParent; }
    return {left:x,top:y,right:x+e.offsetWidth,bottom:y+e.offsetHeight}; }
  function glyphs(w){
    var b=box(w), cs=getComputedStyle(w), fs=parseFloat(cs.fontSize), pad=Math.ceil(fs*.35);
    var c=document.createElement('canvas'); c.width=Math.ceil(b.right-b.left)+pad*2; c.height=Math.ceil(b.bottom-b.top)+pad*2;
    var g=c.getContext('2d'); g.font=cs.fontStyle+' '+cs.fontWeight+' '+fs+'px '+cs.fontFamily;
    try{ g.letterSpacing=cs.letterSpacing; }catch(e){}
    var m=g.measureText(w.textContent), asc=m.fontBoundingBoxAscent||fs*.82, des=m.fontBoundingBoxDescent||fs*.22;
    var base=pad+((b.bottom-b.top)-(asc+des))/2+asc;
    g.fillStyle='#000'; g.fillText(w.textContent,pad,base);
    var d=g.getImageData(0,0,c.width,c.height).data, step=Math.max(3,Math.round(fs/14)), pts=[];
    for(var y=0;y<c.height;y+=step) for(var x=0;x<c.width;x+=step) if(d[(y*c.width+x)*4+3]>150) pts.push([b.left-pad+x,b.top-pad+y]);
    return {pts:pts,step:step};
  }
  function size(){ W=hero.clientWidth; H=hero.clientHeight; cv.width=Math.round(W*dpr); cv.height=Math.round(H*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0); INK=_tok('--ink','#111'); RED=_tok('--red','#CE2F19'); }
  /* Under the red line: a small network. Some sites are bigger than others,
     some are linked and some stand alone, as in any federation. */
  function makeRule(){
    var red=[].slice.call(h1.querySelectorAll('.r .w')); rule=[]; links=[]; if(!red.length) return;
    var last=box(red[red.length-1]), first=last;
    red.forEach(function(w){ var r=box(w); if(Math.abs(r.top-last.top)<4&&r.left<first.left) first=r; });
    var x1=first.left+4, x2=last.right-6, y=last.bottom+8, n=Math.max(9,Math.round((x2-x1)/26)), rnd=_prng(7);
    for(var i=0;i<n;i++){
      var big=rnd()<.22;
      rule.push({x:x1+(i+.15+rnd()*.7)*(x2-x1)/n, y:y+(rnd()-.5)*(big?4:9), r:big?2.6+rnd()*1.2:1.1+rnd()*1.1, hub:big});
    }
    for(i=0;i<n;i++){
      if(i+1<n&&rnd()<(rule[i].hub||rule[i+1].hub?.8:.35)) links.push([i,i+1]);
      if(i+2<n&&(rule[i].hub||rule[i+2].hub)&&rnd()<.35) links.push([i,i+2]);
    }
  }
  function drawRule(){
    ctx.strokeStyle=RED; ctx.lineWidth=1; ctx.globalAlpha=.32;
    links.forEach(function(l){ var a=rule[l[0]], b=rule[l[1]]; ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke(); });
    ctx.globalAlpha=1; ctx.fillStyle=RED;
    rule.forEach(function(p){ ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,6.2832); ctx.fill(); });
  }
  /* a fifth of the word's dots, each drifting a short way on a smooth curve, and a few linked */
  var DUR=1700;
  function scatter(){
    var gl=glyphs(word), rnd=_prng(97), keep=[];
    gl.pts.forEach(function(p){ if(rnd()<.2) keep.push(p); });
    var P=keep.map(function(p){ var a=rnd()*6.2832, amp=8+rnd()*22;
      return {x:p[0],y:p[1],dx:Math.cos(a)*amp,dy:Math.sin(a)*amp-4-rnd()*6,r:gl.step*(.34+rnd()*.22),red:rnd()<.16}; });
    var L=[];
    P.forEach(function(p,i){ if(rnd()>.45) return; var best=-1, bd=34*34;
      P.forEach(function(q,j){ if(j===i) return; var ex=(p.x+p.dx)-(q.x+q.dx), ey=(p.y+p.dy)-(q.y+q.dy), d=ex*ex+ey*ey; if(d<bd){ bd=d; best=j; } });
      if(best>=0) L.push([i,best]); });
    fx={P:P,L:L,t0:performance.now()};
    word.classList.add('drift');
    if(!raf) raf=requestAnimationFrame(loop);
  }
  function loop(now){
    ctx.clearRect(0,0,W,H); drawRule();
    if(fx){
      var q=Math.min(1,(now-fx.t0)/DUR), k=.5-.5*Math.cos(2*Math.PI*q);
      if(q>.72) word.classList.remove('drift');
      var X=fx.P.map(function(p){ return [p.x+p.dx*k, p.y+p.dy*k]; });
      ctx.lineWidth=1; ctx.strokeStyle=RED; ctx.globalAlpha=.35*k;
      fx.L.forEach(function(l){ var a=X[l[0]], b=X[l[1]]; ctx.beginPath(); ctx.moveTo(a[0],a[1]); ctx.lineTo(b[0],b[1]); ctx.stroke(); });
      fx.P.forEach(function(p,i){ ctx.globalAlpha=.25+.65*k; ctx.fillStyle=p.red?RED:INK;
        ctx.beginPath(); ctx.arc(X[i][0],X[i][1],p.r,0,6.2832); ctx.fill(); });
      ctx.globalAlpha=1;
      if(q>=1) fx=null;
    }
    raf=fx?requestAnimationFrame(loop):0;
  }
  function draw(){ size(); makeRule(); ctx.clearRect(0,0,W,H); drawRule(); }
  var started=false; function go(){ if(started) return; started=true; draw(); }
  if(document.fonts&&document.fonts.ready){ document.fonts.ready.then(go); setTimeout(go,1500); } else go();
  if(word&&FINE&&!REDUCED){
    word.addEventListener('pointerenter',function(){ if(!fx) scatter(); });
  }
  var rt; window.addEventListener('resize',function(){ clearTimeout(rt); rt=setTimeout(function(){ if(!fx) draw(); },150); });
})();

/* ============================================================
   2. 26,246 PEOPLE, ONE DOT EACH.
   They start as one crowd and settle into 32 countries, each
   group its own shade between red and teal. The groups are drawn
   equal; the page says so.
   ============================================================ */
(function(){
  var cvs=[].slice.call(document.querySelectorAll('canvas.crowd'));
  cvs.forEach(function(cv){
    var ctx=cv.getContext('2d'); if(!ctx) return;
    var N=+cv.getAttribute('data-n')||26246, G=+cv.getAttribute('data-groups')||32, dpr=Math.min(2,window.devicePixelRatio||1);
    var W, H, groups, pts, done=false;
    function layout(){
      W=cv.clientWidth; H=cv.clientHeight; if(!W||!H) return false;
      cv.width=Math.round(W*dpr); cv.height=Math.round(H*dpr); ctx.setTransform(dpr,0,0,dpr,0,0);
      var red=_hex(_tok('--red','#CE2F19')), teal=_hex(_tok('--teal','#2F6B70')), rnd=_prng(26246);
      var cols=8, rows=Math.ceil(G/cols), cw=W/cols, ch=H/rows, r=Math.min(cw,ch)*.42;
      groups=[]; for(var g=0;g<G;g++){
        var t=rnd(), c=[0,1,2].map(function(k){ return Math.round(red[k]*(1-t)+teal[k]*t); }), shade=.7+rnd()*.3;
        groups.push({cx:(g%cols+.5)*cw+(rnd()-.5)*cw*.12, cy:(Math.floor(g/cols)+.5)*ch+(rnd()-.5)*ch*.12, r:r*(.8+rnd()*.25),
          col:'rgb('+c.map(function(v){ return Math.round(v*shade+255*(1-shade)*.15); }).join(',')+')', d:rnd()*.8});
      }
      pts=new Float32Array(N*5);
      for(var i=0;i<N;i++){ var gg=groups[i%G], a=rnd()*6.2832, rr=Math.sqrt(rnd())*gg.r;
        pts[i*5]=rnd()*W; pts[i*5+1]=rnd()*H; pts[i*5+2]=gg.cx+Math.cos(a)*rr; pts[i*5+3]=gg.cy+Math.sin(a)*rr; pts[i*5+4]=rnd()*.35; }
      return true;
    }
    var INK;
    function draw(t){
      ctx.clearRect(0,0,W,H); INK=INK||_tok('--dot','#8A8A85');
      var s=Math.max(.6,1/dpr*1.4);
      for(var g=0;g<G;g++){
        var gg=groups[g];
        for(var i=g;i<N;i+=G){
          var q=Math.max(0,Math.min(1,(t-gg.d-pts[i*5+4])/1.4)), e=q<.5?2*q*q:1-Math.pow(-2*q+2,2)/2;
          if(q<=0||q>=1){ ctx.fillStyle=q>=1?gg.col:INK; ctx.globalAlpha=q>=1?.9:.45; }
          else{ ctx.fillStyle=e>.5?gg.col:INK; ctx.globalAlpha=.45+.45*e; }
          ctx.fillRect(pts[i*5]+(pts[i*5+2]-pts[i*5])*e, pts[i*5+1]+(pts[i*5+3]-pts[i*5+1])*e, s, s);
        }
      }
      ctx.globalAlpha=1;
    }
    function play(){
      if(REDUCED){ draw(99); done=true; return; }
      var t0=null; (function f(ts){ if(t0===null) t0=ts; var t=(ts-t0)/1000; draw(t); if(t<2.7) requestAnimationFrame(f); else done=true; })(performance.now());
    }
    if(!layout()) return;
    draw(0);
    if('IntersectionObserver' in window&&!REDUCED){
      var io=new IntersectionObserver(function(es){ if(es[0].isIntersecting){ io.disconnect(); play(); } },{threshold:.4}); io.observe(cv);
    } else draw(99);
    var rt; window.addEventListener('resize',function(){ clearTimeout(rt); rt=setTimeout(function(){ if(layout()) draw(done?99:0); },150); });
  });
})();

/* ============================================================
   3. THE REGISTRY STORY, TOLD IN FIVE STEPS.
   On a wide screen the explainer stays pinned while five short steps
   pass beside it; each step sets the drawing. The two buttons replay
   it by hand. On a phone the buttons do it all.
   ============================================================ */
(function(){
  var fig=document.querySelector('[data-reach]'); if(!fig) return;
  var NS='http://www.w3.org/2000/svg', svgs=[].slice.call(fig.querySelectorAll('.rc-art')), svg, layer, num, P;
  var btns=[].slice.call(fig.querySelectorAll('.reach-seg button')), says=[].slice.call(fig.querySelectorAll('.reach-say p'));
  var steps=[].slice.call(document.querySelectorAll('.flag .step'));
  var shown=7757, run=0, chosen=false;
  function pick(){ svg=svgs.filter(function(s){ return s.getBoundingClientRect().width>0; })[0]||svgs[0];
    var pf=svg.getAttribute('data-pf'); layer=svg.querySelector('.rc-movers'); num=svg.querySelector('#'+pf+'-n');
    P=[0,1,2].map(function(i){ return svg.querySelector('#'+pf+'-p'+i); }); }
  function count(to){
    var from=shown; shown=to;
    svgs.forEach(function(s){ var n=s.querySelector('.rc-n'); if(n&&n!==num) n.textContent=to.toLocaleString('en'); });
    if(REDUCED){ num.textContent=to.toLocaleString('en'); return; }
    var t0=null; (function f(ts){ if(t0===null) t0=ts; var q=Math.min(1,(ts-t0)/900), e=1-Math.pow(1-q,3);
      num.textContent=Math.round(from+(to-from)*e).toLocaleString('en'); if(q<1) requestAnimationFrame(f); })(performance.now());
  }
  function mover(cls,w,h){ var r=document.createElementNS(NS,'rect'); r.setAttribute('class',cls);
    r.setAttribute('width',w); r.setAttribute('height',h); r.setAttribute('x',-w/2); r.setAttribute('y',-h/2); layer.appendChild(r); return r; }
  function travel(path,cls,w,h,delay,dur,back,id){
    var L=path.getTotalLength(), el=mover(cls,w,h), t0=null; el.style.opacity=0;
    function f(ts){ if(id!==run){ el.remove(); return; } if(t0===null) t0=ts;
      var q=(ts-t0-delay)/dur; if(q<0){ requestAnimationFrame(f); return; } if(q>1){ el.remove(); return; }
      var e=q<.5?2*q*q:1-Math.pow(-2*q+2,2)/2, pt=path.getPointAtLength(L*(back?1-e:e));
      el.setAttribute('transform','translate('+pt.x.toFixed(1)+' '+pt.y.toFixed(1)+')'+(cls==='rc-mv-an'?' rotate(45)':''));
      el.style.opacity=q<.1?q/.1:(q>.92?(1-q)/.08:1); requestAnimationFrame(f); }
    requestAnimationFrame(f);
  }
  /* phases: idle, records, lock, out, analysis */
  function set(ph,play){
    pick(); svgs.forEach(function(s){ var l=s.querySelector('.rc-movers'); while(l.firstChild) l.removeChild(l.firstChild); });
    var m=(ph==='out'||ph==='analysis')?'analysis':'records';
    fig.setAttribute('data-mode',m); fig.setAttribute('data-phase',ph);
    btns.forEach(function(b){ b.setAttribute('aria-pressed',String(b.getAttribute('data-m')===m)); });
    says.forEach(function(p){ p.hidden=p.getAttribute('data-for')!==m; });
    var id=++run;
    if(!play||REDUCED){ count(ph==='analysis'?11284:7757); return; }
    if(ph!=='out'&&ph!=='idle') for(var k=0;k<3;k++){ travel(P[0],'rc-mv-rec',7,9,k*260,1300,false,id); travel(P[1],'rc-mv-rec',7,9,120+k*260,1300,false,id); }
    if(ph==='out'||ph==='analysis') travel(P[2],'rc-mv-an',11,11,ph==='out'?100:300,1200,true,id);
    if(ph==='analysis'){ for(k=0;k<3;k++) travel(P[2],'rc-mv-res',10,4,1600+k*200,1200,false,id);
      setTimeout(function(){ if(id===run) count(11284); },2300); }
    else count(7757);
  }
  btns.forEach(function(b){ b.addEventListener('click',function(){ chosen=true; fig.classList.add('chosen'); set(b.getAttribute('data-m')==='analysis'?'analysis':'lock',true); }); });
  var wide=window.matchMedia&&window.matchMedia('(min-width:981px)').matches;
  if(wide&&steps.length&&'IntersectionObserver' in window){
    fig.classList.add('scrolly');
    var cur=null;
    var io=new IntersectionObserver(function(es){
      es.forEach(function(en){ if(!en.isIntersecting) return; var s=en.target;
        if(s===cur) return; cur=s; steps.forEach(function(x){ x.classList.toggle('on',x===s); });
        if(!chosen) set(s.getAttribute('data-s'),true); });
    },{rootMargin:'-42% 0px -42% 0px',threshold:0});
    steps.forEach(function(s){ io.observe(s); });
    set('idle',false);
  } else if('IntersectionObserver' in window&&!REDUCED){
    var io2=new IntersectionObserver(function(es){ if(es[0].isIntersecting){ io2.disconnect(); if(!chosen) set('lock',true); } },{threshold:.5});
    io2.observe(fig);
  }
})();

/* ============================================================
   4. THE COMPLEXITY DIAL. From a spreadsheet to a transformer, with
   his three decisions sitting where each one landed.
   ============================================================ */
(function(){
  var root=document.querySelector('[data-dial]'); if(!root) return;
  var r=root.querySelector('input'), arts=[].slice.call(root.querySelectorAll('.dial-a')), marks=[].slice.call(root.querySelectorAll('.dial-marks li')), say=root.querySelector('.dial-say');
  var NAMES=['a spreadsheet','logistic regression','a decision tree','a neural network, fitted to each country','a transformer'];
  var SAY=['<b>Sometimes, this is enough.</b> A team lead reminded me that Excel already did what the team needed.',
           '<b>Where I landed instead of a transformer.</b> Easier to understand, and it could be deployed.',
           '<b>A decision tree.</b> No decision of mine sits here yet.',
           '<b>Where more complexity earned its place.</b> The differences between countries were the whole problem.',
           '<b>What I first proposed.</b> Before we realized logistic regression could do the job.'];
  function set(v){ v=+v; r.value=v; r.setAttribute('aria-valuetext',NAMES[v]);
    arts.forEach(function(a){ a.classList.toggle('on',+a.getAttribute('data-stop')===v); if(+a.getAttribute('data-stop')===v) a.classList.add('in'); });
    marks.forEach(function(m,i){ m.classList.toggle('on',i===v); });
    say.innerHTML='<span class="dial-name">'+NAMES[v].charAt(0).toUpperCase()+NAMES[v].slice(1)+'.</span> '+SAY[v]; }
  r.addEventListener('input',function(){ set(r.value); });
  marks.forEach(function(m,i){ m.addEventListener('click',function(){ set(i); }); });
  root.classList.add('live'); set(r.value);
})();

/* ============================================================
   5. YOUR QUESTION. The thread ends in a line you can type into; it
   becomes the start of an email in the visitor's own mail app.
   ============================================================ */
(function(){
  var f=document.querySelector('[data-ask]'); if(!f) return;
  f.addEventListener('submit',function(e){
    e.preventDefault();
    var a=document.querySelector('.contact-mail'), href=a&&a.getAttribute('href');
    if(!href||href.indexOf('mailto:')!==0) return;
    var q=(f.q.value||'').trim();
    location.href=href+'?subject='+encodeURIComponent('A question')+'&body='+encodeURIComponent(q?q+'\n\n':'');
  });
})();

/* ============================================================
   6. DRAG THE PARCEL HUBS. His 2017 problem, playable: move three
   hubs, the cities re-link, and the total distance in the drawing
   follows. "Let the search run" moves them to a better layout.
   ============================================================ */
(function(){
  var svg=document.querySelector('svg[data-hubs]'); if(!svg) return;
  var data=JSON.parse(svg.getAttribute('data-hubs')), nodes=data.nodes, old=data.old.map(function(h){ return h.slice(); });
  var hubs=old.map(function(h){ return h.slice(); }), NS='http://www.w3.org/2000/svg';
  function el(n,a,t){ var e=document.createElementNS(NS,n); for(var k in a) e.setAttribute(k,a[k]); if(t!=null) e.textContent=t; return e; }
  while(svg.firstChild) svg.removeChild(svg.firstChild);
  svg.classList.add('in','hubs-live');
  svg.appendChild(el('text',{x:20,y:22},'Drag the red hubs. Every city sends its parcels to the nearest one.'));
  var gl=el('g',{}), gn=el('g',{}), gh=el('g',{}); svg.appendChild(gl);
  old.forEach(function(o){ svg.appendChild(el('rect',{'class':'a-m a-dash',x:o[0]-7,y:o[1]-7,width:14,height:14})); });
  svg.appendChild(gn); svg.appendChild(gh);
  nodes.forEach(function(n){ gn.appendChild(el('circle',{'class':'a-fk',cx:n[0],cy:n[1],r:3})); });
  var lines=nodes.map(function(){ var l=el('path',{'class':'a-t'}); gl.appendChild(l); return l; });
  var hubEls=hubs.map(function(h,i){
    var g=el('g',{'class':'hub',tabindex:0,role:'slider','aria-label':'Sorting hub '+(i+1)+'. Arrow keys move it.','aria-valuemin':0,'aria-valuemax':100});
    g.appendChild(el('rect',{'class':'hub-hit',x:-16,y:-16,width:32,height:32}));
    g.appendChild(el('rect',{'class':'a-fr',x:-9,y:-9,width:18,height:18}));
    g.appendChild(el('path',{'class':'a-p',d:'M0 -9 V9 M-9 0 H9'}));
    gh.appendChild(g); return g; });
  var searched=false;
  function cost(hs){ return nodes.reduce(function(s,n){ return s+Math.min.apply(null,hs.map(function(h){ return Math.hypot(n[0]-h[0],n[1]-h[1]); })); },0); }
  var base=cost(old);
  var fig=svg.closest('figure'), bar=document.createElement('div'); bar.className='hubs-ctl';
  bar.innerHTML='<button type="button" class="btn-line hubs-run">Let the search run</button><button type="button" class="hubs-reset">Start again</button><p class="hubs-read" aria-live="polite"></p>';
  svg.parentNode.insertBefore(bar,svg.nextSibling);
  var read=bar.querySelector('.hubs-read');
  function render(){
    var served=hubs.map(function(){ return 0; });
    nodes.forEach(function(n,i){ var k=0,b=1e9; hubs.forEach(function(h,j){ var d=Math.hypot(n[0]-h[0],n[1]-h[1]); if(d<b){ b=d; k=j; } });
      served[k]++;
      lines[i].setAttribute('d','M'+n[0]+' '+n[1]+' L'+hubs[k][0].toFixed(1)+' '+hubs[k][1].toFixed(1)); });
    /* for a screen reader: where the hub is on the map, and how many cities it serves */
    hubEls.forEach(function(g,i){ g.setAttribute('transform','translate('+hubs[i][0].toFixed(1)+' '+hubs[i][1].toFixed(1)+')');
      var ax=Math.round((hubs[i][0]-12)/436*100), dn=Math.round((hubs[i][1]-34)/166*100);
      g.setAttribute('aria-valuenow',ax);
      g.setAttribute('aria-valuetext',ax+'% across and '+dn+'% down the map, serving '+served[i]+' of '+nodes.length+' cities'); });
    var c=cost(hubs)/base*100, dlt=Math.round(100-c);
    read.innerHTML=(running?'Step '+step+'. ':'')+'Total distance in this drawing: <b>'+Math.round(c)+'</b>'+(dlt>0?', '+dlt+'% shorter than the old layout.':dlt<0?', '+(-dlt)+'% longer than the old layout.':', the old layout.')+(searched?' Delivered.':'');
  }
  function toSvg(e){ var p=svg.createSVGPoint(); p.x=e.clientX; p.y=e.clientY; return p.matrixTransform(svg.getScreenCTM().inverse()); }
  var drag=-1;
  hubEls.forEach(function(g,i){
    g.addEventListener('pointerdown',function(e){ if(running) return; drag=i; g.setPointerCapture(e.pointerId); g.classList.add('drag'); e.preventDefault(); });
    g.addEventListener('pointermove',function(e){ if(drag!==i) return; var p=toSvg(e); hubs[i]=[Math.max(12,Math.min(448,p.x)),Math.max(34,Math.min(200,p.y))]; render(); });
    g.addEventListener('pointerup',function(){ drag=-1; g.classList.remove('drag'); });
    g.addEventListener('keydown',function(e){ if(running) return; var d={ArrowLeft:[-6,0],ArrowRight:[6,0],ArrowUp:[0,-6],ArrowDown:[0,6]}[e.key]; if(!d) return;
      e.preventDefault(); hubs[i]=[Math.max(12,Math.min(448,hubs[i][0]+d[0])),Math.max(34,Math.min(200,hubs[i][1]+d[1]))]; render(); });
  });
  function lloyd(){ var groups=hubs.map(function(){ return []; });
    nodes.forEach(function(n){ var k=0,b=1e9; hubs.forEach(function(h,j){ var d=Math.hypot(n[0]-h[0],n[1]-h[1]); if(d<b){ b=d; k=j; } }); groups[k].push(n); });
    return hubs.map(function(h,j){ var g=groups[j]; if(!g.length) return h.slice(); return [g.reduce(function(s,n){ return s+n[0]; },0)/g.length, g.reduce(function(s,n){ return s+n[1]; },0)/g.length]; }); }
  /* the search, slow enough to watch: one step at a time, each hub leaving a trail of where it has been */
  var gt=el('g',{'class':'hub-trails'}); svg.insertBefore(gt,gn);
  var trails=hubs.map(function(){ var t=el('path',{'class':'hub-trail'}); gt.appendChild(t); return t; }), pts=[], step=0, running=false;
  var run=bar.querySelector('.hubs-run');
  function mark(){ hubs.forEach(function(h,i){ pts[i].push(h.slice());
      trails[i].setAttribute('d',pts[i].map(function(q,k){ return (k?'L':'M')+q[0].toFixed(1)+' '+q[1].toFixed(1); }).join(' '));
      if(pts[i].length>1) gt.appendChild(el('circle',{'class':'hub-step',cx:h[0].toFixed(1),cy:h[1].toFixed(1),r:2.2})); }); }
  function clearTrails(){ pts=hubs.map(function(){ return []; }); trails.forEach(function(t){ t.removeAttribute('d'); });
    [].slice.call(gt.querySelectorAll('.hub-step')).forEach(function(c){ c.remove(); }); }
  run.addEventListener('click',function(){
    if(running) return; running=true; searched=false; step=0; run.disabled=true; clearTrails(); mark();
    (function next(){
      var aim=lloyd(), from=hubs.map(function(h){ return h.slice(); });
      var move=Math.max.apply(null,aim.map(function(q,j){ return Math.hypot(q[0]-from[j][0],q[1]-from[j][1]); }));
      if(move<1||step>=12){ hubs=aim; running=false; run.disabled=false; searched=true; render(); return; }
      /* halfway each step, so the search is slow enough to follow */
      var to=aim.map(function(q,j){ return [from[j][0]+(q[0]-from[j][0])*.5, from[j][1]+(q[1]-from[j][1])*.5]; });
      step++;
      if(REDUCED){ hubs=to; mark(); render(); next(); return; }
      var t0=null;
      (function f(ts){ if(t0===null) t0=ts; var q=Math.min(1,(ts-t0)/850), e=q<.5?4*q*q*q:1-Math.pow(-2*q+2,3)/2;
        hubs=from.map(function(h,j){ return [h[0]+(to[j][0]-h[0])*e, h[1]+(to[j][1]-h[1])*e]; }); render();
        if(q<1) requestAnimationFrame(f); else { mark(); render(); setTimeout(next,260); } })(performance.now());
    })();
  });
  bar.querySelector('.hubs-reset').addEventListener('click',function(){ if(running) return; searched=false; clearTrails(); hubs=old.map(function(h){ return h.slice(); }); render(); });
  render();
})();

/* ============================================================
   7. THE PANEL OF SIX ASKS ITS QUESTIONS. The three questions from
   his own account of the mandate: where could it go, what could it
   be worth, why public money.
   ============================================================ */
(function(){
  var seats=[].slice.call(document.querySelectorAll('.seat')); if(!seats.length) return;
  var svg=seats[0].ownerSVGElement, cap=svg.closest('figure').querySelector('.panel-q'), NS='http://www.w3.org/2000/svg', bub=null;
  function show(s){
    hide(); var q=s.getAttribute('data-q'), x=+s.getAttribute('data-x'), y=+s.getAttribute('data-y');
    bub=document.createElementNS(NS,'g'); bub.setAttribute('class','bubble');
    var t=document.createElementNS(NS,'text'); t.textContent=q; t.setAttribute('y',0); t.setAttribute('x',0); t.setAttribute('text-anchor','middle');
    bub.appendChild(t); svg.appendChild(bub);
    var w=t.getComputedTextLength()+22, bx=Math.max(4+w/2,Math.min(456-w/2,x));
    var r=document.createElementNS(NS,'rect'); r.setAttribute('x',-w/2); r.setAttribute('y',-19); r.setAttribute('width',w); r.setAttribute('height',28);
    bub.insertBefore(r,t); bub.setAttribute('transform','translate('+bx.toFixed(0)+' '+Math.max(24,y-8)+')');
    cap.textContent=q; seats.forEach(function(x){ x.classList.toggle('on',x===s); });
  }
  function hide(){ if(bub){ bub.remove(); bub=null; } }
  seats.forEach(function(s){
    s.addEventListener('pointerenter',function(){ show(s); }); s.addEventListener('focus',function(){ show(s); });
    s.addEventListener('click',function(){ show(s); });
    s.addEventListener('pointerleave',hide); s.addEventListener('blur',hide);
  });
})();

/* ============================================================
   8. TRY IT: CAN ONE LINE FIT FOUR COUNTRIES? Drag the ends of one
   line through four groups of patients, then let each country have
   its own. A drawing of the idea; the study's numbers sit beneath.
   ============================================================ */
(function(){
  var fig=document.querySelector('[data-tryit]'); if(!fig) return;
  var svg=fig.querySelector('.tryit-art'), NS='http://www.w3.org/2000/svg', rnd=_prng(4);
  function el(n,a){ var e=document.createElementNS(NS,n); for(var k in a) e.setAttribute(k,a[k]); return e; }
  var G=[{cx:80,base:196,sl:.55},{cx:200,base:84,sl:-.45},{cx:320,base:170,sl:.2},{cx:440,base:74,sl:.7}], pts=[];
  G.forEach(function(g,gi){ for(var i=0;i<16;i++){ var x=g.cx-44+rnd()*88; pts.push({x:x,y:g.base+g.sl*(x-g.cx)+(rnd()-.5)*16,g:gi}); } });
  var line={l:140,r:140}, fitted=false;
  svg.appendChild(el('path',{'class':'try-axis',d:'M20 236 H500'}));
  ['Country A','Country B','Country C','Country D'].forEach(function(n,i){ var t=el('text',{x:G[i].cx,y:254,'text-anchor':'middle','class':'try-lab'}); t.textContent=n; svg.appendChild(t); });
  pts.forEach(function(p){ svg.appendChild(el('circle',{cx:p.x.toFixed(1),cy:p.y.toFixed(1),r:4,'class':'try-pt g'+p.g})); });
  var gfit=el('g',{'class':'try-fits'}); svg.appendChild(gfit);
  var L=el('path',{'class':'try-line'}); svg.appendChild(L);
  var hs=['l','r'].map(function(side){ var h=el('circle',{'class':'try-h',r:9,tabindex:0,role:'slider','aria-label':(side==='l'?'Left':'Right')+' end of the shared line. Arrow keys move it.','aria-orientation':'vertical','aria-valuemin':0,'aria-valuemax':100}); svg.appendChild(h); h.side=side; return h; });
  var err=fig.querySelector('.tryit-err');
  function yAt(x){ return line.l+(line.r-line.l)*(x-20)/480; }
  function fitGroup(gi){ var ps=pts.filter(function(p){ return p.g===gi; }), n=ps.length, mx=0,my=0; ps.forEach(function(p){ mx+=p.x; my+=p.y; }); mx/=n; my/=n;
    var sxy=0,sxx=0; ps.forEach(function(p){ sxy+=(p.x-mx)*(p.y-my); sxx+=(p.x-mx)*(p.x-mx); }); var b=sxy/sxx; return {mx:mx,my:my,b:b}; }
  function render(){
    L.setAttribute('d','M20 '+line.l.toFixed(1)+' L500 '+line.r.toFixed(1));
    hs[0].setAttribute('cx',20); hs[0].setAttribute('cy',line.l.toFixed(1)); hs[1].setAttribute('cx',500); hs[1].setAttribute('cy',line.r.toFixed(1));
    /* for a screen reader: how high each end sits, 0 at the bottom of its range and 100 at the top */
    hs.forEach(function(h){ var v=Math.round((230-line[h.side])/210*100); h.setAttribute('aria-valuenow',v); h.setAttribute('aria-valuetext','Height '+v+' of 100'); });
    var miss=pts.reduce(function(s,p){ return s+Math.abs(p.y-yAt(p.x)); },0)/pts.length, fm=null;
    while(gfit.firstChild) gfit.removeChild(gfit.firstChild);
    if(fitted){ fm=0; G.forEach(function(g,gi){ var f=fitGroup(gi);
      gfit.appendChild(el('path',{'class':'try-fit',d:'M'+(g.cx-48)+' '+(f.my+f.b*(g.cx-48-f.mx)).toFixed(1)+' L'+(g.cx+48)+' '+(f.my+f.b*(g.cx+48-f.mx)).toFixed(1)}));
      pts.filter(function(p){ return p.g===gi; }).forEach(function(p){ fm+=Math.abs(p.y-(f.my+f.b*(p.x-f.mx))); }); }); fm/=pts.length; }
    err.innerHTML='One shared line misses by <b>'+miss.toFixed(0)+'</b> on average.'+(fitted?' One line per country misses by <b class="r">'+fm.toFixed(0)+'</b>.':'');
  }
  function toSvg(e){ var p=svg.createSVGPoint(); p.x=e.clientX; p.y=e.clientY; return p.matrixTransform(svg.getScreenCTM().inverse()); }
  hs.forEach(function(h){
    var drag=false;
    h.addEventListener('pointerdown',function(e){ drag=true; h.setPointerCapture(e.pointerId); e.preventDefault(); });
    h.addEventListener('pointermove',function(e){ if(!drag) return; line[h.side]=Math.max(20,Math.min(230,toSvg(e).y)); render(); });
    h.addEventListener('pointerup',function(){ drag=false; });
    h.addEventListener('keydown',function(e){ var d={ArrowUp:-6,ArrowDown:6}[e.key]; if(!d) return; e.preventDefault(); line[h.side]=Math.max(20,Math.min(230,line[h.side]+d)); render(); });
  });
  fig.querySelector('.tryit-fit').addEventListener('click',function(){ fitted=true; fig.classList.add('fitted'); render(); });
  fig.querySelector('.tryit-reset').addEventListener('click',function(){ fitted=false; fig.classList.remove('fitted'); line={l:140,r:140}; render(); });
  fig.classList.add('live'); render();
})();

/* ============================================================
   9. PICK YOUR ROLE. FLkit's own mapping of five roles to the stages
   of a study, and a link to that role's page in FLkit.
   ============================================================ */
(function(){
  var fig=document.querySelector('[data-roles]'); if(!fig) return;
  var roles=JSON.parse(fig.getAttribute('data-roles')), base=fig.getAttribute('data-base');
  var btns=[].slice.call(fig.querySelectorAll('.roles-pick button')), lis=[].slice.call(fig.querySelectorAll('.roles-stages li')), link=fig.querySelector('.roles-link a');
  function set(i){ var r=roles[i];
    btns.forEach(function(b,j){ b.setAttribute('aria-pressed',String(j===i)); });
    lis.forEach(function(li){ var k=li.getAttribute('data-st'), f=r.focus[k]; li.classList.toggle('on',!!f);
      li.querySelector('span').textContent=f||'not the main focus for this role'; });
    link.setAttribute('href',base+r.slug); }
  btns.forEach(function(b,i){ b.addEventListener('click',function(){ set(i); }); });
})();

/* ============================================================
   10. THE DEGREE OF FEDERATION. Four centers, each sending or keeping
   its records. Only the three measured settings have a score; the
   others say so.
   ============================================================ */
(function(){
  var dof=document.querySelector('.dof'); if(!dof) return;
  var rows=[].slice.call(dof.querySelectorAll('.dof-row')), keep=[true,true,true,true];
  var SC={0:'0.812',2:'0.825',4:'0.846'}, ROW={0:0,2:1,4:2};
  var ui=document.createElement('div'); ui.className='dof-ui';
  ui.innerHTML='<div class="dof-centers" role="group" aria-label="Four centers">'+[1,2,3,4].map(function(i){
    return '<button type="button" aria-pressed="true" data-i="'+(i-1)+'"><span class="dc-box"></span>Center '+i+'<small>keeps its records</small></button>'; }).join('')+
    '</div><p class="dof-read" aria-live="polite"></p>';
  dof.insertBefore(ui,dof.firstChild);
  var read=ui.querySelector('.dof-read'), bs=[].slice.call(ui.querySelectorAll('button'));
  function render(){ var k=keep.filter(Boolean).length;
    bs.forEach(function(b,i){ b.setAttribute('aria-pressed',String(keep[i])); b.querySelector('small').textContent=keep[i]?'keeps its records':'sends its records'; });
    rows.forEach(function(r,i){ r.classList.toggle('now',ROW[k]===i); });
    read.innerHTML=k+' of 4 keep their records. '+(SC[k]?'Area under the curve: <b>'+SC[k]+'</b>'+(k===2?', measured for one split of two and two.':'.'):'<b>Not measured.</b> The paper tested none, two and four.'); }
  bs.forEach(function(b,i){ b.addEventListener('click',function(){ keep[i]=!keep[i]; render(); }); });
  render();
})();

/* ============================================================
   11. BETWEEN PAGES. The header stays; the page arrives, and a red
   line runs along the bottom of the header, as the thread would.
   ============================================================ */
window.addEventListener('pagereveal',function(e){
  if(!e.viewTransition) return;
  var d=document.documentElement; d.classList.add('vt-arrive'); setTimeout(function(){ d.classList.remove('vt-arrive'); },1000);
});

/* ============================================================
   12. FOR WHOEVER OPENS THE CONSOLE.
   ============================================================ */
(function(){
  try{
    console.log('%cHello. The data stays, this message moves.','font:700 14px sans-serif;color:#CE2F19');
    console.log('If you are reading the console, we should probably talk: the email is at the bottom of the page.\n'+
                'And if you think all of this is overkill, type excel() and see what a team lead once told me.');
  }catch(e){}
  window.excel=function(){
    var d=document.documentElement; if(d.classList.contains('xl-on')) return 'Already a spreadsheet.';
    d.classList.add('xl-on');
    var b=document.createElement('div'); b.className='xl-badge'; b.textContent='Sometimes this is enough.'; document.body.appendChild(b);
    setTimeout(function(){ d.classList.remove('xl-on'); b.remove(); },4200);
    return 'Excel already did what the team needed.';
  };
})();

/* ============================================================
   13. THE EMBRACE. Two arms of one red line start above the portrait
   and close around it, meeting underneath. Drawn at the frame's real
   size, so the line is even on every side.
   ============================================================ */
(function(){
  var svg=document.querySelector('.hp-embrace'); if(!svg) return;
  var P=[].slice.call(svg.querySelectorAll('path'));
  function draw(){
    var w=svg.clientWidth, h=svg.clientHeight; if(!w||!h) return;
    svg.setAttribute('viewBox','0 0 '+w+' '+h);
    var m=.8, c=w/2;
    P[0].setAttribute('d','M'+c+' '+m+' H'+m+' V'+(h-m)+' H'+c);
    P[1].setAttribute('d','M'+c+' '+m+' H'+(w-m)+' V'+(h-m)+' H'+c);
    var L=(c-m)*2+(h-2*m); svg.style.setProperty('--L',L.toFixed(1));
    svg.classList.add('ready');
  }
  draw();
  var rt; window.addEventListener('resize',function(){ clearTimeout(rt); rt=setTimeout(function(){ svg.classList.remove('ready'); void svg.offsetWidth; draw(); svg.style.animation='none'; },150); });
})();
