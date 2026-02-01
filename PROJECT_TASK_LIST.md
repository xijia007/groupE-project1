# Project Development Task List:

## Group E

```
Team member:
- Zhenjia Li
- Xi Jia
```
## Role Definitions:

### Phase I: Infrastructure & Authentication
```
  - Zhenjia Li: Design the Database User Model (must include email, password, and role fields).
  - Zhenjia Li: Develop Backend Auth APIs: Sign up, Sign in, and Update password.
  - Zhenjia Li: Develop a reusable Frontend Auth Component (one UI for three pages) with a responsive layout.
  - Zhenjia Li: Design a global responsive Header (including User Info display area) and Footer.
  - Xi Jia: Define a standardized API Error Response Model (Modeled Error Response) for the entire site.
  - Xi Jia: Implement basic Frontend form validation (e.g., Email format, password length).
```

### Phase II: Product Flow (Management & Display)
```
  - Xi Jia: Develop Backend Management APIs: Create Product, Edit Product, and Remove/Delete Product.
  - Xi Jia: Develop a reusable "Create/Edit Product" Frontend page with a dedicated Admin form.
  - Zhenjia Li: Implement Authorization Middleware: Ensure only users with role: admin can access Create/Update/Delete endpoints.
  - Xi Jia: Develop Backend Query APIs: List Products (including Pagination logic) and Get Product Detail.
  - Xi Jia: Develop Frontend Product display pages: Homepage (Product Grid/List) and Product Detail Page.
  - Xi Jia: Implement responsive image handling for product displays.
```

### Phase III: Cart Flow & Integration Testing
```
  - Xi Jia: Develop Full-stack Shopping Cart logic: Add to cart, Update quantity, and Remove item.
  - Xi Jia: Implement Promotion Code validation algorithm and dynamic price calculation logic.
  - Xi Jia: Implement Cart Persistence: Use localStorage for guests; sync with Backend/DB upon login.
  - Xi Jia: Develop a global Error Boundary component to handle unexpected crashes at the root level.
  - Xi Jia: Implement Frontend Route Guards/Component Toggling: Show/Hide "Add/Edit/Delete" buttons based on user role.
  - Zhenjia Li: Implement User State Persistence: Automatically fetch current login status via Token on page refresh.
  - Collaboration: Conduct Final Integration Testing: Verify the complete lifecycle (Sign up -> Sign in -> Browse -> Cart Calculation -> Admin Product Maintenance).
```


