import { useState, useEffect } from "react";
import { inventoryAPI } from "../../services/api";
import Breadcrumb from "../../components/breadcrums";
import Header from "../../layouts/header";
import Sidemenu from "../../layouts/sidemenu";
import { Button } from "@mui/material";
import swal from "sweetalert";

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  stock: number;
  createdAt?: string;
}

const Add_Inventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newItem, setNewItem] = useState<Omit<InventoryItem, 'id'>>({
    name: "",
    category: "",
    stock: 0,
  });

  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [additionalStock, setAdditionalStock] = useState<number>(0);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      console.log('📦 Fetching inventory...');
      const response = await inventoryAPI.getAll();
      console.log('📦 Inventory fetched:', response.data);
      setInventory(response.data || []);
    } catch (error) {
      console.error('❌ Error fetching inventory:', error);
      setInventory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.category || newItem.stock < 0) {
      swal("Missing Fields", "Please fill in all fields with valid data.", "warning");
      return;
    }

    try {
      setLoading(true);
      console.log('📦 Adding inventory item:', newItem);
      
      const response = await inventoryAPI.create(newItem);
      console.log('📦 Add response:', response.data);
      
      if (response.data.success) {
        setShowForm(false);
        setNewItem({ name: "", category: "", stock: 0 });
        
        // Add the new item to the current inventory list immediately
        const newInventoryItem = response.data.item;
        setInventory(prevInventory => [newInventoryItem, ...prevInventory]);
        
        swal("Success!", "Inventory item added successfully and displayed in table.", "success");
      } else {
        swal("Error!", response.data.error || "Failed to add inventory item.", "error");
      }
    } catch (error: any) {
      console.error('❌ Error adding inventory item:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Network error occurred';
      swal("Error!", "Failed to add inventory item: " + errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddStock = async () => {
    if (!selectedItem || additionalStock <= 0) {
      swal("Error", "Please enter a valid stock quantity.", "error");
      return;
    }

    try {
      setLoading(true);
      console.log(`📦 Adding ${additionalStock} stock to item ${selectedItem.id}`);
      
      const response = await inventoryAPI.updateStock(selectedItem.id, additionalStock);
      console.log('📦 Stock update response:', response.data);
      
      if (response.data.success) {
        setShowAddStockModal(false);
        setAdditionalStock(0);
        setSelectedItem(null);
        
        // Update the inventory list immediately
        setInventory(prevInventory => 
          prevInventory.map(item => 
            item.id === selectedItem.id 
              ? { ...item, stock: item.stock + additionalStock }
              : item
          )
        );
        
        swal("Success!", "Stock added successfully and updated in table.", "success");
      } else {
        swal("Error!", response.data.error || "Failed to update stock.", "error");
      }
    } catch (error: any) {
      console.error('❌ Error updating stock:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Network error occurred';
      swal("Error!", "Failed to update stock: " + errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const getStockStatusColor = (stock: number) => {
    if (stock <= 10) return 'text-red-600 font-bold';
    if (stock <= 25) return 'text-yellow-600 font-semibold';
    return 'text-green-600';
  };

  const getStockStatusText = (stock: number) => {
    if (stock <= 10) return `${stock} (Low Stock!)`;
    if (stock <= 25) return `${stock} (Medium)`;
    return `${stock} (Good)`;
  };

  return (
    <>
      <Header />
      <Sidemenu />
      <div className="main-content app-content">
        <div className="container-fluid">
          <Breadcrumb
            title="Inventory Management"
            links={[{ text: "Inventory", link: "/inventory" }]}
            active="Inventory Status"
            buttons={
              <div className="">
                
              </div>
            }
          />

          <div className="p-4 border rounded-lg shadow-sm bg-white">
            <div className="flex justify-between mb-4">
              <h1 className="text-xl font-semibold">Current Inventory ({inventory.length} items)</h1>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => setShowForm(true)}
                disabled={loading}
              >
                + Add Item
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-4">🔄 Loading inventory...</div>
            ) : inventory.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                📦 No inventory items found. Add your first item!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-300">
                  <thead>
                    <tr className="bg-gray-200 text-left">
                      <th className="p-3 border border-gray-300">#</th>
                      <th className="p-3 border border-gray-300">Item Name</th>
                      <th className="p-3 border border-gray-300">Category</th>
                      <th className="p-3 border border-gray-300">Stock Status</th>
                      <th className="p-3 border border-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.map((item, index) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="p-3 border border-gray-300">{index + 1}</td>
                        <td className="p-3 border border-gray-300 font-medium">{item.name}</td>
                        <td className="p-3 border border-gray-300">
                          <span className={`px-2 py-1 rounded text-sm ${
                            item.category === 'Medicine' ? 'bg-blue-100 text-blue-800' :
                            item.category === 'Supply' ? 'bg-green-100 text-green-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {item.category}
                          </span>
                        </td>
                        <td className={`p-3 border border-gray-300 ${getStockStatusColor(item.stock)}`}>
                          {getStockStatusText(item.stock)}
                        </td>
                        <td className="p-3 border border-gray-300">
                          <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            onClick={() => {
                              setSelectedItem(item);
                              setShowAddStockModal(true);
                            }}
                            disabled={loading}
                          >
                            Add Stock
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Add Item Modal */}
          {showForm && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-lg shadow-md w-96">
                <h2 className="text-lg font-semibold mb-4 text-center">Add New Inventory Item</h2>

                <label className="block mb-3">
                  <span className="font-medium">Category:</span>
                  <select
                    className="w-full p-2 border rounded mt-1"
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  >
                    <option value="">Select a category</option>
                    <option value="Medicine">Medicine</option>
                    <option value="Supply">Supply</option>
                    <option value="Equipment">Equipment</option>
                  </select>
                </label>

                <label className="block mb-3">
                  <span className="font-medium">Item Name:</span>
                  <input
                    type="text"
                    className="w-full p-2 border rounded mt-1"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    placeholder="Enter item name"
                  />
                </label>

                <label className="block mb-4">
                  <span className="font-medium">Initial Stock:</span>
                  <input
                    type="number"
                    min="0"
                    className="w-full p-2 border rounded mt-1"
                    value={newItem.stock}
                    onChange={(e) => setNewItem({ ...newItem, stock: parseInt(e.target.value) || 0 })}
                    placeholder="Enter stock quantity"
                  />
                </label>

                <div className="flex justify-end gap-3">
                  <Button 
                    variant="contained" 
                    color="inherit" 
                    onClick={() => setShowForm(false)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddItem}
                    disabled={loading}
                  >
                    {loading ? 'Adding...' : 'Add Item'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Add Stock Modal */}
          {showAddStockModal && selectedItem && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-lg font-bold mb-4">Add Stock</h2>
                <div className="mb-3">
                  <p><strong>Item:</strong> {selectedItem.name}</p>
                  <p><strong>Category:</strong> {selectedItem.category}</p>
                  <p><strong>Current Stock:</strong> <span className={getStockStatusColor(selectedItem.stock)}>{selectedItem.stock}</span></p>
                </div>

                <label className="block mb-4">
                  <span className="font-medium">Add Quantity:</span>
                  <input
                    type="number"
                    min="1"
                    className="w-full p-2 border rounded mt-1"
                    value={additionalStock}
                    onChange={(e) => setAdditionalStock(parseInt(e.target.value) || 0)}
                    placeholder="Enter quantity to add"
                  />
                </label>

                {additionalStock > 0 && (
                  <div className="mb-4 p-2 bg-blue-50 rounded">
                    <p className="text-sm text-blue-800">
                      <strong>New Total:</strong> {selectedItem.stock + additionalStock}
                    </p>
                  </div>
                )}

                <div className="flex justify-end gap-3">
                  <Button 
                    variant="contained" 
                    color="inherit" 
                    onClick={() => setShowAddStockModal(false)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddStock}
                    disabled={loading || additionalStock <= 0}
                  >
                    {loading ? 'Adding...' : 'Add Stock'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Add_Inventory;