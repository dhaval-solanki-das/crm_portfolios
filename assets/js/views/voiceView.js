/**
 * NexaOps AI - Voice AI Assistant View
 */

import { voiceEngine, PRESET_VOICE_SCENARIOS } from '../services/voiceEngine.js';

export class VoiceView {
  static render(container, onNavigate) {
    let currentTranscript = "";
    let activeInterpretation = null;

    container.innerHTML = `
      <div class="voice-studio-container">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 8px;">
          <h2 style="font-size: 24px; font-weight: 800; color: var(--color-navy); letter-spacing: -0.4px;">
            Voice AI Operations Studio
          </h2>
          <p style="font-size: 14px; color: var(--color-text-secondary); max-width: 600px; margin: 4px auto 0 auto;">
            Speak natural business instructions to draft purchase orders, audit inventory safety points, and track freight containers hands-free.
          </p>
        </div>

        <!-- Voice Stage Card -->
        <div class="voice-stage-card" id="voice-stage">
          <div class="voice-mic-outer">
            <button class="voice-mic-btn" id="voice-mic-trigger" title="Click to speak">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
              </svg>
            </button>
            <div class="voice-pulse-ring"></div>
          </div>

          <!-- Animated Audio Waveform -->
          <div class="audio-waveform-wrap" id="audio-waveform">
            <div class="waveform-bar"></div>
            <div class="waveform-bar"></div>
            <div class="waveform-bar"></div>
            <div class="waveform-bar"></div>
            <div class="waveform-bar"></div>
            <div class="waveform-bar"></div>
            <div class="waveform-bar"></div>
            <div class="waveform-bar"></div>
            <div class="waveform-bar"></div>
            <div class="waveform-bar"></div>
          </div>

          <div class="voice-status-text" id="voice-status-text">
            Click the microphone or select a preset scenario below
          </div>
        </div>

        <!-- Live Transcript & Interpreted Action -->
        <div class="voice-review-card" id="voice-review-card" style="display: none;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <h4 style="font-size: 14px; font-weight: 700; color: var(--color-navy);">Recognized Speech Transcript</h4>
            <span class="badge badge-info">Speech-to-Text Processed</span>
          </div>

          <div class="transcript-box" id="voice-transcript-text" contenteditable="true">
            <!-- Transcript text -->
          </div>
          <span style="font-size: 11px; color: var(--color-text-muted);">
            💡 You can click the text above to edit any word before confirmation.
          </span>

          <!-- Interpretation Action Card -->
          <div id="voice-action-preview-card" style="margin-top: 10px;">
            <!-- Rendered after intent extraction -->
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 8px;">
            <button class="btn btn-secondary" id="voice-cancel-btn">Discard</button>
            <button class="btn btn-primary" id="voice-confirm-action-btn">
              Confirm & Execute Action →
            </button>
          </div>
        </div>

        <!-- Action Result Banner -->
        <div id="voice-result-banner" style="display: none;"></div>

        <!-- Preset Voice Scenarios -->
        <div>
          <h4 style="font-size: 13px; font-weight: 700; color: var(--color-navy); margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
            Or Test with 1-Click Simulated Voice Prompts:
          </h4>
          <div class="preset-scenarios-grid">
            ${PRESET_VOICE_SCENARIOS.map(s => `
              <div class="preset-scenario-card" data-transcript="${s.transcript}">
                <div class="preset-scenario-title">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                  ${s.label}
                </div>
                <div class="preset-scenario-desc">"${s.transcript}"</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    const micBtn = container.querySelector('#voice-mic-trigger');
    const stage = container.querySelector('#voice-stage');
    const statusText = container.querySelector('#voice-status-text');
    const reviewCard = container.querySelector('#voice-review-card');
    const transcriptEl = container.querySelector('#voice-transcript-text');
    const actionPreviewCard = container.querySelector('#voice-action-preview-card');
    const confirmBtn = container.querySelector('#voice-confirm-action-btn');
    const cancelBtn = container.querySelector('#voice-cancel-btn');
    const resultBanner = container.querySelector('#voice-result-banner');

    const handleNewTranscript = (text) => {
      currentTranscript = text;
      transcriptEl.textContent = text;
      reviewCard.style.display = 'flex';
      resultBanner.style.display = 'none';

      // Interpret intent
      activeInterpretation = voiceEngine.interpretTranscript(text);

      if (activeInterpretation.actionType === 'CREATE_PURCHASE_ORDER') {
        const item = activeInterpretation;
        actionPreviewCard.innerHTML = `
          <div class="chat-action-card">
            <div class="action-card-header">
              <span class="action-card-title">${item.title}</span>
              <span class="badge badge-warning">${item.status}</span>
            </div>
            <div class="action-grid">
              <div><span class="action-field-label">Vendor:</span> <span class="action-field-value">${item.vendorName}</span></div>
              <div><span class="action-field-label">Warehouse:</span> <span class="action-field-value">${item.warehouseName}</span></div>
              <div><span class="action-field-label">Product SKU:</span> <span class="action-field-value">${item.sku}</span></div>
              <div><span class="action-field-label">Quantity:</span> <span class="action-field-value">${item.quantity} units</span></div>
              <div><span class="action-field-label">Unit Price:</span> <span class="action-field-value">$${item.unitPrice.toFixed(2)}</span></div>
              <div><span class="action-field-label">Total Amount:</span> <span class="action-field-value" style="color: var(--color-primary); font-size: 14px;">$${item.lineTotal.toFixed(2)} USD</span></div>
            </div>
          </div>
        `;
      } else {
        actionPreviewCard.innerHTML = `
          <div style="background: var(--color-card-subtle); padding: 14px; border-radius: var(--radius-md); font-size: 13px; color: var(--color-navy); border: 1px solid var(--color-border);">
            <strong>Interpreted Operation:</strong> ${activeInterpretation.summary}
          </div>
        `;
      }
    };

    // Mic Button Click
    micBtn.addEventListener('click', () => {
      if (voiceEngine.isListening) {
        voiceEngine.stopListening();
        micBtn.classList.remove('listening');
        stage.classList.remove('listening');
        statusText.textContent = "Processing speech audio...";
      } else {
        voiceEngine.startListening(
          (text) => {
            handleNewTranscript(text);
          },
          ({ status, message }) => {
            statusText.textContent = message;
            if (status === 'listening') {
              micBtn.classList.add('listening');
              stage.classList.add('listening');
            } else {
              micBtn.classList.remove('listening');
              stage.classList.remove('listening');
            }
          }
        );
      }
    });

    // Preset Scenarios Click
    container.querySelectorAll('.preset-scenario-card').forEach(card => {
      card.addEventListener('click', () => {
        const text = card.dataset.transcript;
        statusText.textContent = `Scenario loaded: "${text.slice(0, 40)}..."`;
        handleNewTranscript(text);
      });
    });

    // Confirm Action Click
    confirmBtn.addEventListener('click', () => {
      // Re-read contenteditable transcript in case user edited it
      const edited = transcriptEl.textContent.trim();
      if (edited !== currentTranscript) {
        voiceEngine.interpretTranscript(edited);
      }

      const res = voiceEngine.confirmVoiceAction();
      reviewCard.style.display = 'none';

      resultBanner.style.display = 'block';
      resultBanner.innerHTML = `
        <div class="card" style="background: var(--color-success-bg); border-color: rgba(22, 163, 74, 0.3); padding: 20px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 36px; height: 36px; border-radius: 50%; background: var(--color-success); color: #FFF; display: flex; align-items: center; justify-content: center; font-size: 18px;">✓</div>
              <div>
                <h4 style="font-size: 15px; font-weight: 700; color: #166534;">Voice Action Executed & Verified</h4>
                <p style="font-size: 13px; color: #15803D; margin-top: 2px;">Spoken response generated via Web Speech Synthesis.</p>
              </div>
            </div>
            ${res.po ? `<button class="btn btn-sm btn-primary" id="voice-view-created-po" data-po="${res.po.poNumber}">View Order ${res.po.poNumber} →</button>` : ''}
          </div>
          <div style="margin-top: 12px; font-size: 13px; color: #166534; line-height: 1.5; background: rgba(255, 255, 255, 0.5); padding: 12px; border-radius: 6px;">
            ${res.writtenConfirmation}
          </div>
        </div>
      `;

      resultBanner.querySelector('#voice-view-created-po')?.addEventListener('click', (e) => {
        const poNum = e.target.dataset.po;
        if (typeof onNavigate === 'function') {
          onNavigate('purchase-orders', { selectedPo: poNum });
        }
      });
    });

    cancelBtn.addEventListener('click', () => {
      reviewCard.style.display = 'none';
      statusText.textContent = "Action cancelled. Ready for next voice instruction.";
    });
  }
}
