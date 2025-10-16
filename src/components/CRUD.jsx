import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export const CRUD = () => {
  const BASE_URL =
    "https://crudcrud.com/api/f35dbb29bb5044c1898d306d99e2c3c9/employees";

  // State for employee list
  const [employeeList, setEmployeeList] = useState([]);
  // State for form inputs
  const [empObject, setEmpObject] = useState({
    employeeName: "",
    employeeEmail: "",
    employeePhone: "",
    employeeDepartment: "",
    employeeRole: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  // Fetch all employees
  const getEmployeeData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(BASE_URL);
      setEmployeeList(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEmployeeData();
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    setEmpObject({ ...empObject, [e.target.name]: e.target.value });
  };

  // Add or Update employee
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${BASE_URL}/${editId}`, empObject);
        Swal.fire("Updated!", "Employee details updated!", "success");
      } else {
        await axios.post(BASE_URL, empObject);
        Swal.fire("Added!", "New Employee added successfully!", "success");
      }
      setEmpObject({
        employeeName: "",
        employeeEmail: "",
        employeePhone: "",
        employeeDepartment: "",
        employeeRole: "",
      });
      setIsModalOpen(false);
      setEditId(null);
      getEmployeeData();
    } catch (error) {
      Swal.fire("Error", "Something went wrong!", "error");
    }
  };

  // Delete employee
  const deleteEmployee = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This employee will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      await axios.delete(`${BASE_URL}/${id}`);
      Swal.fire("Deleted!", "Employee removed successfully!", "success");
      getEmployeeData();
    }
  };

  // Edit employee
  const editEmployee = (emp) => {
    setEmpObject(emp);
    setEditId(emp._id);
    setIsModalOpen(true);
  };

  // Filter employee list based on search
  const filteredList = employeeList.filter(
    (emp) =>
      emp.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeDepartment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center p-6 relative text-white"
      style={{
        backgroundImage: `url('https://images.pexels.com/photos/30572289/pexels-photo-30572289.jpeg')`,
      }}
    >
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0"></div>

      {/* Header */}
      <header className="relative z-10 text-center mb-10">
        <h1 className="text-5xl font-extrabold tracking-wide text-emerald-300 drop-shadow-lg mb-2">
          Employee Manager
        </h1>
        <p className="text-gray-300 text-lg">Manage your team efficiently</p>
      </header>

      {/* Search and Add Button */}
      <div className="relative z-10 flex flex-col sm:flex-row justify-between items-center w-full max-w-4xl mb-10 gap-4">
        <input
          type="text"
          placeholder="Search employee by name or department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-2/3 bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all duration-300"
        />
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl shadow-lg text-white font-semibold transform hover:scale-105 transition-all duration-300"
        >
          + Add Employee
        </button>
      </div>

      {/* Employee Cards */}
      <div className="relative z-10 w-full max-w-6xl">
        {loading ? (
          <div className="text-center text-gray-300 mt-10 text-lg">Loading...</div>
        ) : filteredList.length === 0 ? (
          <div className="text-center text-gray-400 mt-10 text-lg">No employees found</div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredList.map((emp) => (
              <div
                key={emp._id}
                className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-xl hover:shadow-emerald-400/30 hover:scale-105 transform transition-all duration-300"
              >
                <h2 className="text-2xl font-semibold text-emerald-300 mb-1">
                  {emp.employeeName}
                </h2>
                <p className="text-gray-200 font-medium mb-1">Email : {emp.employeeEmail}</p>
                <p className="text-gray-200 font-medium mb-1">Phone No : {emp.employeePhone}</p>
                <p className="text-gray-200 font-medium mb-1">Department : {emp.employeeDepartment}</p>
                <p className="text-gray-200 font-medium mb-1">Role :{emp.employeeRole}</p>

                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => editEmployee(emp)}
                    className="bg-yellow-400 text-black font-medium px-4 py-2 rounded-xl hover:bg-yellow-500 transition-all duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteEmployee(emp._id)}
                    className="bg-red-500 text-white font-medium px-4 py-2 rounded-xl hover:bg-red-600 transition-all duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white/10 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-md space-y-4 border border-white/20 text-white"
          >
            <h2 className="text-2xl font-bold text-emerald-300 text-center">
              {editId ? "Edit Employee" : "Add New Employee"}
            </h2>

            {/* Input Fields */}
            <input
              type="text"
              name="employeeName"
              placeholder="Name"
              value={empObject.employeeName}
              onChange={handleChange}
              className="w-full p-3 bg-transparent border border-white/30 rounded-xl placeholder-gray-400 text-white focus:ring-2 focus:ring-emerald-400 outline-none transition"
              required
            />
            <input
              type="email"
              name="employeeEmail"
              placeholder="Email"
              value={empObject.employeeEmail}
              onChange={handleChange}
              className="w-full p-3 bg-transparent border border-white/30 rounded-xl placeholder-gray-400 text-white focus:ring-2 focus:ring-emerald-400 outline-none transition"
              required
            />
            <input
              type="text"
              name="employeePhone"
              placeholder="Phone"
              value={empObject.employeePhone}
              onChange={handleChange}
              className="w-full p-3 bg-transparent border border-white/30 rounded-xl placeholder-gray-400 text-white focus:ring-2 focus:ring-emerald-400 outline-none transition"
              required
            />
            <input
              type="text"
              name="employeeDepartment"
              placeholder="Department"
              value={empObject.employeeDepartment}
              onChange={handleChange}
              className="w-full p-3 bg-transparent border border-white/30 rounded-xl placeholder-gray-400 text-white focus:ring-2 focus:ring-emerald-400 outline-none transition"
              required
            />
            <input
              type="text"
              name="employeeRole"
              placeholder="Role"
              value={empObject.employeeRole}
              onChange={handleChange}
              className="w-full p-3 bg-transparent border border-white/30 rounded-xl placeholder-gray-400 text-white focus:ring-2 focus:ring-emerald-400 outline-none transition"
              required
            />

            {/* Buttons */}
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditId(null);
                }}
                className="bg-gray-400/80 text-white px-6 py-2 rounded-xl hover:bg-gray-500 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-emerald-400 text-black font-semibold px-6 py-2 rounded-xl hover:bg-emerald-500 transition-all"
              >
                {editId ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );

};








// const BASE_URL = "https://crudcrud.com/api/b7b97d4bf43c4a09a8b0f86038f8b0ee/employees";