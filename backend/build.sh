echo "INSTALANDO DEPENDENCIAS RE"

pip install -r requirements.txt

python3 manage.py collectstatic --no-input
python3 manage.py migrate