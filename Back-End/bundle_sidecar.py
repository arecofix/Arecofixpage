import os
import subprocess
import sys

def build_exe():
    """
    Empaqueta la API de Flask en un único ejecutable .exe para que Tauri
    pueda iniciarlo como un 'sidecar'.
    """
    print("Iniciando empaquetado del Backend con PyInstaller...")
    
    # Nombre base para el binario (debe coincidir con la config de Tauri)
    # Tauri espera: binario-arquitectura-SO.exe
    target = "x86_64-pc-windows-msvc" # Asumimos Windows bits 64 para este entorno
    exe_name = f"arecofix-backend-{target}"
    
    cmd = [
        sys.executable,
        "-m",
        "PyInstaller",
        "--noconfirm",
        "--onefile",
        "--console", 
        "--name", exe_name,
        "app.py"
    ]
    
    try:
        subprocess.check_call(cmd)
        print(f"DONE: Backend successfully bundled: dist/{exe_name}.exe")
        print("Now copy this file to 'Front-end/src-tauri/binaries/'")
    except Exception as e:
        print(f"ERROR: Failed to bundle: {e}")

if __name__ == "__main__":
    if os.path.exists("app.py"):
        build_exe()
    else:
        print("Error: No se encontró app.py en el directorio actual.")
