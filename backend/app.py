from flask import Flask,request,jsonify,make_response
from flask_cors import CORS
import numpy as np
import requests
from bs4 import BeautifulSoup as bs
import time
# import datetime
from flask_apscheduler import APScheduler
# import json

app = Flask(__name__)
CORS(app)
scheduler = APScheduler()  # 定时任务调度器
scheduler.init_app(app)
scheduler.start()  # 定时任务开始


@app.route("/")
def test():
    # # 抓網頁
    # url = 'https://www.taiwanlottery.com.tw/Lotto/BINGOBINGO/drawing.aspx'
    # res = requests.get(url)
    # soup = bs(res.text, 'html.parser')
    # # soup = bs(res.text, 'html5lib')

    # typetdA_3 = soup.find_all('td', class_='tdA_3')
    # typetdA_4 = soup.find_all('td', class_='tdA_4')
    # # 整理資料
    # arr1 = []
    # arr2 = []
    # for el in typetdA_3:
    #     arr1.append(el.get_text()) 
    # for el in typetdA_4:
    #     arr2.append(el.get_text()) 

    # if(len(arr1)%5 == 4):
    #     arr1 = arr1[4:len(arr1)]
    # if(len(arr2)%5 == 4):
    #     arr2 = arr2[4:len(arr1)]

    # data = np.concatenate((arr1, arr2), axis=None)

    # sortData = []
    # for index,item in enumerate(data):
    #     if(item == ''): 
    #         continue
    #     if(index%5 == 0): 
    #         sortData.append([item,data[index+1],data[index+2],data[index+3],data[index+4]])

    # matrix = np.array(sortData)
    # matrix = matrix[matrix[:,0].argsort()]
    # #輸出
    # obj = {}
    # for item in matrix:
    #     obj[item[0]] = [item[1],item[2],item[3],item[4]]
    #     # print('期數: ',item[0])
    #     # print('號碼: ',item[1])
    #     # print('特別號: ',item[2])
    #     # print('大小: ',item[3])
    #     # print('單雙: ',item[4]+'\n')

    # # print(obj)
    return jsonify({'test': 'nice'})

@app.route('/gethistory', methods=['GET'])
def getHistory():
    # 抓網頁
    url = 'https://www.taiwanlottery.com.tw/Lotto/BINGOBINGO/drawing.aspx'
    res = requests.get(url)
    soup = bs(res.text, 'html.parser')

    typetdA_3 = soup.find_all('td', class_='tdA_3')
    typetdA_4 = soup.find_all('td', class_='tdA_4')
    # 整理資料
    arr1 = []
    arr2 = []
    for el in typetdA_3:
        arr1.append(el.get_text()) 
    for el in typetdA_4:
        arr2.append(el.get_text()) 

    if(len(arr1)%5 == 4):
        arr1 = arr1[4:len(arr1)]
    if(len(arr2)%5 == 4):
        arr2 = arr2[4:len(arr1)]

    data = np.concatenate((arr1, arr2), axis=None)

    sortData = []
    for index,item in enumerate(data):
        if(item == ''): 
            continue
        if(index%5 == 0): 
            sortData.append([item,data[index+1],data[index+2],data[index+3],data[index+4]])

    matrix = np.array(sortData)
    matrix = matrix[matrix[:,0].argsort()]
    #輸出
    obj = {}
    for item in matrix:
        obj[item[0]] = [item[1],item[2],item[3],item[4]]
    
    # response = make_response(obj,200)
    # response.headers["ngrok-skip-browser-warning"] = "any"
    # response.headers["Access-Control-Allow-Origin"] = "*"
    # response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    
    # return response
    return obj

@app.route('/getTime', methods=['GET'])
def getTime():
    nowTime = int(time.time()) # 取得現在時間
    # localtime = time.localtime()
    # struct_time = time.localtime(nowTime) # 轉換成時間元組
    # print('localtime: ',localtime)
    # print('struct_time: ',struct_time)
    # print('nowTime: ',nowTime)
    return {'time': nowTime}

# @app.route('/testGrab', methods=['GET'])
# def originGrab():
#     nowTime = int(time.time()) # 取得現在時間
#     return {'time': nowTime}

# @scheduler.task('interval', id='test_job', seconds=5, misfire_grace_time=900)
# def my_sys_log():
#     localtime = time.asctime(time.localtime(time.time()))
#     print("Time:", localtime)

if __name__ == "__main__":
    app.config['JSON_AS_ASCII'] = False
    app.run(host='127.0.0.1', port='5000')