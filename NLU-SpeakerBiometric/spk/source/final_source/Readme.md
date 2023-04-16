# Training
## Step 1: preprocess

We resample all audios to 16k & split to chunks 5s.

1. Change path data in line 1 - preprocess.py
2. python3 preprocess.py

New datasets will save to 'your_workspace/split_ds/...'

## Step 2: augmentation

don't change folder 'your_workspace/split_ds/...' in step 1.

1. python3 augmentation.py

All datasets we use to training for both tasks un/constract is split_ds.

We also used the enroll datasets without chunk for inference. 

extract imsv_public to folder split_ds 

resample all audio imsv_public & enroll datasets to folder split_ds 

2. python3 resample_test.py

## Step 3: Training

Time training is too slowly. 

1/Download musan noises and rirs noises to folder augment_root.

python3 dataprep.py --augment --save_path=augment_root

2/Training 

python3 train.py --config=RawNet3_AAM.yaml --test_interval=4 \
  --train_list=train.txt --test_list=test.txt --seed=2022 \
  --nClasses=300 --initial_model="we training many step due to colab session" \ 
  --musan_path=augment_root/musan_split --rir_path=augment_root/RIRS_NOISES/simulated_rirs --augment=true  \
  --nPerSpeaker=4 --nLanguage=1 --margin=0.25 --scale=30 \
  --nDataLoaderThread=4 \
  --max_frames=200 \
  --eval_frames=400 \
  --max_seg_per_spk=4028 \
  --trainfunc=aamsoftmax \
  --encoder_type=ECA \
  --batch_size=64 \
  --nOut=256 \
  --save_path="/content/drive/MyDrive/dataset/imsv/rawnet_pretrained" \
  --lr=0.0001

# Step 4: testing

checkpoint will save to folder save_path 

My best checkpoint: https://drive.google.com/file/d/1-0SXqP-7sa_R6YUgMEgwdKFRfNSeIynx/view?usp=sharing 

You can download this checkpoint to reproduce private_test

Change path in file infer_emb.py at line 1-4.
python3 infer_emb.py

We also use notebook in colab to inference.



