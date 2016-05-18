@echo off

set BASEPATH=C:\software\dev-tools

setx JAVA_HOME %BASEPATH%\jdk1.8.0_51
setx ANT_HOME %BASEPATH%\apache-ant-1.9.6
setx MAVEN_HOME %BASEPATH%\apache-maven-3.3.3
setx M2_HOME %BASEPATH%\apache-maven-3.3.3
setx M2 %BASEPATH%\apache-maven-3.3.3\bin
setx NODE_HOME %BASEPATH%\nodejs
setx PYTHON_HOME %BASEPATH%\Python27
setx PYTHON %BASEPATH%\Python27\python.exe
rem setx APACHE_HOME %BASEPATH%\Apache2.2
rem setx GRAILS_HOME %BASEPATH%\grails-2.0.3
rem setx GROOVY_HOME %BASEPATH%\groovy-1.8.6
rem setx MW_HOME %BASEPATH%\wls1211_dev

setx JAVA_VENDOR Sun

setx MAVEN_OPTS "-Xms512m -Xmx768m"
setx ANT_OPTS "-Xms512m -Xmx768m"

set prePath=%%PATH%%
set prePath=%prePath%;%BASEPATH%\tools
set prePath=%prePath%;%JAVA_HOME%\bin
set prePath=%prePath%;%MAVEN_HOME%\bin
set prePath=%prePath%;%ANT_HOME%\bin
set prePath=%prePath%;%NODE_HOME%
set prePath=%prePath%;PYTHON_HOME%
rem set prePath=%prePath%;%APACHE_HOME%\bin
rem set prePath=%prePath%;%GRAILS_HOME%\bin
rem set prePath=%prePath%;%GROOVY_HOME%\bin
rem set prePath=%prePath%;%MW_HOME%\wlserver\server\bin
rem set prePath=%prePath%;%BASEPATH%\UnxUtils\usr\local\wbin
rem set prePath=%prePath%;%BASEPATH%\CollabNet
set prePath=%prePath%;%BASEPATH%\7-Zip
set prePath=%prePath%;%BASEPATH%\cmd
set prePath=%prePath%;%BASEPATH%\openssl\bin
set prePath=%prePath%;"%BASEPATH%\Notepad++"
set prePath=%prePath%;"%BASEPATH%\netbeans\bin"
set prePath=%prePath%;"%BASEPATH%\putty"
set prePath=%prePath%;"%BASEPATH%\pstools"
set prePath=%prePath%;"C:\Users\ed_ze\AppData\Roaming\npm"
set prePath=%prePath%;"C:\Program Files (x86)\Microsoft VS Code\bin"


echo %prePath%

setx PATH %prePath%

rem mkdir %USERPROFILE%\.m2
rem copy settings.xml %USERPROFILE%\.m2 /y