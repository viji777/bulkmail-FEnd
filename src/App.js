import { useState } from "react";
import axios from 'axios';
import * as XLSX from 'xlsx';

function App() {

  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState(false);
  const [emailList, setEmailList] = useState([]);

  function handleMsg(event) {
    setMsg(event.target.value);
  }

  function handleFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const emails = XLSX.utils.sheet_to_json(worksheet, { header: 'A' });
      const totalEmails = emails.map(item => item.A);
      setEmailList(totalEmails);
    };

    reader.readAsBinaryString(file);
  }

  function send() {
    if (emailList.length === 0) {
      alert("Please upload a valid Excel file with email addresses.");
      return;
    }

    if (!msg) {
      alert("Please enter a message to send.");
      return;
    }

    setStatus(true);
    axios.post("https://bulkmail-bend-1.onrender.com/sendemail", { msg, emailList })
      .then(function (response) {
        if (response.data === true) {
          alert("Emails sent successfully!");
        } else {
          alert("Failed to send emails.");
        }
      })
      .catch(function (error) {
        console.error("Error sending emails:", error);
        alert("An error occurred while sending emails. Please try again.");
      })
      .finally(() => {
        setStatus(false);
      });
  }

  return (
    <div>
      <div className="bg-blue-950 text-center text-white">
        <h1 className="text-2xl px-5 py-5">Bulk Mail</h1>
      </div>
      <div className="bg-blue-800 text-center text-white">
        <h1 className="font-medium px-5 py-5">We can help your business with sending multiple emails at once</h1>
      </div>
      <div className="bg-blue-600 text-center text-white">
        <h1 className="font-medium px-5 py-5">Drag and Drop</h1>
      </div>
      <div className="bg-blue-400 flex flex-col items-center text-black px-5 py-5">
        <textarea
          onChange={handleMsg}
          value={msg}
          className="w-[80%] h-32 py-2 mt-5 outline-none border border-black rounded"
          placeholder="Enter the email text..."
        ></textarea>

        <div>
          <input
            onChange={handleFile}
            className="border-4 border-dashed py-4 px-4 mt-8 mb-8"
            type="file"
            accept=".xls,.xlsx"
          />
        </div>
        <p>Total Email(s) in the file: {emailList.length}</p>
        <button
          onClick={send}
          className="bg-blue-950 py-2 px-2 text-white font-medium rounded mt-3 my-3"
        >
          {status ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default App;
