"""
simple model: one-layer transformer
"""

from transformers import AutoModel, AutoConfig, AutoTokenizer
import os,sys,json 
import numpy as np 
import pandas as pd 
import torch
import re 
from preprocess_data import load_dataset,TAG_IOB,TAGS
import re
import string 
from tqdm import tqdm 
"""
của bạn hết 300k
->popup cho người nhận
người nhận chat: giờ mình chưa có tiền 
-> tắt popup chat của người nhận
-> popup chat mở lên: kiểu gì cũng phải có button: không muốn chuyển tiền [x] 
"""
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
print(matcher_moneyk("cho minhf vay 300k nha 400k y"))
# exit(0)
PATH_DATASET_TRAINING=sys.argv[1]
PATH_DATASET_TEST=sys.argv[2]

dataset_training,dataset_testing = load_dataset(PATH_DATASET_TRAINING,PATH_DATASET_TEST)
fb_comments = open("/home/os_callbot/hoaf13/tue_nv/nlu/datasets/ver1/comment_fb_norm.txt").read().splitlines()
np.random.shuffle(fb_comments)
fb_comments=[i.split()[:100] for i in fb_comments[:2000]]
fb_tags = [["NONE",] * int(len(i)) for i in fb_comments]
fb_labels = ["O",] * len(fb_tags)
print(dataset_training.head(2))
model=AutoModel.from_pretrained('vinai/phobert-base',num_hidden_layers=4)
tokenizer = AutoTokenizer.from_pretrained('vinai/phobert-base')
print(tokenizer.encode("tôi đi học", add_special_tokens =False))
# exit(0)
print(tokenizer(['tôi đi học','tôi đến trường nha'], return_tensors ='pt',padding=True,max_length =512))
x=tokenizer(['tôi đi học','tôi đến trường nha'], return_tensors ='pt', padding=True,max_length =512,)
print(model(x['input_ids']).last_hidden_state.shape)
# print(model.config)
# print(sum([ i.numel() for i in model.parameters()]))
# print(model)

class Dataset:
    def __init__(self,datasets, tags, labels):
        self.datasets = datasets
        self.tags = tags
        self.labels = labels
    def __len__(self):return len(self.datasets)
    def norm(self, text):
        def norm_(text):
            if 'ck' in text:
                text.replace(' ck ','chuyển khoản')
            text =clear_punctuation(text) 
            text= matcher_moneyk(text)
            return text 
        text = [norm_(t) for t in text]
        return text
    def __getitem__(self,idx):
        word=self.datasets[idx]
        tags = self.tags[idx]
        label = self.labels[idx]
        label = {'O':0,'sender':1,'recv':2,'information':3}[label]
        # tags=[)]
        word= self.norm(word)
        return word, tags, label
dataset = Dataset(dataset_training.words.values.tolist()+fb_comments,dataset_training.tags.values.tolist()+fb_tags,dataset_training.intent.values.tolist() + fb_labels)
testset = Dataset(dataset_testing.words,dataset_testing.tags,dataset_testing.intent)
def process(sample, entities):
    input_ids = [0]
    attmask = [1]
    entitie_ids = [-1]
    start=[-1]
    for index,(word,tag) in enumerate(zip(sample, entities)):
        tokens  = tokenizer.encode(word,add_special_tokens =False)
        input_ids.extend(tokens)
        attmask.extend([1,] * int(len(tokens)))
        if tag=='Text':
            entitie_ids.extend([0,] * int(len(tokens)))
        elif tag=='NONE':
            entitie_ids.extend([-1,] * int(len(tokens)))
        else:
            st = TAG_IOB["B-" + tag]
            it = TAG_IOB["I-" + tag]
            entitie_ids.append(st)
            entitie_ids.extend([it,] * int(len(tokens) - 1))
        start.extend([index,]  * len(tokens))

    input_ids.append(2)
    attmask.append(0)
    start.append(-1)
    entitie_ids.append(-1)
    return input_ids,attmask,start,entitie_ids


def null_clected(batch):
    sample = [i[0] for i in batch]
    entities_x = [i[1] for i in batch]
    # sample,entities = process(sample,entities)
    # input_ids,attmask,start,entities=process(sample, entities)
    input_ids = []
    att_mask = []
    starts = []
    entities = []
    max_length=0
    for i in range(len(batch)):
        input_id,att,start,entiti = process(sample[i], entities_x[i])
        input_ids.append(input_id)
        att_mask.append(att)
        starts.append(start)
        entities.append(entiti)
        max_length=max(max_length, len(input_id))
    # print(max_length, entities, starts, input_ids)
    for i in range(len(batch)):
        pad = int(max_length - len(input_ids[i]))
        input_ids[i].extend([1,] * pad) 
        att_mask[i].extend([0,] * pad)
        starts[i].extend([-1,] * pad)
        entities[i].extend([-1,] * pad)
    label = [i[2] for i in batch]
    input_ids=torch.tensor(input_ids).long()
    att_mask=torch.tensor(att_mask).long()
    entities=torch.tensor(entities).long()
    label=torch.tensor(label).long()
    return input_ids,att_mask,entities,label
