[ProPTIT Puzzle] NLU-SPEAKER BIO METRICS - Track: Smart Fintech Assistant 
==============================

What Is This?
-------------
This is a simple Python/FastAPI application intended to provide a working example of ProPTIT Puzzle's external API.

- Nlu endpoint: Provide endpoint of natural language processing. 
- Spk endpoint: Provide endpoint of biometric speaker verification.

# NLU Endpoint

## Folder structure:

- datasets
    - ver*
        - training_ver_*.json :  training corpus
        - testing_ver_*.json  :  testing corpus
        - comment_forum_*.json : comment crawl corpus
        - *.yaml                : structure of generate datasets.
- notebooks
    - simple_model.py :  provide training simple model without external features.
    - model.py: provide training model with external features: Name person_vn, organizer_vn, pos.
- apis:
    - parsing_pos: module parsing
    - api.py: file runserver api for nlu endpointer
## Method
- Provide simple method NLU model:
    - training model with two layers transformer bert from phobert-base.
    - training with external feature: POS
    - POS provide by pretrained model from https://github.com/datquocnguyen/jPTDP
- NLU: 
    - extract intent from text: want_to_transfer - want_to_rec - other
    - extract entities from text: name_person, name_orgainzer (ie name bank), card_number, phone_number.
- Dataset:
    - Use simple generate dataset by specifices structure.
    - Crawl comment from facebook, voz, tinhte.vn,... for label Other.
    - Using external dataset from vlsp - treebanks for external datasets

# Speaker Endpoint

## Folder structure:

- source:
    - source code provide training - testing model.
- sever:
    - source code provde simple api for register & verify speaker

## Method


- Using simple and effectiveless architecture:
    - Resnet + squeeze & rawnet/pretrained speech model.
    - InterAAM loss with softmargin=0.05  & hard-margin = 0.2
- Dataset:
    - VLSP2021 + VLSP2022 datasets speaker verification.
- Speaker ID:
    - Register speaker from short utt: i.e 1-3 (s) speech.
    - Verify speaker from short utt by average cosine similarity frame wise.

# Runserver 

- speaker: uvicorn spk/apis/predict:app --host=0.0.0.0 --port=30145 
- nlu: uvicorn nlu/apis/predict:app --host=0.0.0.0 --port=30145 



    
