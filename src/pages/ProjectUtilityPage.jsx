import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

// !!! IMPORTANT: Please VERIFY these import paths based on your EXACT file structure.
// If ProjectUtilityPage.js is in 'src/pages/', and Sidebar/Alert are in 'src/components/', these paths are correct:
import Sidebar from '../components/Sidebar';
import Alert from '../components/Alert';
// If your structure is different (e.g., ProjectUtilityPage is in 'src/views/projects/',
// or Sidebar/Alert are in 'src/shared/components/'), you MUST adjust these paths.
// Example for a different structure:
// import Sidebar from '../../shared/components/Sidebar';
// import Alert from '../../shared/components/Alert';


const ProjectUtilityPage = () => {
  const { orgId, projectId } = useParams();
  const navigate = useNavigate();
  const [utilityItems, setUtilityItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [itemName, setItemName] = useState('');
  const [itemValue, setItemValue] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [currentProject, setCurrentProject] = useState(null);
  const [currentOrg, setCurrentOrg] = useState(null);

  // Fetch utility items, project, AND organization details
  useEffect(() => {
    const fetchUtilityData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const config = { headers: { Authorization: `Bearer ${token}` } };

        // Fetch project details
        const projectRes = await axios.get(`http://localhost:5000/api/projects/single/${projectId}`, config);
        setCurrentProject(projectRes.data.data);

        // Fetch organization details
        const orgRes = await axios.get(`http://localhost:5000/api/orgs/${orgId}`, config);
        setCurrentOrg(orgRes.data.data);

        // Fetch utility items for this project
        const itemsRes = await axios.get(`http://localhost:5000/api/utility-items/project/${projectId}`, config);
        setUtilityItems(itemsRes.data.data);

      } catch (err) {
        console.error('Failed to fetch utility data:', err);
        setError(err.response?.data?.error || 'Failed to load utility items.');
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUtilityData();
  }, [projectId, orgId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!itemName.trim() || !itemValue.trim()) {
      setError('Name and Value cannot be empty.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (editingItem) {
        // Update existing item
        const res = await axios.put(
          `http://localhost:5000/api/utility-items/${editingItem._id}`,
          { name: itemName, value: itemValue },
          config
        );
        setUtilityItems(
          utilityItems.map((item) =>
            item._id === editingItem._id ? res.data.data : item
          )
        );
        setEditingItem(null);
      } else {
        // Create new item
        const res = await axios.post(
          'http://localhost:5000/api/utility-items',
          { name: itemName, value: itemValue, project: projectId },
          config
        );
        setUtilityItems([...utilityItems, res.data.data]);
      }
      setItemName('');
      setItemValue('');
      setError(''); // Clear error on success
    } catch (err) {
      console.error('Failed to save utility item:', err);
      setError(err.response?.data?.error || 'Failed to save utility item.');
    }
  };

  const handleDelete = async (id) => {
    // IMPORTANT: Replace window.confirm with a custom modal/dialog component for better UX
    // and to avoid blocking the UI in an iframe environment.
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.delete(`http://localhost:5000/api/utility-items/${id}`, config);
        setUtilityItems(utilityItems.filter((item) => item._id !== id));
        setError(''); // Clear error on success
      } catch (err) {
        console.error('Failed to delete utility item:', err);
        setError(err.response?.data?.error || 'Failed to delete utility item.');
      }
    }
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    setItemName(item.name);
    setItemValue(item.value);
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setItemName('');
    setItemValue('');
    setError(''); // Clear error on cancel
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar user={currentOrg} activePage="utility" />
        <div className="flex-1 flex justify-center items-center p-8">
          <p className="text-gray-700 text-lg">Loading project utility data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={currentOrg} activePage="utility" />
      <div className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full ml-0 md:ml-64">
        {/* Page Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-6 ">
          Utility Links & Info for {currentProject?.name || 'Project'}
        </h1>

        {/* Alert for errors */}
        {error && <Alert message={error} type="error" />}

        {/* Form to Add/Edit Utility Item */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {editingItem ? 'Edit Utility Item' : 'Add New Utility Item'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Name (e.g., Figma Link, Admin Password)"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800"
              aria-label="Item Name"
            />
            <input
              type="text"
              placeholder="Value (e.g., https://figma.com/file/..., MySecretPa$$w0rd)"
              value={itemValue}
              onChange={(e) => setItemValue(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800"
              aria-label="Item Value"
            />
            <div className="flex space-x-3">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md shadow-sm
                           hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                           transition duration-150 ease-in-out"
              >
                {editingItem ? 'Update Item' : 'Add Item'}
              </button>
              {editingItem && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-6 py-2 bg-gray-500 text-white font-medium rounded-md shadow-sm
                             hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
                             transition duration-150 ease-in-out"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Utility Items Table */}
        <div className="overflow-x-auto rounded-lg shadow-md bg-white border border-gray-200">
          {utilityItems.length === 0 ? (
            <div className="text-center p-8 text-gray-600">
              <p className="text-lg">No utility items added for this project yet.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Value</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-36">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {utilityItems.map((item) => (
                  <tr key={item._id} className="hover:bg-blue-50 transition duration-200 ease-in-out">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 break-words">
                      {item.value.startsWith('http://') || item.value.startsWith('https://') ? (
                        <a href={item.value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {item.value}
                        </a>
                      ) : (
                        item.value
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditClick(item)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                        aria-label={`Edit ${item.name}`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600 hover:text-red-900"
                        aria-label={`Delete ${item.name}`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectUtilityPage;
