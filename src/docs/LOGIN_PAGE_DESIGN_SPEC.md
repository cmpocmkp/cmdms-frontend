# Login Page Design Specification - Old CMDMS Exact Replica

**Created:** December 15, 2025  
**Source:** `resources/views/auth/login.blade.php`  
**Status:** 📋 SPECIFICATION ONLY (Implementation Pending)

---

## 🎯 PRIMARY OBJECTIVE

**Replicate the old CMDMS login page EXACTLY:**
- Same layout structure
- Same visual design
- Same glassmorphism effect
- Same colors, spacing, and styling
- Same background image
- Same logo positioning
- Same form inputs with icons
- Same button styling

**Per CURSOR_CONTEXT.md:**
> "Replicate the existing CMDMS UI structure and layout exactly. Visual design MAY be enhanced (spacing, shadows, hover states, feedback). No redesign, no feature removal, no UX flow changes."

---

## 📋 STRUCTURE ANALYSIS

### HTML Structure (Exact from Blade)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- CSS Links -->
  - Themify Icons
  - Vendor bundle (Bootstrap, etc.)
  - Vertical layout light theme
  - Favicon
</head>
<body>
  <div class="loginMain">
    <div class="row d-flex justify-content-center align-items-center h-100">
      <div class="col-xs-12 col-sm-12 col-md-8 col-lg-6 col-xl-4 mx-auto">
        <div class="logindiv">
          <div class="logo">
            <img src="cm-dm.png" alt="">
          </div>
          <form class="pt-3" method="POST">
            <!-- Email Field -->
            <div class="form-group">
              <label for="exampleInputEmail">Email</label>
              <div class="input-group">
                <div class="input-group-prepend bg-transparent">
                  <span class="input-group-text">
                    <i class="ti-user text-primary"></i>
                  </span>
                </div>
                <input type="email" class="form-control" name="email" required autofocus>
                <!-- Error message span -->
              </div>
            </div>
            
            <!-- Password Field -->
            <div class="form-group">
              <label for="exampleInputPassword">Password</label>
              <div class="input-group">
                <div class="input-group-prepend bg-transparent">
                  <span class="input-group-text">
                    <i class="ti-lock text-primary"></i>
                  </span>
                </div>
                <input type="password" class="form-control" name="password" required>
                <!-- Error message span -->
              </div>
            </div>
            
            <!-- Empty div for spacing -->
            <div class="my-2 d-flex justify-content-between align-items-center">
              <!-- Empty - no remember me or forgot password -->
            </div>
            
            <!-- Submit Button -->
            <div class="my-3">
              <button type="submit" class="btn">Login</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  
  <!-- JavaScript -->
  - vendor.bundle.base.js
  - off-canvas.js
  - hoverable-collapse.js
  - template.js
  - settings.js
  - todolist.js
</body>
</html>
```

---

## 🎨 VISUAL DESIGN SPECIFICATION

### 1. **Container (.loginMain)**

**Purpose:** Full-screen background container

**CSS Properties:**
```css
.loginMain {
  width: 100%;
  height: 100vh;
  min-height: 600px;
  background: url("../../images/dashboard/icons/loginbg.png") no-repeat;
  background-position: center;
  background-size: cover;
}
```

**Description:**
- Full viewport height (100vh)
- Minimum height of 600px
- Background image: `loginbg.png` (from dashboard/icons/)
- Background covers entire screen
- Centered positioning

**Background Image:**
- Location: `/admin_assets/images/dashboard/icons/loginbg.png`
- ✅ Already exists in old CMDMS
- Status: **MUST be copied to new frontend**

---

### 2. **Login Card (.logindiv)**

**Purpose:** Glassmorphism card containing login form

**CSS Properties:**
```css
.logindiv {
  width: 100%;
  height: 500px;
  border-radius: 40px;
  background: rgba(255, 255, 255, 0.4);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 10px !important;
}
```

**Visual Effects:**
- **Glassmorphism** (frosted glass effect)
- Semi-transparent white background (40% opacity)
- Backdrop blur filter (5px)
- Rounded corners (40px border-radius)
- Subtle shadow
- White border with 30% opacity

**Dimensions:**
- Width: 100% (of column)
- Height: Fixed 500px
- Padding: 10px

**Responsive Columns:**
- XS/SM: col-12 (full width)
- MD: col-8 (66% width)
- LG: col-6 (50% width)
- XL: col-4 (33% width)
- All with `mx-auto` for centering

---

### 3. **Logo Section (.logindiv .logo)**

**CSS Properties:**
```css
.logindiv .logo {
  width: 100%;
  text-align: center;
  padding: 30px;
}

