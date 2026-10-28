/**
 * NexaOps AI - Voice AI Assistant Engine
 * Captures speech-to-text via browser SpeechRecognition API,
 * parses conversational business requests, validates actions,
 * confirms execution, and provides text-to-speech audio feedback.
 */

import { store } from '../data/store.js';

export const PRESET_VOICE_SCENARIOS = [
  {
    id: "voice-scenario-1",
    label: "Create PO: 150 units of DEMO-104",
    transcript: "Create a purchase order for 150 units of SKU DEMO-104 from Northstar Supply at 24 dollars and 50 cents per unit.",
    description: "Standard procurement creation command with supplier, SKU, quantity, and unit price."
  },
  {
    id: "voice-scenario-2",
    label: "Inventory: Stock availability in East Coast Hub",
    transcript: "Check stock availability for SKU DEMO-522 in the East Coast Logistics Hub.",
    description: "Inventory inquiry to check physical counts against safety reorder thresholds."
  },
  {
    id: "voice-scenario-3",
    label: "Logistics: Containers arriving this week",
    transcript: "Find all ocean containers scheduled to arrive at West Coast Gateway this week.",
    description: "Logistics inquiry tracking port clearance and ETA status."
  },
  {
    id: "voice-scenario-4",
    label: "Approvals: Pending purchase orders",
    transcript: "Show me all purchase orders awaiting administrative approval.",
    description: "Executive oversight query retrieving unapproved commitments."
  }
];

export class VoiceEngine {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.isSupported = false;
    this.transcript = "";
    this.activeInterpretation = null;
    this.isSpeaking = false;

