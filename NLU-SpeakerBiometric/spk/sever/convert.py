import torch 
a=torch.load("epoch=11-VEER=6.029-mindcf=0.407.ckpt")
dict_model = {}
for i in a['state_dict'].keys():
    if 'model.' in i:
        dict_model[i.replace('model.','')] = a['state_dict'][i] 
torch.save(dict_model,"model.pt")