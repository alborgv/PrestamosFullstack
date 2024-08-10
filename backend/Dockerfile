# Usa una imagen base que contenga Python
FROM python:3.12

# Establece el directorio de trabajo
WORKDIR /app

# Copia el archivo de requisitos y la aplicación
COPY requirements.txt /app/

# Instala las dependencias del sistema necesarias
RUN apt-get update && apt-get install -y \
    libmysqlclient-dev \
    && rm -rf /var/lib/apt/lists/*

# Instala las dependencias de Python
RUN pip install --no-cache-dir -r requirements.txt

# Copia el resto del código de la aplicación
COPY . /app/

# Ejecuta el comando para recolectar archivos estáticos
RUN python manage.py collectstatic --noinput

# Expone el puerto en el que se ejecutará la aplicación
EXPOSE 8000

# Comando para ejecutar la aplicación con Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "myproject.wsgi:application"]
