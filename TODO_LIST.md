# TODO List - React Native Training Project

## 📊 Statistics

- **Total TODO items**: 44 occurrences
- **Consolidated tasks**: 7 tasks
- **Files affected**: 18 files

---

## 🔴 High Priority

### 1. Refactor navigation to use route.params instead of searchStore

**Files**: `SearchScreen`, `HomeScreen`, `searchStore.ts`
**Description**: Replace `searchStore` with `route.params` for passing search query and category id. Remove the store after migration.

---

### 2. Debug and fix crash issue with concurrent requests

**Files**: `SearchScreen/index.tsx` (line 91)
**Description**: Fix app crash when multiple requests are made simultaneously. Use reactotron-react-native to debug.

---

## 🟡 Medium Priority

### 3. (Done) Optimize zustand store usage with selectors

**Files**: 8 files (hooks: `useAuthActions`, `useCart`, `useWishlist`; screens: `LoginScreen`, `RegisterScreen`, `ProductDetailsScreen`, `CartScreen`, `CheckoutScreen`)
**Description**: Replace direct destructuring with selector functions to prevent unnecessary re-renders.

---

### 4. Extract constants for query keys and hardcoded strings

**Files**: `useProduct.ts`, `useWishlist.ts`, `HomeScreen`, `ProductDetailsScreen`, `useFilterModal.ts`
**Description**: Create constants file for React Query keys and extract all hardcoded strings (product list types, alert messages, filter labels).

---

### 5. Improve navigation type safety and code organization

**Files**: `HomeScreen`, `navigation.ts`, `useAuthActions.ts`, `useCart.ts`, `cart.ts`, `wishlist.ts`

**Description**:

- Fix navigation type checking (use direct `navigation.navigate` instead of `getParent()`)
- Convert navigation interfaces to types
- Split large hooks/services into smaller, focused modules

---

### 6. Configure API client and implement missing features

**Files**: `apiClient.ts`, `BottomTabHeader`, `useHydration.ts`, `CheckoutScreen`

**Description**:

- Set API client auth to `true` by default
- Implement menu functionality
- Show onboarding screen only once after installation
- Replace `setTimeout` with `useDebounce` hook

---

## 🟢 Low Priority

### 7. Clean up unused files

**Files**: `services/index.ts`
**Description**: Remove or update unused/empty files.

---

## 🎯 Implementation Order

1. **Task #2** - Fix critical crash bug
2. **Task #1** - Refactor navigation (foundation for other improvements)
3. **Task #3** - Performance optimization (zustand selectors) - Done
4. **Task #4** - Code quality (constants extraction)
5. **Task #5** - Type safety and code organization
6. **Task #6** - API config and features
7. **Task #7** - Cleanup
