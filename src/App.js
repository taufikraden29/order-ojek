import React, { useEffect, useState } from "react";
import axios from "axios";

const SPREADSHEET_ID = "1lWlyWBhlDfhap5SUKiMX3tpUV5El8OW7C_24G6qUTkM";
const API_KEY = "AIzaSyAy-dn0VHoj-YUGQj-QIXvoBKobMP3TrgQ";
const SHEET_NAME = "Sheet1";
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxtqSrqENC0ho-OcE20E2yCbuNKBNDLDRDxiNZ7JS9RrtimB5kCcRoZm9EItW6TSGeV/exec";

const App = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`;
    try {
      const response = await axios.get(url);
      const rows = response.data.values.slice(1); // Ambil data tanpa header
      const filteredData = rows.filter(row => row[4] !== "0"); // Hanya tampilkan data dengan status "1"
      setData(filteredData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const updateStatus = async (index) => {
    const rowIndex = index + 2; // Baris di Spreadsheet dimulai dari 2 (1 = header)
    try {
      const response = await axios.get(`${SCRIPT_URL}?rowIndex=${rowIndex}`);
      if (response.data.success) {
        fetchData(); // Perbarui data tanpa reload
      } else {
        console.error("Gagal memperbarui status:", response.data.error);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleConfirm = (index, phone, name, location) => {
    updateStatus(index);
    const message = encodeURIComponent(`Halo ${name}, lokasi: ${location}`);
    window.open(`https://wa.me/6282315590001?text=${message}`, "_blank");
  };


  return (
    <div>
      <h1 className="text-center font-bold">Orderan Masuk Bos!</h1>
      <table border="1">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama</th>
            <th>Nomor HP</th>
            <th>Lokasi</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data
            .filter(row => row[4] !== "0") // Hanya tampilkan status ≠ 0
            .map((row, index) => (
              <tr key={index}>
                <td>{row[0]}</td>
                <td>{row[1]}</td>
                <td>{row[2]}</td>
                <td>
                  <a href={row[3]} target="_blank" rel="noopener noreferrer">
                    Lihat Peta
                  </a>
                </td>
                <td>{row[4] === "1" ? "✔️" : "❌"}</td>
                <td>
                  <button onClick={() => handleConfirm(index, row[2], row[1], row[3])}>
                    Confirm
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
