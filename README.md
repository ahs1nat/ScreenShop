# ScreenShop
ScreenShop
By Sheikh Rahiqul Islam (2305169) & Tanisha Sameen (2305174)


Introduction

ScreenShop is an e-commerce marketplace where sellers can register, add and manage products, and view orders placed by buyers. Buyers, on the other hand, can search for categorized products, add items to their carts, and track their orders.
Each product also includes reviews, ratings, and a Q&A system that enables interaction between sellers and buyers.
An admin panel oversees the entire platform by approving new sellers, reviewing products, and monitoring overall activity.



Users

There are mainly 2 types of users:
Buyer
Seller

Buyer: Buyers are users who can order and purchase products, as well as ask questions about specific products.
Seller: Sellers are users who add and update product information, view and approve orders, and answer questions asked by buyers.



Features


The features of the system can be explained from two perspectives: the buyer’s perspective and the seller’s perspective.

From the buyer’s perspective, users can use the cart system, which works like a wishlist and allows products to be saved for later purchase.
A review system is also available, allowing buyers to give feedback on the products they have purchased.

From the seller’s perspective, sellers can offer discounts on products and orders to encourage buyers to make purchases.

In addition, buyers can ask questions about products, and sellers can respond to those questions. This Q&A system allows communication between buyers and sellers.


Advance Features


Introducing SS Warrior (ScreenShop Warrior) - a user-friendly AI-powered support chatbot designed to assist users throughout the order confirmation and fulfillment process. The chatbot provides essential order-related information, including current order status, real-time order location, delivery updates and detailed information about specific products. It also assists users in resolving payment and checkout-related issues. In addition, SS Warrior offers dedicated support to sellers by addressing common operational and order-related queries.

It is important to note that SS Warrior does not modify the database, disclose sensitive information, or act without user confirmation.


Architecture


We aim to build this project using the PERN stack (PostgreSQL, Express, React, Node.js), following a modular and scalable architecture.

The frontend will be developed using React.js, providing a user-friendly interface for buyers, sellers, and administrators. It will communicate with the backend through secure RESTful APIs.

The backend will be implemented using Node.js and Express.js, handling core business logic, authentication, role-based access control, order processing, and API endpoints.
It will also securely integrate external services such as an AI-powered chatbot using an LLM API. This AI chatbot will act as a support system for buyers and sellers. 

PostgreSQL will be used as the database management system to manage relational data including users, products, carts, orders, and reviews, ensuring strong consistency and referential integrity.
