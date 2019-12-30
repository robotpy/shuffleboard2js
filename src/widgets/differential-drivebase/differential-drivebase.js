import { LitElement, html, css } from 'lit-element';
import { includeStyles } from '../../assets/js/render-utils';
import '../../assets/js/elements/components/table-axis';

/** 
 * Copyright (c) 2017-2018 FIRST
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of FIRST nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY FIRST AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY NONINFRINGEMENT AND FITNESS FOR A PARTICULAR 
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL FIRST OR CONTRIBUTORS BE LIABLE FOR 
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */


function map(x, minInput, maxInput, minOutput, maxOutput) {
  return (x - minInput) * (maxOutput - minOutput) / (maxInput - minInput) + minOutput;
}

function generateX(width) {
  const halfW = width / 2;
  const lineA = `
    <line 
      x1="${-halfW}"
      y1="${-halfW}"
      x2="${halfW}"
      y2="${halfW}"
    />
  `;

  const lineB = `
    <line 
      x1="${-halfW}"
      y1="${halfW}"
      x2="${halfW}"
      y2="${-halfW}"
    />
  `;

  return `<g class="x" transform="translate(125, 125)">${lineA} ${lineB}</g>`;
}

class DifferentialDrivebase extends LitElement {

  static get styles() {
    return css`
      .diff-drive-container {
          height: 100%;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
      }

      svg .x {
          stroke: rgb(50,50,255);
          stroke-width: 2;
      }

      svg .arrow line, svg .arrow path {
          stroke: rgb(50,50,255);
          stroke-width: 2;
          fill: none;
          /*transform: rotate(-90deg);*/
      }

      svg .arrow polygon {
          stroke: rgb(50,50,255);
          fill: rgb(50,50,255);
      }

      svg .drivetrain {
          fill: none;
          stroke: black;
      }

      .bar {
          position: relative;
          height: calc(100% - 30px);
          width: 20px;
          border-radius: 3px;
          margin: 15px 0;
          background: #DDD;
      }

      .speed {
          display: flex;
          height: 100%;
          flex-direction: row;
          align-items: center;
          margin-left: 30px;
      }

      table-axis {
          width: 10px;
          height: calc(100% - 30px);
      }

      .foreground {
          position: absolute;
          top: 0;
          width: 20px;
          background: lightblue;
          border-radius: 3px;
      }
    `;
  }

  constructor() {
    super();
    this.left = 0;
    this.right = 0;
  }

  drawMotionVector(left, right) {

    const rect = this.getBoundingClientRect();
    const FRAME_WIDTH = 150;  //rect.width;
    const FRAME_HEIGHT = 150; //rect.height;

    // Barely moving, or not moving at all. Curved arrows look weird at low radii, so show an X instead
    if (Math.abs(left) <= 0.05 && Math.abs(right) <= 0.05) {
      return generateX(25);
    }

    // Max radius is half of the narrowest dimension, minus padding to avoid clipping with the frame
    const maxRadius = Math.min(FRAME_WIDTH, FRAME_HEIGHT) / 2 - 8;
    const arrowheadSize = 8;
    if (Math.abs(left - right) <= 0.001) {
      // Moving more-or-less straight (or not moving at all)
      // Using a threshold instead of a simpler `if(left == right)` avoids edge cases where left and right are very
      // close, which can cause floating-point issues with extremely large radii (on the order of 1E15 pixels)
      // and extremely small arc lengths (on the order of 1E-15 degrees)
      let arrow = window.dashboard.CurvedArrow.createStraight(Math.abs(left * maxRadius), -Math.sign(left) * Math.PI / 2, 0, arrowheadSize);
      return `<g class="arrow" transform="translate(125, 125)">${arrow}</g>`;
    }
    // Moving in an arc

    const pi = Math.PI;
    const moment = (right - left) / 2;
    const avgSpeed = (left + right) / 2;
    const turnRadius = avgSpeed / moment;

    let arrow;

    if (Math.abs(turnRadius) >= 1) {
      // Motion is mostly forward/backward, and curving to a side

      const arcSign = -Math.sign(turnRadius);  // +1 if arc is to left of frame, -1 if arc is to the right
      const startAngle = (arcSign + 1) * pi / 2; // pi if arc is to the right, 0 if to the left
      let radius = Math.abs(turnRadius * maxRadius);
      arrow = window.dashboard.CurvedArrow.create(startAngle, radius, arcSign * avgSpeed * maxRadius, arcSign * radius, arrowheadSize);
    } 
    else {
      // Turning about a point inside the frame of the robot
      const turnSign = Math.sign(left - right); // positive for clockwise, negative for counter-clockwise
      if (turnRadius == 0) {
        // Special case, rotating about the center of the frame
        let radius = Math.max(left, right) * maxRadius; // left == -right, we just want the positive one
        let angle = turnSign * pi;
        let start = moment < 0 ? pi : 0;
        arrow = window.dashboard.CurvedArrow.createPolar(start, radius, angle, 0, arrowheadSize);
      } else {
        let dominant = turnRadius < 0 ? left : right;  // the dominant side that's driving the robot
        let secondary = turnRadius < 0 ? right : left; // the non-dominant side
        let radius = Math.abs(dominant) * maxRadius;   // make radius dependent on how fast the dominant side is
        let centerX = -turnRadius * radius;
        let angle = map(secondary / dominant, 0, -1, 0.5, pi);
        let start = turnRadius < 0 ? pi : 0;
        arrow = window.dashboard.CurvedArrow.createPolar(start, radius, turnSign * angle, centerX, arrowheadSize);
      }
    }
    return `<g class="arrow" transform="translate(125, 125)">${arrow}</g>`;
  }

