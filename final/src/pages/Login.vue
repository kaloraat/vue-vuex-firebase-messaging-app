<template>
  <div>
    <div class="jumbotron bg-primary text-white text-center">
      <h2 class="lead display-3">#SLACK#</h2>
      <hr>
      <p>Realtime communication at it's best!</p>
      <hr>
    </div>
    <!-- login with email and password -->
    <div class="col-md-6 offset-md-3">
      <h2 class="text-center text-primary mb-5 display-4"><i class="fa fa-user"></i> Login</h2>
      <form>
        <div class="form-group">
          <input v-model.trim="email" @input="clearErrors" type="email" name="email" class="form-control" placeholder="Email" required="">
        </div>
        <div class="form-group">
          <input v-model.trim="password" type="password" password="password" class="form-control" placeholder="Password" required>
        </div>
        <button @click.prevent="login" type="submit" class="btn btn-lg btn-primary form-control" v-if="!isLoading">Login</button>
        <button class="btn btn-primary form-control" disabled v-else>Please wait...</button>
        <big class="form-text">Not registered yet? <router-link to="register">Register</router-link>
                    <span class="float-right text-success" @click.prevent="fp">
                        <span v-if="!fpform">Forgot password</span>
                        <span v-else>
                            <i class="fa fa-close text-danger"></i>
                        </span>
                    </span>
                  </big>
        <br>
        <div class="alert alert-danger" v-if="hasErrors">
          <div v-for="error in errors">{{ error }}</div>
        </div>
      </form>
      <!-- forgot password form -->
      <form v-if="fpform">
        <div class="input-group">
          <input v-model.trim="forgot_password" type="email" name="forgot_password" class="form-control" placeholder="Email to send password reset link">
          <button @click.prevent="forgotPassword" class="btn btn-primary">Submit</button>
        </div>
        <br>
        <!-- show loading statue -->
        <div class="alert alert-info" v-if="loading">
            <div>Please wait...</div>
        </div>
        <!-- show errors -->
        <div class="alert alert-danger" v-if="hasErrors">
          <div v-for="error in errors">{{ error }}</div>
        </div>
      </form>
      <!-- social login -->
      <div class="text-center mt-4">
        <button @click="loginWithGoogle" class="btn btn-danger btn-lg btn-block">Login with Google</button>
      </div>
      <div class="text-center mt-4">
        <button @click="loginWithTwitter" class="btn btn-info btn-lg btn-block">Login with Twitter</button>
      </div>
    </div>
  </div>
</template>
<script>
import auth from 'firebase/auth'
import database from 'firebase/database'

export default {
  name: 'login',

  data() {
    return {
      email: '',
      password: '',
      forgot_password: '',
      fpform: false,
      errors: [],
      loading: false,
      usersRef: firebase.database().ref('users')
    }
  },

  computed: {
    hasErrors() {
      return this.errors.length > 0
    }
  },

  methods: {
    login() {
      console.log('login')
      this.errors = []

      if (!this.isFormValid()) {
        this.isLoading = true

        firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(response => {
          let user = response.user;
          console.log(user)

          this.$store.dispatch('setUser', user)
          this.$router.push('/')

        }).catch(error => {
          this.errors.push(error.message)
          this.isLoading = false
        })
      }
    },
    isFormValid() {
      if (this.email.length > 0 && this.email.length <= 6 && this.password.length > 0 && this.password.length <= 6) {
        return true
      }
      return false
    },

    forgotPassword() {
      console.log('forgot password', this.forgot_password)
      firebase.auth().sendPasswordResetEmail(this.forgot_password)
        .then(success => {
          this.fpform = false
          alert('Check your email for password reset link')
          this.$router.push('/')
        })
        .catch(error => {
          alert(error.message)
        })
    },

    fp() {
      return this.fpform = !this.fpform
    },

    loginWithGoogle() {
      // loading set to true
      this.loading = true
      // clear old errors
      this.errors = []

      firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .then((response) => {
          // console.log(response.user)

          // pass user to save in db
          this.saveUserToUsersRef(response.user)

          // dispatch setUser action
          this.$store.dispatch('setUser', response.user)
          // then redirect user to '/' page
          this.$router.push('/')
        })
        .catch(error => {
          this.errors.push(error.message)
          // set loading to false
          this.loading = false
        })
    },

    // save user to database
    saveUserToUsersRef(user) {
      return this.usersRef.child(user.uid).set({
        name: user.displayName,
        avatar: user.photoURL
      })
    },

    loginWithTwitter() {
      // loading set to true
      this.loading = true
      // clear old errors
      this.errors = []

      firebase.auth().signInWithPopup(new firebase.auth.TwitterAuthProvider())
        .then((response) => {
          // console.log(response.user)

          // dispatch setUser action
          this.$store.dispatch('setUser', response.user)
          // then redirect user to '/' page
          this.$router.push('/')
        })
        .catch(error => {
          this.errors.push(error.message)
          // set loading to false
          this.loading = false
        })
    },

    clearErrors() {
        this.errors = []
    }
  }
}

</script>
<style>
.btn,
.jumbotron {
  border-radius: 0px;
}

</style>
