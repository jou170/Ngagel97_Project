# Project Fotocopy Ngagel97
## Table of Contents

- [Overview](#overview)
- [Setup and Installation](#setup-and-installation)
- [Environment Variables](#environment-variables)
- [Features and Usage](#features-and-usage)
- [Default User Accounts](#default-user-accounts)
- [Online Payments](#online-payments)

---

## Overview

**Fotocopy Ngagel97 Web Application** is a platform designed to streamline printing services. It provides functionalities for customers to place orders, admins to manage orders, and masters to oversee reports, managing users, and handling products.

This application is part of the **Software Development Project** coursework, showcasing practical application of software engineering principles in building a real-world web-based solution.

The application is hosted and can be accessed online at: [ngagel97.vercel.app](https://ngagel97.vercel.app)


## Setup and Installation

To run this application, follow these steps:

1. Extract the source code to a directory of your choice.

2. Navigate to the project directory:

   ```bash
   cd ngagel97
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up environment variables if required. This step is optional if a `.env.local` file is already included in the source code with valid configurations. (See [Environment Variables](#environment-variables)).

5. Start the application in development mode (**recommended to avoid long build times**):

   ```bash
   npm run dev
   ```

6. Alternatively, for production mode:

   ```bash
   npm run start
   ```

7. If necessary, build the application:

   ```bash
   npm run build
   ```

## Environment Variables

Create a `.env.local` file in the root directory and add the following variables:

```env
MONGODB_URI=mongodb+srv://joygemilang17:MXqZCvgq7cgB81qn@projectsdp.hhfrd.mongodb.net/ngagel97?retryWrites=true&w=majority&appName=ProjectSDP
JWT_SECRET=NGAGEL97ASLINYAVINDI
NODE_ENV="production"
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_MNyziu33qAkbhPjN_ofGuHOMC3bBenQtLSHvI6e0aqGWAo0"
MIDTRANS_SERVER_KEY=SB-Mid-server-yj9lQgWs-AOo9aiYKcLfX6iZ
MIDTRANS_CLIENT_KEY=SB-Mid-client-NgrTXoIsgR5SCKaf
```

## Features and Usage

### General User
- **Features:**
Register an account.
  - Log in to the application.
  - Register an account.
  
### Customer
- **Features:**
  - Browse available printing services and add-ons.
  - Place and manage online orders.
  - Manage cart
  - Checkout online by providing shipping address and make online payments. See [Online Payments](#online-payments)
  - Track order status (including transaction history and invoice generation).
  - Manage account details.

### Admin
- **Features:**
  - Manage online orders (update status).
  - Record offline transactions.
  - View transaction history and generate invoices.

### Master
- **Features:**
  - View sales reports and daily transaction reports.
  - Manage add-ons, services, and items (CRUD operations).
  - Manage user roles and permissions.

## Default User Accounts

To test the application, use the following default user accounts:

### Customer Account:
- **Email:** weny@gmail.com
- **Password:** Password123

### Admin Account:
- **Email:** admin
- **Password:** 123

### Master Account:
- **Email:** master
- **Password:** 123

New accounts can be created via the registration form. By default, all newly registered accounts are assigned the role of **Customer**. If you need to change a customer's role to **Admin** or vice versa, this can be done through the **Manage User Roles** feature, which is accessible by the **Master** role.


## Online Payments

The **Fotocopy Ngagel97 Web Application** integrates with **Midtrans** to provide online payment capabilities. Here is how you can use the **Midtrans Mock Payments** feature during testing:

### Setting Up Midtrans for Mock Payments

1. **Test Mode Configuration:**
   To simulate payments during development, use **Midtrans Test Mode** with the provided test credentials.

2. **Configure Midtrans Credentials:**
   Set the following environment variables in the `.env.local` file:

   ```env
   MIDTRANS_SERVER_KEY=SB-Mid-server-yj9lQgWs-AOo9aiYKcLfX6iZ
   MIDTRANS_CLIENT_KEY=SB-Mid-client-NgrTXoIsgR5SCKaf

3. **Test Credit Card Numbers:**
   Midtrans provides test credit card numbers for simulating different payment scenarios. Here are some test cards you can use:

   Visa: 4811 1111 1111 1111 (any future expiration date)
   MasterCard: 5211 1111 1111 1111 (any future expiration date)
   Failure: 4111 1111 1111 1111 (to simulate a failed transaction)

3. **Making a Mock Payment:**
   When checking out on the application, enter any of the test card numbers above to simulate the payment process. The transaction will be processed using Midtrans' mock payment system, allowing you to complete the checkout without real charges.

3. **Payment Status:**
   After a mock payment is processed, you will see the transaction status updated in the Customer Dashboard and can track your order status, including printing an invoice.