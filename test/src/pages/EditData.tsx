import React, { useEffect, useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonBackButton, IonButtons, useIonToast} from '@ionic/react';
import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Transaction, Status } from '../types';
import { useHistory, useParams } from 'react-router';

const EditData: React.FC = () => {
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [present] = useIonToast();
  const history = useHistory();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const transactionRef = doc(db, 'transactions', id);
        const transactionSnap = await getDoc(transactionRef);
        
        if (transactionSnap.exists()) {
          const transactionData = transactionSnap.data() as Transaction;
          setTransaction({
            ...transactionData,
            docId: transactionSnap.id
          });
        }

        const statusesRef = collection(db, 'statuses');
        const statusSnap = await getDocs(statusesRef);
        const statusData: Status[] = [];
        statusSnap.forEach((doc) => {
          statusData.push({ ...doc.data() as Status });
        });
        setStatuses(statusData);
      } catch (error) {
        console.error('Error fetching data:', error);
        present({
          message: 'Error loading transaction data',
          duration: 2000,
          color: 'danger'
        });
      }
    };

    fetchData();
  }, [id, present]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transaction) return;

    try {
      const transactionRef = doc(db, 'transactions', id);
      const updateData = {
        productID: transaction.productID,
        productName: transaction.productName,
        amount: transaction.amount,
        customerName: transaction.customerName,
        status: transaction.status,
        updateOn: new Date().toISOString()
      };

      await updateDoc(transactionRef, updateData);
      
      present({
        message: 'Transaction updated successfully',
        duration: 2000,
        color: 'success'
      });

      history.push(`/home/data/view/${id}`);
    } catch (error) {
      console.error('Error updating document: ', error);
      present({
        message: 'Error updating transaction',
        duration: 2000,
        color: 'danger'
      });
    }
  };

  if (!transaction) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref={`/home/data/view/${id}`} />
            </IonButtons>
            <IonTitle>Edit Transaction</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="p-4">Loading...</div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home/data/view" />
          </IonButtons>
          <IonTitle>Edit Transaction</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <form onSubmit={handleSubmit} className="ion-padding">
          <IonItem>
            <IonLabel position="stacked">Product ID</IonLabel>
            <IonInput
              value={transaction.productID}
              onIonChange={e => setTransaction({
                ...transaction,
                productID: e.detail.value || ''
              })}
              required
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Product Name</IonLabel>
            <IonInput
              value={transaction.productName}
              onIonChange={e => setTransaction({
                ...transaction,
                productName: e.detail.value || ''
              })}
              required
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Amount</IonLabel>
            <IonInput
              type="number"
              value={transaction.amount}
              onIonChange={e => setTransaction({
                ...transaction,
                amount: e.detail.value || ''
              })}
              required
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Customer Name</IonLabel>
            <IonInput
              value={transaction.customerName}
              onIonChange={e => setTransaction({
                ...transaction,
                customerName: e.detail.value || ''
              })}
              required
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Status</IonLabel>
            <IonSelect
              value={transaction.status}
              onIonChange={e => setTransaction({
                ...transaction,
                status: e.detail.value
              })}
            >
              {statuses.map((status) => (
                <IonSelectOption key={status.id} value={status.id}>
                  {status.name}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          <div className="ion-padding">
            <IonButton type="submit" expand="block">
              Update Transaction
            </IonButton>
          </div>
        </form>
      </IonContent>
    </IonPage>
  );
};
export default EditData;