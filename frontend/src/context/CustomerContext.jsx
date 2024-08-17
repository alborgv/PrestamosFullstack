import {createContext, useState, useEffect} from "react";
import {jwtDecode} from "jwt-decode";
import {useNavigate} from "react-router-dom";

import swal from "sweetalert2";

const CustomerContext = createContext();

export default CustomerContext;

export const CustomerProvider = ({ children }) => {
    

    const navigate = useNavigate();


    const Customer = async (nitProvider) => {

        const response = await fetch(`${process.env.URL_BACKEND}/api/v1/customer/?nit_provider=${nitProvider}`)

        const data = await response.json();

        return data
    }


    const createCustomer = async (nit, name, last_name, phone, email, nit_provider) => {

        const response = await fetch(`${process.env.URL_BACKEND}/api/v1/create_customer/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nit, name, last_name, phone, email, nit_provider
            })
        })


        const data = await response.json()

        if (data.error) {
            Object.keys(data.error).forEach(key => {
                console.log(data.error[key][0]);
            });
        }
    
        if(response.status === 201){
            swal.fire({
                title: "¡Cliente creado éxitosamente!",
                icon: "success",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            })
        } else {
            console.log(response.status);
            swal.fire({
                title: "An Error Occured " + response.status,
                icon: "error",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            })
        }

    }

    const updateCustomer = async (id, formData) => {
        try {
            const response = await fetch(`${process.env.URL_BACKEND}/api/v1/customer/${id}/update/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)

            })

            if (response.ok) {
                if(response.status === 200){
                    swal.fire({
                        title: "¡Se actualizó el cliente con éxito!",
                        icon: "success",
                        toast: true,
                        timer: 6000,
                        position: 'top-right',
                        timerProgressBar: true,
                        showConfirmButton: false,
                    })
                } else {
                    console.log(response.status);
                    swal.fire({
                        title: "An Error Occured " + response.status,
                        icon: "error",
                        toast: true,
                        timer: 6000,
                        position: 'top-right',
                        timerProgressBar: true,
                        showConfirmButton: false,
                    })
                }
            } 
                
            const data = await response.json()

            if (data.error) {
                Object.keys(data.error).forEach(key => {
                    console.log(data.error[key][0]);
                });
            }


        } catch {

        }
    }


    const deleteCustomer = async (id) => {
        try {
            const response = await fetch(`${process.env.URL_BACKEND}/api/v1/customer/${id}/delete/`, {
                method: "DELETE",
            })
            
            if (!response.ok) {
                const data = await response.json();
                if (data.error) {
                    Object.keys(data.error).forEach(key => {
                        console.log(data.error[key][0]);
                    });
                }
                throw new Error('Error deleting customer item');
            }
    
            swal.fire({
                title: "¡Se eliminó el cliente con éxito!",
                icon: "success",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            })

        } catch {

            console.log(response.status);
            swal.fire({
                title: "An Error Occured " + response.status,
                icon: "error",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            })
        }

    }


    const Financial = async (nitProvider) => {

        const response = await fetch(`${process.env.URL_BACKEND}/api/v1/financials/?nit_provider=${nitProvider}`)

        const data = await response.json();

        return data
    }



    const createFinancial = async (customer, borrowed, credit, fee, nit_provider) => {
        
        const response = await fetch(`${process.env.URL_BACKEND}/api/v1/create_financial/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                customer, borrowed, credit, fee, nit_provider
            })
        })
        
        const data = await response.json()

        if (data.error) {
            Object.keys(data.error).forEach(key => {
                console.log(data.error[key][0]);
            });
        }
    
        if(response.status === 201){
            swal.fire({
                title: "¡Se realizó el préstamo con éxito!",
                icon: "success",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            })
        } else {
            console.log(response.status);
            swal.fire({
                title: "An Error Occured " + response.status,
                icon: "error",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            })
        }

    }

    
    const deleteFinancial = async (id) => {
        try {
            const response = await fetch(`${process.env.URL_BACKEND}/api/v1/financials/${id}/delete/`, {
                method: "DELETE",
            })
            
            if (!response.ok) {
                const data = await response.json();
                if (data.error) {
                    Object.keys(data.error).forEach(key => {
                        console.log(data.error[key][0]);
                    });
                }
                throw new Error('Error deleting financial item');
            }
    
            swal.fire({
                title: "¡Se eliminó el préstamo con éxito!",
                icon: "success",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            })

        } catch {

            console.log(response.status);
            swal.fire({
                title: "An Error Occured " + response.status,
                icon: "error",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            })
        }

    }


    const createFee = async (financial_id, paid, date) => {
        console.log("test")
        const response = await fetch(`${process.env.URL_BACKEND}/api/v1/create_fee/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                financial_id, paid, date
            })
        })

        console.log(response)
        
        const data = await response.json()

        if (data.error) {
            Object.keys(data.error).forEach(key => {
                console.log(data.error[key][0]);
            });
        }
    
        if(response.status === 201){
            swal.fire({
                title: "¡Se realizó el pago con éxito!",
                icon: "success",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            })
        } else {
            console.log(response.status);
            swal.fire({
                title: "An Error Occured " + response.status,
                icon: "error",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            })
        }
    }

    const contextData = {
        Customer,
        createCustomer,
        updateCustomer,
        deleteCustomer,
        createFinancial,
        deleteFinancial,
        Financial,
        createFee
    }


    return (
        <CustomerContext.Provider value={contextData}>
            {children}
        </CustomerContext.Provider>
    )

}