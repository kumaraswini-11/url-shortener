# TinyLink — A Modern URL Shortener

A sleek, fast, and analytics-powered URL shortening platform built with **Next.js 16**, **Drizzle ORM**, **Neon Postgres**, and **shadcn/ui**.

![TinyLink Demo Screenshot](/public/screenshot-for-readme.png)

## 🚀 Overview

**TinyLink** lets you turn long URLs into short, trackable links.  
It provides a beautiful UI, powerful analytics, and a clean API — perfect for personal use, teams, or production environments.

## ✨ Features

- Create short links with custom or auto-generated codes
- Track click statistics and last clicked time
- Search and filter links
- Responsive design with dark mode support
- RESTful API with proper error handling
- Health check endpoint for monitoring

## Local Setup and Installation

1. Clone the repository
2. Install dependencies: `bun install`
3. Set up environment variables (see `.env.sample`)
4. Run the development server: `bun run dev`
5. Open [http://localhost:3000](http://localhost:3000)

## 🔌API Endpoints

- `POST /api/links` - Create a new short link
- `GET /api/links` - List all links (with optional search)
- `GET /api/links/:code` - Get link details by code
- `DELETE /api/links/:code` - Delete a link
- `GET /:code` - Redirect to target URL (302)
- `GET /healthz` - Health check endpoint

## Routes

- `/` - Dashboard (create and manage links)
- `/code/:code` - View statistics for a specific link
- `/:code` - Redirect to target URL

## 📄 License

MIT License — use it, fork it, build on it!

## 🤝 Contributing

We welcome contributions!
Please follow the standard Git/GitHub workflow (branching, PRs, merges).

⭐ Star this repo if you like it!
