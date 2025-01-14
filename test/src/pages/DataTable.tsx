import React, { useEffect, useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonGrid, IonRow, IonCol, IonLabel, IonSearchbar, IonSelect, IonSelectOption} from '@ionic/react';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase';
import { Transaction, Status } from '../types';
import { useHistory } from 'react-router';

const DataTable: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<number | null>(null);
  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      const transactionsRef = collection(db, 'transactions');
      const statusesRef = collection(db, 'statuses');
      
      let q = query(transactionsRef);
      if (statusFilter !== null) {
        q = query(transactionsRef, where('status', '==', statusFilter));
      }
      
      const transactionSnap = await getDocs(q);
      const statusSnap = await getDocs(statusesRef);
      
      const transactionData: Transaction[] = [];
      transactionSnap.forEach((doc) => {
        transactionData.push(doc.data() as Transaction);
      });
      
      const statusData: Status[] = [];
      statusSnap.forEach((doc) => {
        statusData.push(doc.data() as Status);
      });
      
      setTransactions(transactionData);
      setStatuses(statusData);
    };

    fetchData();
  }, [statusFilter]);

  const filteredTransactions = transactions.filter((transaction) => {
    const searchLower = searchText.toLowerCase();
    return (
      transaction.productName.toLowerCase().includes(searchLower) ||
      transaction.customerName.toLowerCase().includes(searchLower) ||
      transaction.productID.toLowerCase().includes(searchLower)
    );
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Transactions</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="p-4">
          <IonButton onClick={() => history.push('/home/add')}>
            Add New Transaction
          </IonButton>
          
          <div className="my-4">
            <IonSearchbar
              value={searchText}
              onIonChange={e => setSearchText(e.detail.value!)}
              placeholder="Search transactions..."
            />
            
            <IonSelect
              placeholder="Filter by status"
              value={statusFilter}
              onIonChange={e => setStatusFilter(e.detail.value)}
            >
              <IonSelectOption value={null}>All</IonSelectOption>
              {statuses.map((status) => (
                <IonSelectOption key={status.id} value={status.id}>
                  {status.name}
                </IonSelectOption>
              ))}
            </IonSelect>
          </div>

          <IonGrid>
            <IonRow>
              <IonCol>ID</IonCol>
              <IonCol>Product ID</IonCol>
              <IonCol>Product Name</IonCol>
              <IonCol>Amount</IonCol>
              <IonCol>Customer</IonCol>
              <IonCol>Status</IonCol>
              <IonCol>Date</IonCol>
              <IonCol>Actions</IonCol>
            </IonRow>
            
            {filteredTransactions.map((transaction) => (
              <IonRow key={transaction.id}>
                <IonCol>{transaction.id}</IonCol>
                <IonCol>{transaction.productID}</IonCol>
                <IonCol>{transaction.productName}</IonCol>
                <IonCol>{transaction.amount}</IonCol>
                <IonCol>{transaction.customerName}</IonCol>
                <IonCol>
                  {statuses.find(s => s.id === transaction.status)?.name}
                </IonCol>
                <IonCol>{new Date(transaction.transactionDate).toLocaleDateString()}</IonCol>
                <IonCol>
                  <IonButton
                    size="small"
                    onClick={() => history.push(`/home/view/${transaction.id}`)}
                  >
                    View
                  </IonButton>
                  <IonButton
                    size="small"
                    onClick={() => history.push(`/home/edit/${transaction.id}`)}
                  >
                    Edit
                  </IonButton>
                </IonCol>
              </IonRow>
            ))}
          </IonGrid>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default DataTable;