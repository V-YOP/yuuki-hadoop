# yuuki-hadoop

学习hadoop环境搭建过程中整出来的docker集群，使用nodejs作为脚本来确定各容器创建和启动时的行为。

**需在source/runtime_environment中添加hadoop（3），jdk8，node的二进制的tar.gz包**，细节见Dockerfile，这里给出清华大学镜像源的这些包的下载点。

- [Hadoop-3.3.1](https://mirrors.tuna.tsinghua.edu.cn/apache/hadoop/common/hadoop-3.3.1/hadoop-3.3.1.tar.gz)
- [jdk8](https://mirrors.tuna.tsinghua.edu.cn/AdoptOpenJDK/8/jdk/x64/linux/OpenJDK8U-jdk_x64_linux_hotspot_8u322b06.tar.gz)
- [node](https://mirrors.tuna.tsinghua.edu.cn/nodejs-release/v17.5.0/node-v17.5.0-linux-x64.tar.gz)

现在能够使用yml进行配置了，没有补全这点有点麻烦，或许该使用properties。

<span color="red">Win用户必须保证ssh的配置以及hadoop的workers文件的换行符为LF（git拉下来似乎会转换成CRLF），否则可能出现无法预料的bug！</span>