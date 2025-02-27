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
console.log("Firebase initialized"); // Confirm Firebase loads

let currentDocId = null;

// Load all documents
function loadDocs() {
    const docList = document.getElementById('docList');
    docList.innerHTML = '';
    console.log("Fetching documents...");
    db.collection('documents').orderBy('title').onSnapshot(snapshot => {
        console.log("Snapshot received, docs found:", snapshot.size);
        snapshot.forEach(doc => {
            const data = doc.data();
            console.log("Doc:", data.title, "ID:", doc.id);
            const div = document.createElement('div');
            div.className = 'doc-item';
            div.textContent = data.title;
            div.onclick = () => loadDoc(doc.id, data.title, data.content);
            docList.appendChild(div);
        });
    }, error => {
        console.error("Error fetching documents:", error);
    });
}

// Create a new document
function createDoc() {
    const title = document.getElementById('docTitle').value;
    if (title) {
        console.log("Creating document:", title);
        db.collection('documents').add({
            title: title,
            content: ''
        }).then(() => {
            console.log("Document created successfully");
            document.getElementById('docTitle').value = '';
            loadDocs();
        }).catch(error => {
            console.error("Error creating document:", error);
        });
    }
}

// Load a document into the editor
function loadDoc(id, title, content) {
    currentDocId = id;
    document.getElementById('docContent').value = content;
    console.log("Loaded doc:", title, "ID:", id);
}

// Save document changes
function saveDoc() {
    if (currentDocId) {
        const content = document.getElementById('docContent').value;
        console.log("Saving doc ID:", currentDocId);
        db.collection('documents').doc(currentDocId).update({
            content: content
        }).then(() => {
            console.log("Document saved");
        }).catch(error => {
            console.error("Error saving document:", error);
        });
    } else {
        console.log("No document selected to save");
    }
}

// Delete a document
function deleteDoc() {
    if (currentDocId) {
        console.log("Deleting doc ID:", currentDocId);
        db.collection('documents').doc(currentDocId).delete().then(() => {
            document.getElementById('docContent').value = '';
            currentDocId = null;
            loadDocs();
            console.log("Document deleted");
        }).catch(error => {
            console.error("Error deleting document:", error);
        });
    }
}

// Initial load
loadDocs();
