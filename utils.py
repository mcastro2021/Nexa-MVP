"""
Utilidades para la aplicación Nexa MVP
"""
import os
import logging
from datetime import datetime, timedelta
from typing import Optional, Dict, Any

def setup_logging(level: str = "INFO") -> None:
    """Configurar logging de la aplicación"""
    logging.basicConfig(
        level=getattr(logging, level.upper()),
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.StreamHandler(),
            logging.FileHandler('nexa_mvp.log')
        ]
    )

def get_logger(name: str) -> logging.Logger:
    """Obtener logger configurado"""
    return logging.getLogger(name)

def format_currency(amount: float) -> str:
    """Formatear cantidad como moneda"""
    return f"${amount:,.2f}"

def format_date(date: datetime) -> str:
    """Formatear fecha"""
    return date.strftime("%d/%m/%Y")

def format_datetime(dt: datetime) -> str:
    """Formatear fecha y hora"""
    return dt.strftime("%d/%m/%Y %H:%M")

def calculate_progress(completed: int, total: int) -> int:
    """Calcular porcentaje de progreso"""
    if total == 0:
        return 0
    return min(100, int((completed / total) * 100))

def validate_email(email: str) -> bool:
    """Validar formato de email"""
    import re
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_phone(phone: str) -> bool:
    """Validar formato de teléfono"""
    import re
    # Patrón para teléfonos argentinos
    pattern = r'^\+?54?9?[0-9]{8,10}$'
    return re.match(pattern, phone) is not None

def sanitize_filename(filename: str) -> str:
    """Sanitizar nombre de archivo"""
    import re
    # Remover caracteres especiales
    filename = re.sub(r'[^a-zA-Z0-9._-]', '_', filename)
    # Limitar longitud
    if len(filename) > 255:
        name, ext = os.path.splitext(filename)
        filename = name[:255-len(ext)] + ext
    return filename

def get_file_size_mb(file_path: str) -> float:
    """Obtener tamaño de archivo en MB"""
    try:
        size_bytes = os.path.getsize(file_path)
        return size_bytes / (1024 * 1024)
    except OSError:
        return 0.0

def create_backup_filename(original_name: str) -> str:
    """Crear nombre de archivo de backup"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    name, ext = os.path.splitext(original_name)
    return f"{name}_backup_{timestamp}{ext}"

def is_production() -> bool:
    """Verificar si estamos en producción"""
    return os.getenv('FLASK_ENV', 'development') == 'production'

def get_config_value(key: str, default: Any = None) -> Any:
    """Obtener valor de configuración"""
    return os.getenv(key, default)

def format_duration(seconds: int) -> str:
    """Formatear duración en segundos a formato legible"""
    if seconds < 60:
        return f"{seconds}s"
    elif seconds < 3600:
        minutes = seconds // 60
        return f"{minutes}m {seconds % 60}s"
    else:
        hours = seconds // 3600
        minutes = (seconds % 3600) // 60
        return f"{hours}h {minutes}m"
