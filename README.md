# vitamin-gameframework-threejs
threejs + fairygui 

Webpack 会忽略没有明确引用的ts文件,暂时没有找到解决方案。
这样会导致 Model 和Command 这种强解耦的类无法打包
后面考虑去除webpack编译流程
改用gulp+tsc方式