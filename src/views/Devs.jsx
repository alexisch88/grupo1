import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Devs = () => {
  const [userData, setUserData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      // Si no está autenticado, redirigir a la página de inicio
      navigate("/");
    } else {
      // Si está autenticado, cargar datos de los usuarios registrados
      fetchUserData();
    }
  }, [navigate]);

  const fetchUserData = async () => {
    try {
      const response = await fetch("http://localhost:8000/auth/get_user_data", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      } else {
        // Mostrar notificación de error al obtener datos de usuario
        toast.error("Error al obtener datos de usuario.");
        console.log("Error al obtener datos de usuario:", response.statusText);
      }
    } catch (error) {
      // Mostrar notificación de error al realizar la solicitud
      toast.error("Error al realizar la solicitud al servidor.");
      console.error("Error al realizar la solicitud:", error);
    }
  };

  const handleEditUser = (user) => {
    // Lógica para editar usuario, por ejemplo, redirigir a una página de edición
    navigate(`/edit-user/${user.username}`);
  };

  const handleDeleteUser = (user) => {
    // Lógica para eliminar usuario, por ejemplo, mostrar un cuadro de diálogo de confirmación
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este usuario?");
    if (confirmDelete) {
      // Lógica para eliminar el usuario, como hacer una solicitud DELETE al servidor
      console.log(`Eliminar usuario con ID: ${user.username}`);

      // Mostrar notificación de éxito al eliminar usuario
      toast.success("Usuario eliminado exitosamente.");
    }
  };

  return (
    // bg-gradient-to-br from-blue-500 to-blue-700 min-h-screen flex  justify-center
    <div className=" bg-slate-900 min-h-screen mx-auto flex flex-col mt-auto">
      <h1 className=" text-5xl font-mono text-gray-100 mb-8 text-center mt-11">Usuarios Registrados</h1>
      <table className=" m-12 bg-slate-500 border-slate-900 ">
        <thead >
          <tr>
            <th className="border border-slate-900 p-2 text-gray-900">ID</th>
            <th className="border border-slate-900 p-2 text-gray-900">Nombre de Usuario</th>
            <th className="border border-slate-900 p-2 text-gray-900">Email</th>
            <th className="border border-slate-900 p-2 text-gray-900">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {userData.map((user) => (
            <tr key={user.username}>
              <td className="border border-slate-900 p-3 font-semibold">{user.id}</td>
              <td className="border border-slate-700 p-3 font-semibold">{user.username}</td>
              <td className="border border-slate-700 p-3 font-semibold">{user.email}</td>
              <td className="border border-slate-700">
                {/* Botones para editar y eliminar usuarios */}
                <button
                  className="font-semibold bg-blue-600  hover:bg-blue-900 text-white py-2 px-2 mr-1 pd-2 rounded-xl "
                  onClick={() => handleEditUser(user.username)}
                >
                  <i className="fas fa-edit"> Editar</i> 
                </button>
                <button
                  className="font-semibold bg-red-600  hover:bg-red-900 text-white py-2 px-2 rounded-xl"
                  onClick={() => handleDeleteUser(user.username)}
                >
                  <i className="fas fa-trash"> Eliminar</i> 
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
};

export default Devs;


