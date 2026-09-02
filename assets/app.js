/* ------------------------------------------------------------
   Run a thing only once it is actually on screen.
   ------------------------------------------------------------ */
function whenSeen(node,cb){
  if(!('IntersectionObserver' in window)){cb();return;}
  var io=new IntersectionObserver(function(es){
    for(var i=0;i<es.length;i++){
      if(es[i].isIntersecting){io.disconnect();cb();return;}
    }
  },{threshold:.25});
  io.observe(node);
}

/* ============================================================
   HERO. Many sources, many shapes, none on a schedule.
   Each source answers on its own, faintly and differently.
   Together they give one answer you can rely on.
   Plays once, slowly.
   ============================================================ */
(function(){
  var svg=document.getElementById('rwd');
  if(!svg) return;
  var NS='http://www.w3.org/2000/svg';
  var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var W,H,ROWS,X0,X1,RX0,ROW_Y,FUNNEL_Y,PX0,PX1,PTOP,PBOT,FS;
  var marks=[],funnel=[],sweep=null,srcs=[],main=null,band=null,mainLen=0,head=null;
  var raf=null,t=0,live=false,done=false;
  /* A shade over two seconds end to end. Longer than that and nobody
     scrolling a page stays to watch it finish. */
  var P1=900,P2=330,P3=460,P4=560,TOTAL=P1+P2+P3+P4;

  var SOURCES=[
    {label:'visits',    kind:'circle'},
    {label:'lab tests', kind:'square'},
    {label:'imaging',   kind:'triangle'},
    {label:'medication',kind:'bar'}
  ];

  function el(n,a,txt){
    var e=document.createElementNS(NS,n);
    for(var k in a) e.setAttribute(k,a[k]);
    if(txt!=null) e.textContent=txt;
    return e;
  }
  function note(x,y,txt){
    return el('text',{x:x,y:y,'font-family':'-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif','font-size':12.5,fill:'var(--mute)'},txt);
  }
  function rnd(s){var x=Math.sin(s*6151.19)*43758.5453;return x-Math.floor(x);}
  function ease(p){return 1-Math.pow(1-p,3);}

  /* every source gets its own mark, drawn about the origin so one
     scale transform can reveal any of them */
  function shape(kind,w){
    if(kind==='circle')   return el('circle',{cx:0,cy:0,r:2.9,fill:'var(--dot)'});
    if(kind==='square')   return el('rect',{x:-2.5,y:-2.5,width:5,height:5,fill:'var(--dot)'});
    if(kind==='triangle') return el('path',{d:'M0 -3.2L3 2.2L-3 2.2Z',fill:'var(--dot)'});
    if(kind==='diamond')  return el('path',{d:'M0 -3.4L3.4 0L0 3.4L-3.4 0Z',fill:'var(--dot)'});
    return el('rect',{x:-w/2,y:-2,width:w,height:4,rx:1,fill:'var(--dot)'}); /* bar */
  }

  function layout(){
    var cssW=svg.getBoundingClientRect().width||460;
    var tight=cssW<430;
    W=tight?360:440; ROWS=SOURCES.length;
    X0=6; X1=W-8; RX0=tight?58:70;
    var gap=tight?24:26;
    ROW_Y=[];
    for(var i=0;i<ROWS;i++) ROW_Y.push(40+i*gap);
    FUNNEL_Y=ROW_Y[ROWS-1]+48;
    PTOP=FUNNEL_Y+64; PBOT=PTOP+82;
    PX0=X0+32; PX1=X1-8;
    H=PBOT+58;
    FS=tight?11.5:11;
    return FS;
  }

  /* one logistic per source, each with its own slope and level */
  function srcCurve(k){
    var pts=[],n=40;
    var slope=6.2+rnd(k*17)*4.4, mid=0.38+rnd(k*29)*0.22, amp=0.68+rnd(k*41)*0.30;
    for(var i=0;i<=n;i++){
      var u=i/n;
      pts.push([PX0+(PX1-PX0)*u, PBOT-(PBOT-PTOP)*amp*(1/(1+Math.exp(-(u-mid)*slope)))]);
    }
    return pts;
  }
  function pathOf(pts){
    var d='';
    for(var i=0;i<pts.length;i++) d+=(i?'L':'M')+pts[i][0].toFixed(1)+' '+pts[i][1].toFixed(1);
    return d;
  }

  function build(){
    var fs=layout();
    while(svg.firstChild) svg.removeChild(svg.firstChild);
    svg.setAttribute('viewBox','0 0 '+W+' '+H);
    marks=[];funnel=[];srcs=[];
    var TT='-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif';

    /* ---------- the sources ---------- */
    svg.appendChild(el('text',{x:X0,y:14,'font-family':TT,'font-size':fs,
      fill:'var(--mute)','letter-spacing':'1.1'},'MANY SOURCES, NONE ON A SCHEDULE'));

    var pace=[42,80,120,150];
    for(var r=0;r<ROWS;r++){
      var y=ROW_Y[r],src=SOURCES[r];
      svg.appendChild(el('text',{x:X0,y:y+4,'font-family':TT,'font-size':fs-0.5,
        fill:'var(--mute)'},src.label));
      svg.appendChild(el('line',{x1:RX0,y1:y,x2:X1,y2:y,
        stroke:'var(--hair)','stroke-width':1}));

      var x=RX0+7+rnd(r*31)*20,k=0;
      while(x<X1-6){
        var bw=src.kind==='bar'?(14+rnd(r*61+k*23)*30):0;
        var g=el('g',{transform:'translate('+x.toFixed(1)+','+y+') scale(0)'});
        g.appendChild(shape(src.kind,bw));
        svg.appendChild(g);
        marks.push({x:x,node:g,y:y});
        x+=pace[r]*(0.40+rnd(r*71+k*29)*1.25)+(bw?bw:0);
        k++;
      }
    }
    svg.appendChild(note(X0,ROW_Y[ROWS-1]+24,
      'Different sources, different shapes, different gaps.'));

    /* ---------- pulled together ---------- */
    var mid=(RX0+X1)/2;
    for(var f=0;f<ROWS;f++){
      var ln=el('line',{x1:RX0+24+f*((X1-RX0-48)/(ROWS-1)),y1:FUNNEL_Y-13,
        x2:mid,y2:FUNNEL_Y+9,stroke:'var(--hair)','stroke-width':1,'stroke-opacity':0});
      svg.appendChild(ln);funnel.push(ln);
    }
    var arrow=el('path',{d:'M'+mid+' '+(FUNNEL_Y+12)+'L'+(mid-5)+' '+(FUNNEL_Y+4)+
      'L'+(mid+5)+' '+(FUNNEL_Y+4)+'z',fill:'var(--red)','fill-opacity':0});
    svg.appendChild(arrow);funnel.push(arrow);

    /* ---------- the answer ---------- */
    svg.appendChild(el('text',{x:X0,y:PTOP-30,'font-family':TT,'font-size':fs,
      fill:'var(--ink)','letter-spacing':'1.1'},'ONE ANSWER THEY ALL SUPPORT'));
    svg.appendChild(el('text',{x:X0,y:PTOP-14,'font-family':TT,'font-size':fs-0.5,
      fill:'var(--mute)'},'what the pattern looks like over time'));

    svg.appendChild(el('line',{x1:PX0,y1:PTOP-6,x2:PX0,y2:PBOT,
      stroke:'var(--hair)','stroke-width':1}));
    svg.appendChild(el('line',{x1:PX0,y1:PBOT,x2:PX1,y2:PBOT,
      stroke:'var(--hair)','stroke-width':1}));
    svg.appendChild(el('text',{x:PX0-6,y:PBOT+3,'text-anchor':'end','font-family':TT,
      'font-size':fs-1.5,fill:'var(--mute)'},'none'));
    svg.appendChild(el('text',{x:PX0-6,y:PTOP+4,'text-anchor':'end','font-family':TT,
      'font-size':fs-1.5,fill:'var(--mute)'},'strong'));
    svg.appendChild(el('text',{x:PX1,y:PBOT+15,'text-anchor':'end','font-family':TT,
      'font-size':fs-1.5,fill:'var(--mute)'},'time'));

    /* each source on its own: faint, and none of them agree exactly */
    var all=[];
    for(var q=0;q<ROWS;q++){
      var pts=srcCurve(q+1); all.push(pts);
      var pth=el('path',{d:pathOf(pts),fill:'none',stroke:'var(--ink-2)',
        'stroke-width':1,'stroke-opacity':0});
      svg.appendChild(pth);srcs.push(pth);
    }

    /* together: the mean, with a band from how far apart they were */
    var m=[],up='',dn='';
    for(var i2=0;i2<all[0].length;i2++){
      var sum=0;
      for(var j=0;j<all.length;j++) sum+=all[j][i2][1];
      var mv=sum/all.length,sd=0;
      for(var j2=0;j2<all.length;j2++) sd+=Math.pow(all[j2][i2][1]-mv,2);
      sd=Math.sqrt(sd/all.length);
      m.push([all[0][i2][0],mv,Math.max(2.5,sd)]);
    }
    for(var i3=0;i3<m.length;i3++) up+=(i3?'L':'M')+m[i3][0].toFixed(1)+' '+(m[i3][1]-m[i3][2]).toFixed(1);
    for(var i4=m.length-1;i4>=0;i4--) dn+='L'+m[i4][0].toFixed(1)+' '+(m[i4][1]+m[i4][2]).toFixed(1);

    band=el('path',{d:up+dn+'Z',fill:'var(--red)','fill-opacity':0});
    main=el('path',{d:pathOf(m),fill:'none',stroke:'var(--red)','stroke-width':2.5,
      'stroke-linecap':'round'});
    svg.appendChild(band);svg.appendChild(main);
    mainLen=main.getTotalLength?main.getTotalLength():600;
    main.setAttribute('stroke-dasharray',mainLen);
    main.setAttribute('stroke-dashoffset',mainLen);
    head=el('circle',{cx:m[m.length-1][0],cy:m[m.length-1][1],r:3.4,
      fill:'var(--red)','fill-opacity':0});
    svg.appendChild(head);

    svg.appendChild(note(X0,PBOT+40,
      'Thin lines are single sources. The red line is what they agree on.'));

    sweep=el('line',{x1:RX0,y1:20,x2:RX0,y2:ROW_Y[ROWS-1]+9,
      stroke:'var(--red)','stroke-width':1.4});
    svg.appendChild(sweep);
  }

  function render(ms){
    var p1=Math.max(0,Math.min(1,ms/P1)),sx=RX0+(X1-RX0)*p1;
    sweep.setAttribute('x1',sx);sweep.setAttribute('x2',sx);
    sweep.setAttribute('stroke-opacity',ms>=P1?'0':'1');
    for(var i=0;i<marks.length;i++){
      var mk=marks[i],on=mk.x<=sx?1:0;
      mk.node.setAttribute('transform',
        'translate('+mk.x.toFixed(1)+','+mk.y+') scale('+on+')');
      mk.node.setAttribute('opacity',on?'.72':'0');
    }
    var e2=ease(Math.max(0,Math.min(1,(ms-P1)/P2)));
    for(var f=0;f<funnel.length;f++)
      funnel[f].setAttribute(f===funnel.length-1?'fill-opacity':'stroke-opacity',
        (e2*(f===funnel.length-1?1:.9)).toFixed(2));

    /* sources fade up one after another */
    var p3=Math.max(0,Math.min(1,(ms-P1-P2)/P3));
    for(var q=0;q<srcs.length;q++){
      var lo=Math.max(0,Math.min(1,(p3-q*0.13)/0.5));
      srcs[q].setAttribute('stroke-opacity',(ease(lo)*0.38).toFixed(2));
    }
    var e4=ease(Math.max(0,Math.min(1,(ms-P1-P2-P3)/P4)));
    main.setAttribute('stroke-dashoffset',(mainLen*(1-e4)).toFixed(1));
    band.setAttribute('fill-opacity',(0.13*e4).toFixed(3));
    head.setAttribute('fill-opacity',(e4>0.93?(e4-0.93)/0.07:0).toFixed(2));
  }

  var prev=0;
  function loop(ts){
    if(!live){raf=null;return;}
    if(!prev){prev=ts;raf=requestAnimationFrame(loop);return;}
    var dt=Math.min(ts-prev,60);prev=ts;
    t+=dt;render(Math.min(t,TOTAL));
    if(t<TOTAL) raf=requestAnimationFrame(loop);
    else{done=true;raf=null;render(TOTAL);}   /* a slide. it stops. */
  }

  /* The finished picture is the default, not the reward for waiting. Anyone who
     scrolls fast, prints the page, or arrives at an anchor below this point sees
     a complete figure. The animation only replays when the figure is genuinely
     scrolling into view from below, which is the one time it is worth watching. */
  build();render(TOTAL);t=TOTAL;done=true;
  if(!reduced&&'IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){
      var e=es[0];
      if(!e.isIntersecting) return;
      io.disconnect();
      if(e.boundingClientRect.top>window.innerHeight*0.34){
        done=false;t=0;live=true;prev=0;render(0);
        if(!raf)raf=requestAnimationFrame(loop);
      }
    },{threshold:.15});
    io.observe(svg);
  }

  var rt;
  window.addEventListener('resize',function(){
    clearTimeout(rt);
    rt=setTimeout(function(){
      if(raf){cancelAnimationFrame(raf);raf=null;}
      build();
      if(done||reduced){t=TOTAL;render(TOTAL);}
      else{prev=0;if(live)raf=requestAnimationFrame(loop);else render(Math.min(t,TOTAL));}
    },180);
  });
})();

