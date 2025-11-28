# TODO List - React Native Training Project

## 📊 Statistics

- **Consolidated tasks**: 2 tasks
- **Files affected**: 10 files

---

## 🔴 High Priority

### 1. Refactor navigation to use route.params instead of searchStore

**Files**: `SearchScreen` , `HomeScreen` , `searchStore.ts`

**Description**: Replace `searchStore` with `route.params` for passing search query and category id. Remove the store after migration.

---

### 2. Debug and fix crash issue with concurrent requests

**Files**: `SearchScreen/index.tsx` (line 91)
**Description**: Fix app crash when multiple requests are made simultaneously. Use reactotron-react-native to debug.

---

## 🎯 Implementation Order

1. **Task #2** - Fix critical crash bug
2. **Task #1** - Refactor navigation (foundation for other improvements)
