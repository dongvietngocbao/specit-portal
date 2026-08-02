# SpecIt — Architecture Blueprint (Module 0)

> **Source of Truth**: Canonical Schema v3, API v1 Contract, Engine Flow v3.1
> **Last Updated**: 2026-08-01

## 1. System Topology

```
┌─────────────────────────────────────────────────────────────────────┐
│                     SPECIT PLATFORM (Monorepo)                       │
│                                                                      │
│  ┌──────────────┐   ┌──────────────┐   ┌─────────────────────────┐ │
│  │  @specit/    │   │  Supplier    │   │  API Server             │ │
│  │  canonical-  │←──│  Portal      │←──│  (NestJS + Prisma)      │ │
│  │  schema      │   │  (Next.js)   │   │                         │ │
│  │              │   │              │   │  ┌─── PostgreSQL ───┐   │ │
│  │ • 16 types   │   │ • React 19   │   │  │ SKU / Users /    │   │ │
│  │ • 80+ fields │   │ • Tailwind 4 │   │  │ Orgs / Assets    │   │ │
│  │ • Scoring    │   │ • Shadcn     │   │  └──────────────────┘   │ │
│  │ • API types  │   │ • TanStack   │   │  ┌─── Redis ─────────┐  │ │
│  │ • Type×Field │   │ • Zustand    │   │  │ BullMQ jobs       │  │ │
│  │   Matrix     │   │ • RHF + Zod  │   │  └──────────────────┘   │ │
│  └──────────────┘   └──────┬───────┘   │  ┌─── MinIO ─────────┐  │ │
│         ↑                   │           │  │ Assets / PDFs     │  │ │
│         │                   │           │  └──────────────────┘   │ │
│         └───────────────────┴───────────┤  JWT Auth               │ │
│                                         └──────────┬──────────────┘ │
└────────────────────────────────────────────────────┼────────────────┘
                                                     │ /v1 API
                                                     ▼
                                    ┌────────────────────────────┐
                                    │  SPEC ENGINE (EXTERNAL)    │
                                    │  • AI Extraction           │
                                    │  • Schema Mapping          │
                                    │  • Matching Engine         │
                                    │  • Completeness Calc       │
                                    │  • Demand Aggregation      │
                                    │  (Supplier Portal calls    │
                                    │   this via API only —      │
                                    │   never accesses Engine    │
                                    │   internals directly)      │
                                    └────────────────────────────┘
```

## 2. Monorepo Structure

```
specit-platform/
├── package.json              # Workspace root
├── pnpm-workspace.yaml       # Workspace config
├── .npmrc                    # Build script allowlist
├── .nvmrc                    # Node 22
│
├── packages/
│   └── canonical-schema/     # 🔒 THE MOAT — shared types + scoring
│       ├── src/
│       │   ├── index.ts              # Public API barrel
│       │   ├── tiers.ts              # T0/T1/T2/T3/SYS + weights
│       │   ├── material-types.ts     # 16 material type definitions
│       │   ├── fields.ts             # 80+ canonical field definitions
│       │   ├── type-field-matrix.ts  # Type × Field applicability
│       │   ├── scoring.ts            # Completeness scoring engine
│       │   └── api-types.ts          # API v1 wire types
│       └── package.json
│
├── apps/
│   ├── supplier-portal/      # Next.js 15 frontend
│   │   ├── src/
│   │   │   ├── app/                  # App Router
│   │   │   ├── components/           # Reusable UI components
│   │   │   ├── lib/                  # Utilities, API client
│   │   │   ├── hooks/                # Custom hooks
│   │   │   ├── stores/               # Zustand stores
│   │   │   └── types/                # Frontend-specific types
│   │   ├── next.config.ts
│   │   └── package.json
│   │
│   └── api-server/           # NestJS backend
│       ├── src/
│       │   ├── main.ts               # Bootstrap + Swagger
│       │   ├── app.module.ts         # Root module
│       │   ├── prisma/               # PrismaModule + Service
│       │   ├── modules/              # Feature modules (auth, sku, etc.)
│       │   └── common/               # Guards, decorators, interceptors
│       ├── prisma/
│       │   └── schema.prisma         # Full domain model
│       └── package.json
```

## 3. The Canonical Schema Package — Why It Exists

**This package IS the competitive moat.** Every material type, every field definition, every scoring rule lives here as executable TypeScript. Benefits:

1. **Single Source of Truth** — Frontend, backend, and tests import the same definitions. No drift.
2. **Type Safety** — If you add a field to the schema, TypeScript tells you everywhere it needs handling.
3. **Scoring Consistency** — The completeness score calculation is identical on server and client. No "the backend says 67 but the UI shows 72."
4. **Registry Extensibility** — Adding material type #17 = add one entry to `MATERIAL_TYPES`. Zero code changes elsewhere.

### Scoring Algorithm (from Sheet 08)

```
score = Σ(filled field weights) / Σ(all applicable weights) × 100

Required field (●) = weight 3
Optional field (○) = weight 1
Not applicable (—) = excluded from denominator

Bands:
  0–40%   → draft       (hidden from architects)
  41–64%  → partial     (visible, "Missing data" badge)
  65–79%  → active      (normal display)
  80–89%  → active ★    (Verified badge, priority recommend)
  90–100% → active ★★   (Premium badge, top recommend)
```

## 4. Database Design for 10M+ SKUs

| Decision | Rationale |
|---|---|
| Flat `skus` table with JSONB `payload` | Not EAV — JSONB gives O(1) reads, GIN index for type-specific queries |
| Matching fields as indexed columns | Denormalized from payload for search performance (Layer 1 vs Layer 2) |
| Multi-tenant from day 1 | `organization_id` on every table; ready for row-level security |
| Cursor-based pagination | `next_cursor` in API — handles 10M rows without offset degradation |
| Append-only audit trail | `audit_logs` table — never update, always insert |
| Completeness score cached | Stored on `skus` row — recalculated on update, not on every read |

## 5. API Boundary — What Supplier Portal Owns

**Supplier Portal DOES:**
- User authentication (login, register, password reset)
- Organization/team management
- SKU CRUD (create, read, update, status change)
- File upload (PDF/Excel → sends to Spec Engine for extraction)
- Media management (asset upload to MinIO)
- Analytics display (reads aggregated data)
- Demand signal display (reads spec_count)
- Dealer pricing management
- Notifications

**Supplier Portal DOES NOT (Spec Engine owns):**
- AI extraction logic
- Schema mapping
- Completeness calculation (uses canonical-schema package locally for UI preview, but the authoritative score comes from Spec Engine)
- Matching engine
- Price intelligence aggregation
- BOM normalization

**Communication**: All cross-block communication goes through `specit-api-v1.yaml` endpoints. Never direct DB access between blocks.

## 6. Module Build Order

| Module | Status | Dependencies |
|---|---|---|
| 0. Foundation | ✅ Complete | — |
| 1. Authentication | Next | Module 0 |
| 2. Workspace/Org/Team | Next | Module 1 |
| 3. Dashboard | Next | Module 2 |
| 4. SKU Management | Next | Module 2 |
| 5. Upload Center | Next | Module 4 |
| 6. Media Library | Next | Module 4 |
| 7. Validation + Completeness | Next | Module 4 |
| 8. Analytics | Next | Module 4 |
| 9. Demand Signal | Next | Module 4 |
| 10. Dealer Pricing | Next | Module 4 |
| 11. Notifications | Next | Module 1 |
| 12. Settings | Next | Module 2 |
