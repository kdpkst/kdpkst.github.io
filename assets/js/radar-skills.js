document.addEventListener('DOMContentLoaded', function () {
  // Configuration object - all radar-related constants in one place
  const RADAR_CONFIG = {
    // SVG dimensions and positioning
    svg: {
      viewBoxSize: 300,
      center: 150,
      radius: 140
    },
    
    // Skill point styling
    skillPoint: {
      radius: 6,
      fillColor: '#00ffe7',
      opacity: 0.8
    },
    
    // Label styling and positioning
    label: {
      baseFontSize: 12,
      minFontSize: 8,
      padding: 8,
      // Font width estimation factor (characters * fontSize * this factor)
      widthFactor: 0.6,
      // Additional padding for label width calculation
      widthPadding: 6,
      // Additional padding for label height calculation
      heightPadding: 3,
      // Vertical offset adjustment for label positioning
      verticalOffset: 2
    },
    
    // Point placement algorithm settings
    placement: {
      // Initial minimum distance between points/labels
      baseMinDistance: 60,
      // Minimum allowed distance if crowded
      minMinDistance: 45,
      // Maximum attempts to place a point
      maxAttempts: 80,
      // Distance reduction step when crowded
      distanceReductionStep: 4,
      // Attempts before reducing distance
      attemptsBeforeDistanceReduction: 20,
      // Attempts before reducing font size
      attemptsBeforeFontReduction: 40,
      // Minimum radius from center (inner boundary)
      minRadius: 0,
      // Font size reduction step
      fontSizeReductionStep: 1
    }
  };

  /**
   * Calculate the bounding box dimensions for a text label
   * @param {string} text - The text content
   * @param {number} fontSize - The font size
   * @returns {Object} - Object with width and height properties
   */
  function getLabelBBox(text, fontSize) {
    return {
      width: text.length * fontSize * RADAR_CONFIG.label.widthFactor + RADAR_CONFIG.label.widthPadding,
      height: fontSize + RADAR_CONFIG.label.heightPadding
    };
  }

  /**
   * Check if two bounding boxes overlap
   * @param {Object} a - First bounding box {x, y, w, h}
   * @param {Object} b - Second bounding box {x, y, w, h}
   * @returns {boolean} - True if boxes overlap
   */
  function isOverlap(a, b) {
    return !(
      a.x + a.w / 2 < b.x - b.w / 2 ||
      a.x - a.w / 2 > b.x + b.w / 2 ||
      a.y + a.h / 2 < b.y - b.h / 2 ||
      a.y - a.h / 2 > b.y + b.h / 2
    );
  }

  /**
   * Check if a point is inside the radar circle with padding
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {number} radius - Radius of the element to check
   * @returns {boolean} - True if point is inside the radar
   */
  function isInsideCircle(x, y, radius) {
    const dx = x - RADAR_CONFIG.svg.center;
    const dy = y - RADAR_CONFIG.svg.center;
    return Math.sqrt(dx * dx + dy * dy) + radius < RADAR_CONFIG.svg.radius - RADAR_CONFIG.label.padding;
  }

  /**
   * Calculate the maximum radius for point placement
   * @param {Object} bbox - Label bounding box
   * @returns {number} - Maximum radius from center
   */
  function getMaxRadius(bbox) {
    return RADAR_CONFIG.svg.radius - Math.max(bbox.width, bbox.height) / 2 - 
           RADAR_CONFIG.skillPoint.radius - RADAR_CONFIG.label.padding;
  }

  /**
   * Generate a random position within the radar bounds
   * @param {number} minRadius - Minimum radius from center
   * @param {number} maxRadius - Maximum radius from center
   * @returns {Object} - Object with x, y coordinates
   */
  function generateRandomPosition(minRadius, maxRadius) {
    const angle = Math.random() * 2 * Math.PI;
    const radius = minRadius + Math.random() * (maxRadius - minRadius);
    return {
      x: RADAR_CONFIG.svg.center + radius * Math.cos(angle),
      y: RADAR_CONFIG.svg.center + radius * Math.sin(angle)
    };
  }

  /**
   * Check if a position meets all placement criteria
   * @param {Object} position - Position object with x, y coordinates
   * @param {Object} bbox - Label bounding box
   * @param {Array} placed - Array of already placed elements
   * @param {number} minDist - Minimum distance requirement
   * @returns {boolean} - True if position is valid
   */
  function isValidPosition(position, bbox, placed, minDist) {
    const labelX = position.x;
    const labelY = position.y + RADAR_CONFIG.label.baseFontSize / 2 - RADAR_CONFIG.label.verticalOffset;
    
    const thisBox = {
      x: labelX,
      y: labelY - RADAR_CONFIG.label.baseFontSize / 2,
      w: bbox.width,
      h: bbox.height
    };

    // Check for overlap with existing elements
    const hasOverlap = placed.some(p => isOverlap(thisBox, p));
    if (hasOverlap) return false;

    // Check minimum distance requirement
    const meetsDistance = placed.every(p => {
      const dx = labelX - p.x;
      const dy = labelY - (p.y + p.h / 2);
      return Math.sqrt(dx * dx + dy * dy) > minDist;
    });
    if (!meetsDistance) return false;

    // Check if inside radar circle
    const isInside = isInsideCircle(labelX, labelY - RADAR_CONFIG.label.baseFontSize / 2, 
                                   Math.max(bbox.width, bbox.height) / 2);
    return isInside;
  }

  // Process each radar SVG
  document.querySelectorAll('.radar-svg').forEach(radar => {
    const points = Array.from(radar.querySelectorAll('.radar-skill-point'));
    const placed = [];
    
    points.forEach((pt, i) => {
      const label = pt.querySelector('text');
      const skill = label.textContent;
      let fontSize = RADAR_CONFIG.label.baseFontSize;
      let bbox = getLabelBBox(skill, fontSize);
      let found = false;
      let attempt = 0;
      let minDist = RADAR_CONFIG.placement.baseMinDistance;
      let x, y, labelX, labelY;

      while (!found && attempt < RADAR_CONFIG.placement.maxAttempts) {
        const maxR = getMaxRadius(bbox);
        const position = generateRandomPosition(RADAR_CONFIG.placement.minRadius, maxR);
        
        if (isValidPosition(position, bbox, placed, minDist)) {
          x = position.x;
          y = position.y;
          labelX = x;
          labelY = y + fontSize / 2 - RADAR_CONFIG.label.verticalOffset;
          found = true;
        } else {
          attempt++;
          
          // Gradually reduce minimum distance if too crowded
          if (attempt % RADAR_CONFIG.placement.attemptsBeforeDistanceReduction === 0 && 
              minDist > RADAR_CONFIG.placement.minMinDistance) {
            minDist -= RADAR_CONFIG.placement.distanceReductionStep;
          }
          
          // Reduce font size if still having trouble placing
          if (attempt > RADAR_CONFIG.placement.attemptsBeforeFontReduction && 
              fontSize > RADAR_CONFIG.label.minFontSize) {
            fontSize -= RADAR_CONFIG.placement.fontSizeReductionStep;
            bbox = getLabelBBox(skill, fontSize);
          }
        }
      }

      // Apply the found position to the DOM elements
      pt.querySelector('circle').setAttribute('cx', x);
      pt.querySelector('circle').setAttribute('cy', y);
      pt.querySelector('circle').setAttribute('r', RADAR_CONFIG.skillPoint.radius);
      label.setAttribute('x', labelX);
      label.setAttribute('y', labelY);
      label.setAttribute('font-size', fontSize);
      
      // Record the placed element for future overlap checks
      placed.push({
        x: labelX,
        y: labelY - fontSize / 2,
        w: bbox.width,
        h: bbox.height
      });
    });
  });
}); 