import { useState, useEffect } from "react";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import EditDialog from "../DialogBoxes/EditDialog";
import SidebarComponent from "../SidebarComponent/SidebarComponent";
import { Dialog } from "primereact/dialog";

export default function CategoriesEditor() {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [mainCategories, setMainCategories] = useState([]); // For dropdown
  const [selectedMainCategory, setSelectedMainCategory] = useState(null); // Selected main category
  const [subcategories, setSubcategories] = useState([]); // Subcategories to display in table
  const [selectedCategory, setSelectedCategory] = useState(null); // For editing
  const [isEditDialogVisible, setIsEditDialogVisible] = useState(false);
  const [isAddMainCategoryDialogVisible, setIsAddMainCategoryDialogVisible] =
    useState(false); // For Add Main Category Dialog
  const [newMainCategory, setNewMainCategory] = useState(""); // Input for new main category
  const [newSubCategory, setNewSubCategory] = useState(""); // Input for new subcategory
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: "contains" },
  });

  // Fetch main categories on mount
  useEffect(() => {
    fetchMainCategories();
  }, []);

  const fetchMainCategories = async () => {
    try {
      const response = await axios.get(`${apiUrl}/v1/categories/main`);
      setMainCategories(response.data);
    } catch (err) {
      console.error("Error fetching main categories:", err);
    }
  };

  const fetchSubcategories = async (mainCategory) => {
    try {
      const encodedCategory = encodeURIComponent(mainCategory);

      const response = await axios.get(
        `${apiUrl}/v1/categories/subcategories/${encodedCategory}`
      );
      setSubcategories(response.data); // Update subcategories for the selected main category
    } catch (err) {
      console.error("Error fetching subcategories:", err);
    }
  };

  const handleMainCategoryChange = (e) => {
    const selectedCategory = e.value;
    setSelectedMainCategory(selectedCategory);

    if (selectedCategory) {
      fetchSubcategories(selectedCategory); // Fetch subcategories when main category is selected
    } else {
      setSubcategories([]); // Clear subcategories if no main category is selected
    }
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setIsEditDialogVisible(true);
  };

  const handleAddMainCategory = async () => {
    try {
      await axios.post(`${apiUrl}/v1/categories/main`, {
        category: newMainCategory,
        subcategory: newSubCategory, // Include the subcategory name
      });
      setIsAddMainCategoryDialogVisible(false);
      setNewMainCategory(""); // Clear inputs
      setNewSubCategory("");
      fetchMainCategories(); // Refresh the main categories
    } catch (err) {
      console.error("Error adding new main category:", err);
    }
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
        <h2>Categories Editor</h2>
        <div className="flex gap-4">
          <Dropdown
            value={selectedMainCategory}
            options={mainCategories}
            optionLabel="category"
            onChange={handleMainCategoryChange}
            placeholder="Select Main Category"
            style={{ width: "200px" }}
          />
          <div className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder="Global Search"
              style={{ width: "200px" }}
            />
          </div>
          <button
            className="btn-add-main-category"
            onClick={() => setIsAddMainCategoryDialogVisible(true)}
          >
            + Add Main Category
          </button>
        </div>
      </div>
    );
  };

  const actionsTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <button className="btn-edit" onClick={() => handleEdit(rowData)}>
          Edit
        </button>
      </div>
    );
  };

  const header = renderHeader();

  return (
    <div className="maindiv">
      <SidebarComponent />
      <div>
        <DataTable
          value={subcategories}
          paginator
          rows={10}
          dataKey="subcategory_code"
          tableStyle={{ width: "70rem" }}
          globalFilterFields={["subcategory"]}
          filters={filters}
          header={header}
          emptyMessage="No subcategories found."
        >
          <Column field="subcategory" header="Subcategory"></Column>
          <Column header="Actions" body={actionsTemplate}></Column>
        </DataTable>
      </div>

      {/* Edit Dialog */}
      <EditDialog
        visible={isEditDialogVisible}
        category={selectedCategory}
        onHide={() => setIsEditDialogVisible(false)}
        onUpdate={() => {
          if (selectedMainCategory) {
            fetchSubcategories(selectedMainCategory); // Re-fetch subcategories after updating
          }
          setIsEditDialogVisible(false); // Close the dialog
        }}
      />

      {/* Add Main Category Dialog */}
      <Dialog
        visible={isAddMainCategoryDialogVisible}
        onHide={() => setIsAddMainCategoryDialogVisible(false)}
        header="Add Main Category"
      >
        <div className="form-group">
          <label>New Main Category</label>
          <InputText
            value={newMainCategory}
            onChange={(e) => setNewMainCategory(e.target.value)}
            placeholder="Enter main category name"
          />
        </div>
        <div className="form-group">
          <label>Subcategory</label>
          <InputText
            value={newSubCategory}
            onChange={(e) => setNewSubCategory(e.target.value)}
            placeholder="Enter subcategory name"
          />
        </div>
        <div className="dialog-buttons">
          <button
            onClick={() => setIsAddMainCategoryDialogVisible(false)}
            className="cancel-button"
          >
            Cancel
          </button>
          <button onClick={handleAddMainCategory} className="save-button">
            Add
          </button>
        </div>
      </Dialog>
    </div>
  );
}
