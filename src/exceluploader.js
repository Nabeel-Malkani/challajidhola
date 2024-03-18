import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ExcelUploader() {
  const [excelData, setExcelData] = useState([]);
  const [editedData, setEditedData] = useState([]);
  const [editableCell, setEditableCell] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileType = file.name.split('.').pop().toLowerCase();
    if (fileType !== 'xlsx' && fileType !== 'xls') {
      e.target.value = null;
      return toast.error('Only Excel files are allowed!');
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const workbook = XLSX.read(event.target.result, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      setExcelData(data);
      setEditedData(data.map((row) => row.slice()));
      toast.success('Excel file uploaded successfully!');
    };

    reader.readAsBinaryString(file);
  };

  const handleCellEdit = (e, rowIndex, cellIndex) => {
    const newData = [...editedData];
    newData[rowIndex][cellIndex] = e.target.innerText;
    setEditedData(newData);
  };

  const saveEditedData = () => {
    setExcelData(editedData);
    setEditableCell(null);
  };

  return (
    <div className="container">
      <input style={{marginBottom: '15px'}} type="file" onChange={handleFileUpload} />
      <table className="table">
        <thead>
          <tr>
            {excelData.length > 0 &&
              excelData[0].map((cell, index) => (
                <th key={index}>
                  {cell}
                </th>
              ))}
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {excelData.slice(1).map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  contentEditable={editableCell === `${rowIndex}-${cellIndex}`}
                  onBlur={(e) => handleCellEdit(e, rowIndex, cellIndex)}
                  onFocus={() => setEditableCell(`${rowIndex}-${cellIndex}`)}
                  suppressContentEditableWarning={true} // Suppresses contentEditable warning
                >
                  {cell}
                </td>
              ))}
              <td>
                {editableCell && (
                  <button onClick={saveEditedData}>Save</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
}

export default ExcelUploader;