.logindiv .logo img {
  width: 300px;
}
```

**Details:**
- Centered logo
- 30px padding around logo
- Logo width: 300px
- Image: `cm-dm.png` (CMDMS logo with CM photo)

**Logo Image:**
- Location: `/admin_assets/images/dashboard/icons/cm-dm.png`
- ✅ Already exists in old CMDMS
- Status: **MUST be copied to new frontend**

---

### 4. **Form Container (.logindiv form)**

**CSS Properties:**
```css
.logindiv form {
  width: 80%;
  margin: 0 auto;
}
```

**Details:**
- Form is 80% width of card
- Centered with auto margins
- Padding top: `pt-3` class

---

### 5. **Input Groups (.logindiv .input-group)**

**CSS Properties:**
```css
.logindiv .input-group {
  border-radius: 10px !important;
  overflow: hidden !important;
  border: thin solid #787878 !important;
}

.logindiv .input-group .input-group-text {
  background: transparent !important;
  border: 0 !important;
}

.logindiv .input-group .input-group-text i {
  color: #787878 !important;
}

.logindiv .input-group input {
  border: 0 !important;
}
```

**Visual Details:**
- Rounded corners: 10px
- Gray border: #787878 (thin solid)
- Icon prepend section:
  - Transparent background
  - No border
  - Gray icon color (#787878)
- Input field:
  - No border (border on container only)
  - Default Bootstrap styling

**Icons Used:**
- Email field: `ti-user` (Themify Icons)
- Password field: `ti-lock` (Themify Icons)

---

### 6. **Submit Button (.logindiv button)**

**CSS Properties:**
```css
.logindiv button {
  background-color: #247b2d !important;
  width: 100% !important;
  color: #fff !important;
  border-radius: 10px;
}
```

**Details:**
- Full width button
- Green background: #247B2D (KP Government green)
- White text
- Rounded corners: 10px
- No hover state defined (default Bootstrap)

---

## 🎨 COLOR PALETTE

| Element | Color | Usage |
|---------|-------|-------|
| Button Background | `#247B2D` | Primary green (KP Gov) |
| Input Border | `#787878` | Gray border |
| Icon Color | `#787878` | Gray icons |
| Card Background | `rgba(255, 255, 255, 0.4)` | Glassmorphism white 40% |
| Card Border | `rgba(255, 255, 255, 0.3)` | Glassmorphism border 30% |
| Text | Default | Bootstrap default (dark) |
| Button Text | `#FFFFFF` | White |

---

## 📐 SPACING & DIMENSIONS

| Element | Property | Value |
|---------|----------|-------|
| Login Card | Height | 500px |
| Login Card | Border Radius | 40px |
| Login Card | Padding | 10px |
| Logo Section | Padding | 30px |
| Logo Image | Width | 300px |
| Form Container | Width | 80% of card |
| Form | Padding Top | `pt-3` (~1rem) |
| Input Groups | Border Radius | 10px |
| Button | Border Radius | 10px |
| Spacing between fields | Margin | `my-2`, `my-3` |

---

## 🔤 TYPOGRAPHY

**Form Labels:**
- Default Bootstrap label styling
- Labels: "Email", "Password"

**Button Text:**
- Text: "Login"
- Color: White
- Default Bootstrap button font

**No custom fonts specified** - uses theme default (likely system font stack)

---

## 📱 RESPONSIVE BEHAVIOR

### Grid System (Bootstrap)

**Column Classes:**
```html
col-xs-12 col-sm-12 col-md-8 col-lg-6 col-xl-4 mx-auto
```

