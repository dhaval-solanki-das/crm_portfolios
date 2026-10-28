/**
 * NexaOps AI - Document Intelligence & OCR Engine
 * Demonstrates computer vision, document understanding, confidence scoring,
 * and automated purchase order extraction workflows.
 */

import { OCR_DEMO_SAMPLES } from '../data/mockData.js';
import { store } from '../data/store.js';

export class OCREngine {
  constructor() {
    this.samples = [...OCR_DEMO_SAMPLES];
    this.activeDocument = this.samples[0]; // Default to Typed PO
    this.isProcessing = false;
  }

  getSamples() {
    return this.samples;
  }

  getActiveDocument() {
    return this.activeDocument;
  }

  selectSample(sampleId) {
    const doc = this.samples.find(s => s.id === sampleId);
    if (doc) {
      this.activeDocument = doc;
    }
    return this.activeDocument;
  }

  /**
   * Simulates realistic OCR / Document Vision extraction processing
   */
  async processCustomUpload(file) {
    this.isProcessing = true;

    // Simulate OCR processing latency (1.2 seconds)
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Determine type from file extension
    const ext = file.name.split('.').pop().toLowerCase();
    const isHandwritten = file.name.toLowerCase().includes('hand') || file.name.toLowerCase().includes('memo');
    const isSpreadsheet = ['xlsx', 'xls', 'csv'].includes(ext);

    let docType = 'typed_po';
    let overallConfidence = 96.2;
    let badge = 'High Confidence';
    let sku = 'DEMO-104';
    let vendor = 'Northstar Supply';
    let qty = 150;
    let price = 24.50;

    if (isHandwritten) {
      docType = 'handwritten';
      overallConfidence = 87.4;
      badge = 'Review Recommended';
      sku = 'DEMO-104';
      vendor = 'Northstar Supply';
      qty = 150;
      price = 24.50;
    } else if (isSpreadsheet) {
      docType = 'vendor_quote';
      overallConfidence = 98.1;
      badge = 'Verified Format';
      sku = 'DEMO-208';
      vendor = 'BluePeak Components';
      qty = 80;
      price = 42.00;
    }

    const customSample = {
      id: `doc-custom-${Date.now()}`,
      type: docType,
      title: `Uploaded Document: ${file.name}`,
      subtitle: `Processed via Document Vision Engine (${ext.toUpperCase()})`,
      fileFormat: ext.toUpperCase(),
      filename: file.name,
      fileSize: `${(file.size / 1024).toFixed(1)} KB`,
      confidenceOverall: overallConfidence,
      badge,
      isUserUploaded: true,
      extractedFields: {
        poNumber: { value: `UPLOAD-PO-${Math.floor(1000 + Math.random() * 9000)}`, confidence: 97.2, status: 'verified' },
        vendorName: { value: vendor, confidence: 98.0, status: 'verified', matchedId: 'VEND-001' },
        orderDate: { value: new Date().toISOString().split('T')[0], confidence: 96.5, status: 'verified' },
        expectedDeliveryDate: { value: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0], confidence: 95.0, status: 'verified' },
        sku: { value: sku, confidence: 98.4, status: 'verified', matchedName: 'Extracted Product Item' },
        quantity: { value: qty, confidence: 97.0, status: 'verified' },
        unitPrice: { value: price, confidence: 97.8, status: 'verified' },
        currency: { value: 'USD', confidence: 99.0, status: 'verified' },
        lineTotal: { value: parseFloat((qty * price).toFixed(2)), confidence: 98.5, status: 'verified' },
        destinationWarehouse: { value: 'East Coast Logistics Hub', confidence: 94.2, status: 'verified', matchedId: 'WH-001' }
      },
      rawText: `[DOCUMENT VISION EXTRACTED TEXT]\nFilename: ${file.name}\nTimestamp: ${new Date().toLocaleString()}\nDetected Format: ${ext.toUpperCase()} Multi-layer Document\nExtracted Entities: Vendor: ${vendor} | Item: ${sku} | Qty: ${qty} | Unit Price: $${price.toFixed(2)} USD\nVerification Status: Ready for Purchase Order Drafting.`
    };

    this.samples.unshift(customSample);
    this.activeDocument = customSample;
    this.isProcessing = false;

    return customSample;
  }

  /**
   * Converts the active extracted document into a verified Purchase Order
   */
  convertToPurchaseOrder(editedFields = null) {
    const doc = this.activeDocument;
    const fields = editedFields || {};

    const vendorName = fields.vendorName || doc.extractedFields.vendorName?.value || 'Northstar Supply';
    const sku = fields.sku || doc.extractedFields.sku?.value || 'DEMO-104';
    const quantity = parseInt(fields.quantity || doc.extractedFields.quantity?.value || 100, 10);
    const unitPrice = parseFloat(fields.unitPrice || doc.extractedFields.unitPrice?.value || 24.50);
    const lineTotal = parseFloat((quantity * unitPrice).toFixed(2));
    const warehouseName = fields.warehouseName || doc.extractedFields.destinationWarehouse?.value || 'East Coast Logistics Hub';

    // Verify vendor and SKU against database
    const allVendors = store.getVendors();
    const vendorRecord = allVendors.find(v => v.name.toLowerCase() === vendorName.toLowerCase()) || allVendors[0];

    const allProducts = store.getProducts();
    const productRecord = allProducts.find(p => p.sku.toUpperCase() === sku.toUpperCase()) || allProducts[0];

    // Create PO
    const newPO = store.createPurchaseOrder({
      vendorId: vendorRecord.id,
      vendorName: vendorRecord.name,
      sku: productRecord.sku,
      productName: productRecord.name,
      quantity,
      unitPrice,
      lineTotal,
      warehouseName,
      createdSource: `Document Intelligence (${doc.title})`,
      notes: `Extracted from ${doc.filename} via OCR Document Vision (Confidence: ${doc.confidenceOverall}%).`
    });

    return {
      success: true,
      po: newPO,
      message: `Purchase order ${newPO.poNumber} successfully drafted from ${doc.filename}.`
    };
  }
}

export const ocrEngine = new OCREngine();
