// radar-skills.js

document.addEventListener('DOMContentLoaded', function () {
  // The radius of the radar (distance from center to edge of SVG circle, matches r=140 in about.html)
  const RADAR_RADIUS = 140;
  // The center coordinate of the radar SVG (matches cx=150, cy=150 in about.html)
  const CENTER = 150;
  // The radius of the blue skill point circle
  const POINT_RADIUS = 8;
  // The base font size for skill labels
  const LABEL_FONT_SIZE = 14;
  // Padding between labels/points to avoid overlap
  const LABEL_PADDING = 6;
  // The initial minimum distance between points/labels for Poisson Disk Sampling (higher = more dispersed)
  const BASE_MIN_DIST = 44;
  // The minimum allowed minDist if crowded
  const MIN_MIN_DIST = 22;
  // Maximum attempts to place a point
  const MAX_ATTEMPTS = 80;

  function getLabelBBox(text, fontSize) {
    return {
      width: text.length * fontSize * 0.6 + 8,
      height: fontSize + 4
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
        const minR = 30;
        const radius = minR + Math.random() * (maxR - minR);
        x = CENTER + radius * Math.cos(angle);
        y = CENTER + radius * Math.sin(angle);
        labelX = x;
        labelY = y + fontSize / 2 - 2;
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
          if (attempt % 20 === 0 && minDist > MIN_MIN_DIST) {
            minDist -= 4;
          }
          if (attempt > MAX_ATTEMPTS / 2 && fontSize > 10) {
            fontSize -= 1;
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