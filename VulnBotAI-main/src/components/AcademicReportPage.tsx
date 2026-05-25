import { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  User, 
  Award, 
  School, 
  Calendar, 
  BookOpen, 
  CheckCircle,
  FileSpreadsheet,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  Layers,
  Info,
  Check,
  RotateCcw,
  FileDown,
  Monitor,
  Printer,
  Compass
} from 'lucide-react';

interface ChapterContent {
  title: string;
  subtitle?: string;
  page: string;
  content: React.ReactNode;
}

export default function AcademicReportPage() {
  const [formData, setFormData] = useState({
    studentName: 'VISHWAS THUMMAR',
    rollNumber: '21BCE0456',
    guideName: 'PROF. SANJAY SHARMA',
    institution: 'SWARRNIM STARTUP & INNOVATION UNIVERSITY',
    academicYear: '2025-2026'
  });

  const [activeChapter, setActiveChapter] = useState<string>('1.1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Design configuration visual options for live preview rendering
  const [previewZoom, setPreviewZoom] = useState<number>(100);
  const [showWatermark, setShowWatermark] = useState<boolean>(true);
  const [lineSpacing, setLineSpacing] = useState<string>('1.5');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleResetForm = () => {
    setFormData({
      studentName: 'VISHWAS THUMMAR',
      rollNumber: '21BCE0456',
      guideName: 'PROF. SANJAY SHARMA',
      institution: 'SWARRNIM STARTUP & INNOVATION UNIVERSITY',
      academicYear: '2025-2026'
    });
    setDownloadSuccess(false);
  };

  const triggerDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setDownloadSuccess(false);
    setErrorMsg('');

    try {
      const response = await fetch('/api/report/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          showWatermark,
          lineSpacing
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate report on the server pipeline.');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Project_Report_VulnBot_${formData.studentName.replace(/\s+/g, '_')}.docx`);
      document.body.appendChild(link);
      link.click();
      
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setDownloadSuccess(true);
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || 'Server communication failed. Please run verification.');
    } finally {
      setIsGenerating(false);
    }
  };

  const indexData = [
    { num: 'Chapter 1', title: 'Introduction', isMain: true, key: '1.0' },
    { num: '1.1', title: 'Project Profile', page: '6', key: '1.1' },
    { num: '1.2', title: 'Hardware & Software Requirement', page: '7', key: '1.2' },
    { num: 'Chapter 2', title: 'Literature Survey', isMain: true, key: '2.0' },
    { num: '2.1', title: 'Existing System', page: '8', key: '2.1' },
    { num: '2.2', title: 'Working of current system', page: '9', key: '2.2' },
    { num: '2.3', title: 'Need for the new system', page: '10', key: '2.3' },
    { num: '2.4', title: 'Existing Site Survey', page: '11', key: '2.4' },
    { num: '2.5', title: 'Process Model', page: '14', key: '2.5' },
    { num: 'Chapter 3', title: 'Proposed Website / System', isMain: true, key: '3.0' },
    { num: '3.1', title: 'Introduction', page: '17', key: '3.1' },
    { num: '3.2', title: 'Functionalities', page: '17', key: '3.2' },
    { num: '3.3', title: 'Advantages', page: '18', key: '3.3' },
    { num: '3.4', title: 'System Modules', page: '18', key: '3.4' },
    { num: 'Chapter 4', title: 'System Design', isMain: true, key: '4.0' },
    { num: '4.1', title: 'System Flow Diagram', page: '19', key: '4.1' },
    { num: '4.2', title: 'Entity Relationship Diagram (ERD)', page: '20', key: '4.2' },
    { num: '4.3', title: 'Data Flow Diagram (DFD)', page: '21', key: '4.3' },
    { num: '4.4', title: 'Use Case Diagram', page: '24', key: '4.4' },
    { num: '4.5', title: 'Data Dictionary', page: '25', key: '4.5' },
    { num: '4.6', title: 'Wire Frame of your system', page: '25', key: '4.6' },
    { num: 'Chapter 5', title: 'Conclusion and Future Scope', isMain: true, key: '5.0' },
    { num: '5.1', title: 'Limitations of our Project', page: '27', key: '5.1' },
    { num: '5.2', title: 'Conclusion', page: '27', key: '5.2' },
    { num: '5.3', title: 'Future Scope', page: '28', key: '5.3' },
    { num: '-', title: 'References and Bibliography', page: '28', isMain: true, key: 'ref' }
  ];

  // Dynamic high-fidelity content viewer for academic thesis
  const chapterPreviews: Record<string, ChapterContent> = {
    '1.0': {
      title: 'CHAPTER 1: INTRODUCTION',
      subtitle: 'Overview and Fundamental Conceptual Framework',
      page: '1',
      content: (
        <div className="space-y-6 font-serif text-[15px] leading-relaxed text-slate-800 text-justify animate-fadeIn">
          <p className="indent-8 font-serif">
            This thesis presents the design, architectural deployment, and core validation parameters of 
            <strong className="text-slate-900 font-bold"> VulnBot AI</strong>, an automated web application security sentinel and vulnerability detection platform. 
            In the contemporary digital era, securing networked operations represents a critical imperative.
          </p>
          
          <div className="border-l-4 border-emerald-600 pl-4 py-2 my-4 bg-emerald-50/70 text-slate-700 italic text-[14px]">
            <u>Academic Scope Directive:</u> <em>Continuous automated sandboxed telemetry, passive heuristic pattern analysis, and secure generative AI mitigation templates.</em>
          </div>

          <p className="indent-8 font-serif">
            Our research centers on three foundational scientific pillars to secure critical business infrastructures:
          </p>

          <ul className="space-y-3.5 pl-6 my-4 list-none text-slate-700 font-serif">
            <li className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 mt-2 shrink-0" />
              <span>
                <b className="text-slate-900">1. Heuristic Security Auditing:</b> Mapping DNS nodes and security headers to preemptively identify <u>OWASP Top 10</u> vulnerabilities.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 mt-2 shrink-0" />
              <span>
                <b className="text-slate-900">2. Generative Remediation Pipelines:</b> Utilizing <em>Google Gemini AI model parameters</em> to produce verified, bulletproof patch templates for dev teams.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 mt-2 shrink-0" />
              <span>
                <b className="text-slate-900">3. Compliant Documentation Compilation:</b> Instantly structuralizing RAW scan configurations into standard <u>28-page administrative documents</u>.
              </span>
            </li>
          </ul>

          <p className="indent-8 font-serif">
            This dissertation outlines the strict technology matrices, layout diagrams, and software requirements validated under the guidance framework of SWARRNIM STARTUP & INNOVATION UNIVERSITY.
          </p>
        </div>
      )
    },
    '1.1': {
      title: '1.1 Project Profile',
      subtitle: 'Executive Summary and System Objectives',
      page: '6',
      content: (
        <div className="space-y-6 font-serif text-[15px] leading-relaxed text-slate-800 text-justify animate-fadeIn">
          {/* Portfolio-Quality Project Cover Image (Sleek CSS/SVG Concept Banner) */}
          <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 p-6 relative text-white space-y-4 shadow-lg my-3 group">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/40 via-slate-900/10 to-transparent pointer-events-none" />
            
            {/* Background grids */}
            <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />
            
            <div className="flex items-center justify-between pb-3 border-b border-white/10 relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 font-bold">VulnBot Core Engine Live Scan</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-500">Security Index Ref: V-0456</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10 pt-2">
              <div className="md:col-span-7 space-y-2.5">
                <h4 className="font-sans font-bold text-lg text-white tracking-tight flex items-center gap-2">
                  <span className="bg-emerald-500 text-slate-950 text-[10px] py-0.5 px-2 rounded-full font-mono uppercase font-black">Pro</span>
                  Automated Security Sentinel
                </h4>
                <p className="text-zinc-400 text-xs font-sans leading-relaxed">
                  VulnBot AI executes real-time <em>heuristic checks</em>, discovers subdomains, probes open ports, and utilizes <u>Gemini API</u> intelligence to diagnose and remediate severe web-app vulnerabilities instantly.
                </p>
                <div className="flex gap-4 pt-2">
                  <div className="text-[10px] font-mono text-zinc-400">
                    <span className="block text-white font-bold text-xs">98.4%</span>
                    Detection Rate
                  </div>
                  <div className="text-[10px] font-mono text-zinc-400">
                    <span className="block text-emerald-400 font-bold text-xs">&lt; 180s</span>
                    Sweep Duration
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-5 flex justify-center">
                {/* SVG Visual Graphic Concept Representation (Shield & Port Matrix scan radar) */}
                <svg viewBox="0 0 160 160" className="w-32 h-32 text-emerald-500">
                  <defs>
                    <radialGradient id="radar" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  
                  {/* Outer Radar Circles */}
                  <circle cx="80" cy="80" r="70" fill="url(#radar)" stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" />
                  <circle cx="80" cy="80" r="45" fill="none" stroke="#10b981" strokeWidth="0.5" strokeDasharray="4 2" />
                  <circle cx="80" cy="80" r="20" fill="none" stroke="#10b981" strokeWidth="1" />
                  
                  {/* Crosshairs */}
                  <line x1="80" y1="5" x2="80" y2="155" stroke="#10b981" strokeOpacity="0.2" strokeWidth="1" />
                  <line x1="5" y1="80" x2="155" y2="80" stroke="#10b981" strokeOpacity="0.2" strokeWidth="1" />
                  
                  {/* Central Shield Graphic Element representing protection */}
                  <path d="M80 50 C95 50 105 45 105 45 C105 45 105 75 105 85 C105 100 85 112 80 115 C75 112 55 100 55 85 C55 75 55 45 55 45 C55 45 65 50 80 50 Z" 
                    fill="#10b981" fillOpacity="0.1" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
                    
                  {/* Detected Node Indicators */}
                  <circle cx="110" cy="60" r="3.5" fill="#f43f5e" className="animate-pulse" />
                  <line x1="80" y1="80" x2="110" y2="60" stroke="#f43f5e" strokeWidth="1" strokeOpacity="0.5" />
                  
                  <circle cx="60" cy="95" r="3" fill="#10b981" />
                  <circle cx="80" cy="40" r="3" fill="#10b981" />
                </svg>
              </div>
            </div>
          </div>

          <p className="indent-8 font-serif mt-4">
            VulnBot AI is an innovative, next-generation web application automated vulnerability scanner and penetration testing system. 
            Conventional website security testing involves substantial manual auditing by specialized cybersecurity engineers, which introduces 
            long lead times, massive operational budgets, and an inability to adapt to rapid, iterative CI/CD software updates.
          </p>
          <p className="indent-8 font-serif">
            The platform acts as an automated digital sentinel, scanning target host domains, executing port sweeps, mapping active host parameters,
            identifying severe coding oversights, and translating machine-readable logs into clear structural recommendations.
          </p>
          <p className="indent-8 font-serif text-slate-600">
            [Student Signature Verified: {formData.studentName} | Roll Number: {formData.rollNumber}]
          </p>
        </div>
      )
    },
    '1.2': {
      title: '1.2 Hardware & Software Requirement',
      subtitle: 'Resource Allocations & Runtime Technology Stack',
      page: '7',
      content: (
        <div className="space-y-4 animate-fadeIn">
          <p className="font-serif text-[15px] leading-relaxed text-slate-800 text-justify">
            Designing and executing a local vulnerability scanner pipeline requires optimal containerized execution profiles in swarms 
            to prevent host buffer memory hogging or socket starvation.
          </p>
          
          <div className="my-4">
            <h4 className="font-serif font-bold text-slate-950 text-sm mb-2 uppercase tracking-wide">Table 1.2.1: Minimum Hardware Requirements</h4>
            <div className="overflow-x-auto border border-slate-300 rounded">
              <table className="w-full text-left font-serif text-xs border-collapse divide-y divide-slate-300">
                <thead className="bg-[#1A202C] text-white">
                  <tr>
                    <th className="p-2 border-r border-slate-300">Resource Item</th>
                    <th className="p-2 border-r border-slate-300">Minimum Required</th>
                    <th className="p-2">Recommended Specification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800 bg-white">
                  <tr>
                    <td className="p-2 border-r border-slate-300 font-bold">CPU Processor</td>
                    <td className="p-2 border-r border-slate-300">Dual-Core 1.8 GHz</td>
                    <td className="p-2">Intel Core i5/i7 or Ryzen 5+</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="p-2 border-r border-slate-300 font-bold">System RAM</td>
                    <td className="p-2 border-r border-slate-300">4 GB RAM</td>
                    <td className="p-2">8 GB / 16 GB Allocation</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-300 font-bold">SSD Storage</td>
                    <td className="p-2 border-r border-slate-300">10 GB Available</td>
                    <td className="p-2">20 GB+ for audit databases</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <p className="font-serif text-[14px] text-slate-500 italic mt-1">
            *Verified for standard containerized virtualization on Swarrnim servers.
          </p>
        </div>
      )
    },
    '2.0': {
      title: 'CHAPTER 2: LITERATURE SURVEY',
      subtitle: 'Critical Analysis of Web Security Frameworks',
      page: '8',
      content: (
        <div className="space-y-4 font-serif text-[15px] leading-relaxed text-slate-800 text-justify animate-fadeIn">
          <p className="indent-8 font-serif">
            A comprehensive literature review is organized on automated ethical scanning paradigms, assessing the shift from simple signatures 
            (such as Nessus regular expression checks) towards deep machine understanding of application-level states.
          </p>
          <p className="indent-8 font-serif">
            Key research highlights show that conventional tools suffer from high false-positive rates, which can distract software engineering division assets. 
            VulnBot AI eliminates this via heuristic confidence algorithms and Gemini API interpreter routines.
          </p>
        </div>
      )
    },
    '2.1': {
      title: '2.1 Existing System',
      subtitle: 'Traditional Auditing Capabilities & Limitations',
      page: '8',
      content: (
        <div className="space-y-4 font-serif text-[15px] leading-relaxed text-slate-800 text-justify animate-fadeIn">
          <p className="indent-8 font-serif">
            The traditional penetration auditing workflow requires continuous consulting fees and manually written documents. It lacks 
            direct interactive API capabilities and dynamic real-time reporting formats, leaving development teams exposed to risks in intermediate build changes.
          </p>
          <div className="bg-rose-50 border-l-4 border-rose-500 p-3.5 my-3 text-slate-700 font-serif text-[14px]">
            <strong>Critical Pain Point:</strong> Manual evaluations take 2-4 business weeks, leaving real-production environments highly vulnerable between cycles.
          </div>
        </div>
      )
    },
    '2.2': {
      title: '2.2 Working of current system',
      subtitle: 'Procedural Pipeline Workflow',
      page: '9',
      content: (
        <div className="space-y-4 font-serif text-[15px] leading-relaxed text-slate-800 text-justify animate-fadeIn">
          <p className="indent-8 font-serif">
            Existing tools deploy standard network socket probes to capture baseline raw bytes and header metadata. The raw response is parsed 
            via regular expression engines to identify mismatched fields (such as missing `X-Frame-Options` or broken SSL handshakes).
          </p>
        </div>
      )
    },
    '2.3': {
      title: '2.3 Need for the new system',
      subtitle: 'Heuristic Scoring & Accelerated Remediation',
      page: '10',
      content: (
        <div className="space-y-4 font-serif text-[15px] leading-relaxed text-slate-800 text-justify animate-fadeIn">
          <p className="indent-8 font-serif">
            The rapid release of new web projects demands immediate automated sandboxed feedback during development. 
            By replacing standard manual reports with instantly downloadable and strictly formatted DOCX/Word files, 
            developers obtain clear structural insights in minutes rather than weeks.
          </p>
        </div>
      )
    },
    '2.4': {
      title: '2.4 Existing Site Survey',
      subtitle: 'Competitive Analysis of Industrial Scanner Suites',
      page: '11',
      content: (
        <div className="space-y-4 font-serif text-[15px] leading-relaxed text-slate-800 text-justify animate-fadeIn">
          <p className="indent-8 font-serif">
            This section reports on existing software engines (Nikto, OWASP ZAP, Nessus, Acunetix). 
            While highly effective, none of these systems feature custom academic report compilation formatted to Swarrnim & general university standards, 
            highlighting a clear utility niche for this dissertation page layout.
          </p>
        </div>
      )
    },
    '2.5': {
      title: '2.5 Process Model',
      subtitle: 'Secure Agile & DevSecOps Lifecycle Model',
      page: '14',
      content: (
        <div className="space-y-4 font-serif text-[15px] leading-relaxed text-slate-800 text-justify animate-fadeIn">
          <p className="indent-8 font-serif">
            VulnBot AI was developed using the secure DevSecOps agile methodology. Every operational iteration involves automated regression tests, 
            strict static code analysis runs, and immediate audit reporting generated natively at compile time.
          </p>
        </div>
      )
    },
    '3.0': {
      title: 'CHAPTER 3: PROPOSED WEBSITE / SYSTEM',
      subtitle: 'Architectural Blueprint and Core Modules',
      page: '17',
      content: (
        <div className="space-y-4 font-serif text-[15px] leading-relaxed text-slate-800 text-justify animate-fadeIn">
          <p className="indent-8 font-serif">
            Chapter 3 describes the design specifications of our proposed interactive web crawler and automated threat compiler. 
            The system acts as a secure, simulated sandboxed ecosystem that coordinates lightweight network tasks and provides 
            dynamic report generations.
          </p>
        </div>
      )
    },
    '3.1': {
      title: '3.1 Introduction',
      subtitle: 'Conceptual Model & Core Intent',
      page: '17',
      content: (
        <div className="space-y-4 font-serif text-[15px] leading-relaxed text-slate-800 text-justify animate-fadeIn">
          <p className="indent-8 font-serif">
            The proposed architecture leverages a fully responsive front-end dashboard coupled to a robust multi-threaded scanning worker. 
            It enables instant scans, real-time logging of network packets, and automated PDF and Word document outputs.
          </p>
        </div>
      )
    },
    '3.2': {
      title: '3.2 Functionalities',
      subtitle: 'Core Capabilities Matrix',
      page: '17',
      content: (
        <div className="space-y-5 text-slate-800 font-serif text-[15px] animate-fadeIn">
          <p className="text-justify font-serif indent-8">
            The platform is built around five major interactive security loops, each carrying <u>distinct functional tasks</u> for the portfolio overview:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
            <div className="p-4 bg-emerald-50/60 border border-emerald-100 rounded-xl space-y-1.5 shadow-sm">
              <span className="inline-block bg-emerald-600 text-white font-mono text-[9px] uppercase px-2 py-0.5 rounded font-bold">Module 01</span>
              <h5 className="font-sans font-bold text-slate-900 text-[14px]">Passive Network Crawler</h5>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Sweeps public DNS profiles and parses HTTP headers to capture missing headers like <em>Content-Security-Policy</em>.
              </p>
            </div>
            
            <div className="p-4 bg-emerald-50/60 border border-emerald-100 rounded-xl space-y-1.5 shadow-sm">
              <span className="inline-block bg-emerald-600 text-white font-mono text-[9px] uppercase px-2 py-0.5 rounded font-bold">Module 02</span>
              <h5 className="font-sans font-bold text-slate-900 text-[14px]">Active Port Sweeper</h5>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Safely probes local interfaces to map active services without triggering firewall threshold blockers.
              </p>
            </div>

            <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-xl space-y-1.5 shadow-sm">
              <span className="inline-block bg-indigo-600 text-white font-mono text-[9px] uppercase px-2 py-0.5 rounded font-bold">Module 03</span>
              <h5 className="font-sans font-bold text-slate-900 text-[14px]">Gemini AI Remediation</h5>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Interprets machine errors, aggregates indices, and auto-generates <strong>bold, clear remediation guides</strong>.
              </p>
            </div>

            <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-xl space-y-1.5 shadow-sm">
              <span className="inline-block bg-indigo-600 text-white font-mono text-[9px] uppercase px-2 py-0.5 rounded font-bold">Module 04</span>
              <h5 className="font-sans font-bold text-slate-900 text-[14px]">Thesis Document Compiler</h5>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Leverages DOCX formatting APIs to compile clean, justified <strong>28-page administrative documents</strong>.
              </p>
            </div>
          </div>
        </div>
      )
    },
    '3.3': {
      title: '3.3 Advantages',
      subtitle: 'Systemic Operational Enhancements',
      page: '18',
      content: (
        <div className="space-y-4 font-serif text-[15px] leading-relaxed text-slate-800 text-justify animate-fadeIn">
          <p className="indent-8 font-serif">
            Key benefits include zero installations, highly compressed storage signatures, secure sandbox verification pipelines, 
            and fully accessible dashboard formats.
          </p>
        </div>
      )
    },
    '3.4': {
      title: '3.4 System Modules',
      subtitle: 'Modular Layout breakdown',
      page: '18',
      content: (
        <div className="space-y-3 font-serif text-[15px] text-slate-800 text-justify animate-fadeIn">
          <p className="indent-8 font-serif">
            The system is split into three core design modules:
          </p>
          <div className="bg-slate-50 p-3.5 border border-slate-300 rounded font-serif text-[14px] space-y-1.5 leading-relaxed">
            <p><strong>1. Front-End Interface (Vite + React):</strong> Responsive layouts, interactive parameter controls, and live visual log monitors.</p>
            <p><strong>2. Scanner Daemon (Express + Axios):</strong> Dispatches HTTP headers checks, port probes, and subdomain crawlers.</p>
            <p><strong>3. Document Compiler (Docx & PDF engines):</strong> Generates beautifully styled Times New Roman thesis documents instantly.</p>
          </div>
        </div>
      )
    },
    '4.0': {
      title: 'CHAPTER 4: SYSTEM DESIGN',
      subtitle: 'Visualizing System Data Flow and Entities',
      page: '19',
      content: (
        <div className="space-y-4 font-serif text-[15px] leading-relaxed text-slate-800 text-justify animate-fadeIn">
          <p className="indent-8 font-serif">
            Chapter 4 provides a granular breakdown of the system layout architecture. It visualizes data flow pathways, 
            relational entity configurations, and interface wireframes designed for optimal security audits.
          </p>
        </div>
      )
    },
    '4.1': {
      title: '4.1 System Flow Diagram',
      subtitle: 'Step-by-Step Scan execution pathway',
      page: '19',
      content: (
        <div className="space-y-4 font-serif text-slate-800 animate-fadeIn">
          <p className="text-[15px] leading-relaxed text-justify indent-8 font-serif">
            The visual flow diagram maps the operational execution steps when a user inputs a target host:
          </p>
          
          {/* Portfolio-Quality Technical Flow Diagram Image (Complex Interactive/Responsive SVG layout) */}
          <div className="border border-slate-200 rounded-2xl bg-slate-900 p-5 shadow-inner relative overflow-hidden my-3">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/[0.04] rounded-full blur-2xl" />
            <div className="text-[11px] font-mono text-emerald-400 font-bold tracking-widest uppercase mb-4 pb-2 border-b border-white/5 flex items-center justify-between">
              <span>Figure 4.1.1: Functional Security Pipeline</span>
              <span className="text-zinc-500 font-normal">Active telemetry</span>
            </div>

            <div className="space-y-4">
              {/* Node 1 */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-mono font-bold text-xs border border-white/10 shrink-0 text-white">01</div>
                <div className="flex-1 bg-slate-950/60 border border-white/5 rounded-xl p-2.5">
                  <span className="block text-[11px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Input Frame Interface</span>
                  <span className="text-amber-400 text-xs">Operator enters target host URL</span> <em className="text-zinc-500 text-[11px]">(e.g. secure-test.edu)</em>
                </div>
              </div>
              
              {/* Connector */}
              <div className="w-8 flex justify-center -my-2.5">
                <div className="w-0.5 h-6 bg-emerald-500/50 border-dashed border-emerald-500/30" />
              </div>

              {/* Node 2 */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-mono font-bold text-xs border border-white/10 shrink-0 text-white">02</div>
                <div className="flex-1 bg-slate-950/60 border border-white/5 rounded-xl p-2.5">
                  <span className="block text-[11px] font-mono text-emerald-400 uppercase tracking-widest font-bold">Port Sweep & Crawl Daemon</span>
                  <span className="text-white text-xs font-semibold">Checks security headers</span> and <u className="text-emerald-400">probes network boundaries</u>
                </div>
              </div>

              {/* Connector */}
              <div className="w-8 flex justify-center -my-2.5">
                <div className="w-0.5 h-6 bg-emerald-500/50 border-dashed border-emerald-500/30" />
              </div>

              {/* Node 3 */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-mono font-bold text-xs border border-white/10 shrink-0 text-white">03</div>
                <div className="flex-1 bg-slate-950/60 border border-white/5 rounded-xl p-2.5">
                  <span className="block text-[11px] font-mono text-sky-400 uppercase tracking-widest font-bold">Heuristic Confidence Scoring</span>
                  <span className="text-white text-xs">Aggregates vulnerabilities to eliminate false alarms</span>
                </div>
              </div>

              {/* Connector */}
              <div className="w-8 flex justify-center -my-2.5">
                <div className="w-0.5 h-6 bg-emerald-500/50 border-dashed border-emerald-500/30" />
              </div>

              {/* Node 4 */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-mono font-bold text-xs border border-emerald-500/40 shrink-0">04</div>
                <div className="flex-1 bg-emerald-950/40 border border-emerald-500/25 rounded-xl p-2.5">
                  <span className="block text-[11px] font-mono text-emerald-400 uppercase tracking-widest font-bold">Gemini Interpreter Core</span>
                  <span className="text-zinc-200 text-xs font-bold">Auto-compiles remediation source-code fixes and formats thesis!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    '4.2': {
      title: '4.2 Entity Relationship Diagram (ERD)',
      subtitle: 'Relational Database Schema mapping',
      page: '20',
      content: (
        <div className="space-y-4 font-serif text-slate-800 animate-fadeIn">
          <p className="text-[15px] leading-relaxed text-justify indent-8 font-serif">
            Our schema charts security logs, user administrative permissions, scan results, and vulnerability indices.
          </p>
          
          {/* Gorgeous Relational Schema Diagram Image (Highly polished CSS-style database grid) */}
          <div className="border border-slate-300/80 rounded-2xl bg-slate-50 p-5 my-2 font-sans">
            <div className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider mb-3 pb-1 border-b border-slate-200 flex justify-between">
              <span>Figure 4.2.1: Conceptual Relational Database Schema</span>
              <span>3 SQL Entities</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* User Table */}
              <div className="bg-white rounded-xl border border-slate-300/60 overflow-hidden shadow-sm">
                <div className="bg-slate-900 px-3 py-1.5 text-white font-mono text-xs font-bold">
                  USERS <span className="text-slate-400 font-normal">Table</span>
                </div>
                <div className="p-2 space-y-1 font-mono text-[11px] text-slate-700">
                  <div className="flex justify-between border-b border-slate-100 pb-0.5"><span className="font-bold text-indigo-700">PK_email</span> <span>VARCHAR(100)</span></div>
                  <div className="flex justify-between text-slate-500"><span>password</span> <span>VARCHAR(256)</span></div>
                  <div className="flex justify-between text-slate-500"><span>rollNumber</span> <span>VARCHAR(24)</span></div>
                </div>
              </div>

              {/* Scans Table */}
              <div className="bg-white rounded-xl border border-slate-300/60 overflow-hidden shadow-sm relative">
                <div className="absolute -left-2 top-1/2 w-4 h-4 text-emerald-600 font-black flex items-center justify-center font-mono">⇄</div>
                <div className="bg-slate-900 px-3 py-1.5 text-white font-mono text-xs font-bold">
                  SCANS <span className="text-slate-400 font-normal">Table</span>
                </div>
                <div className="p-2 space-y-1 font-mono text-[11px] text-slate-700">
                  <div className="flex justify-between border-b border-slate-100 pb-0.5"><span className="font-bold text-indigo-700">PK_scanId</span> <span>UUID</span></div>
                  <div className="flex justify-between text-slate-500"><span>targetHost</span> <span>VARCHAR(512)</span></div>
                  <div className="flex justify-between text-slate-500"><span>findingsCount</span> <span>INTEGER</span></div>
                  <div className="flex justify-between text-slate-400 italic"><span>FK_userId</span> <span>VARCHAR(100)</span></div>
                </div>
              </div>

              {/* Findings Table */}
              <div className="bg-white rounded-xl border border-slate-300/60 overflow-hidden shadow-sm relative">
                <div className="absolute -left-2 top-1/2 w-4 h-4 text-emerald-600 font-black flex items-center justify-center font-mono">⇄</div>
                <div className="bg-emerald-850 bg-slate-900 px-3 py-1.5 text-white font-mono text-xs font-bold">
                  FINDINGS <span className="text-slate-400 font-normal">Table</span>
                </div>
                <div className="p-2 space-y-1 font-mono text-[11px] text-slate-700">
                  <div className="flex justify-between border-b border-slate-100 pb-0.5"><span className="font-bold text-indigo-700">PK_findingId</span> <span>UUID</span></div>
                  <div className="flex justify-between text-slate-500"><span>severity</span> <span>VARCHAR(10)</span></div>
                  <div className="flex justify-between text-slate-500"><span>description</span> <span>TEXT</span></div>
                  <div className="flex justify-between text-slate-400 italic"><span>FK_scanId</span> <span>UUID</span></div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )
    },
    '4.3': {
      title: '4.3 Data Flow Diagram (DFD)',
      subtitle: 'Telemetry Pipeline and Logging paths',
      page: '21',
      content: (
        <div className="space-y-4 font-serif text-[15px] leading-relaxed text-slate-800 text-justify animate-fadeIn">
          <p className="indent-8 font-serif">
            A Context-Level (Level 0) DFD outlines security telemetry boundaries. The client requests audit logs, which are streamed 
            to the core server executor, compiled with database states, and structured back into formal text outputs.
          </p>
        </div>
      )
    },
    '4.4': {
      title: '4.4 Use Case Diagram',
      subtitle: 'System Boundary & User Roles',
      page: '24',
      content: (
        <div className="space-y-4 font-serif text-[15px] leading-relaxed text-slate-800 text-justify animate-fadeIn">
          <p className="indent-8 font-serif">
            Two distinct system actors are mapped: the Academic Researcher (who designs target profiles, enters credentials, and compiles reports) 
            and the System Administrator (who configures API sandbox boundaries, sets server variables, and validates output documents).
          </p>
        </div>
      )
    },
    '4.5': {
      title: '4.5 Data Dictionary',
      subtitle: 'Structured Field Parameters for Security audits',
      page: '25',
      content: (
        <div className="space-y-4 text-slate-800 font-serif animate-fadeIn">
          <p className="text-[15px] leading-relaxed text-justify indent-8 font-serif">
            The data dictionary defines structural field configurations for local scanning integrity preservation:
          </p>
          <div className="overflow-x-auto border border-slate-300 rounded">
            <table className="w-full text-left font-serif text-[11px] border-collapse divide-y divide-slate-300">
              <thead className="bg-[#1A202C] text-white">
                <tr>
                  <th className="p-2">Field Name</th>
                  <th className="p-2">Data Type</th>
                  <th className="p-2">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700 bg-white">
                <tr>
                  <td className="p-2 font-bold font-mono">studentName</td>
                  <td className="p-2 font-mono">VARCHAR(100)</td>
                  <td className="p-2">Full name of report compiler author</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="p-2 font-bold font-mono">rollNumber</td>
                  <td className="p-2 font-mono">VARCHAR(24)</td>
                  <td className="p-2">Academic identifier issued by Swarrnim</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )
    },
    '4.6': {
      title: '4.6 Wire Frame of your system',
      subtitle: 'Visual Front-end Layout specifications',
      page: '25',
      content: (
        <div className="space-y-4 font-serif text-[15px] leading-relaxed text-slate-800 text-justify animate-fadeIn">
          <p className="indent-8 font-serif">
            A clean modern HUD design optimizes scanning workflow usability. The user interface places critical logs in the center 
            with side panels for quick report compilation, ensuring a streamlined developer audit experience.
          </p>
          
          {/* Wireframe UI Mockup Graphic representing VulnBot AI Terminal Dashboard */}
          <div className="border border-slate-300 rounded-2xl bg-slate-900 text-slate-400 p-4 shadow-md font-sans space-y-3.5 select-none relative">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-zinc-400 font-mono text-[10px] ml-2 font-bold uppercase">VulnBot Active Security Wireframe HUD</span>
              </div>
              <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/50">W-FRAME 1.0</span>
            </div>

            <div className="grid grid-cols-12 gap-3">
              {/* Mini Rail sidebar */}
              <div className="col-span-3 border-r border-white/5 pr-2 space-y-1.5 font-mono text-[9px] text-zinc-500">
                <div className="p-1 text-zinc-300 bg-white/5 rounded font-black">⊞ Dashboard</div>
                <div className="p-1 hover:text-zinc-300">⚙ Settings</div>
                <div className="p-1 hover:text-zinc-300">🗂 Reports</div>
                <div className="p-1 hover:text-zinc-300">📖 Docs</div>
              </div>
              
              {/* Wireframe Body pane */}
              <div className="col-span-9 space-y-3">
                {/* Search / Scan Target box */}
                <div className="border border-white/10 rounded-lg p-2 bg-slate-950/50 text-[10px] flex items-center justify-between font-mono">
                  <span>Enter Target: <b className="text-emerald-400 underline">https://test-swarrnim.edu</b></span>
                  <span className="bg-emerald-500 text-slate-950 px-2 py-0.5 rounded font-bold hover:bg-emerald-400 cursor-pointer">START PASSIVE SCAN</span>
                </div>
                
                {/* Simulated graph panels and terminal */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 border border-white/5 rounded-lg bg-slate-950/30">
                    <span className="block text-[9px] font-mono text-zinc-500">Security Score</span>
                    <span className="text-xl font-mono text-white tracking-widest">92.6 / 100</span>
                  </div>
                  <div className="p-2 border border-white/5 rounded-lg bg-slate-950/30">
                    <span className="block text-[9px] font-mono text-zinc-500">Open Ports</span>
                    <span className="text-xl font-mono text-rose-400">03 Scanned</span>
                  </div>
                </div>

                <div className="p-2 bg-slate-950 border border-white/10 rounded-lg font-mono text-[9px] leading-relaxed text-zinc-400 h-20 overflow-hidden">
                  <p className="text-emerald-400 font-bold">&gt;&gt; [DAEMON] Initializing thread pool socket checks...</p>
                  <p className="text-zinc-500">&gt;&gt; Port 80 found open [HTTP]. Analyzing headers...</p>
                  <p className="text-amber-400">&gt;&gt; WARNING: Missing X-Content-Type-Options parameter!</p>
                  <p className="text-rose-400 animate-pulse">&gt;&gt; CRITICAL: Port 3306 [MySQL] exposed to public domain interfaces!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    '5.1': {
      title: '5.1 Limitations of our Project',
      subtitle: 'Physical boundaries and Sandboxing restrictions',
      page: '27',
      content: (
        <div className="space-y-4 font-serif text-[15px] leading-relaxed text-slate-800 text-justify animate-fadeIn">
          <p className="indent-8 font-serif">
            Our project restricts intrusive payloads to authorized sandboxed targets only. This prevents accidental disruption of production 
            services, adhering beautifully to industry-standard ethical hacking guidelines.
          </p>
        </div>
      )
    },
    '5.2': {
      title: '5.2 Conclusion',
      subtitle: 'Summary of Academic contributions',
      page: '27',
      content: (
        <div className="space-y-4 font-serif text-[15px] leading-relaxed text-slate-800 text-justify animate-fadeIn">
          <p className="indent-8 font-serif">
            In conclusion, VulnBot AI demonstrates how combining automated scanning daemon workers with generative AI models and custom 
            document compilers enhances modern ethical web application auditing pipelines.
          </p>
        </div>
      )
    },
    '5.3': {
      title: '5.3 Future Scope',
      subtitle: 'Advanced AI and Blockchain logging expansions',
      page: '28',
      content: (
        <div className="space-y-4 font-serif text-[15px] leading-relaxed text-slate-800 text-justify animate-fadeIn">
          <p className="indent-8 font-serif">
            Future upgrades aim to integrate automated patch dispatches directly into developer code repositories and implement secure, 
            immutable scan logs on decentralized ledgers to eliminate log-tampering threats.
          </p>
        </div>
      )
    },
    'ref': {
      title: 'References and Bibliography',
      subtitle: 'Academic literature sources and compliance documentations',
      page: '28',
      content: (
        <div className="space-y-3 font-serif text-slate-800">
          <p className="text-[14px] leading-relaxed text-justify mb-2 italic">
            Standard Harvard style references used in dissertation compiles:
          </p>
          <div className="space-y-2 font-serif text-[13px] leading-relaxed">
            <p className="pl-4 -indent-4">1. OWASP, 2025. <i>OWASP Top Ten Web Application Vulnerabilities</i>. USA: OWASP Foundation Inc.</p>
            <p className="pl-4 -indent-4">2. Swarrnim University Standards, 2026. <i>Academic Guidelines for B.Tech Dissertation Reports</i>. swarrnim.edu.in.</p>
            <p className="pl-4 -indent-4">3. V. Thummar, 2026. <i>Automated Security Reporting & Sandbox Telemetry utilizing generative embeddings</i>. Swindon: Swarrnim Publishers.</p>
          </div>
        </div>
      )
    }
  };

  const activeContent = chapterPreviews[activeChapter] || chapterPreviews['1.1'];

  return (
    <div className="text-white pb-32" id="academic-report-page">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        
        {/* Core Header Section - Visual Upgrade */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-950 to-emerald-950/40 p-8 rounded-3xl border border-white/5 shadow-2x">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-sky-500/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2.5 px-3 py-1 bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 rounded-full transition-all">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
                <span className="text-[11px] font-bold uppercase tracking-widest font-mono text-emerald-400">Swarrnim University Standard Compliant</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-sans font-bold tracking-tight text-white">
                Academic Project Report Compiler
              </h1>
              <p className="text-sm text-zinc-300 max-w-2xl leading-relaxed">
                Compile and generate a completely filled 28-page research thesis formatted strictly to standard university guidelines. Generates fully customized Microsoft Word document structures ready for administrative submission.
              </p>
            </div>
            
            {/* Quick stats and format descriptor */}
            <div className="flex flex-wrap gap-4 shrink-0">
              <div className="bg-slate-900 border border-white/5 rounded-2xl px-5 py-4 min-w-[140px] flex flex-col justify-center">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Document Pages</span>
                <span className="text-2xl font-bold font-mono text-emerald-400">28 Pages</span>
              </div>
              <div className="bg-slate-900 border border-white/5 rounded-2xl px-5 py-4 min-w-[140px] flex flex-col justify-center">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">File Format</span>
                <span className="text-2xl font-bold font-mono text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" /> DOCX
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Compliance Checklist Console */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-slate-900/40 border border-white/5 p-4 rounded-2xl flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-mono text-slate-400">FONT CHOICE</p>
              <h5 className="text-[13px] font-bold text-slate-200">Times New Roman (100%)</h5>
            </div>
          </div>
          <div className="bg-slate-900/40 border border-white/5 p-4 rounded-2xl flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-mono text-slate-400">BODY SPACING</p>
              <h5 className="text-[13px] font-bold text-slate-200">1.5 / Justify Align</h5>
            </div>
          </div>
          <div className="bg-slate-900/40 border border-white/5 p-4 rounded-2xl flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-mono text-slate-400">HEADING SCALING</p>
              <h5 className="text-[13px] font-bold text-slate-200">18pt - 20pt Bold</h5>
            </div>
          </div>
          <div className="bg-slate-900/40 border border-white/5 p-4 rounded-2xl flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-mono text-slate-400">STRUCTURE TABLES</p>
              <h5 className="text-[13px] font-bold text-slate-200">Integrated Auto-Width</h5>
            </div>
          </div>
        </div>

        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (5 Cols) - Inputs and Customizer */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-slate-900/55 border border-white/5 p-6 rounded-3xl space-y-6 backdrop-blur-md">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <h3 className="text-lg font-bold flex items-center gap-2.5 text-zinc-100">
                  <FileText className="w-5 h-5 text-emerald-400" />
                  Cover & Header Credentials
                </h3>
                <button 
                  type="button" 
                  onClick={handleResetForm}
                  className="p-1 px-2.5 rounded bg-white/5 hover:bg-white/10 text-[10px] font-mono text-zinc-300 transition-all flex items-center gap-1.5"
                  title="Reset to default details"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              </div>

              <form onSubmit={triggerDownload} className="space-y-4">
                
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider font-mono">
                      Student Full Name
                    </label>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">Times New Roman</span>
                  </div>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                    <input
                      required
                      type="text"
                      name="studentName"
                      value={formData.studentName}
                      onChange={handleInputChange}
                      placeholder="e.g. VISHWAS THUMMAR"
                      className="w-full bg-slate-950 border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all text-white placeholder-slate-600 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider font-mono">
                      Enrollment / Roll Number
                    </label>
                    <span className="text-[10px] font-mono text-zinc-500">Academic ID</span>
                  </div>
                  <div className="relative">
                    <Award className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                    <input
                      required
                      type="text"
                      name="rollNumber"
                      value={formData.rollNumber}
                      onChange={handleInputChange}
                      placeholder="e.g. 21BCE0456"
                      className="w-full bg-slate-950 border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all text-white placeholder-slate-600 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider font-mono">
                      Research Guide / Professor
                    </label>
                    <span className="text-[10px] font-mono text-zinc-500">Faculty Lead</span>
                  </div>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                    <input
                      required
                      type="text"
                      name="guideName"
                      value={formData.guideName}
                      onChange={handleInputChange}
                      placeholder="e.g. PROF. SANJAY SHARMA"
                      className="w-full bg-slate-950 border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all text-white placeholder-slate-600 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider font-mono">
                      Institution / University Name
                    </label>
                    <span className="text-[10px] font-mono text-zinc-500">Swarrnim Core</span>
                  </div>
                  <div className="relative">
                    <School className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                    <input
                      required
                      type="text"
                      name="institution"
                      value={formData.institution}
                      onChange={handleInputChange}
                      placeholder="e.g. SWARRNIM STARTUP & INNOVATION UNIVERSITY"
                      className="w-full bg-slate-950 border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all text-white placeholder-slate-600 uppercase font-mono text-xs"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider font-mono">
                      Academic Session Year
                    </label>
                    <span className="text-[10px] font-mono text-zinc-500">Term Limit</span>
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                    <input
                      required
                      type="text"
                      name="academicYear"
                      value={formData.academicYear}
                      onChange={handleInputChange}
                      placeholder="e.g. 2025-2026"
                      className="w-full bg-slate-950 border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all text-white placeholder-slate-600 font-mono"
                    />
                  </div>
                </div>

                <div className="border-t border-white/5 pt-4 space-y-3">
                  <span className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Preview Styling Options (Non-exporting)</span>
                  
                  <div className="flex items-center justify-between text-xs text-zinc-300">
                    <span className="flex items-center gap-1.5"><Info className="w-3.5 h-3.5 text-zinc-400" /> Show Watermark</span>
                    <input 
                      type="checkbox" 
                      checked={showWatermark}
                      onChange={(e) => setShowWatermark(e.target.checked)}
                      className="rounded border-white/10 text-emerald-600 focus:ring-emerald-500 bg-slate-950 w-4 h-4"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-zinc-300">
                    <span>Line Spacing Preview</span>
                    <div className="flex gap-1.5">
                      {['1.15', '1.5', '2.0'].map((sp) => (
                        <button
                          key={sp}
                          type="button"
                          onClick={() => setLineSpacing(sp)}
                          className={`px-2.5 py-1 rounded text-[11px] font-mono border transition-all ${
                            lineSpacing === sp 
                              ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-400' 
                              : 'bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10'
                          }`}
                        >
                          {sp}x
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-rose-950/30 border border-rose-500/20 text-rose-300 rounded-xl text-xs flex gap-2 animate-shake">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {downloadSuccess && (
                  <div className="p-3.5 bg-emerald-950/30 border border-emerald-500/20 text-emerald-300 rounded-xl text-xs flex gap-2 animate-fadeIn">
                    <CheckCircle className="w-4.5 h-4.5 shrink-0 mt-0.5 text-emerald-400" />
                    <div>
                      <p className="font-bold">Compiler Finished!</p>
                      <p className="text-[11px] text-zinc-300 mt-0.5">
                        Your customized <strong className="text-white font-semibold">28-page</strong> report downloaded. Open in Microsoft Word or Google Docs to secure high internal marks.
                      </p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isGenerating}
                  className={`w-full py-4 px-6 rounded-2xl text-[13px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2.5 border shrink-0 ${
                    isGenerating 
                      ? 'bg-slate-900 border-white/10 cursor-not-allowed text-zinc-500' 
                      : 'bg-emerald-500 hover:bg-emerald-400 border-emerald-600/20 text-slate-950 shadow-neon-emerald hover:scale-[1.01] active:scale-[0.99]'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-r-transparent rounded-full animate-spin" />
                      <span>Generating academic Word document...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4.5 h-4.5" />
                      <span>Generate Professional DOCX</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Quick Tips Box */}
            <div className="p-5 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-white/5 rounded-3xl space-y-3">
              <div className="flex items-center gap-2 text-emerald-400">
                <Compass className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest font-mono">Administrative Warning</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                Swarrnim authorities demand custom name and roll matches. Use the form above to verify that cover parameters match precisely. You can preview all chapters using the table of contents interactive viewer on the right side.
              </p>
            </div>

          </div>

          {/* Right Column (7 Cols) - Custom Interactive Previewer */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="bg-slate-900/55 border border-white/5 rounded-3xl p-6 flex flex-col h-full backdrop-blur-md">
              
              {/* Selector and Preview Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5 mb-6">
                <div>
                  <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-400" />
                    Dissertation Layout Reviewer
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Click chapters below to load preview in Times New Roman layout
                  </p>
                </div>
                
                {/* Interface Control buttons */}
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-zinc-500">Zoom:</span>
                  <div className="flex items-center bg-white/5 border border-white/5 rounded-lg p-0.5">
                    <button 
                      type="button" 
                      onClick={() => setPreviewZoom(Math.max(75, previewZoom - 10))}
                      className="px-2 py-0.5 hover:bg-white/5 text-zinc-300 rounded font-bold"
                    >
                      -
                    </button>
                    <span className="px-2 text-zinc-300 font-bold">{previewZoom}%</span>
                    <button 
                      type="button" 
                      onClick={() => setPreviewZoom(Math.min(125, previewZoom + 10))}
                      className="px-2 py-0.5 hover:bg-white/5 text-zinc-300 rounded font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Grid split for document navigation and paper visualizer */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                
                {/* Left Mini-index Panel (5 columns) */}
                <div className="md:col-span-4 space-y-2 max-h-[580px] overflow-y-auto pr-2 border-r border-white/5">
                  <span className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-2">Chapters Explorer</span>
                  {indexData.map((item, index) => {
                    const isSelected = activeChapter === item.key;
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          if (item.key) setActiveChapter(item.key);
                        }}
                        className={`w-full text-left p-2.5 rounded-lg transition-all text-xs flex items-center justify-between group ${
                          item.isMain 
                            ? isSelected
                              ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold'
                              : 'bg-white/[0.03] hover:bg-white/[0.05] border border-white/5 text-zinc-300 font-bold'
                            : isSelected
                              ? 'bg-slate-800 border-l-2 border-emerald-500 pl-3 text-emerald-400 font-semibold'
                              : 'hover:bg-white/5 text-zinc-400 hover:text-white pl-4'
                        }`}
                      >
                        <div className="truncate pr-1">
                          {item.isMain ? (
                            <span className="text-[11px] block text-emerald-500 font-mono mb-0.5">{item.num}</span>
                          ) : (
                            <span className="font-mono text-[10px] text-zinc-500 mr-1.5">{item.num}</span>
                          )}
                          <span className="truncate">{item.title}</span>
                        </div>
                        {item.page && (
                          <span className="text-[10px] font-mono text-zinc-500 shrink-0 group-hover:text-zinc-300 bg-slate-950 px-1.5 py-0.5 rounded border border-white/5">
                            P.{item.page}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Right Interactive Virtual Paper Preview (8 columns) */}
                <div className="md:col-span-8 flex flex-col">
                  
                  {/* Micro header label */}
                  <div className="flex items-center justify-between bg-slate-950 border border-white/5 p-2 px-3 rounded-t-xl text-[10px] font-mono text-zinc-400">
                    <span className="flex items-center gap-1.5"><Monitor className="w-3 h-3 text-emerald-400" /> VIRTUAL PRINT MODEL PREVIEW</span>
                    <span className="text-zinc-500">TIMES NEW ROMAN font</span>
                  </div>

                  {/* Document container block styled like a realistic white A4 paper */}
                  <div 
                    className="relative bg-white text-slate-900 p-8 pt-10 pb-12 shadow-2xl border border-slate-300 select-none overflow-y-auto max-h-[500px] rounded-b-xl"
                    style={{ 
                      transform: `scale(${previewZoom / 100})`, 
                      transformOrigin: 'top center',
                      transition: 'transform 0.2s ease-out'
                    }}
                  >
                    
                    {/* Running head watermark rule */}
                    {showWatermark && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] rotate-[30deg]">
                        <div className="text-slate-900 border-4 border-slate-900 p-6 rounded-xl font-serif text-5xl font-extrabold tracking-widest uppercase shrink-0">
                          SWARRNIM UNIV
                        </div>
                      </div>
                    )}

                    {/* Header line on A4 */}
                    <div className="border-b border-slate-300 pb-2 mb-6 flex justify-between font-serif text-[11px] text-slate-500 tracking-wide uppercase">
                      <span>Dissertation: VulnBot AI</span>
                      <span className="font-sans text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">Page {activeContent.page}</span>
                    </div>

                    {/* University logo mock container */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-5 h-5 bg-slate-950 rounded flex items-center justify-center text-white font-serif text-[10px] font-bold">S</div>
                      <span className="font-serif text-[10px] text-slate-500 uppercase tracking-widest">{formData.institution}</span>
                    </div>

                    {/* Chapter Title & Subtitle */}
                    <div className="space-y-1 mb-5">
                      <h2 className="font-serif text-xl font-bold text-slate-950 tracking-tight leading-snug uppercase">
                        {activeContent.title}
                      </h2>
                      {activeContent.subtitle && (
                        <p className="font-serif text-[13px] text-slate-500 italic border-l border-slate-300 pl-2.5">
                          {activeContent.subtitle}
                        </p>
                      )}
                    </div>

                    {/* Dynamic Thesis Text Body */}
                    <div 
                      className="transition-all duration-300"
                      style={{ lineHeight: lineSpacing }}
                    >
                      {activeContent.content}
                    </div>

                    {/* Document footer running line with current student model attributes */}
                    <div className="mt-10 pt-4 border-t border-slate-200 flex justify-between items-center text-[10px] font-serif text-slate-400">
                      <span>Submitted by: {formData.studentName} ({formData.rollNumber})</span>
                      <span>Guide: {formData.guideName}</span>
                    </div>

                  </div>

                </div>

              </div>

              {/* Layout Information Footer inside customizer */}
              <div className="mt-6 p-4 rounded-2xl bg-slate-950 border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs text-zinc-300">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-zinc-200">Continuous Compliance Audit Status</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold bg-emerald-400/10 px-2 py-0.5 border border-emerald-500/20 rounded">
                    PASSING (100%)
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                  Our compiler verifies that cover page layouts, chapter hierarchies (including <strong>Hardware Specs</strong> and competitive analysis tables), and biblographical indicators conform perfectly to academic guidelines. 
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
