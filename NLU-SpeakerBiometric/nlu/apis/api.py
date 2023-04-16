

from typing import Union
import random,requests
from transformers import AutoModel, AutoConfig, AutoTokenizer
from fastapi import Request 
from fastapi import FastAPI
import torch
import re,string 
USE_PARSE=True
try:
    from ../parsing_pos.predict import * 
except:
    USE_PARSE=False
TAG_IOB={
    'None':0,
    'B-name_sender':1,
    'B-name_rec':2,
    'B-stk':3,
    'B-ten_tk':4,
    'B-chủ_tài_khoản':5,
    'B-ten_thẻ':6,
    'B-ngân_hàng':7,
    'B-target':8,
    'B-money':9,
    'I-name_sender':10,
    'I-name_rec':11,
    'I-stk':12,
    'I-ten_tk':13,
    'I-chủ_tài_khoản':14,
    'I-ten_thẻ':15,
    'I-ngân_hàng':16,
    'I-target':17,
    'I-money':18,
}
IOB_TAG={value:key for key,value in TAG_IOB.items()}
app = FastAPI()

model=AutoModel.from_pretrained('vinai/phobert-base',num_hidden_layers=4)
tokenizer = AutoTokenizer.from_pretrained('vinai/phobert-base')
class Model(torch.nn.Module):
    def __init__(self,model, num_classes, num_entities):
        super().__init__()
        self.model_encoder = model 
        self.fc = torch.nn.Linear(768, num_classes) 
        self.entities = torch.nn.Linear(768,num_entities)
    def forward(self, inputs):
        out = self.model_encoder(**inputs).last_hidden_state 
        attmask = inputs.get("attention_mask",None)
        entities = self.entities(out)
        if attmask is not None:
            attmask = torch.reshape(attmask,[out.shape[0],out.shape[1],1])
            attmask = attmask.to(out.dtype  )
            out=out*attmask
            out = torch.sum(out,1) / torch.sum(attmask,1)
        else:
            out=torch.mean(out,1)
        out=self.fc(out)
        return out,entities
model_main=Model(
    model,
    4,
    19
)
model_main.load_state_dict(torch.load("../notebooks/checkpoint.ckpt")['state_dict'])
model_main.eval()
model_main.to("cuda")
def clear_punctuation(text):
    return text.translate(str.maketrans('', '', string.punctuation))
def matcher_moneyk(test_str):

    regex = r" ((\d+)k)"

    # test_str = "chuyển khoản cho cô 400k"
    text_process=""
    matches = re.finditer(regex, test_str, re.MULTILINE)
    x=[]
    for matchNum, match in enumerate(matches, start=1):
    
        print ("Match {matchNum} was found at {start}-{end}: {match}".format(matchNum = matchNum, start = match.start(), end = match.end(), match = match.group()))
        x.append([match.start(), match.end()])
    st=0
    for i in x:
        i[0] += st 
        i[1] += st
        st+=5
        test_str = test_str[:i[0]] + test_str[i[0]:i[1]-1] + " " + "nghìn" + test_str[i[1]:]
    return test_str
def matched_number_9(test_str):
    if test_str =='ck':
        test_str ='chuyển khoản'
    return test_str
    regex = r"(\d{8,})"

    # test_str = "0989399992212312"

    matches = re.finditer(regex, test_str, re.MULTILINE)

    for matchNum, match in enumerate(matches, start=1):
        
        print ("Match {matchNum} was found at {start}-{end}: {match}".format(matchNum = matchNum, start = match.start(), end = match.end(), match = match.group()))
        start = match.start()
        end  = match.end()
        if start == 0 and end == len(test_str):
            return "number"
    return test_str 
def preprocess(text):
    # step 1: ck -> chung khoan
    # step 2: Norm lower case, etc 
    # step 3: Norm NUMBER -> NUMBER 
    text = matcher_moneyk(clear_punctuation(text))
    map_key = []
    text = text.split() 
    map_key = [i for i in text ]
    text = [matched_number_9(i) for i in map_key]
    return text,map_key
def predict(text):
    text,map_key = preprocess(text) 
    print(text)
    words = [0]
    starts = [-1] 
    parser_pos=[-1]
    if USE_PARSE:
        parser_pos.extend(parser.predict(text))
    for indd,word in enumerate(text):
        input_ids = tokenizer.encode(word, add_special_tokens=False)
        words.extend(input_ids)
        starts.extend([indd,]* len(input_ids))
        if USE_PARSE is False:
            parser_pos.append(
                -1
            )
    attention_mask = [1,] * len(words)  + [1]
    words.append(2)
    starts.append(-1)

    inputs = {
        "input_ids":torch.tensor(words).reshape([1,-1]).long().to("cuda"),
        "attention_mask": torch.tensor(attention_mask).reshape([1,-1]).long().to("cuda"),
    }   
    if USE_PARSE:
        inputs['parser_pos']=torch.tensor(parser_pos).reshape([1,-1]).long().to("cuda")
    with torch.no_grad():
        out,out_entities = model_main(inputs)
    out=out.to("cpu")
    out_entities = out_entities.to("cpu")
    intent  = torch.argmax(out,-1)
    print(intent)
    out_entities = torch.argmax(out_entities,-1)
    print(out_entities)
    intent,entities= intent.reshape(-1,).item(), out_entities.numpy()[0].tolist()
    intent={0:'O',1:'sender',2:'recv',3:'information'}[intent]
    if intent == 'O':
        intent = "None" 
    elif intent=='information':
        intent='information'
    elif intent == 'sender':
        intent="want_to_transfer"
    else:
        intent = 'want_to_rec'

    object_key={"intent":intent}
    idx = 0
    while idx < len(entities):
        if starts[idx]==-1 or entities[idx] == 0:
            idx += 1
            continue 
        tag = IOB_TAG[entities[idx]].replace("B-","").replace("I-","")
        if tag == 'None':continue
        st=[]
        while idx < len(entities):
            if IOB_TAG[entities[idx]].replace("B-","").replace("I-","") == tag:
                if starts[idx]!=-1:
                    st.append(starts[idx])
                idx += 1
            else:
                break
        if tag not in object_key:object_key[tag] =[]
        object_key[tag].append(" ".join(map_key[min(st):max(st)+1]))
        # idx += 1
    return object_key
     
import glob,json
@app.get("/")
async def read_root(request:Request):
    data = await request.json()
    print(data)
    text=data['text']
    intent=predict(text)
    intent['text'] = text
    print(intent)
    t=len(glob.glob("/home/os_callbot/hoaf13/tue_nv/nlu/datasets/preds/*"))
    t=t+1
    with open(f'/home/os_callbot/hoaf13/tue_nv/nlu/datasets/preds/{t}.txt','w+') as f:
        json.dump(intent,f)
    return intent


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}
@app.post("/api/chatbox/humman")
async def response_human(request):
    data = await request.json()
    print(data)
    return  {"status": 200, "data": {"message": "test"}}
    add_response_to_conversation(rooms=rooms, data=data)
    print(rooms)
    message = random.choice(["","","","Bạn muốn chuyển tiền có phải không ?"])	
    return {"status": 200, "data": {"message": message}}