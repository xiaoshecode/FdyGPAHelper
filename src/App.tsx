import { Button, Upload, Typography, Spin } from 'antd'
import 'antd/dist/antd.css'
import { useState } from 'react'
import './App.scss'
import logo from './static/logo48.svg'


const { Title, Paragraph, Text } = Typography

function App() {
  const [loading, setLoading] = useState(false)

  /** uploadMultipleFiles 上传多个文件并下载返回结果 */
  const uploadMultipleFiles = () => {
    const inputEl = document.createElement('input')
    inputEl.type = 'file'
    inputEl.multiple = true
    inputEl.accept = '.xls'
    inputEl.onchange = (e: any) => {
      console.log(e);
      const form = new FormData()
      const files = Array.from((e.target || e.path?.[0]).files)
      console.log('files', files);
      files.forEach((f: any) => {
        form.append(f.name, f)
      })
      setLoading(true)
      fetch('/api/upload', {
        method: 'POST',
        body: form,
        mode: 'no-cors'
      }).then((res) => res.json())
        .then((res) => {
          const filepath = res.filepath
          return fetch('/' + filepath)
          .then((res) => res.blob())
          .then((blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filepath.split('/')[1]
            document.body.appendChild(a); 
            a.click();    
            a.remove();
          })
        }).finally(() => {
          setLoading(false)
        })
      inputEl.remove()
    }
    inputEl.click()
  }
  return <div className='container'>
    <div className='title'>
      <img src={logo} /> THU GPA Helper
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
      <Paragraph>用前须知: <Text mark>本工具仅提供给清华大学辅导员计算所带同学成绩使用，工具不会保存辅导员上传的成绩，请放心使用！</Text></Paragraph>
      <Paragraph>
        功能介绍:
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
            辅导员导出的成绩册文件至少需要包含【姓名】【学号】【教学班级】【绩点成绩】【学分】【课程属性】六列。
          </li>
        </ul>
      </Paragraph>
      <Paragraph>
        联系方式:（若有 Bug 或建议可联系我）
        <ul>
          <li>清华邮箱: <Text keyboard>wang-sy20@mails.tsinghua.edu.cn</Text></li>
          <li>网易邮箱: <Text keyboard>whiteffire@163.com</Text>（常用）</li>
        </ul>
      </Paragraph>
      <Paragraph>
        更新日志:
        <ul>
          <li>2023.09.24: 修复非整数学分课程在计算时被忽略的问题，例如体疗目前为 0.8 学分</li>
          <li>2023.03.11: GPA相同时设置为相同名次，新增两列“全部课程学分”和“必修限选学分”，<b>仅包含参与计算GPA的学分，如记P/F的课程不在其中</b></li>
          <li>2022.09.30: GPA计算结果保留小数位从3位改为6位</li>
          <li>2022.01.20: 美化用户界面，支持多文件上传</li>
          <li>2021.01.23: 部署GPA计算工具在线版，支持单个文件上传</li>
        </ul>
      </Paragraph>
    </div>
  </div>
}

export default App
