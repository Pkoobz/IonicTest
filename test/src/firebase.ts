// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc, getDocs, deleteDoc} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBUWIJ0Wum-Om5l-mMG_UGZHKrTZtdMMw4",
  authDomain: "ionictest-ad918.firebaseapp.com",
  databaseURL: "https://ionictest-ad918-default-rtdb.firebaseio.com",
  projectId: "ionictest-ad918",
  storageBucket: "ionictest-ad918.firebasestorage.app",
  messagingSenderId: "831327404238",
  appId: "1:831327404238:web:2926a002f11efe5282509f",
  measurementId: "G-GMGQ1740MH"
};

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
    if (!db) {
      throw new Error('Firebase database not initialized');
    }
    
    const transactionsRef = collection(db, 'transactions');
    const statusesRef = collection(db, 'statuses');

    console.log('Checking existing data...');
    const existingTransactions = await getDocs(transactionsRef);
    const existingStatuses = await getDocs(statusesRef);

    if (!existingTransactions.empty || !existingStatuses.empty) {
      console.log('Clearing existing data...');
      
      const deletePromises = [
        ...existingTransactions.docs.map(doc => deleteDoc(doc.ref)),
        ...existingStatuses.docs.map(doc => deleteDoc(doc.ref))
      ];
      await Promise.all(deletePromises);
    }
    for (const status of viewData.status) {
      await addDoc(statusesRef, status);
    }
    for (const transaction of viewData.data) {
      await addDoc(transactionsRef, transaction);
    }
    return true;

  } catch (error) {
    console.error('Error initializing data:', error);
    console.error('Error details:', error);
    return false;
  }
};

export { db };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);