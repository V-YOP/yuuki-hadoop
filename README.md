康一康我的这个项目吧，它能够使 win 系统和 mac 系统能通过 IP 访问特定 network 下的 docker 容器！这在学习分布式系统的时候非常方便。

[![V-YOP/docker-network - GitHub](https://gh-card.dev/repos/V-YOP/docker-network.svg)](https://github.com/V-YOP/docker-network)

# yuuki-hadoop

学习 hadoop 环境搭建过程中整出来的 docker 集群，配置使用 properties，其将在第一次启动时生成等价的 xml。

# 特色

- 使用 nodejs 作为脚本语言来确定各容器创建和启动时的行为，包括但不限于启动 sshd，http-server，格式化 namenode，启动 dfs 和 yarn 等
- 使用 properties 来替代原本臃肿的 xml 配置

# usage

**需在 source/runtime_environment 中添加 hadoop（3），jdk8，node, Hive（3）的二进制的 tar.gz 包**，以及添加 **mysql-connector-java**的 jar 包（请通过[阿里云仓库](https://developer.aliyun.com/mvn/search)进行搜索和下载），细节见 Dockerfile，这里给出清华大学镜像源的这些包的下载点。
 
- [Hadoop-3.3.1](https://mirrors.tuna.tsinghua.edu.cn/apache/hadoop/common/hadoop-3.3.1/hadoop-3.3.1.tar.gz)
- [jdk8](https://mirrors.tuna.tsinghua.edu.cn/AdoptOpenJDK/8/jdk/x64/linux/OpenJDK8U-jdk_x64_linux_hotspot_8u322b06.tar.gz)
- [node](https://mirrors.tuna.tsinghua.edu.cn/nodejs-release/v17.5.0/node-v17.5.0-linux-x64.tar.gz)
- [Hive-3.1.2](https://mirrors.tuna.tsinghua.edu.cn/apache/hive/hive-3.1.2/apache-hive-3.1.2-bin.tar.gz)
- [Spark-3.2.1](https://mirrors.tuna.tsinghua.edu.cn/apache/spark/spark-3.2.1/spark-3.2.1-bin-hadoop3.2-scala2.13.tgz)

然后执行`docker-compose up -d --build`即可，详细说明……之后会补上吧大概。

# tips

发现一个小坑：要保证给 Docker 分配的空间要足，如果所剩无几的话节点就会进入不健康状态，不执行 Application 了，任务就一直 pending。

**Win 用户必须保证 ssh 和 hadoop 的配置的换行符为 LF（git 拉下来似乎会转换成 CRLF），否则可能出现无法预料的 bug！**可以尝试通过`git bash`运行项目根目录下的`CRLF_TO_LF.js`来进行这种替换。

Hive 的容器不需要运行 HDFS 或 Yarn（即不需要加到 workers 里面），但需要在本地有 Hadoop 的环境，它将通过 HADOOP_HOME 环境变量来找到 Hadoop。

Hive用Derby时，使用Hive命令时会使用当前位置作为数据库的上下文…这非常奇怪了属于是。

重新创建集群时，需要`docker-compose up -d --build --force-recreate -V`，其中`-V`保证mysql不会重复利用已有的Volume，导致使用原数据库，hive创建schema时出现表存在的问题。

# TODO

- [x] 使用 properties 来进行配置而非 yml
- [x] 创建新的用户来使用 hdfs，而不使用 root（Hadoop的权限系统令人绝望！） 
- [ ] 完整的使用介绍（究竟有没有必要呢……）