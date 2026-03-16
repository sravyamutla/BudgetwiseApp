import React, { useState, useEffect } from 'react';
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { TrendingUp, PieChart as PieChartIcon, BarChart2 } from 'lucide-react';
import './Analytics.css';

// Premium color palette for charts
const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6', '#14b8a6', '#f97316'];

const Analytics = () => {
    const [transactions, setTransactions] = useState([]);

    // Aggregated states
    const [categoryData, setCategoryData] = useState([]);
    const [incomeExpenseData, setIncomeExpenseData] = useState([]);
    const [monthlyTrendData, setMonthlyTrendData] = useState([]);

    const storedUserId = localStorage.getItem('userId');
    const parsedUserId = parseInt(storedUserId);
    const userId = !isNaN(parsedUserId) ? parsedUserId : 1;

    // Fetch all transactions
    useEffect(() => {
        const fetchAllTransactions = async () => {
            try {
                const res = await fetch(`http://localhost:8081/api/transactions?userId=${userId}`);
                if (res.ok) {
                    const data = await res.json();
                    setTransactions(data);
                    processChartData(data);
                }
            } catch (error) {
                console.error("Error fetching transactions for analytics:", error);
            }
        };

        fetchAllTransactions();
    }, [userId]);

    // Process data for charts
    const processChartData = (data) => {
        if (!data || data.length === 0) return;

        // 1. Category-wise Spending (Pie Chart) -> Only 'expense'
        const categoryMap = {};
        data.forEach(t => {
            if (t.type === 'expense') {
                categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
            }
        });
        const pieData = Object.keys(categoryMap).map(cat => ({
            name: cat,
            value: categoryMap[cat]
        })).sort((a, b) => b.value - a.value);
        setCategoryData(pieData);

        // Group by Month (YYYY-MM) helper
        const getMonthYear = (dateStr) => {
            const d = new Date(dateStr);
            const shortMonth = d.toLocaleString('default', { month: 'short' });
            return `${shortMonth} ${d.getFullYear()}`;
        };
        const getSortableMonthYear = (dateStr) => {
            return dateStr.substring(0, 7); // YYYY-MM
        };

        const monthlyGroups = {};

        data.forEach(t => {
            const displayMonth = getMonthYear(t.date);
            const sortMonth = getSortableMonthYear(t.date);

            if (!monthlyGroups[sortMonth]) {
                monthlyGroups[sortMonth] = { sort: sortMonth, name: displayMonth, income: 0, expense: 0 };
            }

            if (t.type === 'income') {
                monthlyGroups[sortMonth].income += t.amount;
            } else if (t.type === 'expense') {
                monthlyGroups[sortMonth].expense += t.amount;
            }
        });

        // Convert to array and sort chronologically
        const sortedMonths = Object.values(monthlyGroups).sort((a, b) => a.sort.localeCompare(b.sort));

        // 2. Income vs Expenses (Bar Chart)
        // 3. Monthly Spending Comparison (Line/Area Chart)
        setIncomeExpenseData(sortedMonths);
        setMonthlyTrendData(sortedMonths); // We can just reuse the same aggregated monthly data
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="label">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} className="desc" style={{ color: entry.color }}>
                            {entry.name}: ${entry.value.toFixed(2)}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="analytics-dashboard-wrapper">
            {/* Decorative background blobs for glassmorphism */}
            <div className="bg-blob blob-1"></div>
            <div className="bg-blob blob-2"></div>
            <div className="bg-blob blob-3"></div>

            <div className="analytics-dashboard">
                <header className="page-header simple-header">
                    <div className="header-left">
                        <h1>Financial Analytics</h1>
                    </div>
                </header>

                {transactions.length === 0 ? (
                    <div className="empty-state chart-card">
                        <p>No transaction data available yet. Start adding transactions to see your trends!</p>
                    </div>
                ) : (
                    <div className="analytics-content">

                        <div className="charts-grid">
                            {/* Monthly Trend - Area Chart */}
                            <div className="chart-card full-width">
                                <div className="chart-header">
                                    <div className="chart-icon-wrapper"><TrendingUp size={24} /></div>
                                    <h2>Monthly Spending Trend</h2>
                                </div>
                                <div className="chart-container">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={monthlyTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorExpenseArea" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.5} />
                                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                            <XAxis dataKey="name" tick={{ fill: '#6b7280' }} tickLine={false} axisLine={false} dy={10} />
                                            <YAxis tickFormatter={(val) => `$${val}`} tick={{ fill: '#6b7280' }} tickLine={false} axisLine={false} dx={-10} />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Area
                                                type="monotone"
                                                dataKey="expense"
                                                name="Expenses"
                                                stroke="#8b5cf6"
                                                strokeWidth={3}
                                                fillOpacity={1}
                                                fill="url(#colorExpenseArea)"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Income vs Expense - Bar Chart */}
                            <div className="chart-card">
                                <div className="chart-header">
                                    <div className="chart-icon-wrapper"><BarChart2 size={24} /></div>
                                    <h2>Income vs Expenses</h2>
                                </div>
                                <div className="chart-container">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={incomeExpenseData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                            <XAxis dataKey="name" tick={{ fill: '#6b7280' }} tickLine={false} axisLine={false} dy={10} />
                                            <YAxis tickFormatter={(val) => `$${val}`} tick={{ fill: '#6b7280' }} tickLine={false} axisLine={false} />
                                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                                            <Legend verticalAlign="top" height={36} iconType="circle" />
                                            <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={50} />
                                            <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={50} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Category Mix - Pie Chart */}
                            <div className="chart-card">
                                <div className="chart-header">
                                    <div className="chart-icon-wrapper"><PieChartIcon size={24} /></div>
                                    <h2>Spending by Category</h2>
                                </div>
                                <div className="chart-container">
                                    {categoryData.length === 0 ? (
                                        <div className="empty-state">No expense category data found.</div>
                                    ) : (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={categoryData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={80}
                                                    outerRadius={110}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                    stroke="none"
                                                >
                                                    {categoryData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip content={<CustomTooltip />} />
                                                <Legend
                                                    layout="vertical"
                                                    verticalAlign="middle"
                                                    align="right"
                                                    iconType="circle"
                                                    wrapperStyle={{ fontSize: '0.9rem', color: '#4b5563' }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Analytics;