**Breakpoints:**
- **XS/SM (< 768px):** Full width (col-12)
- **MD (768px+):** 66% width (col-8)
- **LG (992px+):** 50% width (col-6)
- **XL (1200px+):** 33% width (col-4)

**Center Alignment:**
- `mx-auto` centers the column
- `d-flex justify-content-center align-items-center h-100` centers content vertically and horizontally

**Card Height:**
- Fixed 500px height
- No mobile-specific adjustments

---

## 🔧 INTERACTIVE ELEMENTS

### Form Fields

**Email Input:**
- Type: `email`
- Name: `email`
- Required: Yes
- Autofocus: Yes
- Autocomplete: `email`
- Icon: `ti-user` (Themify)
- Validation: Email format + required

**Password Input:**
- Type: `password`
- Name: `password`
- Required: Yes
- Autocomplete: `current-password`
- Icon: `ti-lock` (Themify)
- Validation: Required

### Error Handling

**Error Display:**
```blade
@error('email')
  <span class="invalid-feedback" role="alert">
    <strong>{{ $message }}</strong>
  </span>
@enderror
```

**Bootstrap Validation Classes:**
- `.is-invalid` added to input when error
- `.invalid-feedback` shown below input

### Submit Button

**Type:** `submit`
**Text:** "Login"
**Full width button**
**No loading state** in old design

---

## 🧩 ASSETS REQUIRED

### Images to Copy:

1. **Login Background:**
   - Source: `/cmdms/public/admin_assets/images/dashboard/icons/loginbg.png`
   - Destination: `/CMDMS_FRONTEND/public/admin_assets/images/dashboard/icons/loginbg.png`
   - Status: ⚠️ **MUST COPY**

2. **Logo Image:**
   - Source: `/cmdms/public/admin_assets/images/dashboard/icons/cm-dm.png`
   - Destination: `/CMDMS_FRONTEND/public/admin_assets/images/dashboard/icons/cm-dm.png`
   - Status: ⚠️ **MUST COPY**

### CSS Already Copied:
- ✅ Themify Icons
- ✅ Vendor bundle CSS
- ✅ Vertical layout light theme CSS
- ✅ All login styles included in theme CSS

### JavaScript Required:
- Vendor bundle (Bootstrap JS for form validation display)
- Other JS files can be optional for basic login

---

## 🔐 AUTHENTICATION FLOW (Per Blade)

### Form Submission

**Old CMDMS (Blade):**
```blade
<form method="POST" action="{{ route('login') }}">
  @method('post')
  @csrf
  <!-- fields -->
</form>
```

**Backend Route:**
- POST to `route('login')` 
- Laravel handles authentication
- CSRF token required

### New Frontend (Mock - as per CURSOR_CONTEXT.md)

**Per context:** "Use mock data or temporary interfaces until backend is defined"

**Approach:**
1. Form submits to mock authentication in `authStore`
2. Use mock users from `/src/lib/mocks/data/users.ts`
3. Validate email/password against mock data
4. Redirect to dashboard on success
5. Show error messages on failure
6. NO real backend calls yet

**Authentication State:**
- Use `authStore.login()` method
- Store user in Zustand state
- Redirect based on role

---

## 🎨 VISUAL ENHANCEMENTS ALLOWED

Per CURSOR_CONTEXT.md:
> "Visual design MAY be enhanced (spacing, shadows, hover states, feedback)"

### Allowed Enhancements:

✅ **Can Add:**
- Button hover state (darken green on hover)
- Input focus state (border color change)
- Loading spinner on button during submit
- Smooth transitions (fade in, slide up)
- Better error message styling
- Password visibility toggle icon
- Form field animations

