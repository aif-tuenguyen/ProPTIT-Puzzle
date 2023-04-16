import os,json,sys 
import pandas as pd 
import numpy as np
# import matplotlib.pyplot as plt
# from transformers import AutoModel, AutoTokenizer

TAGS={'name_sender':1, 'name_rec':2, 'stk':3, 'ten_tk':4, 'chủ_tài_khoản':5, 'ten_thẻ':6, 'ngân_hàng':7, 'target':8, 'money':9}
TAG_IOB={
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
# co 2 tập dữ liệu 

def load_dataset(path_dataset_training,path_dataset_test):
    with open(path_dataset_training,'r') as f:
        dataset_training=json.load(f)   
    with open(path_dataset_test,'r') as f:
        dataset_test=json.load(f)  
    return process_dataset(dataset_training),process_dataset(dataset_test)
def process_dataset(instance_dataset):
    ds=[]
    all_tag=set()
    for intent_name in instance_dataset:
        intent = instance_dataset[intent_name]
        print(intent_name)
        if intent_name not in ['sender','recv','information']:continue
        for sample in intent:
            words,tags=[],[]
            s1=""
            s2=""
            for word in sample:
                # print(w)
                if len(word['value'].strip())  == 0:continue
                value= word['value']
                type_text= word['type']
                words.append(value)
                if type_text !='Text':
                    tags.append(word['slot'])
                    all_tag.add(word['slot'])
                else:
                    tags.append(type_text) 
                if tags[-1] == 's1':
                    s1=words[-1]
                if tags[-1] == 's2':
                    s2=words[-1]
            sentence  = " ".join(words)
            if 'gửi' in sentence and 'vay' in sentence:continue
            if 'gửi' in sentence and 'nợ' in sentence:continue
            if s1==s2 and len(s1) and len(s2):continue 
            ds.append({'words':words,'tags':tags,'intent':intent_name})
    ds=pd.DataFrame(ds)
    print(all_tag)
    return ds
def convert_to_ibo(datasets):
    def convet_sample(sample):
        words=sample.words 
        tags=sample.tags
        tags = [TAGS[i] for i in tags]

def display(df, total=10):
    sample = df.sample(10)
    for index,row in sample.iterrows():
        text = ["-".join([i,j]) for i,j in zip(row['words'],row['tags'])]
        print(text)
        print(row['intent'])
        print('-'*20)
if __name__=='__main__':
    PATH_DATASET_TRAINING=sys.argv[1]
    PATH_DATASET_TEST=sys.argv[2]
    dataset_training,dataset_testing = load_dataset(PATH_DATASET_TRAINING,PATH_DATASET_TEST)
    display(dataset_training,total=20)
    print("Testing dataset")
    display(dataset_testing, total=20)
