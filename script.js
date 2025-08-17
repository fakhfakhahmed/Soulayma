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
	
	// Expose globally for story slideshow
	window.confettiPieces = confettiPieces;
	window.makePiece = makePiece;
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

	// Animated Story Slideshow
	const slideContainer = document.getElementById('slideContainer');
	const nextBtn = document.getElementById('nextBtn');
	const continueBtn = document.getElementById('continueBtn');
	const progressFill = document.getElementById('progressFill');
	const slideCounter = document.getElementById('slideCounter');
	
	const storyItems = (cfg.story && cfg.story.length ? cfg.story : (cfg.gallery||[]).map((src, i) => ({
		image: src,
		title: `Memory #${i+1}`,
		text: 'A special moment we shared.'
	})));

	let currentSlide = 0;
	let slides = [];
	let isAnimating = false;

	function createStorySlide(item, index){
		const slide = document.createElement('div');
		slide.className = `story-slide ${index === 0 ? 'active' : 'next'}`;
		
		// Create background div with fallback color
		const bg = document.createElement('div');
		bg.className = 'story-slide__bg';
		bg.style.backgroundImage = `url('${item.image}')`;
		bg.style.backgroundColor = 'rgba(255, 93, 177, 0.3)'; // Fallback pink background
		
		const content = document.createElement('div');
		content.className = 'story-slide__content';
		content.innerHTML = `
			<h3 class="story-slide__title">${item.title || 'Our Memory'}</h3>
			<p class="story-slide__text">${item.text || 'A special moment we shared'}</p>
		`;
		
		slide.appendChild(bg);
		slide.appendChild(content);
		
		// Debug: log slide creation
		console.log('Created slide:', item.title, slide);
		
		return slide;
	}

	function updateUI(){
		if(!progressFill || !slideCounter) return;
		const progress = ((currentSlide + 1) / storyItems.length) * 100;
		progressFill.style.width = `${progress}%`;
		slideCounter.textContent = `${currentSlide + 1} / ${storyItems.length}`;
		
		// Show "Tap to see next" only on first slide
		// Show down arrow button only on last slide
		if(currentSlide === 0){
			nextBtn.style.display = 'flex';
			continueBtn.style.display = 'none';
		} else if(currentSlide >= storyItems.length - 1){
			nextBtn.style.display = 'none';
			continueBtn.style.display = 'flex';
		} else {
			nextBtn.style.display = 'none';
			continueBtn.style.display = 'none';
		}
	}

	function nextSlide(){
		if(isAnimating || currentSlide >= storyItems.length - 1) return;
		isAnimating = true;
		
		// Hide current slide
		slides[currentSlide].classList.remove('active');
		slides[currentSlide].classList.add('prev');
		
		// Show next slide
		currentSlide++;
		slides[currentSlide].classList.remove('next', 'prev');
		slides[currentSlide].classList.add('active');
		
		updateUI();
		
		// Reset animation flag
		setTimeout(() => { isAnimating = false; }, 600);
		
		// Add a little confetti effect
		if(window.confettiPieces && window.makePiece){
			for(let i = 0; i < 20; i++){
				window.confettiPieces.push(window.makePiece());
			}
		}
	}

	function prevSlide(){
		if(isAnimating || currentSlide <= 0) return;
		isAnimating = true;
		
		// Hide current slide
		slides[currentSlide].classList.remove('active');
		slides[currentSlide].classList.add('next');
		
		// Show previous slide
		currentSlide--;
		slides[currentSlide].classList.remove('prev', 'next');
		slides[currentSlide].classList.add('active');
		
		updateUI();
		
		// Reset animation flag
		setTimeout(() => { isAnimating = false; }, 600);
	}

	function preloadImage(src){
		return new Promise(resolve => {
			const img = new Image();
			img.onload = () => resolve(true);
			img.onerror = () => resolve(false);
			img.src = src;
		});
	}

	async function buildStorySlideshow(){
		console.log('Building slideshow...', slideContainer, storyItems);
		if(!slideContainer) {
			console.log('No slideContainer found!');
			return;
		}
		
		if(storyItems.length === 0) {
			console.log('No story items configured');
			slideContainer.innerHTML = `
				<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#fff;text-align:center;padding:40px;">
					<div>
						<h3>No story configured</h3>
						<p>Add your story items to config.js</p>
					</div>
				</div>
			`;
			return;
		}
		
		// Create slides without strict preloading (more permissive)
		let successfulSlides = 0;
		for(let i = 0; i < storyItems.length; i++){
			const item = storyItems[i];
			console.log('Creating slide for:', item);
			
			// Create slide immediately, let browser handle image loading
			const slide = createStorySlide(item, slides.length);
			slides.push(slide);
			slideContainer.appendChild(slide);
			successfulSlides++;
			console.log('Added slide:', successfulSlides);
		}
		
		// Always show something, even if images fail to load
		if(successfulSlides === 0){
			console.log('No slides created, showing fallback');
			slideContainer.innerHTML = `
				<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#fff;text-align:center;padding:40px;">
					<div>
						<h3>Story loading issue</h3>
						<p>Check image paths in config.js and assets/images/gallery/</p>
					</div>
				</div>
			`;
			return;
		}
		
		console.log('Successfully built', successfulSlides, 'slides');
		updateUI();
		
		// Set up event listeners
		if(nextBtn){
			nextBtn.addEventListener('click', nextSlide);
		}
		
		if(continueBtn){
			continueBtn.addEventListener('click', () => {
				// Exit celebrated mode first
				document.body.classList.remove('celebrated');
				
				// Wait a bit for the transition, then scroll to timeline
				setTimeout(() => {
					const year = document.getElementById('year');
					if(year) year.scrollIntoView({ behavior:'smooth' });
				}, 300);
			});
		}
		
		// Instagram-style tap areas: left side = previous, right side = next
		slideContainer.addEventListener('click', (e) => {
			if(!e.target.closest('.story-ui')){
				const rect = slideContainer.getBoundingClientRect();
				const clickX = e.clientX - rect.left;
				const containerWidth = rect.width;
				
				// Left third = go back, right two-thirds = go forward
				if(clickX < containerWidth / 3){
					// Left tap - go back
					if(currentSlide > 0){
						prevSlide();
					}
				} else {
					// Right tap - go forward
					if(currentSlide < storyItems.length - 1){
						nextSlide();
					}
				}
			}
		});
		
		// Touch support for mobile swipe
		let touchStartX = 0;
		let touchStartY = 0;
		slideContainer.addEventListener('touchstart', (e) => {
			touchStartX = e.touches[0].clientX;
			touchStartY = e.touches[0].clientY;
		}, { passive: true });
		
		slideContainer.addEventListener('touchend', (e) => {
			if(!touchStartX || !touchStartY) return;
			const touchEndX = e.changedTouches[0].clientX;
			const touchEndY = e.changedTouches[0].clientY;
			const deltaX = touchStartX - touchEndX;
			const deltaY = touchStartY - touchEndY;
			
			// Only respond to horizontal swipes
			if(Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50 && !e.target.closest('.story-ui')){
				if(deltaX > 0 && currentSlide < storyItems.length - 1){ // Swipe left = next
					nextSlide();
				} else if(deltaX < 0 && currentSlide > 0){ // Swipe right = previous
					prevSlide();
				}
			}
			
			touchStartX = 0;
			touchStartY = 0;
		}, { passive: true });
		
		// Keyboard support
		document.addEventListener('keydown', (e) => {
			if(e.key === 'ArrowRight' || e.key === ' '){
				if(currentSlide < storyItems.length - 1){
					e.preventDefault();
					nextSlide();
				}
			} else if(e.key === 'ArrowLeft'){
				if(currentSlide > 0){
					e.preventDefault();
					prevSlide();
				}
			}
		});
	}

	buildStorySlideshow();

	// Taylor Swift Quotes Carousel
	function initQuotesCarousel(){
		const carousel = document.getElementById('quotesCarousel');
		const dotsContainer = document.getElementById('quoteDots');
		if(!carousel || !dotsContainer) return;

		const slides = carousel.querySelectorAll('.quote-slide');
		let currentQuote = 0;

		// Create dots
		slides.forEach((_, index) => {
			const dot = document.createElement('div');
			dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
			dot.addEventListener('click', () => goToQuote(index));
			dotsContainer.appendChild(dot);
		});

		function goToQuote(index){
			slides[currentQuote].classList.remove('active');
			dotsContainer.children[currentQuote].classList.remove('active');
			
			currentQuote = index;
			slides[currentQuote].classList.add('active');
			dotsContainer.children[currentQuote].classList.add('active');
		}

		// Auto-rotate quotes
		setInterval(() => {
			const nextQuote = (currentQuote + 1) % slides.length;
			goToQuote(nextQuote);
		}, 4000);
	}

	// Enhanced K-pop floating elements
	function createKpopElements(){
		const heartsContainer = document.getElementById('floating-hearts');
		if(!heartsContainer) return;

		function createKpopHeart(){
			const heart = document.createElement('div');
			heart.className = 'heart kpop-heart';
			heart.style.left = Math.random() * 100 + 'vw';
			heart.style.animationDelay = Math.random() * 2 + 's';
			heartsContainer.appendChild(heart);

			setTimeout(() => heart.remove(), 8000);
		}

		function createSparkle(){
			const sparkle = document.createElement('div');
			sparkle.className = 'sparkle';
			sparkle.textContent = ['✨', '💜', '⭐', '💖'][Math.floor(Math.random() * 4)];
			sparkle.style.left = Math.random() * 100 + 'vw';
			sparkle.style.animationDelay = Math.random() * 2 + 's';
			heartsContainer.appendChild(sparkle);

			setTimeout(() => sparkle.remove(), 5000);
		}

		function createStitchElement(){
			const stitch = document.createElement('div');
			stitch.className = 'stitch-element';
			stitch.textContent = '💙';
			stitch.style.left = Math.random() * 100 + 'vw';
			stitch.style.top = Math.random() * 80 + 'vh';
			heartsContainer.appendChild(stitch);

			setTimeout(() => stitch.remove(), 10000);
		}

		// Create elements at intervals
		setInterval(createKpopHeart, 3000);
		setInterval(createSparkle, 2000);
		setInterval(createStitchElement, 8000);
	}



	// Initialize new features
	initQuotesCarousel();
	createKpopElements();

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

	// Old continue button code removed - now handled in slideshow

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


