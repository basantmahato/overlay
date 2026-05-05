# Project TODO - Sports Broadcast Overlay Platform

> Prioritized tasks for improving the scalable template system.

---

## 🔴 High Priority (Must Do)

### 1. Recreate temp1 Components
**Status:** Deleted, needs recreation  
**Template:** `football-modern-glass`  
**Impact:** System currently has only 1 working template

- [ ] Create `frontend/components/template/temp1/dashboard.tsx`
- [ ] Create `frontend/components/template/temp1/overlay.tsx`
- [ ] Create `frontend/components/template/temp1/index.ts`
- [ ] Register in `frontend/lib/componentRegistry.ts`
- [ ] Add thumbnail mapping in `templates/page.tsx`

**Estimated Time:** 1-2 hours

---

### 2. Create Basketball Template Components
**Status:** Config exists in seed, no frontend components  
**Template:** `basketball-modern`  
**Impact:** Second sport support

- [ ] Uncomment template in `backend/prisma/seeds/templateSeed.js`
- [ ] Create `frontend/components/template/basketball/modern/dashboard.tsx`
- [ ] Create `frontend/components/template/basketball/modern/overlay.tsx`
- [ ] Create `frontend/components/template/basketball/modern/index.ts`
- [ ] Register in `frontend/lib/componentRegistry.ts`
- [ ] Run `npm run seed:templates`
- [ ] Add thumbnail mapping

**Estimated Time:** 2-3 hours

---

### 3. Create Tennis Template Components
**Status:** Config exists in seed, no frontend components  
**Template:** `tennis-scoreboard`  
**Impact:** Third sport support

- [ ] Uncomment template in `backend/prisma/seeds/templateSeed.js`
- [ ] Create `frontend/components/template/tennis/scoreboard/dashboard.tsx`
- [ ] Create `frontend/components/template/tennis/scoreboard/overlay.tsx`
- [ ] Create `frontend/components/template/tennis/scoreboard/index.ts`
- [ ] Register in `frontend/lib/componentRegistry.ts`
- [ ] Run `npm run seed:templates`
- [ ] Add thumbnail mapping

**Estimated Time:** 2-3 hours

---

### 4. Create Cricket Template Components
**Status:** Config exists in seed, no frontend components  
**Template:** `cricket-t20`  
**Impact:** Fourth sport support

- [ ] Uncomment template in `backend/prisma/seeds/templateSeed.js`
- [ ] Create `frontend/components/template/cricket/t20/dashboard.tsx`
- [ ] Create `frontend/components/template/cricket/t20/overlay.tsx`
- [ ] Create `frontend/components/template/cricket/t20/index.ts`
- [ ] Register in `frontend/lib/componentRegistry.ts`
- [ ] Run `npm run seed:templates`
- [ ] Add thumbnail mapping

**Estimated Time:** 2-3 hours

---

## 🟡 Medium Priority (Should Do)

### 5. Auto-Discover Template Components
**Status:** Manual registration required  
**Impact:** Developer experience improvement

**Current Problem:**
```typescript
// Must manually import and register each template
import { Temp2Dashboard } from '@/components/template/temp2';
dashboardRegistry['FootballBroadcastDashboard'] = Temp2Dashboard;
```

**Solution:**
- [ ] Implement auto-discovery from `components/template/` directory
- [ ] Use file system API to scan for `index.ts` files
- [ ] Auto-register components based on exports
- [ ] Remove manual registration from `componentRegistry.ts`

**Estimated Time:** 4-6 hours

---

### 6. Type-Safe MatchState with Generics
**Status:** Uses `Record<string, any>` (flexible but no IntelliSense)  
**Impact:** Better developer experience

**Current Problem:**
```typescript
export type MatchState = Record<string, any>;
// No IntelliSense for template-specific fields
```

**Solution:**
- [ ] Define generic interface per template
- [ ] Update `DashboardProps` and `OverlayProps` to use generics
- [ ] Add type inference from template config
- [ ] Maintain backwards compatibility

**Estimated Time:** 3-4 hours

---

### 7. Store Thumbnails in Template Config
**Status:** Hardcoded mapping in `templates/page.tsx`  
**Impact:** Easier template addition

**Current Problem:**
```typescript
const getThumb = (id: string) => {
  if (id === 'football-broadcast-pro') return '/temp2_thumb.png';
  // Must add each template manually
}
```

**Solution:**
- [ ] Add `thumbnail` field to `template.configJson`
- [ ] Update seed files with thumbnail paths
- [ ] Remove hardcoded `getThumb` function
- [ ] Use `template.configJson.thumbnail` directly

**Estimated Time:** 1-2 hours

---

### 8. Add Template Versioning
**Status:** No version tracking  
**Impact:** Template updates without breaking existing overlays

**Solution:**
- [ ] Add `version` field to Template model
- [ ] Add `version` to `template.configJson`
- [ ] Update overlay creation to snapshot template version
- [ ] Add migration system for template updates

**Estimated Time:** 4-5 hours

---

## 🟢 Low Priority (Nice to Have)

### 9. Runtime Component Loading
**Status:** Requires rebuild for new templates  
**Impact:** Zero-downtime template addition

**Solution:**
- [ ] Implement dynamic import for components
- [ ] Use React.lazy() for code splitting
- [ ] Load components on-demand from template config
- [ ] Remove build step requirement

**Estimated Time:** 6-8 hours

---

### 10. Template Marketplace UI
**Status:** No UI for browsing templates  
**Impact:** Better user experience

**Solution:**
- [ ] Create template preview page
- [ ] Add template search/filter
- [ ] Show template features and fields
- [ ] One-click template installation

**Estimated Time:** 8-10 hours

---

### 11. Template Validation
**Status:** No validation of template config  
**Impact:** Prevents configuration errors

**Solution:**
- [ ] Add JSON schema validation for `configJson`
- [ ] Validate component names exist in registry
- [ ] Validate `defaultState` structure
- [ ] Add validation error messages

**Estimated Time:** 3-4 hours

---

### 12. Template Export/Import
**Status:** No way to share templates  
**Impact:** Community templates

**Solution:**
- [ ] Add export template to JSON
- [ ] Add import template from JSON
- [ ] Include components in export
- [ ] Add template sharing UI

**Estimated Time:** 6-8 hours

---

## 📋 Quick Wins (Under 1 Hour)

- [ ] Add more template thumbnails (currently only temp2)
- [ ] Fix remaining TypeScript strict mode warnings
- [ ] Add loading states for dashboard/overlay
- [ ] Add error boundaries for component loading
- [ ] Improve error messages for missing components
- [ ] Add template usage analytics

---

## 🎯 Recommended Order

1. **Recreate temp1** (High Priority #1) - System needs 2 templates
2. **Basketball template** (High Priority #2) - Second sport
3. **Store thumbnails in config** (Medium Priority #7) - Quick win
4. **Auto-discover components** (Medium Priority #5) - Major DX improvement
5. **Type-safe MatchState** (Medium Priority #6) - Better IDE support

---

## 📊 Progress Tracking

| Category | Done | Total | Progress |
|----------|------|-------|----------|
| High Priority | 0 | 4 | 0% |
| Medium Priority | 0 | 4 | 0% |
| Low Priority | 0 | 4 | 0% |
| Quick Wins | 0 | 6 | 0% |
| **Overall** | **0** | **18** | **0%** |

---

## 🔗 Related Documentation

- [README.md](README.md) - System overview
- [backend.md](backend.md) - Backend architecture
- [frontend.md](frontend.md) - Frontend component registry
- [schema.md](schema.md) - Database schema
- [routes.md](routes.md) - API reference
