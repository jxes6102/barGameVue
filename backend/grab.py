# 套件
import numpy as np
import requests
from bs4 import BeautifulSoup as bs
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from time import sleep

options = Options()
options.chrome_executable_path='./chromedriver.exe'
driver = webdriver.Chrome(options = options)
driver.get('https://www.taiwanlottery.com.tw/Lotto/BINGOBINGO/drawing.aspx')
sleep(2)

eles = driver.find_elements(By.TAG_NAME,'option')

# text = ele.find_element(By.CLASS_NAME,'tdA_3').text
for el in eles:
    # print(el.text)
    if(el.text == '依開出順序排序'):
        el.click()


sleep(2)
driver.close()



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
# for item in matrix:
#     print('期數: ',item[0])
#     print('號碼: ',item[1])
#     print('特別號: ',item[2])
#     print('大小: ',item[3])
#     print('單雙: ',item[4]+'\n')
