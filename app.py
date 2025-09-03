from flask import Flask, request, jsonify, session, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

# Configurar Flask con el directorio estático correcto
app = Flask(__name__, static_folder='frontend/build', static_url_path='')
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-here')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///nexa_mvp.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret-string')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

# Configuración de CORS más específica
CORS(app, 
     supports_credentials=True,
     origins=["*"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     allow_headers=["Content-Type", "Authorization", "X-Requested-With"])

db = SQLAlchemy(app)
jwt = JWTManager(app)

# Modelos de base de datos
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # cliente, admin, logistica, ejecutivo
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relaciones
    client_profile = db.relationship('ClientProfile', backref='user', uselist=False)
    employee_profile = db.relationship('EmployeeProfile', backref='user', uselist=False)

class ClientProfile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    full_name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20))
    address = db.Column(db.Text)
    dni = db.Column(db.String(20))
    
    # Relaciones
    projects = db.relationship('Project', backref='client', lazy=True)
    payments = db.relationship('Payment', backref='client', lazy=True)
    inquiries = db.relationship('Inquiry', backref='client', lazy=True)

class EmployeeProfile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    full_name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20))
    area = db.Column(db.String(50))  # administracion, logistica, obra
    position = db.Column(db.String(50))
    hire_date = db.Column(db.Date)
    salary = db.Column(db.Float)
    is_active = db.Column(db.Boolean, default=True)
    
    # Relaciones
    attendances = db.relationship('Attendance', backref='employee', lazy=True)
    leaves = db.relationship('Leave', backref='employee', lazy=True)
    paychecks = db.relationship('Paycheck', backref='employee', lazy=True)

