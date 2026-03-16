import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Edit2, Trash2 } from 'lucide-react';
import TransactionModal from '../components/TransactionModal';
import './Transactions.css';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);

    // Assume logged-in user ID is 1 for testing purposes; in real app, get from Auth Context
    const storedUserId = localStorage.getItem('userId');
    const parsedUserId = parseInt(storedUserId);
    const userId = !isNaN(parsedUserId) ? parsedUserId : 1;

    // Fetch transactions from backend
    const fetchTransactions = async () => {
        try {
            const response = await fetch(`http://localhost:8081/api/transactions?userId=${userId}`);
            if (response.ok) {
                const data = await response.json();
                setTransactions(data);
            } else {
                console.error("Failed to fetch transactions");
            }
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleAddClick = () => {
        setEditingTransaction(null);
        setShowModal(true);
    };

    const handleEditClick = (transaction) => {
        setEditingTransaction(transaction);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this transaction?")) return;

        try {
            const response = await fetch(`http://localhost:8081/api/transactions/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                fetchTransactions(); // Refresh list
            } else {
                alert("Failed to delete transaction");
            }
        } catch (error) {
            console.error("Error deleting transaction:", error);
        }
    };

    const handleSaveTransaction = async (formData) => {
        const url = editingTransaction
            ? `http://localhost:8081/api/transactions/${editingTransaction.id}`
            : `http://localhost:8081/api/transactions`;

        const method = editingTransaction ? 'PUT' : 'POST';

        const payload = {
            userId: userId,
            ...formData,
            amount: parseFloat(formData.amount)
        };

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                setShowModal(false);
                fetchTransactions(); // Refresh list
            } else {
                const errText = await response.text();
                alert(`Failed to save transaction: ${errText}`);
            }
        } catch (error) {
            console.error("Error saving transaction:", error);
        }
    };

    const filteredTransactions = transactions.filter(t => {
        const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' ? true : t.type === filterType;
        return matchesSearch && matchesType;
    });

    return (
        <div className="transactions-page">
            <header className="page-header">
                <div>
                    <h1>Transactions</h1>
                    <p>Manage and view your financial activity</p>
                </div>
                <button className="btn-primary" onClick={handleAddClick}>
                    <Plus size={20} />
                    Add Transaction
                </button>
            </header>

            <div className="controls-bar">
                <div className="search-box">
                    <Search className="search-icon" size={20} />
                    <input
                        type="text"
                        placeholder="Search transactions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-container">
                    <button className={`btn-outline ${showFilterDropdown ? 'active' : ''}`} onClick={() => setShowFilterDropdown(!showFilterDropdown)}>
                        <Filter size={20} />
                        Filter {filterType !== 'all' && `(${filterType})`}
                    </button>

                    {showFilterDropdown && (
                        <div className="filter-dropdown">
                            <div className="filter-header">Transaction Type</div>
                            <div className="filter-options">
                                <button className={`filter-option ${filterType === 'all' ? 'selected' : ''}`} onClick={() => { setFilterType('all'); setShowFilterDropdown(false); }}>All</button>
                                <button className={`filter-option ${filterType === 'income' ? 'selected' : ''}`} onClick={() => { setFilterType('income'); setShowFilterDropdown(false); }}>Income</button>
                                <button className={`filter-option ${filterType === 'expense' ? 'selected' : ''}`} onClick={() => { setFilterType('expense'); setShowFilterDropdown(false); }}>Expense</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="card">
                <table className="transaction-table">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                                    No transactions found.
                                </td>
                            </tr>
                        ) : (
                            filteredTransactions.map((t) => (
                                <tr key={t.id}>
                                    <td className="desc-cell">
                                        <div className="desc-text">{t.description}</div>
                                    </td>
                                    <td>
                                        <span className={`badge ${t.type === 'income' ? 'success' : ''}`}>
                                            {t.category}
                                        </span>
                                    </td>
                                    <td>{t.date}</td>
                                    <td className={t.type === 'income' ? 'positive' : 'negative'}>
                                        {t.type === 'income' ? '+' : '-'}${Math.abs(t.amount).toFixed(2)}
                                    </td>
                                    <td className="actions-cell">
                                        <button className="action-btn edit" onClick={() => handleEditClick(t)} title="Edit">
                                            <Edit2 size={16} />
                                        </button>
                                        <button className="action-btn delete" onClick={() => handleDelete(t.id)} title="Delete">
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <TransactionModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onSave={handleSaveTransaction}
                transaction={editingTransaction}
            />
        </div>
    );
};

export default Transactions;
