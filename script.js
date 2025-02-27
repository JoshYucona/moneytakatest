// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDScY22M2BayQzz-ZVRjy5bo7OxF6VD14E",
  authDomain: "moneytakaplans.firebaseapp.com",
  projectId: "moneytakaplans",
  storageBucket: "moneytakaplans.firebasestorage.app",
  messagingSenderId: "425449353479",
  appId: "1:425449353479:web:df096140c28fcf155755a2",
  measurementId: "G-G0CXE0NT1X"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let currentDocId = null;

// Load all documents
function loadDocs() {
    const docList = document.getElementById('docList');
    docList.innerHTML = '';
    db.collection('documents').orderBy('title').onSnapshot(snapshot => {
        snapshot.forEach(doc => {
            const data = doc.data();
            const div = document.createElement('div');
            div.className = 'doc-item';
            div.textContent = data.title;
            div.onclick = () => loadDoc(doc.id, data.title, data.content);
            docList.appendChild(div);
        });
    });
}

// Create a new document
function createDoc() {
    const title = document.getElementById('docTitle').value;
    if (title) {
        db.collection('documents').add({
            title: title,
            content: ''
        }).then(() => {
            document.getElementById('docTitle').value = '';
            loadDocs();
        });
    }
}

// Load a document into the editor
function loadDoc(id, title, content) {
    currentDocId = id;
    document.getElementById('docContent').value = content;
}

// Save document changes
function saveDoc() {
    if (currentDocId) {
        const content = document.getElementById('docContent').value;
        db.collection('documents').doc(currentDocId).update({
            content: content
        });
    }
}

// Delete a document
function deleteDoc() {
    if (currentDocId) {
        db.collection('documents').doc(currentDocId).delete().then(() => {
            document.getElementById('docContent').value = '';
            currentDocId = null;
            loadDocs();
        });
    }
}

// Initial load
loadDocs();
