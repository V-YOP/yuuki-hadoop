FROM fedora

# ssh，以及一些方便debug的玩意...
RUN yum install -y openssh-server openssh-clients hostname util-linux procps vim findutils
# 这hadoop依赖好多终端命令……就连调个example都能报出来个什么command not found，宁开玩笑吗？


# ./source/runtime_environment/hadoop/, ./source/runtime_environment/node/, ./source/runtime_environment/jdk8/
# ADD命令会解压压缩文件！
# 解压各tar.gz并修改文件夹名称！如果更换了版本，记得修改文件夹名称
ADD ./source/runtime_environment/* /opt/
RUN mv /opt/hadoop-3.3.1/           /opt/hadoop/  &&\
    mv /opt/node-v17.5.0-linux-x64/ /opt/node/    &&\
    mv /opt/jdk8u322-b06/           /opt/jdk8/

ENV PATH="/opt/hadoop/bin:/opt/hadoop/sbin:/opt/node/bin:/opt/jdk8/bin:${PATH}" \
    JAVA_HOME="/opt/jdk8" \
    HADOOP_HOME="/opt/hadoop" \
    HADOOP_MAPRED_HOME="/opt/hadoop" \
    HDFS_NAMENODE_USER="root" \
    HDFS_DATANODE_USER="root" \
    HDFS_SECONDARYNAMENODE_USER="root" \
    YARN_RESOURCEMANAGER_USER="root" \
    YARN_NODEMANAGER_USER="root" 

# SSH配置
COPY ./config/ssh/* /root/.ssh/
COPY ./config/ssh/sshd_config /etc/ssh/

    # 设置javahome是因为hadoop在运行时会通过su来切换用户导致该环境变量不可用
RUN echo -e 'export JAVA_HOME=/opt/jdk8' >> /etc/profile.d/custom.sh  &&\
    # 生成各个ssh服务端的key
    ssh-keygen -A &&\
    # ssh各种配置文件的权限，虽然好像不配也没什么问题……
    chmod 700 /root/.ssh/ &&\
    chmod 644 /root/.ssh/id_rsa.pub &&\
    chmod 600 /root/.ssh/id_rsa /root/.ssh/authorized_keys

# hadoop的xml，workers
COPY ./config/properties/* /opt/hadoop/etc/hadoop/
COPY ./config/workers /opt/hadoop/etc/hadoop/

# 拷贝nodejs脚本
COPY ./script/ /init-script/

# 安装一些nodejs的依赖
WORKDIR /init-script
RUN npm i

CMD node /init-script/src/init.js && node /init-script/src/on-start.js

# 使用 docker-compose up -d --build 来build和启动
