const fs=require('node:fs');
let html=fs.readFileSync('index.html','utf8');
fs.writeFileSync('tmp/index-before-whatsapp.html',html);
const runtime=html.match(/^      <div class="runtime-wrap[^\r\n]+/m)[0];
html=html.replace(runtime,'');
html=html.replace('</p></header><div class="bento">','</p></header>'+runtime.trim()+'<div class="bento">');
const role='<p class="hero-position">Estudante de ADS · Desenvolvimento Back-end</p>';
html=html.replace(role,'');
html=html.replace('<div class="hero-content reveal">',role+'\n      <div class="hero-content reveal">');
const whatsapp='<a class="button button-secondary" href="https://wa.me/5511970371243" target="_blank" rel="noopener" aria-label="Conversar com Ryan Moura pelo WhatsApp">WhatsApp <span aria-hidden="true">↗</span></a>';
html=html.replace('</p><ol class="principles">','</p><div class="about-actions">'+whatsapp+'</div><ol class="principles">');
html=html.replace('<div class="contact-actions">','<div class="contact-actions">'+whatsapp);
html=html.replace('<figure class="event-banner reveal">','<figure class="event-banner">\n          <a class="event-contact-link" href="#contact" aria-label="Ir para a seção Contato de Ryan Moura"></a>');
html=html.replace('loading="lazy" decoding="async"','loading="eager" fetchpriority="high" decoding="async"');
html=html.replace('<figcaption class="event-caption">','<figcaption class="event-caption">\n            <span class="event-contact-cue" aria-hidden="true">Vamos conversar ↗</span>');
html=html.replace('/* The event photograph opens the About section without changing the hero. */','/* Event photograph and compact introduction. */');
const styles=`
    .hero{min-height:0;padding:7.5rem 0 1.75rem}
    .hero-grid{grid-template-columns:1.1fr .9fr;grid-template-rows:auto auto auto;gap:1rem 3.5rem;align-items:center}
    .hero-grid>.availability{grid-column:1;grid-row:1;font-size:.72rem}
    .hero-name{grid-column:1;grid-row:2;font-size:clamp(4rem,7.4vw,7rem);line-height:.95;white-space:nowrap}
    .hero-grid>.hero-position{grid-column:1;grid-row:3;margin:0;font-size:1rem}
    .hero-content{grid-column:2;grid-row:1/4}
    .hero-copy{font-size:1rem}
    .hero-actions{margin-top:1.25rem}
    .hero-note{font-size:.6rem;margin-bottom:0}
    .about-with-event{padding-top:0}
    .about-actions{margin-top:1.5rem}
    .capabilities .runtime-wrap{width:min(100% - 5rem,44rem);margin:0 auto 4rem}
    .event-contact-link{position:absolute;inset:0;z-index:3;border-radius:inherit}
    .event-contact-link:focus-visible{outline-offset:-6px}
    .event-banner:has(.event-contact-link:hover){border-color:rgba(255,255,255,.4)}
    .event-contact-cue{position:absolute;top:1.5rem;right:1.5rem;padding:.55rem .85rem;border:1px solid var(--line-bright);border-radius:999px;background:rgba(7,10,16,.8);color:#f7f7f8;font-size:.75rem;font-weight:600}
    @media(max-width:960px){.hero-grid{grid-template-columns:1fr 1fr;gap:.9rem 2rem}.hero-name{font-size:clamp(3.2rem,7.7vw,5rem)}.hero-copy{font-size:.9rem}.hero-actions{gap:.5rem}.hero-actions .button{padding:.65rem 1rem;font-size:.8rem;min-height:2.75rem}}
    @media(max-width:760px){.hero{padding:6.5rem 0 1.5rem}.hero-grid{grid-template-columns:minmax(0,1fr);grid-template-rows:none;gap:.85rem}.hero-grid>.availability,.hero-name,.hero-grid>.hero-position,.hero-content{grid-column:1;grid-row:auto}.hero-name{font-size:clamp(3rem,12vw,5rem);line-height:1;white-space:nowrap}.hero-name span{display:inline}.hero-grid>.hero-position{font-size:.9rem}.hero-copy{font-size:.875rem;line-height:1.55}.hero-actions{margin-top:1rem;flex-wrap:nowrap}.hero-actions .button{width:auto;flex:1;padding:.6rem .5rem;font-size:.75rem;gap:.4rem}.hero-note{font-size:.55rem;margin-top:.75rem}.capabilities .runtime-wrap{width:100%}.event-contact-cue{top:1rem;right:1rem;font-size:.7rem}}
`;
html=html.replace('  </style>',styles+'  </style>');
fs.writeFileSync('index.html',html);
