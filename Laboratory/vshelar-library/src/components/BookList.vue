<template>
  <div>
    <h2>Book List (queryable)</h2>

    <!-- Query controls (where / orderBy / limit) -->
    <form @submit.prevent="runQuery" class="controls">
      <label>
        Where: isbn >
        <input type="number" v-model.number="minIsbn" />
      </label>

      <label>
        orderBy:
        <select v-model="orderByField">
          <option value="isbn">isbn</option>
          <option value="name">name</option>
        </select>
        <select v-model="orderDir">
          <option value="asc">asc</option>
          <option value="desc">desc</option>
        </select>
      </label>

      <label>
        limit:
        <input type="number" min="1" v-model.number="limitN" />
      </label>

      <button type="submit">Retrieve</button>
      <button type="button" @click="watchLive">{{ live ? 'Stop live' : 'Watch live' }}</button>
    </form>

    <!-- Results -->
    <p v-if="loading">Loading…</p>
    <ul v-else>
      <li v-for="b in books" :key="b.id">
        <template v-if="editId !== b.id">
          <strong>{{ b.isbn }}</strong> - {{ b.name }}
          <button class="btn" @click="startEdit(b)">Edit</button>
          <button class="btn" @click="remove(b.id)">Delete</button>
        </template>

        <template v-else>
          <input type="number" v-model.number="editIsbn" style="width: 120px" />
          <input type="text" v-model="editName" style="width: 220px" />
          <button class="btn" @click="saveEdit(b.id)">Save</button>
          <button class="btn" @click="cancelEdit">Cancel</button>
        </template>
      </li>
    </ul>

    <p v-if="!books.length && !loading">No books match this query.</p>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { db } from '../firebase/init.js'
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore'

export default {
  setup() {
    const books = ref([])
    const loading = ref(false)

    // --- Query state (defaults are sensible for marking) ---
    const minIsbn = ref(1000) // your original condition
    const orderByField = ref('isbn')
    const orderDir = ref('asc')
    const limitN = ref(10)

    // --- Edit/Delete state ---
    const editId = ref(null)
    const editIsbn = ref(null)
    const editName = ref('')
    const live = ref(false)
    let unsubscribe = null

    function buildQuery() {
      const constraints = []
      if (minIsbn.value !== null && minIsbn.value !== '' && !Number.isNaN(minIsbn.value)) {
        constraints.push(where('isbn', '>', Number(minIsbn.value)))
      }
      constraints.push(orderBy(orderByField.value, orderDir.value))
      constraints.push(limit(Math.max(1, Number(limitN.value) || 1)))
      const q = query(collection(db, 'books'), ...constraints)

      console.log('[RUN QUERY]', {
        where: `isbn > ${minIsbn.value}`,
        orderBy: `${orderByField.value} ${orderDir.value}`,
        limit: limitN.value,
      })

      return q
    }

    // One-shot retrieval (Screenshot set 2)
    async function runQuery() {
      loading.value = true
      try {
        const q = buildQuery()
        const querySnapshot = await getDocs(q)
        const arr = []
        querySnapshot.forEach((d) => arr.push({ id: d.id, ...d.data() }))
        books.value = arr
        console.log('[RESULT]', books.value)
      } catch (error) {
        console.error('Error fetching books:', error)
        // If Firestore asks for a composite index, click the console link to create it.
      } finally {
        loading.value = false
      }
    }

    // Live watcher (handy for demonstrating updates/deletes in real time)
    function watchLive() {
      if (unsubscribe) {
        unsubscribe()
        unsubscribe = null
        live.value = false
        return
      }
      const q = buildQuery()
      live.value = true
      unsubscribe = onSnapshot(
        q,
        (snap) => {
          books.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
          console.log('[SNAPSHOT]', books.value)
        },
        (err) => {
          console.error('Live query error:', err)
        },
      )
    }

    // --- Update/Delete (Screenshot set 1) ---
    function startEdit(b) {
      editId.value = b.id
      editIsbn.value = b.isbn
      editName.value = b.name
      console.log('[EDIT START]', b)
    }
    function cancelEdit() {
      editId.value = null
      editIsbn.value = null
      editName.value = ''
      console.log('[EDIT CANCEL]')
    }
    async function saveEdit(id) {
      try {
        const isbnNum = Number(editIsbn.value)
        if (Number.isNaN(isbnNum) || !editName.value) {
          alert('Please enter valid ISBN and Name')
          return
        }
        await updateDoc(doc(db, 'books', id), { isbn: isbnNum, name: editName.value })
        console.log('[UPDATED]', { id, isbn: isbnNum, name: editName.value })
        if (!unsubscribe) await runQuery() // refresh if not live
        cancelEdit()
      } catch (e) {
        console.error('Update failed:', e)
      }
    }
    async function remove(id) {
      if (!confirm('Delete this book?')) return
      try {
        await deleteDoc(doc(db, 'books', id))
        console.log('[DELETED]', { id })
        if (!unsubscribe) books.value = books.value.filter((b) => b.id !== id)
      } catch (e) {
        console.error('Delete failed:', e)
      }
    }

    onMounted(runQuery)

    return {
      books,
      loading,
      minIsbn,
      orderByField,
      orderDir,
      limitN,
      runQuery,
      watchLive,
      live,
      editId,
      editIsbn,
      editName,
      startEdit,
      cancelEdit,
      saveEdit,
      remove,
    }
  },
}
</script>

<style scoped>
.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 12px;
  align-items: center;
  margin-bottom: 12px;
}
.btn {
  margin-left: 6px;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
}
.hint {
  font-size: 0.9em;
  color: #666;
  margin-left: 8px;
}
</style>
