// ===== Import required modules =====
const { onRequest } = require('firebase-functions/v2/https')
const { onDocumentCreated } = require('firebase-functions/v2/firestore')
const admin = require('firebase-admin')
const cors = require('cors')({ origin: true })

// Initialize Firebase Admin SDK (only once)
admin.initializeApp()

// ===== 2.4 Create the countBooks function =====
exports.countBooks = onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const snapshot = await admin.firestore().collection('books').get()
      const count = snapshot.size
      res.status(200).json({ count: count })
    } catch (error) {
      console.error('Error fetching book count:', error)
      res.status(500).json({ error: 'Error fetching book count' })
    }
  })
})

// ===== 2.5 Capitalize new book data =====
exports.capitalizeBookData = onDocumentCreated('books/{bookId}', async (event) => {
  try {
    const snap = event.data
    if (!snap) {
      console.log('No data found in event')
      return
    }
    const bookData = snap.data()
    const capitalisedData = {}
    for (const [key, value] of Object.entries(bookData)) {
      capitalisedData[key] = typeof value === 'string' ? value.toUpperCase() : value
    }
    const docRef = admin.firestore().collection('books').doc(snap.id)
    await docRef.update(capitalisedData)
    console.log(`Book ${snap.id} capitalised successfully.`)
  } catch (error) {
    console.error('Error capitalising book:', error)
  }
})

// ===== 2.7 Create the getAllBooks function =====
exports.getAllBooks = onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const snapshot = await admin.firestore().collection('books').get()
      const books = snapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          name: data.name || 'Unknown Title',
          isbn: data.isbn || 'No ISBN Provided',
        }
      })
      res.status(200).json({ books: books })
    } catch (error) {
      console.error('Error fetching books:', error)
      res.status(500).json({ error: 'Error fetching book data' })
    }
  })
})
