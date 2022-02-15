#!/bin/sh
# 存储一些小文件，观察数据块的使用情况，测试说明每个数据块只会属于同一个文件
hadoop fs -rm -r -f /input 
hadoop fs -mkdir /input
hadoop fs -put /share/states.txt /input/0.txt 
hadoop fs -put /share/states.txt /input/1.txt 
hadoop fs -put /share/states.txt /input/2.txt 
hadoop fs -put /share/states.txt /input/3.txt 
hadoop fs -put /share/states.txt /input/4.txt 
hadoop fs -put /share/states.txt /input/5.txt 
hadoop fs -put /share/states.txt /input/6.txt 
hadoop fs -put /share/states.txt /input/7.txt 
hadoop fs -put /share/states.txt /input/8.txt 
hadoop fs -put /share/states.txt /input/9.txt 

# 1.txt
# Block ID: 1073741825
# Block Pool ID: BP-881854971-172.19.2.1-1644601471523
# 2.txt
# Block ID: 1073741826
# Block Pool ID: BP-881854971-172.19.2.1-1644601471523
# 3.txt
# Block ID: 1073741827
# Block Pool ID: BP-881854971-172.19.2.1-1644601471523
# ...