import { Spin, Typography } from 'antd'
import 'antd/dist/antd.css'
import { useState } from 'react'
import './App.scss'
import logo from './static/logo48.svg'

import { calculateGpaAndRank } from './utils/calculator'
import { generateExcel, readExcelFile } from './utils/files'
import { getCurrentDateTime } from './utils/time'
import { IGradeRecord } from './utils/types'

const { Title, Paragraph, Text } = Typography

function App() {
  const [loading, setLoading] = useState(false)

  const uploadMultipleFiles = () => {
    const inputEl = document.createElement('input')
    inputEl.type = 'file'
    inputEl.multiple = true
    inputEl.accept = '.xls'
    inputEl.onchange = async (e: any) => {
      setLoading(true)
      try {
        const allRecords: IGradeRecord[] = []
        const files: File[] = Array.from((e.target || e.path?.[0]).files)
        for (let f of files) {
          const records = await readExcelFile(f)
          allRecords.push(...records)
        }
        const rankRecords = calculateGpaAndRank(allRecords)
        generateExcel(rankRecords, "GPA及排名_" + getCurrentDateTime() + ".xlsx")
        inputEl.remove()
      } finally {
        setLoading(false)
      }
    }
    inputEl.click()
  }
  return <div className='container'>
    <div className='title'>
      <img src={logo} /> GPAHelper for Fdy @ {process.env.PACKAGE_VERSION}
    </div>
    <Spin spinning={loading}>
      <div className='upload-block' onClick={() => { uploadMultipleFiles() }}>
        <span className='text'>
          {loading ? '计算中 请稍后...' : '点击上传（可多选）'}
        </span>
      </div>
    </Spin>
    <div className='demonstration'>
      <Title level={3}>使用帮助</Title>
      <Paragraph>用前须知: <Text mark>本工具提供给清华大学辅导员计算同学成绩使用，基于Javascript网站计算，不会保存辅导员上传的同学成绩，请放心使用！</Text></Paragraph>另外可以前往<a href='https://github.com/xiaoshecode/FdyGPAHelper' target='_blank'>源代码地址</a>根据README文档自行部署到本地或服务器上使用。
      
      <Paragraph>  
        <Title level={4}>功能介绍</Title>
        <ul>
          <li>
            辅导员上传从信息门户导出的同学成绩（“所有成绩查询”或“近期成绩查询”），工具会根据上传数据计算同学们的<Text strong>必修限选GPA和全部课程GPA</Text>（保留6位小数），
            并给出相应的年级排名和班级排名，生成计算好的表格文件下载到电脑上。
          </li>
          <li>
            其中，<Text strong>年级排名</Text>指该在同时上传的若干文件所包含的同学中处在多少名。
            如果需要计算多个班级的排名，请从“所有成绩查询”中导出这些班级的成绩册一起上传，或是从“近期成绩查询”中导出整个年级的成绩册。
          </li>
          <li>
            辅导员导出的成绩册文件至少需要包含【姓名】【学号】【教学班级】【成绩】【绩点成绩】【学分】【课程属性】七列。
          </li>
          <li>
            源代码地址：<a href='https://github.com/xiaoshecode/FdyGPAHelper' target='_blank'>https://github.com/xiaoshecode/FdyGPAHelper</a>
          </li>
        </ul>
      </Paragraph>
      
      <Paragraph>
        <Title level={4}>TODO</Title>
        <ul>
          <li>GPA成绩完全相同时，排名标准待定</li>
          <li>本地保存用户名和密码，登录info后直接获取数据生成表格</li>
        </ul>
      </Paragraph>
      
      <Paragraph>
        <Title level={4}>更新日志</Title>
        <ul>
          <li>2025.09.16: <a href='https://github.com/xiaoshecode' target='_blank'>xiaoshe</a> copy from <a href='https://github.com/PowerfooI' target='_blank'>powerfooi</a>，继续维护</li>
          <li>2024.09.08: 去除后端 Python 部分，全部计算均在浏览器上完成；
            矫正“已修”学分的计算；因原域名或者证书可能过期，为便于维护，该网站后续将迁移到 Github Pages 上</li>
          <li>2023.09.24: 修复非整数学分课程在计算时被忽略的问题，例如体疗目前为 0.8 学分</li>
          <li>2023.03.11: GPA相同时设置为相同名次，新增两列“全部课程学分”和“必修限选学分”，<b>仅包含参与计算GPA的学分，如记P/F的课程不在其中</b></li>
          <li>2022.09.30: GPA计算结果保留小数位从3位改为6位</li>
          <li>2022.01.20: 美化用户界面，支持多文件上传</li>
          <li>2021.01.23: 部署GPA计算工具在线版，支持单个文件上传</li>
        </ul>
      </Paragraph>
      <Paragraph>
        <Title level={4}>最终</Title>
        <ul>
          <li>联系方式: <Text keyboard>shejp20@gmail.com</Text></li>
          <li>感谢原作者 <a href='https://github.com/PowerfooI' target='_blank'>powerfooi</a> 的贡献与支持</li>
        </ul>
      </Paragraph>
    </div>
  </div>
}

export default App
