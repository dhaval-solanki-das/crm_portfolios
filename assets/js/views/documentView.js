/**
 * NexaOps AI - Document Intelligence View (OCR & Computer Vision)
 */

import { ocrEngine } from '../services/ocrEngine.js';

export class DocumentView {
  static render(container, onNavigate) {
    const samples = ocrEngine.getSamples();
    let currentDoc = ocrEngine.getActiveDocument();

    const renderDocumentCanvas = () => {
      const doc = currentDoc;
      const canvasEl = container.querySelector('#doc-raw-canvas');
      const filenameEl = container.querySelector('#doc-filename-display');
      const formatEl = container.querySelector('#doc-format-display');
      const confidenceEl = container.querySelector('#doc-confidence-display');
      const badgeEl = container.querySelector('#doc-badge-display');
      const formWrapEl = container.querySelector('#doc-extracted-fields-form');

      if (filenameEl) filenameEl.textContent = doc.filename;
      if (formatEl) formatEl.textContent = `${doc.fileFormat} Document`;
      if (confidenceEl) confidenceEl.textContent = `${doc.confidenceOverall}%`;
      if (badgeEl) {
        badgeEl.textContent = doc.badge;
        badgeEl.className = `badge ${doc.confidenceOverall >= 95 ? 'badge-success' : 'badge-warning'}`;
      }

      // Highlighted visual raw text representation
      if (canvasEl) {
        let highlighted = escapeHtml(doc.rawText);
        // Highlight recognized fields with visual bounding box chips
        const fields = doc.extractedFields;
        if (fields.poNumber?.value) {
          highlighted = highlighted.replace(fields.poNumber.value, `<span class="doc-highlight-box">${fields.poNumber.value} [PO#]</span>`);
        }
        if (fields.vendorName?.value) {
          highlighted = highlighted.replace(fields.vendorName.value, `<span class="doc-highlight-box">${fields.vendorName.value} [Vendor]</span>`);
        }
        if (fields.sku?.value) {
          highlighted = highlighted.replace(fields.sku.value, `<span class="doc-highlight-box">${fields.sku.value} [SKU]</span>`);
        }
        if (fields.lineTotal?.value) {
          highlighted = highlighted.replace(`$${fields.lineTotal.value.toFixed(2)}`, `<span class="doc-highlight-box">$${fields.lineTotal.value.toFixed(2)} [Total]</span>`);
        }
        canvasEl.innerHTML = highlighted;
      }

      // Form with extracted structured inputs
      if (formWrapEl) {
        formWrapEl.innerHTML = `
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Extracted PO / Ref Number</label>
              <input type="text" class="form-control" id="ocr-field-po" value="${doc.extractedFields.poNumber?.value || 'DRAFT-PO-AUTO'}" />
              <div class="field-confidence-row">
                <span>Confidence: <strong>${doc.extractedFields.poNumber?.confidence || 98}%</strong></span>
                <span class="badge badge-success">Field Verified</span>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Detected Vendor / Supplier</label>
              <input type="text" class="form-control" id="ocr-field-vendor" value="${doc.extractedFields.vendorName?.value || 'Northstar Supply'}" />
              <div class="field-confidence-row">
                <span>Confidence: <strong>${doc.extractedFields.vendorName?.confidence || 98}%</strong></span>
                <span class="badge badge-success">Matched Catalog</span>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Product SKU</label>
              <input type="text" class="form-control" id="ocr-field-sku" value="${doc.extractedFields.sku?.value || 'DEMO-104'}" />
              <div class="field-confidence-row">
                <span>Confidence: <strong>${doc.extractedFields.sku?.confidence || 97}%</strong></span>
                <span class="badge badge-success">SKU Validated</span>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Extracted Quantity</label>
              <input type="number" class="form-control" id="ocr-field-quantity" value="${doc.extractedFields.quantity?.value || 100}" />
              <div class="field-confidence-row">
                <span>Confidence: <strong>${doc.extractedFields.quantity?.confidence || 98}%</strong></span>
                <span class="badge badge-success">Numeric Match</span>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Unit Price (USD)</label>
              <input type="number" step="0.01" class="form-control" id="ocr-field-price" value="${doc.extractedFields.unitPrice?.value || 24.50}" />
              <div class="field-confidence-row">
                <span>Confidence: <strong>${doc.extractedFields.unitPrice?.confidence || 98}%</strong></span>
                <span class="badge badge-success">Currency Verified</span>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Destination Warehouse</label>
              <input type="text" class="form-control" id="ocr-field-warehouse" value="${doc.extractedFields.destinationWarehouse?.value || 'East Coast Logistics Hub'}" />
              <div class="field-confidence-row">
                <span>Confidence: <strong>${doc.extractedFields.destinationWarehouse?.confidence || 95}%</strong></span>
                <span class="badge badge-success">Routing Valid</span>
              </div>
            </div>
          </div>

          <div style="background: var(--color-primary-light); padding: 14px; border-radius: var(--radius-md); border: 1px solid rgba(37, 99, 235, 0.2); margin-top: 10px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div>
                <span style="font-size: 11px; color: var(--color-primary); font-weight: 700; text-transform: uppercase;">AUTOMATED PO PREVIEW</span>
                <p style="font-size: 13px; font-weight: 600; color: var(--color-navy); margin-top: 2px;">
                  Ready to draft order in demo data registry.
                </p>
              </div>
              <button class="btn btn-primary" id="ocr-convert-po-btn">
                Convert to Purchase Order →
              </button>
            </div>
          </div>
        `;

        formWrapEl.querySelector('#ocr-convert-po-btn')?.addEventListener('click', () => {
          const edited = {
            vendorName: formWrapEl.querySelector('#ocr-field-vendor').value,
            sku: formWrapEl.querySelector('#ocr-field-sku').value,
            quantity: formWrapEl.querySelector('#ocr-field-quantity').value,
            unitPrice: formWrapEl.querySelector('#ocr-field-price').value,
            warehouseName: formWrapEl.querySelector('#ocr-field-warehouse').value
          };

          const result = ocrEngine.convertToPurchaseOrder(edited);
          if (result.success) {
            alert(`Success: ${result.message}`);
            if (typeof onNavigate === 'function') {
              onNavigate('purchase-orders', { selectedPo: result.po.poNumber });
            }
          }
        });
      }
    };

    container.innerHTML = `
      <div class="ocr-container">
        <!-- Header -->
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
          <div>
            <h2 style="font-size: 22px; font-weight: 800; color: var(--color-navy); letter-spacing: -0.4px;">
              Document Intelligence & Computer Vision
            </h2>
            <p style="font-size: 13px; color: var(--color-text-secondary);">
              Demonstrating automated field extraction from typed POs, scanned logistics bills, and handwritten memos.
            </p>
          </div>
        </div>

        <!-- Preloaded Samples Chips -->
        <div class="ocr-samples-bar">
          <span style="font-size: 12px; font-weight: 700; color: var(--color-navy);">Test Document Samples:</span>
          ${samples.map((s, idx) => `
            <button class="ocr-sample-chip ${s.id === currentDoc.id ? 'active' : ''}" data-id="${s.id}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
              </svg>
              ${s.title} (${s.fileFormat})
            </button>
          `).join('')}
        </div>

        <!-- Upload Zone -->
        <div class="ocr-upload-zone" id="ocr-drop-zone">
          <input type="file" id="ocr-file-input" style="display: none;" accept=".pdf,.png,.jpg,.jpeg,.xlsx,.csv,.txt,.docx" />
          <svg class="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          <div class="upload-title">Drop your own demonstration file or click to browse</div>
          <div class="upload-subtitle">Supports PDF, PNG, JPG, JPEG, XLSX, CSV, TXT, DOCX (Max 10MB)</div>
        </div>

        <!-- Side-by-Side Document Inspection -->
        <div class="ocr-inspection-grid">
          <!-- Document Preview Canvas -->
          <div class="doc-visual-panel">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div>
                <h3 style="font-size: 14px; font-weight: 700; color: var(--color-navy);" id="doc-filename-display">PO_Requisition_Northstar_1001.pdf</h3>
                <span style="font-size: 11px; color: var(--color-text-secondary);" id="doc-format-display">PDF Document</span>
              </div>
              <span class="badge badge-success" id="doc-badge-display">High Confidence</span>
            </div>

            <div class="doc-canvas" id="doc-raw-canvas">
              <!-- Raw text with visual highlight bounding boxes -->
            </div>
          </div>

          <!-- Extracted Fields & Validation Form -->
          <div class="doc-extracted-panel">
            <div class="confidence-meter-header">
              <div>
                <span style="font-size: 11px; color: var(--color-teal); font-weight: 700; text-transform: uppercase;">EXTRACTION CONFIDENCE</span>
                <p style="font-size: 12px; color: var(--color-text-secondary); margin-top: 1px;">LayoutLM & Vision Transformer Score</p>
              </div>
              <div class="confidence-score" id="doc-confidence-display">98.4%</div>
            </div>

            <div id="doc-extracted-fields-form">
              <!-- Dynamically populated -->
            </div>
          </div>
        </div>
      </div>
    `;

    // Chip click handlers
    container.querySelectorAll('.ocr-sample-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        container.querySelectorAll('.ocr-sample-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        currentDoc = ocrEngine.selectSample(chip.dataset.id);
        renderDocumentCanvas();
      });
    });

    // Upload handlers
    const dropZone = container.querySelector('#ocr-drop-zone');
    const fileInput = container.querySelector('#ocr-file-input');

    dropZone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', async (e) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        dropZone.querySelector('.upload-title').textContent = `Processing ${file.name} with Document Vision...`;
        const newDoc = await ocrEngine.processCustomUpload(file);
        currentDoc = newDoc;
        dropZone.querySelector('.upload-title').textContent = `Drop your own demonstration file or click to browse`;
        renderDocumentCanvas();
      }
    });

    renderDocumentCanvas();
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
