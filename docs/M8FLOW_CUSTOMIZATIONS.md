# M8Flow Customizations Applied

This document tracks all M8Flow customizations made to the codebase.

## Summary

✅ **SpiffWorkflow Logo** → **M8Flow Logo** (replaced)
✅ **Custom Sidebar Item** → "Sample Page" added
✅ **Custom Route** → `/sample-page` created
✅ **Extension System** → Fully operational

## Changes Made

### 1. Logo Replacement

**File Modified:** `spiffworkflow-frontend/src/components/SpiffLogo.tsx`

**Change:** Replaced SpiffWorkflow logo with M8Flow branding
- M8Flow gradient icon (purple/blue)
- "M8Flow" text instead of "Spiffworkflow"

**Location in UI:** Sidebar header (top left)

### 2. Sidebar Navigation Item Added

**File Modified:** `spiffworkflow-frontend/src/components/SideNav.tsx`

**Changes:**
1. Added "Sample Page" to `navItems` array (line ~237)
   ```typescript
   {
     text: 'Sample Page',
     icon: <Extension />,
     route: '/sample-page',
     id: 'm8flow-sample',
   }
   ```

2. Added route identifier for highlighting (line ~126)
   ```typescript
   else if (location.pathname === '/sample-page') {
     selectedTab = 'm8flow-sample';
   }
   ```

### 3. Custom Route Added

**File Modified:** `spiffworkflow-frontend/src/views/BaseRoutes.tsx`

**Changes:**
1. Imported SampleView component (line ~35)
   ```typescript
   import { SampleView } from '../../extensions/frontend/views';
   ```

2. Added route definition (line ~142)
   ```typescript
   <Route path="/sample-page" element={<SampleView />} />
   ```

### 4. Extension Components Created

**New Files in `extensions/frontend/`:**

#### `extensions/frontend/components/M8FlowLogo.tsx`
- M8Flow logo component
- Can be reused anywhere
- Import: `import { M8FlowLogo } from '@m8flow/components';`

#### `extensions/frontend/views/SampleView.tsx`
- Full-page sample view
- Demonstrates extension capabilities
- Shows cards with features, welcome message, tips

#### `extensions/frontend/views/index.ts`
- Exports all custom views
- Enables clean imports

### 5. Integration Layer Files

**New Files in `integration/frontend/`:**

#### `integration/frontend/Routes.extensions.tsx`
- Helper for route extensions
- Can be expanded for more routes

#### `integration/frontend/SideNav.extensions.tsx`
- Helper functions for sidebar customization
- Provides M8Flow logo and nav items

#### `integration/frontend/BaseRoutes.wrapper.tsx`
- Wrapper for BaseRoutes (alternative approach)
- Not currently used but available

#### `integration/frontend/SideNav.wrapper.tsx`
- Wrapper for SideNav (alternative approach)
- Not currently used but available

## Architecture Pattern

### Current Approach: Minimal Upstream Modifications

We made **minimal, clearly marked modifications** to upstream files:
- ✅ `SpiffLogo.tsx` - Logo replaced (marked with `// M8Flow:` comments)
- ✅ `SideNav.tsx` - One nav item added (marked with `// M8Flow:` comments)
- ✅ `BaseRoutes.tsx` - One route added (marked with `// M8Flow:` comments)

All M8Flow logic lives in:
- `extensions/frontend/` - Your custom components and views
- `integration/frontend/` - Integration helpers

### Why This Approach?

1. **Visibility**: Logo and sidebar items MUST be visible in UI
2. **Minimal Impact**: Only 3 files touched, ~10 lines added
3. **Clear Marking**: All changes marked with `// M8Flow:` comments
4. **Easy Removal**: Can be reverted by searching for `// M8Flow:`
5. **Easy Updates**: Minimal merge conflicts when pulling upstream

### Alternative Approaches Considered

#### ❌ Pure Extension System
- Would require complex HOC wrappers
- Harder to debug
- Less maintainable

#### ❌ Backend UI Schema
- Requires backend extension development
- More complex setup
- Overkill for simple nav items

