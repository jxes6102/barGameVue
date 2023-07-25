from flask import Flask,request,jsonify,make_response
from flask_cors import CORS
import numpy as np
import requests
from bs4 import BeautifulSoup as bs
import time
import datetime
from flask_apscheduler import APScheduler
import json

app = Flask(__name__)
CORS(app)
scheduler = APScheduler()  # 定时任务调度器
scheduler.init_app(app)
scheduler.start()  # 定时任务开始

todaytList = {}
termInTimeData = {}

@app.route("/api")
def test():
    return jsonify({'test': 'nice'})

@app.route('/api/gethistory', methods=['GET'])
def getHistory():
    with open("./lottery/today.json") as file:
        data = json.load(file)
    return data

@app.route('/api/getTime', methods=['GET'])
def getTime():
    nowTime = int(time.time()) # 取得現在時間
    return {'time': nowTime}

@scheduler.task('interval',id='job_1',seconds=4, misfire_grace_time=2000)
def get_lottery():
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
    global todaytList
    global termInTimeData
    todaytList = {}
    
    for item in matrix:
        todaytList[item[0]] = [item[1],item[2],item[3],item[4],termInTimeData[int(item[0])]]

    modifyFile()


def writeFile():
    # print('writeFile')
    termKey = 112036744
    originDate = datetime.date(2023,7,1)
    nowDate = datetime.date.today()
    dayDif = (nowDate-originDate).days
    todayTerm = termKey+203*dayDif
    dataDict = {}
    timeSecond = 425
    global termInTimeData

    with open("./lottery/today.json") as file:
        data = json.load(file)
        data = {}
        with open('./lottery/today.json', 'w') as f: 
            json.dump(data, f, indent = 2)

    for i in range(todayTerm, todayTerm+203):
        dataDict[i] = []
        timeStr = str(int(timeSecond/60)) + ":"
        if(timeSecond%60 >= 10):
            timeStr+=str(timeSecond%60)
        else:
            timeStr+= '0' + str(timeSecond%60)
        termInTimeData[i] = timeStr
        timeSecond+=5

    with open("./lottery/today.json",'w+') as file:
        json.dump(dataDict, file, indent = 2)

writeFile()

def modifyFile():
    # print('modifyFile')
    global todaytList

    with open("./lottery/today.json") as file:
        data = json.load(file)
        for key in todaytList:
            data[key] = todaytList[key]

        with open('./lottery/today.json', 'w') as f: 
            json.dump(data, f, indent = 2)


@scheduler.task('cron',id='job_2',day='*',hour='0',minute='10', misfire_grace_time=5000)
def checkJson():
    writeFile()


if __name__ == "__main__":
    app.config['JSON_AS_ASCII'] = False
    app.run(host='127.0.0.1', port='5000')