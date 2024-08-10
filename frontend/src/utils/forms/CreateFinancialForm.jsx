import { useState, useEffect } from 'react';

const inputs = [
    {
        id: 'lend',
        label: 'Prestar',
        type: 'number',
        placeholder: ''
    },
    {
        id: 'credit',
        label: 'Crédito',
        type: 'number',
        placeholder: ''
    },
    {
        id: 'fee',
        label: 'Cuotas',
        type: 'number',
        placeholder: ''
    }
];

const CreateFinancialForm = ({errors, customers}) => {
    
    const [selectedCustomer, setSelectedCustomer] = useState('');


const handleSelectChange = (event) => {
    setSelectedCustomer(event.target.value);
};

return (
    <div>
        <div className="mb-5">
            <label htmlFor="customer_select" className="block text-gray-700 font-medium text-xs mb-2 ml-2 text-left">
                <span className="text-red-500">* </span>Selecciona un cliente:
            </label>
            <select
                id="customer_select"
                value={selectedCustomer}
                onChange={handleSelectChange}
                className={`${errors["customer_select"] ? 'border-red-500' : ''} appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            >
            <option value="">Seleccione un cliente</option>
            {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                    {customer.name} {customer.last_name}
                </option>
            ))}
            </select>
        </div>
        {inputs.map((input) => (
        <div className="mb-5" key={input.id}>
            <label htmlFor={input.id} className="block text-gray-700 font-medium text-xs mb-2 ml-2 text-left">
                <span className="text-red-500">* </span>{input.label}:
            </label>
            <input
                type={input.type}
                id={input.id}
                className={`${errors[input.id] ? 'border-red-500' : ''} appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                placeholder={input.placeholder}
            />
            </div>
        ))}
    </div>
    );
};

export default CreateFinancialForm;
