# Streamlining Email Production: “Compose → Publish” Doc-to-Braze Workflow

### Why this matters  
Marketers lose hours copying, pasting, re-formatting, and QA-ing message variants as they shuttle text from Google Docs into Braze. The manual hand-off introduces errors (curly quotes, broken links, missing personalization tags) and slows iteration. A focused “compose-and-publish” editor eliminates the swivel-chair work, lets teams ship campaigns faster, and keeps copy, metadata, and approvals in one place.

## Vision

Build a lightweight, document-style editor where:
1. Writers draft email/SMS/push copy using familiar rich-text tools.
2. Each “content block” stores both human-readable text and structured fields Braze expects (subject line, preview, UTM params, Liquid personalization, locale, channel, etc.).
3. With one click, the document pushes updates via Braze’s REST API to:
   -  Email templates  
   -  Campaign messages  
   -  Content Blocks or Catalogs  
4. Round-trip sync pulls live content back from Braze so the doc stays the single source of truth.

## Core Product Requirements

| Area | Must-Have | Nice-to-Have |
|---|---|---|
|Editor | -  Google-Docs-like UX (headings, bullets, comments, real-time collaboration).<br>-  Slash-commands to insert personalization variables and Liquid snippets.<br>-  Side panel for subject line, preview text, targeting notes. | -  AI assist for tone, length, grammar.<br>-  Version diff viewer. |
|Braze Integration | -  OAuth/Service-Account auth.<br>-  Map doc “blocks” to Braze template IDs.<br>-  Push/patch via Template, Campaign, and Content Blocks endpoints.<br>-  Validate Liquid syntax before upload. | -  Fetch analytics (open, click) and surface inline. |
|Collaboration & Approval | -  Commenting, @mentions, resolve threads.<br>-  Status tags: Draft → Review → Approved → Published. | -  e-sign or Slack approval workflow. |
|Change Log | -  Timestamped history of every push to Braze with user, template ID, diff. | -  Rollback button that re-publishes previous revision. |
|Deployment | -  Web app (React/Next.js) with Node.js backend (Express or Nest). | -  Chrome extension that activates inside Google Docs. |

## Technical Architecture (High Level)

1. **Frontend (React + Slate.js)**  
   -  Rich-text editor → outputs Markdown + metadata JSON.

2. **API Layer (Node.js)**  
   -  Auth: JWT or Braze service key stored in Vault.  
   -  Routes: /templates/:id (GET/PUT), /campaigns/:id/messages (PATCH).  
   -  Liquid parser (npm `liquidjs`) for validation.

3. **Database**  
   -  PostgreSQL: documents, block mappings, push logs, user roles.  
   -  Optionally Dynamo for drafts if you want serverless speed.

4. **Sync Worker**  
   -  Queue (BullMQ) processes outbound pushes, retries, logs diff.

5. **Webhooks**  
   -  Braze Template Updated → trigger doc refresh to avoid drift.

## User Flow

1. Marketer creates new “Email Doc” → selects existing Braze template or “create new”.
2. Draft copy, insert tags (e.g., `{{first_name}}`), add subject/preview in side panel.
3. Hit “Validate” → checks Liquid, required merge tags, length limits.
4. Click “Publish to Braze” → confirm modal lists impacted templates/messages.
5. System calls Braze API, updates content, returns success + preview URL.
6. Status badge flips to “Published” with timestamp; diff stored.

## Implementation Phases

### Phase 1 – Proof of Concept (4–6 weeks)
-  Stand-alone editor, manual login with Braze REST key.  
-  Supports Email Templates only (HTML & Text).  
-  One-way push; no pull-back sync.  
-  Basic validation and change log.

### Phase 2 – Collaboration & Multi-Channel (6–8 weeks)
-  Real-time co-editing, comments, approvals.  
-  Add SMS and Push channels.  
-  Pull existing template content into doc on open.

### Phase 3 – Enterprise Hardening (8+ weeks)
-  OAuth with Braze service accounts.  
-  Slack/Teams approval flow, role-based permissions.  
-  Analytics preview panel (opens, clicks) retrieved via Braze export APIs.  
-  Rollback & differential deployment (only changed blocks).

## Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
|Liquid syntax breaks rendering | High | Pre-push validation; unit tests on common tag sets. |
|Braze rate limits/throttling | Medium | Queue with exponential backoff; respect 25 requests/sec limit. |
|Content drift if someone edits directly in Braze | Medium | Webhook listener + banner warning in doc when divergence detected. |
|Security of API keys | High | OAuth preferred; else store keys encrypted with KMS and restrict scopes. |

## Next Steps

1. Validate with 3–5 power users: capture current doc-to-Braze pain points and preferred UI.
2. Build Phase 1 MVP; integrate only Email Template endpoint to prove push works end-to-end.
3. Dog-food on one upcoming campaign at Mudflap; measure time saved vs. Google Docs workflow.
4. Iterate on UX: tag insertion shortcuts, diff viewer, comment resolution.
5. Plan Phase 2 funding once MVP demonstrates ≥50% reduction in copy-to-template turnaround time.

A focused editor that *writes like Google Docs but publishes like Git* turns content ops from tedious copy-paste to a single-click deploy, freeing marketers to iterate on messaging instead of fighting tools.

Sources