dl = torch.utils.data.DataLoader(dataset,batch_size=16, collate_fn=null_clected,shuffle=True) 
el = torch.utils.data.DataLoader(testset,batch_size=16,collate_fn=null_clected,shuffle=True)
sample=next(iter(dl ))
input_ids,att_mask,entities,label=sample
print(tokenizer.decode(input_ids[0]))
print(entities[0],att_mask[0],label[0])
# exit(0)
# input_ids = input_ids.to("cuda")
# att_mask = att_mask.to("cuda")
# entities = entities.to("cuda")
# label = label.to("cuda")
# exit(0) 
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
def train(model, optimizer, dl, epoch):
    model.train() 
    total_loss=0.2
    acc_intent = 0 
    acc_entities = 0
    v=0
    v2=0
    for sample in tqdm(dl):
        optimizer.zero_grad()
        input_ids,att_mask,entities,label=sample
        input_ids = input_ids.to("cuda")
        att_mask = att_mask.to("cuda")
        entities = entities.to("cuda")
        label = label.to("cuda")
        inputs = {
            "attention_mask":att_mask,
            "input_ids":input_ids
        }
        out,entities_pred = model_main(inputs)
        loss_fn = torch.nn.CrossEntropyLoss(ignore_index =-1)(out,label) + torch.nn.CrossEntropyLoss(ignore_index =-1)(entities_pred.reshape([-1,19]),entities.reshape([-1,]) )
        loss_fn.backward()
        torch.nn.utils.clip_grad_norm_(model.parameters(), 1.)
        total_loss+=loss_fn.detach().cpu().item()
        # print(torch.argmax(out), label)
        acc_intent += (torch.argmax(out,-1) == label).sum().to("cpu")
        v+=label.shape[0] 
        x=entities.reshape([-1,])
        z=entities_pred.reshape([-1,19])
        t= torch.argmax(z,-1) == x 
        t=t[x>=0]
        acc_entities += (t).sum().to("cpu")
        v2 += t.shape[0]
        optimizer.step()
    return total_loss, acc_intent / v, acc_entities / v2
def val(model, dl, epoch):
    model.eval() 
    total_loss=0.2
    acc_intent = 0 
    acc_entities = 0
    v=0
    v2=0
    for sample in tqdm(dl):
        # optimizer.zero_grad()
        input_ids,att_mask,entities,label=sample
        input_ids = input_ids.to("cuda")
        att_mask = att_mask.to("cuda")
        entities = entities.to("cuda")
        label = label.to("cuda")
        inputs = {
            "attention_mask":att_mask,
            "input_ids":input_ids
        }
        out,entities_pred = model_main(inputs)
        loss_fn = torch.nn.CrossEntropyLoss(ignore_index =-1)(out,label) + torch.nn.CrossEntropyLoss(ignore_index =-1)(entities_pred.reshape([-1,19]),entities.reshape([-1,]) )
        # loss_fn.backward()
        # torch.nn.utils.clip_grad_norm_(model.parameters(), 1.)
        total_loss+=loss_fn.detach().cpu().item()
        # print(torch.argmax(out), label)
        acc_intent += (torch.argmax(out,-1) == label).sum().to("cpu")
        v+=label.shape[0] 
        x=entities.reshape([-1,])
        z=entities_pred.reshape([-1,19])
        t= torch.argmax(z,-1) == x 
        t=t[x>=0]
        acc_entities += (t).sum().to("cpu")
        v2 += t.shape[0]
        # optimizer.step()
    return total_loss, acc_intent / v, acc_entities / v2
# if __name__=='__main__':
# def evaluate(model, iterator, label_map):
#     model.train() 
#     for sample in tqdm(dl):
#         optimizer.zero_grad()
#         input_ids,att_mask,entities,label=sample
#         input_ids = input_ids.to("cuda")
#         att_mask = att_mask.to("cuda")
#         entities = entities.to("cuda")
#         label = label.to("cuda")
#         inputs = {
#             "attention_mask":att_mask,
#             "input_ids":input_ids
#         }
#         out,entities_pred = model_main(inputs)
#         loss_fn = torch.nn.CrossEntropyLoss(ignore_index =-1)(out,label) +     0.5*torch.nn.CrossEntropyLoss(ignore_index =-1)(entities_pred.reshape([-1,19]),entities.reshape([-1,]) )
#         loss_fn.backward()
#         torch.nn.utils.clip_grad_norm_(model.parameters(), 1.)
        
#         optimizer.step()

model_main=Model(
    model,
    4,
    19
)
param_optimizer = list(model_main.named_parameters())
no_decay = ['bias', 'LayerNorm.weight']
optimizer_grouped_parameters = [
    {'params': [p for n, p in param_optimizer if not any(nd in n for nd in no_decay)],
     'weight_decay': 1e-5},
    {'params': [p for n, p in param_optimizer if any(nd in n for nd in no_decay)], 'weight_decay': 0.0}
]
optimizer = torch.optim.AdamW(
    optimizer_grouped_parameters,
    lr = 1e-4,
    weight_decay=1e-5
)
model_main=model_main.to("cuda")
for e in range(2):
    print(train(model_main,optimizer,dl,1))
    print(val(model_main,el,1))
torch.save({'state_dict':model_main.state_dict()},"checkpoint.ckpt")
# model_main.train()
# inputs = {
#     "attention_mask":att_mask,
#     "input_ids":input_ids
# }
# out,entities_pred = model_main(inputs)
# print(out.shape,entities_pred.shape)
# print(entities.shape,input_ids.shape,att_mask.shape)
# loss_fn = torch.nn.CrossEntropyLoss(ignore_index =-1)(out,label) +     torch.nn.CrossEntropyLoss(ignore_index =-1)(entities_pred.reshape([-1,19]),entities.reshape([-1,]) )