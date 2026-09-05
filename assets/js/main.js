/* ============================================================
   NexusX Vids — PREMIUM Script
   Theme • Settings • Navbar • Scroll • Tilt • Player • Bento
   ============================================================ */
(function () {
  'use strict';

  window.NEXUS_CATS = [
    { key:'Furniture', url:'furniture.html', label:'Furniture', desc:'Stylish seating, tables & statement pieces', cover:'assets/media/collections/furniture.png' },
    { key:'Products',  url:'products.html',  label:'Male & Female Product', desc:'Trendy apparel & accessories', cover:'assets/media/collections/products.png' },
    { key:'Rooms',     url:'rooms.html',     label:'Rooms', desc:'Beautifully designed living spaces', cover:'assets/media/collections/rooms.png' },
    { key:'Poses',     url:'poses.html',     label:'Long Poses', desc:'Elegant, cinematic showcases', cover:'assets/media/collections/poses.png' }
  ];

  function esc(s){ var d=document.createElement('div'); d.textContent=s==null?'':String(s); return d.innerHTML; }
  function getCSS(p){ return getComputedStyle(document.documentElement).getPropertyValue(p); }
  function showToast(m){
    var t=document.getElementById('toast');
    if(!t){ t=document.createElement('div'); t.id='toast'; t.className='toast'; document.body.appendChild(t); }
    t.textContent=m; t.classList.add('show'); clearTimeout(t._tm);
    t._tm=setTimeout(function(){ t.classList.remove('show'); },2200);
  }
  function copyToClipboard(text,msg){
    if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(text).then(function(){ showToast(msg); }); }
    else{ var ta=document.createElement('textarea'); ta.value=text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); showToast(msg); }
  }

  function getFavs(){ try{ return JSON.parse(localStorage.getItem('nexus-favs')||'[]'); }catch(e){ return []; } }
  function isFav(url){ return getFavs().indexOf(url)!==-1; }
  function toggleFav(url){
    var favs=getFavs(); var i=favs.indexOf(url);
    if(i!==-1){ favs.splice(i,1); } else { favs.push(url); }
    localStorage.setItem('nexus-favs', JSON.stringify(favs)); return i===-1;
  }

  function applyTheme(t){
    document.body.setAttribute('data-theme', t);
    var accent=localStorage.getItem('nexus-accent');
    if(accent) document.documentElement.style.setProperty('--primary', accent);
    document.querySelectorAll('.swatch').forEach(function(s){ s.classList.toggle('active', s.dataset.theme===t); });
    // update preview
    var pm=document.getElementById('previewMock');
    if(pm) pm.style.background=getCSS('--grad');
  }
  function buildAccentDots(){
    var base=getCSS('--primary').trim();
    var colors=[base,'#f43f5e','#22c55e','#f59e0b','#8b5cf6','#06b6d4'];
    var row=document.getElementById('accentDots'); if(!row) return;
    var saved=localStorage.getItem('nexus-accent');
    row.innerHTML=colors.map(function(c){
      return '<div class="adot'+(saved===c?' active':'')+'" data-color="'+c+'" style="background:'+c+'"></div>';
    }).join('');
    row.querySelectorAll('.adot').forEach(function(d){
      d.addEventListener('click',function(){
        document.documentElement.style.setProperty('--primary',d.dataset.color);
        localStorage.setItem('nexus-accent',d.dataset.color);
        row.querySelectorAll('.adot').forEach(function(x){ x.classList.toggle('active',x===d); });
        var p=document.getElementById('accentPicker'); if(p) p.value=d.dataset.color;
        var pm=document.getElementById('previewMock'); if(pm) pm.style.background=d.dataset.color;
      });
    });
  }

  function buildSettings(){
    var overlay=document.createElement('div'); overlay.className='settings-overlay'; overlay.id='settingsOverlay';
    var panel=document.createElement('div'); panel.className='settings-panel'; panel.id='settingsPanel';
    var themes=[
      {id:'cream',cls:'sw-1',name:'Vibe'},{id:'midnight',cls:'sw-2',name:'Midnight'},
      {id:'sunset',cls:'sw-3',name:'Sunset'},{id:'emerald',cls:'sw-4',name:'Emerald'},{id:'rose',cls:'sw-5',name:'Rose'},{id:'midnight',cls:'sw-6',name:'Onyx'}
    ];
    // use unique ids for themes (last duplicate fix)
    themes[5].id='onyx';
    var cur=localStorage.getItem('nexus-theme')||'midnight';
    var sw=themes.map(function(t){
      return '<div class="swatch '+t.cls+(t.id===cur?' active':'')+'" data-theme="'+t.id+'"><span>'+t.name+'</span></div>';
    }).join('');

    panel.innerHTML=
      '<div class="settings-head"><div><h3>⚙ Settings</h3><p>Appearance & experience</p></div><button class="settings-close" id="settingsClose">✕</button></div>'+
      '<div class="settings-body">'+
        '<div class="settings-preview"><div class="preview-mock" id="previewMock">NX</div><div><h4>NexusX Preview</h4><p>Live theme preview</p></div></div>'+
        '<div class="setting-card"><div class="setting-card-head"><div class="setting-card-icon">🎨</div><div><div class="setting-card-title">Appearance</div><div class="setting-card-sub">Choose your vibe</div></div></div><div class="theme-grid" id="themeGrid">'+sw+'</div></div>'+
        '<div class="setting-card"><div class="setting-card-head"><div class="setting-card-icon">🌈</div><div><div class="setting-card-title">Accent</div><div class="setting-card-sub">Personalize glow</div></div></div><div class="accent-dots" id="accentDots"></div><div class="accent-row" style="margin-top:14px;"><input type="color" id="accentPicker" value="#6366f1"><span style="font-size:12px;color:var(--text-dim);font-weight:600;">Custom picker</span></div></div>'+
        '<div class="setting-card"><div class="setting-card-head"><div class="setting-card-icon">✨</div><div><div class="setting-card-title">Experience</div><div class="setting-card-sub">Motion & layout</div></div></div>'+
          '<div class="toggle-row"><span class="toggle-label">▶ Hover preview <small>video on hover</small></span><div class="toggle on" id="toggleHover"></div></div>'+
          '<div class="toggle-row"><span class="toggle-label">● Cursor glow <small>follow light</small></span><div class="toggle on" id="toggleCursor"></div></div>'+
          '<div class="toggle-row"><span class="toggle-label">▦ Bento grid <small>big-small layout</small></span><div class="toggle on" id="toggleBento"></div></div>'+
        '</div>'+
        '<a class="btn btn-primary" href="index.html" style="width:100%;justify-content:center;display:flex;">🏠 Back to Home</a>'+
      '</div>';
    document.body.appendChild(overlay); document.body.appendChild(panel);

    // swatch clicks
    panel.querySelectorAll('.swatch').forEach(function(s){
      s.addEventListener('click',function(){
        var th=s.dataset.theme;
        // map onyx to midnight variant with dark
        if(th==='onyx') th='midnight';
        applyTheme(th); localStorage.setItem('nexus-theme',th);
        localStorage.removeItem('nexus-accent');
        buildAccentDots();
        var p=document.getElementById('accentPicker'); if(p) p.value=getCSS('--primary').trim();
        document.getElementById('previewMock').style.background=getCSS('--grad');
      });
    });
    buildAccentDots();
    var picker=document.getElementById('accentPicker');
    if(picker){
      picker.value=getCSS('--primary').trim();
      picker.addEventListener('input',function(e){
        document.documentElement.style.setProperty('--primary',e.target.value);
        localStorage.setItem('nexus-accent',e.target.value);
        document.querySelectorAll('.adot').forEach(function(d){ d.classList.remove('active'); });
        document.getElementById('previewMock').style.background=e.target.value;
      });
    }
    document.getElementById('previewMock').style.background=getCSS('--grad');

    var hoverT=document.getElementById('toggleHover');
    var cursorT=document.getElementById('toggleCursor');
    var bentoT=document.getElementById('toggleBento');
    if(localStorage.getItem('nexus-hoverPlay')==='0') hoverT.classList.remove('on');
    if(localStorage.getItem('nexus-cursorGlow')==='0') cursorT.classList.remove('on'); else enableCursorGlow();
    if(localStorage.getItem('nexus-bento')==='0') bentoT.classList.remove('on');
    hoverT.addEventListener('click',function(){ this.classList.toggle('on'); localStorage.setItem('nexus-hoverPlay',this.classList.contains('on')?'1':'0'); });
    cursorT.addEventListener('click',function(){
      this.classList.toggle('on');
      localStorage.setItem('nexus-cursorGlow',this.classList.contains('on')?'1':'0');
      if(this.classList.contains('on')) enableCursorGlow(); else disableCursorGlow();
    });
    bentoT.addEventListener('click',function(){
      this.classList.toggle('on');
      localStorage.setItem('nexus-bento',this.classList.contains('on')?'1':'0');
      document.querySelectorAll('.video-grid:not(.reel)').forEach(function(g){ g.classList.toggle('bento', bentoT.classList.contains('on')); });
    });
    overlay.addEventListener('click',closeSettings);
    document.getElementById('settingsClose').addEventListener('click',closeSettings);
    document.addEventListener('keydown',function(e){ if(e.key==='Escape'&&overlay.classList.contains('open')) closeSettings(); });
  }
  function openSettings(){ document.getElementById('settingsOverlay').classList.add('open'); document.getElementById('settingsPanel').classList.add('open'); }
  function closeSettings(){ document.getElementById('settingsOverlay').classList.remove('open'); document.getElementById('settingsPanel').classList.remove('open'); }

  var cursorEl=null;
  function getCursor(){
    if(cursorEl) return cursorEl;
    cursorEl=document.createElement('div');
    cursorEl.style.cssText='position:fixed;width:360px;height:360px;border-radius:50%;background:var(--glow);filter:blur(120px);opacity:.20;z-index:0;pointer-events:none;transition:opacity .4s;';
    document.body.appendChild(cursorEl); return cursorEl;
  }
  function enableCursorGlow(){ var c=getCursor(); c.style.opacity='.20'; document.addEventListener('mousemove',moveCursor); }
  function disableCursorGlow(){ if(cursorEl) cursorEl.style.opacity='0'; document.removeEventListener('mousemove',moveCursor); }
  function moveCursor(e){ var c=getCursor(); c.style.left=(e.clientX-180)+'px'; c.style.top=(e.clientY-180)+'px'; }

  function injectNav(active){
    var nav=document.querySelector('nav'); if(!nav||nav.dataset.built) return;
    nav.dataset.built='1';
    nav.innerHTML=
      '<a class="brand" href="index.html"><div class="brand-logo">NX</div><div><div class="brand-name">Nexus<span>X</span> Vids</div><div class="brand-tag">Premium Showcase</div></div></a>'+
      '<div class="nav-links">'+
        '<a href="index.html"'+(active==='home'?' class="active"':'')+'><span>Home</span></a>'+
        window.NEXUS_CATS.map(function(c){ return '<a href="'+c.url+'"'+(active===c.key?' class="active"':'')+'><span>'+esc(c.label)+'</span></a>'; }).join('')+
      '</div>'+
      '<div class="nav-right"><div class="search-box"><input type="text" id="globalSearch" placeholder="Search..."></div>'+
      '<button class="settings-btn" id="openSettings" title="Settings"><span>⚙</span></button></div>';
    document.getElementById('openSettings').addEventListener('click',openSettings);
    var s=document.getElementById('globalSearch');
    if(s) s.addEventListener('input',function(e){ if(window.NEXUS_applySearch) window.NEXUS_applySearch(e.target.value); });
  }

  function buildPlayer(){
    if(document.getElementById('playerModal')) return;
    var m=document.createElement('div'); m.className='player-modal'; m.id='playerModal';
    m.innerHTML='<div class="player-header">'+
      '<div class="player-left"><button class="player-back" onclick="window.NEXUS.closePlayer()" title="Go back">←</button><div class="player-title-wrap"><div class="player-title" id="playerTitle">Playback</div><div class="player-counter" id="playerCounter"></div></div></div>'+
      '<div class="player-center"><button class="player-nav-btn" id="prevBtn" onclick="window.NEXUS.prev()" title="Previous">‹</button><button class="player-nav-btn" id="nextBtn" onclick="window.NEXUS.next()" title="Next">›</button></div>'+
      '<div class="player-actions"><button id="soundToggle" title="Sound on/off" style="display:none">🔇</button><button onclick="window.NEXUS.copyDirectLink()">↗ Link</button><button onclick="window.NEXUS.copyEmbedCode()">◧ Embed</button><button class="player-close" onclick="window.NEXUS.closePlayer()">✕ Close</button></div></div>'+
      '<div class="video-container"><button class="nav-arrow left" id="arrowPrev" onclick="window.NEXUS.prev()" title="Previous">‹</button><button class="nav-arrow right" id="arrowNext" onclick="window.NEXUS.next()" title="Next">›</button><video id="videoPlayer" controls style="display:none;"></video><iframe id="iframePlayer" style="display:none;" allow="autoplay; fullscreen" allowfullscreen></iframe><img id="imagePlayer" style="display:none;" alt=""></div>';
    document.body.appendChild(m);
    document.addEventListener('keydown',function(e){
      var mod=document.getElementById('playerModal');
      if(!mod||!mod.classList.contains('active')) return;
      if(e.key==='Escape') window.NEXUS.closePlayer();
      else if(e.key==='ArrowLeft') window.NEXUS.prev();
      else if(e.key==='ArrowRight') window.NEXUS.next();
    });
    m.addEventListener('click',function(e){ if(e.target===m) window.NEXUS.closePlayer(); });
    var stEl=document.getElementById('soundToggle');
    if(stEl){
      stEl.addEventListener('click',function(){
        var vp=document.getElementById('videoPlayer');
        if(!vp) return;
        vp.muted=!vp.muted;
        stEl.textContent=vp.muted?'🔇':'🔊';
        vp.play().catch(function(){});
      });
    }
  }
  var curUrl='', curName='', curFile='', curList=[], curIdx=-1;

  function setupReveal(){
    if(!('IntersectionObserver' in window)){ document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('visible'); }); return; }
    var io=new IntersectionObserver(function(ents){
      ents.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('visible'); io.unobserve(en.target); } });
    },{threshold:0.12,rootMargin:'0px 0px -40px 0px'});
    document.querySelectorAll('.reveal:not(.visible)').forEach(function(el){ io.observe(el); });
  }

  function setupScrollProgress(){
    var bar=document.createElement('div'); bar.className='scroll-progress'; bar.id='scrollProgress'; document.body.appendChild(bar);
    function upd(){
      var h=document.documentElement;
      var max=h.scrollHeight - h.clientHeight;
      var pct=max>0 ? (window.scrollY / max)*100 : 0;
      bar.style.width=pct+'%';
      var nav=document.querySelector('nav');
      if(nav) nav.classList.toggle('scrolled', window.scrollY>12);
    }
    window.addEventListener('scroll', upd, {passive:true}); upd();
  }

  function setupTilt(){
    document.querySelectorAll('.cat-card, .stat').forEach(function(el){
      el.classList.add('tilt');
      el.addEventListener('mousemove', function(e){
        var r=el.getBoundingClientRect();
        var x=(e.clientX - r.left)/r.width - 0.5;
        var y=(e.clientY - r.top)/r.height - 0.5;
        el.style.transform='perspective(900px) rotateY('+(x*8)+'deg) rotateX('+(-y*8)+'deg) translateY(-6px) scale(1.02)';
      });
      el.addEventListener('mouseleave', function(){ el.style.transform=''; });
    });
  }

  function isIframeUrl(u){
    return /screenpal\.com|archive\.org|youtube\.com|youtu\.be|vimeo\.com/i.test(u||'');
  }

  window.NEXUS={
    esc:esc, showToast:showToast, copyToClipboard:copyToClipboard,
    favs:getFavs, isFav:isFav, toggleFav:toggleFav,
    cardHTML:function(v){
      var cat=(window.NEXUS_CATS.find(function(c){ return c.key.toLowerCase()===(v.category||'').toLowerCase(); })||{});
      var label=cat.label||v.category||'General';
      var fav=isFav(v.url)?' on':'';
      var isReel=!!v.thumb;
      var thumb='';
      if(v.file){
        var poster=(v.thumb&&!isIframeUrl(v.file))?' poster="'+esc(v.thumb)+'"':'';
        thumb='<video src="'+esc(v.file)+'" muted loop playsinline preload="metadata"'+poster+'></video>';
      } else if(v.thumb){
        thumb='<img src="'+esc(v.thumb)+'" alt="'+esc(v.name)+'" loading="lazy">';
      } else if(v.type==='image'){
        thumb='<img src="'+esc(v.url)+'" alt="'+esc(v.name)+'" loading="lazy">';
      } else if(isIframeUrl(v.url)){
        thumb='<iframe src="'+esc(v.url)+'" loading="lazy" allow="autoplay; fullscreen" allowfullscreen></iframe>';
      } else {
        thumb='<video src="'+esc(v.url)+'" preload="metadata" muted loop></video>';
      }
      return '<div class="video-card'+(isReel?' reel':'')+'" data-url="'+esc(v.url)+'" data-thumb="'+esc(v.thumb||'')+'" data-file="'+esc(v.file||'')+'" data-name="'+esc(v.name)+'" data-type="'+(v.type||'video')+'" onclick="window.NEXUS.play(this)">'+
        '<div class="video-thumb">'+thumb+'<span class="cat-chip">'+esc(label)+'</span>'+
        '<button class="fav-btn'+fav+'" onclick="event.stopPropagation();window.NEXUS.handleFav(this,\''+esc(v.url)+'\')">'+(fav?'♥':'♡')+'</button>'+
        '<div class="play-btn"></div>'+(isReel?'<span class="reel-badge">▶︎ Reel</span>':'')+'</div>'+
        '<div class="video-info"><div class="video-name">'+esc(v.name)+'</div><div class="video-meta">'+(v.size?'⏱ '+esc(v.size):'')+'</div></div></div>';
    },
    handleFav:function(btn, url){
      var on=toggleFav(url);
      btn.classList.toggle('on',on); btn.textContent=on?'♥':'♡';
      showToast(on?'Added to favorites':'Removed from favorites');
      if(window.NEXUS_onFavChange) window.NEXUS_onFavChange();
    },
    wireCards:function(){
      document.querySelectorAll('.video-card').forEach(function(card){
        var vid=card.querySelector('.video-thumb video');
        if(vid && localStorage.getItem('nexus-hoverPlay')!=='0'){
          card.addEventListener('mouseenter',function(){ vid.play().catch(function(){}); });
          card.addEventListener('mouseleave',function(){ vid.pause(); vid.currentTime=0; });
        }
        // Reel hover preview — auto-play muted preview iframe (only when no local mp4)
        if(card.classList.contains('reel') && card.dataset.url && !card.dataset.file){
          var thumb=card.querySelector('.video-thumb');
          var preview=null;
          card.addEventListener('mouseenter',function(){
            if(localStorage.getItem('nexus-hoverPlay')==='0') return;
            if(window.matchMedia('(hover: none)').matches) return;
            if(preview) return;
            var url=card.dataset.url;
            var sep=url.indexOf('?')!==-1?'&':'?';
            var src=url + (url.indexOf('autoplay')!==-1?'':'&autoplay=1&muted=1');
            // hide controls for preview
            if(src.indexOf('controls')===-1) src+='&controls=0';
            preview=document.createElement('div');
            preview.className='reel-preview';
            preview.innerHTML='<iframe src="'+esc(src)+'" allow="autoplay; fullscreen" allowfullscreen></iframe>';
            thumb.appendChild(preview);
            requestAnimationFrame(function(){ if(preview) preview.style.opacity='1'; });
          });
          card.addEventListener('mouseleave',function(){
            if(preview){ preview.style.opacity='0'; setTimeout(function(){ if(preview&&preview.parentNode) preview.remove(); preview=null; },300); }
          });
        }
      });
    },
    _setList:function(list){ curList=list||[]; },
    _updateNav:function(){
      var prev=document.getElementById('prevBtn'), next=document.getElementById('nextBtn');
      var ap=document.getElementById('arrowPrev'), an=document.getElementById('arrowNext');
      var cnt=document.getElementById('playerCounter');
      var total=curList.length, idx=curIdx;
      if(cnt) cnt.textContent= total? ( (idx+1)+' / '+total ) : '';
      var hasPrev=idx>0, hasNext=idx>=0 && idx < total-1;
      if(prev) prev.disabled=!hasPrev;
      if(next) next.disabled=!hasNext;
      if(ap) ap.disabled=!hasPrev;
      if(an) an.disabled=!hasNext;
    },
    play:function(item){
      // normalize input: DOM element (from card) or item object or legacy (url,name,type)
      var it={};
      if(item && item.dataset){
        it.url=item.dataset.url; it.name=item.dataset.name; it.type=item.dataset.type||'video';
        it.file=item.dataset.file||''; it.thumb=item.dataset.thumb||'';
      } else if(typeof item==='string' || arguments.length>1){
        it.url=item; it.name=arguments[1]||''; it.type=arguments[2]||'video';
        it.file=arguments[3]||''; it.thumb=arguments[4]||'';
        if(arguments[5] && Array.isArray(arguments[5])) curList=arguments[5];
      } else {
        it=item||{};
      }
      // allow passing list for nav; fallback to currentList
      if(!curList.length && window.NEXUS.currentList && window.NEXUS.currentList.length) curList=window.NEXUS.currentList;
      // find index in list
      curIdx=-1;
      for(var i=0;i<curList.length;i++){ if(curList[i].url===it.url){ curIdx=i; break; } }
      if(curIdx===-1 && curList.length){ for(var j=0;j<curList.length;j++){ if(curList[j].name===it.name){ curIdx=j; break; } } }

      curUrl=it.url; curName=it.name; curFile=it.file||'';
      buildPlayer();
      document.getElementById('playerTitle').textContent=it.name;
      this._updateNav();
      var p=document.getElementById('videoPlayer');
      var f=document.getElementById('iframePlayer');
      var im=document.getElementById('imagePlayer');
      var st=document.getElementById('soundToggle');
      p.style.display='none'; f.style.display='none'; im.style.display='none';
      p.pause(); p.removeAttribute('src'); p.load(); f.src=''; if(st) st.style.display='none';
      var isNode=!!it.file;
      var isIframe=!isNode && isIframeUrl(it.url);
      var isImage=(it.type==='image' || (/\.(png|jpe?g|webp)(\?|$)/i.test(it.url) ) ) && !isIframe && !isNode;
      if(isImage){
        im.src=it.url; im.style.display='block';
      } else if(isIframe){
        f.style.display='block';
        var src=it.url;
        if(src.indexOf('autoplay')===-1) src+=(src.indexOf('?')!==-1?'&':'?')+'autoplay=1&muted=1';
        f.src=src;
        setTimeout(function(){ f.focus&&f.focus(); },100);
      } else {
        // native video — autoplays on click (user gesture), audio ON by default
        p.style.display='block';
        p.muted=false; p.loop=true; p.playsInline=true; p.controls=true;
        p.autoplay=true; p.preload='auto';
        p.poster=it.thumb||'';
        p.src=it.file||it.url;
        p.play().catch(function(){
          // policy fallback: retry muted so playback still starts
          p.muted=true;
          if(st){ st.textContent='🔇'; }
          p.play().catch(function(){});
        });
        if(st){ st.style.display='inline-flex'; st.textContent='🔊'; }
      }
      document.getElementById('playerModal').classList.add('active');
      document.body.style.overflow='hidden';
    },
    next:function(){
      if(curIdx<0 || !curList.length) return;
      if(curIdx >= curList.length-1) return;
      this.play(curList[curIdx+1]);
    },
    prev:function(){
      if(curIdx<=0) return;
      this.play(curList[curIdx-1]);
    },
    closePlayer:function(){
      var p=document.getElementById('videoPlayer'); var f=document.getElementById('iframePlayer'); var im=document.getElementById('imagePlayer');
      if(p){ p.pause(); p.removeAttribute('src'); p.load(); }
      if(f) f.src=''; if(im) im.src='';
      var st=document.getElementById('soundToggle'); if(st) st.style.display='none';
      var m=document.getElementById('playerModal'); if(m) m.classList.remove('active');
      document.body.style.overflow='';
    },
    copyDirectLink:function(){
      if(curFile){ copyToClipboard(new URL(curFile, location.href).href,'Direct video link copied!'); return; }
      copyToClipboard(curUrl,'Link copied!');
    },
    copyEmbedCode:function(){
      var code;
      if(curFile){ code='<video src="'+new URL(curFile,location.href).href+'" controls playsinline width="100%" style="max-width:800px;"></video>'; }
      else if(/\.(png|jpe?g|webp)(\?|$)/i.test(curUrl)){ code='<img src="'+curUrl+'" style="max-width:100%;">'; }
      else { code='<video src="'+curUrl+'" controls width="100%" style="max-width:800px;"></video>'; }
      copyToClipboard(code,'Embed code copied!');
    }
  };

  document.addEventListener('DOMContentLoaded',function(){
    var saved=localStorage.getItem('nexus-theme')||'midnight';
    applyTheme(saved);
    buildSettings();
    injectNav(document.body.dataset.page||'home');
    setupReveal();
    setupScrollProgress();
    setTimeout(setupTilt, 300);
    if(localStorage.getItem('nexus-cursorGlow')!=='0') enableCursorGlow();
    if(localStorage.getItem('nexus-bento')!=='0'){
      document.querySelectorAll('.video-grid:not(.reel)').forEach(function(g){ g.classList.add('bento'); });
    }
  });
})();
