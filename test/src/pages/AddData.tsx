import React, { useEffect, useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonBackButton, IonButtons} from '@ionic/react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useHistory } from 'react-router';

const AddData: React.FC = () => {
  const [formData, setFormData] = useState({
    productID: '',
    productName: '',
    amount: '',
    customerName: '',
    status: 0
  });

  const history = useHistory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const transactionsRef = collection(db, 'transactions');
      
      const newTransaction = {
        ...formData,
        id: String(Math.floor(1000 + Math.random() * 9000)),
        transactionDate: new Date().toISOString(),
        createBy: 'system',
        createOn: new Date().toISOString()
      };

      await addDoc(transactionsRef, newTransaction);
      alert('Transaction added successfully!');
      history.push('/home/data');
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert('Error adding transaction. Please try again.');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
            <IonButton routerLink="/home/data">Go to Data Table</IonButton>
          </IonButtons>
          <IonTitle>Add New Transaction</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <form onSubmit={handleSubmit} className="p-4">
          <IonItem>
            <IonLabel position="floating">Product ID</IonLabel>
            <IonInput
              value={formData.productID}
              onIonChange={e => setFormData({...formData, productID: e.detail.value!})}
              required
            />
          </IonItem>

          <IonItem>
            <IonLabel position="floating">Product Name</IonLabel>
            <IonInput
              value={formData.productName}
              onIonChange={e => setFormData({...formData, productName: e.detail.value!})}
              required
            />
          </IonItem>

          <IonItem>
            <IonLabel position="floating">Amount</IonLabel>
            <IonInput
              type="number"
              value={formData.amount}
              onIonChange={e => setFormData({...formData, amount: e.detail.value!})}
              required
            />
          </IonItem>

          <IonItem>
            <IonLabel position="floating">Customer Name</IonLabel>
            <IonInput
              value={formData.customerName}
              onIonChange={e => setFormData({...formData, customerName: e.detail.value!})}
              required
            />
          </IonItem>

          <IonItem>
            <IonLabel>Status</IonLabel>
            <IonSelect
              value={formData.status}
              onIonChange={e => setFormData({...formData, status: e.detail.value})}
            >
              <IonSelectOption value={0}>SUCCESS</IonSelectOption>
              <IonSelectOption value={1}>FAILED</IonSelectOption>
            </IonSelect>
          </IonItem>

          <div className="ion-padding">
            <IonButton type="submit" expand="block">Save Transaction</IonButton>
          </div>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default AddData;