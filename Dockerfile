FROM fedora

# ssh，以及一些方便debug的玩意...
RUN yum install -y openssh-server openssh-clients hostname util-linux procps vim findutils netcat
# 这hadoop依赖好多终端命令……就连调个example都能报出来个什么command not found，宁开玩笑吗？

# 其实Node大可以用yum装，但是我乐意～
# ADD命令会解压压缩文件！
# 解压各tar.gz并修改文件夹名称！如果更换了版本，记得修改文件夹名称
# 这里用的是mysql connector 的8.0.26版本，当前(2022.02.23)阿里云的maven仓库最新的版本是8.0.23，注意修改
ADD ./source/runtime_environment/* /opt/
RUN mv /opt/hadoop-3.3.1/                          /opt/hadoop/   &&\
    mv /opt/node-v17.5.0-linux-x64/                /opt/node/     &&\
    mv /opt/jdk8u322-b06/                          /opt/jdk8/     &&\
    mv /opt/apache-hive-3.1.2-bin/                 /opt/hive/     &&\
    mv /opt/mysql-connector-java-8.0.26.jar        /opt/hive/lib  &&\
    mv /opt/spark-3.2.1-bin-hadoop3.2-scala2.13/   /opt/spark/

ENV PATH="/opt/spark/bin:/opt/hive/bin:/opt/hadoop/bin:/opt/hadoop/sbin:/opt/node/bin:/opt/jdk8/bin:${PATH}" \
    HIVE_HOME="/opt/hive" \
    SPARK_HOME="/opt/spark" \
    JAVA_HOME="/opt/jdk8" \
    HADOOP_HOME="/opt/hadoop" \
    HADOOP_MAPRED_HOME="/opt/hadoop" \
    HDFS_NAMENODE_USER="root" \
    HDFS_DATANODE_USER="root" \
    HDFS_SECONDARYNAMENODE_USER="root" \
    YARN_RESOURCEMANAGER_USER="root" \
    YARN_NODEMANAGER_USER="root" \
    HADOOP_USER_NAME="root" \
    SPARK_USER_NAME="root"

# 拷贝package.json，用来安装依赖
COPY ./script/package.json /init-script/

# 安装一些nodejs的依赖，包括http-server
WORKDIR /init-script
RUN npm i

# SSH配置
RUN adduser yuuki &&\
    echo -e '\nyuuki ALL=(root)NOPASSWD:ALL' >> /etc/sudoers

COPY ./config/ssh/* /home/yuuki/.ssh/
COPY ./config/ssh/* /root/.ssh/
COPY ./config/ssh/sshd_config /etc/ssh/

# hadoop的xml，workers
COPY ./config/properties/* /config/properties/
COPY ./config/workers /opt/hadoop/etc/hadoop/

# Spark的配置

COPY ./config/spark/* /opt/spark/conf

# node脚本
COPY ./script/src/ /init-script/src/

# 为什么init.js文件写在CMD而非通过RUN执行？因为它的执行需要获取容器的运行时的配置
WORKDIR /share

RUN touch /etc/profile.d/custom.sh &&\
    chmod 777 /etc/profile.d/custom.sh &&\
    chmod 700 -R /root &&\
    chmod 700 /home/yuuki/ &&\
    chown yuuki -R /home/yuuki &&\
    chmod 700 /home/yuuki/.ssh/ &&\
    chmod 644 /home/yuuki/.ssh/id_rsa.pub &&\
    chmod 600 /home/yuuki/.ssh/id_rsa /home/yuuki/.ssh/authorized_keys &&\
    # root的被spark所使用
    chmod 700 /root/.ssh/ &&\ 
    chmod 644 /root/.ssh/id_rsa.pub &&\
    chmod 600 /root/.ssh/id_rsa /root/.ssh/authorized_keys

# TODO 关于权限和用户的部分急需重写

CMD  node /init-script/src/index.js
# 使用 docker-compose up -d --build 来build和启动
