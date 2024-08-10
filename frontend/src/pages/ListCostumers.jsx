import { useContext, useState, useEffect, Fragment, useRef } from "react"
import { Link } from "react-router-dom";
import LoginForm from "../utils/forms/LoginForm";

import AuthContext from "../context/AuthContext"
import CustomerContext from "../context/CustomerContext";

import Modal from "../utils/Modal";
import Avatar from 'react-avatar';
import Navbar from "../utils/Navbar";
import CreateCustomerForm from "../utils/forms/CreateCustomerForm";
import UpdateCustomerForm from "../utils/forms/UpdateCustomerForm";

import { FaCirclePlus, FaTrash } from "react-icons/fa6";
import { FaUserEdit } from "react-icons/fa"
import { IoIosSearch } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";


function ListCustomersPage() {

    const { user } = useContext(AuthContext)
    const { Customer, createCustomer, updateCustomer, deleteCustomer } = useContext(CustomerContext)


    const [showModal, setShowModal] = useState(false);
    const [showModalConfirmDelete, setShowModalConfirmDelete] = useState(false);
    const [showModalUpdateCustomer, setShowModalUpdateCustomer] = useState(false);

    const [customers, setCustomers] = useState([])
    const [errors, setErrors] = useState({});

    const [editCustomer, setEditCustomer] = useState([])
    const [deleteCustomerId, setDeleteCustomerId] = useState([])

    const [searchText, setSearchText] = useState("");

    const searchInputRef = useRef(null);

    const initialFormState = {
        nit: '',
        name: '',
        last_name: '',
        phone: '',
        email: ''
    }
    const [form, setForm] = useState(initialFormState)


    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const data = await Customer(user.nit);
                setCustomers(data);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchCustomers();
    }, [Customer]);

    useEffect(() => {
        if (showModal) {
            setForm(initialFormState);
        }
    }, [showModal]);


    const handleFilter = async (e) => {
        const searchText = searchInputRef.current.value.toLowerCase().trim();

        setSearchText(searchText)

        if (searchText === "") {
            const data = await Customer(user.nit)
            setCustomers(data)
        } else {
            const data = customers.filter(item =>
                item.name.toLowerCase().includes(searchText) ||
                item.last_name.toLowerCase().includes(searchText) ||
                item.nit.toLowerCase().includes(searchText)
            )

            setCustomers(data);
        }


    }

    const handleInputChange = (event) => {
        setForm({
            ...form,
            [event.target.id]: event.target.value.trim(),
        });
    };

    const handleInputChangeUpdate = (updatedValues) => {
        setForm({
            ...updatedValues
        })
        setForm(updatedValues);
    };

    const handleSubmitUpdate = async (e) => {
        e.preventDefault()

        const newErrors = {};

        const reqErrorMessage = "Rellena los datos requeridos"

        if (!form.nit) newErrors.nit = reqErrorMessage;
        if (!form.name) newErrors.name = reqErrorMessage;
        if (!form.last_name) newErrors.last_name = reqErrorMessage;

        setErrors(newErrors);


        if (Object.keys(newErrors).length === 0) {

            try {

                await updateCustomer(editCustomer.id, form);
                setShowModalUpdateCustomer(false);

                const data = await Customer(user.nit);
                setCustomers(data);
            } catch (error) {
                setErrors({ notAuth: "Las credenciales son inválidas." })
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const newErrors = {};

        const reqErrorMessage = "Rellena los datos requeridos"

        if (!form.nit) newErrors.nit = reqErrorMessage;
        if (!form.name) newErrors.name = reqErrorMessage;
        if (!form.last_name) newErrors.last_name = reqErrorMessage;

        setErrors(newErrors);


        if (Object.keys(newErrors).length === 0) {

            try {

                await createCustomer(form.nit, form.name, form.last_name, form.phone, form.email, user.nit);
                setShowModal(false);

                const data = await Customer(user.nit);
                setCustomers(data);
            } catch (error) {
                setErrors({ notAuth: "Las credenciales son inválidas." })
            }
        }

    }


    const handleDelete = async () => {
        try {

            setShowModalConfirmDelete(false);

            await deleteCustomer(deleteCustomerId)

            const data = await Customer(user.nit);
            setCustomers(data);
        } catch (error) {
            setErrors({ notAuth: "Las credenciales son inválidas." })
        }
    }


    const modalOpenEdit = (customer) => {

        setForm(form => {
            const updateForm = {
                ...form,
                ["nit"]: customer.nit,
                ["name"]: customer.name,
                ["last_name"]: customer.last_name,
                ["phone"]: customer.phone,
                ["email"]: customer.email
            }
            return updateForm
        })

        setEditCustomer(customer)
        setShowModalUpdateCustomer(true)


    }


    const clearSearch = () => {

        if (searchInputRef.current) {
            searchInputRef.current.value = "";
        }
        setSearchText("");
        handleFilter("");
    };


    return (

        <div>
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <h1 className="flex items-center justify-center text-4xl font-bold mb-6 font-anton"> LISTA DE CLIENTES</h1>
                <div className="flex items-center mb-4">

                    <div className="relative w-full max-w-xs">
                        <input
                            ref={searchInputRef}
                            type="text"
                            onChange={handleFilter}
                            placeholder="Buscar..."
                            className="w-full px-4 py-2 pr-10 rounded-md border border-gray-300 focus:outline-none"
                        />

                        <div
                            className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-text"
                            onClick={clearSearch}
                        >
                            {searchText ? (
                                <IoCloseOutline size={25} className="text-gray-400 cursor-pointer" />
                            ) : (
                                <IoIosSearch size={25} className="text-gray-400" />
                            )}
                        </div>
                    </div>
                    <button
                        className="ml-auto flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        onClick={() => setShowModal(true)}>
                        <FaCirclePlus className="text-xl mr-2" />
                        Crear cliente
                    </button>

                </div>

                <hr className="mb-3" />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {customers.map((customer, index) => (

                        <div key={index} className="relative group">
                            <div className="max-w-lg overflow-hidden shadow-xl p-6 bg-white rounded-2xl transition transform hover:scale-105 duration-450">
                                <div className="flex items-center">
                                    <Avatar
                                        name={`${customer.name} ${customer.last_name}`}
                                        round={true}
                                        size="50"
                                        className="mr-4"
                                    />
                                    <div>
                                        <div className="font-bold text-xl mb-2">
                                            {customer.name} {customer.last_name}
                                        </div>
                                        <p className="text-gray-700 text-base">NIT: {customer.nit}</p>
                                        <p className="text-gray-700 text-base">Correo: {customer.email}</p>
                                        <p className="text-gray-700 text-base">Celular: {customer.phone}</p>
                                    </div>
                                </div>

                                <div className="z-20 absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">

                                    <a onClick={(e) => { e.stopPropagation(); modalOpenEdit(customer) }}
                                        className="cursor-pointer bg-yellow-400 text-white p-2 rounded-full hover:bg-yellow-500">
                                        <FaUserEdit size={16} />
                                    </a>
                                    <a onClick={(e) => { e.stopPropagation(); setShowModalConfirmDelete(true) || setDeleteCustomerId(customer.id) }}
                                        className="cursor-pointer bg-red-500 text-white p-2 rounded-full hover:bg-red-600">
                                        <FaTrash size={16} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <Fragment>
                    <Modal isVisible={showModal} onClose={() => setShowModal(false)} className="z-50">

                        {errors && <p className="block text-red-500 text-sm p-2 mb-4 rounded-lg">{Object.values(errors)[0]}</p>}

                        <form onSubmit={handleSubmit} onChange={handleInputChange}>
                            <CreateCustomerForm errors={errors} />
                            <div className="p-6 flex items-center justify-between">
                                <button className="ml-auto bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                                    Crear cliente
                                </button>

                            </div>
                        </form>

                    </Modal>

                </Fragment>

                <Fragment>
                    <Modal isVisible={showModalConfirmDelete} onClose={() => setShowModalConfirmDelete(false)} className="z-50">

                        <div className="p-6">
                            <h2 className="text-lg font-bold mb-4">Confirmar Eliminación</h2>
                            <p className="mb-4">¿Estás seguro de que deseas eliminar este elemento?</p>
                            <div className="flex justify-end">
                                <button
                                    className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                                    onClick={handleDelete}
                                >
                                    Confirmar
                                </button>
                                <button
                                    className="bg-gray-300 px-4 py-2 rounded"
                                    onClick={() => setShowModalConfirmDelete(false)}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>

                    </Modal>

                </Fragment>


                <Fragment>
                    <Modal isVisible={showModalUpdateCustomer} onClose={() => setShowModalUpdateCustomer(false)} className="z-50">

                        <div className="p-6">
                            <h1 className="flex items-center justify-center mb-3 font-bold text-3xl font-anton">EDITAR CLIENTE</h1>

                            <form onSubmit={handleSubmitUpdate}>
                                <UpdateCustomerForm errors={errors} customer={editCustomer} onChange={handleInputChangeUpdate} />
                                <div className="flex items-center justify-between">
                                    <button className="ml-auto bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                                        Actualizar cliente
                                    </button>

                                </div>
                            </form>
                        </div>

                    </Modal>

                </Fragment>

            </div>
        </div>

    )
}



export default ListCustomersPage;