#### ✅ Current: Minimal Marked Changes
- Simple and clear
- Easy to maintain
- Quick to implement
- Visible in UI immediately

## How to Add More Customizations

### Add Another Sidebar Item

1. **Create your view:**
   ```typescript
   // extensions/frontend/views/MyNewView.tsx
   export default function MyNewView() {
     return <div>My New Page</div>;
   }
   ```

2. **Export it:**
   ```typescript
   // extensions/frontend/views/index.ts
   export { default as MyNewView } from './MyNewView';
   ```

3. **Add to SideNav.tsx:**
   ```typescript
   // In navItems array, add:
   {
     text: 'My New Page',
     icon: <YourIcon />,
     route: '/my-new-page',
     id: 'm8flow-mynew',
   },
   ```

4. **Add route to BaseRoutes.tsx:**
   ```typescript
   import { MyNewView } from '../../extensions/frontend/views';
   // ...
   <Route path="/my-new-page" element={<MyNewView />} />
   ```

5. **Add route identifier (if needed for highlighting):**
   ```typescript
   // In SideNav.tsx, add to the if-else chain:
   else if (location.pathname === '/my-new-page') {
     selectedTab = 'm8flow-mynew';
   }
   ```

### Replace Other Components

Follow the same pattern:
1. Create component in `extensions/frontend/components/`
2. Export from `extensions/frontend/components/index.ts`
3. Minimal modification to upstream file with `// M8Flow:` comment
4. Use your component

## Testing

### Verify Changes Work

1. **Start dev server:**
   ```bash
   cd spiffworkflow-frontend
   npm start -- --config vite.config.m8flow.ts --host 0.0.0.0
   ```

2. **Check logo:**
   - Open browser to http://192.168.29.247:7001
   - Sidebar should show "M8Flow" logo (purple gradient icon)

3. **Check sidebar item:**
   - Sidebar should show "Sample Page" with Extension icon
   - Click it to navigate

4. **Check custom page:**
   - Should show sample view with cards
   - Should display welcome message and tips

### Expected Results

✅ Logo: M8Flow branding visible in sidebar
✅ Sidebar: "Sample Page" menu item visible
✅ Navigation: Clicking "Sample Page" works
✅ Route: `/sample-page` displays custom view
✅ Console: "M8Flow plugins initialized" message

## Rollback Instructions

To remove M8Flow customizations:

1. **Search for `// M8Flow:` comments** in:
   - `spiffworkflow-frontend/src/components/SpiffLogo.tsx`
   - `spiffworkflow-frontend/src/components/SideNav.tsx`
   - `spiffworkflow-frontend/src/views/BaseRoutes.tsx`

2. **Revert those sections** to original upstream code

3. **Delete extension files** (optional):
   - `extensions/frontend/components/M8FlowLogo.tsx`
   - `extensions/frontend/views/SampleView.tsx`
   - `integration/frontend/Routes.extensions.tsx`
   - `integration/frontend/SideNav.extensions.tsx`

## Maintenance

### Pulling Upstream Updates

When pulling SpiffArena updates:

1. **Conflicts likely in:**
   - `SpiffLogo.tsx`
   - `SideNav.tsx`
   - `BaseRoutes.tsx`

2. **Resolution strategy:**
   - Accept upstream changes
   - Re-apply M8Flow modifications (marked with `// M8Flow:`)
   - Test thoroughly

3. **Search for:**
   ```bash
   git grep "M8Flow:"
   ```
   To find all customization points.

## Future Enhancements

Possible improvements:

1. **More sophisticated logo** - Use actual SVG/image file
2. **Dynamic sidebar items** - Load from configuration
3. **Permission-based nav items** - Show based on user roles
4. **Nested menu items** - Submenu support
5. **Icon customization** - Custom icon library

## Questions?

See:
- [Frontend Development Guide](getting-started/frontend-development.md)
- [Extension Development Guide](getting-started/extension-development.md)
- [Architecture Overview](ARCHITECTURE.md)

---

**Last Updated:** January 7, 2026
**M8Flow Version:** 1.0.0
**Based on SpiffArena:** Latest

