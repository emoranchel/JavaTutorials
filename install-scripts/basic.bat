@echo off
setx JAVA_HOME C:\software\dev-tools\jdk1.8.0_51



set prePath=%%PATH%%
set prePath=%prePath%;C:\software\dev-tools\jdk1.8.0_51\bin
set prePath=%prePath%;C:\software\dev-tools\apache-maven-3.3.3\bin
setx PATH %prePath%
