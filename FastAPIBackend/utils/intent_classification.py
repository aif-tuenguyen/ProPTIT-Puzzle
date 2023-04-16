import requests

ENDPOINT="http://124.158.5.212:30144"


def intent_classify(text):
    data = {
        "text": text
    }
    response = requests.get(url=ENDPOINT, json=data, verify=False)
    return eval(response.text)


if __name__ == "__main__":
    print(intent_classify("chuyển tiền đi em"))
