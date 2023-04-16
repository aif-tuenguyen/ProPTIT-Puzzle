package request

import (
	"encoding/json"
	"net/http"
	"net/url"
	"strings"
	"time"
)

type HttpClient interface {
	Do(req *http.Request) (*http.Response, error)
}

type ClientMock struct {
	Callback func(req *http.Request) (*http.Response, error)
}

func (c *ClientMock) Do(req *http.Request) (*http.Response, error) {
	res, err := c.Callback(req)
	if err != nil {
		return nil, err
	}
	return res, nil
}

var Client HttpClient = &ClientMock{}

func Setup() {
	Client = &http.Client{
		Timeout: 5 * time.Second,
	}
}

var contentTypeMapping map[string]interface{} = map[string]interface{}{
	"JSON": "application/json",
	"FORM": "application/x-www-form-urlencoded",
}

func MakePostFormRequest(url string, formData url.Values) (*http.Response, error) {
	// var formData url.Values
	req, err := http.NewRequest("POST", url, strings.NewReader(formData.Encode()))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", contentTypeMapping["FORM"].(string))
	resp, err := Client.Do(req)
	if err != nil {
		return nil, err
	}
	return resp, nil
}

func MakePostJsonRequest(url string, data map[string]interface{}) (*http.Response, error) {
	dataJSON, err := json.Marshal(data)
	if err != nil {
		return nil, err
	}
	req, err := http.NewRequest("POST", url, strings.NewReader(string(dataJSON)))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", contentTypeMapping["JSON"].(string))
	resp, err := Client.Do(req)
	if err != nil {
		return nil, err
	}
	return resp, nil

}

func MakeGetRequest(url string) (*http.Response, error) {
	req, err := http.NewRequest("GET", url, strings.NewReader(""))
	if err != nil {
		return nil, err
	}

	resp, err := Client.Do(req)
	if err != nil {
		return nil, err
	}
	return resp, nil
}

func MakeGetRequestWithHeaders(url string, headers map[string]string) (*http.Response, error) {
	req, err := http.NewRequest("GET", url, strings.NewReader(""))
	if err != nil {
		return nil, err
	}
	for key, value := range headers {
		req.Header.Set(key, value)
	}
	resp, err := Client.Do(req)
	if err != nil {
		return nil, err
	}
	return resp, nil
}
