document.querySelectorAll('.work-page-imgs .half-img-container').forEach((container, i) => {
  const isOdd = (i + 1) % 2 !== 0;
  const halves = container.querySelectorAll(':scope > .half-img');
  if (halves.length !== 2) return;

  // Map settings: [desktop, tablet, mobile]
  const [firstConfig, secondConfig] = isOdd 
    ? [
        { d: 'span-6', t: 'span-t-3', m: 'span-m-3' },
        { d: 'span-4', t: 'span-t-2', m: 'span-m-2' }
      ]
    : [
        { d: 'span-4', t: 'span-t-2', m: 'span-m-2' },
        { d: 'span-6', t: 'span-t-3', m: 'span-m-3' }
      ];

  halves.forEach((el, idx) => {
    const config = idx === 0 ? firstConfig : secondConfig;

    // Remove legacy classes
    el.classList.remove('span-4', 'span-6', 'span-t-2', 'span-t-3', 'span-m-2', 'span-m-3');
    el.classList.add(config.d, config.t, config.m);

    const img = el.querySelector('img');
    if (img) {
      img.classList.remove('span-4', 'span-6', 'span-t-2', 'span-t-3', 'span-m-2', 'span-m-3');
      img.classList.add(config.d, config.t, config.m);
    }
  });
});