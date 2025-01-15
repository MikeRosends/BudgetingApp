import { useState, useEffect } from "react";
import NavbarComponent from "../NavbarComponent/NavbarComponent";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import format from "date-fns/format";
import { jwtDecode } from "jwt-decode";
import { InputText } from "primereact/inputtext"; // Import for search input
import EditDialog from "../DialogBoxes/EditDialog";
import DeleteDialog from "../DialogBoxes/DeleteDialog";
import "./Movements.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

export default function Movements() {
  const [movementsArr, setMovementsArr] = useState([]);
  const [selectedMovement, setSelectedMovement] = useState(null);
  const [isEditDialogVisible, setIsEditDialogVisible] = useState(false);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState(""); // Global filter state
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: "contains" },
  });

  const fetchMovements = () => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;

      axios
        .get("http://localhost:8181/v1/movements_with_user_id", {
          params: { user_id: userId },
        })
        .then((response) => {
          setMovementsArr(response.data);
        })
        .catch((err) => {
          console.error("Error fetching movements", err);
        });
    } else {
      console.error("Token not found");
    }
  };

  useEffect(() => {
    fetchMovements(); // Fetch movements when the component mounts
  }, []);

  const handleEdit = (movement) => {
    setSelectedMovement(movement);
    setIsEditDialogVisible(true);
  };

  const handleDelete = (movement) => {
    setSelectedMovement(movement);
    setIsDeleteDialogVisible(true);
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between align-items-center">
        <h2>Movements</h2>
        <div className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Global Search"
            style={{ width: "200px" }}
          />
        </div>
      </div>
    );
  };

  const categoryTemplate = (rowData) => {
    return `${rowData.category || "Unknown"} > ${rowData.subcategory || "N/A"}`;
  };

  const actionsTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <button className="btn-edit" onClick={() => handleEdit(rowData)}>
          Edit
        </button>
        <button className="btn-delete" onClick={() => handleDelete(rowData)}>
          Delete
        </button>
      </div>
    );
  };

  const statusTemplate = (rowData) => {
    return rowData.type === 1 ? (
      <i
        className="pi pi-arrow-up text-green-500"
        style={{ fontSize: "1.5rem" }}
      ></i> // Deposit
    ) : (
      <i
        className="pi pi-arrow-down text-red-500"
        style={{ fontSize: "1.5rem" }}
      ></i> // Expense
    );
  };

  const header = renderHeader(); // Render the header with global search

  return (
    <div className="maindiv">
      <NavbarComponent />
      <div>
        <DataTable
          value={movementsArr}
          paginator
          rows={50}
          dataKey="id"
          tableStyle={{ width: "70rem" }}
          globalFilterFields={[
            "movement_name",
            "description",
            "amount",
            "movement_date",
          ]}
          filters={filters}
          header={header}
        >
          <Column body={statusTemplate} style={{ width: "3rem" }}></Column>
          <Column field="amount" header="Amount"></Column>
          <Column
            field="movement_date"
            header="Movement Date"
            body={(rowData) =>
              format(new Date(rowData.movement_date), "dd-MM-yyyy")
            }
          ></Column>
          <Column field="movement_name" header="Name"></Column>
          <Column field="description" header="Description"></Column>
          <Column header="Category" body={categoryTemplate}></Column>
          <Column header="Actions" body={actionsTemplate}></Column>
        </DataTable>
      </div>

      {/* Edit and Delete Dialogs */}
      <EditDialog
        visible={isEditDialogVisible}
        movement={selectedMovement}
        onHide={() => setIsEditDialogVisible(false)}
        onUpdate={() => {
          fetchMovements(); // Re-fetch movements after updating
          setIsEditDialogVisible(false); // Close the dialog
        }}
      />
      <DeleteDialog
        visible={isDeleteDialogVisible}
        movement={selectedMovement}
        onHide={() => setIsDeleteDialogVisible(false)}
        onDelete={(deletedId) => {
          setMovementsArr((prev) => prev.filter((m) => m.id !== deletedId));
        }}
      />
    </div>
  );
}
