/**
 * Shared animation utilities for the magazine landing page.
 * Uses IntersectionObserver to trigger CSS class toggles on scroll.
 */

/** Svelte action: adds `in-view` class when element enters viewport */
export function inView(
	node: HTMLElement,
	options: { threshold?: number; rootMargin?: string; once?: boolean } = {}
) {
	const { threshold = 0.15, rootMargin = '0px', once = true } = options;

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					node.classList.add('in-view');
					if (once) observer.unobserve(node);
				} else if (!once) {
					node.classList.remove('in-view');
				}
			}
		},
		{ threshold, rootMargin }
	);

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
}

/** Svelte action: tracks scroll progress through an element (0-1) as a CSS variable */
export function scrollProgress(node: HTMLElement, varName = '--scroll-progress') {
	function update() {
		const rect = node.getBoundingClientRect();
		const windowH = window.innerHeight;
		const progress = Math.min(Math.max((windowH - rect.top) / (windowH + rect.height), 0), 1);
		node.style.setProperty(varName, String(progress));
	}

	update();
	window.addEventListener('scroll', update, { passive: true });
	window.addEventListener('resize', update, { passive: true });

	return {
		destroy() {
			window.removeEventListener('scroll', update);
			window.removeEventListener('resize', update);
		}
	};
}

/** Svelte action: animates a number counting up when element enters viewport */
export function countUp(
	node: HTMLElement,
	options: { target: number; duration?: number; suffix?: string } = { target: 0 }
) {
	const { target, duration = 1500, suffix = '' } = options;

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					const start = performance.now();
					function animate(now: number) {
						const elapsed = now - start;
						const progress = Math.min(elapsed / duration, 1);
						// Ease out cubic
						const eased = 1 - Math.pow(1 - progress, 3);
						const current = Math.round(eased * target);
						node.textContent = current + suffix;
						if (progress < 1) requestAnimationFrame(animate);
					}
					requestAnimationFrame(animate);
					observer.unobserve(node);
				}
			}
		},
		{ threshold: 0.5 }
	);

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
}

/** Svelte action: adds parallax translateY driven by scroll position */
export function parallax(node: HTMLElement, speed = 0.1) {
	function update() {
		const rect = node.getBoundingClientRect();
		const center = rect.top + rect.height / 2 - window.innerHeight / 2;
		node.style.transform = `translateY(${center * speed}px)`;
	}

	update();
	window.addEventListener('scroll', update, { passive: true });

	return {
		destroy() {
			window.removeEventListener('scroll', update);
		}
	};
}

/** Split text into individual character spans for stagger animation */
export function splitChars(text: string): { char: string; index: number }[] {
	return text.split('').map((char, index) => ({ char, index }));
}
