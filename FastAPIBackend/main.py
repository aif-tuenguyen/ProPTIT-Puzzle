from logging import exception
from typing import Union

from sqlalchemy.exc import IdentifierError

from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Request
import uvicorn 
import json 
import random 

from utils.conversations import add_response_to_conversation, update_transaction_infor_by_message
from utils.transactions import get_transaction
from utils.intent_classification import intent_classify
from utils.rule_base import *
from utils.voice_biometrics import * 

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

rooms = {} # lưu hội thoại trong phòng: ngưòi-người
chatbot_conversations = {} # lưu hội thoại trong phòng: người-bot
informations = {} # lưu thông tin thu thập theo từng phòng

@app.get("/")
def read_root():
    return {"ProPTIT": "Puzzle"}

#@app.get("/items/{item_id}")
#def read_item(item_id: int, q: Union[str, None] = None):
#    return {"item_id": item_id, "q": q}

##### SITE HUMAN-HUMAN CHATBOX
@app.post("/api/chatbox/human")
async def response_human(request: Request):
    data = await request.json()
    add_response_to_conversation(rooms=rooms, data=data)
    print(rooms)
    room_id = data["room_id"]
    data["message"]["value"] = data["message"]["value"].lower()
    update_transaction_infor_by_message(room_id=room_id, informations=informations, data=data)
    response = intent_classify(data["message"]["value"])
    print("informations:", informations)   
    message_tmp = ""
    if response["intent"] == "want_to_rec":
        message_tmp = "Bạn nhận được một lời đề nghị chuyển tiền ?"
    if response["intent"] == "want_to_transfer":
        message_tmp = "Bạn muốn chuyển tiền phải không ?"
    message = {
        "intent": response["intent"],
        "message": message_tmp
    }
    print(message)
    return {"status": 200, "data": {"message": message}}


##### SITE HUMAN-BOT CHATBOX
@app.post("/api/chatbox/bot/update_form")
async def bot_update_form(request: Request):
    res_information = {}
    data = await request.json()
    try:
        room_id = str(data["room_id"])
        print("informations:", informations)
        print("rooms:", rooms)
        room = rooms[room_id]
        print("room:", room)
        message = room[-1]["message"]
        data["message"] = message
        update_transaction_infor_by_message(room_id=room_id, informations=informations, data=data)
        information = informations[str(room_id)] if str(room_id) in informations else {}
        print("informations:", information)
        response = intent_classify(data["message"]["value"])
        print("response:", response)
        if response["intent"] in ["want_to_transfer", "want_to_rec"]: 
            user_id_source = data["user_id_source"] if data["user_id_source"] != None else ""
            print("11")
            user_id_destination = data["user_id_destination"] if data["user_id_destination"] != None else ""
            payment_type = ""
            if information["phone_number"] not in [None, ""]:
                payment_type = "phone_number"
            if information["bank"] not in ["None", ""] or information["account_number"] not in [None, ""]:
                payment_type = "account_number"
            if information["card_number"] not in [None, ""]:
                payment_type = "card_number"
            print("12")
            account_number = information["bank_account_number"] if information["bank_account_number"] != None else ""
            card_number = information["card_number"] if information["card_number"] != None else ""
            phone_number = information["phone_number"] if information["phone_number"] != None else ""
            bank = information["bank"] if information["bank"] != None else ""
            print("13")
            query_transaction = get_transaction(user_id=user_id_source, payment_type=payment_type, receiver_id=user_id_destination, account_number=account_number, card_number=card_number, phone_number=phone_number, bank_name=bank, receiver_name="", payment_source=-1, payment_destination=-1)
            if query_transaction["msg"] == "Ready to transfer":
                res_information = query_transaction
                data_tmp = res_information["data"]
                res_information = {
                    "user_id": data_tmp["UserID"],
                    "payment_type": data_tmp["PaymentType"], 
                    "receiver_id": data_tmp["ReceiverID"],
                    "account_number": data_tmp["AccountNumber"],
                    "card_number": data_tmp["CardNumber"],
                    "phone_number": data_tmp["PhoneNumber"],
                    "bank_name": data_tmp["BankName"],
                    "receiver_name": data_tmp["ReceiverName"],
                    "payment_source": data_tmp["PaymentSource"],
                    "payment_destination": data_tmp["PaymentDestination"]
                }
                print("14")
            else:
                res_information = {
                    "user_id": data["user_id_source"],
                    "payment_type": payment_type,
                    "receiver_id": data["user_id_destination"],
                    "account_number": information["bank_account_number"],
                    "card_number": information["card_number"],
                    "phone_number": information["phone_number"],
                    "bank_name": information["bank"],
                    "receiver_name": "",
                    "payment_source": "",
                    "payment_destination": "" 
                }
                print("15")
        res_information["transfer_amount"] = information["transfer_amount"]
        print("16")
        res_information["suggestion"] = {
            "bank": ["Ngân hàng của bạn là gì ?", "Bạn hãy cung cấp tên ngân hàng cho tôi!"],
            "account_number": ["Bạn đọc cho tôi số tài khỏan ngân hàng đi", "Số tài khoản của bạn là gì ?"],
            "phone_number": ["Đọc cho tôi số điện thoại đi.", "Số điện thoại của bạn là gì ?"],
            "card_number": ["Hãy cho tôi biết 16 chữ số trên thẻ của bạn"],
            "transfer_amount": ["Số tiền bạn muốn chuyển là bao nhiêu ?"]
        }
        print("res_information:", res_information)
        return res_information
    except Exception as e:
        print("exception:", e)
        return {
            "user_id": data["user_id_source"],
            "payment_type": "",
            "receiver_id": data["user_id_destination"],
            "account_number": "",
            "card_number": "",
            "phone_number": "",
            "bank_name": "",
            "receiver_name": "",
            "payment_source": "",
            "payment_destination": "" 
        }


@app.post("/api/chatbox/bot/response")
async def bot_response(request: Request):
    data = await request.json()
    return data
    

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=31001, reload=False, workers=1)
