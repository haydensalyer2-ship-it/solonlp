import React, { useEffect, useState } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  updateDoc, 
  doc, 
  Timestamp,
  deleteDoc
} from 'firebase/firestore';
import { signOut, User as FirebaseUser } from 'firebase/auth';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { LogOut, Trash2, Clock, MapPin, Phone, User as UserIcon } from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  phone: string;
  address: string;
  claimFiled: string;
  approved: string;
  createdAt: Timestamp;
  status: string;
}

export function AdminPanel({ user }: { user: FirebaseUser }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // Listen to leads
    const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Lead));
      setLeads(docs);
      setErrorMsg(null);
    }, (error: any) => {
      console.error(error);
      if (error.code !== 'permission-denied') {
        handleFirestoreError(error, OperationType.LIST, 'leads');
      } else {
        setErrorMsg("You do not have admin permissions to view leads.");
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = () => signOut(auth);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'leads', id), {
        status: newStatus
      });
    } catch (error: any) {
      handleFirestoreError(error, OperationType.UPDATE, `leads/${id}`);
    }
  };

  const deleteLead = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    try {
      await deleteDoc(doc(db, 'leads', id));
    } catch (error: any) {
      handleFirestoreError(error, OperationType.DELETE, `leads/${id}`);
    }
  };

  return (
    <div className="bg-slate-100 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <img 
                src="https://tartanbuildersinc.com/wp-content/uploads/2022/06/logo_material_original_900_crop_all_objects_transparent_png.webp" 
                alt="Tartan Builders Inc." 
                className="h-10 w-auto object-contain"
              />
            </div>
            <h2 className="text-2xl font-bold font-display text-slate-900">Lead Dashboard</h2>
            <p className="text-sm font-medium text-slate-500">Logged in as {user.email}</p>
          </div>
          <button 
            onClick={logout}
            className="text-sm text-slate-500 hover:text-red-600 border-slate-300 font-medium flex items-center gap-1 bg-white border px-4 py-2 rounded-lg shadow-sm transition-all hover:border-red-200 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        {leads.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center text-slate-500 font-medium">
            No leads received yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {leads.map((lead) => (
              <div key={lead.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-slate-900 flex items-center gap-1.5"><UserIcon className="w-4 h-4 text-slate-400" /> {lead.name}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1"><Clock className="w-3.5 h-3.5 text-slate-400" /> {lead.createdAt?.toDate().toLocaleString()}</p>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                    lead.status === 'new' ? 'bg-blue-100 text-blue-700' :
                    lead.status === 'contacted' ? 'bg-amber-100 text-amber-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {lead.status.toUpperCase()}
                  </span>
                </div>
                
                <div className="space-y-2 mb-6">
                  <p className="text-sm text-slate-700 flex items-center gap-1.5"><Phone className="w-4 h-4 text-slate-400" /> {lead.phone}</p>
                  <p className="text-sm text-slate-700 flex items-start gap-1.5"><MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" /> {lead.address}</p>
                </div>

                <div className="bg-slate-50 rounded-lg p-3 mb-4 text-sm font-medium border border-slate-100">
                  <div className="grid grid-cols-2 gap-2">
                    <p className="text-slate-600">Claim: <span className="text-slate-900">{lead.claimFiled}</span></p>
                    <p className="text-slate-600">Approved: <span className="text-slate-900">{lead.approved || 'n/a'}</span></p>
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                  <select 
                    value={lead.status}
                    onChange={(e) => updateStatus(lead.id, e.target.value)}
                    className="text-sm border border-slate-200 rounded-md py-1.5 px-3 bg-slate-50 focus:ring-2 focus:ring-blue-600 outline-none font-medium"
                  >
                    <option value="new">New Lead</option>
                    <option value="contacted">Contacted</option>
                    <option value="closed">Closed / Won</option>
                  </select>
                  <button onClick={() => deleteLead(lead.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-md transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
