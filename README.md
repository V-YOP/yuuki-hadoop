# yuuki-hadoop

学习hadoop环境搭建过程中整出来的docker集群，使用nodejs作为脚本来确定各容器创建和启动时的行为。

**需在source/runtime_environment中添加hadoop（3），jdk8，node的二进制的tar.gz包**，细节见Dockerfile，这里给出清华大学镜像源的这些包的下载点。

- [Hadoop-3.3.1](https://mirrors.tuna.tsinghua.edu.cn/apache/hadoop/common/hadoop-3.3.1/hadoop-3.3.1.tar.gz)
- [jdk8](https://mirrors.tuna.tsinghua.edu.cn/AdoptOpenJDK/8/jdk/x64/linux/OpenJDK8U-jdk_x64_linux_hotspot_8u322b06.tar.gz)
- [node](https://mirrors.tuna.tsinghua.edu.cn/nodejs-release/v17.5.0/node-v17.5.0-linux-x64.tar.gz)

配置使用properties，其将生成等价的xml。

一个小坑是要保证给Docker分配的空间要足，如果所剩无几的话节点就会进入不健康状态，不执行Application了，任务就一直pending。

<span color="red">Win用户必须保证ssh的配置以及hadoop的workers文件的换行符为LF（git拉下来似乎会转换成CRLF），否则可能出现无法预料的bug！</span>

# TODO

- [x] 使用properties来进行配置而非yml
- [ ] 创建新的用户来使用hdfs，而不使用root
- [ ] 把所有脚本换成ts