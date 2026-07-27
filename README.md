# RotorVault

Professional Brake Rotor Image Repository and Management System.

---

## Overview

RotorVault is a complete ecosystem for managing generic brake rotor image sets.

It consists of two independent applications:

- **Processor_v2** – Web application for browsing, searching, previewing, validating, and downloading image sets.
- **Automation** – Desktop publishing tool for validating images, generating repository data, and publishing updates to GitHub.

GitHub serves as the **single source of truth** for all published images and metadata.

---

# Repository Structure

```
Generic-Brake-Rotor-Vault/

├── Processor_v2/
│   ├── css/
│   ├── js/
│   ├── index.html
│   └── ...
│
├── automation/
│   ├── generator.py
│   ├── validator.py
│   ├── git_manager.py
│   └── ...
│
├── database.json
├── repository.json (future)
│
├── BR2WP/
├── BR1WP/
├── BR2R/
└── ...
```

---

# Processor_v2

Main Features

- Search
- Filters
- Statistics
- Image Preview
- Image Cache
- Download Manager
- Rename Engine
- Repository Health
- Infinite Scroll

---

# Automation

Responsibilities

- Import image sets
- Validate naming
- Generate database.json
- Generate repository.json
- Upload to GitHub
- Verify repository integrity
- Maintain publishing logs

---

# Image Naming

Example

```
BR2WPS0001_master_v2.JPG
BR2WPS0001_02_v2.JPG
...
BR2WPS0001_07_v2.JPG
```

Each SET contains exactly **7 images**.

---

# Repository Health

Repository Health validates:

- Database
- Folder Structure
- Images
- Naming
- Cross Check
- Repository Structure

---

# Deployment

Processor_v2 is deployed using:

- GitHub
- Vercel

Images are served directly from GitHub.

---

# Project Status

Current Phase

RC5 Development

Processor_v2

≈ 90% Complete

Automation

Architecture Complete
Implementation In Progress

---

© RotorVault
