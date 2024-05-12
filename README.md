# SmartOff Backend

Welcome to the backend repository for SmartOff, a multiplatform for printing facilities. This Node.js project serves as the backbone of our application, providing a robust set of APIs to manage users, admins, vendors, payment logs, subscriptions, printing settings, branches, and more.

## Features

- **User Management**:
  - Registration, authentication, and profile management for users.
- **Admin Management**:
  - Add, delete, and update user and vendor accounts. View and manage payment logs.
- **Vendor Management**:
  - Vendors register their branches by providing specific location (longitude, latitude) and seek approval from admin. Set commission rate of share of vendor earnings.
- **Branch Management**:
  - Admins can manage branches, including adding, updating, and deleting branch information. Each branch is associated with a vendor.
- **Subscription Management**:
  - Admins can create subscriptions, set their price and duration, and manage active subscriptions.
- **Printing Settings**:
  - Admins can set the price of color and black and white prints, as well as per page price. 
- **Location-based Printing**:
  - Users can select a printer closest to their location from a map interface, upload files or folders, and print documents either black and white or colored after paying the amount which has been set by the admin.
- **File Upload and Printing**:
  - Users can upload files or folders of multiple files and print their documents.
- **Payment Integration**:
  - Integration with payment gateway for secure transactions.

## Technologies Used

- **Node.js**: Backend runtime environment.
- **Express.js**: Web framework for Node.js, used for routing and middleware.
- **MongoDB**: NoSQL database used for storing user, admin, vendor, branch, subscription, and printing data.
- **JWT (JSON Web Tokens)**: Used for authentication and authorization.
- **Bcrypt**: Hashing library for securing user passwords.
- **Other Dependencies**: Check `package.json` for a full list.

## Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/smartoff-backend.git
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Run the server:**
    ```bash
    npm start
    ```

## Usage

Once the server is running, users, admins, and vendors can access the multiplatform printing facilities offered by SmartOff. Users can select printers closest to their location, upload files, and print documents after making payments. Admins can manage users, vendors, subscriptions, printing settings, payment logs, and branches, ensuring smooth operation of the platform.
