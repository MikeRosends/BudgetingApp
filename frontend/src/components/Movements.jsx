import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import format from "date-fns/format";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

export default function Movements() {
  const [movementsArr, setMovementsArr] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8181/v1/movements").then((response) => {
      const data = response.data;
      setMovementsArr(data);
    });
  }, []);

  console.log("Movements Array -> ", movementsArr);

  return (
    <div className="flex">
      <Sidebar />
      <div className="w-screen">
        <DataTable value={movementsArr} tableStyle={{ width: "50rem" }}>
          <Column
            field="movement_id"
            header="Movement Id"
            className="text-center"
          ></Column>
          <Column
            field="account_id"
            header="Account Id"
            className="text-center"
          ></Column>
          <Column
            field="movement_date"
            header="Movement Date"
            body={(rowData) => format(rowData.movement_date, "dd-MM-yyyy")}
          ></Column>
          <Column
            field="movement_name"
            header="Movement Name"
            body={(rowData) => (rowData.amount > 0 ? "Deposit" : "Withdrawal")}
          ></Column>
          <Column field="description" header="Description"></Column>
          <Column field="amount" header="Amount"></Column>
        </DataTable>
      </div>
    </div>
  );
}
