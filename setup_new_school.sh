#!/usr/bin/env bash
# ==============================================================================
# School Management Portal - New School Quickstart & Setup Script
# ==============================================================================
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$DIR/schoolbackend"
FRONTEND_DIR="$DIR/schoolfrontend"

echo ""
echo "=================================================================="
echo "   🏫 School Management Portal — Template Setup Wizard"
echo "=================================================================="
echo "This script will configure a brand-new school instance."
echo ""

# 1. School Information Prompts
read -p "Enter School Name (e.g. St. Jude Academy): " SCHOOL_NAME
if [ -z "$SCHOOL_NAME" ]; then
  SCHOOL_NAME="My School"
fi

read -p "Enter School Acronym / Short Name (e.g. SJA): " SCHOOL_SHORT
if [ -z "$SCHOOL_SHORT" ]; then
  SCHOOL_SHORT=$(echo "$SCHOOL_NAME" | awk '{for(i=1;i<=NF;i++)printf "%s", toupper(substr($i,1,1))}')
fi

read -p "Enter Motto / Tagline [Excellence in Education]: " SCHOOL_TAGLINE
if [ -z "$SCHOOL_TAGLINE" ]; then
  SCHOOL_TAGLINE="Excellence in Education"
fi

read -p "Enter School Contact Phone [+234 ...]: " SCHOOL_PHONE
read -p "Enter School Contact Email [admin@school.com]: " SCHOOL_EMAIL
if [ -z "$SCHOOL_EMAIL" ]; then
  SCHOOL_EMAIL="admin@school.com"
fi

read -p "Enter School Address: " SCHOOL_ADDRESS

echo ""
echo "------------------------------------------------------------------"
echo "   👤 Administrator Account Setup"
echo "------------------------------------------------------------------"
read -p "Enter Administrator Username [admin]: " ADMIN_USER
if [ -z "$ADMIN_USER" ]; then
  ADMIN_USER="admin"
fi

read -p "Enter Administrator Email [$SCHOOL_EMAIL]: " ADMIN_EMAIL
if [ -z "$ADMIN_EMAIL" ]; then
  ADMIN_EMAIL="$SCHOOL_EMAIL"
fi

read -s -p "Enter Administrator Password [leave blank for 'admin12345']: " ADMIN_PASS
echo ""
if [ -z "$ADMIN_PASS" ]; then
  ADMIN_PASS="admin12345"
fi

# 2. Generate random Django SECRET_KEY
RANDOM_SECRET=$(python3 -c 'import secrets; print(secrets.token_urlsafe(50))' 2>/dev/null || openssl rand -base64 32)

# 3. Create or Update backend .env
echo ""
echo "⚙️  Configuring backend environment..."
if [ ! -f "$BACKEND_DIR/.env" ]; then
  cat > "$BACKEND_DIR/.env" <<EOF
SECRET_KEY=$RANDOM_SECRET
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CSRF_TRUSTED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000
SCHOOL_NAME=$SCHOOL_NAME
EOF
  echo "✓ Created $BACKEND_DIR/.env"
else
  echo "ℹ️  $BACKEND_DIR/.env already exists, keeping existing environment variables."
fi

# 4. Create or Update frontend .env
echo "⚙️  Configuring frontend environment..."
cat > "$FRONTEND_DIR/.env" <<EOF
VITE_API_URL=http://127.0.0.1:8000
VITE_SCHOOL_NAME=$SCHOOL_NAME
EOF
echo "✓ Created $FRONTEND_DIR/.env"

# 5. Run Migrations & Setup Management Command
echo ""
echo "📦 Running database migrations and initializing school settings..."
PYTHON_BIN="python3"
if [ -f "$BACKEND_DIR/venv/bin/python" ]; then
  PYTHON_BIN="$BACKEND_DIR/venv/bin/python"
fi

cd "$BACKEND_DIR"
$PYTHON_BIN manage.py migrate

$PYTHON_BIN manage.py setup_school \
  --name "$SCHOOL_NAME" \
  --short-name "$SCHOOL_SHORT" \
  --tagline "$SCHOOL_TAGLINE" \
  --address "$SCHOOL_ADDRESS" \
  --phone "$SCHOOL_PHONE" \
  --email "$SCHOOL_EMAIL" \
  --admin-username "$ADMIN_USER" \
  --admin-email "$ADMIN_EMAIL" \
  --admin-password "$ADMIN_PASS" \
  --non-interactive

echo ""
echo "=================================================================="
echo "   🎉 School Setup Completed Successfully!"
echo "=================================================================="
echo "School Name:        $SCHOOL_NAME ($SCHOOL_SHORT)"
echo "Admin Username:     $ADMIN_USER"
echo "Admin Password:     $ADMIN_PASS"
echo ""
echo "To run locally:"
echo "  1. Backend:  cd schoolbackend && source venv/bin/activate && python manage.py runserver"
echo "  2. Frontend: cd schoolfrontend && npm run dev"
echo ""
echo "To customize in browser:"
echo "  Log in at http://localhost:5173/login as '$ADMIN_USER' and open 'School Settings'."
echo "=================================================================="