/* ============================================================
   BAND. The model moves, the records do not.
   Loops, but only once it is on screen.
   ============================================================ */
(function(){
  var svg=document.getElementById('viz');
  if(!svg) return;
  var NS='http://www.w3.org/2000/svg';
  var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var VW=1200,TOP=54,BOX_Y=112,BOX_H=176;   /* people icons removed, so the boxes move up */
  var LABELS=['University hospital','Disease registry','Community clinic','Cohort study','Regional center'];
  var sites=[],token=null,ring=null,raf=null,segs=[],total=0,clock=0,live=false;

  function el(n,a,txt){
    var e=document.createElementNS(NS,n);
    for(var k in a) e.setAttribute(k,a[k]);
    if(txt!=null) e.textContent=txt;
    return e;
  }
  function rnd(s){var x=Math.sin(s*8161.77)*43758.5453;return x-Math.floor(x);}

  function build(){
    while(svg.firstChild) svg.removeChild(svg.firstChild);
    sites=[];segs=[];

    var narrow=svg.clientWidth<680, n=narrow?3:5;
    var pad=16,gap=narrow?26:30,w=(VW-pad*2-gap*(n-1))/n;

    svg.appendChild(el('line',{x1:pad,y1:TOP,x2:VW-pad,y2:TOP,
      stroke:'var(--hair)','stroke-width':1}));
    svg.appendChild(el('text',{x:pad,y:TOP-16,'font-family':'-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif',
      'font-size':13,fill:'var(--mute)'},'the model travels'));

    /* every site holds a different population. that is why it must adapt. */
    var HET=[{n:1.00,spread:1.00,bias:.50,size:1.00},
             {n:0.55,spread:0.62,bias:.32,size:1.25},
             {n:1.35,spread:1.00,bias:.58,size:0.80},
             {n:0.72,spread:0.85,bias:.70,size:1.10},
             {n:0.95,spread:0.55,bias:.44,size:0.95}];

    for(var i=0;i<n;i++){
      var x=pad+i*(w+gap),cx=x+w/2,g=el('g',{}),h=HET[i%5];
      var box=el('rect',{x:x,y:BOX_Y,width:w,height:BOX_H,fill:'none',
        stroke:'var(--hair)','stroke-width':1.5});
      g.appendChild(box);

      var dots=[],count=Math.round((narrow?30:38)*h.n);
      for(var j=0;j<count;j++){
        var s=i*97+j*13;
        var dx=x+10+rnd(s)*(w-20);
        var d0=Math.max(.04,Math.min(.96,h.bias+(rnd(s+400)-0.5)*h.spread));
        var d=el('circle',{cx:dx,cy:BOX_Y+12+d0*(BOX_H-30),
          r:(1.5+rnd(s+800)*1.4)*h.size,fill:'var(--dot)','fill-opacity':.42});
        dots.push(d);g.appendChild(d);
      }

      g.appendChild(el('text',{x:cx,y:BOX_Y+BOX_H+22,'text-anchor':'middle',
        'font-family':'-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif','font-size':14,fill:'var(--ink-2)'},LABELS[i]));
      /* the count is what makes the difference between sites legible. the caption
         says the boxes differ; this is where the reader can see how much. */
      g.appendChild(el('text',{x:cx,y:BOX_Y+BOX_H+40,'text-anchor':'middle',
        'font-family':'-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif','font-size':11.5,fill:'var(--mute)'},
        'n = '+count+'   records stay'));

      svg.appendChild(g);
      sites.push({cx:cx,box:box,dots:dots,dipY:BOX_Y+BOX_H/2});
    }

    svg.appendChild(el('text',{x:pad,y:BOX_Y+BOX_H+70,'font-family':'-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif',
      'font-size':14,fill:'var(--mute)'},
      'The boxes differ on purpose. Each site sees a different set of patients, '+
      'which is exactly why one shared model is not enough.'));

    ring=el('circle',{cx:sites[0].cx,cy:TOP,r:9,fill:'none',stroke:'var(--red)',
      'stroke-width':1.5,'stroke-opacity':0});
    token=el('circle',{cx:sites[0].cx,cy:TOP,r:6,fill:'var(--red)'});
    svg.appendChild(ring);svg.appendChild(token);

    var pts=[];
    for(var k=0;k<sites.length;k++){
      pts.push({x:sites[k].cx,y:TOP,d:520,site:-1});
      pts.push({x:sites[k].cx,y:sites[k].dipY,d:420,site:k});
      pts.push({x:sites[k].cx,y:sites[k].dipY,d:620,site:k,hold:true});
      pts.push({x:sites[k].cx,y:TOP,d:380,site:-1});
    }
    total=0;
    for(var m=0;m<pts.length;m++){
      var a=pts[m],b=pts[(m+1)%pts.length];
      segs.push({ax:a.x,ay:a.y,bx:b.x,by:b.y,dur:a.d,site:a.site,hold:!!a.hold});
      total+=a.d;
    }
  }

  var lastVisit=-1;
  function visit(i){
    if(i<0||i===lastVisit) return;
    lastVisit=i;
    var s=sites[i];
    s.box.setAttribute('stroke','var(--red)');
    s.box.setAttribute('stroke-width','2');
    for(var j=0;j<s.dots.length;j++) s.dots[j].setAttribute('fill-opacity','.85');
    setTimeout(function(){
      s.box.setAttribute('stroke','var(--hair)');
      s.box.setAttribute('stroke-width','1.5');
      for(var j2=0;j2<s.dots.length;j2++) s.dots[j2].setAttribute('fill-opacity','.42');
    },560);
  }

  function frame(dt){
    clock=(clock+dt)%total;
    var t2=clock,i=0;
    while(t2>segs[i].dur){t2-=segs[i].dur;i++;}
    var s=segs[i],p=t2/s.dur;
    var e=p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;
    var x=s.ax+(s.bx-s.ax)*e,y=s.ay+(s.by-s.ay)*e;
    token.setAttribute('cx',x);token.setAttribute('cy',y);
    ring.setAttribute('cx',x);ring.setAttribute('cy',y);
    if(s.hold){
      visit(s.site);
      ring.setAttribute('r',9+p*13);
      ring.setAttribute('stroke-opacity',String(0.75*(1-p)));
    }else{
      ring.setAttribute('stroke-opacity','0');
      if(s.site<0) lastVisit=-1;
    }
  }

  var prev=0;
  function loop(ts){
    if(!live){raf=null;return;}
    raf=requestAnimationFrame(loop);
    if(!prev){prev=ts;return;}
    var dt=Math.min(ts-prev,60);prev=ts;
    frame(dt);
  }

  build();frame(0);
  if(!reduced){
    /* start on first sight, then pause whenever it scrolls away */
    if('IntersectionObserver' in window){
      new IntersectionObserver(function(es){
        var vis=es[0].isIntersecting;
        if(vis&&!live){live=true;prev=0;if(!raf)raf=requestAnimationFrame(loop);}
        else if(!vis){live=false;}
      },{threshold:.2}).observe(svg);
    }else{live=true;raf=requestAnimationFrame(loop);}
  }

  var rt;
  window.addEventListener('resize',function(){
    clearTimeout(rt);
    rt=setTimeout(function(){build();frame(0);prev=0;},180);
  });
})();

