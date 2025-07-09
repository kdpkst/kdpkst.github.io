document.addEventListener('DOMContentLoaded', function () {
  const RADAR_RADIUS = 110;
  const POINT_RADIUS = 8; // smaller blue dot
  const LABEL_FONT_SIZE = 14;
  const LABEL_PADDING = 6;
  const CENTER = 120;

  function getLabelBBox(text, fontSize) {
    // Estimate label width by character count
    return {
      width: text.length * fontSize * 0.6 + 8,
      height: fontSize + 4
    };
  }

  function isOverlap(a, b) {
    // a, b: {x, y, w, h}
    return !(
      a.x + a.w / 2 < b.x - b.w / 2 ||
      a.x - a.w / 2 > b.x + b.w / 2 ||
      a.y + a.h / 2 < b.y - b.h / 2 ||
      a.y - a.h / 2 > b.y + b.h / 2
    );
  }

  document.querySelectorAll('.radar-svg').forEach(radar => {
    const points = Array.from(radar.querySelectorAll('.radar-skill-point'));
    const placed = [];
    points.forEach((pt, i) => {
      const label = pt.querySelector('text');
      const skill = label.textContent;
      let fontSize = LABEL_FONT_SIZE;
      let bbox = getLabelBBox(skill, fontSize);
      let tries = 0, maxTries = 120;
      let angle, radius, x, y, labelX, labelY, collision;
      do {
        angle = Math.random() * 2 * Math.PI;
        // Place points between 30 and (RADAR_RADIUS - label width/2)
        const maxR = RADAR_RADIUS - Math.max(bbox.width, bbox.height) / 2 - POINT_RADIUS - LABEL_PADDING;
        radius = 30 + Math.random() * (maxR - 30);
        x = CENTER + radius * Math.cos(angle);
        y = CENTER + radius * Math.sin(angle);
        labelX = x;
        labelY = y + fontSize / 2 - 2;
        // Bounding box for this label+circle
        const thisBox = {
          x: labelX,
          y: labelY - fontSize / 2,
          w: bbox.width,
          h: bbox.height
        };
        collision = placed.some(p => isOverlap(thisBox, p));
        tries++;
        if (collision && tries > maxTries / 2 && fontSize > 10) {
          fontSize -= 1;
          bbox = getLabelBBox(skill, fontSize);
        }
      } while (collision && tries < maxTries);
      // Place the point
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