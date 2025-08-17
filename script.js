/* Config-driven romantic site script */
(function(){
	const cfg = window.LOVE_CONFIG || {};

	// Brand + names
	const brandName = document.getElementById('brandName');
	const herNameTitle = document.getElementById('herNameTitle');
	const fromName = document.getElementById('fromName');
	const toName = document.getElementById('toName');
	if(brandName) brandName.textContent = 'my princess';
	if(herNameTitle) herNameTitle.textContent = cfg.herName || '';
	if(fromName) fromName.textContent = cfg.yourName || 'Me';
	if(toName) toName.textContent = cfg.herName || 'You';

	// Playlist button removed by request

	// Subtitle tweak referencing Taylor + Stitch
	const subtitle = document.getElementById('subtitle');
	if(subtitle && cfg.subtitle){ subtitle.textContent = cfg.subtitle; }

	// Anniversary stats (configurable)
	const customStart = cfg.stats && cfg.stats.startFrom ? new Date(cfg.stats.startFrom) : null;
	const startDate = customStart && !isNaN(customStart) ? customStart : (cfg.startDate ? new Date(cfg.startDate) : null);
	const daysEl = document.getElementById('daysTogether');
	const hoursEl = document.getElementById('hoursTogether');
	const daysLabel = document.getElementById('daysLabel');
	const hoursLabel = document.getElementById('hoursLabel');
	const movieCountEl = document.getElementById('movieCount');
	const startDateText = document.getElementById('startDateText');
	if(startDate && !isNaN(startDate.getTime())){
		startDateText.textContent = startDate.toLocaleDateString();
		const updateStats = () => {
			const now = new Date();
			const diffMs = now - startDate;
			const days = Math.floor(diffMs / (1000*60*60*24));
			const hours = Math.floor(diffMs / (1000*60*60));
			if(daysEl) daysEl.textContent = days.toLocaleString();
			if(hoursEl) hoursEl.textContent = hours.toLocaleString();
		};
		updateStats();
		setInterval(updateStats, 60 * 1000);
	}
	if(daysLabel && cfg.stats && cfg.stats.daysLabel){ daysLabel.textContent = cfg.stats.daysLabel; }
	if(hoursLabel && cfg.stats && cfg.stats.hoursLabel){ hoursLabel.textContent = cfg.stats.hoursLabel; }
	if(movieCountEl){ movieCountEl.textContent = (cfg.movies || []).length.toString(); }

	// Timeline
	const timeline = document.getElementById('timeline');
	if(timeline){
		(cfg.timeline || []).forEach(item => {
			const el = document.createElement('div');
			el.className = 'item';
			el.innerHTML = `<div class="date">${item.date || ''}</div><div class="text">${item.text || ''}</div>`;
			timeline.appendChild(el);
		});
	}

	// Gallery
	const galleryGrid = document.getElementById('galleryGrid');
	if(galleryGrid){
		(cfg.gallery || []).forEach(src => {
			const wrapper = document.createElement('button');
			wrapper.className = 'photo';
			wrapper.setAttribute('aria-label','Open photo');
			const img = document.createElement('img');
			img.loading = 'lazy';
			img.alt = 'Our memory photo';
			img.src = src;
			wrapper.appendChild(img);
			wrapper.addEventListener('click', () => openLightbox(src));
			galleryGrid.appendChild(wrapper);
		});
	}
	let lightbox;
	function openLightbox(src){
		if(!lightbox){
			lightbox = document.createElement('div');
			lightbox.className = 'lightbox';
			lightbox.addEventListener('click', () => lightbox.classList.remove('open'));
			document.body.appendChild(lightbox);
		}
		lightbox.innerHTML = '';
		const img = document.createElement('img');
		img.src = src; img.alt = '';
		lightbox.appendChild(img);
		lightbox.classList.add('open');
	}

    // Movies section removed

	// Love note + reasons
	const loveNote = document.getElementById('loveNote');
	if(loveNote){
		const text = (cfg.loveNote || '').trim();
		let i = 0;
		function type(){
			if(i <= text.length){
				loveNote.textContent = text.slice(0,i);
				i++;
				setTimeout(type, 22);
			}
		}
		if(text){ type(); }
	}
	const reasonsWrap = document.getElementById('reasons');
	if(reasonsWrap){
		(cfg.reasons || []).forEach(r => {
			const chip = document.createElement('span');
			chip.className = 'reason';
			chip.textContent = r;
			reasonsWrap.appendChild(chip);
		});
	}

	// Confetti + hearts
	const confettiBtn = document.getElementById('confettiBtn');
	const canvas = document.getElementById('confettiCanvas');
	let ctx = canvas ? canvas.getContext('2d') : null;
	let confettiPieces = [];
	function resize(){ if(canvas){ canvas.width = innerWidth; canvas.height = innerHeight; } }
	window.addEventListener('resize', resize); resize();
	function makePiece(){
		return {
			x: Math.random()*canvas.width,
			y: -10,
			s: 4+Math.random()*6,
			c: Math.random()>.5? '#ff5db1' : '#4dd0ff',
			vx: -1+Math.random()*2,
			vy: 2+Math.random()*3,
			r: Math.random()*Math.PI*2,
			vr: -0.1+Math.random()*0.2
		};
	}
	function burst(){
		for(let i=0;i<120;i++) confettiPieces.push(makePiece());
	}
	function tick(){
		if(!ctx) return;
		ctx.clearRect(0,0,canvas.width,canvas.height);
		confettiPieces.forEach(p=>{
			p.x+=p.vx; p.y+=p.vy; p.r+=p.vr; p.vy*=0.995;
			ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.r);
			ctx.fillStyle=p.c; ctx.fillRect(-p.s/2,-p.s/2,p.s,p.s);
			ctx.restore();
		});
		confettiPieces = confettiPieces.filter(p=> p.y < canvas.height+20);
		requestAnimationFrame(tick);
	}
	requestAnimationFrame(tick);
	if(confettiBtn){
		confettiBtn.addEventListener('click', () => {
			burst();
			document.body.classList.add('celebrated');
			setTimeout(()=>{
				const story = document.getElementById('story');
				if(story){ story.scrollIntoView({ behavior:'smooth' }); }
				const scroller = document.getElementById('storyScroller');
				if(scroller){ scroller.scrollTo({ top: 0, behavior: 'smooth' }); }
			}, 150);
		});
	}

	// Floating hearts
	const heartsWrap = document.getElementById('floating-hearts');
	function addHeart(){
		if(!heartsWrap) return;
		const h = document.createElement('div'); h.className = 'heart';
		h.style.left = (Math.random()*100)+'%';
		h.style.bottom = '-20px';
		h.style.animationDuration = (5 + Math.random()*4)+'s';
		h.style.opacity = (0.5 + Math.random()*0.5).toString();
		heartsWrap.appendChild(h);
		setTimeout(()=> h.remove(), 9000);
	}
	setInterval(addHeart, 800);

	// Fallback assets if user hasn't added yet
	if((cfg.gallery||[]).length===0 && galleryGrid){
		['https://images.unsplash.com/photo-1520975922284-9e0ce82779a0?q=80&w=1200&auto=format&fit=crop','https://images.unsplash.com/photo-1535254973040-607b474cb50d?q=80&w=1200&auto=format&fit=crop'].forEach(url=>{
			const el = document.createElement('div'); el.className='photo';
			const img = document.createElement('img'); img.src=url; el.appendChild(img); galleryGrid.appendChild(el);
		});
	}

	// Story slides from config.story (falls back to gallery), with image preloading and skip-on-error
	const storyScroller = document.getElementById('storyScroller');
	const storyItems = (cfg.story && cfg.story.length ? cfg.story : (cfg.gallery||[]).map((src, i) => ({
		image: src,
		title: `Memory #${i+1}`,
		text: 'A special moment we shared.'
	})));
	function createSlide(item){
		const slide = document.createElement('section');
		slide.className = 'slide';
		slide.innerHTML = `
			<div class="slide__image"><img src="${item.image}" alt="Memory image"></div>
			<div class="slide__caption">
				<div class="title">${item.title || ''}</div>
				<div class="text">${item.text || ''}</div>
			</div>
		`;
		return slide;
	}
	function preload(src){
		return new Promise(resolve=>{
			const img = new Image();
			img.onload = () => resolve(true);
			img.onerror = () => resolve(false);
			img.src = src;
		});
	}
	async function buildStory(){
		if(!storyScroller) return;
		for(const item of storyItems){
			// eslint-disable-next-line no-await-in-loop
			const ok = await preload(item.image);
			if(!ok) continue;
			storyScroller.appendChild(createSlide(item));
		}
		// If nothing loaded, show a friendly fallback
		if(storyScroller.children.length === 0){
			const fallback = document.createElement('div');
			fallback.style.height = '60vh';
			fallback.style.display = 'grid';
			fallback.style.placeItems = 'center';
			fallback.textContent = 'Add photos to your story in config.js';
			storyScroller.appendChild(fallback);
		}
		const spacer = document.createElement('div');
		spacer.style.height = '40vh';
		storyScroller.appendChild(spacer);
	}
	buildStory();

	// Scroll handoff: when at ends of story scroller, pass scroll to page
	if(storyScroller){
		const scrollToId = (id) => {
			const el = document.getElementById(id);
			if(!el) return;
			if(id === 'home'){
				document.body.classList.remove('celebrated');
			}
			el.scrollIntoView({ behavior:'smooth' });
		};
		storyScroller.addEventListener('wheel', (e) => {
			const atTop = storyScroller.scrollTop <= 0;
			const atBottom = storyScroller.scrollTop + storyScroller.clientHeight >= storyScroller.scrollHeight - 1;
			if(atBottom && e.deltaY > 0){ e.preventDefault(); scrollToId('year'); }
			if(atTop && e.deltaY < 0){ e.preventDefault(); scrollToId('home'); }
		}, { passive: false });
		let touchStartY = 0;
		storyScroller.addEventListener('touchstart', (e) => { touchStartY = (e.changedTouches[0] || e.touches[0]).clientY; }, { passive: true });
		storyScroller.addEventListener('touchmove', (e) => {
			const currentY = (e.changedTouches[0] || e.touches[0]).clientY;
			const delta = touchStartY - currentY; // >0 user swipes up (scroll down)
			const atTop = storyScroller.scrollTop <= 0;
			const atBottom = storyScroller.scrollTop + storyScroller.clientHeight >= storyScroller.scrollHeight - 1;
			if(atBottom && delta > 6){ e.preventDefault(); scrollToId('year'); }
			if(atTop && delta < -6){ e.preventDefault(); scrollToId('home'); }
		}, { passive: false });
	}

	// If hero becomes visible again, restore it fully
	const homeSection = document.getElementById('home');
	if(homeSection && 'IntersectionObserver' in window){
		const io = new IntersectionObserver((entries) => {
			const entry = entries[0];
			if(entry && entry.isIntersecting){
				document.body.classList.remove('celebrated');
			}
		}, { threshold: 0.6 });
		io.observe(homeSection);
	}

	// Continue button: scroll to Year section when at bottom
	const continueBtn = document.getElementById('storyContinue');
	if(continueBtn){
		continueBtn.addEventListener('click', () => {
			const year = document.getElementById('year');
			if(year) year.scrollIntoView({ behavior:'smooth' });
		});
	}

	// Background audio: try unmuted autoplay; if blocked, fall back to muted and unmute on first interaction
	const audioEl = document.getElementById('bgAudio');
	const audioBtn = document.getElementById('audioToggle');
	if(audioEl && audioBtn && cfg.backgroundAudio && cfg.backgroundAudio.url){
		audioEl.src = cfg.backgroundAudio.url;
		audioEl.volume = (cfg.backgroundAudio.volume ?? 0.5);
		audioBtn.style.display = 'inline-flex';
		const attemptPlay = async () => {
			try{
				audioEl.muted = false;
				await audioEl.play();
				audioBtn.setAttribute('aria-pressed','true');
			}catch(e){
				audioEl.muted = true;
				try{ await audioEl.play(); }catch(_){ /* give up silently */ }
				// unmute on first interaction
				const unmute = () => {
					audioEl.muted = false;
					audioEl.play().catch(()=>{});
					window.removeEventListener('click', unmute);
					window.removeEventListener('touchstart', unmute);
				};
				window.addEventListener('click', unmute, { once: true });
				window.addEventListener('touchstart', unmute, { once: true });
			}
		};
		attemptPlay();

		audioBtn.addEventListener('click', () => {
			const pressed = audioBtn.getAttribute('aria-pressed') === 'true';
			if(pressed){
				audioEl.pause();
				audioBtn.setAttribute('aria-pressed','false');
			}else{
				audioEl.muted = false;
				audioEl.play().catch(()=>{});
				audioBtn.setAttribute('aria-pressed','true');
			}
		});
	}
})();


