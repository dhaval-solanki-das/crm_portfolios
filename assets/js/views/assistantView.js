/**
 * NexaOps AI - Nexa AI Assistant View
 */

import { aiEngine } from '../services/aiEngine.js';
import { store } from '../data/store.js';

export class AssistantView {
  static render(container, onNavigate, initialPrompt = null) {
    const suggestedPrompts = [
      "Show me pending purchase orders.",
      "Which vendors have the most outstanding orders?",
      "Create a purchase order for 150 units of SKU DEMO-104.",
      "Find containers arriving this week.",
      "Check stock availability in the demo warehouse.",
      "Read this document and prepare a purchase order.",
      "Summarize the latest inventory changes.",
      "Explain why a purchase order is awaiting approval."
    ];

    container.innerHTML = `
      <div class="assistant-page-container">
        <!-- Prompts & History Sidebar -->
        <div class="chat-sidebar">
          <button id="ai-new-chat-btn" class="chat-new-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Conversation
          </button>

          <div>
            <span class="prompts-list-title">Suggested Inquiries</span>
            <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 8px;">
              ${suggestedPrompts.map(p => `
                <button class="suggested-prompt-chip" data-prompt="${p}">
                  ${p}
                </button>
              `).join('')}
            </div>
          </div>

          <div style="margin-top: auto; padding-top: 16px; border-top: 1px solid var(--color-border-subtle);">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 11px; color: var(--color-text-secondary); font-weight: 600;">ACTIVE ENGINE</span>
              <span class="badge badge-info" id="ai-engine-mode-badge">${aiEngine.isLiveMode ? 'Live LLM' : 'Local Deterministic'}</span>
            </div>
            <button id="ai-settings-toggle-btn" class="btn btn-sm btn-outline" style="width: 100%; margin-top: 8px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
              AI Engine Config
            </button>
          </div>
        </div>

        <!-- Chat Viewport -->
        <div class="chat-viewport">
          <div class="chat-viewport-header">
            <div class="assistant-info-badge">
              <div class="assistant-avatar">AI</div>
              <div>
                <h3 class="assistant-name">Nexa AI Copilot</h3>
                <span class="assistant-status">Online • Multi-Agent Orchestrator</span>
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 8px;">
              <button id="ai-download-chat-btn" class="icon-action-btn" title="Download Conversation JSON">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </button>
              <button id="ai-clear-chat-btn" class="icon-action-btn" title="Clear Chat">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Messages Stream -->
          <div class="chat-messages-stream" id="chat-messages-stream">
            <!-- Welcome Message -->
            <div class="msg-row assistant">
              <div class="msg-avatar">AI</div>
              <div class="msg-bubble-wrap">
                <div class="msg-bubble">
                  <p>Hello! I'm <strong>Nexa AI</strong>, your business operations copilot.</p>
                  <p>I can help you review pending purchase orders, create new orders, look up vendor lead times, track active ocean containers, check warehouse stock thresholds, or explain delay risks.</p>
                  <p><em>What operation would you like to perform today?</em></p>
                </div>
                <div class="quick-replies-wrap">
                  <button class="quick-reply-btn" data-msg="Show me pending purchase orders.">Show pending purchase orders</button>
                  <button class="quick-reply-btn" data-msg="Which vendors have the most outstanding orders?">Vendor open commitments</button>
                  <button class="quick-reply-btn" data-msg="Create a purchase order for 150 units of SKU DEMO-104.">Create PO (150 units DEMO-104)</button>
                  <button class="quick-reply-btn" data-msg="Find containers arriving this week.">Containers arriving this week</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Chat Input -->
          <form class="chat-input-bar" id="chat-form">
            <input 
              type="text" 
              class="chat-input-field" 
              id="chat-input" 
              placeholder="Ask Nexa AI about purchase orders, suppliers, stock, or containers..." 
              autocomplete="off"
            />
            <button type="submit" class="chat-send-btn" id="chat-submit-btn" title="Send message">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </form>
        </div>
      </div>

      <!-- Engine Config Modal -->
      <div class="modal-overlay" id="ai-engine-modal">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title">AI Assistant Engine Settings</h3>
            <button class="modal-close-btn" id="ai-engine-modal-close">✕</button>
          </div>
          <div class="modal-body">
            <p style="font-size: 13px; color: var(--color-text-secondary); margin-bottom: 16px;">
              By default, Nexa AI runs in <strong>Deterministic Demo Mode</strong> using rich local business records.
              You can optionally connect a live OpenRouter or Gemini API key to experience dynamic LLM generation.
            </p>
            <div class="form-group">
              <label class="form-label">OpenRouter API Key (Optional)</label>
              <input type="password" class="form-control" id="ai-openrouter-key-input" placeholder="sk-or-v1-..." value="${aiEngine.apiKey}" />
              <span style="font-size: 11px; color: var(--color-text-muted); display: block; margin-top: 4px;">
                Never exposed to other visitors. Stored exclusively in your browser's LocalStorage.
              </span>
            </div>
            <div style="background: var(--color-primary-light); padding: 12px; border-radius: var(--radius-md); font-size: 12px; color: var(--color-primary);">
              <strong>Safe Demo Guarantee:</strong> When no key is entered, the platform uses intelligent local intent matching and business validation without external API dependencies.
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" id="ai-engine-clear-btn">Clear Key (Use Local Mode)</button>
            <button class="btn btn-primary" id="ai-engine-save-btn">Save Configuration</button>
          </div>
        </div>
      </div>
    `;

    const stream = container.querySelector('#chat-messages-stream');
    const form = container.querySelector('#chat-form');
    const input = container.querySelector('#chat-input');
    const newChatBtn = container.querySelector('#ai-new-chat-btn');
    const clearChatBtn = container.querySelector('#ai-clear-chat-btn');
    const downloadChatBtn = container.querySelector('#ai-download-chat-btn');
    const settingsToggleBtn = container.querySelector('#ai-settings-toggle-btn');
    const engineModal = container.querySelector('#ai-engine-modal');
    const engineModalClose = container.querySelector('#ai-engine-modal-close');
    const engineSaveBtn = container.querySelector('#ai-engine-save-btn');
    const engineClearBtn = container.querySelector('#ai-engine-clear-btn');
    const keyInput = container.querySelector('#ai-openrouter-key-input');
    const engineBadge = container.querySelector('#ai-engine-mode-badge');

    // Scroll helper
    const scrollToBottom = () => {
      stream.scrollTop = stream.scrollHeight;
    };

    // Render an assistant message
    const appendAssistantMessage = (response) => {
      const row = document.createElement('div');
      row.className = 'msg-row assistant';

      let innerHtml = `
        <div class="msg-avatar">AI</div>
        <div class="msg-bubble-wrap">
          <div class="msg-bubble">
            ${formatMarkdown(response.content)}
          </div>
      `;

      // Render table if present
      if (response.table) {
        innerHtml += `
          <div class="chat-table-wrap">
            <table class="chat-table">
              <thead>
                <tr>${response.table.columns.map(c => `<th>${c}</th>`).join('')}</tr>
              </thead>
              <tbody>
                ${response.table.rows.map(r => `<tr>${r.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}
              </tbody>
            </table>
          </div>
        `;
      }

      // Render Action Card (e.g. PO Draft)
      if (response.actionCard) {
        const card = response.actionCard;
        innerHtml += `
          <div class="chat-action-card">
            <div class="action-card-header">
              <span class="action-card-title">${card.title}</span>
              <span class="badge badge-warning">${card.status}</span>
            </div>
            <div class="action-grid">
              <div><span class="action-field-label">Supplier:</span> <span class="action-field-value">${card.vendor}</span></div>
              <div><span class="action-field-label">Destination:</span> <span class="action-field-value">${card.warehouse}</span></div>
              <div><span class="action-field-label">Item SKU:</span> <span class="action-field-value">${card.sku}</span></div>
              <div><span class="action-field-label">Quantity:</span> <span class="action-field-value">${card.quantity} units</span></div>
              <div><span class="action-field-label">Unit Price:</span> <span class="action-field-value">${card.unitPrice}</span></div>
              <div><span class="action-field-label">Total Amount:</span> <span class="action-field-value" style="color: var(--color-primary);">${card.lineTotal}</span></div>
            </div>
          </div>
        `;
      }

      // Render Quick Replies
      if (response.quickReplies && response.quickReplies.length > 0) {
        innerHtml += `
          <div class="quick-replies-wrap">
            ${response.quickReplies.map(qr => `<button class="quick-reply-btn" data-msg="${qr}">${qr}</button>`).join('')}
          </div>
        `;
      }

      innerHtml += `</div>`;
      row.innerHTML = innerHtml;
      stream.appendChild(row);

      // Attach event listeners to newly generated quick replies
      row.querySelectorAll('.quick-reply-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const msg = btn.dataset.msg;
          sendUserMessage(msg);
        });
      });

      scrollToBottom();
    };

    // User Message Sender
    const sendUserMessage = async (text) => {
      if (!text.trim()) return;

      // Append user bubble
      const userRow = document.createElement('div');
      userRow.className = 'msg-row user';
      userRow.innerHTML = `
        <div class="msg-avatar">U</div>
        <div class="msg-bubble-wrap">
          <div class="msg-bubble">${escapeHtml(text)}</div>
        </div>
      `;
      stream.appendChild(userRow);
      scrollToBottom();

      // Show typing indicator
      const typingRow = document.createElement('div');
      typingRow.className = 'msg-row assistant';
      typingRow.id = 'chat-typing-indicator';
      typingRow.innerHTML = `
        <div class="msg-avatar">AI</div>
        <div class="msg-bubble-wrap">
          <div class="typing-dots">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
          </div>
        </div>
      `;
      stream.appendChild(typingRow);
      scrollToBottom();

      // Process message through Nexa AI Engine
      try {
        const response = await aiEngine.processMessage(text);
        typingRow.remove();
        appendAssistantMessage(response);
      } catch (e) {
        typingRow.remove();
        appendAssistantMessage({
          content: `I encountered an operational processing error: ${e.message}`,
          status: 'error'
        });
      }
    };

    // Form Submit
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      input.value = '';
      sendUserMessage(text);
    });

    // Suggested prompts chips
    container.querySelectorAll('.suggested-prompt-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        sendUserMessage(chip.dataset.prompt);
      });
    });

    // Initial Quick Replies
    container.querySelectorAll('.quick-reply-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        sendUserMessage(btn.dataset.msg);
      });
    });

    // Clear and New Chat
    const resetChat = () => {
      aiEngine.clearHistory();
      stream.innerHTML = `
        <div class="msg-row assistant">
          <div class="msg-avatar">AI</div>
          <div class="msg-bubble-wrap">
            <div class="msg-bubble">
              <p>Conversation refreshed. How may I assist your business operations?</p>
            </div>
            <div class="quick-replies-wrap">
              <button class="quick-reply-btn" data-msg="Show me pending purchase orders.">Show pending purchase orders</button>
              <button class="quick-reply-btn" data-msg="Check stock availability in the demo warehouse.">Check stock levels</button>
              <button class="quick-reply-btn" data-msg="Find containers arriving this week.">Find incoming containers</button>
            </div>
          </div>
        </div>
      `;
      stream.querySelectorAll('.quick-reply-btn').forEach(btn => {
        btn.addEventListener('click', () => sendUserMessage(btn.dataset.msg));
      });
    };

    newChatBtn?.addEventListener('click', resetChat);
    clearChatBtn?.addEventListener('click', resetChat);

    // Download chat JSON
    downloadChatBtn?.addEventListener('click', () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(aiEngine.conversationHistory, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `nexaops_chat_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    });

    // Engine Config Modal
    settingsToggleBtn?.addEventListener('click', () => {
      engineModal.classList.add('active');
    });

    engineModalClose?.addEventListener('click', () => {
      engineModal.classList.remove('active');
    });

    engineSaveBtn?.addEventListener('click', () => {
      aiEngine.setApiKey(keyInput.value);
      engineBadge.textContent = aiEngine.isLiveMode ? 'Live LLM' : 'Local Deterministic';
      engineBadge.className = `badge ${aiEngine.isLiveMode ? 'badge-success' : 'badge-info'}`;
      engineModal.classList.remove('active');
    });

    engineClearBtn?.addEventListener('click', () => {
      keyInput.value = '';
      aiEngine.setApiKey('');
      engineBadge.textContent = 'Local Deterministic';
      engineBadge.className = 'badge badge-info';
      engineModal.classList.remove('active');
    });

    // If an initial prompt was passed from navigation
    if (initialPrompt) {
      setTimeout(() => sendUserMessage(initialPrompt), 300);
    }
  }
}

// Markdown formatting helper
function formatMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[(.*?)\]\(#(.*?)\)/g, '<a href="#$2" style="font-weight:600; text-decoration:underline;">$1</a>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n- (.*?)/g, '<br>• $1')
    .replace(/\n/g, '<br>');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