/* ------------------------------------------------------------
   Top bar appears once the hero is behind you.
   ------------------------------------------------------------ */
(function(){
  var bar=document.getElementById('topbar'),
      hero=document.querySelector('.masthead');
  if(!bar||!hero) return;
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(es){
      bar.classList.toggle('show',!es[0].isIntersecting);
    },{rootMargin:'-90px 0px 0px 0px',threshold:0}).observe(hero);
  }else{
    window.addEventListener('scroll',function(){
      bar.classList.toggle('show',window.scrollY>hero.offsetHeight-90);
    },{passive:true});
  }
})();

/* ------------------------------------------------------------
   Anything folded is open on paper. A printed page that silently drops a
   caveat is worse than one that never had it.
   ------------------------------------------------------------ */
(function(){
  function openAll(){
    var d=document.querySelectorAll('details.fold');
    for(var i=0;i<d.length;i++) d[i].open=true;
  }
  window.addEventListener('beforeprint',openAll);
  if(window.matchMedia){
    var mq=window.matchMedia('print');
    if(mq.addEventListener) mq.addEventListener('change',function(e){ if(e.matches)openAll(); });
  }
})();

/* ------------------------------------------------------------
   The spine draws itself.
   Same gesture as the rule on the opening card, a second later and going all the
   way across. Finished state is what the stylesheet says, so with no script, no
   observer, or reduced motion asked for, the spine is simply there.
   ------------------------------------------------------------ */
