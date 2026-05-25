# 🛡️ VULNBOT AI
> **Premium Automated Website Vulnerability Scanner & Pentesting Platform powered by AI.**

VULNBOT AI is a professional full-stack web-security simulation and automated penetration testing workspace. Built with high-performance React 19, Node.js + Express, and the Google Gemini AI API, it enables security operators to model cybersecurity threats, identify potential vulnerabilities, and generate intelligent, context-aware mitigation reports.

---

## 🌌 Key Features

1. **Interactive Threat Globe (3D)**
   * Animated holographic cyber globe built using **Three.js** and **React Three Fiber**.
   * Simulates real-time threat tracing, active scan vectors, and terminal telemetry pings around the world.

2. **Automated Vulnerability Scanner**
   * Configurable scanning profiles (e.g., *Cross-Site Scripting (XSS)*, *SQL Injection*, *Sensitive Path Disclosure*, *Header Security*, and *Port Mapping*).
   * Visual progress meters tracking active sweeps with responsive, real-time terminal feedback logs.

3. **Gemini AI Intelligence Integration**
   * Translates raw scan heuristics into structural mitigation summaries.
   * Crafts defensive postures, action plans, and secure code snippets using advanced AI recommendations.

4. **Security & Administrative Controller**
   * Comprehensive, password-protected **Admin Panel** to manage operator registration, toggle Maintenance override mode, monitor live server events, inspect logged traces, and lock/unlock operator access.

5. **Operational Logs & Credential Logging Simulation**
   * Isolated safety boundaries detailing real-world phishing traces and educational vector maps.
   * Keeps audit trails and logs stored safely on local server-side JSON storage.

6. **Executive PDF Reports**
   * Integrates **jsPDF** and **html2canvas** to capture canvas structures and compile polished, client-facing PDF audit summaries directly from your browser.

---

## ⚙️ Technical Architecture

VULNBOT AI relies on a modular, secure, full-stack application lifecycle:

* **Frontend:** React 19, TypeScript, **Vite**, **Tailwind CSS v4** (utility-first, unified dark-slate theme), nested interactive routing, micro-animations via **Motion**.
* **Backend:** Express Server (handling stateful session authorizations, local audit storage, and file database logging).
* **AI Engine:** Official Google Gen AI TypeScript SDK (`@google/genai`) acting server-side to secure sensitive credentials from client exposure.
* **Storage Buffer:** Reliable local filesystem store (`storage/` directory containing JSON buffers for scans, credentials, configurations, and administrative telemetry).

---

## 🛠️ Step-by-Step Setup and Installation

Follow these instructions to configure and run VULNBOT AI locally or deploy it to a server.

### Prerequisites
Make sure you have the following tools installed on your environment:
* **Node.js** (v18.x or higher recommended)
* **npm** (v9.x or higher)
* A valid **Gemini API Key** (to enable real-time smart vulnerability analysis)

---

### Step 1: Clone or Extract the Project Files
If installing from a clean workspace or zipped directory, extract or clone the files to your active folder:
```bash
cd vulnbot-ai
```

### Step 2: Install Project Dependencies
Run `npm install` within the root directory to populate all clean workspace libraries:
```bash
npm install
```

### Step 3: Configure Environment Variables
Create a local `.env` file at the root of the project (you can use `.env.example` as a starting guide):
```bash
cp .env.example .env
```

Open `.env` and fill in your Gemini API key:
```env
# Server Runtime
NODE_ENV=development
PORT=3000

# AI Security Analysis
GEMINI_API_KEY="AIzaSyYourActualGeminiAPIKeyHere..."
```

*(Note: Never check your populated `.env` file into a public GitHub repository. It contains vital secrets.)*

---

### Step 4: Launch Developer Mode
To start the high-speed Hot Module reloading server locally:
```bash
npm run dev
```
Once initialized, open your browser and navigate to:
🔗 [http://localhost:3000](http://localhost:3000)

---

### Step 5: Build for Production
To optimize compilation assets and bundle the Express server into standard CommonJS wrappers:
```bash
npm run build
```
Once the client bundle is generated under `dist/` and the server is compiled using `esbuild`, run standard server operations:
```bash
npm start
```

---

## 🔒 Administrative & Operator Guide

### 1. Registering/Logging In
When accessing the system for the first time, you can register as a new Operator using a secure password. 
* There is a prebuilt master admin account configured out-of-the-box:
  * **Email:** `admin@vulnbot.pro`
  * **Password:** `password123`

### 2. Finding and Navigating to the Admin Panel
To access the Master Audit Panel and manage the system:
1. Enter `admin` or use the command phrase *"go to admin"* in the main intelligent command loop.
2. Provide your primary administrative login (`admin@vulnbot.pro` with `password123`).
3. Inside, you can toggle active systems, check logs, inspect simulated phishing tracing queues, or disable individual operators.

---

## 🧪 Simulation Safety Notice
VULNBOT AI is strictly designed as an **educational simulation tool** for cybersecurity training, code review posture modeling, and AI-assisted analysis. Ensure you obtain lawful permission before targeting or mimicking actual external web entities using automated sweeps.

---

## 📄 License
This project is licensed under the MIT License. See `LICENSE` for further details.
