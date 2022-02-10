FROM fedora

# ssh，以及一些方便debug的玩意
RUN yum install -y openssh-server openssh-clients hostname util-linux procps vim

# ./source/runtime_environment/hadoop/, ./source/runtime_environment/node/, ./source/runtime_environment/jdk8/
COPY ./source/runtime_environment/ /opt/

ENV PATH="/opt/hadoop/bin:/opt/hadoop/sbin:/opt/node/bin:/opt/jdk8/bin:${PATH}" \
    JAVA_HOME="/opt/jdk8" \
    HADOOP_HOME="/opt/hadoop" \
    HDFS_NAMENODE_USER="root" \
    HDFS_DATANODE_USER="root" \
    HDFS_SECONDARYNAMENODE_USER="root" \
    YARN_RESOURCEMANAGER_USER="root" \
    YARN_NODEMANAGER_USER="root" 

# 拷贝nodejs脚本
COPY ./script/* /init-script/

# hadoop的xml，workers
COPY ./config/xml/* /opt/hadoop/etc/hadoop/
COPY ./config/workers /opt/hadoop/etc/hadoop/

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

CMD node /init-script/init.js &&\
    node /init-script/on-start.js
    

# 使用 docker-compose up -d --build 来build和启动
