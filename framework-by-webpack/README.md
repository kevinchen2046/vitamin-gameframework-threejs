# vitamin-gameframework-threejs
threejs + fairygui 

### 问题
Webpack 会忽略没有明确引用的ts文件,暂时没有找到解决方案。
这样会导致 Model 和Command 这种强解耦的类无法打包。
关于此问题的问答 https://stackoverflow.com/questions/35504680/exported-typescript-class-not-included-in-webpack-bundle-if-not-used-directly

- 解决方案1   
    后面考虑去除webpack编译流程,改用gulp+tsc方式.但此流程对依赖项不友好,需要手动打包依赖项
- 解决方案2 https://www.jianshu.com/p/eb99de222111
    测试过不好使
- 解决方案3
    手动输入增加强引用

