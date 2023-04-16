import requests

def get_transaction(user_id="", payment_type="", receiver_id="", account_number="", card_number="", phone_number="", bank_name="", receiver_name="", payment_source=-1, payment_destination=-1):
    URL_ENDPOINT = "http://124.158.5.212:8008/checkInfo"
    data = {
        "user_id": user_id,
        "payment_type": payment_type,
        "receiver_id": receiver_id,
        "account_number": account_number,
        "card_number": card_number,
        "phone_number": phone_number,
        "bank_name": bank_name,
        "receiver_name": receiver_name,
        "payment_source": payment_source,
        "payment_destination": payment_destination 
    }
    print("transaction - data:", data)
    response = requests.post(URL_ENDPOINT, json=data)
    print("transaction - response:", response.text)
    res = eval(response.text)
    return res
    
