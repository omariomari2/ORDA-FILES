(function () {
  const gallery = document.querySelector('.mission-section .flex-gallery');
  if (!gallery) return;

  const cards = Array.from(gallery.querySelectorAll('.card'));
  if (cards.length === 0) return;

  // Initially show all as active (opacity), none expanded
  cards.forEach(card => card.classList.add('is-active'));

  // Hover behavior (desktop)
  gallery.addEventListener('mouseenter', event => {
    const card = event.target.closest('.card');
    if (card && gallery.contains(card)) {
      cards.forEach(c => c.classList.remove('is-active'));
      card.classList.add('is-active');
    }
  }, true);

  gallery.addEventListener('mouseleave', () => {
    const anyExpanded = cards.some(c => c.classList.contains('is-expanded'));
    if (!anyExpanded) {
      cards.forEach(c => c.classList.add('is-active'));
    }
  }, true);

  // Click/tap behavior (mobile)
  gallery.addEventListener('click', event => {
    const card = event.target.closest('.card');
    if (!card || !gallery.contains(card)) return;

    const wasExpanded = card.classList.contains('is-expanded');

    cards.forEach(c => {
      c.classList.remove('is-expanded');
      c.classList.remove('is-active');
    });

    if (!wasExpanded) {
      card.classList.add('is-expanded');
      card.classList.add('is-active');
    } else {
      cards.forEach(c => c.classList.add('is-active'));
    }
  });
})();

