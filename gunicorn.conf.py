# Configuración de Gunicorn para producción
import multiprocessing

# Configuración del servidor
bind = "0.0.0.0:8000"
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = "sync"
worker_connections = 1000
max_requests = 1000
max_requests_jitter = 50

# Configuración de timeouts
timeout = 120
keepalive = 2
graceful_timeout = 30

# Configuración de logging
accesslog = "-"
errorlog = "-"
loglevel = "info"

# Configuración de seguridad
limit_request_line = 4094
limit_request_fields = 100
limit_request_field_size = 8190

# Configuración de preload
preload_app = True

# Configuración de worker
worker_tmp_dir = "/dev/shm"
worker_abort_on_error = True