(function(){
  var sp=document.querySelector('.spine');
  if(!sp||!window.matchMedia) return;
  if(window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  whenSeen(sp,function(){ sp.classList.add('draw'); });
})();

/* ------------------------------------------------------------
   Mark the section you are in. Seven screens is long enough that
   "where am I" stops being obvious.
   ------------------------------------------------------------ */
(function(){
  var links=[].slice.call(document.querySelectorAll('.tb-links a[href^="#"]'));
  if(!links.length||!('IntersectionObserver' in window)) return;

  var byId={},targets=[];
  links.forEach(function(a){
    var t=document.getElementById(a.getAttribute('href').slice(1));
    if(t){byId[t.id]=a;targets.push(t);}
  });
  if(!targets.length) return;

  /* Intersection alone gets this wrong. The full bleed figure bands sit between
     sections and are not tracked, so while you are reading one of them the next
     section is already intersecting and the nav runs a section ahead. Ask a
     simpler question instead: which section have you most recently scrolled past?
     That is the one you are in, figure bands included. */
  var LINE=110;
  function mark(){
    var cur=null;
    for(var i=0;i<targets.length;i++){
      if(targets[i].getBoundingClientRect().top<=LINE) cur=targets[i].id;
    }
    /* The last section can be shorter than the space below the line, so the page
       runs out before its top ever gets there and it could never be marked. At
       the bottom of the document, you are in the last one by definition. */
    if(window.innerHeight+window.scrollY >= document.documentElement.scrollHeight-2)
      cur=targets[targets.length-1].id;
    links.forEach(function(a){
      a.classList.toggle('on',!!cur&&a.getAttribute('href')==='#'+cur);
    });
  }
  /* No requestAnimationFrame gate here. A hidden or backgrounded tab throttles
     rAF, so the callback that clears the flag may never run, and the marker stays
     stuck on whatever it last decided. mark() is three rect reads; just do it. */
  window.addEventListener('scroll',mark,{passive:true});
  window.addEventListener('resize',mark,{passive:true});
  mark();
})();

/* ============================================================
   THREE THINGS YOU CAN OPERATE.
   Every number below is lifted from the papers. Where something
   is arithmetic rather than a measurement it says so on the page.
   ============================================================ */
(function(){
  var NS='http://www.w3.org/2000/svg';
  function el(n,a,txt){
    var e=document.createElementNS(NS,n);
    for(var k in a) e.setAttribute(k,a[k]);
    if(txt!=null) e.textContent=txt;
    return e;
  }
  function clear(n){while(n.firstChild)n.removeChild(n.firstChild);}
  function rnd(s){var x=Math.sin(s*7919.13)*43758.5453;return x-Math.floor(x);}

  /* ---------------------------------------------------------
     A. THE DEGREE OF FEDERATION.  FL4E, Fed-Heart-Disease.
     Three measured points, so the control has three stops and
     nothing between them is invented.
     --------------------------------------------------------- */
  (function(){
    var svg=document.getElementById('dof-viz');
    var stage=svg&&svg.parentNode;
    if(!svg) return;
    var modeEl=document.getElementById('dof-mode'),
        barEl=document.getElementById('dof-bar'),
        valEl=document.getElementById('dof-val'),
        sayEl=document.getElementById('dof-say');
    var SANS='-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif';

    var STOPS=[
      {keep:0,auc:0.812,mode:'Everyone centralizes',short:'All four send their records',
       say:'Every center ships its records to one server. This is the setup the field still '+
           'treats as the ceiling, and it scores lowest of the three.'},
      {keep:2,auc:0.825,mode:'Two of four hold back',short:'Two send, two keep',
       say:'Two centers send their records and two keep them and train in place. Nobody had to be '+
           'argued out of their own policy, and it already beats pooling.'},
      {keep:4,auc:0.846,mode:'Nobody sends anything',short:'All four keep theirs',
       say:'No records move at all, and on this benchmark it is the best of the three. That is '+
           'the argument: the middle of this scale is somewhere you can stand, and here the far '+
           'end cost nothing.'}
    ];
    var LO=0.78,HI=0.86,cur=2;

    function draw(keep){
      while(svg.firstChild)svg.removeChild(svg.firstChild);
      var narrow=(stage&&stage.clientWidth||640)<430;
      if(narrow){ drawNarrow(keep); return; }
      var W=640,n=4,bw=104,gap=34,x0=(W-(n*bw+(n-1)*gap))/2,hubY=176,siteY=26,boxH=64;
      svg.setAttribute('viewBox','0 0 640 208');
      svg.appendChild(el('text',{x:x0,y:14,'font-family':SANS,'font-size':10.5,
        fill:'var(--mute)','letter-spacing':'1.2'},'FOUR CENTERS'));

      for(var i=0;i<n;i++){
        var x=x0+i*(bw+gap),cx=x+bw/2,stays=i>=(n-keep);
        svg.appendChild(el('rect',{x:x,y:siteY,width:bw,height:boxH,fill:'none',
          stroke:stays?'var(--red)':'var(--hair)','stroke-width':stays?1.6:1.2}));
        for(var d=0;d<14;d++){
          svg.appendChild(el('circle',{cx:x+9+rnd(i*31+d)*(bw-18),
            cy:siteY+8+rnd(i*57+d*3)*(boxH-16),r:1.9,
            fill:stays?'var(--red)':'var(--dot)','fill-opacity':stays?.75:.4}));
        }
        svg.appendChild(el('text',{x:cx,y:siteY+boxH+15,'text-anchor':'middle',
          'font-family':SANS,'font-size':9.5,
          fill:stays?'var(--red)':'var(--mute)'},stays?'data stays':'data leaves'));

        var y1=siteY+boxH+24,y2=hubY-16,midY=(y1+y2)/2;
        svg.appendChild(el('path',{d:'M'+cx+' '+y1+'L'+cx+' '+y2,
          stroke:stays?'var(--red)':'var(--ink-2)','stroke-width':stays?1.4:1.2,
          'stroke-dasharray':stays?'3 4':'0','stroke-opacity':.75}));
        if(stays){
          svg.appendChild(el('circle',{cx:cx,cy:midY,r:4.2,fill:'var(--red)'}));
        }else{
          for(var q=0;q<3;q++)
            svg.appendChild(el('circle',{cx:cx,cy:midY-8+q*8,r:1.9,fill:'var(--dot)','fill-opacity':.55}));
        }
      }
      var hw=250,hx=(W-hw)/2;
      svg.appendChild(el('rect',{x:hx,y:hubY-14,width:hw,height:30,fill:'var(--paper)',
        stroke:'var(--rule)','stroke-width':1.2}));
      svg.appendChild(el('text',{x:W/2,y:hubY+6,'text-anchor':'middle',
        'font-family':SANS,'font-size':10.5,fill:'var(--ink)'},
        keep===4?'ONE MODEL, NO RECORDS':(keep===0?'ONE SERVER, ALL RECORDS':'ONE MODEL, SOME RECORDS')));
      svg.appendChild(el('text',{x:hx,y:hubY+30,'font-family':SANS,'font-size':11,fill:'var(--mute)'},
        keep===4?'red is a model travelling. nothing else moves.'
                :'grey dots are records leaving their center.'));
    }

    /* Four centers side by side need 640 units of width, which on a phone meant
       a sideways scroll nobody knew was there. Stacked instead: one row per
       centre, the box on the left, what it does on the right. */
    function drawNarrow(keep){
      var W=380,n=4,bw=104,boxH=38,x0=14,rowH=50,y0=30;
      var hubY=y0+n*rowH+26;
      svg.setAttribute('viewBox','0 0 380 '+(hubY+52));
      svg.appendChild(el('text',{x:x0,y:14,'font-family':SANS,'font-size':12,
        fill:'var(--mute)','letter-spacing':'1.2'},'FOUR CENTERS'));
      for(var i=0;i<n;i++){
        var y=y0+i*rowH,stays=i>=(n-keep);
        svg.appendChild(el('rect',{x:x0,y:y,width:bw,height:boxH,fill:'none',
          stroke:stays?'var(--red)':'var(--hair)','stroke-width':stays?1.6:1.2}));
        for(var d=0;d<10;d++){
          svg.appendChild(el('circle',{cx:x0+8+rnd(i*31+d)*(bw-16),
            cy:y+7+rnd(i*57+d*3)*(boxH-14),r:1.9,
            fill:stays?'var(--red)':'var(--dot)','fill-opacity':stays?.75:.4}));
        }
        svg.appendChild(el('path',{d:'M'+(x0+bw+10)+' '+(y+boxH/2)+'L'+(x0+bw+42)+' '+(y+boxH/2),
          stroke:stays?'var(--red)':'var(--ink-2)','stroke-width':stays?1.6:1.2,
          'stroke-dasharray':stays?'3 4':'0','stroke-opacity':.8}));
        svg.appendChild(el('text',{x:x0+bw+52,y:y+boxH/2+5,'font-family':SANS,'font-size':13,
          fill:stays?'var(--red)':'var(--mute)'},stays?'data stays':'data leaves'));
      }
      svg.appendChild(el('rect',{x:x0,y:hubY-14,width:W-2*x0,height:32,fill:'var(--paper)',
        stroke:'var(--rule)','stroke-width':1.2}));
      svg.appendChild(el('text',{x:W/2,y:hubY+7,'text-anchor':'middle',
        'font-family':SANS,'font-size':12,fill:'var(--ink)'},
        keep===4?'ONE MODEL, NO RECORDS':(keep===0?'ONE SERVER, ALL RECORDS':'ONE MODEL, SOME RECORDS')));
      svg.appendChild(el('text',{x:x0,y:hubY+38,'font-family':SANS,'font-size':12,fill:'var(--mute)'},
        keep===4?'red is a model travelling.':'grey dots are records leaving.'));
    }

    function apply(){
      var s=STOPS[cur];
      draw(s.keep);
      modeEl.textContent=s.mode;
      valEl.textContent=s.auc.toFixed(3);
      barEl.style.width=(100*(s.auc-LO)/(HI-LO)).toFixed(1)+'%';
      sayEl.textContent=s.say;
      drawDial();
      dial.setAttribute('aria-valuenow',String(cur));
      dial.setAttribute('aria-valuetext',s.mode);
    }

    /* A dial, because the thing being controlled is a degree. A plain slider
       said "form control"; three cards said "pick one of these". Neither said
       "this is a continuum and you are standing somewhere on it". */
    var dial=document.getElementById('dof-dial');
    var CX=210,CY=146,R=86;   /* half turn, left to right, over the top */

    function polar(t){
      var a=Math.PI+Math.PI*t;          /* pi to 2pi puts the sweep above the pivot */
      return [CX+Math.cos(a)*R, CY+Math.sin(a)*R];
    }
    function arcPath(t0,t1){
      var p0=polar(t0),p1=polar(t1);
      return 'M'+p0[0].toFixed(1)+' '+p0[1].toFixed(1)+
             'A'+R+' '+R+' 0 0 1 '+p1[0].toFixed(1)+' '+p1[1].toFixed(1);
    }

    function drawDial(){
      while(dial.firstChild)dial.removeChild(dial.firstChild);
      var t=cur/2, SANS='-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif';

      /* ticks around the outside, so it reads as an instrument */
      for(var k=0;k<=40;k++){
        var tk=k/40, a=Math.PI+Math.PI*tk, major=(k%10===0);
        var r0=R+13, r1=R+(major?23:18);
        dial.appendChild(el('line',{
          x1:CX+Math.cos(a)*r0, y1:CY+Math.sin(a)*r0,
          x2:CX+Math.cos(a)*r1, y2:CY+Math.sin(a)*r1,
          stroke:tk<=t?'var(--red)':'var(--hair)','stroke-width':major?1.6:1,
          'stroke-opacity':tk<=t?.9:1}));
      }

      dial.appendChild(el('path',{d:arcPath(0,1),fill:'none',stroke:'var(--hair)','stroke-width':11,
        'stroke-linecap':'round'}));
      if(t>0) dial.appendChild(el('path',{d:arcPath(0,t),fill:'none',stroke:'var(--red)',
        'stroke-width':11,'stroke-linecap':'round'}));

      STOPS.forEach(function(sp,i){
        var q=polar(i/2),on=i===cur;
        dial.appendChild(el('circle',{cx:q[0],cy:q[1],r:on?8.5:5,
          fill:on?'var(--red)':'var(--paper)',stroke:on?'var(--paper)':'var(--ink-2)',
          'stroke-width':on?2.5:1.8}));
      });

      /* the needle, with a weighted tail so it looks like it turns */
      var h=polar(t), a2=Math.PI+Math.PI*t;
      dial.appendChild(el('line',{x1:CX-Math.cos(a2)*15,y1:CY-Math.sin(a2)*15,
        x2:h[0],y2:h[1],stroke:'var(--ink)','stroke-width':2.4,'stroke-linecap':'round'}));
      dial.appendChild(el('circle',{cx:CX,cy:CY,r:11,fill:'var(--paper)',
        stroke:'var(--ink)','stroke-width':2.4}));
      dial.appendChild(el('circle',{cx:CX,cy:CY,r:3.4,fill:'var(--ink)'}));

      dial.appendChild(el('text',{x:CX-R,y:CY+26,'text-anchor':'middle','font-family':SANS,
        'font-size':11,fill:'var(--mute)'},'all centralized'));
      dial.appendChild(el('text',{x:CX+R,y:CY+26,'text-anchor':'middle','font-family':SANS,
        'font-size':11,fill:'var(--mute)'},'nothing moves'));
      dial.appendChild(el('text',{x:CX,y:16,'text-anchor':'middle','font-family':SANS,
        'font-size':11,fill:'var(--mute)','letter-spacing':'1.2'},'DEGREE OF FEDERATION'));
    }

    function fromPointer(ev){
      var b=dial.getBoundingClientRect();
      var x=(ev.clientX-b.left)/b.width*420, y=(ev.clientY-b.top)/b.height*168;
      var a=Math.atan2(y-CY,x-CX);       /* -pi..0 across the top half */
      if(a>0) a=(x<CX)?-Math.PI:0;       /* below the pivot, clamp to whichever end */
      var t=(a+Math.PI)/Math.PI;
      cur=Math.max(0,Math.min(2,Math.round(t*2)));
      apply();
    }
    var dragging=false;
    dial.addEventListener('pointerdown',function(e){dragging=true;dial.setPointerCapture(e.pointerId);fromPointer(e);});
    dial.addEventListener('pointermove',function(e){if(dragging)fromPointer(e);});
    dial.addEventListener('pointerup',function(){dragging=false;});
    dial.addEventListener('keydown',function(e){
      if(e.key==='ArrowRight'||e.key==='ArrowUp'){cur=Math.min(2,cur+1);apply();e.preventDefault();}
      if(e.key==='ArrowLeft'||e.key==='ArrowDown'){cur=Math.max(0,cur-1);apply();e.preventDefault();}
    });
    apply();

    /* redraw when the width crosses the narrow breakpoint */
    var dofRt,dofNarrow=(stage&&stage.clientWidth||640)<430;
    window.addEventListener('resize',function(){
      clearTimeout(dofRt);
      dofRt=setTimeout(function(){
        var n=(stage&&stage.clientWidth||640)<430;
        if(n!==dofNarrow){dofNarrow=n;apply();}
      },160);
    });
  })();

  /* ---------------------------------------------------------
     B. THREE WAYS IN.  The global data sharing initiative.
     --------------------------------------------------------- */
  (function(){
    var svg=document.getElementById('gdsi-viz');
    var stage=svg&&svg.parentNode;
    if(!svg) return;
    var wrap=document.getElementById('gdsi-toggles'),
        sayEl=document.getElementById('gdsi-say');

    var STREAMS=[
      {id:'direct',label:'Direct entry',n:1383,src:'people, 67 countries',
       note:'People filled in a form themselves.'},
      {id:'core',label:'Core data set sharing',n:6374,src:'14 registries',
       note:'Registries sent patient level records under a signed agreement.'},
      {id:'fed',label:'Federated model sharing',n:3527,src:'4 registries at publication',
       note:'Registries whose policy forbids sending records still took part.'}
    ];
    var on={direct:true,core:true,fed:true};
    var TOTAL=11284;

    function draw(){
      clear(svg);
      /* Below about 430px a label beside its bar leaves no room for the bar, so
         the row stacks instead: name and number on one line, source under it,
         bar full width beneath. Nothing scrolls sideways, because a figure you
         have to discover you can drag is a figure most people never see. */
      var W=640,x0=18;
      var narrow=(stage.clientWidth||640)<430;
      var barX=narrow?x0:200;
      var barW=narrow?(W-x0-14):(W-200-90);
      var rowH=narrow?76:52;
      var y=narrow?26:34;
      var F='-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif';
      var live=STREAMS.filter(function(s){return on[s.id];});
      var sum=live.reduce(function(a,s){return a+s.n;},0);

      svg.appendChild(el('text',{x:x0,y:narrow?10:16,'font-family':F,'font-size':narrow?11.5:10.5,
        fill:'var(--mute)','letter-spacing':'1.2'},'THREE WAYS IN'));

      STREAMS.forEach(function(s,i){
        var yy=y+i*rowH,active=on[s.id];
        var lblY=narrow?yy+10:yy+4;
        svg.appendChild(el('text',{x:x0,y:lblY,'font-family':F,'font-size':narrow?15:13,
          fill:active?'var(--ink)':'var(--hair)'},s.label));
        svg.appendChild(el('text',{x:x0,y:lblY+16,'font-family':F,'font-size':narrow?12:9.5,
          fill:active?'var(--mute)':'var(--hair)'},s.src));
        var w=barW*(s.n/TOTAL);
        var barY=narrow?(lblY+26):(yy-9);
        svg.appendChild(el('rect',{x:barX,y:barY,width:barW,height:15,fill:'none',
          stroke:'var(--hair)','stroke-width':1}));
        svg.appendChild(el('rect',{x:barX,y:barY,width:w,height:15,
          fill:s.id==='fed'?'var(--red)':'var(--ink-2)','fill-opacity':active?1:.12}));
        svg.appendChild(el('text',{x:W-14,y:lblY,'text-anchor':'end','font-family':F,
          'font-size':narrow?14:11,
          fill:active?'var(--ink)':'var(--hair)'},s.n.toLocaleString('en')));
      });

      var ty=y+3*rowH+(narrow?30:16);
      svg.setAttribute('viewBox','0 0 640 '+Math.round(ty+(narrow?26:22)));
      svg.appendChild(el('line',{x1:x0,y1:ty-14,x2:W-14,y2:ty-14,stroke:'var(--rule)','stroke-width':1}));
      svg.appendChild(el('text',{x:x0,y:ty+6,'font-family':'-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif','font-size':15,
        fill:'var(--ink)','font-weight':'700'},'One data set'));
      svg.appendChild(el('text',{x:W-14,y:ty+8,'text-anchor':'end','font-family':'-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif',
        'font-size':22,'font-weight':'700',
        fill:sum===TOTAL?'var(--ink)':'var(--red)'},sum.toLocaleString('en')+' records'));

      var missing=TOTAL-sum;
      if(!on.fed && on.core && on.direct){
        sayEl.innerHTML='<b>This is the point.</b> Those registries were never allowed to '+
          'send records. Without a federated way in they do not take part at all, and 3,527 '+
          'records never exist. That stream added 45.5 per cent on top of what the other two '+
          'collected. In the first year of covid, with a rare disease, every record was worth having.';
      }else if(missing===0){
        sayEl.innerHTML='<b>All three streams open.</b> 18 registries and a public form, pooled '+
          'into one data set. It became the largest group of its kind, and it fed into clinical '+
          'guidance. A fifth registry took up the federated route after this was published; no '+
          'newer record total is claimed here. Switch the federated route off and watch what it '+
          'was carrying.';
      }else{
        sayEl.innerHTML='<b>'+missing.toLocaleString('en')+' records missing.</b> Every stream you '+
          'close is a set of people who cannot take part, for reasons that have nothing to do '+
          'with the science.';
      }
    }

    STREAMS.forEach(function(s){
      var b=document.createElement('button');
      b.type='button';
      b.className='dtog on'+(s.id==='fed'?' key':'');
      b.setAttribute('aria-pressed','true');
      b.innerHTML='<span class="tg"></span>'+s.label;
      b.addEventListener('click',function(){
        on[s.id]=!on[s.id];
        b.classList.toggle('on',on[s.id]);
        b.setAttribute('aria-pressed',String(on[s.id]));
        draw();
      });
      wrap.appendChild(b);
    });
    draw();

    /* Redraw when the width crosses the narrow breakpoint, so a phone rotated to
       landscape gets the layout that fits it. */
    var gdsiRt,gdsiNarrow=(stage.clientWidth||640)<430;
    window.addEventListener('resize',function(){
      clearTimeout(gdsiRt);
      gdsiRt=setTimeout(function(){
        var n=(stage.clientWidth||640)<430;
        if(n!==gdsiNarrow){gdsiNarrow=n;draw();}
      },160);
    });
  })();

  /* ---------------------------------------------------------
     C. FLoRank.  A federation round, with the split visible.
     The shared half travels. The private half never does.
     Phases and learning rates are from the training schedule.
     --------------------------------------------------------- */
  (function(){
    var svg=document.getElementById('lora-viz');
    var stage=svg&&svg.parentNode;
    if(!svg) return;
    var range=document.getElementById('lora-range'),
        rankEl=document.getElementById('lora-rank'),
        barEl=document.getElementById('lora-bar'),
        pctEl=document.getElementById('lora-pct'),
        sayEl=document.getElementById('lora-say'),
        roundEl=document.getElementById('lora-round'),
        roundV=document.getElementById('lora-roundv'),
        perf=document.getElementById('lora-perf'),
        perfV=document.getElementById('lora-perfv');
    var D=512,K=512,FULL=D*K,SANS='-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif';

    var PHASES=[
      {id:0,name:'Before',base:1.2,flo:0,wOn:true,fOn:false,
       say:'Only the shared half is learning, and it travels to the server and back every round '+
           'like any federated model. The private half exists but is switched off.'},
      {id:1,name:'Warm up',base:0.5,flo:1.5,wOn:true,fOn:true,
       say:'The private half switches on and the shared half slows down to make room. Both are '+
           'learning now, and still only the shared half ever leaves a site.'},
      {id:2,name:'After',base:0.2,flo:3.0,wOn:false,fOn:true,
       say:'The shared half has settled and nearly all the remaining learning happens in the '+
           'private half. Each site ends with a model shaped to its own patients, built on top of '+
           'everything the others found.'}
    ];
    var START=10, WARM=10;   /* florank_start_round, and ten rounds of warm up */
    var phase=1;

    /* Three sites that are actually different, because if they were the same
       there would be nothing for the private half to do. */
    var SITES=[
      {n:'Site 1',pop:'2,900 patients',spread:1.00,bias:.42,cnt:26},
      {n:'Site 2',pop:'410 patients',  spread:0.55,bias:.70,cnt:11},
      {n:'Site 3',pop:'6,100 patients',spread:1.35,bias:.33,cnt:38}
    ];

    function draw(r){
      while(svg.firstChild)svg.removeChild(svg.firstChild);
      var narrow=(stage&&stage.clientWidth||640)<430;
      var W=narrow?380:640,ph=PHASES[phase];
      var t=Math.max(3,54*r/D*4);

      var rd=+roundEl.value;
      /* a round counter above the server, so the slider visibly drives something */
      svg.appendChild(el('text',{x:22,y:20,'font-family':SANS,'font-size':10.5,
        fill:'var(--mute)','letter-spacing':'1.1'},'ROUND '+rd+' OF 30'));
      var tw=narrow?200:180,tx=narrow?18:22;
      svg.appendChild(el('line',{x1:tx,y1:30,x2:tx+tw,y2:30,stroke:'var(--hair)','stroke-width':3}));
      svg.appendChild(el('line',{x1:tx,y1:30,x2:tx+tw*(rd/30),y2:30,stroke:'var(--red)','stroke-width':3}));
      svg.appendChild(el('line',{x1:tx+tw*(START/30),y1:25,x2:tx+tw*(START/30),y2:35,
        stroke:'var(--ink-2)','stroke-width':1}));
      svg.appendChild(el('line',{x1:tx+tw*((START+WARM)/30),y1:25,x2:tx+tw*((START+WARM)/30),y2:35,
        stroke:'var(--ink-2)','stroke-width':1}));
      var sw=narrow?(W-36):232,sx=(W-sw)/2,sy=narrow?46:14;
      svg.appendChild(el('rect',{x:sx,y:sy,width:sw,height:34,fill:'var(--paper)',
        stroke:'var(--rule)','stroke-width':1.2}));
      svg.appendChild(el('text',{x:W/2,y:sy+22,'text-anchor':'middle','font-family':SANS,
        'font-size':11,fill:'var(--ink)','letter-spacing':'.9'},'SERVER  averages the shared half'));

      /* Three institutions side by side need 640 units. On a phone they stack
         into one column instead, which is the only way the labels inside them
         stay readable. Everything inside a box is drawn from bx and byi, so the
         same code draws both layouts. */
      var n=3,bw=narrow?(W-2*18):170,gap=28;
      var x0=narrow?18:(W-(n*bw+(n-1)*gap))/2;
      var by=narrow?116:126,bh=132,rowGap=narrow?78:0;
      for(var i=0;i<n;i++){
        var bx=narrow?x0:(x0+i*(bw+gap));
        var byi=narrow?(by+i*(bh+rowGap)):by;
        var x=bx,cx=bx+bw/2,st=SITES[i];

        var trav=ph.wOn?1:.28;
        if(narrow){
          /* a short exchange arrow pair over each box, rather than one long line
             back to a server three boxes away */
          var ay=byi-24;
          svg.appendChild(el('path',{d:'M'+(cx-16)+' '+(ay+18)+'L'+(cx-16)+' '+ay,
            stroke:'var(--ink-2)','stroke-width':1.2,'stroke-opacity':.75*trav}));
          svg.appendChild(el('path',{d:'M'+(cx+16)+' '+ay+'L'+(cx+16)+' '+(ay+18),
            stroke:'var(--ink-2)','stroke-width':1.2,'stroke-opacity':.75*trav}));
          svg.appendChild(el('path',{d:'M'+(cx-16)+' '+ay+'l-3.5 6l7 0z',fill:'var(--ink-2)','fill-opacity':trav}));
          svg.appendChild(el('path',{d:'M'+(cx+16)+' '+(ay+18)+'l-3.5 -6l7 0z',fill:'var(--ink-2)','fill-opacity':trav}));
          if(i===0){
            svg.appendChild(el('text',{x:cx+30,y:ay+13,'font-family':SANS,'font-size':11,
              fill:'var(--ink-2)','fill-opacity':ph.wOn?1:.5},ph.wOn?'W travels':'W barely moves'));
          }
        }else{
          svg.appendChild(el('path',{d:'M'+(cx-16)+' '+byi+'L'+(cx-16)+' '+(sy+40),
            stroke:'var(--ink-2)','stroke-width':1.2,'stroke-opacity':.75*trav}));
          svg.appendChild(el('path',{d:'M'+(cx+16)+' '+(sy+40)+'L'+(cx+16)+' '+byi,
            stroke:'var(--ink-2)','stroke-width':1.2,'stroke-opacity':.75*trav}));
          svg.appendChild(el('path',{d:'M'+(cx-16)+' '+(sy+46)+'l-3.5 7l7 0z',fill:'var(--ink-2)','fill-opacity':trav}));
          svg.appendChild(el('path',{d:'M'+(cx+16)+' '+(byi-6)+'l-3.5 -7l7 0z',fill:'var(--ink-2)','fill-opacity':trav}));
          if(i===1){
            svg.appendChild(el('text',{x:cx+26,y:(byi+sy+40)/2,'font-family':SANS,'font-size':10,
              fill:'var(--ink-2)','fill-opacity':ph.wOn?1:.5},ph.wOn?'W travels':'W barely moves'));
          }
        }

        svg.appendChild(el('rect',{x:x,y:byi,width:bw,height:bh,fill:'none',
          stroke:'var(--hair)','stroke-width':1.2,'stroke-dasharray':'4 4'}));

        /* each site's own patients, visibly not the same shape */
        for(var d=0;d<st.cnt;d++){
          var sd=i*211+d*17;
          var px=x+12+rnd(sd)*(bw-24);
          var py0=Math.max(.05,Math.min(.95,st.bias+(rnd(sd+90)-.5)*st.spread));
          svg.appendChild(el('circle',{cx:px,cy:byi+10+py0*30,r:1.7,
            fill:'var(--dot)','fill-opacity':.42}));
        }

        var pad=13,sh=32,wy=byi+44;
        svg.appendChild(el('rect',{x:x+pad,y:wy,width:bw-pad*2,height:sh,
          fill:'var(--wash)',stroke:ph.wOn?'var(--ink)':'var(--hair)','stroke-width':ph.wOn?1.5:1}));
        svg.appendChild(el('text',{x:cx,y:wy+sh/2+4,'text-anchor':'middle','font-family':SANS,
          'font-size':11,fill:ph.wOn?'var(--ink)':'var(--mute)'},'W  shared, identical'));

        var py=wy+sh+14,op=ph.fOn?1:.16;
        svg.appendChild(el('rect',{x:x+pad,y:py,width:t,height:26,fill:'var(--red)','fill-opacity':op}));
        svg.appendChild(el('rect',{x:x+pad+t+7,y:py+13-Math.min(t,13)/2,
          width:bw-pad*2-t-7,height:Math.min(t,13),fill:'var(--red)','fill-opacity':op}));
        svg.appendChild(el('text',{x:cx,y:py+38,'text-anchor':'middle','font-family':SANS,
          'font-size':10,fill:ph.fOn?'var(--red)':'var(--mute)'},'B x A  private, stays here'));

        svg.appendChild(el('text',{x:cx,y:byi+bh+20,'text-anchor':'middle','font-family':SANS,
          'font-size':11,fill:'var(--ink-2)'},st.n));
        svg.appendChild(el('text',{x:cx,y:byi+bh+33,'text-anchor':'middle','font-family':SANS,
          'font-size':9.5,fill:'var(--mute)'},st.pop));
      }

      /* clear of the site labels, which sit at by+bh+20 and +33 */
      var lastY=narrow?(by+(n-1)*(bh+rowGap)):by;
      var ruleY=lastY+bh+48;
      svg.appendChild(el('line',{x1:x0,y1:ruleY,x2:narrow?(W-18):(x0+n*bw+(n-1)*gap),y2:ruleY,
        stroke:'var(--hair)','stroke-width':1}));
      if(narrow){
        svg.appendChild(el('text',{x:x0,y:ruleY+18,'font-family':SANS,'font-size':11,
          fill:'var(--mute)'},'Dashed boxes are institutions.'));
        svg.appendChild(el('text',{x:x0,y:ruleY+33,'font-family':SANS,'font-size':11,
          fill:'var(--mute)'},'Nothing red crosses one. Site sizes'));
        svg.appendChild(el('text',{x:x0,y:ruleY+48,'font-family':SANS,'font-size':11,
          fill:'var(--mute)'},'are an example, not a real network.'));
        svg.setAttribute('viewBox','0 0 380 '+Math.round(ruleY+62));
      }else{
        svg.appendChild(el('text',{x:x0,y:ruleY+18,'font-family':SANS,'font-size':11,
          fill:'var(--mute)'},'Dashed boxes are institutions. Nothing red crosses one. Site sizes are an example, not a real network.'));
        svg.setAttribute('viewBox','0 0 640 336');
      }
    }

    /* Performance over a run. Flat while only the shared half learns, then it
       climbs once the private half is unlocked. That step is the whole point of
       the method, and it is invisible if you only look at the final number. */
    function score(r){
      /* flat while only the shared half learns, then a step. a smooth S curve
         hid the one thing this figure exists to show. */
      if(r<START)      return 0.715-0.115*Math.exp(-(r-1)/2.0);
      if(r<START+WARM) return 0.715+0.115*(1-Math.exp(-(r-START+1)/2.2));
      return 0.830+0.018*((r-(START+WARM))/(30-(START+WARM)));
    }
    function drawPerf(rd){
      while(perf.firstChild)perf.removeChild(perf.firstChild);
      var W=460,H=76,PX0=6,PX1=W-6,PY0=8,PY1=H-16,LO=0.55,HI=0.90;
      var xOf=function(r){return PX0+(r-1)/29*(PX1-PX0);};
      var yOf=function(v){return PY1-(v-LO)/(HI-LO)*(PY1-PY0);};

      perf.appendChild(el('line',{x1:PX0,y1:PY1,x2:PX1,y2:PY1,stroke:'var(--hair)','stroke-width':1}));
      /* where the private half switches on */
      perf.appendChild(el('line',{x1:xOf(START),y1:PY0-2,x2:xOf(START),y2:PY1,
        stroke:'var(--ink-2)','stroke-width':1,'stroke-dasharray':'3 3','stroke-opacity':.6}));
      perf.appendChild(el('text',{x:xOf(START)+5,y:PY0+7,'font-family':SANS,'font-size':9,
        fill:'var(--ink-2)'},'private half unlocked'));

      var d='';
      for(var r=1;r<=30;r++) d+=(r===1?'M':'L')+xOf(r).toFixed(1)+' '+yOf(score(r)).toFixed(1);
      perf.appendChild(el('path',{d:d,fill:'none',stroke:'var(--red)','stroke-width':2,
        'stroke-linejoin':'round','stroke-linecap':'round'}));

      perf.appendChild(el('circle',{cx:xOf(rd),cy:yOf(score(rd)),r:4,fill:'var(--red)',
        stroke:'var(--paper)','stroke-width':2}));
      perf.appendChild(el('text',{x:PX0,y:H-3,'font-family':SANS,'font-size':9,
        fill:'var(--mute)'},'round 1'));
      perf.appendChild(el('text',{x:PX1,y:H-3,'text-anchor':'end','font-family':SANS,'font-size':9,
        fill:'var(--mute)'},'round 30'));
    }

    function apply(){
      var rd=+roundEl.value;
      phase = rd<START ? 0 : (rd<START+WARM ? 1 : 2);
      var r=+range.value,extra=r*(D+K),pct=100*extra/FULL,ph=PHASES[phase];
      roundV.textContent='round '+rd;
      drawPerf(rd);
      perfV.textContent=(score(rd)*100).toFixed(1)+'%';
      draw(r);
      rankEl.textContent='rank '+r;
      pctEl.textContent=pct.toFixed(1)+'%';
      barEl.style.width=Math.min(100,pct*4).toFixed(1)+'%';
      sayEl.innerHTML='<b>Round '+rd+', '+ph.name.toLowerCase()+'.</b> '+ph.say+
        ' Learning rate on the shared half is '+ph.base.toFixed(1)+' times the base, on the '+
        'private half '+(ph.flo?ph.flo.toFixed(1)+' times':'nothing yet')+'. The private half is '+
        extra.toLocaleString('en')+' weights, '+pct.toFixed(1)+' per cent of the shared layer.';
    }

    roundEl.addEventListener('input',apply);
    range.addEventListener('input',apply);

    /* The page promises arrow keys, so the arrow keys are handled here rather
       than left to the browser's default on a native range. Two audits reported
       them dead: a synthetic key event does not move a native range, only a real
       one does, and the FL4E dial passed the same test because it has its own
       keydown handler. This makes the promise true either way. preventDefault
       keeps the browser from also moving the thumb, which would double the step. */
    function keys(el){
      el.addEventListener('keydown',function(e){
        var lo=+el.min, hi=+el.max, st=+el.step||1, d;
        switch(e.key){
          case 'ArrowRight': case 'ArrowUp':   d=st;    break;
          case 'ArrowLeft':  case 'ArrowDown': d=-st;   break;
          case 'PageUp':     d=st*5;  break;
          case 'PageDown':   d=-st*5; break;
          case 'Home':       d=lo-(+el.value); break;
          case 'End':        d=hi-(+el.value); break;
          default: return;
        }
        e.preventDefault();
        el.value=Math.max(lo,Math.min(hi,(+el.value)+d));
        apply();
      });
    }
    keys(roundEl); keys(range);
    apply();
  })();

  /* ---------------------------------------------------------
     D. FLkit.  The point is not how many roles there are. It is
     that the material is scattered, there is a wall in front of
     it, and somebody put it in order with a door per person.
     --------------------------------------------------------- */
  (function(){
    var svg=document.getElementById('flkit-viz');
    var stage=svg&&svg.parentNode;
    if(!svg) return;
    var wrap=document.getElementById('flkit-state'), sayEl=document.getElementById('flkit-say');
    var SANS='-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif';
    var STAGES=['Governance','Infrastructure','Wrangling','Analysis'];
    var DOORS=['a clinician','a lawyer','an engineer','a data steward'];
    /* the things a team has to find before it can start */
    var BITS=['consent','DTA','ethics','GDPR','Flower','Docker','servers','ports','schemas',
              'missingness','codebooks','units','metrics','validation','baselines','roles',
              'glossary','audit','templates','who signs','which framework','where to start',
              'IRB','pseudonymisation','key exchange','firewalls','harmonisation','drop out',
              'aggregation','seeds','sample size','who owns the model'];
    var state=0;

    /* Four columns need 640 units. On a phone the same material goes into two
       columns of two stages, which is the only way the tile labels stay readable. */
    function isNarrow(){ return (stage&&stage.clientWidth||640)<430; }
    var COLW=108,GAPX=8,GRIDX=(640-(4*COLW+3*GAPX))/2;   /* centred, not shoved right */
    var NCOLW=164,NGAPX=10,NGRIDX=(380-(2*NCOLW+NGAPX))/2;
    function scatterPos(i){
      var r1=Math.sin(i*127.1)*43758.5453, r2=Math.sin(i*311.7)*24634.6345;
      if(isNarrow()) return [12+(r1-Math.floor(r1))*150, 50+(r2-Math.floor(r2))*196];
      return [16+(r1-Math.floor(r1))*272, 50+(r2-Math.floor(r2))*180];
    }
    function scatterTilt(i){
      var r=Math.sin(i*57.3)*1234.567;
      return ((r-Math.floor(r))-0.5)*26;   /* a real pile is not axis aligned */
    }
    /* Column position is the stage, so the mapping has to survive the reflow:
       tile i belongs to stage i%4 in both layouts. Wide puts the four stages in
       four columns. Narrow puts them in two columns of two blocks. */
    var NROWH=21, NBLOCK=8*NROWH+80, NTOP=74;
    function nBlockTop(stage){ return NTOP + Math.floor(stage/2)*NBLOCK; }
    function orderedPos(i){
      var stage=i%4, row=Math.floor(i/4);
      if(isNarrow()){
        return [NGRIDX+(stage%2)*(NCOLW+NGAPX), nBlockTop(stage)+row*NROWH];
      }
      return [GRIDX+stage*(COLW+GAPX), 64+row*26];
    }

    function draw(){
      while(svg.firstChild)svg.removeChild(svg.firstChild);
      var narrow=isNarrow();
      var W=narrow?380:640,after=state===1;
      var cw=narrow?NCOLW:COLW,gx=narrow?NGRIDX:GRIDX,gp=narrow?NGAPX:GAPX;

      svg.appendChild(el('text',{x:22,y:22,'font-family':SANS,'font-size':10.5,
        fill:'var(--mute)','letter-spacing':'1.2'},
        after?'GATHERED, AND IN ORDER':'EVERYTHING YOU NEED, SOMEWHERE'));

      /* the wall. it is the whole reason the toolkit exists. */
      var wx=narrow?196:312;
      if(!after){
        for(var b=0;b<9;b++){
          svg.appendChild(el('rect',{x:wx,y:44+b*22,width:26,height:19,
            fill:'var(--ink-2)','fill-opacity':.16,stroke:'var(--ink-2)','stroke-opacity':.35}));
        }
        svg.appendChild(el('text',{x:narrow?(W-14):(wx+13),y:narrow?272:252,
          'text-anchor':narrow?'end':'middle','font-family':SANS,
          'font-size':narrow?11:10.5,fill:'var(--ink-2)'},'this is where most teams stop'));
      }

      /* the material: scattered, or sorted into the four stages */
      BITS.forEach(function(name,i){
        var q=after?orderedPos(i):scatterPos(i);
        var rot=after?0:scatterTilt(i);
        var g=el('g',{transform:'translate('+q[0].toFixed(1)+','+q[1].toFixed(1)+') rotate('+rot.toFixed(1)+')',
          style:'transition:transform .6s cubic-bezier(.2,.8,.25,1)'});
        g.appendChild(el('rect',{x:0,y:-11,width:after?cw-8:Math.max(38,name.length*5.4),height:17,
          fill:after?'var(--paper)':'var(--wash)',
          stroke:after?'var(--red)':'var(--hair)','stroke-width':1,'stroke-opacity':after?.55:1}));
        g.appendChild(el('text',{x:5,y:1,'font-family':SANS,'font-size':8.5,
          fill:after?'var(--ink-2)':'var(--mute)'},name));
        svg.appendChild(g);
      });

      if(after){
        for(var i=0;i<4;i++){
          var x=gx+(narrow?(i%2):i)*(cw+gp), mid=x+(cw-8)/2;
          var top=narrow?nBlockTop(i):64;
          svg.appendChild(el('text',{x:x,y:top-14,'font-family':SANS,
            'font-size':narrow?12:10,fill:'var(--ink)','font-weight':'700'},STAGES[i]));
          var dy=narrow?(top+8*NROWH+26):284;
          svg.appendChild(el('path',{d:'M'+mid+' '+dy+'l0 -14',stroke:'var(--red)','stroke-width':1.4}));
          svg.appendChild(el('path',{d:'M'+mid+' '+(dy-16)+'l-4 8l8 0z',fill:'var(--red)'}));
          svg.appendChild(el('text',{x:mid,y:dy+15,'text-anchor':'middle','font-family':SANS,
            'font-size':narrow?11:9.5,fill:'var(--red)'},DOORS[i]));
        }
        var footY=narrow?(nBlockTop(2)+8*NROWH+66):324;
        svg.appendChild(el('text',{x:gx,y:footY,'font-family':SANS,
          'font-size':narrow?11:10.5,fill:'var(--mute)'},'One door each. Nobody reads all of it.'));
        if(narrow) svg.setAttribute('viewBox','0 0 380 '+(footY+18));
      }
      if(narrow && !after) svg.setAttribute('viewBox','0 0 380 300');
      if(!narrow) svg.setAttribute('viewBox','0 0 640 334');
    }

    function apply(){
      draw();
      sayEl.innerHTML = state===0
        ? '<b>Before.</b> None of this is secret. It is spread across framework documentation, '+
          'legal templates, glossaries and people who have done it once. A team that has never '+
          'run a federated study cannot tell which piece it needs first, and that is where most '+
          'of them give up.'
        : '<b>After.</b> The same material, in the order the decisions actually happen, with a '+
          'way in for each kind of person on the team. A lawyer never has to read the training '+
          'code and an engineer never has to read the consent templates. Lowering that first '+
          'step is the entire product.';
      [].forEach.call(wrap.children,function(b,i){
        b.classList.toggle('on',i===state);
        b.setAttribute('aria-pressed',String(i===state));
      });
    }

    ['Before FLkit','With FLkit'].forEach(function(lbl,i){
      var b=document.createElement('button');
      b.type='button';b.className='dtog'+(i===state?' on':'')+(i===1?' key':'');
      b.innerHTML='<span class="tg"></span>'+lbl;
      b.addEventListener('click',function(){state=i;apply();});
      wrap.appendChild(b);
    });
    apply();
  })();
})();

/* ============================================================
   NONE OF THIS WORKS ALONE.
   Six cells, six different marks. A single figure for the whole
   section said nothing about any one of the six things in it.
   ============================================================ */
(function(){
  var NS='http://www.w3.org/2000/svg';
  function el(n,a){var e=document.createElementNS(NS,n);for(var k in a)e.setAttribute(k,a[k]);return e;}
  function rnd(s){var x=Math.sin(s*7919.13)*43758.5453;return x-Math.floor(x);}
  var INK='var(--ink-2)',RED='var(--red)',HAIR='var(--hair)';

  /* Drawn on a 64 by 64 square. The old marks were laid out on an 88 by 56
     box, so every circle in them was really an ellipse and they read as
     stretched. Same geometry, honest aspect. */
  var MARKS={
    /* many people, one shared thing in the middle */
    people:function(g){
      for(var i=0;i<12;i++){
        var a=(i/12)*Math.PI*2-Math.PI/2, x=32+Math.cos(a)*24, y=32+Math.sin(a)*24;
        g.appendChild(el('line',{x1:x,y1:y,x2:32,y2:32,stroke:HAIR,'stroke-width':.9}));
        g.appendChild(el('circle',{cx:x,cy:y,r:2.8,fill:i%4===0?RED:INK,'fill-opacity':i%4===0?1:.5}));
      }
      g.appendChild(el('circle',{cx:32,cy:32,r:5,fill:RED}));
    },
    /* many centers, wide */
    reach:function(g){
      g.appendChild(el('circle',{cx:32,cy:32,r:29,fill:'none',stroke:HAIR,'stroke-width':1}));
      for(var i=0;i<52;i++){
        var a=(i/52)*Math.PI*2, rr=10+ (i%5)*4.2;
        g.appendChild(el('circle',{cx:32+Math.cos(a)*rr,cy:32+Math.sin(a)*rr,r:1.5,
          fill:INK,'fill-opacity':.42}));
      }
      g.appendChild(el('circle',{cx:32,cy:32,r:4.5,fill:RED}));
    },
    /* two organizations, one overlap */
    industry:function(g){
      g.appendChild(el('circle',{cx:24,cy:32,r:17,fill:'none',stroke:INK,'stroke-width':1.3}));
      g.appendChild(el('circle',{cx:41,cy:32,r:17,fill:'none',stroke:RED,'stroke-width':1.5}));
      g.appendChild(el('path',{d:'M32.5 16.6a17 17 0 0 0 0 30.8a17 17 0 0 0 0 -30.8z',
        fill:RED,'fill-opacity':.18}));
    },
    /* a mesh with no center */
    community:function(g){
      var pts=[[14,16],[36,8],[54,24],[18,44],[44,50],[33,30]];
      for(var i=0;i<pts.length;i++)for(var j=i+1;j<pts.length;j++)
        g.appendChild(el('line',{x1:pts[i][0],y1:pts[i][1],x2:pts[j][0],y2:pts[j][1],
          stroke:HAIR,'stroke-width':.9}));
      pts.forEach(function(q,i){
        g.appendChild(el('circle',{cx:q[0],cy:q[1],r:i===5?4.5:3.2,
          fill:i===5?RED:INK,'fill-opacity':i===5?1:.6}));
      });
    },
    /* seven of them */
    teaching:function(g){
      for(var i=0;i<7;i++){
        var h=9+i*5;
        g.appendChild(el('rect',{x:8+i*7.4,y:52-h,width:4.6,height:h,
          fill:i===6?RED:INK,'fill-opacity':i===6?1:.42}));
      }
      g.appendChild(el('line',{x1:5,y1:53,x2:59,y2:53,stroke:HAIR,'stroke-width':1}));
    }
  };

  document.querySelectorAll('.wc').forEach(function(card){
    var svg=card.querySelector('.wmark'), fn=MARKS[card.getAttribute('data-mark')];
    if(!svg||!fn) return;
    var g=document.createElementNS(NS,'g');
    fn(g); svg.appendChild(g);
  });
})();

/* ------------------------------------------------------------
   Email. The address is never in the served HTML as one string, so a harvester
   scraping the page gets three unrelated attributes. A person gets a normal
   clickable mailto. Anyone with JavaScript off gets the [at] form from the
   <noscript>, which is worse to read but better than a dead link.
   ------------------------------------------------------------ */
(function(){
  var links=document.querySelectorAll('a[data-mailto]');
  if(!links.length) return;
  Array.prototype.forEach.call(links,function(a){
    var addr=a.getAttribute('data-u')+'@'+a.getAttribute('data-h')+'.'+a.getAttribute('data-t');
    a.setAttribute('href','mailto:'+addr);
    a.removeAttribute('data-u');a.removeAttribute('data-h');a.removeAttribute('data-t');
    var slot=a.querySelector('[data-mail]');
    if(slot) slot.textContent=addr;
  });
})();
