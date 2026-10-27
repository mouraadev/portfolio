const fs=require('node:fs');
let html=fs.readFileSync('index.html','utf8');
const previous=fs.readFileSync('tmp/index-before-whatsapp.html','utf8');
fs.writeFileSync('tmp/index-before-photo-motion.html',html);
const heroPattern=/<section class="hero"[\s\S]*?<\/section>/;
const originalHero=previous.match(heroPattern)[0];
const runtime=previous.match(/^      <div class="runtime-wrap[^\r\n]+/m)[0].trim();
if(!html.includes('</header>'+runtime))throw Error('Expected diagram in competencies');
html=html.replace('</header>'+runtime,'</header>');
html=html.replace(heroPattern,originalHero);
const start=html.indexOf('    .hero{min-height:0;');
const end=html.indexOf('  </style>',start);
if(start<0||end<0)throw Error('Compact hero rules not found');
html=html.slice(0,start)+`    .about-actions{margin-top:1.5rem}
    .event-stage{perspective:1400px;margin-bottom:clamp(4rem,8vw,7rem)}
    .event-stage.reveal{transform:none;filter:none;transition:opacity 700ms var(--ease)}
    .event-stage .event-banner{margin-bottom:0;transition:border-color 600ms var(--ease),box-shadow 600ms var(--ease)}
    .event-contact-link{position:absolute;inset:0;z-index:3;border-radius:inherit}
    .event-contact-link:focus-visible{outline-offset:-6px}
    .event-banner:focus-within{border-color:rgba(255,255,255,.3)}
    .event-contact-cue{position:absolute;top:1.5rem;right:1.5rem;padding:.55rem .85rem;border:1px solid var(--line-bright);border-radius:999px;background:rgba(7,10,16,.8);color:#f7f7f8;font-size:.75rem;font-weight:600}
    @media(hover:hover) and (pointer:fine){.event-stage:hover .event-banner{border-color:rgba(255,255,255,.3);box-shadow:0 36px 84px rgba(0,0,0,.46),0 0 28px rgba(41,151,255,.04)}}
    @media(max-width:760px){.event-contact-cue{top:1rem;right:1rem;font-size:.7rem}}
    @media(prefers-reduced-motion:reduce){.event-stage .event-banner{transform:none!important}}
`+html.slice(end);
html=html.replace('/* Event photograph and compact introduction. */','/* Event photograph below the original hero. */');
html=html.replace('<div class="shell">\n        <figure class="event-banner">','<div class="shell event-stage reveal">\n        <figure class="event-banner">');
// Accept CRLF sources as well.
html=html.replace('<div class="shell">\r\n        <figure class="event-banner">','<div class="shell event-stage reveal">\r\n        <figure class="event-banner">');
html=html.replace('loading="eager" fetchpriority="high" decoding="async"','loading="lazy" decoding="async"');
const script=`
    // Critically damped, interruptible tilt; each axis retains its current velocity.
    (()=>{
      const stage=document.querySelector('.event-stage'),photo=stage.querySelector('.event-banner');
      const finePointer=window.matchMedia('(hover: hover) and (pointer: fine)');
      let x=0,y=0,vx=0,vy=0,targetX=0,targetY=0,frame=0,last=0;
      const enabled=()=>finePointer.matches&&!reduceMotion.matches;
      const step=(position,velocity,target,dt)=>{
        const omega=18,offset=position-target,c=velocity+omega*offset,decay=Math.exp(-omega*dt);
        return [target+(offset+c*dt)*decay,(velocity-omega*c*dt)*decay];
      };
      const tick=time=>{
        const dt=Math.min((time-last)/1000,0.05);last=time;
        [x,vx]=step(x,vx,targetX,dt);[y,vy]=step(y,vy,targetY,dt);
        photo.style.transform='rotateX('+x+'deg) rotateY('+y+'deg)';
        if(Math.abs(x-targetX)+Math.abs(y-targetY)+Math.abs(vx)+Math.abs(vy)>.002){frame=requestAnimationFrame(tick)}
        else{frame=0;x=targetX;y=targetY;vx=vy=0;photo.style.transform=x||y?'rotateX('+x+'deg) rotateY('+y+'deg)':'';photo.style.willChange=''}
      };
      const animate=()=>{if(!frame){last=performance.now();photo.style.willChange='transform';frame=requestAnimationFrame(tick)}};
      const reset=()=>{cancelAnimationFrame(frame);frame=0;x=y=vx=vy=targetX=targetY=0;photo.style.transform='';photo.style.willChange=''};
      stage.addEventListener('pointermove',event=>{
        if(!enabled()||event.pointerType==='touch')return;
        const rect=stage.getBoundingClientRect();
        targetX=(Math.max(0,Math.min(1,(event.clientY-rect.top)/rect.height))-.5)*-3;
        targetY=(Math.max(0,Math.min(1,(event.clientX-rect.left)/rect.width))-.5)*4;
        animate();
      },{passive:true});
      const settle=()=>{targetX=targetY=0;if(enabled())animate();else reset()};
      stage.addEventListener('pointerleave',settle);stage.addEventListener('pointercancel',settle);
      window.addEventListener('blur',settle);
      reduceMotion.addEventListener('change',reset);finePointer.addEventListener('change',reset);
      document.addEventListener('visibilitychange',()=>{if(document.hidden)reset()});
    })();
`;
html=html.replace('  </script>',script+'  </script>');
fs.writeFileSync('index.html',html);
