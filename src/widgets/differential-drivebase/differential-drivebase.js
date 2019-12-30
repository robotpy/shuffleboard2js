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
class DifferentialDrivebase extends LitElement {

  static get styles() {
    return css`
      
    `;
  }

  render() {
    return html`
      ${includeStyles()}
      <div class="diff-drive-container">

        <div class="speed">
            <table-axis ticks="5" vertical range="[-1, 1]"></table-axis>
            <div ref="bar" class="bar">
                <div class="foreground" style={getLeftForegroundStyle()}></div>
            </div>
        </div>
        <svg ref="svg" width="250" height="250">
            <g ref="forceVector"></g>
            <g ref="drivetrain" class="drivetrain"></g>
        </svg>

        <div class="speed">
            <table-axis ticks="5" vertical range="[-1, 1]"></table-axis>
            <div ref="bar" class="bar">
                <div class="foreground" style={getRightForegroundStyle()}></div>
            </div>
        </div>
      </div>
    `;
  }
}

customElements.define('differential-drivebase', DifferentialDrivebase);
