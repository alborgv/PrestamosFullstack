import "./App.css"
import { useState, useEffect } from "react";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from './context/AuthContext';
import { CustomerProvider } from "./context/CustomerContext";

import PrivateRoute from './utils/PrivateRoute';
import LoginRoute from './utils/LoginRoute';

import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import LogoutPage from './pages/LogoutPage'
import RegisterPage from './pages/RegisterPage';
import ListCustomersPage from "./pages/ListCostumers";
import ListFinancialsPage from "./pages/ListFinancials";

function App() {

    return (
        <>
            <BrowserRouter>
                <AuthProvider>
                    <CustomerProvider>
                        <Routes>
                            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                            <Route path="/login" element={<LoginRoute><LoginPage /></LoginRoute>} />
                            <Route path="/register" element={<LoginRoute><RegisterPage /></LoginRoute>} />
                            <Route path="/logout" element={<LogoutPage />} />
                            <Route path="/list-customers" element={<PrivateRoute><ListCustomersPage /></PrivateRoute>} />
                            <Route path="/list-benefits" element={<PrivateRoute><ListFinancialsPage /></PrivateRoute>} />
                        </Routes>
                    </CustomerProvider>
                </AuthProvider>
            </BrowserRouter>
        </>
    )
}

export default App


