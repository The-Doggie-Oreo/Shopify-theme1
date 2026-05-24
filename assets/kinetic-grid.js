(function(){
  'use strict';

  function initCountdown(el){
    if(!el) return;
    var target = el.getAttribute('data-kg-target');
    if(!target) return;
    var targetTime = Date.parse(target);
    if(isNaN(targetTime)) return;

    function update(){
      var now = Date.now();
      var diff = Math.max(0, targetTime - now);
      var days = Math.floor(diff / (24*60*60*1000));
      var hours = Math.floor(diff / (60*60*1000)) % 24;
      var minutes = Math.floor(diff / (60*1000)) % 60;
      var seconds = Math.floor(diff / 1000) % 60;

      el.querySelectorAll('[data-kg-unit]').forEach(function(unit){
        var name = unit.getAttribute('data-kg-unit');
        if(name === 'days') unit.textContent = String(days).padStart(2,'0');
        if(name === 'hours') unit.textContent = String(hours).padStart(2,'0');
        if(name === 'minutes') unit.textContent = String(minutes).padStart(2,'0');
        if(name === 'seconds') unit.textContent = String(seconds).padStart(2,'0');
      });

      if(diff <= 0){
        el.dispatchEvent(new CustomEvent('kg:countdown:expired',{bubbles:true}));
        clearInterval(interval);
      }
    }

    update();
    var interval = setInterval(update, 1000);
  }

  function initAllCountdowns(){
    document.querySelectorAll('[data-kg-countdown]').forEach(function(el){
      initCountdown(el);
    });
  }

  function initExpiryGuards(){
    document.querySelectorAll('[data-kg-expiry]').forEach(function(el){
      var expiry = el.getAttribute('data-kg-expiry');
      if(!expiry) return;
      var t = Date.parse(expiry);
      if(isNaN(t)) return;
      if(Date.now()>t){
        var action = el.getAttribute('data-kg-expiry-action') || 'hide';
        if(action === 'hide') el.style.display='none';
        if(action === 'message'){
          var msg = el.getAttribute('data-kg-expiry-message') || 'This campaign has ended';
          el.innerHTML = '<div class="kg-campaign-expired">'+ msg +'</div>';
        }
        el.dispatchEvent(new CustomEvent('kg:campaign:expired',{bubbles:true}));
      } else {
        setTimeout(function(){
          var action2 = el.getAttribute('data-kg-expiry-action') || 'hide';
          if(action2 === 'hide') el.style.display='none';
          if(action2 === 'message'){
            var msg = el.getAttribute('data-kg-expiry-message') || 'This campaign has ended';
            el.innerHTML = '<div class="kg-campaign-expired">'+ msg +'</div>';
          }
        }, t - Date.now());
      }
    });
  }

  function initParallax(){
    var els = Array.prototype.slice.call(document.querySelectorAll('[data-kg-parallax]'));
    if(!els.length) return;
    var ticking = false;
    function onScroll(){
      if(!ticking){
        window.requestAnimationFrame(function(){
          var scrolled = window.scrollY || window.pageYOffset;
          els.forEach(function(el){
            var speed = parseFloat(el.getAttribute('data-kg-parallax-speed') || 0.2);
            el.style.transform = 'translateY(' + -(scrolled * speed) + 'px)';
          });
          ticking = false;
        });
        ticking = true;
      }
    }
    window.addEventListener('scroll', onScroll, {passive:true});
    onScroll();
  }

  function initLazyEmbeds(){
    if(!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          var el = entry.target;
          var src = el.getAttribute('data-kg-lazy-src');
          if(src && el.tagName === 'IFRAME'){
            el.src = src;
            io.unobserve(el);
          } else if(src && el.hasAttribute('data-kg-bg-image')){
            el.style.backgroundImage = 'url(' + src + ')';
            io.unobserve(el);
          } else {
            el.classList.add('kg-inview');
            io.unobserve(el);
          }
        }
      });
    }, {rootMargin:'200px'});
    document.querySelectorAll('[data-kg-lazy]').forEach(function(el){io.observe(el);});
  }

  document.addEventListener('DOMContentLoaded', function(){
    initAllCountdowns();
    initExpiryGuards();
    initParallax();
    initLazyEmbeds();
  });

  window.KineticGrid = {initCountdown:initCountdown, initParallax:initParallax};
})();
