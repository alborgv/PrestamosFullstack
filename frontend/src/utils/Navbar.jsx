import logo from '../assets/image.png'
import { Link } from 'react-router-dom'
import { useContext, useState } from 'react'

import { FaUserLarge, FaAngleDown } from "react-icons/fa6";

import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import AuthContext from '../context/AuthContext'

import Modal from './Modal';

import ChangePasswordForm from './forms/ChangePasswordForm';
    

export default function Navbar() {

    // LOGOUT 
    const { logoutUser, refreshAccessToken, changePassword } = useContext(AuthContext);

    const handleLogout = async () => {
        try {
            logoutUser();
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
        } catch (error) {
            console.error(error);
        }
    }


    // MODAL
    const [showModal, setShowModal] = useState(false);
    const [errors, setErrors] = useState({});

    const [form, setForm] = useState({old_password: '', new_password: '', new_password_confirm: ''})


    const handleChange = (e) => {
        console.log(e.target.id, e.target.value.trim())
        setForm({
            ...form,
            [e.target.id]: e.target.value.trim(),
        });

    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await changePassword(form.old_password, form.new_password, form.new_password_confirm)
            setErrors(response)

            if (!errors) {
                setShowModal(false)
            }

        } catch (error) {
            setErrors({notChange: "Error en el cambio de contraseña."})
        }
        

    } 




    return (

        <div>


            <nav className="bg-gray-800 p-4">
                <div className="container mx-auto">
                    <div className="flex items-center justify-between">
                        <div>
                            <Link to="/" className="flex items-center cursor-pointer">
                                <img src={logo} alt="Logo" className="h-8" />
                                <h1 className="text-white ml-4">Prestaciones</h1>
                            </Link>
                        </div>
                        <div className="flex items-center">
                            <Link to="/list-benefits" className="bg-transparent text-white px-4 py-2">
                                Lista de prestaciones
                            </Link>
                            <Link to="/list-customers" className="bg-transparent text-white px-4 py-2">
                                Lista de clientes
                            </Link>

                            <Menu as="div" className="relative inline-block text-left">
                                <div>
                                    <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 px-3 py-2">
                                        <FaUserLarge color='white' /> <FaAngleDown color='white' />
                                    </Menu.Button>
                                </div>

                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <div className="py-1">
                                            <Menu.Item>
                                                <a
                                                    onClick={() => setShowModal(true)}
                                                    className="cursor-pointer block px-4 py-2 text-sm hover:bg-gray-200 hover:text-black"
                                                >
                                                    Cambiar contraseña
                                                </a>
                                            </Menu.Item>
                                            <Menu.Item>
                                                <a
                                                    onClick={handleLogout}
                                                    className="cursor-pointer block px-4 py-2 text-sm hover:bg-gray-100 hover:text-black"
                                                >
                                                    Cerrar sesión
                                                </a>
                                            </Menu.Item>
                                        </div>
                                    </Menu.Items>
                                </Transition>
                            </Menu>

                            <Fragment>
                                <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
                                
                                    {errors && <p className="block text-red-500 text-sm p-2 mb-4 rounded-lg">{Object.values(errors)[0]}</p>}

                                    <form onChange={handleChange} onSubmit={handleSubmit}>
                                        <ChangePasswordForm errors={errors}/>
                                        <div className="flex items-center justify-between">
                                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                                                Cambiar contraseña
                                            </button>
                                            
                                            {/* <Link className="inline-block align-baseline font-medium text-sm text-blue-500 hover:text-blue-800" to="/register">¿No tienes cuenta? Regístrate</Link> */}
                                        
                                        </div>
                                    </form>
                                
                                </Modal>
                            </Fragment>


                        </div>

                    </div>
                </div>



            </nav>

        </div>

    )

}