❌ **Cannot Change:**
- Layout structure (must stay centered glassmorphism card)
- Button position or size
- Logo position or size
- Color scheme (must keep green #247B2D)
- Card dimensions or glassmorphism effect
- Input field structure (prepend icons must stay)

---

## 📝 IMPLEMENTATION CHECKLIST

### Phase 1: Assets
- [ ] Copy `loginbg.png` to new frontend
- [ ] Copy `cm-dm.png` to new frontend
- [ ] Verify CSS is already loaded in index.html
- [ ] Verify Themify icons are working

### Phase 2: Component Structure
- [ ] Create `LoginPage.tsx` component
- [ ] Match exact HTML structure from Blade
- [ ] Use same Bootstrap classes
- [ ] Add Themify icon classes

### Phase 3: Styling
- [ ] Apply glassmorphism card styles
- [ ] Ensure background image loads
- [ ] Match input group styling
- [ ] Match button styling
- [ ] Test responsive behavior

### Phase 4: Functionality
- [ ] Add form validation (react-hook-form + zod)
- [ ] Connect to `authStore.login()`
- [ ] Handle error display
- [ ] Add loading state
- [ ] Implement redirects

### Phase 5: Enhancements (Optional)
- [ ] Add hover states
- [ ] Add focus states
- [ ] Add transitions
- [ ] Add password visibility toggle
- [ ] Improve error messages

### Phase 6: Testing
- [ ] Visual comparison with old CMDMS
- [ ] Test all form validations
- [ ] Test mock authentication
- [ ] Test responsive layouts
- [ ] Test error handling

---

## 🔄 BLADE → REACT CONVERSION MAPPING

| Blade Element | React Equivalent |
|---------------|------------------|
| `{{ asset('path') }}` | `/path` (public folder) |
| `{{ route('login') }}` | `handleSubmit()` function |
| `@csrf` | Not needed (JWT/token will be in API layer) |
| `@error('email')` | `{errors.email && <span>}` (react-hook-form) |
| `{{ old('email') }}` | Form state (react-hook-form) |
| `class="..."` | `className="..."` |
| `<i class="ti-user">` | `<i className="ti-user">` (same) |
| `required` attribute | Zod schema validation |
| `autofocus` | `autoFocus` (camelCase) |

---

## 🎯 SUCCESS CRITERIA

The new login page is correct when:

- [x] **Visual:** Looks IDENTICAL to old CMDMS login
  - Same glassmorphism card
  - Same background image
  - Same logo size and position
  - Same input styling with icons
  - Same button color and style

- [x] **Structure:** HTML matches exactly
  - Same Bootstrap grid classes
  - Same form structure
  - Same input groups
  - Same icon positions

- [x] **Behavior:** Works like old CMDMS
  - Email/password validation
  - Error messages display correctly
  - Login redirects to dashboard
  - Responsive layout works

- [x] **Assets:** All resources present
  - Background image loads
  - Logo image loads
  - Icons display correctly
  - CSS styles apply

---

## 📸 VISUAL REFERENCE

**Key Visual Elements:**

1. **Full-Screen Background:**
   - Scenic KP landscape photo (`loginbg.png`)
   - Covers entire viewport

2. **Centered Glassmorphism Card:**
   - Frosted glass effect (blurred, semi-transparent)
   - Rounded corners (40px)
   - White with 40% opacity
   - Subtle shadow

3. **Logo at Top:**
   - CMDMS logo with CM photo
   - 300px wide
   - Centered
   - 30px padding

4. **Two Input Fields:**
   - Email with user icon
   - Password with lock icon
   - Gray borders
   - Rounded corners (10px)
   - Icons inside input groups

5. **Green Login Button:**
   - Full width
   - KP Government green (#247B2D)
   - White text
   - Rounded corners (10px)

**Overall Feel:**
- Clean
- Modern
- Professional
- Government-appropriate
- Glassmorphism/frosted glass aesthetic
- Centered and balanced

---

## 🚀 READY FOR IMPLEMENTATION

This specification provides **ALL details needed** to implement the login page exactly as it appears in old CMDMS.

**Next Steps:**
1. Review this specification
2. Copy required assets (images)
3. Implement `LoginPage.tsx` component
4. Test against old CMDMS visually
5. Verify authentication flow

---

**Remember: "Convert the code, not the design"** ✅

Every HTML tag, CSS class, and visual element should match the old CMDMS exactly!
