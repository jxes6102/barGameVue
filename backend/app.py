from flask import Flask,request,jsonify,make_response
from flask_cors import CORS
import numpy as np
import requests
from bs4 import BeautifulSoup as bs
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from time import sleep
# database test
import mysql.connector
from mysql.connector import Error
def databaseTest():
    try:
        # 連接 MySQL/MariaDB 資料庫
        connection = mysql.connector.connect(
            host='localhost',          # 主機名稱
            database='pycrawler', # 資料庫名稱
            user='root',        # 帳號
            password='')  # 密碼

        if connection.is_connected():

            # 顯示資料庫版本
            db_Info = connection.get_server_info()
            print("資料庫版本：", db_Info)

            # 查詢
            cursor = connection.cursor()
            cursor.execute("SELECT * FROM `testtable`;")
            record = cursor.fetchall()
            print("目前使用的資料庫：", record)
            for item in record:
                print(item)

            #修改
            # cursor = connection.cursor()
            # # single
            # # cursor.execute("INSERT INTO testtable (text) VALUES ('%s')" % 'add from flask-2')
            # #many
            # add = "INSERT INTO testtable (text,number) VALUES (%s,%s)"
            # data = ("add from flask-3",789)
            # cursor.execute(add,data)
            # # Make sure data is committed to the database
            # connection.commit()

            #刪除 DELETE FROM `testtable` WHERE `number` = 789;
            # cursor = connection.cursor()
            # # single
            # # cursor.execute("DELETE FROM testtable WHERE number = %s" % 456)
            # connection.commit()

    except Error as e:
        print("資料庫連接失敗：", e)

    finally:
        if (connection.is_connected()):
            cursor.close()
            connection.close()
            print("資料庫連線已關閉")

# databaseTest()
# database test


# options = Options()
# options.chrome_executable_path='./chromedriver.exe'
# driver = webdriver.Chrome(options = options)
# driver.get('https://www.taiwanlottery.com.tw/Lotto/BINGOBINGO/drawing.aspx')
# # driver.close()
app = Flask(__name__)
CORS(app)

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

@app.route('/getallhistory', methods=['POST'])
def getallhistory():
    
    # sleep(2)
    # sortType = request.form['sortType']
    # # print(sortType,type(sortType))
    
    # eles = driver.find_elements(By.TAG_NAME,'option')
    # if(sortType == 'order'):
    #     for el in eles:
    #         if(el.text == '依開出順序排序'):
    #             el.click()
    # if(sortType == 'size'):
    #     for el in eles:
    #         if(el.text == '依大小順序排序'):
    #             el.click()
    # sleep(2)

    # input = driver.find_element(By.ID,'Button1')
    # input.click()

    # sleep(2)

    # table = driver.find_elements(By.CLASS_NAME,'tableFull')
    # # print(table[1].text,type(table[1].text))
    # # for el in table:
    # #     print(el)
    # # for el in table:
    # #     print(el.text)
    # # tdA_3 =  table.find_elements(By.CLASS_NAME,'tdA_3')
    # # for el in tdA_3:
    # #     print(el.text)



    # # sleep(2)
    # return table[1].text
    return 'zxc'

if __name__ == "__main__":
    app.config['JSON_AS_ASCII'] = False
    app.run(host='127.0.0.1', port='5000')