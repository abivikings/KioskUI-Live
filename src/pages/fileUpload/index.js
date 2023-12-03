import React, { useEffect, useState } from 'react'
import { useAuth } from 'src/hooks/useAuth'

export default function CSVtoJSONConverter() {
  const [jsonData, setJsonData] = useState(null)

  const handleFileUpload = async event => {
    const file = event.target.files[0]
    const reader = new FileReader()

    reader.onload = async event => {
      const csv = event.target.result
      const lines = csv.split('\n')
      const headers = lines[0].split(',')

      const jsonArray = []

      for (let i = 1; i < lines.length; i++) {
        const currentLine = lines[i].split(',')
        if (currentLine.length === headers.length) {
          let obj = {}
          for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentLine[j]
          }
          jsonArray.push(obj)
        }
      }

      setJsonData(jsonArray)
    }

    reader.readAsText(file)
  }
  const auth = useAuth()
  const entryPerson = !!auth?.user ? auth?.user.userId : 'unauthorizedEntry'

  useEffect( () => {
    bulkData();
}, [jsonData])

const bulkData = async () => {
    if (jsonData) {
      const jData = jsonData.map(row => {
        console.log(row)
        const cleanedRow = {};
        Object.keys(row).forEach((key) => {
            const cleanedKey = key.trim(); // Remove leading/trailing whitespace
            let cleanedValue = row[key].replace(/\r/g, '');
            cleanedRow[cleanedKey] = cleanedValue;
        });
        
        console.log(cleanedRow);
        const { username, password, userrole, email, MemberId, fullname, Grade, Class } = cleanedRow
        
        return {
          username,
          password,
          userrole,
          EntryBy: entryPerson,
          email,
          MemberId,
          UserProfiles: {
            fullname,
            EntryBy: entryPerson,
            Grade,
            Class
          }
        }
      })
      console.log('CSV to JSON --> ', jData)

      const my_url = `${process.env.NEXT_PUBLIC_BASE_URL}api/BulkUserAdd` 

      const myHeaders = new Headers()
      myHeaders.append('Content-Type', 'application/json')

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(jData),
        redirect: 'follow'
      }
  
      console.log(requestOptions)

      const res = await fetch(my_url, requestOptions)
    const data = await res.json()
    if (res.ok) {

        // dispatch(usersList(userDispatch))
        
        console.log(" Success => ", data)
        alert("Success")

      return { ok: true, data }
    } else {
      console.log('ERROR => ', data.error)

      return { ok: false, err: res, data }
    }
    }
    
}
  // Function to download JSON file
  //   const downloadJSON = () => {
  //     if (jsonData) {
  //       const fileName = 'converted_data.json';
  //       const jsonStr = JSON.stringify(jsonData, null, 2);
  //       const blob = new Blob([jsonStr], { type: 'application/json' });
  //       const url = URL.createObjectURL(blob);

  //       const link = document.createElement('a');
  //       link.href = url;
  //       link.download = fileName;
  //       link.click();

  //       URL.revokeObjectURL(url);
  //     }
  //   };

  return (
    <div>
      <input type='file' accept='.csv' onChange={handleFileUpload} />
      {/* <button onClick={downloadJSON}>Download JSON</button> */}

      {jsonData && (
        <table>
          <thead>
            <tr>
              {Object.keys(jsonData[0]).map(key => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {jsonData.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, idx) => (
                  <td key={idx}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
