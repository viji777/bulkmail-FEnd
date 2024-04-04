import { useState } from "react"
import axios from 'axios';
import * as XLSX from 'xlsx';

function App() {

  const [msg, setMsg] = useState("")
  const [status, setStatus] = useState(false)
  const[emailList,setemailList] = useState([])

  function handleMsg(event) {
    setMsg(event.target.value)
  }

  function handleFile(event) {
    const file = event.target.files[0]; // Get the selected file
    const reader = new FileReader();

    reader.onload = function (e) {
      const data = e.target.result; // File data

      const workbook = XLSX.read(data, { type: 'binary' }); // Parse Excel file
      const sheetName = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[sheetName]
      const emailList = XLSX.utils.sheet_to_json(worksheet, { header: 'A' })
      const totalemail =  emailList.map(function(item)
      {
        return item.A
      })
setemailList(totalemail)
    }

    reader.readAsBinaryString(file)


  }

  function send() {
    setStatus(true)
    axios.post("http://localhost:5000/sendemail", { msg: msg,emailList:emailList })
      .then(function (data) {
        if (data.data === true) {
          alert("Email sent Successfully")
          setStatus(false)
        }
        else {
          alert("Failed")
        }
      })
  }



  return (
    <div>
      <div className="bg-blue-950 text-center text-white  ">
        <h1 className="text-2xl px-5 py-5">Bulk Mail</h1>
      </div>
      <div className="bg-blue-800 text-center text-white  ">
        <h1 className="font-medium px-5 py-5">We can help your business with sending multiple eamil at once</h1>
      </div>
      <div className="bg-blue-600 text-center text-white  ">
        <h1 className="font-medium px-5 py-5">Drag and Drop</h1>
      </div>
      <div className="bg-blue-400 flex flex-col items-center text-black px-5 py-5">
        <textarea onChange={handleMsg} value={msg} className="w-[80%] h-32 py-2 mt-5 outline-none border border-black rounded" placeholder="Enter the email text..."></textarea>

        <div>
          <input onChange={handleFile} className="border-4 border-dashed py-4 px-4 mt-8 mb-8" type="file"></input>
        </div>
        <p>Total Email in the file:{emailList.length}</p>
        <button onClick={send} className="bg-blue-950 py-2 px-2 text-white font-medium rounded mt-3 my-3 ">{status ? "Sending..." : "Send"}</button>
      </div>
      <div className="bg-blue-300 text-center text-white p-8  ">

      </div>
      <div className="bg-blue-200 text-center text-white  p-8 ">

      </div>
    </div>
  )
}
export default App