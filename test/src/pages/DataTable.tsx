import React, { useEffect, useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonGrid, IonRow, IonCol, IonLoading, IonButtons, IonBackButton} from '@ionic/react';
import { collection, getDocs } from 'firebase/firestore';
import { db, initializeFirebaseData } from '../firebase';
import { useHistory } from 'react-router';

interface Transaction {
  id: number;
  productID: string;
  productName: string;
  amount: string;
  customerName: string;
  status: number;
  transactionDate: string;
  createBy: string;
  createOn: string;
  docId: string;
}

const DataTable: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const transactionsRef = collection(db, 'transactions');
      const querySnapshot = await getDocs(transactionsRef);
      
      const transactionData: Transaction[] = [];
      querySnapshot.forEach((doc) => {
        transactionData.push({
          ...doc.data() as Transaction,
          docId: doc.id
        });
      });
      
      setTransactions(transactionData);
      console.log('Fetched transactions:', transactionData);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      alert('Error fetching transactions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleInitializeData = async () => {
    try {
      setLoading(true);
      const success = await initializeFirebaseData();
      if (success) {
        alert('Database initialized successfully!');
        fetchTransactions(); 
      } else {
        alert('Failed to initialize database. Please try again.');
      }
    } catch (error) {
      console.error('Error initializing database:', error);
      alert('Error initializing database. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Transactions</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => history.push('/home/add')}>
              Add New
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      
      <IonContent>
        <IonLoading isOpen={loading} message="Please wait..." />
        
        <div className="p-4">
          <IonButton onClick={handleInitializeData} color="secondary">
            Initialize Sample Data
          </IonButton>
          <IonButton onClick={fetchTransactions}>
            Refresh Data
          </IonButton>

          {transactions.length === 0 ? (
            <div className="p-4 text-center">
              <p>No transactions found. Click "Initialize Sample Data" to add sample data.</p>
            </div>
          ) : (
            <IonGrid className="mt-4">
              <IonRow>
                <IonCol>ID</IonCol>
                <IonCol>Product ID</IonCol>
                <IonCol>Product Name</IonCol>
                <IonCol>Amount</IonCol>
                <IonCol>Customer</IonCol>
                <IonCol>Status</IonCol>
                <IonCol>Transaction Date</IonCol>
                <IonCol>Actions</IonCol>
              </IonRow>

              {transactions.map((transaction) => (
                <IonRow key={transaction.id}>
                  <IonCol>{transaction.id}</IonCol>
                  <IonCol>{transaction.productID}</IonCol>
                  <IonCol>{transaction.productName}</IonCol>
                  <IonCol>{transaction.amount}</IonCol>
                  <IonCol>{transaction.customerName}</IonCol>
                  <IonCol>{transaction.status === 0 ? 'SUCCESS' : 'FAILED'}</IonCol>
                  <IonCol>
                    {new Date(transaction.transactionDate).toLocaleDateString()}
                  </IonCol>
                  <IonCol>
                    <IonButton
                      size="small"
                      onClick={() => history.push(`/home/data/view/${transaction.docId}`)}
                    >
                      View
                    </IonButton>
                    <IonButton
                      size="small"
                      onClick={() => history.push(`/home/data/edit/${transaction.docId}`)}
                    >
                      Edit
                    </IonButton>
                  </IonCol>
                </IonRow>
              ))}
            </IonGrid>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default DataTable;