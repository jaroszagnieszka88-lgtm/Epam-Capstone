export function initProductTabs(): void {
	const tabsSections = Array.from(document.querySelectorAll<HTMLElement>('.tabs'));
	if (!tabsSections.length) return;

	tabsSections.forEach((tabs) => {
		const headers = Array.from(tabs.querySelectorAll<HTMLElement>('.tabs__headers__item'));
		const items = Array.from(tabs.querySelectorAll<HTMLElement>('.tabs__items > div'));

		if (!headers.length || !items.length) return;

		let activeIndex = headers.findIndex(h => h.querySelector('h2')?.classList.contains('item--active'));
		if (activeIndex === -1) activeIndex = 0;

		headers.forEach((h, i) => {
			const h2 = h.querySelector('h2');
			if (!h2) return;
			if (i === activeIndex) h2.classList.add('item--active');
			else h2.classList.remove('item--active');
		});

		items.forEach((it, i) => {
			if (i === activeIndex) it.removeAttribute('hidden');
			else it.setAttribute('hidden', 'true');
		});

		headers.forEach((h, idx) => {
			h.addEventListener('click', () => {
				headers.forEach(hh => hh.querySelector('h2')?.classList.remove('item--active'));
				h.querySelector('h2')?.classList.add('item--active');

				items.forEach((it, i) => {
					if (i === idx) it.removeAttribute('hidden');
					else it.setAttribute('hidden', 'true');
				});
			});
		});
	});
}

