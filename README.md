康一康我的这个项目吧，它能够使win系统和mac系统能通过IP访问特定network下的docker容器！这在学习分布式系统的时候非常方便。

[![V-YOP/docker-network - GitHub](https://gh-card.dev/repos/V-YOP/docker-network.svg)](https://github.com/V-YOP/docker-network)

# yuuki-hadoop

学习hadoop环境搭建过程中整出来的docker集群，配置使用properties，其将在第一次启动时生成等价的xml。

# 特色

- 使用nodejs作为脚本语言来确定各容器创建和启动时的行为，包括但不限于启动sshd，http-server，格式化namenode，启动dfs和yarn等
- 使用properties来替代原本臃肿的xml配置

# usage

**需在source/runtime_environment中添加hadoop（3），jdk8，node的二进制的tar.gz包**，细节见Dockerfile，这里给出清华大学镜像源的这些包的下载点。

- [Hadoop-3.3.1](https://mirrors.tuna.tsinghua.edu.cn/apache/hadoop/common/hadoop-3.3.1/hadoop-3.3.1.tar.gz)
- [jdk8](https://mirrors.tuna.tsinghua.edu.cn/AdoptOpenJDK/8/jdk/x64/linux/OpenJDK8U-jdk_x64_linux_hotspot_8u322b06.tar.gz)
- [node](https://mirrors.tuna.tsinghua.edu.cn/nodejs-release/v17.5.0/node-v17.5.0-linux-x64.tar.gz)

然后执行`docker-compose up -d --build`即可，详细说明……之后会补上吧大概。

# tips

发现一个小坑：要保证给Docker分配的空间要足，如果所剩无几的话节点就会进入不健康状态，不执行Application了，任务就一直pending。

**Win用户必须保证ssh和hadoop的配置的换行符为LF（git拉下来似乎会转换成CRLF），否则可能出现无法预料的bug！**可以尝试通过`git bash`运行项目根目录下的`CRLF_TO_LF.js`来进行这种替换。

# TODO

- [x] 使用properties来进行配置而非yml
- [ ] 创建新的用户来使用hdfs，而不使用root
- [ ] 完整的使用介绍（究竟有没有必要呢……）