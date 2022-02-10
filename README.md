# yuuki-hadoop

学习hadoop环境搭建过程中整出来的docker集群，使用nodejs作为脚本来确定各容器创建和启动时的行为。

需在source/runtime_environment中添加hadoop（3），jdk8，node的运行时环境后才能使用，细节见Dockerfile。

需创建名为my_network的docker网络，子网为`172.19.0.0/16`。

TODO: 各xml是直接从相应default.xml中修改的，发现一些过期配置会覆盖未过期配置导致bug（fs.defaultFS配置问题）。