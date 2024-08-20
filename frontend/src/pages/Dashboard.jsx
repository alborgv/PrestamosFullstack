import dayjs from 'dayjs';
import Navbar from "../utils/Navbar";
import CustomerContext from "../context/CustomerContext";
import AuthContext from "../context/AuthContext";
import Avatar from "react-avatar";
import Footer from "../utils/Footer";

import { BarChart } from '@mui/x-charts/BarChart';

import { IoPeopleSharp, IoTrendingUpOutline } from "react-icons/io5";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { GiPayMoney } from "react-icons/gi";
import { useContext, useEffect, useState } from "react";

export default function Dashboard() {
    const { user } = useContext(AuthContext);
    const { Financial, Customer } = useContext(CustomerContext);

    const [customers, setCustomers] = useState([]);
    const [earnings, setEarnings] = useState([]);
    const [active, setActive] = useState([]);
    const [borrowed, setBorrowed] = useState([]);
    const [feesList, setFeesList] = useState([]);
    const [feePorAnho, setFeePorAnho] = useState([]);
    const [feeMeses, setFeeMeses] = useState([]);
    
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
                        maxAmount.amount += totalPaid;
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

        const sortedFees = feesArray
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 15); 

        const meses = [];
        let currentMonth = dayjs();
        
        for (let i = 0; i < 8; i++) {
            meses.push(currentMonth.format('MMM YYYY'));
            currentMonth = currentMonth.subtract(1, 'month');
        }

        const feeAnho = feesArray.reduce((acc, payment) => {
            const date = dayjs(payment.date);
            const mes = date.format('MMM YYYY');
            const amount = parseFloat(payment.paid);

            if (!acc[mes]) {
                acc[mes] = 0;
            }

            acc[mes] += amount;

            return acc;
        }, {});

        const sortedData = meses.reverse().map(mes => ({
            mes,
            amount: feeAnho[mes] || 0
        }));

        setEarnings(totalCredit);
        setActive(filteredData2.length);
        setBorrowed(totalBorrowed);
        setFeesList(sortedFees);
        setTopLoans(maxLoans);
        setTopAmount(maxAmount);
        setFeePorAnho(feeAnho);
        setFeeMeses(sortedData);
    };

    return (
        <div>
            <Navbar />

            <div className="container mx-auto p-4 mb-[70px] mt-[20px]">

                <div className="flex flex-wrap justify-between gap-4 mb-[50px]">
                    <div className="card bg-white dark:bg-secColor p-8 shadow-md flex-1 min-w-[300px] max-w-[200px] flex items-center rounded-lg transition transform hover:scale-105 duration-450">
                        <IoPeopleSharp size={70} className="mr-4 text-black dark:text-white" />
                        <div className="flex flex-col ml-auto">
                            <span className="text-xl dark:text-white">Clientes</span>
                            <span className="font-bold ml-auto dark:text-white text-3xl">{customers}</span>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-secColor p-8 shadow-md flex-1 min-w-[300px] max-w-[200px] flex items-center rounded-lg transition transform hover:scale-105 duration-450">
                        <IoTrendingUpOutline size={70} className="mr-4 text-black dark:text-white" />
                        <div className="flex flex-col ml-auto dark:text-white">
                            <span className="text-xl ml-auto">Ganancias</span>
                            <span className="font-bold ml-auto text-3xl dark:text-white">{formatCurrency(earnings)}</span>
                        </div>
                    </div>
                    <div className="card bg-white dark:bg-secColor p-8 shadow-md flex-1 min-w-[300px] max-w-[200px] flex items-center rounded-lg transition transform hover:scale-105 duration-450">
                        <LiaFileInvoiceDollarSolid size={70} className="mr-4 text-black dark:text-white" />
                        <div className="flex flex-col ml-auto dark:text-white">
                            <span className="text-xl ml-auto">Activas</span>
                            <span className="font-bold ml-auto text-3xl dark:text-white">{active}</span>
                        </div>
                    </div>
                    <div className="card bg-white dark:bg-secColor p-8 shadow-md flex-1 min-w-[300px] max-w-[200px] flex items-center rounded-lg transition transform hover:scale-105 duration-450">
                        <GiPayMoney size={70} className="mr-4 text-black dark:text-white" />
                        <div className="flex flex-col ml-auto dark:text-white">
                            <span className="text-xl ml-auto">Prestado</span>
                            <span className="font-bold ml-auto text-3xl dark:text-white">{formatCurrency(borrowed)}</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 mb-20">
                    <div className='text-center'>
                        <h1 className='text-2xl font-bold mb-4 dark:text-white'>Pagos últimos meses</h1>
                        <BarChart
                            className='shadow-xl border-red-500'
                            width={700}
                            height={400}
                            series={[
                                { name: 'Monto', data: feeMeses.map(item => item.amount) }
                            ]}
                            margin={{ top: 20, right: 30, bottom: 50, left: 80 }}
                            xAxis={[
                                {
                                    data: feeMeses.map(item => item.mes),
                                    scaleType: 'band',
                                    position: 'bottom',
                                }
                            ]}
                            yAxis={[
                                {
                                    tickFormatter: (value) => formatCurrency(value),
                                    position: 'left'
                                }
                            ]}
                        />
                    </div>
    

                    <div className="w-full lg:w-[60vw] max-h-[28vw] max-w-[500px] bg-white dark:bg-pryColor p-4 shadow-xl font-anton rounded-md">
                        <h2 className="text-xl font-bold mb-4 flex items-center justify-center dark:text-slate-200">Cuotas recientes</h2>
                        <div className="gap-3 flex text-lg mb-4">
                            <span className="flex-1 ml-[80px] dark:text-slate-200">Cliente</span>
                            <span className="flex-2 mr-10 dark:text-slate-200">Fecha</span>
                            <span className="flex-3 mr-10 dark:text-slate-200">Pagó</span>
                        </div>
                        <div className="overflow-y-scroll max-h-[calc(45vh-20px)] lg:max-h-[60vh] sm:max-h-[15vh]">
                            <ul>
                                {feesList.map((fee, index) => (
                                    <li key={index} className="mb-2 p-2 bg-gray-100 dark:bg-secColor rounded-xl flex items-center">
                                        <Avatar
                                            name={`${fee.customer_name} ${fee.customer_last_name}`}
                                            round={true}
                                            size="30"
                                            className="mr-4"
                                        />
                                        <span className='dark:text-slate-200'>{fee.customer_name} {fee.customer_last_name}</span>
                                        <span className="ml-auto dark:text-slate-200">{fee.date}</span>
                                        <span className="ml-4 dark:text-slate-200">{formatCurrency(fee.paid)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

            </div>
            <Footer/>
        </div>
    );
}
