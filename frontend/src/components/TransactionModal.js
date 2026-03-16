import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import './TransactionModal.css';

const TransactionModal = ({ show, onClose, onSave, transaction }) => {
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        date: '',
        category: '',
        type: 'expense'
    });

    useEffect(() => {
        if (transaction) {
            setFormData({
                description: transaction.description || '',
                amount: transaction.amount || '',
                date: transaction.date || '',
                category: transaction.category || '',
                type: transaction.type || 'expense'
            });
        } else {
            setFormData({
                description: '',
                amount: '',
                date: new Date().toISOString().split('T')[0],
                category: '',
                type: 'expense'
            });
        }
    }, [transaction, show]);

    if (!show) {
        return null;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>
                    <X size={20} />
                </button>
                <h2>{transaction ? 'Edit Transaction' : 'Add Transaction'}</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group row">
                        <label>Type</label>
                        <div className="type-toggle">
                            <button
                                type="button"
                                className={`type-btn ${formData.type === 'expense' ? 'active-expense' : ''}`}
                                onClick={() => setFormData({ ...formData, type: 'expense' })}
                            >
                                Expense
                            </button>
                            <button
                                type="button"
                                className={`type-btn ${formData.type === 'income' ? 'active-income' : ''}`}
                                onClick={() => setFormData({ ...formData, type: 'income' })}
                            >
                                Income
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            placeholder="Movie tickets, Groceries..."
                        />
                    </div>

                    <div className="form-group">
                        <label>Amount</label>
                        <input
                            type="number"
                            step="0.01"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            required
                            placeholder="0.00"
                        />
                    </div>

                    <div className="form-group">
                        <label>Date</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Category</label>
                        <select name="category" value={formData.category} onChange={handleChange} required>
                            <option value="">Select Category</option>
                            <option value="Food">Food</option>
                            <option value="Transport">Transport</option>
                            <option value="Entertainment">Entertainment</option>
                            <option value="Health">Health</option>
                            <option value="Income">Income</option>
                            <option value="Housing">Housing</option>
                            <option value="Utilities">Utilities</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-outline" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-primary">Save Transaction</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransactionModal;
