@echo off
echo Setting up virtual environment for Nexa-MVP project...

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    echo Please install Python 3.9+ and try again
    pause
    exit /b 1
)

REM Create virtual environment
echo Creating virtual environment...
python -m venv venv

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install backend dependencies
echo Installing backend dependencies...
cd backend
pip install -r requirements.txt
cd ..

REM Install frontend dependencies
echo Installing frontend dependencies...
cd frontend
npm install
cd ..

echo.
echo Virtual environment setup complete!
echo.
echo To activate the virtual environment in the future:
echo   venv\Scripts\activate.bat
echo.
echo To run the backend:
echo   cd backend && python app.py
echo.
echo To run the frontend:
echo   cd frontend && npm start
echo.
pause
