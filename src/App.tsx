import { Button, Upload } from 'antd'
import 'antd/dist/antd.css'
import './App.scss'

const uploadMultipleFiles = () => {
  const inputEl = document.createElement('input')
  inputEl.type = 'file'
  inputEl.multiple = true
  inputEl.accept = '.xls'
  inputEl.onchange = (e: any) => {
    console.log(e);
    const form = new FormData()
    const files = Array.from(e.path[0].files)
    console.log('files', files);
    files.forEach((f: any) => {
      form.append(f.name, f)
    })
    fetch('/api/upload', {
      method: 'POST',
      body: form,
      mode: 'no-cors'
    }).then((res) => {
      console.log(res);
    })
    inputEl.remove()
  }
  inputEl.click()
}

function App() {
  return <div>
    Hello GPA Helper
    <div>
      <Button onClick={() => { uploadMultipleFiles() }}>自定义上传</Button>
    </div>
  </div>
}

export default App
