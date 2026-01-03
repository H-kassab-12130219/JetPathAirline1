import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../Contexts/AuthContext';
import toast from 'react-hot-toast';
import { API_ENDPOINTS } from '../config/api';
import API_BASE_URL_DEFAULT from '../config/api';
import { getImageUrl } from '../utils/imageHelper';

const Admin = () => {
  const { UserInfo, setUserInfo, setLogoutWindow } = useContext(AuthContext);
  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('flights'); // 'flights', 'messages', or 'users'
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    isAdmin: false
  });
  const [newFlight, setNewFlight] = useState({
    arrivalLocation: '',
    departureLocation: 'Beirut',
    continent: '',
    roundTrip: 'Round Trip',
    price: '',
    imgsrc: '',
    flightType: 'Economy',
    departureDateTime: '',
    arrivalDateTime: '',
    returnDepartureDateTime: '',
    returnArrivalDateTime: '',
    airlineName: '',
    co2ReductionPercent: ''
  });
  const [imageInputType, setImageInputType] = useState('url'); // 'url' or 'file'
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    // Strict admin check - verify from backend
    const verifyAdminAccess = async () => {
      const token = localStorage.getItem('token');
      if (!token || !localStorage.getItem('isLoggedIn')) {
        toast.error('You must be logged in to access the admin panel');
        navigate('/');
        return;
      }

      try {
        // Verify admin status from backend
        const userId = localStorage.getItem('id');
        if (!userId) {
          toast.error('Session expired. Please login again.');
          navigate('/');
          return;
        }

        const response = await fetch(API_ENDPOINTS.GET_USER_BY_ID(userId), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        const userData = await response.json();
        
        if (!userData?.data) {
          toast.error('Unable to verify user. Please login again.');
          navigate('/');
          return;
        }

        // Check admin status from backend response
        if (!userData.data.isAdmin) {
          toast.error('Access denied. Admin privileges required.');
          navigate('/');
          return;
        }

        // User is verified admin, fetch data
        setUserInfo(userData.data);
        fetchFlights();
        fetchMessages();
        fetchUsers();
      } catch (error) {
        console.error('Error verifying admin access:', error);
        toast.error('Error verifying access. Please try again.');
        navigate('/');
      }
    };

    verifyAdminAccess();
  }, [navigate]);

  const fetchFlights = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.ADMIN_GET_FLIGHTS, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setFlights(data);
      } else {
        toast.error('Error fetching flights');
      }
    } catch (error) {
      toast.error('Error fetching flights');
    }
  };

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.GET_ALL_SUPPORT_MESSAGES, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data.data || []);
      } else {
        toast.error('Error fetching messages');
      }
    } catch (error) {
      toast.error('Error fetching messages');
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.ADMIN_GET_ALL_USERS, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.data || []);
      } else {
        toast.error('Error fetching users');
      }
    } catch (error) {
      toast.error('Error fetching users');
    }
  };


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadImage = async () => {
    if (!selectedFile) {
      toast.error('Please select an image file');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await fetch(API_ENDPOINTS.ADMIN_UPLOAD_IMAGE, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const imagePath = API_BASE_URL_DEFAULT + data.data; // Full URL for the image
        setNewFlight({...newFlight, imgsrc: imagePath});
        toast.success('Image uploaded successfully');
        setSelectedFile(null);
        setImagePreview('');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Error uploading image');
      }
    } catch (error) {
      toast.error('Error uploading image');
    }
  };

  const handleAddFlight = async (e) => {
    e.preventDefault();
    
    // If using file upload but image not uploaded yet
    if (imageInputType === 'file' && selectedFile && !newFlight.imgsrc.includes('/uploads/')) {
      toast.error('Please upload the image first');
      return;
    }

    // Validate required numeric fields
    if (!newFlight.price || newFlight.price === '') {
      toast.error('Price is required');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      // Convert price and co2ReductionPercent to numbers before sending
      const flightData = {
        ...newFlight,
        price: Number(newFlight.price),
        co2ReductionPercent: newFlight.co2ReductionPercent === '' ? 0 : Number(newFlight.co2ReductionPercent)
      };
      const response = await fetch(API_ENDPOINTS.ADMIN_ADD_FLIGHT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(flightData),
      });
      if (response.ok) {
        toast.success('Flight added successfully');
        fetchFlights();
        setNewFlight({
          arrivalLocation: '',
          departureLocation: 'Beirut',
          continent: '',
          roundTrip: 'Round Trip',
          price: '',
          imgsrc: '',
          flightType: 'Economy',
          departureDateTime: '',
          arrivalDateTime: '',
          returnDepartureDateTime: '',
          returnArrivalDateTime: '',
          airlineName: '',
          co2ReductionPercent: ''
        });
        setImageInputType('url');
        setSelectedFile(null);
        setImagePreview('');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Error adding flight');
      }
    } catch (error) {
      toast.error('Error adding flight');
    }
  };

  const handleDeleteFlight = async (id) => {
    if (!window.confirm('Are you sure you want to delete this flight?')) {
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.ADMIN_DELETE_FLIGHT(id), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        toast.success('Flight deleted successfully');
        fetchFlights();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Error deleting flight');
      }
    } catch (error) {
      toast.error('Error deleting flight');
    }
  };

  const handleUpdateMessageStatus = async (messageId, status, adminNotes = '') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.UPDATE_SUPPORT_MESSAGE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          messageId,
          status,
          adminNotes
        })
      });
      if (response.ok) {
        toast.success('Message updated successfully');
        fetchMessages();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Error updating message');
      }
    } catch (error) {
      toast.error('Error updating message');
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.DELETE_SUPPORT_MESSAGE(id), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        toast.success('Message deleted successfully');
        fetchMessages();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Error deleting message');
      }
    } catch (error) {
      toast.error('Error deleting message');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return '—';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'in_progress': return 'bg-yellow-500';
      case 'resolved': return 'bg-green-500';
      case 'closed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.ADMIN_CREATE_USER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newUser),
      });
      if (response.ok) {
        toast.success('User created successfully');
        fetchUsers();
        setNewUser({
          email: '',
          password: '',
          firstName: '',
          lastName: '',
          isAdmin: false
        });
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Error creating user');
      }
    } catch (error) {
      toast.error('Error creating user');
    }
  };

  const handleToggleAdmin = async (userId, currentAdminStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.ADMIN_UPDATE_USER_ADMIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId,
          isAdmin: !currentAdminStatus
        })
      });
      if (response.ok) {
        toast.success(`User ${!currentAdminStatus ? 'promoted to' : 'removed from'} admin successfully`);
        fetchUsers();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Error updating user admin status');
      }
    } catch (error) {
      toast.error('Error updating user admin status');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.ADMIN_DELETE_USER(id), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        toast.success('User deleted successfully');
        fetchUsers();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Error deleting user');
      }
    } catch (error) {
      toast.error('Error deleting user');
    }
  };


  // Filter users based on search query
  const filteredUsers = users.filter(user => {
    const query = searchQuery.toLowerCase();
    return (
      user.email?.toLowerCase().includes(query) ||
      user.firstName?.toLowerCase().includes(query) ||
      user.lastName?.toLowerCase().includes(query) ||
      user.username?.toLowerCase().includes(query)
    );
  });

  // Don't render anything until admin status is verified
  // This prevents any UI from showing to non-admins
  if (!localStorage.getItem('isLoggedIn') || !UserInfo?.isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/profile")}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
            >
              My Profile
            </button>
            <button
              onClick={() => setLogoutWindow(true)}
              className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-slate-700">
          <button
            onClick={() => setActiveTab('flights')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'flights'
                ? 'border-b-2 border-red-600 text-red-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Flight Management
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'messages'
                ? 'border-b-2 border-red-600 text-red-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Support Messages ({messages.filter(m => m.status === 'new').length} new)
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'users'
                ? 'border-b-2 border-red-600 text-red-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            User Management ({users.length})
          </button>
        </div>

        {/* Flights Tab */}
        {activeTab === 'flights' && (
          <>
            {/* Add New Flight Form */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-red-400">Add New Flight</h2>
              <form onSubmit={handleAddFlight} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block mb-1 text-sm text-slate-300">Destination *</label>
                  <input
                    type="text"
                    value={newFlight.arrivalLocation}
                    onChange={(e) => setNewFlight({...newFlight, arrivalLocation: e.target.value})}
                    className="w-full p-2 bg-custom-input rounded-lg text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm text-slate-300">Departure Location</label>
                  <input
                    type="text"
                    value={newFlight.departureLocation}
                    onChange={(e) => setNewFlight({...newFlight, departureLocation: e.target.value})}
                    className="w-full p-2 bg-custom-input rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm text-slate-300">Continent *</label>
                  <select
                    value={newFlight.continent}
                    onChange={(e) => setNewFlight({...newFlight, continent: e.target.value})}
                    className="w-full p-2 bg-custom-input rounded-lg text-white"
                    required
                  >
                    <option value="">Select Continent</option>
                    <option value="Asia">Asia</option>
                    <option value="Europe">Europe</option>
                    <option value="Africa">Africa</option>
                    <option value="America">America</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-sm text-slate-300">Price *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newFlight.price}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow empty string, otherwise convert to number
                      setNewFlight({...newFlight, price: value === '' ? '' : Number(value)});
                    }}
                    className="w-full p-2 bg-custom-input rounded-lg text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm text-slate-300">Flight Type</label>
                  <select
                    value={newFlight.flightType}
                    onChange={(e) => setNewFlight({...newFlight, flightType: e.target.value})}
                    className="w-full p-2 bg-custom-input rounded-lg text-white"
                  >
                    <option value="Economy">Economy</option>
                    <option value="Premium">Premium</option>
                    <option value="Business">Business</option>
                    <option value="First">First</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-sm text-slate-300">Airline Name</label>
                  <input
                    type="text"
                    value={newFlight.airlineName}
                    onChange={(e) => setNewFlight({...newFlight, airlineName: e.target.value})}
                    className="w-full p-2 bg-custom-input rounded-lg text-white"
                    placeholder="e.g., JetPath"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm text-slate-300">CO₂ Reduction %</label>
                  <input
                    type="number"
                    value={newFlight.co2ReductionPercent}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow empty string, otherwise convert to number
                      setNewFlight({...newFlight, co2ReductionPercent: value === '' ? '' : Number(value)});
                    }}
                    className="w-full p-2 bg-custom-input rounded-lg text-white"
                    placeholder="e.g., 17"
                  />
                </div>
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block mb-2 text-sm text-slate-300">Image *</label>
                  <div className="flex gap-4 mb-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="imageType"
                        value="url"
                        checked={imageInputType === 'url'}
                        onChange={(e) => {
                          setImageInputType(e.target.value);
                          setSelectedFile(null);
                          setImagePreview('');
                        }}
                        className="w-4 h-4"
                      />
                      <span className="text-slate-300">Enter URL</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="imageType"
                        value="file"
                        checked={imageInputType === 'file'}
                        onChange={(e) => {
                          setImageInputType(e.target.value);
                          setNewFlight({...newFlight, imgsrc: ''});
                        }}
                        className="w-4 h-4"
                      />
                      <span className="text-slate-300">Choose Image</span>
                    </label>
                  </div>
                  
                  {imageInputType === 'url' ? (
                    <input
                      type="text"
                      value={newFlight.imgsrc}
                      onChange={(e) => setNewFlight({...newFlight, imgsrc: e.target.value})}
                      className="w-full p-2 bg-custom-input rounded-lg text-white"
                      placeholder="https://example.com/image.jpg"
                      required
                    />
                  ) : (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="w-full p-2 bg-custom-input rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-700 file:text-white hover:file:bg-red-600 cursor-pointer"
                        />
                        {selectedFile && (
                          <button
                            type="button"
                            onClick={handleUploadImage}
                            className="px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded-lg transition"
                          >
                            Upload
                          </button>
                        )}
                      </div>
                      {imagePreview && (
                        <div className="mt-2">
                          <p className="text-sm text-slate-400 mb-1">Preview:</p>
                          <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg border border-slate-700" />
                        </div>
                      )}
                      {newFlight.imgsrc && newFlight.imgsrc.includes('/uploads/') && (
                        <p className="text-sm text-green-400">✓ Image uploaded successfully</p>
                      )}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block mb-1 text-sm text-slate-300">Departure Date/Time</label>
                  <input
                    type="datetime-local"
                    value={newFlight.departureDateTime}
                    onChange={(e) => setNewFlight({...newFlight, departureDateTime: e.target.value})}
                    className="w-full p-2 bg-custom-input rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm text-slate-300">Arrival Date/Time</label>
                  <input
                    type="datetime-local"
                    value={newFlight.arrivalDateTime}
                    onChange={(e) => setNewFlight({...newFlight, arrivalDateTime: e.target.value})}
                    className="w-full p-2 bg-custom-input rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm text-slate-300">Return Departure Date/Time</label>
                  <input
                    type="datetime-local"
                    value={newFlight.returnDepartureDateTime}
                    onChange={(e) => setNewFlight({...newFlight, returnDepartureDateTime: e.target.value})}
                    className="w-full p-2 bg-custom-input rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm text-slate-300">Return Arrival Date/Time</label>
                  <input
                    type="datetime-local"
                    value={newFlight.returnArrivalDateTime}
                    onChange={(e) => setNewFlight({...newFlight, returnArrivalDateTime: e.target.value})}
                    className="w-full p-2 bg-custom-input rounded-lg text-white"
                  />
                </div>
                <div className="md:col-span-2 lg:col-span-3">
                  <button
                    type="submit"
                    className="w-full bg-red-700 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition"
                  >
                    Add Flight
                  </button>
                </div>
              </form>
            </div>

            {/* Flights List */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-2xl font-semibold mb-4 text-red-400">All Flights ({flights.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {flights.map((flight) => (
                  <div key={flight.id || flight._id} className="border border-slate-800 bg-slate-950/50 p-4 rounded-xl">
                    <img src={getImageUrl(flight.imgsrc)} alt={flight.arrivalLocation} className="w-full h-40 object-cover mb-2 rounded"/>
                    <h3 className="font-semibold text-lg">{flight.arrivalLocation}</h3>
                    <p className="text-sm text-slate-400">Continent: {flight.continent}</p>
                    <p className="text-sm text-slate-400">Price: ${flight.price}</p>
                    {flight.airlineName && <p className="text-sm text-slate-400">Airline: {flight.airlineName}</p>}
                    {flight.co2ReductionPercent > 0 && (
                      <p className="text-sm text-green-400">CO₂: {flight.co2ReductionPercent}% less</p>
                    )}
                    <button
                      onClick={() => handleDeleteFlight(flight.id || flight._id || flight.flightId)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded mt-2 text-sm transition"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-semibold mb-4 text-red-400">Support Messages ({messages.length})</h2>
            <div className="space-y-4">
              {messages.length === 0 ? (
                <p className="text-slate-400 text-center py-8">No messages yet</p>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="border border-slate-800 bg-slate-950/50 p-4 rounded-xl"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold">{msg.email}</p>
                        {msg.phone && <p className="text-sm text-slate-400">Phone: {msg.phone}</p>}
                        {msg.username && <p className="text-sm text-slate-400">User: {msg.username}</p>}
                        <p className="text-xs text-slate-500">{formatDate(msg.createdAt)}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs text-white ${getStatusColor(msg.status)}`}>
                        {msg.status}
                      </span>
                    </div>
                    <p className="text-slate-300 mb-3 whitespace-pre-wrap">{msg.message}</p>
                    {msg.adminNotes && (
                      <div className="bg-slate-800/50 p-2 rounded mb-3">
                        <p className="text-xs text-slate-400 mb-1">Admin Notes:</p>
                        <p className="text-sm text-slate-300">{msg.adminNotes}</p>
                      </div>
                    )}
                    <div className="flex gap-2 flex-wrap">
                      {msg.status !== 'in_progress' && (
                        <button
                          onClick={() => handleUpdateMessageStatus(msg.id, 'in_progress')}
                          className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm transition"
                        >
                          Mark In Progress
                        </button>
                      )}
                      {msg.status !== 'resolved' && (
                        <button
                          onClick={() => handleUpdateMessageStatus(msg.id, 'resolved')}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition"
                        >
                          Mark Resolved
                        </button>
                      )}
                      {msg.status !== 'closed' && (
                        <button
                          onClick={() => handleUpdateMessageStatus(msg.id, 'closed')}
                          className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition"
                        >
                          Close
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <>
            {/* Add New User Form */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-red-400">Add New User</h2>
              <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block mb-1 text-sm text-slate-300">Email *</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    className="w-full p-2 bg-custom-input rounded-lg text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm text-slate-300">Password *</label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    className="w-full p-2 bg-custom-input rounded-lg text-white"
                    required
                    minLength={6}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm text-slate-300">First Name *</label>
                  <input
                    type="text"
                    value={newUser.firstName}
                    onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                    className="w-full p-2 bg-custom-input rounded-lg text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm text-slate-300">Last Name *</label>
                  <input
                    type="text"
                    value={newUser.lastName}
                    onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                    className="w-full p-2 bg-custom-input rounded-lg text-white"
                    required
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isAdmin"
                    checked={newUser.isAdmin}
                    onChange={(e) => setNewUser({...newUser, isAdmin: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <label htmlFor="isAdmin" className="text-sm text-slate-300">Make Admin</label>
                </div>
                <div className="md:col-span-2 lg:col-span-3">
                  <button
                    type="submit"
                    className="w-full bg-red-700 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition"
                  >
                    Add User
                  </button>
                </div>
              </form>
            </div>

            {/* Users List */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-red-400">All Users ({filteredUsers.length})</h2>
                <div className="flex-1 max-w-md ml-4">
                  <input
                    type="text"
                    placeholder="Search users by email, name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-2 bg-custom-input rounded-lg text-white placeholder-slate-400"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-black/30 text-slate-300 text-xs uppercase tracking-[0.2em]">
                    <tr>
                      <th className="px-4 py-3 text-left">Name</th>
                      <th className="px-4 py-3 text-left">Email</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left">JetPoints</th>
                      <th className="px-4 py-3 text-left">Tier</th>
                      <th className="px-4 py-3 text-left">Joined</th>
                      <th className="px-4 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-4 py-8 text-center text-slate-400">
                          {searchQuery ? 'No users found matching your search' : 'No users yet'}
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr key={user.id} className="border-t border-slate-800 hover:bg-slate-800/30">
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-semibold">{user.firstName} {user.lastName}</p>
                              <p className="text-xs text-slate-400">@{user.username}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-300">{user.email}</td>
                          <td className="px-4 py-3">
                            {user.isAdmin ? (
                              <span className="px-2 py-1 rounded-full text-xs bg-red-600 text-white">Admin</span>
                            ) : (
                              <span className="px-2 py-1 rounded-full text-xs bg-slate-700 text-slate-300">User</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-slate-300">
                            {(user.jetPoints || 0).toLocaleString()}
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 rounded-full text-xs bg-slate-700 text-slate-300">
                              {user.tierLevel || 'Silver'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-400 text-xs">
                            {formatDate(user.loyaltyJoinDate || user.createdAt)}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleToggleAdmin(user.id, user.isAdmin)}
                                disabled={parseInt(user.id) === parseInt(UserInfo?.id)}
                                className={`px-3 py-1 rounded text-xs transition ${
                                  user.isAdmin
                                    ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                                    : 'bg-green-600 hover:bg-green-700 text-white'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                                title={parseInt(user.id) === parseInt(UserInfo?.id) ? "Cannot change your own admin status" : ""}
                              >
                                {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                disabled={parseInt(user.id) === parseInt(UserInfo?.id)}
                                className="px-3 py-1 rounded text-xs bg-red-600 hover:bg-red-700 text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                                title={parseInt(user.id) === parseInt(UserInfo?.id) ? "Cannot delete your own account" : ""}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default Admin;
