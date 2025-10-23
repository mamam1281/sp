// components/AdminPage.tsx
import React, { useState, useEffect } from 'react';
import { localBackend } from '../services/localBackend';
import { User, Match, Bet } from '../types';
import { SpinnerIcon, UserIcon } from './icons';

const AdminPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [bets, setBets] = useState<Bet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const loadData = () => {
    try {
      setIsLoading(true);
      const allUsers = localBackend.getAllUsers();
      const allBets = localBackend.getAllBets().sort((a, b) => b.timestamp - a.timestamp);
      setUsers(allUsers);
      setBets(allBets);
    } catch (e) {
      setError("Failed to load admin data.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadData();
  }, []);
  
  const handleOpenUserModal = (user: User | null) => {
    setEditingUser(user);
    setIsUserModalOpen(true);
  };
  
  const handleCloseUserModal = () => {
    setIsUserModalOpen(false);
    setEditingUser(null);
  };
  
  const handleSaveUser = (userToSave: User) => {
    if (userToSave.id.startsWith('new-')) {
      const {id, ...newUser} = userToSave;
      localBackend.addUser(newUser);
    } else {
      localBackend.updateUser(userToSave);
    }
    loadData();
    handleCloseUserModal();
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user? This cannot be undone.")) {
      localBackend.deleteUser(userId);
      loadData();
    }
  };
  
  const handleResolveBet = (bet: Bet, status: 'won' | 'lost') => {
    if (!window.confirm(`Are you sure you want to resolve this bet as ${status.toUpperCase()}?`)) return;

    if (status === 'won') {
        const user = users.find(u => u.id === bet.userId);
        if (user) {
            const updatedUser = { ...user, gold: user.gold + bet.payout };
            localBackend.updateUser(updatedUser);
        }
    }
    const updatedBet = { ...bet, status };
    localBackend.updateBet(updatedBet);
    loadData();
  };
  
  const handleDeleteBet = (betId: string) => {
      if (window.confirm("Are you sure you want to delete this bet?")) {
          const betToDelete = bets.find(b => b.id === betId);
          // Optional: Refund user if the bet was pending
          if (betToDelete && betToDelete.status === 'pending') {
              const user = users.find(u => u.id === betToDelete.userId);
              if (user) {
                  const updatedUser = { ...user, gold: user.gold + betToDelete.amount };
                  localBackend.updateUser(updatedUser);
              }
          }
          localBackend.deleteBet(betId);
          loadData();
      }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><SpinnerIcon className="w-12 h-12 text-brand-light-green"/></div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 text-white">
      <h1 className="text-3xl font-bold text-brand-gold mb-6">Admin Dashboard</h1>

      {isUserModalOpen && (
        <UserEditModal 
          user={editingUser} 
          onClose={handleCloseUserModal} 
          onSave={handleSaveUser} 
        />
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Users Section */}
        <div className="bg-brand-dark-green p-6 rounded-lg shadow-xl xl:col-span-1">
          <div className="flex justify-between items-center mb-4 border-b-2 border-brand-light-green/30 pb-2">
             <h2 className="text-2xl font-semibold text-brand-light-green">Users ({users.length})</h2>
             <button onClick={() => handleOpenUserModal(null)} className="px-3 py-1 bg-brand-green text-black font-bold text-sm rounded-md hover:bg-brand-light-green transition">
                Add User
             </button>
          </div>
          <div className="max-h-[600px] overflow-y-auto pr-2">
            <ul className="space-y-3">
              {users.map(user => (
                <li key={user.id} className="p-3 bg-brand-black rounded-md">
                   <div className="flex justify-between items-start">
                        <div>
                            <p className="font-bold">{user.name} <span className="text-sm text-gray-400">({user.email})</span></p>
                            <p className="text-sm text-brand-gold">{user.gold.toLocaleString()} G</p>
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                            {user.isPremium && <span className="px-2 py-1 text-xs font-bold text-black bg-yellow-400 rounded-full">PREMIUM</span>}
                            {user.isAdmin && <span className="px-2 py-1 text-xs font-bold text-white bg-red-600 rounded-full">ADMIN</span>}
                        </div>
                   </div>
                   <div className="flex justify-end items-center mt-2 space-x-2">
                       <button onClick={() => handleOpenUserModal(user)} className="text-xs px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded-md">Edit</button>
                       <button onClick={() => handleDeleteUser(user.id)} className="text-xs px-3 py-1 bg-red-700 hover:bg-red-600 rounded-md">Delete</button>
                   </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* All Bets Section */}
        <div className="bg-brand-dark-green p-6 rounded-lg shadow-xl xl:col-span-2">
          <h2 className="text-2xl font-semibold mb-4 text-brand-light-green border-b-2 border-brand-light-green/30 pb-2">All Bets ({bets.length})</h2>
          <div className="max-h-[600px] overflow-y-auto pr-2">
             {bets.length > 0 ? (
                <ul className="space-y-3">
                {bets.map(bet => {
                   const betUser = users.find(u => u.id === bet.userId);
                   return (
                    <li key={bet.id} className="p-3 bg-brand-black rounded-md">
                       <div className="flex flex-wrap justify-between items-start gap-2">
                            <div>
                                <p className="font-bold flex items-center"><UserIcon className="w-4 h-4 mr-2 text-gray-400"/>{betUser?.name || 'Unknown User'}</p>
                                <p className="text-sm text-gray-400 mt-1">Prediction: <span className="font-semibold text-white">{bet.prediction}</span></p>
                                <p className="text-xs text-gray-500 mt-1">Match ID: {bet.matchId}</p>
                            </div>
                            <div className="flex items-start space-x-4">
                               <div className="text-right">
                                  <p className="text-xs text-gray-400">Bet / Payout</p>
                                  <p className="font-bold text-brand-gold">{bet.amount.toLocaleString()}G / {bet.payout.toLocaleString()}G</p>
                               </div>
                               <div>
                                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${bet.status === 'pending' ? 'bg-yellow-500/80 text-black' : bet.status === 'won' ? 'bg-green-500/80 text-white' : 'bg-red-500/80 text-white'}`}>{bet.status.toUpperCase()}</span>
                               </div>
                            </div>
                       </div>
                       {bet.status === 'pending' && (
                        <div className="flex justify-end items-center mt-2 space-x-2">
                            <button onClick={() => handleResolveBet(bet, 'won')} className="text-xs px-3 py-1 bg-green-600 hover:bg-green-500 rounded-md">Set as Won</button>
                            <button onClick={() => handleResolveBet(bet, 'lost')} className="text-xs px-3 py-1 bg-red-700 hover:bg-red-600 rounded-md">Set as Lost</button>
                            <button onClick={() => handleDeleteBet(bet.id)} className="text-xs px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded-md">Delete Bet</button>
                        </div>
                       )}
                    </li>
                   )
                })}
                </ul>
             ) : (
                <p className="text-gray-400">No bets have been placed yet.</p>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};


const UserEditModal: React.FC<{ user: User | null; onClose: () => void; onSave: (user: User) => void; }> = ({ user, onClose, onSave }) => {
    const [formData, setFormData] = useState<User>(user || { id: `new-${Date.now()}`, email: '', password: '', name: '', gold: 0, isAdmin: false, isPremium: false });
    const isNewUser = !user;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else if (type === 'number') {
            setFormData(prev => ({ ...prev, [name]: parseInt(value, 10) || 0 }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-brand-dark-green rounded-lg shadow-2xl p-6 w-full max-w-md text-white border border-brand-light-green/20" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-4">{isNewUser ? 'Create New User' : 'Edit User'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 mt-1 bg-brand-black rounded-md border border-gray-600" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 mt-1 bg-brand-black rounded-md border border-gray-600" required />
                    </div>
                    {isNewUser && (
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Password</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full p-2 mt-1 bg-brand-black rounded-md border border-gray-600" required />
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Gold</label>
                        <input type="number" name="gold" value={formData.gold} onChange={handleChange} className="w-full p-2 mt-1 bg-brand-black rounded-md border border-gray-600" required />
                    </div>
                    <div className="flex justify-between items-center">
                        <label className="flex items-center space-x-2">
                            <input type="checkbox" name="isPremium" checked={formData.isPremium} onChange={handleChange} className="h-5 w-5 rounded bg-brand-black border-gray-600 text-brand-green focus:ring-brand-green" />
                            <span>Premium</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input type="checkbox" name="isAdmin" checked={formData.isAdmin} onChange={handleChange} className="h-5 w-5 rounded bg-brand-black border-gray-600 text-brand-red focus:ring-brand-red" />
                            <span>Admin</span>
                        </label>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-md">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-brand-green text-black font-bold hover:bg-brand-light-green rounded-md">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export default AdminPage;