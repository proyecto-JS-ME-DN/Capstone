import sys
import json

def process_login_data(login_data):
    # Procesa los datos de login aquí
    return login_data

def process_contacto_data(contacto_data):
    # Procesa los datos de contacto aquí
    return contacto_data

if __name__ == "__main__":
    data = json.load(sys.stdin)
    processed_login_data = process_login_data(data['login'])
    processed_contacto_data = process_contacto_data(data['contacto'])
    processed_data = {'login': processed_login_data, 'contacto': processed_contacto_data}
    print(json.dumps(processed_data))


