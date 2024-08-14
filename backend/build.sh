#!/bin/bash

# Realiza tareas de construcción o preparación aquí
echo "Ejecutando el script de construcción..."

# Ejemplo: instalar dependencias, ejecutar comandos, etc.
pip install -r requirements.txt
python manage.py collectstatic --noinput
