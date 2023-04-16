import numpy as np 
import random 
import os,sys,json,glob
import soundfile
import numpy as np 
import soundfile
import random
import numpy as np
import torch
import numpy
import torch
import numpy
import random
import pdb
import os
import threading
import time
import math
import glob
import soundfile
import librosa as lb
from scipy import signal
from scipy.io import wavfile
from torch.utils.data import Dataset, DataLoader
import torch.distributed as dist
def loadWAV(filename, max_frames, evalmode=True, num_eval=10):
    # Maximum audio length
    max_audio = int(32_240)
    # Read wav file and convert to torch tensor
    print("loading wave file")
    # audio, sample_rate = soundfile.read(filename)
    audio,sample_rate = lb.load(filename,sr=16_000, mono=True)
    print("loadfile done ",audio.shape)
    assert sample_rate==16000
    audiosize = audio.shape[0]

    if audiosize <= max_audio:
        shortage    = max_audio - audiosize + 1 
        audio       = np.pad(audio, (0, shortage), 'wrap')
        audiosize   = audio.shape[0]
    
    if evalmode:
        startframe = np.linspace(0,audiosize-max_audio,num=num_eval)
    else:
        startframe = np.array([np.int64(random.random()*(audiosize-max_audio))])
    print("l 44")
    feats = []
    if evalmode and max_frames == 0:
        feats.append(audio)
    else:
        for asf in startframe:
            feats.append(audio[int(asf):int(asf)+max_audio])
    feat = np.stack(feats,axis=0).astype(np.float)
    print("load feat done",feat.shape)
    return feat