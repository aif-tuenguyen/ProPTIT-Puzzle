# [ProPTIT Puzzle] Track: Smart Fintech Assistant 

What Is This?
-------------
This is a source code of ProPTIT Puzzle team intended to provide working of Proptit Puzzle production.

The goal of these folders is to be simple, the aim are:

- CloneViettelMoney: Frontend of production 
- SocketViettelMoney: Socket connect between Frontend and other API, manage room-chat,user,...
- FastAPIBackend: Backend center connect between Bankcenter, NLU-BIOMetricCenter, Frontend
- TransferBankCenter: Backend center for service transfer.
- NLU-SpeakerBiometric: Backend center for service nlu & speaker-biometric.

How To Use This
---------------

Go to the each folder install lib and start sever for each service.

## Example START sever FastApiBackend 
0. Python3~=3.6.9 in your environment.s
1. Run `pip install -r requirements.txt` to install dependencies.
2. Run `python3 main.py`.
3. Navigate to http://localhost:31001 in your browser.

Folder Stucture
---------------
- `main.py`: Main process script builtin FastAPI framework.
- `utils`: including necessary modules builtin Python  

## Authors
- ProPTIT Puzzle's members