  drawDrivetrain(width, height, wheelRadius) {

    const left = (250 - width) / 2;
    const top = (250 - height) / 2;
    const right = left + width;
    const bottom = top + height;
    
    const base = `
      <rect 
        width="${width}" 
        height="${height}" 
        x="${left}" 
        y="${top}" 
      />
    `;

    const tlWheel = `
      <rect 
        width="${30}" 
        height="${wheelRadius * 2}" 
        x="${left - 30}" 
        y="${top}" 
      />
    `;

    const trWheel = `
      <rect 
        width="${30}" 
        height="${wheelRadius * 2}" 
        x="${right}" 
        y="${top}" 
      />
    `;

    const blWheel = `
      <rect 
        width="${30}" 
        height="${wheelRadius * 2}" 
        x="${left - 30}" 
        y="${bottom - wheelRadius * 2}" 
      />
    `;

    const brWheel = `
      <rect 
        width="${30}" 
        height="${wheelRadius * 2}" 
        x="${right}" 
        y="${bottom - wheelRadius * 2}" 
      />
    `;

    return base + tlWheel + trWheel + blWheel + brWheel;
  }


  getLeftForegroundStyle() {
    return this.getForegroundStyle(this.left);
  }

  getRightForegroundStyle() {
    return this.getForegroundStyle(this.right);
  }

  getForegroundStyle(value) {
    const min = -1;
    const max = 1;
    const val = Math.clamp(value, min, max);

    if (max < 0) {
      return `
        height: ${Math.abs(val - max) / (max - min) * 100}%;
        top: 'auto';
        bottom: 0;
      `;
    }
    else if (min > 0) {
      return `
        height: ${Math.abs(val - min) / (max - min) * 100}%;
        top: 0;
        bottom: 'auto';
      `;
    }
    else if (val > 0) {
      return `
        height: ${Math.abs(val) / (max - min) * 100}%;
        top: ${Math.abs(min) / (max - min) * 100}%;
        bottom: 'auto';
      `;
    }
    else {
      return `
        height: ${Math.abs(val) / (max - min) * 100}%;
        top: 'auto';
        bottom: ${Math.abs(max) / (max - min) * 100}%;
      `;
    }
  }

  firstUpdated() {
    let drawing = this.drawMotionVector(0, 0);
    $(this.shadowRoot.getElementById('drivetrain')).html(this.drawDrivetrain(150, 200, 35));
    $(this.shadowRoot.getElementById('forceVector')).html(drawing);
  }

  updated() {
    this.left = this.table['Left Motor Speed'] || 0;
    this.right = this.table['Right Motor Speed'] || 0;
    let drawing = this.drawMotionVector(this.left, this.right);
    $(this.shadowRoot.getElementById('forceVector')).html(drawing);
  }

  resized() {
    let drawing = this.drawMotionVector(this.left, this.right);
    $(this.shadowRoot.getElementById('forceVector')).html(drawing);
    $(this.shadowRoot).find('table-axis').each(function() {
      this.requestUpdate();
    });
  }

  render() {
    return html`
      ${includeStyles()}
      <div class="diff-drive-container">

        <div class="speed">
            <table-axis ticks="5" vertical range="[-1, 1]"></table-axis>
            <div class="bar">
                <div class="foreground" style="${this.getLeftForegroundStyle()}"></div>
            </div>
        </div>
        <svg id="svg" width="250" height="250">
            <g id="forceVector"></g>
            <g id="drivetrain" class="drivetrain"></g>
        </svg>

        <div class="speed">
            <table-axis ticks="5" vertical range="[-1, 1]"></table-axis>
            <div class="bar">
                <div class="foreground" style="${this.getRightForegroundStyle()}"></div>
            </div>
        </div>
      </div>
    `;
  }
}

customElements.define('differential-drivebase', DifferentialDrivebase);
