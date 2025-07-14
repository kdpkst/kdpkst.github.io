document.addEventListener('DOMContentLoaded', function () {
  // === CONSTANTS ===
  // SVG and radar geometry
  const RADAR_RADIUS = 140; // matches r=140 in about.html
  const CENTER = 150; // matches cx=150, cy=150 in about.html
  // Skill point appearance
  const POINT_RADIUS = 8;
  // Label appearance
  const LABEL_FONT_SIZE = 10;
  const LABEL_FONT_SIZE_MIN = 7;
  const LABEL_FONT_SIZE_STEP = 1;
  const LABEL_Y_OFFSET = 5;
  // Label bounding box estimation
  const LABEL_WIDTH_FACTOR = 0.6;
  const LABEL_WIDTH_PADDING = 14;
  const LABEL_HEIGHT_PADDING = 8;
  // Placement algorithm
  const LABEL_PADDING = 12;
  const BASE_MIN_DIST = 60;
  const MIN_MIN_DIST = 45;
  const MIN_RADIUS = 15;
  const MAX_ATTEMPTS = 100;
  const MIN_DIST_STEP = 4;
  const MIN_DIST_ATTEMPT_STEP = 20;

  function getLabelBBox(text, fontSize) {
    return {
      width: text.length * fontSize * LABEL_WIDTH_FACTOR + LABEL_WIDTH_PADDING,
      height: fontSize + LABEL_HEIGHT_PADDING
    };
  }

  function isOverlap(a, b) {
    return !(
      a.x + a.w / 2 < b.x - b.w / 2 ||
      a.x - a.w / 2 > b.x + b.w / 2 ||
      a.y + a.h / 2 < b.y - b.h / 2 ||
      a.y - a.h / 2 > b.y + b.h / 2
    );
  }

  function isInsideCircle(x, y, r) {
    const dx = x - CENTER;
    const dy = y - CENTER;
    return Math.sqrt(dx * dx + dy * dy) + r < RADAR_RADIUS - LABEL_PADDING;
  }

  document.querySelectorAll('.radar-svg').forEach(radar => {
    const points = Array.from(radar.querySelectorAll('.radar-skill-point'));
    const placed = [];
    points.forEach((pt, i) => {
      const label = pt.querySelector('text');
      const skill = label.textContent;
      let fontSize = LABEL_FONT_SIZE;
      let bbox = getLabelBBox(skill, fontSize);
      let found = false;
      let attempt = 0;
      let minDist = BASE_MIN_DIST;
      let x, y, labelX, labelY;
      while (!found && attempt < MAX_ATTEMPTS) {
        const angle = Math.random() * 2 * Math.PI;
        const maxR = RADAR_RADIUS - Math.max(bbox.width, bbox.height) / 2 - POINT_RADIUS - LABEL_PADDING;
        const minR = MIN_RADIUS;
        const radius = minR + Math.random() * (maxR - minR);
        x = CENTER + radius * Math.cos(angle);
        y = CENTER + radius * Math.sin(angle);
        labelX = x;
        labelY = y + fontSize / 2 - LABEL_Y_OFFSET;
        const thisBox = {
          x: labelX,
          y: labelY - fontSize / 2,
          w: bbox.width,
          h: bbox.height
        };
        let overlap = placed.some(p => isOverlap(thisBox, p));
        let minDistOk = placed.every(p => {
          const dx = labelX - p.x;
          const dy = labelY - (p.y + p.h / 2);
          return Math.sqrt(dx * dx + dy * dy) > minDist;
        });
        let inside = isInsideCircle(labelX, labelY - fontSize / 2, Math.max(bbox.width, bbox.height) / 2);
        if (!overlap && minDistOk && inside) {
          found = true;
        } else {
          attempt++;
          // Gradually reduce minDist if too crowded
          if (attempt % MIN_DIST_ATTEMPT_STEP === 0 && minDist > MIN_MIN_DIST) {
            minDist -= MIN_DIST_STEP;
          }
          if (attempt > MAX_ATTEMPTS / 2 && fontSize > LABEL_FONT_SIZE_MIN) {
            fontSize -= LABEL_FONT_SIZE_STEP;
            bbox = getLabelBBox(skill, fontSize);
          }
        }
      }
      pt.querySelector('circle').setAttribute('cx', x);
      pt.querySelector('circle').setAttribute('cy', y);
      pt.querySelector('circle').setAttribute('r', POINT_RADIUS);
      label.setAttribute('x', labelX);
      label.setAttribute('y', labelY);
      label.setAttribute('font-size', fontSize);
      placed.push({
        x: labelX,
        y: labelY - fontSize / 2,
        w: bbox.width,
        h: bbox.height
      });
    });
  });
});