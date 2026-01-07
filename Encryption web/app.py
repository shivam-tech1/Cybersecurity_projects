# app.py  -- Full file. Paste entire content into your app.py (replace current).
from flask import Flask, render_template, request
import hashlib
import base64
import json
import os

# Optional encryption dependency for history file
# If you want encrypted history, install: py -m pip install cryptography
try:
    from cryptography.fernet import Fernet
    CRYPTO_AVAILABLE = True
except Exception:
    CRYPTO_AVAILABLE = False

app = Flask(__name__)

# ---------------------------
# Config
# ---------------------------
HISTORY_FILE = "history.json"   # path to history file (can be changed)
MASTER_PASS_ENV = "HISTORY_MASTER_PASS"  # env var name for master password

# ---------------------------
# Morse table
# ---------------------------
MORSE_CODE = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..',
    'E': '.', 'F': '..-.', 'G': '--.', 'H': '....',
    'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
    'M': '--', 'N': '-.', 'O': '---', 'P': '.--.',
    'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-',
    'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..',
    '0': '-----', '1': '.----', '2': '..---', '3': '...--',
    '4': '....-', '5': '.....', '6': '-....', '7': '--...',
    '8': '---..', '9': '----.', ' ': '/'
}

# ---------------------------
# Basic helpers
# ---------------------------
def text_to_morse(text: str) -> str:
    return ' '.join(MORSE_CODE.get(ch, ch) for ch in text.upper())

def sha512_hash(text: str, key: str) -> str:
    return hashlib.sha512((text + key).encode('utf-8')).hexdigest()

def derive_key_bytes(key: str) -> bytes:
    return hashlib.sha512(key.encode('utf-8')).digest()

def server_encrypt_store(plaintext: str, key: str) -> str:
    """Reversible XOR-based encryption for server-side storage only."""
    k = derive_key_bytes(key)
    pb = plaintext.encode('utf-8')
    out = bytearray()
    for i, b in enumerate(pb):
        out.append(b ^ k[i % len(k)])
    return base64.b64encode(out).decode('utf-8')

def server_decrypt_store(cipher_b64: str, key: str) -> str:
    k = derive_key_bytes(key)
    data = base64.b64decode(cipher_b64.encode('utf-8'))
    out = bytearray()
    for i, b in enumerate(data):
        out.append(b ^ k[i % len(k)])
    return out.decode('utf-8')

# ---------------------------
# Encrypted-history helpers (Fernet) - optional
# ---------------------------
def derive_fernet_key(master_password: str) -> bytes:
    """
    Derive a Fernet-compatible key from a master password using SHA-256.
    Returns urlsafe base64-encoded 32-byte key (bytes).
    """
    h = hashlib.sha256(master_password.encode('utf-8')).digest()
    return base64.urlsafe_b64encode(h)

def load_encrypted_history(master_password: str, history_path: str = HISTORY_FILE) -> list:
    """
    Decrypt and return list of entries from encrypted history file.
    If decryption fails or file missing, returns [].
    """
    if not CRYPTO_AVAILABLE:
        return []
    key = derive_fernet_key(master_password)
    fernet = Fernet(key)
    if not os.path.exists(history_path):
        return []
    try:
        with open(history_path, "rb") as f:
            encrypted_bytes = f.read()
        if not encrypted_bytes:
            return []
        decrypted = fernet.decrypt(encrypted_bytes)
        data = json.loads(decrypted.decode("utf-8"))
        return data if isinstance(data, list) else []
    except Exception:
        return []

def save_encrypted_history(entries: list, master_password: str, history_path: str = HISTORY_FILE):
    """
    Encrypt and save entries list (overwrites file).
    """
    if not CRYPTO_AVAILABLE:
        raise RuntimeError("cryptography library not available")
    key = derive_fernet_key(master_password)
    fernet = Fernet(key)
    payload = json.dumps(entries, ensure_ascii=False).encode("utf-8")
    encrypted = fernet.encrypt(payload)
    with open(history_path, "wb") as f:
        f.write(encrypted)

