import requests

# Tus credenciales de PayPal
CLIENT = 'Ac49PuTgBmuyf-VlmLq4Axf5BX3F5O3uO81kbsO_GTBrErCfrMeE9DwAD37LapgPeV6R2cn3ik7sjvkP'
SECRET = 'EFbC49mwdaABS-iIl59jxczdL1lUJJZKe2WzjvOJXLqPTZH9judvhZfjRVU_pkm9R5jGTgrQVRPl8nrm'
PAYPAL_API = 'https://api-m.sandbox.paypal.com'

# Los datos de tu orden
body = {
    'intent': 'CAPTURE',
    'purchase_units': [{
        'amount': {
            'currency_code': 'USD',
            'value': '100'
        }
    }],
    'application_context': {
        'brand_name': 'MotorsSolution',
        'landing_page': 'NO_PREFERENCE',
        'user_action': 'PAY_NOW',
        'return_url': 'http://localhost:3000/execute-payment',
        'cancel_url': 'http://localhost:3000/cancel-payment'
    }
}

# Hacer la solicitud POST a la API de PayPal
response = requests.post(f'{PAYPAL_API}/v2/checkout/orders', auth=(CLIENT, SECRET), json=body)

# Extraer el enlace de aprobación de la respuesta
data = response.json()
paypal_url = next(link['href'] for link in data['links'] if link['rel'] == 'approve')

print(paypal_url)
