#!/usr/bin/env python3

import tkinter as tk
from tkinter import ttk, messagebox, filedialog, scrolledtext
import threading
import random
import string
import os
import time
from datetime import datetime
from collections import OrderedDict

class ShivamWordlistPro:
    def __init__(self, root):
        self.root = root
        self.root.title("🔥 SHIVAM WORDLIST GENERATOR PRO - 1 CRORE EDITION 🔥")
        self.root.geometry("1400x900")
        self.root.configure(bg='#0f0f0f')
        
        self.generating = False
        self.wordlist = OrderedDict()
        self.total = 0
        self.target = 10000000
        self.start_time = 0
        
        self.colors = {
            'bg': '#0f0f0f',
            'card': '#1a1a1a',
            'accent1': '#00ff88',
            'accent2': '#ff0066',
            'accent3': '#ffaa00',
            'text': '#ffffff',
            'text_dim': '#888888',
            'success': '#00ff88',
            'danger': '#ff0066',
            'warning': '#ffaa00'
        }
        
        self.setup_styles()
        self.create_main_interface()
        
    def setup_styles(self):
        style = ttk.Style()
        style.theme_use('clam')
        style.configure('TNotebook', background=self.colors['bg'], borderwidth=0)
        style.configure('TNotebook.Tab', background=self.colors['card'], foreground=self.colors['text'],
                       padding=[20, 10], font=('Segoe UI', 11, 'bold'))
        style.map('TNotebook.Tab', background=[('selected', self.colors['accent1'])],
                 foreground=[('selected', '#000000')])
        
    def create_main_interface(self):
        main = tk.Frame(self.root, bg=self.colors['bg'])
        main.pack(fill=tk.BOTH, expand=True, padx=20, pady=20)
        
        self.create_header(main)
        
        stats_frame = self.create_stats_dashboard(main)
        stats_frame.pack(fill=tk.X, pady=(0, 20))
        
        notebook = ttk.Notebook(main)
        notebook.pack(fill=tk.BOTH, expand=True)
        
        self.create_info_tab(notebook)
        self.create_pattern_tab(notebook)
        self.create_advanced_tab(notebook)
        self.create_generate_tab(notebook)
        
        self.create_footer(main)
        
    def create_header(self, parent):
        header = tk.Frame(parent, bg=self.colors['bg'])
        header.pack(fill=tk.X, pady=(0, 20))
        
        title_frame = tk.Frame(header, bg=self.colors['card'], relief=tk.RAISED, bd=1)
        title_frame.pack(fill=tk.X)
        
        title = tk.Label(title_frame, text="⚡ SHIVAM WORDLIST GENERATOR PRO ⚡",
                        font=('Impact', 32), bg=self.colors['card'], fg=self.colors['accent1'])
        title.pack(pady=15)
        
        subtitle = tk.Label(title_frame, text="1 CRORE+ COMBINATIONS | 8-12 CHARACTERS | ULTRA FAST",
                           font=('Segoe UI', 12), bg=self.colors['card'], fg=self.colors['accent3'])
        subtitle.pack(pady=(0, 15))
        
    def create_stats_dashboard(self, parent):
        frame = tk.Frame(parent, bg=self.colors['bg'])
        
        stats = [
            ("🎯 TARGET", f"{self.target:,}", self.colors['accent1']),
            ("⚡ STATUS", "READY", self.colors['warning']),
            ("📊 GENERATED", "0", self.colors['accent2']),
            ("💾 SIZE", "0 MB", self.colors['accent3'])
        ]
        
        self.stat_widgets = {}
        
        for i, (label, value, color) in enumerate(stats):
            card = tk.Frame(frame, bg=self.colors['card'], relief=tk.RAISED, bd=1)
            card.pack(side=tk.LEFT, expand=True, fill=tk.BOTH, padx=5)
            
            tk.Label(card, text=label, font=('Segoe UI', 10), bg=self.colors['card'],
                    fg=self.colors['text_dim']).pack(pady=(10, 5))
            
            if i == 1:
                lbl = tk.Label(card, text=value, font=('Digital-7', 20, 'bold'),
                              bg=self.colors['card'], fg=color)
            else:
                lbl = tk.Label(card, text=value, font=('Segoe UI', 20, 'bold'),
                              bg=self.colors['card'], fg=color)
            lbl.pack(pady=(0, 10))
            
            self.stat_widgets[label] = lbl
        
        return frame
    
    def create_info_tab(self, notebook):
        tab = tk.Frame(notebook, bg=self.colors['bg'])
        notebook.add(tab, text="📝 PERSONAL INFO")
        
        canvas = tk.Canvas(tab, bg=self.colors['bg'], highlightthickness=0)
        scrollbar = ttk.Scrollbar(tab, orient="vertical", command=canvas.yview)
        scrollable = tk.Frame(canvas, bg=self.colors['bg'])
        
        scrollable.bind("<Configure>", lambda e: canvas.configure(scrollregion=canvas.bbox("all")))
        canvas.create_window((0, 0), window=scrollable, anchor="nw")
        canvas.configure(yscrollcommand=scrollbar.set)
        
        self.entries = {}
        
        categories = {
            "👤 IDENTITY": ["first_name", "last_name", "nickname", "username"],
            "🎂 BIRTH": ["birth_year", "birth_month", "birth_day"],
            "📱 CONTACT": ["phone", "phone_last4", "address"],
            "❤️ RELATIONSHIPS": ["partner", "child", "pet"],
            "💼 WORK": ["company", "employee_id", "team"],
            "🎨 INTERESTS": ["hobby", "sport", "color", "music"]
        }
        
        for category, fields in categories.items():
            cat_frame = tk.LabelFrame(scrollable, text=category, bg=self.colors['card'],
                                     fg=self.colors['accent1'], font=('Segoe UI', 12, 'bold'),
                                     relief=tk.GROOVE, bd=2)
            cat_frame.pack(fill=tk.X, padx=15, pady=10)
            
            inner = tk.Frame(cat_frame, bg=self.colors['card'])
            inner.pack(padx=15, pady=10)
            
            for i, field in enumerate(fields):
                row = i // 2
                col = i % 2
                
                frame = tk.Frame(inner, bg=self.colors['card'])
                frame.grid(row=row, column=col, sticky="ew", padx=10, pady=5)
                
                label = field.replace('_', ' ').title()
                tk.Label(frame, text=f"{label}:", font=('Segoe UI', 10),
                        bg=self.colors['card'], fg=self.colors['text'], width=15, anchor='w').pack(side=tk.LEFT)
                
                entry = tk.Entry(frame, bg='#2a2a2a', fg=self.colors['text'],
                                font=('Segoe UI', 10), relief=tk.FLAT, width=25)
                entry.pack(side=tk.RIGHT, expand=True, fill=tk.X)
                self.entries[field] = entry
        
        canvas.pack(side="left", fill="both", expand=True)
        scrollbar.pack(side="right", fill="y")
        
    def create_pattern_tab(self, notebook):
        tab = tk.Frame(notebook, bg=self.colors['bg'])
        notebook.add(tab, text="🎯 PATTERNS")
        
        main_frame = tk.Frame(tab, bg=self.colors['bg'])
        main_frame.pack(fill=tk.BOTH, expand=True, padx=20, pady=20)
        
        self.patterns = {}
        
        pattern_cats = {
            "🔤 WORD PATTERNS": [
                ("Word + Number", "word_num", True),
                ("Word + Year", "word_year", True),
                ("Word + Special", "word_special", True),
                ("Word + Word", "word_word", True)
            ],
            "🔢 NUMBER PATTERNS": [
                ("Sequential (123, 456)", "sequential", True),
                ("Repeating (111, 222)", "repeating", True),
                ("Years (1980-2025)", "years", True),
                ("Birth Dates", "birth_dates", True)
            ],
            "🎨 CASE VARIATIONS": [
                ("Lowercase", "lower", True),
                ("Uppercase", "upper", True),
                ("Capitalized", "capital", True),
                ("Random Case", "random_case", False)
            ],
            "💫 SPECIAL PATTERNS": [
                ("Leet Speak", "leet", True),
                ("Reverse String", "reverse", False),
                ("Add Prefix/Suffix", "affix", True),
                ("Keyboard Patterns", "keyboard", True)
            ]
        }
        
        row = 0
        for cat_name, patterns in pattern_cats.items():
            cat_frame = tk.LabelFrame(main_frame, text=cat_name, bg=self.colors['card'],
                                     fg=self.colors['accent2'], font=('Segoe UI', 11, 'bold'))
            cat_frame.pack(fill=tk.X, pady=10)
            
            inner = tk.Frame(cat_frame, bg=self.colors['card'])
            inner.pack(padx=15, pady=10)
            
            for i, (name, key, default) in enumerate(patterns):
                var = tk.BooleanVar(value=default)
                self.patterns[key] = var
                
                cb = tk.Checkbutton(inner, text=name, variable=var,
                                   bg=self.colors['card'], fg=self.colors['text'],
                                   selectcolor=self.colors['card'], font=('Segoe UI', 10))
                cb.grid(row=i//2, column=i%2, sticky='w', padx=20, pady=5)
        
    def create_advanced_tab(self, notebook):
        tab = tk.Frame(notebook, bg=self.colors['bg'])
        notebook.add(tab, text="⚙️ ADVANCED")
        
        main = tk.Frame(tab, bg=self.colors['bg'])
        main.pack(fill=tk.BOTH, expand=True, padx=20, pady=20)
        
        len_frame = tk.LabelFrame(main, text="PASSWORD LENGTH", bg=self.colors['card'],
                                  fg=self.colors['accent3'], font=('Segoe UI', 11, 'bold'))
        len_frame.pack(fill=tk.X, pady=10)
        
        inner = tk.Frame(len_frame, bg=self.colors['card'])
        inner.pack(padx=15, pady=15)
        
        tk.Label(inner, text="Minimum:", bg=self.colors['card'], fg=self.colors['text'],
                font=('Segoe UI', 10)).pack(side=tk.LEFT, padx=5)
        self.min_len = tk.Spinbox(inner, from_=6, to=20, width=8, bg='#2a2a2a',
                                 fg=self.colors['text'], relief=tk.FLAT, font=('Segoe UI', 10))
        self.min_len.delete(0, tk.END)
        self.min_len.insert(0, "8")
        self.min_len.pack(side=tk.LEFT, padx=5)
        
        tk.Label(inner, text="Maximum:", bg=self.colors['card'], fg=self.colors['text'],
                font=('Segoe UI', 10)).pack(side=tk.LEFT, padx=5)
        self.max_len = tk.Spinbox(inner, from_=6, to=20, width=8, bg='#2a2a2a',
                                 fg=self.colors['text'], relief=tk.FLAT, font=('Segoe UI', 10))
        self.max_len.delete(0, tk.END)
        self.max_len.insert(0, "12")
        self.max_len.pack(side=tk.LEFT, padx=5)
        
        speed_frame = tk.LabelFrame(main, text="GENERATION SPEED", bg=self.colors['card'],
                                   fg=self.colors['accent3'], font=('Segoe UI', 11, 'bold'))
        speed_frame.pack(fill=tk.X, pady=10)
        
        self.speed = tk.StringVar(value="fast")
        speeds = [("🚀 INSANE (Fastest)", "insane"), ("⚡ FAST (Recommended)", "fast"),
                 ("🐌 THOROUGH (More combos)", "thorough")]
        
        for text, value in speeds:
            rb = tk.Radiobutton(speed_frame, text=text, variable=self.speed, value=value,
                               bg=self.colors['card'], fg=self.colors['text'],
                               selectcolor=self.colors['card'], font=('Segoe UI', 10))
            rb.pack(anchor=tk.W, padx=20, pady=3)
        
    def create_generate_tab(self, notebook):
        tab = tk.Frame(notebook, bg=self.colors['bg'])
        notebook.add(tab, text="🚀 GENERATE")
        
        main = tk.Frame(tab, bg=self.colors['bg'])
        main.pack(fill=tk.BOTH, expand=True, padx=20, pady=20)
        
        btn_frame = tk.Frame(main, bg=self.colors['bg'])
        btn_frame.pack(fill=tk.X, pady=10)
        
        self.start_btn = tk.Button(btn_frame, text="🔥 START GENERATION (1 CRORE+) 🔥",
                                  command=self.start_generation,
                                  bg=self.colors['accent1'], fg='#000000',
                                  font=('Impact', 14), cursor='hand2',
                                  height=2, relief=tk.RAISED)
        self.start_btn.pack(side=tk.LEFT, expand=True, fill=tk.X, padx=5)
        
        self.stop_btn = tk.Button(btn_frame, text="⛔ STOP", command=self.stop_generation,
                                 bg=self.colors['danger'], fg='#ffffff',
                                 font=('Segoe UI', 12, 'bold'), state=tk.DISABLED,
                                 cursor='hand2', height=2)
        self.stop_btn.pack(side=tk.LEFT, expand=True, fill=tk.X, padx=5)
        
        self.save_btn = tk.Button(btn_frame, text="💾 SAVE WORDLIST", command=self.save_wordlist,
                                 bg=self.colors['accent3'], fg='#000000',
                                 font=('Segoe UI', 12, 'bold'), state=tk.DISABLED,
                                 cursor='hand2', height=2)
        self.save_btn.pack(side=tk.LEFT, expand=True, fill=tk.X, padx=5)
        
        progress_frame = tk.LabelFrame(main, text="PROGRESS", bg=self.colors['card'],
                                      fg=self.colors['accent1'], font=('Segoe UI', 11, 'bold'))
        progress_frame.pack(fill=tk.X, pady=10)
        
        self.progress_bar = ttk.Progressbar(progress_frame, mode='determinate',
                                           style='TProgressbar', length=400)
        self.progress_bar.pack(fill=tk.X, padx=20, pady=15)
        
        self.progress_label = tk.Label(progress_frame, text="0%", bg=self.colors['card'],
                                      fg=self.colors['accent1'], font=('Digital-7', 16, 'bold'))
        self.progress_label.pack(pady=5)
        
        stats_inner = tk.Frame(progress_frame, bg=self.colors['card'])
        stats_inner.pack(pady=10)
        
        self.count_label = tk.Label(stats_inner, text="Generated: 0", bg=self.colors['card'],
                                   fg=self.colors['text'], font=('Segoe UI', 10))
        self.count_label.pack(side=tk.LEFT, padx=20)
        
        self.time_label = tk.Label(stats_inner, text="Time: 0s", bg=self.colors['card'],
                                  fg=self.colors['text'], font=('Segoe UI', 10))
        self.time_label.pack(side=tk.LEFT, padx=20)
        
        self.rate_label = tk.Label(stats_inner, text="Rate: 0 pwd/s", bg=self.colors['card'],
                                  fg=self.colors['text'], font=('Segoe UI', 10))
        self.rate_label.pack(side=tk.LEFT, padx=20)
        
        preview_frame = tk.LabelFrame(main, text="LIVE PREVIEW (First 100 passwords)",
                                     bg=self.colors['card'], fg=self.colors['accent2'],
                                     font=('Segoe UI', 11, 'bold'))
        preview_frame.pack(fill=tk.BOTH, expand=True, pady=10)
        
        self.preview = scrolledtext.ScrolledText(preview_frame, height=12,
                                                bg='#1a1a1a', fg=self.colors['accent1'],
                                                font=('Courier New', 9), relief=tk.FLAT)
        self.preview.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
        
    def create_footer(self, parent):
        footer = tk.Frame(parent, bg=self.colors['bg'])
        footer.pack(fill=tk.X, pady=(20, 0))
        
        credit = tk.Label(footer, text="⚡ PRESENTED BY SHIVAM | 1 CRORE EDITION ⚡",
                         bg=self.colors['bg'], fg=self.colors['accent2'],
                         font=('Impact', 12))
        credit.pack()
        
    def start_generation(self):
        if self.generating:
            return
        
        confirm = messagebox.askyesno("Confirm", f"Generate {self.target:,} passwords?\nEstimated time: 20-40 minutes\nFile size: 500MB - 1GB\n\nContinue?")
        if not confirm:
            return
        
        self.generating = True
        self.total = 0
        self.wordlist.clear()
        self.preview.delete(1.0, tk.END)
        self.start_time = time.time()
        
        self.start_btn.config(state=tk.DISABLED)
        self.stop_btn.config(state=tk.NORMAL)
        self.save_btn.config(state=tk.DISABLED)
        
        self.update_stats_display()
        
        thread = threading.Thread(target=self.generate_bulk)
        thread.daemon = True
        thread.start()
        
    def stop_generation(self):
        self.generating = False
        self.stop_btn.config(state=tk.DISABLED)
        
    def generate_bulk(self):
        try:
            min_l = int(self.min_len.get())
            max_l = int(self.max_len.get())
            speed_mode = self.speed.get()
            
            info_data = {k: v.get().strip().lower() for k, v in self.entries.items() if v.get().strip()}
            
            words = set()
            for val in info_data.values():
                if val:
                    words.add(val)
                    words.add(val.capitalize())
                    words.add(val.upper())
                    if len(val) >= 3:
                        words.add(val + '123')
                        words.add(val + '!')
            
            words.add('shivam')
            words.add('SHIVAM')
            words.add('Shivam')
            words.add('admin')
            words.add('password')
            words.add('user')
            words.add('root')
            
            numbers = [str(i) for i in range(0, 1000)] + [str(i).zfill(2) for i in range(0, 100)]
            years = [str(y) for y in range(1980, 2026)]
            specials = ['!', '@', '#', '$', '%', '&', '*', '?', '123', '007', '69', '420']
            keyboard = ['qwerty', 'asdfgh', 'zxcvbn', '1qaz2wsx', 'qwerty123', 'admin123']
            
            word_list = list(words)[:150] if speed_mode == 'insane' else list(words)[:300]
            num_list = numbers[:300] if speed_mode == 'insane' else numbers[:500]
            
            self.update_status("Generating combinations...")
            
            for word in word_list:
                if not self.generating or self.total >= self.target:
                    break
                
                for num in num_list:
                    if self.total >= self.target:
                        break
                    
                    if self.patterns.get('word_num', tk.BooleanVar(value=True)).get():
                        c1 = f"{word}{num}"
                        if min_l <= len(c1) <= max_l:
                            self.add(c1)
                        
                        c2 = f"{num}{word}"
                        if min_l <= len(c2) <= max_l:
                            self.add(c2)
                    
                    if self.patterns.get('word_special', tk.BooleanVar(value=True)).get():
                        for sp in specials[:5]:
                            c3 = f"{word}{sp}{num}"
                            if min_l <= len(c3) <= max_l:
                                self.add(c3)
                
                if self.patterns.get('word_year', tk.BooleanVar(value=True)).get():
                    for yr in years[:30]:
                        c4 = f"{word}{yr}"
                        if min_l <= len(c4) <= max_l:
                            self.add(c4)
                        
                        c5 = f"{yr}{word}"
                        if min_l <= len(c5) <= max_l:
                            self.add(c5)
            
            if self.patterns.get('word_word', tk.BooleanVar(value=True)).get() and self.total < self.target:
                for i, w1 in enumerate(word_list[:50]):
                    if not self.generating or self.total >= self.target:
                        break
                    for w2 in word_list[i+1:50]:
                        c6 = f"{w1}{w2}"
                        if min_l <= len(c6) <= max_l:
                            self.add(c6)
                        
                        c7 = f"{w1}_{w2}"
                        if min_l <= len(c7) <= max_l:
                            self.add(c7)
            
            if self.patterns.get('sequential', tk.BooleanVar(value=True)).get() and self.total < self.target:
                for i in range(100, 1000):
                    if self.total >= self.target:
                        break
                    c8 = str(i)
                    if min_l <= len(c8) <= max_l:
                        self.add(c8)
                    
                    c9 = str(i) * 2
                    if len(c9) <= max_l:
                        self.add(c9)
            
            if self.patterns.get('repeating', tk.BooleanVar(value=True)).get() and self.total < self.target:
                for digit in range(0, 10):
                    for length in range(4, 7):
                        rep = str(digit) * length
                        if min_l <= len(rep) <= max_l:
                            self.add(rep)
            
            if self.patterns.get('keyboard', tk.BooleanVar(value=True)).get() and self.total < self.target:
                for pattern in keyboard:
                    for num in range(1, 100):
                        c10 = f"{pattern}{num}"
                        if min_l <= len(c10) <= max_l:
                            self.add(c10)
            
            if self.patterns.get('birth_dates', tk.BooleanVar(value=True)).get() and self.total < self.target:
                if info_data.get('birth_day') and info_data.get('birth_month'):
                    day = info_data['birth_day'].zfill(2)
                    month = info_data['birth_month'].zfill(2)
                    for yr in years[-15:]:
                        dates = [f"{day}{month}{yr}", f"{month}{day}{yr}", f"{yr}{month}{day}",
                                f"{day}{month}{yr[-2:]}", f"{yr[-2:]}{month}{day}"]
                        for dt in dates:
                            if min_l <= len(dt) <= max_l:
                                self.add(dt)
            
            if speed_mode == 'thorough' and self.total < self.target:
                chars = string.ascii_lowercase + string.digits
                for length in range(min_l, min(max_l, 9)):
                    for combo in self.fast_product(chars, length):
                        if self.total >= self.target:
                            break
                        pwd = ''.join(combo)
                        self.add(pwd)
            
            while self.total < self.target and self.generating:
                length = random.randint(min_l, max_l)
                chars = []
                if self.patterns.get('lower', tk.BooleanVar(value=True)).get():
                    chars.extend(string.ascii_lowercase)
                if self.patterns.get('upper', tk.BooleanVar(value=True)).get():
                    chars.extend(string.ascii_uppercase)
                chars.extend(string.digits)
                if self.patterns.get('word_special', tk.BooleanVar(value=True)).get():
                    chars.extend('!@#$%')
                
                pwd = ''.join(random.choice(chars) for _ in range(length))
                self.add(pwd)
            
            self.generating = False
            self.start_btn.config(state=tk.NORMAL)
            self.stop_btn.config(state=tk.DISABLED)
            self.save_btn.config(state=tk.NORMAL)
            self.update_status("COMPLETED!")
            
        except Exception as e:
            self.update_status(f"Error: {str(e)}")
            self.generating = False
            self.start_btn.config(state=tk.NORMAL)
            self.stop_btn.config(state=tk.DISABLED)
    
    def fast_product(self, chars, length):
        indices = [0] * length
        chars_list = list(chars)
        while True:
            yield [chars_list[i] for i in indices]
            for pos in reversed(range(length)):
                if indices[pos] < len(chars_list) - 1:
                    indices[pos] += 1
                    break
                indices[pos] = 0
            else:
                break
    
    def add(self, password):
        if password not in self.wordlist:
            self.wordlist[password] = True
            self.total += 1
            
            if self.total % 5000 == 0:
                self.update_stats_display()
            
            if self.total <= 100:
                self.preview.insert(tk.END, f"{self.total:4d}. {password}\n")
                self.preview.see(tk.END)
    
    def update_stats_display(self):
        percent = (self.total / self.target) * 100
        elapsed = time.time() - self.start_time
        rate = self.total / elapsed if elapsed > 0 else 0
        size_mb = (self.total * 12) / (1024 * 1024)
        
        self.stat_widgets["📊 GENERATED"].config(text=f"{self.total:,}")
        self.stat_widgets["💾 SIZE"].config(text=f"{size_mb:.1f} MB")
        
        self.progress_bar['value'] = percent
        self.progress_label.config(text=f"{percent:.2f}%")
        self.count_label.config(text=f"Generated: {self.total:,}")
        self.time_label.config(text=f"Time: {int(elapsed)}s")
        self.rate_label.config(text=f"Rate: {int(rate):,} pwd/s")
        
        if self.total >= self.target:
            self.progress_label.config(text="✅ COMPLETED!")
        
        self.root.update_idletasks()
    
    def update_status(self, status):
        self.stat_widgets["⚡ STATUS"].config(text=status)
        self.root.update_idletasks()
    
    def save_wordlist(self):
        if not self.wordlist:
            messagebox.showwarning("Warning", "No wordlist generated!")
            return
        
        filename = filedialog.asksaveasfilename(
            defaultextension=".txt",
            filetypes=[("Text files", "*.txt"), ("All files", "*.*")],
            initialfile=f"SHIVAM_WORDLIST_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
        )
        
        if filename:
            try:
                with open(filename, 'w', encoding='utf-8') as f:
                    for pwd in self.wordlist.keys():
                        f.write(pwd + '\n')
                
                size = os.path.getsize(filename) / (1024 * 1024)
                messagebox.showinfo("Success", 
                                   f"✅ WORDLIST SAVED!\n\n"
                                   f"📁 File: {os.path.basename(filename)}\n"
                                   f"🔢 Passwords: {len(self.wordlist):,}\n"
                                   f"💾 Size: {size:.2f} MB\n\n"
                                   f"🔥 PRESENTED BY: SHIVAM 🔥")
                
            except Exception as e:
                messagebox.showerror("Error", f"Failed to save: {str(e)}")

if __name__ == "__main__":
    root = tk.Tk()
    app = ShivamWordlistPro(root)
    root.mainloop()
