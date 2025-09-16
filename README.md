# THU-GPA-Helper

xiaoshe copy by powerfool
该工具提供给清华大学辅导员计算同学的 GPA 以及班级和年级排名，无后端实现，成绩数据全部在浏览器上进行计算。
自己保留一份，方便修改和查看源代码。


## 使用方法

- 访问线上版本: 直接访问部署在该仓库的 GitHub Pages 上的版本 [GPA-Helper](https://xiaoshecode.github.io/FdyGPAHelper/)
- 本地开发模式: 将该仓库代码克隆到本地，使用 `yarn` 安装依赖，然后使用 `yarn start` 启动本地开发服务器

## 如何使用 Yarn 部署到 GitHub Pages

1. 安装依赖：
	```shell
	yarn install
	yarn add --dev gh-pages
	```
2. 构建项目：
	```shell
	yarn build
	```
3. 部署到 GitHub Pages：
	```shell
	yarn deploy
	```
4. 在 GitHub 仓库设置页面，选择 gh-pages 分支作为 Pages 发布源。

项目会自动将 `dist` 目录推送到 `gh-pages` 分支，稍等片刻即可通过 `https://xiaoshecode.github.io/FdyGPAHelper/` 访问。

## 更新日志

- 2024.09.08: 去除后端 Python 部分，全部计算均在浏览器上完成；矫正“已修”学分的计算；为便于维护，该网站后续将迁移到 Github Pages 上
- 2023.09.24: 修复非整数学分课程在计算时被忽略的问题，例如体疗目前为 0.8 学分
- 2023.03.11: GPA 相同时设置为相同名次，新增两列“全部课程学分”和“必修限选学分”，**仅包含参与计算 GPA 的学分，如记 P/F 的课程不在其中**
- 2022.09.30: GPA 计算结果保留小数位从 3 位改为 6 位
- 2022.01.20: 美化用户界面，支持多文件上传
- 2021.01.23: 部署 GPA 计算工具在线版，支持单个文件上传
