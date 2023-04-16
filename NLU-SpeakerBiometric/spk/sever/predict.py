from models.ResNetSE34V2 import MainModel
from utils import loadWAV
from typing import Union
import random,requests
from transformers import AutoModel, AutoConfig, AutoTokenizer
from fastapi import Request 
from fastapi import FastAPI,Form
import torch,os,sys,json
model = MainModel(
    nOut=512,
    encoder='SAP',
    log_input=True,
    n_mels=64
)
# n_mels=64

print(model.load_state_dict(torch.load("/home/os_callbot/hoaf13/tue_nv/spk/sever/2.ckpt")))
model=model.to("cuda")
model.eval()
# # ckpt = sys.a

# print(sum([i.numel() for i in model.parameters()]))

# model.to("cuda")
app = FastAPI()
db={}
import glob 
for i in glob.glob('/home/os_callbot/hoaf13/tue_nv/spk/sever/db/*'):
    spk_id = os.path.basename(i) 
    db[spk_id.replace(".pt","")] = torch.load(i)
print(db.keys())
@app.get("/register")
async def read_root(request:Request):
    data = await request.json()
    audio_path=data['audio_path']
    assert os.path.isfile(audio_path)
    spk_id =str(data['spk_id']) # int 
    speech = loadWAV(audio_path,None,True,10)
    speech = torch.from_numpy(speech).float()
    speech=torch.reshape(speech,[10,-1])
    with torch.no_grad():
        speech = speech.to("cuda")
        outs = model(speech)
    outs=outs.reshape([-1,512])
    db[spk_id] = outs.to("cpu")
    torch.save(outs.to("cpu"),f'/home/os_callbot/hoaf13/tue_nv/spk/sever/db/{spk_id}.pt')
    return {'status':'success'}


@app.get("/verify")
async def read_root(request:Request):

    data = await request.json()
    audio_path=data['audio_path']
    assert os.path.isfile(audio_path)

    spk_id =str(data['spk_id']) # int 
    speech = loadWAV(audio_path,None,True,10)
    speech = torch.from_numpy(speech).float()
    speech=torch.reshape(speech,[10,-1])
    with torch.no_grad():
        speech = speech.to("cuda")
        outs = model(speech)
        outs=torch.reshape(outs,[-1,512]).to('cpu')
    out2=db[spk_id]

    score = torch.nn.CosineSimilarity()(outs,out2) # 10,10 
    score = torch.mean(score).cpu().item()
    if score  > 0.2:
        ok=True
    else:
        ok=False
    # torch.save(f'/home/os_callbot/hoaf13/tue_nv/spk/sever/db/{spk_id}.pt',outs.to("cpu"))
    return {'status':'success','score':score,'ok':ok}
from fastapi import File, UploadFile

@app.post("/register_v2")
def upload(file: UploadFile = File(...), spk_id: str=Form(...)):
    try:
        contents = file.file.read()
        
        audio_path=f'/home/os_callbot/hoaf13/tue_nv/spk/sever/audios/{spk_id}/{file.filename}'
        os.makedirs(f'/home/os_callbot/hoaf13/tue_nv/spk/sever/audios/{spk_id}',exist_ok=True)
        spk_id=str(spk_id)
        with open(audio_path, 'wb') as f:
            print("here")
            f.write(contents)
            # spk_id =str(data['spk_id']) # int 
        speech = loadWAV(audio_path,None,True,10)
        speech = torch.from_numpy(speech).float()
        speech=torch.reshape(speech,[10,-1])
        with torch.no_grad():
            speech = speech.to("cuda")
            outs = model(speech)
        outs=outs.reshape([-1,512])
        db[spk_id] = outs.to("cpu")
        torch.save(outs.to("cpu"),f'/home/os_callbot/hoaf13/tue_nv/spk/sever/db/{spk_id}.pt')
        return {"status": "success"}
    except Exception as e:
        return {"status": f"There was an error uploading the file {e}"}
    finally:
        file.file.close()

    return {"message": f"Successfully uploaded {file.filename}"}


@app.post("/verify_v2")
def upload2(file: UploadFile = File(...), spk_id:str=Form(...)):
    try:
        contents = file.file.read()
        print(file.filename)
        audio_path=f'/home/os_callbot/hoaf13/tue_nv/spk/sever/verify/{spk_id}/{file.filename}'
        os.makedirs(f'/home/os_callbot/hoaf13/tue_nv/spk/sever/verify/{spk_id}',exist_ok=True)
        spk_id=str(spk_id)
        with open(audio_path, 'wb') as f:
            f.write(contents)
            # spk_id =str(data['spk_id']) # int 
        print(audio_path)
        # audio_path=f'/home/os_callbot/hoaf13/tue_nv/spk/sever/audios/{file.filename}'
        speech = loadWAV(audio_path,None,True,10)
        print(speech.shape)
        speech = torch.from_numpy(speech).float()
        speech=torch.reshape(speech,[10,-1])
        print("l121")
        with torch.no_grad():
            speech = speech.to("cuda")
            outs = model(speech)
        print("ok is here")
        outs=outs.reshape([-1,512])
        with torch.no_grad():
            speech = speech.to("cuda")
            outs = model(speech)
            outs=torch.reshape(outs,[-1,512]).to('cpu')
        out2=db[spk_id]
        print("here")
        score = torch.nn.CosineSimilarity()(outs,out2) # 10,10 
        score = torch.mean(score).cpu().item()
        if score  > 0.5:
            ok=True
        else:
            ok=False
        return {'status':'success','score':score,'is_same':ok}

        # db[spk_id] = outs.to("cpu")
        # torch.save(outs.to("cpu"),f'/home/os_callbot/hoaf13/tue_nv/spk/sever/db/{spk_id}.pt')


    except Exception as e:
        return {"status": f"There was an error uploading the file {e}"}
    finally:
        file.file.close()

    return {"message": f"Successfully uploaded {file.filename}"}