    this.initSpeechRecognition();
  }

  initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.isSupported = true;
      try {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
      } catch (e) {
        console.warn('SpeechRecognition initialization failed:', e);
        this.isSupported = false;
      }
    } else {
      this.isSupported = false;
    }
  }

  startListening(onTranscriptChange, onStatusChange) {
    if (!this.isSupported || !this.recognition) {
      onStatusChange({ status: 'unsupported', message: 'Speech Recognition API is not supported in this browser. Use preset voice prompts or text input.' });
      return;
    }

    this.transcript = "";
    this.isListening = true;
    onStatusChange({ status: 'listening', message: 'Listening... Speak your business request now.' });

    this.recognition.onresult = (event) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        currentTranscript += event.results[i][0].transcript;
      }
      this.transcript = currentTranscript;
      onTranscriptChange(this.transcript);
    };

    this.recognition.onerror = (event) => {
      this.isListening = false;
      let errMessage = 'Voice recognition error.';
      if (event.error === 'not-allowed') {
        errMessage = 'Microphone permission denied. Please allow microphone access or select a preset scenario.';
      } else if (event.error === 'no-speech') {
        errMessage = 'No speech detected. Please try speaking again.';
      }
      onStatusChange({ status: 'error', message: errMessage });
    };

    this.recognition.onend = () => {
      this.isListening = false;
      onStatusChange({ status: 'idle', message: 'Finished listening.' });
    };

    try {
      this.recognition.start();
    } catch (e) {
      this.isListening = false;
      onStatusChange({ status: 'error', message: `Could not start microphone: ${e.message}` });
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  /**
   * Interprets spoken or preset transcript into actionable business intent
   */
  interpretTranscript(text) {
    const lower = text.toLowerCase();
    this.transcript = text;

    // 1. Purchase Order Creation Intent
    if (lower.includes('create') && (lower.includes('order') || lower.includes('po') || lower.includes('purchase order'))) {
      let qty = 150;
      const qtyMatch = text.match(/(\d+)\s*(?:units?|pieces?|pcs?)?/i);
      if (qtyMatch) qty = parseInt(qtyMatch[1], 10);

      let sku = "DEMO-104";
      const skuMatch = text.match(/DEMO[- ]?(\d+)/i);
      if (skuMatch) sku = `DEMO-${skuMatch[1]}`;

      let vendorName = "Northstar Supply";
      if (lower.includes('bluepeak')) vendorName = "BluePeak Components";
      else if (lower.includes('quantum')) vendorName = "Quantum Electronics";
      else if (lower.includes('apex')) vendorName = "Apex Global Logistics";
      else if (lower.includes('horizon')) vendorName = "Horizon Materials";

      let unitPrice = 24.50;
      const priceMatch = text.match(/(?:at|\$)\s*(\d+(?:\.\d{1,2})?)\s*(?:dollars?|cents?|per unit)?/i);
      if (priceMatch) {
        unitPrice = parseFloat(priceMatch[1]);
      } else if (lower.includes('24 dollars') || lower.includes('24.50')) {
        unitPrice = 24.50;
      }

      const lineTotal = parseFloat((qty * unitPrice).toFixed(2));
      const targetWarehouse = "East Coast Logistics Hub";

      this.activeInterpretation = {
        actionType: 'CREATE_PURCHASE_ORDER',
        title: 'Voice Purchase Order Draft',
        vendorName,
        sku,
        productName: 'High-Efficiency Dual-Fan Cooling Unit',
        quantity: qty,
        unitPrice,
        lineTotal,
        warehouseName: targetWarehouse,
        status: 'Awaiting Voice Action Confirmation',
        summary: `Create draft purchase order for ${qty} units of SKU ${sku} from ${vendorName} at $${unitPrice.toFixed(2)}/unit (Total: $${lineTotal.toFixed(2)} USD).`
      };

      return this.activeInterpretation;
    }

    // 2. Inventory Check Intent
    if (lower.includes('stock') || lower.includes('inventory') || lower.includes('available')) {
      const products = store.getProducts();
      let matched = products.find(p => lower.includes(p.sku.toLowerCase())) || products[1];

      this.activeInterpretation = {
        actionType: 'QUERY_INVENTORY',
        title: 'Voice Inventory Inquiry',
        sku: matched.sku,
        productName: matched.name,
        availableQty: matched.availableQty,
        reorderThreshold: matched.reorderThreshold,
        warehouseName: matched.warehouseName,
        summary: `SKU ${matched.sku} has ${matched.availableQty} units available at ${matched.warehouseName}. Reorder threshold is ${matched.reorderThreshold}.`
      };
      return this.activeInterpretation;
    }

    // 3. Logistics & Container Tracking Intent
    if (lower.includes('container') || lower.includes('shipment') || lower.includes('arriving')) {
      const containers = store.getContainers();
      this.activeInterpretation = {
        actionType: 'QUERY_CONTAINERS',
        title: 'Voice Logistics Query',
        containersCount: containers.length,
        summary: `Found ${containers.length} active shipping containers in transit. Earliest arriving container is CONT-US-6210 docked at West Coast Gateway.`
      };
      return this.activeInterpretation;
    }

    // Default General Query
    this.activeInterpretation = {
      actionType: 'GENERAL_QUERY',
      title: 'Voice Query Interpretation',
      summary: `Interpreted voice instruction: "${text}". Ready to execute through Nexa AI data pipeline.`
    };
    return this.activeInterpretation;
  }

  /**
   * Executes the interpreted voice action
   */
  confirmVoiceAction() {
    if (!this.activeInterpretation) {
      return { success: false, message: "No active voice action to confirm." };
    }

    if (this.activeInterpretation.actionType === 'CREATE_PURCHASE_ORDER') {
      const item = this.activeInterpretation;
      const allVendors = store.getVendors();
      const vendorRecord = allVendors.find(v => v.name === item.vendorName) || allVendors[0];

      const newPO = store.createPurchaseOrder({
        vendorId: vendorRecord.id,
        vendorName: item.vendorName,
        sku: item.sku,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        lineTotal: item.lineTotal,
        warehouseName: item.warehouseName,
        createdSource: 'Voice AI Speech-to-Action',
        notes: `Created via Voice AI Assistant. Spoken transcript: "${this.transcript}"`
      });

      const spokenText = `Your draft purchase order ${newPO.poNumber} has been created successfully. It contains ${newPO.quantity} units of ${newPO.sku} at $${newPO.unitPrice.toFixed(2)} per unit and is awaiting approval.`;
      
      this.speakText(spokenText);

      return {
        success: true,
        actionType: 'CREATE_PURCHASE_ORDER',
        po: newPO,
        spokenConfirmation: spokenText,
        writtenConfirmation: `Draft purchase order **[${newPO.poNumber}](#po-${newPO.poNumber})** has been created successfully. It contains **${newPO.quantity} units** of **${newPO.sku}** at **$${newPO.unitPrice.toFixed(2)}/unit** ($${newPO.lineTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD) and is awaiting approval.`
      };
    }

    // For query actions
    const spokenText = this.activeInterpretation.summary;
    this.speakText(spokenText);
    return {
      success: true,
      actionType: this.activeInterpretation.actionType,
      spokenConfirmation: spokenText,
      writtenConfirmation: spokenText
    };
  }

  speakText(text) {
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.lang = 'en-US';
      this.isSpeaking = true;
      utterance.onend = () => { this.isSpeaking = false; };
      utterance.onerror = () => { this.isSpeaking = false; };
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('SpeechSynthesis error:', e);
    }
  }

  stopSpeaking() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
    }
  }
}

export const voiceEngine = new VoiceEngine();