// Features section GSAP animations
(function () {
  if (typeof window === 'undefined') return;
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const section = document.querySelector('.features-section');
  if (!section || prefersReduced) return;

  if (!window.gsap) return;
  gsap.registerPlugin(ScrollTrigger);

  const pill = section.querySelector('.pill');
  const title = section.querySelector('.section-title');
  const sub = section.querySelector('.section-sub');
  const grid = section.querySelector('.features-grid');
  const featureCards = grid ? Array.from(grid.querySelectorAll('.feature-card')) : [];

  // Intro text animation
  if (pill || title || sub) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        end: 'top 20%',
        toggleActions: 'play none none reverse'
      }
    });

    if (pill) tl.from(pill, { y: 24, opacity: 0, duration: 0.5, ease: 'power3.out' });
    if (title) tl.from(title, { y: 28, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.2');
    if (sub) tl.from(sub, { y: 20, opacity: 0, duration: 0.5, ease: 'power3.out' }, '-=0.25');
  }

  // Cards entrance animation
  if (featureCards.length) {
    gsap.set(featureCards, { transformPerspective: 800, transformOrigin: '50% 60%' });
    gsap.from(featureCards, {
      opacity: 0,
      y: 80,
      rotateX: -18,
      rotateY: 8,
      scale: 0.94,
      filter: 'blur(4px)',
      duration: 0.9,
      ease: 'expo.out',
      stagger: 0.12,
      scrollTrigger: {
        trigger: grid,
        start: 'top 75%',
        toggleActions: 'play none none reverse'
      }
    });

    // Parallax on icons inside cards during scroll
    featureCards.forEach((card) => {
      const icon = card.querySelector('.feature-icon');
      if (!icon) return;
      gsap.fromTo(icon, { y: 0 }, {
        y: -10,
        ease: 'none',
        scrollTrigger: {
          trigger: card,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    });

    // Reveal inner content per card
    featureCards.forEach((card) => {
      const titleEl = card.querySelector('.feature-title');
      const descEl = card.querySelector('.feature-desc');
      const points = Array.from(card.querySelectorAll('.feature-points li'));
      const cta = card.querySelector('.feature-cta');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: 'top 78%',
          toggleActions: 'play none none reverse'
        }
      });

      if (titleEl) tl.from(titleEl, { y: 16, opacity: 0, duration: 0.35, ease: 'power2.out' });
      if (descEl) tl.from(descEl, { y: 14, opacity: 0, duration: 0.35, ease: 'power2.out' }, '-=0.1');
      if (points.length) tl.from(points, { y: 10, opacity: 0, duration: 0.25, stagger: 0.08, ease: 'power2.out' }, '-=0.05');
      if (cta) tl.from(cta, { y: 10, opacity: 0, duration: 0.3, ease: 'power2.out' }, '-=0.05');
    });

    // Hover tilt interaction
    featureCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const relX = (e.clientX - rect.left) / rect.width - 0.5;
        const relY = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(card, {
          rotateY: relX * 8,
          rotateX: -relY * 8,
          translateZ: 0,
          boxShadow: '0 18px 40px rgba(13,23,54,0.14)',
          duration: 0.3,
          ease: 'power2.out'
        });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          boxShadow: '0 10px 24px rgba(0,0,0,0.06)',
          duration: 0.5,
          ease: 'power3.out'
        });
      });
    });
  }

  // Features/services carousel (GSAP-driven)
  const carouselRoot = document.querySelector('.features-carousel');
  if (carouselRoot) {
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const track = carouselRoot.querySelector('.carousel-track');
    const slides = Array.from(carouselRoot.querySelectorAll('.carousel-slide'));
    const prevBtn = carouselRoot.querySelector('.carousel-btn.prev');
    const nextBtn = carouselRoot.querySelector('.carousel-btn.next');
    const dotsWrap = carouselRoot.querySelector('.carousel-dots');

    let index = Math.max(0, slides.findIndex(s => s.classList.contains('is-active')));
    let autoTween = null;
    const autoplaySeconds = 5.5;
    let activeObserver = null;

    // Build dots
    dotsWrap.innerHTML = '';
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      if (i === index) dot.setAttribute('aria-selected', 'true');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });

    function updateDots(i) {
      Array.from(dotsWrap.children).forEach((d, di) => {
        if (di === i) d.setAttribute('aria-selected', 'true');
        else d.removeAttribute('aria-selected');
      });
    }

    function setTrackHeight(el, animate) {
      const isMobile = window.matchMedia && window.matchMedia('(max-width: 640px)').matches;
      if (!isMobile) return; // desktop uses fixed CSS height
      const targetHeight = el.offsetHeight;
      if (prefersReduced || !animate) {
        gsap.set(track, { height: targetHeight });
      } else {
        gsap.to(track, { height: targetHeight, duration: 0.5, ease: 'power3.inOut' });
      }
    }

    function observeActiveSlide(el) {
      if (activeObserver) activeObserver.disconnect();
      if (!('ResizeObserver' in window)) return;
      activeObserver = new ResizeObserver(() => setTrackHeight(el, false));
      activeObserver.observe(el);
    }

    // Prepare initial state
    slides.forEach((s, i) => { if (i !== index) s.classList.remove('is-active'); });
    slides[index].classList.add('is-active');
    setTrackHeight(slides[index], false);
    observeActiveSlide(slides[index]);

    function animateInElements(container) {
      const elements = [
        container.querySelector('.slide-kicker'),
        container.querySelector('.slide-title'),
        container.querySelector('.slide-desc'),
        ...Array.from(container.querySelectorAll('.slide-list li')),
        container.querySelector('.slide-more'),
        container.querySelector('.slide-cta')
      ].filter(Boolean);
      if (elements.length === 0 || prefersReduced) return null;
      return gsap.from(elements, {
        opacity: 0,
        y: 18,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.07
      });
    }

    function goTo(newIndex) {
      if (newIndex === index || newIndex < 0 || newIndex >= slides.length) return;
      const fromEl = slides[index];
      const toEl = slides[newIndex];
      const direction = newIndex > index ? 1 : -1;

      // Pause autoplay while transitioning
      stopAutoplay();

      if (prefersReduced) {
        fromEl.classList.remove('is-active');
        toEl.classList.add('is-active');
        index = newIndex;
        setTrackHeight(toEl, true);
        observeActiveSlide(toEl);
        updateDots(index);
        startAutoplay();
        return;
      }

      // Stack for crossfade/slide
      gsap.set(toEl, { position: 'absolute', inset: 0, opacity: 0, x: 40 * direction });
      toEl.classList.add('is-active');

      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        onComplete: () => {
          fromEl.classList.remove('is-active');
          gsap.set(toEl, { position: 'relative', clearProps: 'position,inset' });
          observeActiveSlide(toEl);
          startAutoplay();
        }
      });

      tl.add(() => setTrackHeight(toEl, true), 0)
        .to(fromEl, { opacity: 0, x: -40 * direction, duration: 0.45 }, 0)
        .to(toEl, { opacity: 1, x: 0, duration: 0.5 }, 0)
        .add(animateInElements(toEl), '>-0.25');

      index = newIndex;
      updateDots(index);
    }

    function startAutoplay() {
      if (prefersReduced) return;
      if (autoTween) autoTween.kill();
      autoTween = gsap.delayedCall(autoplaySeconds, () => goTo((index + 1) % slides.length));
    }

    function stopAutoplay() {
      if (autoTween) { autoTween.kill(); autoTween = null; }
    }

    prevBtn.addEventListener('click', () => goTo(index - 1));
    nextBtn.addEventListener('click', () => goTo(index + 1));

    // Pause/resume on hover/focus
    carouselRoot.addEventListener('mouseenter', stopAutoplay);
    carouselRoot.addEventListener('mouseleave', startAutoplay);
    carouselRoot.addEventListener('focusin', stopAutoplay);
    carouselRoot.addEventListener('focusout', startAutoplay);

    // Resize handling
    window.addEventListener('resize', () => setTrackHeight(slides[index], false));
    window.addEventListener('load', () => setTrackHeight(slides[index], false));

    // Recompute on breakpoint changes explicitly
    if (window.matchMedia) {
      const mq = window.matchMedia('(max-width: 640px)');
      const handler = () => setTrackHeight(slides[index], false);
      mq.addEventListener ? mq.addEventListener('change', handler) : mq.addListener(handler);
    }

    // Start autoplay only when in view
    if (window.gsap && window.ScrollTrigger) {
      ScrollTrigger.create({
        trigger: carouselRoot,
        start: 'top 85%',
        end: 'bottom 15%',
        onEnter: startAutoplay,
        onEnterBack: startAutoplay,
        onLeave: stopAutoplay,
        onLeaveBack: stopAutoplay
      });
    } else {
      startAutoplay();
    }
  }

  // Landing full-bleed hero carousel
  (function initLandingCarousel() {
    const root = document.querySelector('.landing-carousel');
    if (!root) return;
    const track = root.querySelector('.landing-track');
    const slides = Array.from(root.querySelectorAll('.landing-slide'));
    const prev = root.querySelector('.landing-btn.prev');
    const next = root.querySelector('.landing-btn.next');
    const dotsWrap = root.querySelector('.landing-dots');
    if (slides.length <= 1) return;

    let index = Math.max(0, slides.findIndex(s => s.classList.contains('is-active')));
    let timer = null;
    const autoplaySeconds = 6;
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Build dots
    dotsWrap.innerHTML = '';
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      if (i === index) dot.setAttribute('aria-selected', 'true');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });

    function updateDots(i) {
      Array.from(dotsWrap.children).forEach((d, di) => {
        if (di === i) d.setAttribute('aria-selected', 'true');
        else d.removeAttribute('aria-selected');
      });
    }

    function goTo(newIndex) {
      if (newIndex === index || newIndex < 0 || newIndex >= slides.length) return;
      const from = slides[index];
      const to = slides[newIndex];
      const dir = newIndex > index ? 1 : -1;

      stop();

      if (prefersReduced || !window.gsap) {
        from.classList.remove('is-active');
        to.classList.add('is-active');
        index = newIndex;
        updateDots(index);
        start();
        return;
      }

      gsap.set(to, { position: 'absolute', inset: 0, opacity: 0, x: 60 * dir, zIndex: 2 });
      to.classList.add('is-active');
      gsap.set(from, { zIndex: 1 });

      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        onComplete: () => {
          from.classList.remove('is-active');
          // Keep slides absolutely positioned to layer content over background without reflow
          gsap.set(to, { position: 'absolute', inset: 0, clearProps: 'zIndex' });
          start();
        }
      });

      tl.to(from, { opacity: 0, x: -60 * dir, duration: 0.5 }, 0)
        .to(to, { opacity: 1, x: 0, duration: 0.6 }, 0);

      index = newIndex;
      updateDots(index);
    }

    function start() {
      if (prefersReduced) return;
      stop();
      timer = setTimeout(() => goTo((index + 1) % slides.length), autoplaySeconds * 1000);
    }

    function stop() {
      if (timer) { clearTimeout(timer); timer = null; }
    }

    prev.addEventListener('click', () => goTo((index - 1 + slides.length) % slides.length));
    next.addEventListener('click', () => goTo((index + 1) % slides.length));
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    root.addEventListener('focusin', stop);
    root.addEventListener('focusout', start);

    // Start when in view
    if (window.gsap && window.ScrollTrigger) {
      ScrollTrigger.create({
        trigger: root,
        start: 'top 85%',
        end: 'bottom 15%',
        onEnter: start,
        onEnterBack: start,
        onLeave: stop,
        onLeaveBack: stop
      });
    } else {
      start();
    }
  })();

  const mapBlock = document.querySelector('.features-map .map-img');
  const mapWrap = document.querySelector('.features-map');
  if (mapBlock && mapWrap) {
    gsap.set(mapBlock, { scale: 0.9, filter: 'blur(2px)', opacity: 0.9 });
    gsap.to(mapBlock, {
      scale: 1,
      filter: 'blur(0px)',
      opacity: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: mapWrap,
        start: 'top bottom',
        end: 'center center',
        scrub: true
      }
    });
  }
})(); 