# ---------------------------
# Plain-history helpers (fallback)
# ---------------------------
def load_plain_history(history_path: str = HISTORY_FILE) -> list:
    if not os.path.exists(history_path):
        return []
    try:
        with open(history_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        return data if isinstance(data, list) else []
    except Exception:
        return []

def save_plain_history(entries: list, history_path: str = HISTORY_FILE):
    with open(history_path, "w", encoding="utf-8") as f:
        json.dump(entries, f, ensure_ascii=False, indent=2)

# ---------------------------
# Unified mapping functions (auto choose encrypted/plain based on env)
# ---------------------------
def save_mapping(hash_value: str, cipher_b64: str):
    """
    Save mapping {hash, cipher} into history.
    If HISTORY_MASTER_PASS env var exists and cryptography is available, use encrypted storage.
    Otherwise fallback to plain JSON.
    """
    master = os.environ.get(MASTER_PASS_ENV, None)
    if master and CRYPTO_AVAILABLE:
        entries = load_encrypted_history(master)
        entries.append({"hash": hash_value, "cipher": cipher_b64})
        # keep last N entries to limit file size (optional)
        KEEP_LAST = 1000
        if KEEP_LAST and len(entries) > KEEP_LAST:
            entries = entries[-KEEP_LAST:]
        save_encrypted_history(entries, master)
    else:
        # plain
        entries = load_plain_history()
        entries.append({"hash": hash_value, "cipher": cipher_b64})
        save_plain_history(entries)

def lookup_cipher_by_hash(hash_value: str):
    """
    Lookup cipher by hash. Tries encrypted history if env var set and lib available; else plain.
    Returns cipher_b64 string or None.
    """
    master = os.environ.get(MASTER_PASS_ENV, None)
    if master and CRYPTO_AVAILABLE:
        entries = load_encrypted_history(master)
    else:
        entries = load_plain_history()
    # search newest first
    for it in reversed(entries):
        if it.get("hash") == hash_value:
            return it.get("cipher")
    return None

# ---------------------------
# Flask routes
# ---------------------------
@app.route("/", methods=["GET", "POST"])
def index():
    encrypt_result = None
    decrypt_result = None
    error_message = None

    if request.method == "POST":
        action = request.form.get("action")

        # ENCRYPT: show Morse + SHA-512 only, store reversible cipher server-side
        if action == "encrypt":
            text = request.form.get("plain_text", "").strip()
            key = request.form.get("enc_key", "").strip()
            if not text or not key:
                error_message = "Please enter both text and security key."
            else:
                morse = text_to_morse(text)
                the_hash = sha512_hash(morse, key)      # hash over MORSE + KEY
                cipher_for_storage = server_encrypt_store(text, key)  # reversible stored server-side
                try:
                    save_mapping(the_hash, cipher_for_storage)
                except Exception as e:
                    # do not leak details - store plain fallback
                    save_plain_history(load_plain_history() + [{"hash": the_hash, "cipher": cipher_for_storage}])
                # show only morse + hash
                encrypt_result = {"morse": morse, "hash": the_hash}

        # DECRYPT: user supplies SHA-512 + key -> lookup cipher and decrypt
        elif action == "decrypt":
            provided_hash = request.form.get("provided_hash", "").strip()
            key = request.form.get("dec_key", "").strip()
            if not provided_hash or not key:
                error_message = "Please enter SHA-512 hash and the security key to decrypt."
            else:
                cipher = lookup_cipher_by_hash(provided_hash)
                if not cipher:
                    error_message = "No stored entry found for this SHA-512 hash."
                else:
                    try:
                        original = server_decrypt_store(cipher, key)
                        # recompute to verify
                        morse_of_original = text_to_morse(original)
                        recomputed = sha512_hash(morse_of_original, key)
                        verification = (recomputed == provided_hash)
                        decrypt_result = {"original": original, "recomputed": recomputed, "verification": verification}
                    except Exception:
                        error_message = "Decryption failed. Possibly wrong key."

    return render_template("index.html",
                           encrypt_result=encrypt_result,
                           decrypt_result=decrypt_result,
                           error_message=error_message)


if __name__ == "__main__":
    app.run(debug=True)
