import { useContext, useState, useEffect, Fragment, useRef } from "react"
import { Link } from "react-router-dom";

import AuthContext from "../context/AuthContext"
import CustomerContext from "../context/CustomerContext";

import Modal from "../utils/Modal";
import Avatar from 'react-avatar';
import Navbar from "../utils/Navbar";
import CreateFinancialForm from "../utils/forms/CreateFinancialForm";
import CreateFeeForm from "../utils/forms/CreateFeeForm";

import { FaCirclePlus, FaTrash, FaUser, FaMoneyBillWave } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";


function ListFinancialsPage() {

    const { user } = useContext(AuthContext)
    const { Customer, createFinancial, deleteFinancial, Financial, createFee} = useContext(CustomerContext)

    
    const [customers, setCustomers] = useState([])
    const [financials, setFinancials] = useState([])
    
    const [searchText, setSearchText] = useState("");
    const [showModalCreateFinancial, setShowModalCreateFinancial] = useState(false);
    const [showModalConfirmDelete, setShowModalConfirmDelete] = useState(false);
    const [showModalCreateFee, setShowModalCreateFee] = useState(false);
    const [showModalInfoFinancial, setShowModalInfoFinancial] = useState(false);
    const [errors, setErrors] = useState({});

    const [deleteFinancialId, setDeleteFinancialId] = useState([])
    const [infoFinancial, setInfoFinancial] = useState([])
    const [createFeeId, setCreateFeeId] = useState([])

    const searchInputRef = useRef(null);

    const initialFormStateFinancial = {customer_select: '', lend: '', credit: '', fee: ''}
    const [formFinancial, setFormFinancial] = useState(initialFormStateFinancial)
    
    const initialFormStateFee = {paid: '', date: ''}
    const [formFee, setFormFee] = useState(initialFormStateFee)

    const [totalPaid, setTotalPaid] = useState([])
    const [totalToPay, setTotalToPay] = useState([])


    useEffect(() => {
        const fetchFinancials = async () => {
            try {
                const dataCustomers = await Customer(user.nit)
                setCustomers(dataCustomers);

                const dataFinancials = await Financial(user.nit);
                setFinancials(dataFinancials);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchFinancials();
    }, [Financial]);

    useEffect(() => {
        if (showModalCreateFinancial) {
            setFormFinancial(initialFormStateFinancial);
        }
        if (showModalCreateFee) {
            setFormFee(initialFormStateFee)
        }
    }, [showModalCreateFinancial, showModalCreateFee]);


    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(amount);
    };


    const handleFilter = async (e) => {
        const searchText = searchInputRef.current.value.toLowerCase();

        setSearchText(searchText)
        
        if (searchText.trim() === "") {
            const data =  await Financial(user.nit)
            setFinancials(data)
        } else {
            const data = financials.filter(item => 
                item.customer_name.toLowerCase().includes(searchText) ||
                item.customer_last_name.toLowerCase().includes(searchText) ||
                item.customer_nit.toLowerCase().includes(searchText)
            )

            setFinancials(data)
        }


    }


    const handleInputChange = (event) => {
        setFormFinancial({
            ...formFinancial,
            [event.target.id]: event.target.value.trim(),
        });

    }

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const newErrors = {};

        const reqErrorMessage = "Rellena los datos requeridos"
        
        if (formFinancial.customer_select === "") newErrors.customer_select = reqErrorMessage;
        if (!formFinancial.lend) newErrors.lend = reqErrorMessage;
        if (!formFinancial.credit) newErrors.credit = reqErrorMessage;
        if (!formFinancial.fee) newErrors.fee = reqErrorMessage;

        setErrors(newErrors);

        
        if (Object.keys(newErrors).length === 0) {
            
            try {

                await createFinancial(formFinancial.customer_select, formFinancial.lend, formFinancial.credit, formFinancial.fee, user.nit);
                setShowModalCreateFinancial(false);
                
                const data = await Financial(user.nit);
                setFinancials(data);
            } catch (error) {
                setErrors({notAuth: "Las credenciales son inválidas."})
            }
        }


    }


    const handleInputChangeFee = (event) => {
        setFormFee({
            ...formFee,
            [event.target.id]: event.target.value.trim(),
        });

    }

    
    const handleSubmitFee = async (e) => {
        e.preventDefault();
        
        const newErrors = {};

        const reqErrorMessage = "Rellena los datos requeridos"
        
        if (!formFee.paid) newErrors.paid = reqErrorMessage;
        if (parseInt(formFee.paid, 10) + parseInt(totalPaid, 10) >= totalToPay) newErrors.totalPaid = "Te pasaste del pago"

        setErrors(newErrors);
        
        if (Object.keys(newErrors).length === 0) {
            
            try {
                await createFee(createFeeId, formFee.paid, formFee.date);
                setShowModalCreateFee(false);
                
            } catch (error) {
                setErrors({notAuth: "Las credenciales son inválidas."})
            }
        }


    }
    
    const clearSearch = () => {

        if (searchInputRef.current) {
            searchInputRef.current.value = "";
        }
        setSearchText("");
        handleFilter("");
    };

    const modalCreateFee = (id, totalPaid, totalToPay) => {
        setTotalPaid(totalPaid)
        setTotalToPay(totalToPay)
        setShowModalCreateFee(true)
        setCreateFeeId(id)

    }

    const modalInfoFinancial = (id) => {
        setShowModalInfoFinancial(true)
        const financial = financials.find(item => item.id === id);
        setInfoFinancial(financial)

    }

    const handleDelete = async () => {        
        try {

            setShowModalConfirmDelete(false);

            await deleteFinancial(deleteFinancialId)

            const data = await Financial(user.nit);
            setFinancials(data);
        } catch (error) {
            setErrors({notAuth: "Las credenciales son inválidas."})
        }
    }

    const calculateTotalFee = (fees) => {
        let totalPaid = 0;
        let lastFeeNum = null;

        if (fees === undefined) {
            return []
        }

        fees.forEach((fee) => {
            totalPaid += parseFloat(fee.paid);
            lastFeeNum = fee.fee_num;
        });

        return { totalPaid, lastFeeNum };

    };
    
    return (
        
        <div>                
            <Navbar/>


            <div className="container mx-auto px-4 py-8">
                <h1 className="flex items-center justify-center text-4xl font-bold mb-6 font-anton dark:text-white"> LISTA DE PRESTACIONES</h1>

                <div className="flex items-center mb-4">

                    <div className="relative w-full max-w-xs">
                        <input 
                            ref={searchInputRef}
                            type="text" 
                            onChange={handleFilter} 
                            placeholder="Buscar..." 
                            className="w-full px-4 py-2 pr-10 rounded-md border border-gray-300 dark:bg-secColor dark:border-blue-950 dark:text-white focus:outline-none"
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
                        onClick={() => setShowModalCreateFinancial(true)}>
                        <FaCirclePlus className="text-xl mr-2"/>
                            Prestar
                    </button>

                </div>

                <hr className="mb-3"/>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 cursor-pointer">
                    {financials.map((financial, index) => {
                        const { totalPaid, lastFeeNum } = calculateTotalFee(financial.fees || []);

                        return (

                    
                        <div key={index} className="relative group" onClick={() => modalInfoFinancial(financial.id)}>
                                <div className="max-w-lg overflow-hidden shadow-xl p-6 bg-white dark:bg-pryColor dark:text-white rounded-2xl transition transform hover:scale-105 duration-450">
                                    <div className="flex items-center">
                                        <Avatar
                                        name={`${financial.customer_name} ${financial.customer_last_name}`}
                                        round={true}
                                        size="50"
                                        className="mr-4"
                                        />
                                        <div>
                                            <div className="font-bold text-xl mb-2">
                                                {financial.customer_name} {financial.customer_last_name}
                                            </div>
                                            <p className="text-gray-700 text-base dark:text-slate-200">NIT: {financial.customer_nit}</p>
                                            <p className="text-gray-700 text-base dark:text-slate-200">Debe: {formatCurrency(parseInt(financial.credit, 10) + parseInt(financial.borrowed, 10))}</p>
                                            <p className="text-gray-700 text-base dark:text-slate-200">Total Pagado: {formatCurrency(totalPaid)}</p>
                                            
                                        
                                        </div>
                                    </div>
                                    <div className="z-20 absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        
                                        <a onClick={(e) => { e.stopPropagation(); modalCreateFee(financial.id, totalPaid, (parseInt(financial.credit, 10) + parseInt(financial.borrowed, 10))); }} className="cursor-pointer bg-green-500 text-white p-2 rounded-full hover:bg-green-600">
                                        <FaCirclePlus size={16} />
                                        </a>
                                        <a onClick={(e) => { e.stopPropagation(); setShowModalConfirmDelete(true) || setDeleteFinancialId(financial.id)}} className="cursor-pointer bg-red-500 text-white p-2 rounded-full hover:bg-red-600">
                                        <FaTrash size={16} />
                                        </a>
                                    </div>
                                </div>
                        </div>
                        )
                    })}
                </div>

                <Fragment>
                    <Modal isVisible={showModalCreateFinancial} onClose={() => setShowModalCreateFinancial(false)} className="z-50">
                    
                        {errors && <p className="block text-red-500 text-sm p-2 mb-4 rounded-lg">{Object.values(errors)[0]}</p>}

                        <form onSubmit={handleSubmit} onChange={handleInputChange}>
                            <CreateFinancialForm errors={errors} customers={customers}/>
                            <div className="p-6 flex items-center justify-between">
                                <button className="ml-auto bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                                    Prestar
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
                    <Modal isVisible={showModalCreateFee} onClose={() => setShowModalCreateFee(false)} className="z-50">
                    
                        <form onSubmit={handleSubmitFee} onChange={handleInputChangeFee}>
                            <CreateFeeForm errors={errors}/>
                            <div className="flex items-center justify-between">
                                <button className="ml-auto bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                                    Crear pago
                                </button>
                                
                            
                            </div>
                        </form>
                    
                    </Modal>
                    
                </Fragment>
                <Fragment>
                    <Modal isVisible={showModalInfoFinancial} onClose={() => setShowModalInfoFinancial(false)} className="z-50">
                    
                        <div>

                            <div className="flex">
                                <div className="w-1/2 p-2">
                                    <h1 className="flex items-center space-x-2 font-bold mb-4 text-lg">
                                        <FaUser/> 
                                        <span>Información del cliente</span>
                                    </h1>
                                    <p>Nombre: {infoFinancial.customer_name} {infoFinancial.customer_last_name} </p>
                                    <p>NIT: {infoFinancial.customer_nit}</p>
                                    <p>Correo: {infoFinancial.customer_email}</p>
                                    <p>Teléfono: {infoFinancial.customer_phone}</p>

                                </div>
                                <div className="w-1/2 p-2">
                                    <h1 className="flex items-center space-x-2 font-bold mb-4 text-lg">
                                        <FaMoneyBillWave/>
                                        <span>Información del préstamo</span>
                                    </h1>

                                    <p>Prestado: {formatCurrency(infoFinancial.borrowed)}</p>
                                    <p>Crédito: {formatCurrency(infoFinancial.credit)}</p>
                                    <p>Total a pagar: {formatCurrency(parseInt(infoFinancial.borrowed, 10) + parseInt(infoFinancial.credit, 10))}</p>
                                    <p>Total pagado: {formatCurrency(calculateTotalFee(infoFinancial.fees).totalPaid)}</p>
                                    <p>Restante: {formatCurrency(parseInt(infoFinancial.borrowed, 10) - parseInt(calculateTotalFee(infoFinancial.fees).totalPaid, 10))}</p>
                                    <p>Cuotas definidas: {infoFinancial.fee}</p>
                                </div>

                            </div>

                            <hr className="mb-4 mt-4"/>
                            <h1 className="font-bold text-2xl mb-4">Cuotas</h1>
                            <div className="h-64 overflow-y-auto">
                                
                                {infoFinancial.fees?.length > 0 ? (
                                        infoFinancial.fees?.map(item =>{

                                            return (
        
                                                <div key={item.id} className="bg-gray-100 rounded mb-2 p-2">
                                                    <p>Cuota: {item.fee_num}</p>
                                                    <p>Pagado: {formatCurrency(item.paid)}</p>
                                                    <p>Fecha: {item.date}</p>
                                                </div>
                                            )
                                        })
                                    ) : (

                                        <div className="flex items-center justify-center h-60">
                                            <p className="font-bold text-xl">NO SE HA PAGADO NINGUNA CUOTA</p>
                                        </div>
                                        
                                    )}
                            </div>
                        </div>
                    </Modal>
                    
                </Fragment>

            </div>
            
        </div>
        
    )
}



export default ListFinancialsPage;