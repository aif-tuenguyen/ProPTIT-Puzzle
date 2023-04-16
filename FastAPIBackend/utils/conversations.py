import re 

def add_response_to_conversation(rooms, data):
    room_id = str(data["room_id"])
    flag_exited = False 
    for room_idx in rooms:
        if str(room_idx) == str(room_id):
            flag_exited = True
            rooms[room_id].append(data)
    if flag_exited == False:
        rooms[room_id] = [data]
    return  

def update_transaction_infor_by_message(room_id, informations, data):
    def get_phone_number(message):
        res = None
        pattern_phone_number = r"(\+84|0[3|5|7|8|9])+([0-9]{8})\b"
        ans = re.findall(pattern_phone_number, message)
        if len(ans) > 0:
            res = ans[-1]
        return res 

    def get_card_number(message):
        res = None
        pattern_card_number = r"[0-9]{16}"
        ans = re.findall(pattern_card_number, message)
        if len(ans) > 0:
            res = ans[-1]
        return res

    def get_bank(message):
        message = message.lower()
        res = None
        bank_patterns = {
            "mb bank": ["mb bank", "mb", "mbbank"],
            "tp bank": ["tp bank", "tp", "tpbank"],
            "vp bank": ["vp bank", "vp", "vpbank"]
        }
        for bank, patterns in bank_patterns.items():
            for pattern in patterns: 
                if re.search(rf"\b{pattern}\b", message):
                    res = bank
        return res

    def get_bank_account_number(message, bank):
        res = None
        if bank == "mb bank":
            ans = re.findall(r"[0-9]{10,13}", message)
            if len(ans) != 0:
                res = ans[-1]
        if bank == "tp bank":
            ans = re.findall(r"[0-9]{11}", message)
            if len(ans) != 0:
                res = ans[-1]
        if bank == "vp bank":
            ans = re.findall(r"[0-9]{8,9}", message)
            if len(ans) != 0:
                res = ans[-1]
        return res

    def get_transfer_amount(message):
        res = None
        message = message.replace(".","")
        message = message.replace(",","")
        amounts = re.findall(r"[0-9]{5,7}", message) 
        if len(amounts) != 0:
            res = amounts[-1]
        
        money_pattern_k = r"\b[0-9]{2,4}\s*k\b"
        ans = re.findall(money_pattern_k, message)
        if len(ans) != 0:
            money_k = ans[-1]
            money_k = money_k.replace("k","")
            response = re.findall(r'\d+', money_k)[0]
            res = response+"000"
        return res 

    def get_transfer_content(message):
        return "NGUYEN VAN HOC CHUYEN TIEN"
    
    print("data:", data)
    message = data["message"]["value"]
    print("message:", message)
    phone_number = get_phone_number(message)
    card_number = get_card_number(message)
    bank = get_bank(message)
    bank_account_number = get_bank_account_number(message, bank)
    transfer_amount = get_transfer_amount(message)
    transfer_content = get_transfer_content(message)
    
    informations[room_id] = {
        "phone_number": phone_number,
        "card_number": card_number,
        "bank": bank,
        "bank_account_number": bank_account_number,
        "transfer_amount": transfer_amount,
        "transfer_content": transfer_content
    }
    






