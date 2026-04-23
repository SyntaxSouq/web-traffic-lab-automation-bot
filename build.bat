@echo off
echo Starting build process...

echo Installing backend dependencies...
call npm install

echo Installing frontend dependencies...
cd frontend
call npm install

echo Building frontend...
call npm run build

cd ..

echo Build complete!
echo Ready to start server!
