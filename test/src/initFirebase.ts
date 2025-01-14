import { collection, addDoc, getDocs, query, where, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';

const viewData = {
    "data": [
      {
         "id": 1372,
         "productID": "10001",
         "productName": "Test 1",
         "amount": "1000",
         "customerName" : "abc",
         "status": 0,
         "transactionDate": "2022-07-10 11:14:52",
         "createBy" : "abc",
         "createOn" : "2022-07-10 11:14:52"
      },
      {
         "id": 1373,
         "productID": "10002",
         "productName": "Test 2",
         "amount": "2000",
         "customerName" : "abc",
         "status": 0,
         "transactionDate": "2022-07-11 13:14:52",
         "createBy" : "abc",
         "createOn" : "2022-07-10 13:14:52"
      },
      {
         "id": 1374,
         "productID": "10001",
         "productName": "Test 1",
         "amount": "1000",
         "customerName" : "abc",
         "status": 0,
         "transactionDate": "2022-08-10 12:14:52",
         "createBy" : "abc",
         "createOn" : "2022-07-10 12:14:52"
      },
      {
         "id": 1375,
         "productID": "10002",
         "productName": "Test 2",
         "amount": "1000",
         "customerName" : "abc",
         "status": 1,
         "transactionDate": "2022-08-10 13:10:52",
         "createBy" : "abc",
         "createOn" : "2022-07-10 13:10:52"
      },
      {
         "id": 1376,
         "productID": "10001",
         "productName": "Test 1",
         "amount": "1000",
         "customerName" : "abc",
         "status": 0,
         "transactionDate": "2022-08-10 13:11:52",
         "createBy" : "abc",
         "createOn" : "2022-07-10 13:11:52"
      },
      {
         "id": 1377,
         "productID": "10002",
         "productName": "Test 2",
         "amount": "2000",
         "customerName" : "abc",
         "status": 0,
         "transactionDate": "2022-08-12 13:14:52",
         "createBy" : "abc",
         "createOn" : "2022-07-10 13:14:52"
      },
      {
         "id": 1378,
         "productID": "10001",
         "productName": "Test 1",
         "amount": "1000",
         "customerName" : "abc",
         "status": 0,
         "transactionDate": "2022-08-12 14:11:52",
         "createBy" : "abc",
         "createOn" : "2022-07-10 14:11:52"
      },
      {
         "id": 1379,
         "productID": "10002",
         "productName": "Test 2",
         "amount": "1000",
         "customerName" : "abc",
         "status": 1,
         "transactionDate": "2022-09-13 11:14:52",
         "createBy" : "abc",
         "createOn" : "2022-07-10 11:14:52"
      },
      {
         "id": 1380,
         "productID": "10001",
         "productName": "Test 1",
         "amount": "1000",
         "customerName" : "abc",
         "status": 0,
         "transactionDate": "2022-09-13 13:14:52",
         "createBy" : "abc",
         "createOn" : "2022-07-10 13:14:52"
      },
      {
         "id": 1381,
         "productID": "10002",
         "productName": "Test 2",
         "amount": "2000",
         "customerName" : "abc",
         "status": 0,
         "transactionDate": "2022-09-14 09:11:52",
         "createBy" : "abc",
         "createOn" : "2022-07-10 09:11:52"
      },
      {
         "id": 1382,
         "productID": "10001",
         "productName": "Test 1",
         "amount": "1000",
         "customerName" : "abc",
         "status": 0,
         "transactionDate": "2022-09-14 10:14:52",
         "createBy" : "abc",
         "createOn" : "2022-07-10 10:14:52"
      },
      {
         "id": 1383,
         "productID": "10002",
         "productName": "Test 2",
         "amount": "1000",
         "customerName" : "abc",
         "status": 1,
         "transactionDate": "2022-08-15 13:14:52",
         "createBy" : "abc",
         "createOn" : "2022-07-10 13:14:52"
      },
    ],
    "status" : [
        {
            "id" : 0,
            "name" : "SUCCESS"
        },
        {
            "id" : 1,
            "name" : "FAILED"
        }
    ]
};

export const initializeFirebaseData = async () => {
    try {
      // First, check if data already exists to avoid duplicates
      const transactionsRef = collection(db, 'transactions');
      const statusesRef = collection(db, 'statuses');
  
      // Check existing data
      const existingTransactions = await getDocs(transactionsRef);
      const existingStatuses = await getDocs(statusesRef);
  
      // If data exists, ask for confirmation before clearing
      if (!existingTransactions.empty || !existingStatuses.empty) {
        console.log('Existing data found. Clearing before initialization...');
        
        // Clear existing data
        const deletePromises = [
          ...existingTransactions.docs.map(doc => deleteDoc(doc.ref)),
          ...existingStatuses.docs.map(doc => deleteDoc(doc.ref))
        ];
        await Promise.all(deletePromises);
      }
  
      // Add status data
      console.log('Adding status data...');
      const statusPromises = viewData.status.map(status => 
        addDoc(statusesRef, status)
      );
      await Promise.all(statusPromises);
  
      // Add transaction data
      console.log('Adding transaction data...');
      const transactionPromises = viewData.data.map(transaction => 
        addDoc(transactionsRef, transaction)
      );
      await Promise.all(transactionPromises);
  
      console.log('Data initialization completed successfully!');
      return true;
  
    } catch (error) {
      console.error('Error initializing data:', error);
      return false;
    }
  };