import { useState, useEffect } from "react";
import NavbarComponent from "../components/NavbarComponent/NavbarComponent";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import format from "date-fns/format";
import { jwtDecode } from 'jwt-decode';
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

export default function Accounts() {
  const [accountsArr, setAccountsArr] = useState([]);

  useEffect(() => {
    // Get the token from localStorage
    const token = localStorage.getItem("token");

    if (token) {
      // Decode the token to get the user ID
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id; // Assuming 'id' is the key for user ID in the token payload

      // Send the user_id as a query parameter in the Axios request
      axios
        .get("http://localhost:8181/v1/account_with_userid", {
          params: { user_id: userId }, // Pass user_id as a query parameter
        })
        .then((response) => {
          const data = response.data;
          console.log('DATA -> ', data);
          
          setAccountsArr(data);
        })
        .catch((error) => {
          console.error("Error fetching accounts:", error);
        });
    } else {
      console.error("Token not found in localStorage");
    }
  }, []);

  const allowEdit = (rowData) => {
    return rowData.name !== 'Blue Band';
};

  return (
    <div className="flex">
      <NavbarComponent />
      <div className="w-screen">
        <DataTable value={accountsArr} tableStyle={{ width: "50rem" }}>
          <Column
            field="account_creation_date"
            header="Created On"
            body={(rowData) =>
              format(rowData.account_creation_date, "dd-MM-yyyy")
            }
          ></Column>
          <Column field="account_name" header="Account Name"></Column>
          <Column field="amount" header="Amount"></Column>
          <Column rowEditor={allowEdit} headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
        </DataTable>
      </div>
    </div>
  );
}
