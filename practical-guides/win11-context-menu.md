---
title: Win11 右键菜单改回 Win10 经典样式
date: 2025-10-23
description: Win11 右键菜单改回 Win10 经典样式的方法
---

1. 点击任务栏的 开始 菜单搜索框，输入 **cmd**。
2. 在右侧出现的"命令提示符"下方，点击 **"以管理员身份运行"**。
3. 在黑框中复制并粘贴以下这行代码，然后按回车键（Enter）：
```
reg add "HKCU\Software\Classes\CLSID\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}\InprocServer32" /f /ve
```

4.  看到提示"操作成功完成"后，打开任务管理器，重启**"Windows 资源管理器"**（或者直接重启电脑）。
5. 再次右键，你会发现菜单变成了 Win10 的经典样式，通常都是**绝对的秒开**。



备注：
如果你以后想恢复成 Win11 现在的菜单，同样在 CMD 中输入这行代码回车并重启即可：
```
reg delete "HKCU\Software\Classes\CLSID\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}" /f
```
