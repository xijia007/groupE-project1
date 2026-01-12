# groupE-project1
Implement a product management system

There are two types of users in the system, one is a regular user, the other is an admin user. Each user type has different authorizations. Regular users can only select a product and add it to cart. Admin users can do everything regular users do, they can also edit/create/remove a product.

In real life, for example a B2C platform like Amazon, Walmart, Target. You can imagine the admin users are the product vendors, they can maintain the system to update their available products in stock. You can imagine the regular users are the regular customers that buy products. Company wants to save money and the system is designed to be shareable with two types of customers - vendors as internal customers and regular external customers.

Mock design: https://www.figma.com/file/brgvADTppPXJdYkaOR5AmW/Management-Chuwa?node-id=819%3A521

Project Development Task List:

Role Definitions:
- Zhenjia Li (Admin/Auth Owner): Responsible for security, Vendor/Admin management backend, and core infrastructure.
- Xi Jia (Customer/Cart Owner): Responsible for customer browsing experience, shopping cart logic, promotion algorithms, and system robustness.

Phase I: Infrastructure & Authentication
  - Zhenjia Li: Design the Database User Model (must include email, password, and role fields).
  - Zhenjia Li: Develop Backend Auth APIs: Sign up, Sign in, and Update password.
  - Zhenjia Li: Develop a reusable Frontend Auth Component (one UI for three pages) with a responsive layout.
  - Xi Jia: Design a global responsive Header (including User Info display area) and Footer.
  - Xi Jia: Define a standardized API Error Response Model (Modeled Error Response) for the entire site.
  - Xi Jia: Implement basic Frontend form validation (e.g., Email format, password length).

Phase II: Product Flow (Management & Display)
  - Zhenjia Li: Develop Backend Management APIs: Create Product, Edit Product, and Remove/Delete Product.
  - Zhenjia Li: Develop a reusable "Create/Edit Product" Frontend page with a dedicated Admin form.
  - Zhenjia Li: Implement Authorization Middleware: Ensure only users with role: admin can access Create/Update/Delete endpoints.
  - Xi Jia: Develop Backend Query APIs: List Products (including Pagination logic) and Get Product Detail.
  - Xi Jia: Develop Frontend Product display pages: Homepage (Product Grid/List) and Product Detail Page.
  - Xi Jia: Implement responsive image handling for product displays.

Phase III: Cart Flow & Integration Testing
  - Xi Jia: Develop Full-stack Shopping Cart logic: Add to cart, Update quantity, and Remove item.
  - Xi Jia: Implement Promotion Code validation algorithm and dynamic price calculation logic.
  - Xi Jia: Implement Cart Persistence: Use localStorage for guests; sync with Backend/DB upon login.
  - Xi Jia: Develop a global Error Boundary component to handle unexpected crashes at the root level.
  - Zhenjia Li: Implement Frontend Route Guards/Component Toggling: Show/Hide "Add/Edit/Delete" buttons based on user role.
  - Zhenjia Li: Implement User State Persistence: Automatically fetch current login status via Token on page refresh.
  - Collaboration: Conduct Final Integration Testing: Verify the complete lifecycle (Sign up -> Sign in -> Browse -> Cart Calculation -> Admin Product Maintenance).

