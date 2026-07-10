<div align="center">
  
# 🏙️ HK Properties - Real Estate Platform
*A Next-Generation, AI-Powered Real Estate CRM and Storefront*

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Gemini AI](https://img.shields.io/badge/Google-Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

</div>

---

## ✨ Overview

HK Properties is a premium, full-stack real estate platform designed specifically to convert visitors into high-intent leads. It combines a gorgeous, blazing-fast storefront with a powerful backend CRM that leverages Google's Gemini AI to automatically generate social media marketing copy for properties.

It features a smart, context-aware lead capture system, deep WhatsApp integration, and a beautiful Admin Dashboard for inventory and pipeline management.

---

## 🚀 Key Features

### 🏢 Customer Storefront
- **Beautiful UI/UX:** Responsive, glassmorphism-inspired design with premium typography and dynamic micro-interactions.
- **Smart Filtering:** Filter properties by Area, Budget, Property Type (Flats, Shops, Offices), and Configuration (BHK).
- **Dynamic WhatsApp Integration:** Context-aware WhatsApp buttons that automatically pre-fill messages with the specific property the customer is viewing.
- **Intelligent Lead Forms:** Smart "Request Callback" forms that adapt based on the page context, dynamically fetching available service areas.

### 💼 Admin Dashboard & CRM
- **Sleek Inventory Management:** Add, edit, and organize properties visually. Features image uploading directly to Supabase Storage.
- **Buyer Enquiries Pipeline:** A Kanban-style CRM to track lead statuses (New, Contacted, Visit Planned, Won, Lost) with quick-dial and budget tracking.
- **AI Marketing Engine:** One-click integration with Gemini 2.5 Flash. Instantly generates Instagram captions, Facebook posts, WhatsApp statuses, and Reel scripts tailored to specific properties.

---

## 🏗️ Architecture & Tech Stack

This project is built for production, utilizing modern cloud infrastructure:

- **Frontend:** Next.js (App Router), React, Vanilla CSS (Custom Design System). Hosted on **Vercel**.
- **Backend:** Python FastAPI, SQLAlchemy (ORM), Pydantic. Hosted on **Render**.
- **Database & Storage:** **Supabase** (PostgreSQL) for relational data and Supabase Storage Buckets for property images.
- **AI Integration:** Google GenAI SDK.

---

## 🛠️ Local Development

### 1. Backend Setup
The backend API runs on FastAPI.

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```
Ensure your `.env` has your `DATABASE_URL` (Supabase Postgres), `SUPABASE_URL`, `SUPABASE_KEY`, and `GEMINI_API_KEY`.
```bash
# Start the API server on http://localhost:8000
uvicorn app.main:app --reload
```
*API documentation is auto-generated at `http://localhost:8000/docs`.*

### 2. Frontend Setup
The frontend is a Next.js application.

```bash
cp .env.example .env.local
npm install
npm run dev
```
*The website will be live at `http://localhost:3000`.*

---

## 🌐 Deployment Guide

This repository is pre-configured for free cloud deployment:

1. **Database & Storage:** Create a project on [Supabase](https://supabase.com). Create a public storage bucket named `properties`.
2. **Backend:** Connect this repository to a **Web Service** on [Render](https://render.com). The `render.yaml` blueprint is included for 1-click deployment. Add your Supabase and Gemini credentials in the Render dashboard.
3. **Frontend:** Import this repository into [Vercel](https://vercel.com). Add `NEXT_PUBLIC_API_URL` pointing to your live Render backend, and configure your Business Phone/WhatsApp numbers in the environment variables.

---

*Designed and engineered for HK Properties, Dombivli & Thakurli.*