class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey('client_profile.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    construction_type = db.Column(db.String(20))  # wood_frame, steel_frame
    square_meters = db.Column(db.Float)
    start_date = db.Column(db.Date)
    estimated_end_date = db.Column(db.Date)
    actual_end_date = db.Column(db.Date)
    status = db.Column(db.String(20), default='planning')  # planning, in_progress, completed
    budget = db.Column(db.Float)
    actual_cost = db.Column(db.Float)
    
    # Relaciones
    stages = db.relationship('ProjectStage', backref='project', lazy=True)
    materials = db.relationship('ProjectMaterial', backref='project', lazy=True)
    employees = db.relationship('ProjectEmployee', backref='project', lazy=True)

class ProjectStage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    status = db.Column(db.String(20), default='pending')  # pending, in_progress, completed
    progress = db.Column(db.Integer, default=0)  # 0-100%

class Material(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    unit = db.Column(db.String(20))  # kg, m2, units
    current_stock = db.Column(db.Float, default=0)
    min_stock = db.Column(db.Float, default=0)
    unit_price = db.Column(db.Float)
    supplier_id = db.Column(db.Integer, db.ForeignKey('supplier.id'))
    
    # Relaciones
    project_materials = db.relationship('ProjectMaterial', backref='material', lazy=True)

class ProjectMaterial(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)
    material_id = db.Column(db.Integer, db.ForeignKey('material.id'), nullable=False)
    quantity_required = db.Column(db.Float, nullable=False)
    quantity_used = db.Column(db.Float, default=0)
    unit_price = db.Column(db.Float)

class Supplier(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    contact_person = db.Column(db.String(100))
    phone = db.Column(db.String(20))
    email = db.Column(db.String(120))
    address = db.Column(db.Text)
    
    # Relaciones
    materials = db.relationship('Material', backref='supplier', lazy=True)
    contracts = db.relationship('SupplierContract', backref='supplier', lazy=True)
    orders = db.relationship('PurchaseOrder', backref='supplier', lazy=True)

class SupplierContract(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    supplier_id = db.Column(db.Integer, db.ForeignKey('supplier.id'), nullable=False)
    contract_number = db.Column(db.String(50), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date)
    terms = db.Column(db.Text)
    status = db.Column(db.String(20), default='active')  # active, expired, terminated

class PurchaseOrder(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    supplier_id = db.Column(db.Integer, db.ForeignKey('supplier.id'), nullable=False)
    order_number = db.Column(db.String(50), nullable=False)
    order_date = db.Column(db.Date, nullable=False)
    delivery_date = db.Column(db.Date)
    total_amount = db.Column(db.Float)
    status = db.Column(db.String(20), default='pending')  # pending, confirmed, delivered, paid

class Payment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey('client_profile.id'), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    payment_date = db.Column(db.Date, nullable=False)
    payment_method = db.Column(db.String(50))
    reference = db.Column(db.String(100))
    status = db.Column(db.String(20), default='pending')  # pending, completed, failed

class Inquiry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey('client_profile.id'), nullable=False)
    subject = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default='open')  # open, in_progress, resolved
    response = db.Column(db.Text)

class Attendance(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey('employee_profile.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    check_in = db.Column(db.DateTime)
    check_out = db.Column(db.DateTime)
    hours_worked = db.Column(db.Float)

class Leave(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey('employee_profile.id'), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    reason = db.Column(db.String(100))
    leave_type = db.Column(db.String(50))  # vacation, sick, personal
    status = db.Column(db.String(20), default='pending')  # pending, approved, rejected

class Paycheck(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey('employee_profile.id'), nullable=False)
    month = db.Column(db.Integer, nullable=False)
    year = db.Column(db.Integer, nullable=False)
    base_salary = db.Column(db.Float, nullable=False)
    deductions = db.Column(db.Float, default=0)
    bonuses = db.Column(db.Float, default=0)
    net_salary = db.Column(db.Float, nullable=False)
    payment_date = db.Column(db.Date)

class ProjectEmployee(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)
    employee_id = db.Column(db.Integer, db.ForeignKey('employee_profile.id'), nullable=False)
    role = db.Column(db.String(50))
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)

class Calendar(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    start_datetime = db.Column(db.DateTime, nullable=False)
    end_datetime = db.Column(db.DateTime, nullable=False)
    event_type = db.Column(db.String(50))  # meeting, reminder, event

# Rutas básicas
@app.route('/')
def index():
    try:
        return app.send_static_file('index.html')
    except FileNotFoundError:
        return jsonify({
            'error': 'Frontend not built',
            'message': 'Please build the frontend first with: cd frontend && npm run build',
            'status': 404
        }), 404

@app.route('/health')
def health():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'service': 'nexa-mvp'
    })

# Rutas de autenticación
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already exists'}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400
    
    user = User(
        username=data['username'],
        email=data['email'],
        password_hash=generate_password_hash(data['password']),
        role=data['role']
    )
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    
    if user and check_password_hash(user.password_hash, data['password']):
        access_token = create_access_token(identity=user.id)
        return jsonify({
            'access_token': access_token,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role
            }
        }), 200
    
    return jsonify({'error': 'Invalid credentials'}), 401

# Rutas protegidas
@app.route('/api/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if user.role == 'cliente':
        profile = ClientProfile.query.filter_by(user_id=user_id).first()
        return jsonify({
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role
            },
            'profile': {
                'full_name': profile.full_name if profile else None,
                'phone': profile.phone if profile else None,
                'address': profile.address if profile else None
            }
        })
    else:
        profile = EmployeeProfile.query.filter_by(user_id=user_id).first()
        return jsonify({
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role
            },
            'profile': {
                'full_name': profile.full_name if profile else None,
                'phone': profile.phone if profile else None,
                'area': profile.area if profile else None,
                'position': profile.position if profile else None
            }
        })

# Rutas para clientes
@app.route('/api/client/projects', methods=['GET'])
@jwt_required()
def get_client_projects():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if user.role != 'cliente':
        return jsonify({'error': 'Unauthorized'}), 403
    
    client_profile = ClientProfile.query.filter_by(user_id=user_id).first()
    if not client_profile:
        return jsonify({'error': 'Client profile not found'}), 404
    
    projects = Project.query.filter_by(client_id=client_profile.id).all()
    return jsonify([{
        'id': p.id,
        'name': p.name,
        'description': p.description,
        'status': p.status,
        'start_date': p.start_date.isoformat() if p.start_date else None,
        'estimated_end_date': p.estimated_end_date.isoformat() if p.estimated_end_date else None,
        'progress': sum([stage.progress for stage in p.stages]) / len(p.stages) if p.stages else 0
    } for p in projects])

@app.route('/api/client/payments', methods=['GET'])
@jwt_required()
def get_client_payments():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if user.role != 'cliente':
        return jsonify({'error': 'Unauthorized'}), 403
    
    client_profile = ClientProfile.query.filter_by(user_id=user_id).first()
    if not client_profile:
        return jsonify({'error': 'Client profile not found'}), 404
    
    payments = Payment.query.filter_by(client_id=client_profile.id).all()
    return jsonify([{
        'id': p.id,
        'amount': p.amount,
        'payment_date': p.payment_date.isoformat() if p.payment_date else None,
        'status': p.status,
        'project_name': p.project.name if p.project else None
    } for p in payments])

# Rutas para administración
@app.route('/api/admin/stock', methods=['GET'])
@jwt_required()
def get_stock():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if user.role not in ['admin', 'ejecutivo']:
        return jsonify({'error': 'Unauthorized'}), 403
    
    materials = Material.query.all()
    return jsonify([{
        'id': m.id,
        'name': m.name,
        'current_stock': m.current_stock,
        'min_stock': m.min_stock,
        'unit_price': m.unit_price,
        'supplier_name': m.supplier.name if m.supplier else None,
        'low_stock_alert': m.current_stock <= m.min_stock
    } for m in materials])

@app.route('/api/admin/employees', methods=['GET'])
@jwt_required()
def get_employees():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if user.role not in ['admin', 'ejecutivo']:
        return jsonify({'error': 'Unauthorized'}), 403
    
    employees = EmployeeProfile.query.all()
    return jsonify([{
        'id': e.id,
        'full_name': e.full_name,
        'area': e.area,
        'position': e.position,
        'hire_date': e.hire_date.isoformat() if e.hire_date else None,
        'is_active': e.is_active
    } for e in employees])

# Rutas para logística
@app.route('/api/logistics/route', methods=['GET'])
@jwt_required()
def get_work_route():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if user.role not in ['logistica', 'ejecutivo']:
        return jsonify({'error': 'Unauthorized'}), 403
    
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    query = Project.query.filter(Project.status == 'in_progress')
    
    if start_date and end_date:
        query = query.filter(Project.start_date >= start_date, Project.estimated_end_date <= end_date)
    
    projects = query.all()
    return jsonify([{
        'id': p.id,
        'name': p.name,
        'client_name': p.client.full_name if p.client else None,
        'start_date': p.start_date.isoformat() if p.start_date else None,
        'estimated_end_date': p.estimated_end_date.isoformat() if p.estimated_end_date else None,
        'status': p.status,
        'progress': sum([stage.progress for stage in p.stages]) / len(p.stages) if p.stages else 0
    } for p in projects])

# Rutas para ejecutivos
@app.route('/api/executive/metrics', methods=['GET'])
@jwt_required()
def get_executive_metrics():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if user.role != 'ejecutivo':
        return jsonify({'error': 'Unauthorized'}), 403
    
    # Métricas del negocio
    total_projects = Project.query.count()
    completed_projects = Project.query.filter_by(status='completed').count()
    active_projects = Project.query.filter_by(status='in_progress').count()
    
    total_employees = EmployeeProfile.query.filter_by(is_active=True).count()
    
    # Calcular ingresos totales
    total_income = db.session.query(db.func.sum(Payment.amount)).filter_by(status='completed').scalar() or 0
    
    # Calcular costos totales
    total_costs = db.session.query(db.func.sum(Project.actual_cost)).filter(Project.actual_cost.isnot(None)).scalar() or 0
    
    return jsonify({
        'total_projects': total_projects,
        'completed_projects': completed_projects,
        'active_projects': active_projects,
        'total_employees': total_employees,
        'total_income': total_income,
        'total_costs': total_costs,
        'profit': total_income - total_costs
    })

# Chatbot endpoint
@app.route('/api/chatbot', methods=['POST'])
@jwt_required()
def chatbot():
    data = request.get_json()
    message = data.get('message', '').lower()
    
    # Respuestas simples del chatbot
    responses = {
        'progreso': 'Puede ver el progreso de su obra en la sección "Mis Proyectos" del dashboard.',
        'pago': 'Los pagos se pueden realizar a través de transferencia bancaria o efectivo. Consulte su cronograma de pagos.',
        'materiales': 'Utilizamos materiales certificados de primera calidad. Todos los materiales cumplen con las normativas vigentes.',
        'garantia': 'Ofrecemos garantía de 10 años en la estructura y 2 años en terminaciones.',
        'tiempo': 'El tiempo de construcción varía según el tamaño del proyecto. Una casa de 100m2 tarda aproximadamente 4-6 meses.',
        'whatsapp': 'Para consultas urgentes, puede contactarnos por WhatsApp al +54 9 11 1234-5678'
    }
    
    # Buscar respuesta
    for key, response in responses.items():
        if key in message:
            return jsonify({
                'response': response,
                'redirect_whatsapp': 'whatsapp' in message
            })
    
    # Respuesta por defecto
    return jsonify({
        'response': 'No entiendo su consulta. ¿Podría reformularla? Para contacto directo, use WhatsApp.',
        'redirect_whatsapp': False
    })

# Calendario
@app.route('/api/calendar', methods=['GET'])
@jwt_required()
def get_calendar():
    user_id = get_jwt_identity()
    events = Calendar.query.filter_by(user_id=user_id).all()
    
    return jsonify([{
        'id': e.id,
        'title': e.title,
        'description': e.description,
        'start': e.start_datetime.isoformat(),
        'end': e.end_datetime.isoformat(),
        'type': e.event_type
    } for e in events])

@app.route('/api/calendar', methods=['POST'])
@jwt_required()
def create_calendar_event():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    event = Calendar(
        user_id=user_id,
        title=data['title'],
        description=data.get('description', ''),
        start_datetime=datetime.fromisoformat(data['start']),
        end_datetime=datetime.fromisoformat(data['end']),
        event_type=data.get('type', 'event')
    )
    
    db.session.add(event)
    db.session.commit()
    
    return jsonify({'message': 'Event created successfully', 'id': event.id}), 201

# Crear tablas
@app.route('/api/init-db', methods=['POST'])
def init_db():
    db.create_all()
    return jsonify({'message': 'Database initialized successfully'})

# Servir archivos estáticos del frontend
@app.route('/<path:filename>')
def serve_static(filename):
    try:
        return app.send_static_file(filename)
    except FileNotFoundError:
        # Si no se encuentra el archivo, redirigir al index.html para SPA routing
        try:
            return app.send_static_file('index.html')
        except FileNotFoundError:
            return jsonify({
                'error': 'Frontend not built',
                'message': 'Please build the frontend first',
                'status': 404
            }), 404

# Manejo de errores
@app.errorhandler(404)
def not_found(error):
    # Para rutas de API, devolver error JSON
    if request.path.startswith('/api/'):
        return jsonify({
            'error': 'Not Found',
            'message': 'The requested endpoint was not found on the server.',
            'status': 404,
            'available_endpoints': [
                '/',
                '/health',
                '/api/auth/login',
                '/api/auth/register',
                '/api/profile',
                '/api/client/projects',
                '/api/client/payments',
                '/api/admin/stock',
                '/api/admin/employees',
                '/api/logistics/route',
                '/api/executive/metrics',
                '/api/chatbot',
                '/api/calendar'
            ]
        }), 404
    
    # Para rutas del frontend, servir index.html (SPA routing)
    try:
        return app.send_static_file('index.html')
    except FileNotFoundError:
        return jsonify({
            'error': 'Frontend not built',
            'message': 'Please build the frontend first',
            'status': 404
        }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'error': 'Internal Server Error',
        'message': 'An internal server error occurred.',
        'status': 500
    }), 500

# Inicializar la base de datos cuando se importa el módulo
with app.app_context():
    try:
        db.create_all()
        print("Database tables created successfully")
    except Exception as e:
        print(f"Error creating database tables: {e}")

if __name__ == '__main__':
    app.run(debug=True)
