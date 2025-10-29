// Interactive boxes: only one open at a time. Smooth animation, color & size controls, keyboard accessible.

document.addEventListener('DOMContentLoaded', () => {
  const boxes = Array.from(document.querySelectorAll('.box'));

  function closeAll(except = null) {
    boxes.forEach(b => {
      if (b === except) return;
      b.setAttribute('aria-expanded', 'false');
      const panel = b.querySelector('.panel');
      if (panel) panel.setAttribute('aria-hidden', 'true');
      b.classList.remove('open');
      b.style.maxWidth = '';
    });
  }

  function openBox(box) {
    closeAll(box);
    const panel = box.querySelector('.panel');
    box.setAttribute('aria-expanded', 'true');
    if (panel) panel.setAttribute('aria-hidden', 'false');
    box.classList.add('open');
    box.style.maxWidth = '740px';
  }

  // Click & keyboard handlers
  boxes.forEach(box => {
    box.addEventListener('click', (e) => {
      const isOpen = box.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        box.setAttribute('aria-expanded', 'false');
        const panel = box.querySelector('.panel');
        if (panel) panel.setAttribute('aria-hidden', 'true');
        box.classList.remove('open');
      } else {
        openBox(box);
      }
    });

    // keyboard: Enter or Space toggles; Arrow keys navigate
    box.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        box.click();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const idx = boxes.indexOf(box);
        const next = boxes[idx+1] || boxes[0];
        next.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const idx = boxes.indexOf(box);
        const prev = boxes[idx-1] || boxes[boxes.length-1];
        prev.focus();
      }
    });

    // stop propagation for clicks inside options so clicking controls doesn't toggle box
    const controls = box.querySelector('.controls');
    if (controls) {
      controls.addEventListener('click', (ev) => ev.stopPropagation());
    }

    // Color buttons
    const colorButtons = box.querySelectorAll('.color');
    colorButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const color = btn.getAttribute('data-color');
        const preview = box.querySelector('.preview');
        if (preview) {
          preview.style.background = `linear-gradient(180deg, ${hexToRgba(color,0.12)}, ${hexToRgba(color,0.06)})`;
          preview.style.color = getContrastText(color);
          preview.textContent = 'Preview — ' + color.toUpperCase();
        }
        // also change the top header accent slightly
        box.style.borderColor = hexToRgba(color, 0.14);
      });
    });

    // Size buttons
    const sizeButtons = box.querySelectorAll('.sizes button');
    sizeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const size = btn.getAttribute('data-size');
        // update active state
        sizeButtons.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

        const preview = box.querySelector('.preview');
        if (preview) {
          if (size === 'small') {
            preview.style.height = '70px';
          } else if (size === 'medium') {
            preview.style.height = '110px';
          } else {
            preview.style.height = '150px';
          }
        }
      });
    });
  });

  // Utility: convert hex to rgba
  function hexToRgba(hex, alpha=1){
    const h = hex.replace('#','');
    const bigint = parseInt(h,16);
    const r = (bigint>>16)&255;
    const g = (bigint>>8)&255;
    const b = bigint&255;
    return `rgba(${r},${g},${b},${alpha})`;
  }

  // Utility: determine if text should be light/dark based on color luminance
  function getContrastText(hex){
    const h = hex.replace('#','');
    const bigint = parseInt(h,16);
    const r = (bigint>>16)&255;
    const g = (bigint>>8)&255;
    const b = bigint&255;
    const L = 0.2126*(r/255) + 0.7152*(g/255) + 0.0722*(b/255);
    return L > 0.6 ? '#0f172a' : '#ffffff';
  }

  // Initially open the middle box like in many demos
  const defaultBox = document.getElementById('box2');
  if (defaultBox) openBox(defaultBox);
});
