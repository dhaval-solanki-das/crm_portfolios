/**
 * NexaOps AI - Portfolio Landing Page View
 */

export class LandingView {
  static render(container, onNavigateToApp) {
    container.innerHTML = `
      <div class="landing-page-wrapper">
        <!-- Landing Top Navigation -->
        <nav class="landing-nav">
          <div class="brand-text-wrap" style="flex-direction: row; align-items: center; gap: 10px;">
            <div class="brand-logo-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polygon points="12 2 2 7 12 12 22 7 12 2"/>
                <polyline points="2 17 12 22 22 17"/>
                <polyline points="2 12 12 17 22 12"/>
              </svg>
            </div>
            <div>
              <span class="brand-name">NexaOps AI</span>
              <span class="brand-tagline" style="display:block;">Enterprise Operations</span>
            </div>
          </div>

          <div class="landing-nav-links">
            <a href="#features" class="landing-nav-link">Capabilities</a>
            <a href="#architecture" class="landing-nav-link">Architecture</a>
            <a href="#workflows" class="landing-nav-link">Workflows</a>
            <a href="#impact" class="landing-nav-link">Implementation</a>
            <a href="#contact" class="landing-nav-link">Contact</a>
          </div>

          <div style="display: flex; align-items: center; gap: 12px;">
            <button id="landing-launch-btn-top" class="btn btn-primary">
              Explore Live Demo
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          </div>
        </nav>

        <!-- Hero Section -->
        <section class="hero-section">
          <div class="hero-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            Production Portfolio Case Study
          </div>

          <h1 class="hero-headline">
            Transform Business Operations with <span>Intelligent AI</span>.
          </h1>

          <p class="hero-subheadline">
            An AI-powered business operations platform that combines conversational intelligence,
            document understanding, voice automation, and role-based workflows to simplify everyday business tasks.
          </p>

          <div class="hero-ctas">
            <button id="landing-launch-btn-hero" class="btn btn-primary btn-lg">
              Explore Live Demo
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
            <button id="landing-walkthrough-btn" class="btn btn-secondary btn-lg">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>
              </svg>
              Watch Product Walkthrough
            </button>
          </div>

          <!-- Product Teaser Frame -->
          <div class="product-preview-frame">
            <div class="preview-browser-bar">
              <div class="browser-dots">
                <div class="browser-dot dot-red"></div>
                <div class="browser-dot dot-yellow"></div>
                <div class="browser-dot dot-green"></div>
              </div>
              <div class="browser-address-bar">https://nexaops.demo/dashboard — Interactive Portfolio Sandbox</div>
              <div style="font-size: 11px; color: var(--color-teal); font-weight: 600;">● Active Demo Session</div>
            </div>
            <div style="padding: 24px; text-align: left; background: #FFFFFF;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
                <div>
                  <h3 style="font-size: 18px; font-weight: 700; color: var(--color-navy);">Interactive Enterprise Sandbox</h3>
                  <p style="font-size: 13px; color: var(--color-text-secondary);">Click below to enter the live system with pre-seeded fictional operations records.</p>
                </div>
                <button id="landing-preview-enter-btn" class="btn btn-teal">
                  Launch Platform
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </button>
              </div>

              <!-- Quick Mini Dashboard Cards -->
              <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;">
                <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 14px; border-radius: 8px;">
                  <span style="font-size: 11px; color: #64748B; font-weight: 600;">TOTAL PURCHASE ORDERS</span>
                  <p style="font-size: 22px; font-weight: 800; color: #14213D; margin-top: 4px;">248</p>
                </div>
                <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 14px; border-radius: 8px;">
                  <span style="font-size: 11px; color: #D97706; font-weight: 600;">PENDING APPROVALS</span>
                  <p style="font-size: 22px; font-weight: 800; color: #D97706; margin-top: 4px;">17</p>
                </div>
                <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 14px; border-radius: 8px;">
                  <span style="font-size: 11px; color: #64748B; font-weight: 600;">ACTIVE SUPPLIERS</span>
                  <p style="font-size: 22px; font-weight: 800; color: #14213D; margin-top: 4px;">42</p>
                </div>
                <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 14px; border-radius: 8px;">
                  <span style="font-size: 11px; color: #0F766E; font-weight: 600;">CONTAINERS IN TRANSIT</span>
                  <p style="font-size: 22px; font-weight: 800; color: #0F766E; margin-top: 4px;">31</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Business Challenges vs Solutions Section -->
        <section id="workflows" style="padding: 80px 24px; max-width: 1100px; margin: 0 auto;">
          <div class="section-header">
            <span class="section-tag">Enterprise Problem & Solution</span>
            <h2 class="section-title">Solving Complex B2B Operational Bottlenecks</h2>
          </div>

          <div class="comparison-table-wrap">
            <table class="comparison-table">
              <thead>
                <tr>
                  <th style="width: 25%;">Operational Bottleneck</th>
                  <th style="width: 35%;">Traditional Manual Process</th>
                  <th style="width: 40%;">NexaOps AI Automated Solution</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>PO Creation Overhead</strong></td>
                  <td style="color: #64748B;">Staff spend 20–30 minutes manually looking up SKUs, calculating line totals, emailing vendors, and checking lead times.</td>
                  <td><span class="badge badge-success">Conversational AI PO Agent</span> Natural language prompt or voice command instantly extracts parameters, validates pricing, generates draft PO, and requests 1-click confirmation.</td>
                </tr>
                <tr>
                  <td><strong>Unstructured Documents</strong></td>
                  <td style="color: #64748B;">Invoices, handwritten notes, and scanned supplier quotes require manual data re-entry with high error rates.</td>
                  <td><span class="badge badge-info">Document Vision & OCR</span> Automated layout parsing extracts fields with confidence scoring, highlights missing items, and auto-populates drafts.</td>
                </tr>
                <tr>
                  <td><strong>Multi-Tenant Data Leaks</strong></td>
                  <td style="color: #64748B;">Generic AI chatbots lack tenant awareness, risking disclosure of private supplier pricing to competing vendors.</td>
                  <td><span class="badge badge-warning">Role-Aware Scoping</span> Zero-trust RBAC restricts AI context window to the user's specific vendor or warehouse domain.</td>
                </tr>
                <tr>
                  <td><strong>Container Delays</strong></td>
                  <td style="color: #64748B;">Logistics status updates scattered across ocean carrier portals, railheads, and customs clearing agents.</td>
                  <td><span class="badge badge-neutral">Autonomous Logistics Agent</span> Real-time port tracking, container ETA milestones, and automated alerts for delayed shipments.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- Technical Architecture Section -->
        <section id="architecture" class="architecture-section">
          <div class="section-container">
            <div class="section-header">
              <span class="section-tag">System Architecture</span>
              <h2 class="section-title">Engineered for Zero-Hallucination Enterprise Workflows</h2>
              <p style="font-size: 15px; color: var(--color-text-secondary); margin-top: 8px;">
                Combining deterministic business logic guardrails with multi-agent conversational AI orchestration.
              </p>
            </div>

            <div class="arch-flow-grid">
              <!-- Layer 1 -->
              <div class="arch-layer-card">
                <div style="display: flex; align-items: center; gap: 16px;">
                  <div class="arch-layer-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
                    </svg>
                  </div>
                  <div>
                    <h4 style="font-size: 16px; font-weight: 700; color: var(--color-navy);">Interactive Client Application</h4>
                    <p style="font-size: 13px; color: var(--color-text-secondary);">Responsive SaaS Frontend • Vanilla CSS Design System • Web Speech & OCR Interfaces</p>
                  </div>
                </div>
                <span class="badge badge-info">React / Modern Web</span>
              </div>

              <div class="arch-connector"></div>

              <!-- Layer 2 -->
              <div class="arch-layer-card">
                <div style="display: flex; align-items: center; gap: 16px;">
                  <div class="arch-layer-icon" style="background: var(--color-teal-light); color: var(--color-teal);">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </div>
                  <div>
                    <h4 style="font-size: 16px; font-weight: 700; color: var(--color-navy);">API Gateway & RBAC Authorization Layer</h4>
                    <p style="font-size: 13px; color: var(--color-text-secondary);">FastAPI • JWT Token Validation • Multi-Tenant Tenant Scoping (Admin, Ops, Vendor, Warehouse, Logistics)</p>
                  </div>
                </div>
                <span class="badge badge-success">Zero-Trust RBAC</span>
              </div>

              <div class="arch-connector"></div>

              <!-- Layer 3 -->
              <div class="arch-layer-card">
                <div style="display: flex; align-items: center; gap: 16px;">
                  <div class="arch-layer-icon" style="background: #FEF3C7; color: #D97706;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 style="font-size: 16px; font-weight: 700; color: var(--color-navy);">Nexa AI Multi-Agent Orchestration Engine</h4>
                    <p style="font-size: 13px; color: var(--color-text-secondary);">Data Agent • Purchase Order Agent • Document Vision Agent • Inventory Agent • Logistics Agent</p>
                  </div>
                </div>
                <span class="badge badge-warning">Multi-Agent AI</span>
              </div>

              <div class="arch-connector"></div>

              <!-- Layer 4 -->
              <div class="arch-layer-card">
                <div style="display: flex; align-items: center; gap: 16px;">
                  <div class="arch-layer-icon" style="background: #FEE2E2; color: #DC2626;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 style="font-size: 16px; font-weight: 700; color: var(--color-navy);">Safe Execution & SQLGlot AST Validation</h4>
                    <p style="font-size: 13px; color: var(--color-text-secondary);">Controlled Business Functions • SQL AST Syntax Verification • Zero Direct Raw SQL Execution</p>
                  </div>
                </div>
                <span class="badge badge-danger">SQL Guardrails</span>
              </div>

              <div class="arch-connector"></div>

              <!-- Layer 5 -->
              <div class="arch-layer-card">
                <div style="display: flex; align-items: center; gap: 16px;">
                  <div class="arch-layer-icon" style="background: #F1F5F9; color: var(--color-navy);">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
                    </svg>
                  </div>
                  <div>
                    <h4 style="font-size: 16px; font-weight: 700; color: var(--color-navy);">Operational Database & Demo Store</h4>
                    <p style="font-size: 13px; color: var(--color-text-secondary);">PostgreSQL / SQLite • Relational Data Models • In-Memory & LocalStorage Client Persistence</p>
                  </div>
                </div>
                <span class="badge badge-neutral">Database Layer</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Feature Capabilities Grid -->
        <section id="features" style="padding: 80px 24px; max-width: 1200px; margin: 0 auto;">
          <div class="section-header">
            <span class="section-tag">Core Features</span>
            <h2 class="section-title">Built for Real-World Commercial Operations</h2>
          </div>

          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon" style="background: var(--color-primary-light); color: var(--color-primary);">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <h3 class="feature-title">Nexa AI Copilot</h3>
              <p class="feature-desc">
                Natural language query assistant with data tables, suggested prompt chips, conversation history, and real-time execution.
              </p>
            </div>

            <div class="feature-card">
              <div class="feature-icon" style="background: var(--color-teal-light); color: var(--color-teal);">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                </svg>
              </div>
              <h3 class="feature-title">PO Management & Approval</h3>
              <p class="feature-desc">
                Complete procurement lifecycle with SKU search, unit price math, administrative sign-off, printable POs, and CSV export.
              </p>
            </div>

            <div class="feature-card">
              <div class="feature-icon" style="background: #FEF3C7; color: #D97706;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
              <h3 class="feature-title">Document Intelligence (OCR)</h3>
              <p class="feature-desc">
                Extracts typed purchase orders, scanned bills of lading, and handwritten maintenance requisitions with confidence scores.
              </p>
            </div>

            <div class="feature-card">
              <div class="feature-icon" style="background: #FEE2E2; color: #DC2626;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
                </svg>
              </div>
              <h3 class="feature-title">Voice AI Automation</h3>
              <p class="feature-desc">
                Hands-free voice orders with live audio waveform pulses, editable speech transcripts, action previews, and spoken TTS feedback.
              </p>
            </div>

            <div class="feature-card">
              <div class="feature-icon" style="background: #EFF6FF; color: var(--color-primary);">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h3 class="feature-title">Role-Based Access (RBAC)</h3>
              <p class="feature-desc">
                Interactive role switching between Admin, Operations, Vendor, Warehouse, and Logistics with strict data isolation.
              </p>
            </div>

            <div class="feature-card">
              <div class="feature-icon" style="background: var(--color-teal-light); color: var(--color-teal);">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                </svg>
              </div>
              <h3 class="feature-title">Ocean & Rail Logistics</h3>
              <p class="feature-desc">
                Milestone tracking for ocean shipping containers, terminal port clearance, intermodal rail lines, and warehouse receiving.
              </p>
            </div>
          </div>
        </section>

        <!-- Project Implementation Highlights -->
        <section id="impact" style="padding: 80px 24px; background: #F8FAFC; border-top: 1px solid var(--color-border);">
          <div class="section-container">
            <div class="section-header">
              <span class="section-tag">Implementation Metrics</span>
              <h2 class="section-title">Measurable Engineering & Business Impact</h2>
            </div>

            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;">
              <div class="card" style="text-align: center; padding: 32px 20px;">
                <p style="font-size: 44px; font-weight: 800; color: var(--color-primary); line-height: 1;">85%</p>
                <h4 style="font-size: 15px; font-weight: 700; color: var(--color-navy); margin-top: 10px;">Faster PO Creation</h4>
                <p style="font-size: 13px; color: var(--color-text-secondary); margin-top: 6px;">Reduced standard procurement entry from 25 minutes to under 3 minutes.</p>
              </div>
              <div class="card" style="text-align: center; padding: 32px 20px;">
                <p style="font-size: 44px; font-weight: 800; color: var(--color-teal); line-height: 1;">99.4%</p>
                <h4 style="font-size: 15px; font-weight: 700; color: var(--color-navy); margin-top: 10px;">Document Extraction Precision</h4>
                <p style="font-size: 13px; color: var(--color-text-secondary); margin-top: 6px;">Across typed purchase order manifests and supplier quotation sheets.</p>
              </div>
              <div class="card" style="text-align: center; padding: 32px 20px;">
                <p style="font-size: 44px; font-weight: 800; color: var(--color-navy); line-height: 1;">0</p>
                <h4 style="font-size: 15px; font-weight: 700; color: var(--color-navy); margin-top: 10px;">Unrestricted SQL Execution</h4>
                <p style="font-size: 13px; color: var(--color-text-secondary); margin-top: 6px;">Deterministic AST verification blocks all destructive or out-of-scope database queries.</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Conversion / Hire Me Section -->
        <section id="contact" class="conversion-section">
          <div class="conversion-box">
            <span class="badge" style="background: rgba(255, 255, 255, 0.15); color: #FFFFFF; font-size: 12px; padding: 6px 14px;">
              Available for Custom Enterprise AI Development
            </span>

            <h2 class="conversion-headline">Have a Business Workflow to Automate?</h2>
            <p class="conversion-desc">
              Let's build an AI-powered solution tailored to your business processes. Whether you need autonomous multi-agent pipelines, OCR document extraction, natural language database copilots, or custom ERP/CRM integrations, I can architect and deliver it end-to-end.
            </p>

            <div class="conversion-ctas">
              <a href="mailto:solankidhaval355@gmail.com?subject=Project%20Inquiry:%20Custom%20AI%20Business%20Operations%20Platform" class="btn btn-primary btn-lg" style="background: #2563EB;">
                Discuss Your Project
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
              </a>
              <button id="landing-contact-explore-btn" class="btn btn-secondary btn-lg" style="background: rgba(255, 255, 255, 0.1); color: #FFFFFF; border-color: rgba(255, 255, 255, 0.2);">
                Explore AI Capabilities
              </button>
            </div>

            <p class="contact-config-notice">
              GitHub: <a href="https://github.com/dhaval-solanki-das" target="_blank" style="color: #93C5FD;">github.com/dhaval-solanki-das</a> • Portfolio Demo Sandbox
            </p>
          </div>
        </section>
      </div>
    `;

    // Event Listeners to launch app
    const launchApp = () => {
      if (typeof onNavigateToApp === 'function') {
        onNavigateToApp('dashboard');
      }
    };

    container.querySelector('#landing-launch-btn-top')?.addEventListener('click', launchApp);
    container.querySelector('#landing-launch-btn-hero')?.addEventListener('click', launchApp);
    container.querySelector('#landing-preview-enter-btn')?.addEventListener('click', launchApp);
    container.querySelector('#landing-contact-explore-btn')?.addEventListener('click', () => {
      if (typeof onNavigateToApp === 'function') onNavigateToApp('assistant');
    });
    container.querySelector('#landing-walkthrough-btn')?.addEventListener('click', () => {
      alert("Product Walkthrough: You are looking at the live interactive portfolio! Click 'Explore Live Demo' to test all interactive AI workflows, document OCR, voice operations, and role switching.");
    });
  }
}