// FAQ accordion (progressively enhanced)
(function () {
  const list = document.querySelector('.faq-list');
  if (!list) return;
  list.addEventListener('click', (e) => {
    const btn = e.target.closest('.faq-question');
    if (!btn || !list.contains(btn)) return;
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    const answer = document.getElementById(btn.getAttribute('aria-controls'));
    if (!answer) return;

    // Measure content for smooth height animation
    const setOpen = (open) => {
      btn.setAttribute('aria-expanded', String(open));
      if (open) {
        answer.hidden = false;
        const contentHeight = answer.scrollHeight;
        answer.classList.add('is-open');
        answer.style.maxHeight = contentHeight + 'px';
      } else {
        answer.style.maxHeight = answer.scrollHeight + 'px';
        requestAnimationFrame(() => {
          answer.classList.remove('is-open');
          answer.style.maxHeight = '0px';
        });
        answer.addEventListener('transitionend', function onEnd() {
          answer.hidden = true;
          answer.removeEventListener('transitionend', onEnd);
        });
      }
    };

    setOpen(!expanded);
  });
})();

// Waitlist animations (GSAP)
(function () {
  if (typeof window === 'undefined' || !window.gsap) return;
  const section = document.querySelector('.waitlist-section');
  if (!section) return;

  const cards = Array.from(section.querySelectorAll('.wl-card'));
  const title = section.querySelector('.waitlist-title, .inquiry-title');
  gsap.registerPlugin(ScrollTrigger);

  if (title) {
    gsap.from(title, {
      y: 24,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
      }
    });
  }

  if (cards.length) {
    gsap.from(cards, {
      y: 40,
      opacity: 0,
      rotateX: -10,
      duration: 0.7,
      ease: 'power3.out',
      stagger: 0.12,
      scrollTrigger: {
        trigger: section,
        start: 'top 75%'
      }
    });

    // subtle parallax on icons
    cards.forEach((card) => {
      const icon = card.querySelector('.wl-icon');
      if (!icon) return;
      gsap.fromTo(icon, { y: 0 }, {
        y: -8,
        ease: 'none',
        scrollTrigger: {
          trigger: card,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    });
  }
  // Form fields reveal
  const form = section.querySelector('.inq-form');
  if (form) {
    const fields = Array.from(form.querySelectorAll('.field, .form-row, textarea'));
    gsap.from(fields, {
      y: 18,
      opacity: 0,
      duration: 0.5,
      stagger: 0.06,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: form,
        start: 'top 85%'
      }
    });
  }

  // Phone mockup float-in
  const phone = section.querySelector('.phone-frame');
  if (phone) {
    gsap.from(phone, {
      x: 40,
      y: 20,
      opacity: 0,
      rotate: -2,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: phone,
        start: 'top 85%'
      }
    });
  }
})();