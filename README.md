# 🔐 Authentication System – From Google Sign-In to Sign in with Puri

This project is made to **understand how “Sign in with Google” works** by building a **simple custom login system** called **Sign in with Puri**.

If you are a fresher and get confused by OAuth, tokens, or authentication words — this project is for you.

---

## 🎯 Project Goal

- Learn how modern login systems work
- Understand Google Sign-In in a simple way
- Build a working alternative: **Sign in with Puri**
- Avoid password handling on websites
- Use real backend + frontend flow

---

## 🧠 Simple Idea (Easy Explanation)

Think of **Google** as a trusted teacher 👩‍🏫  
All students are already registered there.

When a website wants to log you in:
- The website asks Google: “Is this user real?”
- Google confirms it
- The website trusts Google
- No password is shared with the website

👉 **Sign in with Puri works the same way**, but it is built by us.

---

## 🔍 What Is Google Sign-In?

Google Sign-In is a login system where:
- Users log in using their Google account
- Websites do NOT store passwords
- Google proves the user’s identity
- Websites receive verified user data

You don’t buy Google login.
You just **register your app** and get a **free Client ID**.

---

## 📦 What Data Google Shares (With Permission)

- User name  
- Email address  
- Profile picture  
- Unique user ID  

⚠️ Passwords are never shared.

---

## 🔁 Google Login Flow (Simple Steps)

1. User clicks **Sign in with Google**
2. Google popup opens
3. User allows access
4. Google sends a secure token
5. Backend verifies the token
6. User is logged in
7. Website shows personalized content

✅ Same button works for **signup and login**

---

## 🆕 What Is “Sign in with Puri”?

**Sign in with Puri** is a **custom identity provider**, just like Google, but simplified.

- Users create `@puri.com` accounts
- One central auth system handles login
- Other websites trust Puri to verify users

This helps you understand **how Google works internally**.

---

## 🏗️ System Architecture (Overview)

