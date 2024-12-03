import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import format from "date-fns/format";
import { jwtDecode } from "jwt-decode";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

export default function Movements() {
  const [movementsArr, setMovementsArr] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;

      axios
        .get("http://localhost:8181/v1/movements_with_user_id", {
          params: { user_id: userId },
        })
        .then((response) => {
          const data = response.data;
          console.log(data);

          setMovementsArr(data);
        })
        .catch((err) => {
          console.error("Error fetching movements", err);
        });
    } else {
      console.error("Token not found");
    }
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="w-screen">
        <DataTable value={movementsArr} tableStyle={{ width: "50rem" }}>
          <Column field="amount" header="Amount"></Column>
          <Column
            field="movement_date"
            header="Movement Date"
            body={(rowData) => format(rowData.movement_date, "dd-MM-yyyy")}
          ></Column>
          <Column field="movement_name" header="Name"></Column>
          <Column
            field="movement_type_name"
            header="Movement Type"
            body={(rowData) => {
              console.log(rowData.movement_type_name);
              
              return rowData.movement_type_name === 'withdrawal' ? '🔻' : "🔼";
            }}
          ></Column>
          <Column
            field="description"
            header="Description"
            body={(rowData) => {
              return rowData.length > 0 ? rowData : "N/A";
            }}
          ></Column>
        </DataTable>
      </div>
    </div>
  );
}
