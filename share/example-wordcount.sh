#!/bin/sh
# 执行wordcount
hadoop fs -rm -r -f /input 
hadoop fs -rm -r -f /output
hadoop fs -mkdir /input
hadoop fs -put /share/*.txt /input
hadoop jar /opt/hadoop/share/hadoop/mapreduce/hadoop-mapreduce-examples-3.3.1.jar wordcount /input /output
hadoop fs -cat /output/part-r-00000