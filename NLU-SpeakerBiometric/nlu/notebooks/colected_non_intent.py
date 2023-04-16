import os,sys,time,json 
import pandas as pd 
import string
PATH_TXT =sys.argv[1]
PATH_OUTPUT = sys.argv[2]
data=open(PATH_TXT).read().splitlines()
data=[i.strip().lower() for i in data]
data=[i.translate(str.maketrans('', '', string.punctuation)) for i in data]
data= [ i for i in data if len(i)]
with open(PATH_OUTPUT,'w+') as f:
    f.write("\n".join(data))