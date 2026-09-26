import { useState, useEffect } from 'react';
import './App.css';

// Initial Dummy Data
const initialEmployees = [
  {
    id: "EMP001",
    name: "Rahul Sharma",
    department: "Engineering",
    gender: "Male",
    phone: "9876543210",
    localAddress: "Sector V, Salt Lake, Kolkata",
    permanentAddress: "MG Road, Pune"
  },
  {
    id: "EMP002",
    name: "Priya Patel",
    department: "HR",
    gender: "Female",
    phone: "8765432109",
    localAddress: "Koramangala, Bengaluru",
    permanentAddress: "Andheri West, Mumbai"
  }
];

export default function App() {
  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem('employeeDataV2');
    return saved ? JSON.parse(saved) : initialEmployees;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    department: "",
    gender: "",
    phone: "",
    localAddress: "",
    permanentAddress: ""
  });
  
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    localStorage.setItem('employeeDataV2', JSON.stringify(employees));
  }, [employees]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      setEmployees(employees.map(emp => emp.id === formData.id ? formData : emp));
      setIsEditing(false);
    } else {
      // Check if ID exists
      if (employees.some(emp => emp.id === formData.id)) {
        alert("Employee ID already exists!");
        return;
      }
      setEmployees([...employees, formData]);
    }
    
    // Reset form
    setFormData({
      id: "", name: "", department: "", gender: "", phone: "", localAddress: "", permanentAddress: ""
    });
  };

  const handleEdit = (emp) => {
    setFormData(emp);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    setEmployees(employees.filter(emp => emp.id !== id));
  };

  // Get unique departments for filter
  const departments = ["All", ...new Set(employees.map(emp => emp.department))];

  // Filter employees
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          emp.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = deptFilter === "All" || emp.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="app-container">
      <header className="header">
        <h1>Employee Directory</h1>
        <div className="stats">
          <span className="count-badge">Total Employees: {filteredEmployees.length}</span>
        </div>
      </header>

      <main className="main-content">
        <section className="form-section">
          <h2>{isEditing ? "Edit Employee" : "Add New Employee"}</h2>
          <form onSubmit={handleSubmit} className="employee-form">
            <div className="form-group">
              <label>Employee ID</label>
              <input type="text" name="id" value={formData.id} onChange={handleInputChange} required disabled={isEditing} />
            </div>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Department</label>
              <input type="text" name="department" value={formData.department} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleInputChange} required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required />
            </div>
            <div className="form-group full-width">
              <label>Local Address</label>
              <textarea name="localAddress" value={formData.localAddress} onChange={handleInputChange} required />
            </div>
            <div className="form-group full-width">
              <label>Permanent Address</label>
              <textarea name="permanentAddress" value={formData.permanentAddress} onChange={handleInputChange} required />
            </div>
            <div className="form-actions full-width">
              <button type="submit" className="btn-primary">{isEditing ? "Update Employee" : "Add Employee"}</button>
              {isEditing && (
                <button type="button" className="btn-secondary" onClick={() => {
                  setIsEditing(false);
                  setFormData({id: "", name: "", department: "", gender: "", phone: "", localAddress: "", permanentAddress: ""});
                }}>Cancel</button>
              )}
            </div>
          </form>
        </section>

        <section className="directory-section">
          <div className="controls">
            <div className="search-box">
              <input 
                type="text" 
                placeholder="Search by Name or ID..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="filter-box">
              <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="employee-list">
            {filteredEmployees.length === 0 ? (
              <div className="no-data">No employees found.</div>
            ) : (
              filteredEmployees.map(emp => (
                <div key={emp.id} className="employee-card">
                  <div className="card-header">
                    <h3>{emp.name}</h3>
                    <span className="badge">{emp.department}</span>
                  </div>
                  <div className="card-body">
                    <p><strong>ID:</strong> {emp.id}</p>
                    <p><strong>Gender:</strong> {emp.gender}</p>
                    <p><strong>Phone:</strong> {emp.phone}</p>
                    <div className="address-block">
                      <p><strong>Local Address:</strong> {emp.localAddress}</p>
                      <p><strong>Permanent Address:</strong> {emp.permanentAddress}</p>
                    </div>
                  </div>
                  <div className="card-actions">
                    <button onClick={() => handleEdit(emp)} className="btn-edit">Edit</button>
                    <button onClick={() => handleDelete(emp.id)} className="btn-delete">Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
