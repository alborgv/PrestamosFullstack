#!/bin/bash

echo "Iniciando build.sh..."

# Instalar dependencias
pip install -r requirements.txt

# Recolectar archivos estáticos
python manage.py collectstatic --noinput

echo "build.sh completado."
