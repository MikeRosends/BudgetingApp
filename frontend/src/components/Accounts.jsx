import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import format from 'date-fns/format';
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

export default function Accounts() {
  const [accountsArr, setAccountsArr] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8181/v1/accounts").then((response) => {
      const data = response.data;
      setAccountsArr(data);
    });
  }, []);

  console.log(accountsArr);

  return (
    <div className="flex">
      <Sidebar />
      <div className="w-screen">
        <DataTable value={accountsArr} tableStyle={{ width: "50rem" }}>
          <Column field="account_id" header="Account Id" className="text-center"></Column>
          <Column
            field="account_creation_date"
            header="Created On"
            body={(rowData) => format(rowData.account_creation_date, 'dd-MM-yyyy')}
          ></Column>
          <Column field="account_name" header="Account Name"></Column>
          <Column field="amount" header="Amount"></Column>
        </DataTable>
      </div>
    </div>
  );
}
