import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, CreditCard, ShoppingBag, Coffee, MonitorPlay } from 'lucide-react';
import './Dashboard.css';

const data = [
    { name: 'Mon', income: 4000, expense: 2400 },
    { name: 'Tue', income: 3000, expense: 1398 },
    { name: 'Wed', income: 2000, expense: 9800 },
    { name: 'Thu', income: 2780, expense: 3908 },
    { name: 'Fri', income: 1890, expense: 4800 },
    { name: 'Sat', income: 2390, expense: 3800 },
    { name: 'Sun', income: 3490, expense: 4300 },
];

const Dashboard = () => {
    return (
        <div className="dashboard">
            <header className="page-header">
                <div>
                    <h1>Overview</h1>
                    <p>Welcome back, Sravya! Here's your financial summary.</p>
                </div>
                <div className="date-picker">
                    <span>October 2023</span>
                </div>
            </header>

            <div className="stats-grid">
                <div className="card stat-card">
                    <div className="stat-icon-wrapper income">
                        <TrendingUp size={24} />
                    </div>
                    <div className="stat-content">
                        <h3>Total Income</h3>
                        <p className="stat-value">$12,450.00</p>
                        <span className="stat-change positive">↑ 14% vs last month</span>
                    </div>
                </div>

                <div className="card stat-card">
                    <div className="stat-icon-wrapper expense">
                        <TrendingDown size={24} />
                    </div>
                    <div className="stat-content">
                        <h3>Total Expenses</h3>
                        <p className="stat-value">$8,320.50</p>
                        <span className="stat-change negative">↑ 5% vs last month</span>
                    </div>
                </div>

                <div className="card stat-card">
                    <div className="stat-icon-wrapper balance">
                        <DollarSign size={24} />
                    </div>
                    <div className="stat-content">
                        <h3>Net Balance</h3>
                        <p className="stat-value">$4,129.50</p>
                        <span className="stat-change neutral">→ Stable</span>
                    </div>
                </div>
            </div>

            <div className="dashboard-content-grid">
                <div className="card chart-card">
                    <div className="card-header">
                        <h3>Financial Overview</h3>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="name"
                                    stroke="var(--text-muted)"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: 'var(--text-muted)' }}
                                    dy={10}
                                />
                                <YAxis
                                    stroke="var(--text-muted)"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: 'var(--text-muted)' }}
                                    tickFormatter={(value) => `$${value}`}
                                />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                        borderRadius: '12px',
                                        border: '1px solid var(--border)',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
                                        color: 'var(--text)'
                                    }}
                                    itemStyle={{ fontWeight: 500 }}
                                />
                                <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                                <Area type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card recent-transactions-card">
                    <div className="card-header">
                        <h3>Recent Transactions</h3>
                        <button className="btn-text">View All</button>
                    </div>
                    <div className="transaction-list">

                        <div className="transaction-item">
                            <div className="transaction-icon bg-food">
                                <ShoppingBag size={18} />
                            </div>
                            <div className="transaction-details">
                                <p className="transaction-name">Grocery Shopping</p>
                                <p className="transaction-date">Oct 24, 2023</p>
                            </div>
                            <div className="transaction-amount negative">
                                -$120.50
                            </div>
                        </div>

                        <div className="transaction-item">
                            <div className="transaction-icon bg-income">
                                <CreditCard size={18} />
                            </div>
                            <div className="transaction-details">
                                <p className="transaction-name">Freelance Payment</p>
                                <p className="transaction-date">Oct 23, 2023</p>
                            </div>
                            <div className="transaction-amount positive">
                                +$850.00
                            </div>
                        </div>

                        <div className="transaction-item">
                            <div className="transaction-icon bg-entertainment">
                                <MonitorPlay size={18} />
                            </div>
                            <div className="transaction-details">
                                <p className="transaction-name">Netflix Subscription</p>
                                <p className="transaction-date">Oct 21, 2023</p>
                            </div>
                            <div className="transaction-amount negative">
                                -$15.99
                            </div>
                        </div>

                        <div className="transaction-item">
                            <div className="transaction-icon bg-coffee">
                                <Coffee size={18} />
                            </div>
                            <div className="transaction-details">
                                <p className="transaction-name">Starbucks</p>
                                <p className="transaction-date">Oct 20, 2023</p>
                            </div>
                            <div className="transaction-amount negative">
                                -$5.40
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
