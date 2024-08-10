import Navbar from "../utils/Navbar";
import CustomerContext from "../context/CustomerContext";
import AuthContext from "../context/AuthContext";
import Avatar from "react-avatar";
import Footer from "../utils/Footer";


import { GoPeople } from "react-icons/go";
import { IoTrendingUpOutline } from "react-icons/io5";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { GiPayMoney } from "react-icons/gi";
import { IoMdStar } from "react-icons/io";
import { MdKeyboardDoubleArrowUp } from "react-icons/md";
import { useContext, useEffect, useState } from "react";


export default function Dashboard() {
    const { user } = useContext(AuthContext);
    const { Financial, Customer } = useContext(CustomerContext);

    const [customers, setCustomers] = useState([]);
    const [earnings, setEarnings] = useState([]);
    const [active, setActive] = useState([]);
    const [borrowed, setBorrowed] = useState([]);
    const [feesList, setFeesList] = useState([]);
    
    const [topLoans, setTopLoans] = useState({ name: '', last_name: '', loans: 0 });
    const [topAmount, setTopAmount] = useState({ name: '', last_name: '', amount: 0 });

    useEffect(() => {
        const financials = async () => {
            try {
                const dataCustomers = await Customer(user.nit);
                setCustomers(dataCustomers.length);

                const dataFinancials = await Financial(user.nit);
                filteredData(dataFinancials);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        financials();
    }, [Financial]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(amount);
    };

    const filteredData = (data) => {
        let totalBorrowed = 0;
        let totalCredit = 0;
        let feesArray = [];

        let maxLoans = { name: '', last_name: '', loans: 0 };
        let maxAmount = { name: '', last_name: '', amount: 0 };

        const filteredData2 = data.filter(item => {
            const borrowed = parseFloat(item.borrowed);
            const credit = parseFloat(item.credit);

            const totalPaid = item.fees.reduce((sum, fee) => sum + parseFloat(fee.paid), 0);

            if (totalPaid < (borrowed + credit)) {
                totalBorrowed += parseFloat(item.borrowed);
                totalCredit += parseFloat(item.credit);

                if (item.fees.length > maxLoans.loans) {
                    maxLoans = { name: item.customer_name, last_name: item.customer_last_name, loans: item.fees.length };
                }

                if (totalPaid > maxAmount.amount) {
                    if (item.customer_name === maxAmount.name) {
                        maxAmount.amount += totalPaid
                    } else {
                        maxAmount = { name: item.customer_name, last_name: item.customer_last_name, amount: totalPaid };
                    }
                }

                const feesWithCustomerInfo = item.fees.filter(fee => parseFloat(fee.paid) < (parseFloat(item.borrowed) + parseFloat(item.credit)))
                    .map(fee => ({
                        ...fee,
                        customer_name: item.customer_name,
                        customer_last_name: item.customer_last_name
                    }));

                feesArray = feesArray.concat(feesWithCustomerInfo);
            }

            return totalPaid < (borrowed + credit);
        });

        setEarnings(totalCredit);
        setActive(filteredData2.length);
        setBorrowed(totalBorrowed);
        setFeesList(feesArray);
        setTopLoans(maxLoans);
        setTopAmount(maxAmount);
    };

    return (
        <div>
            <Navbar />

            <div className="container mx-auto p-4 mb-[70px] mt-[20px]">

                <div className="flex flex-wrap justify-between gap-4 mb-[50px]">
                    <div className="card bg-gray-800 p-6 shadow-2xl flex-1 min-w-[300px] max-w-[200px] flex items-center rounded-2xl transition transform hover:scale-105 duration-450">
                        <GoPeople size={60} className="mr-4 text-white" />
                        <div className="flex flex-col ml-auto">
                            <span className="text-gray-100 text-xl">Clientes</span>
                            <span className="font-bold ml-auto text-3xl text-white">{customers}</span>
                        </div>
                    </div>
                    <div className="bg-white p-6 shadow-2xl flex-1 min-w-[300px] max-w-[200px] flex items-center rounded-2xl transition transform hover:scale-105 duration-450">
                        <IoTrendingUpOutline size={60} className="mr-4" />
                        <div className="flex flex-col ml-auto">
                            <span className="text-xl ml-auto">Ganancias</span>
                            <span className="font-bold ml-auto text-3xl">{formatCurrency(earnings)}</span>
                        </div>
                    </div>
                    <div className="card bg-gray-800 p-4 shadow-2xl flex-1 min-w-[300px] max-w-[200px] flex items-center rounded-2xl transition transform hover:scale-105 duration-450">
                        <LiaFileInvoiceDollarSolid size={60} className="mr-4 text-white" />
                        <div className="flex flex-col ml-auto">
                            <span className="text-xl ml-auto text-gray-100">Activas</span>
                            <span className="font-bold ml-auto text-3xl text-white">{active}</span>
                        </div>
                    </div>
                    <div className="card bg-white p-4 shadow-2xl flex-1 min-w-[300px] max-w-[200px] flex items-center rounded-2xl transition transform hover:scale-105 duration-450">
                        <GiPayMoney size={60} className="mr-4" />
                        <div className="flex flex-col ml-auto">
                            <span className="text-xl ml-auto">Prestado</span>
                            <span className="font-bold ml-auto text-3xl">{formatCurrency(borrowed)}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="w-full lg:w-[60vw] max-w-[800px] bg-white p-4 shadow-xl font-anton rounded-xl">
                        <h2 className="text-xl font-bold mb-4 flex items-center justify-center">Cuotas recientes</h2>
                        <div className="gap-3 flex text-lg mb-4">
                            <span className="flex-1 ml-[80px]">Cliente</span>
                            <span className="flex-2 mr-10">Fecha</span>
                            <span className="flex-3 mr-10">Pagó</span>
                        </div>
                        <div className="overflow-y-scroll h-[calc(100vh-20px)] lg:h-[calc(60vh-20px)]">
                            <ul>
                                {feesList.map((fee, index) => (
                                    <li key={index} className="mb-2 p-2 border-b bg-gray-100 rounded-xl flex items-center">
                                        <Avatar
                                            name={`${fee.customer_name} ${fee.customer_last_name}`}
                                            round={true}
                                            size="30"
                                            className="mr-4"
                                        />
                                        <span>{fee.customer_name} {fee.customer_last_name}</span>
                                        <span className="ml-auto">{fee.date}</span>
                                        <span className="ml-4">{formatCurrency(fee.paid)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="w-full lg:w-[500px] bg-white p-6 shadow-xl font-anton rounded-xl">
                            <div className="flex items-center mb-4">
                                <IoMdStar size={30} className="text-yellow-400"/>
                                <h3 className="text-xl font-bold">&nbsp;Más préstamos activos</h3>

                            </div>
                            <div className="flex items-center">

                                <Avatar
                                    name={`${topLoans.name} ${topLoans.last_name}`}
                                    round={true}
                                    size="50"
                                    className="mr-4"
                                />
                                <div className="items-start">
                                    <span className="font-bold text-lg">{topLoans.name} {topLoans.last_name}</span>
                                    <p className="">• ({topLoans.loans} préstamos)</p>
                                </div>
                            </div>
                        </div>
                        <div className="w-full lg:w-[500px] bg-white p-6 shadow-xl font-anton rounded-xl">
                            <div className="flex items-center mb-4">
                                <MdKeyboardDoubleArrowUp size={30} className="text-blue-500"/>
                                <h3 className="text-lg font-bold">Más dinero pagado <span className="text-gray-500">(préstamos actuales)</span></h3>
                            </div>

                            <div className="flex items-center">
                                
                                <Avatar
                                    name={`${topAmount.name} ${topAmount.last_name}`}
                                    round={true}
                                    size="50"
                                    className="mr-4"
                                />
                                <div className="items-start">
    
                                    <span className="text-lg font-bold">{topAmount.name} {topAmount.last_name}</span>
                                    <p>• {formatCurrency(topAmount.amount)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
        
    );
}
