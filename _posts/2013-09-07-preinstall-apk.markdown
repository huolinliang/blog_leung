---
layout: default
title: android内置apk  
---

## android内置apk

在android产品中，客户定制内容中基本少不了内置apk，这里是他们在android设备上创造差异化的其中一个点，虽然有时候内置的apk感觉也没啥大用，但是貌似不管国内国外的客户，都有这个需求.

要实现内置apk，有几种方法，大致总结了如下：
最简单的方法，编译android完毕，直接把apk丢进out目录的system/app目录下，这样android系统起来后，这里的apk就可以直接使用，如无意外的话

当然有时还是会有意外的，当apk放在system/app下却无法使用，可能是因为apk包中存在某些so库文件，你可以手动解开apk包，把其中的so库文件提取出来，手动放入out目录下system/lib这个目录下，重新打包.大部分的apk就能正常使用了.

说是大部分，就是说还是会有某些顽固的apk依然无效，这些apk应该是它代码本身需要生成一些特定文件，有些可以在板子的文件系统中看到，路径是/data/data/apk_name,对于这类apk一般就无法实现内置了.但是还有折中的方法，虽然无法实现内置，但是可以使用预安装的方法,预安装与内置的区别是预安装在系统第一次烧录进去启动的时候，先在后台安装apk，这段时间里面系统反应会变慢.这个时间的长短取决于预安装apk的数量.不过一般也不会太多，毕竟这是内置apk失败的时候的第二条路而已.

实现预安装的方法如下：

首先在编译好的产品out目录下，找到system目录，在其下创建子目录，如preinstall，并把需要预安装的apk全部cp进preinstall这个文件夹下

然后新建一个脚本，如叫preinstall.sh，脚本放在/system/bin/目录下，写入如下代码：

    #!/system/bin/sh
    echo "###### start perinstall ######"
    if [ ! -e /data/firstrun ];then
    cd /system/preinstall/
    /system/bin/pm install xxxx.apk
    /system/bin/pm install xxxx.apk
    touch /data/firstrun
    fi
    echo "###### preinstall end ######"

脚本的意思很简单，就是调用了android的pm指令，安装指定的apk

然后修改入口文件，直接在产品out目录下找到文件init.rc，在文件末尾增加一个service如下：

    service preinstall /system/bin/preinstall.sh
        class main
        group root root
        oneshot
        disabled
    on property:dev.bootcomplete=1
    start preinstall

重新打包，测试.
 
<p>Author:leung</p>
<p>{{ page.date | date_to_string }}</p>
