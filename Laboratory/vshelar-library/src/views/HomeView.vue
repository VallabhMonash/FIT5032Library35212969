<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <h1 class="text-center">🗄️ W4. Library Registration Form</h1>
        <p class="text-center">
          This form now includes validation. Registered users are displayed in a data table below
          (PrimeVue).
        </p>
        <form @submit.prevent="submitForm" autocomplete="off">
          <div class="row mb-3">
            <div class="col-12 col-sm-6">
              <label for="username" class="form-label">Username</label>
              <input
                type="text"
                class="form-control"
                id="username"
                autocomplete="section-register username"
                @blur="() => validateName(true)"
                @input="() => validateName(false)"
                v-model="formData.username"
              />
              <div v-if="errors.username" class="text-danger">{{ errors.username }}</div>
            </div>

            <div class="col-12 col-sm-6">
              <label for="gender" class="form-label">Gender</label>
              <select
                class="form-select"
                id="gender"
                @blur="() => validateGender(true)"
                @input="() => validateGender(false)"
                v-model="formData.gender"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <div v-if="errors.gender" class="text-danger">{{ errors.gender }}</div>
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-12 col-sm-6">
              <label for="password" class="form-label">Password</label>
              <input
                type="password"
                class="form-control"
                id="password"
                autocomplete="section-register new-password"
                @blur="() => validatePassword(true)"
                @input="() => validatePassword(false)"
                v-model="formData.password"
              />
              <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
            </div>

            <div class="col-12 col-sm-6">
              <label for="confirm-password" class="form-label">Confirm password</label>
              <input
                type="password"
                class="form-control"
                id="confirm-password"
                v-model="formData.confirmPassword"
                @blur="() => validateConfirmPassword(true)"
              />
              <div v-if="errors.confirmPassword" class="text-danger">
                {{ errors.confirmPassword }}
              </div>
            </div>
          </div>

          <div class="mb-3">
            <div class="col-12 col-sm-6">
              <div class="form-check">
                <input
                  type="checkbox"
                  class="form-check-input"
                  id="isAustralian"
                  @blur="() => validateIsAustralian(true)"
                  @input="() => validateIsAustralian(false)"
                  v-model="formData.isAustralian"
                />
                <label for="isAustralian" class="form-check-label">Australian Resident ?</label>
                <div v-if="errors.isAustralian" class="text-danger">{{ errors.isAustralian }}</div>
              </div>
            </div>
          </div>

          <div class="mb-3">
            <label for="reason" class="form-label">Reason for joining</label>
            <textarea
              id="reason"
              class="form-control"
              rows="3"
              @blur="() => validateReason(true)"
              @input="() => validateReason(false)"
              v-model="formData.reason"
            ></textarea>
          </div>
          <div v-if="errors.reason" class="text-danger">{{ errors.reason }}</div>
          <div v-else-if="friendMessage" class="text-success">{{ friendMessage }}</div>

          <div class="mb-3">
            <label for="reason" class="form-label">Suburb</label>
            <input type="text" class="form-control" id="suburb" v-bind:value="formData.suburb" />
          </div>

          <div class="text-center">
            <button type="submit" class="btn btn-primary me-2">Submit</button>
            <button type="button" class="btn btn-secondary" @click="clearForm">Clear</button>
          </div>
        </form>
      </div>

      <div class="col-12 mt-5" v-if="submittedCards.length">
        <h4>This is a Primevue Datatable.</h4>
        <DataTable :value="submittedCards" tableStyle="min-width: 50rem">
          <Column field="username" header="Username" />
          <Column field="password" header="Password" />
          <Column field="isAustralian" header="Australian Resident" />
          <Column field="gender" header="Gender" />
          <Column field="reason" header="Reason" />
        </DataTable>
      </div>

      <div class="row mt-5" v-if="submittedCards.length">
        <div class="d-flex flex-wrap justify-content-start">
          <div
            v-for="(card, index) in submittedCards"
            :key="index"
            class="card m-2"
            style="width: 18rem"
          >
            <div class="card-header">User Information</div>
            <ul class="list-group list-group-flush">
              <li class="list-group-item">Username: {{ card.username }}</li>
              <li class="list-group-item">Password: {{ card.password }}</li>
              <li class="list-group-item">
                Australian Resident: {{ card.isAustralian ? 'Yes' : 'No' }}
              </li>
              <li class="list-group-item">Gender: {{ card.gender }}</li>
              <li class="list-group-item">Reason: {{ card.reason }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Our logic will go here
import { ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const formData = ref({
  username: '',
  password: '',
  confirmPassword: '',
  isAustralian: false,
  reason: '',
  gender: '',
  suburb: 'Clayton',
})

const submittedCards = ref([])

const submitForm = () => {
  validateName(true)
  validatePassword(true)
  validateIsAustralian(true)
  validateConfirmPassword(true)
  validateGender(true)
  validateReason(true)
  if (
    !errors.value.username &&
    !errors.value.password &&
    !errors.value.isAustralian &&
    !errors.value.gender &&
    !errors.value.reason &&
    !errors.value.confirmPassword
  ) {
    submittedCards.value.push({ ...formData.value })
    clearForm()
  }
}

const clearForm = () => {
  formData.value = {
    username: '',
    password: '',
    confirmPassword: '',
    isAustralian: false,
    reason: '',
    gender: '',
    suburb: 'Clayton',
  }
}

const errors = ref({
  username: null,
  password: null,
  confirmPassword: null,
  isAustralian: null,
  gender: null,
  reason: null,
})

const validateName = (blur) => {
  if (formData.value.username.length < 3) {
    if (blur) errors.value.username = 'Name must be at least 3 characters'
  } else {
    errors.value.username = null
  }
}

const validatePassword = (blur) => {
  const password = formData.value.password
  const minLength = 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>"]/.test(password)

  if (password.length < minLength) {
    if (blur) errors.value.password = `Password must be at least ${minLength} characters long.`
  } else if (!hasUpperCase) {
    if (blur) errors.value.password = `Password must contain at least one uppercase letter.`
  } else if (!hasLowerCase) {
    if (blur) errors.value.password = `Password must contain at least one lowercase letter.`
  } else if (!hasNumber) {
    if (blur) errors.value.password = `Password must contain at least one number.`
  } else if (!hasSpecialChar) {
    if (blur) errors.value.password = `Password must contain at least one special character.`
  } else {
    errors.value.password = null
  }
}

const validateConfirmPassword = (blur) => {
  if (formData.value.password !== formData.value.confirmPassword) {
    if (blur) errors.value.confirmPassword = 'Passwords do not match.'
  } else {
    errors.value.confirmPassword = null
  }
}

const validateIsAustralian = (blur) => {
  if (!formData.value.isAustralian) {
    if (blur) errors.value.isAustralian = 'You must be an Australian resident'
  } else {
    errors.value.isAustralian = null
  }
}

const validateGender = (blur) => {
  if (!formData.value.gender) {
    if (blur) errors.value.gender = 'Please select your gender'
  } else {
    errors.value.gender = null
  }
}

const friendMessage = ref(null)

const validateReason = (blur) => {
  const reason = formData.value.reason
  const minLength = 5
  const maxlength = 20

  if (reason.length < minLength) {
    if (blur) errors.value.reason = `Reason must be at least ${minLength} characters long.`
  } else if (reason.length > maxlength) {
    if (blur) errors.value.reason = `Reason must be less than ${maxlength} characters long.`
  } else {
    errors.value.reason = null
  }

  if (reason.toLowerCase().includes('friend')) {
    friendMessage.value = 'Great to have a friend'
  } else {
    friendMessage.value = null
  }
}
</script>

<style scoped>
/* Our logic will go here */
.card {
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.card-header {
  background-color: #275fda;
  color: white;
  padding: 10px;
  border-radius: 10px 10px 0 0;
}
.list-group-item {
  padding: 10px;
}
</style>
