<template>
    <div>
        <div class="text-light">
            <h4>Users</h4>

                <div class="mt-4">
                    <button v-for="user in users" class="list-group-item list-group-item-action" type="button" :class="{'active': isActive(user)}" @click.prevent="changeChannel(user)">

                        <span :class="{'fa fa-circle online': isOnline(user), 'fa fa-circle offline': !isOnline(user)}"></span>
                        
                        <span>
                            <img class="img rounded-circle" :src="user.avatar" height="20" />
                            <span><a :class="{'text-light': isActive(user)}" href="#">{{ user.name }}</a><span class="float-right" v-if="getNotification(user) >= 1">{{ getNotification(user) }}</span></span>
                        </span>

                    </button>
                </div>

        </div>
    </div>
</template>

<script>
import database from 'firebase/database'
import {mapGetters} from 'vuex'
import mixin from '../mixins'

    export default {
        name: 'users',

        data() {
            return {
                users: [],
                usersRef: firebase.database().ref('users'),
                connectedRef: firebase.database().ref('.info/connected'),
                presenceRef: firebase.database().ref('presence'),
                privateMessagesRef: firebase.database().ref('privateMessages'),
                notifCount: [],
                channel: null
            }
        },

        mixins: [mixin],

        computed: {
            ...mapGetters(['currentUser', 'currentChannel', 'isPrivate'])
        },

        watch: {
            isPrivate() {
                if(!this.isPrivate) {
                    this.resetNotifications()
                }
            }
        },

        methods: {
            addListeners() {
                this.usersRef.on('child_added', (snapshot) => {
                    if(this.currentUser.uid !== snapshot.key) {
                        // build user object and push to users[]
                        let user = snapshot.val()
                        user['uid'] = snapshot.key
                        user['status'] = 'offline'
                        this.users.push(user)
                    }
                })

                // presenceRef child_added
                this.presenceRef.on('child_added', snapshot => {
                    if(this.currentUser.uid !== snapshot.key) {
                        // pass to user status method
                        this.addStatusToUser(snapshot.key)

                        let channelId = this.getChannelId(snapshot.key)

                        this.privateMessagesRef.child(channelId).on('value', snapshot => {
                            this.handleNotifications(channelId, this.currentChannel.id, this.notifCount, snapshot)
                        })
                    }
                })

                // presenceRef child_removed
                this.presenceRef.on('child_removed', snapshot => {
                    if(this.currentUser.uid !== snapshot.key) {
                        // pass to user status method
                        this.addStatusToUser(snapshot.key, false)

                        this.privateMessagesRef.child(this.getChannelId(snapshot.key)).off()
                    }
                })

                // returns 'connected' to every user connected to our application
                this.connectedRef.on('value', snapshot => {
                    // console.log('connected user: ', snapshot)
                    if(snapshot.val() === true) {
                        let ref = this.presenceRef.child(this.currentUser.uid)
                        ref.set(true)
                        ref.onDisconnect().remove()
                    }
                })
            },

            // add user status online / offline
            addStatusToUser(userId, connected = true) {
                let index = this.users.findIndex(user => user.uid === userId)
                if(index !== -1) {
                    connected === true ? this.users[index].status = 'online' : this.users[index].status = 'offline'
                }
            },

            // is user online or offline
            isOnline(user) {
                return user.status == 'online'
            }, 

            getNotification(user) {
                let channelId = this.getChannelId(user.uid)
                let notif = 0

                this.notifCount.forEach(el => {
                    if(el.id === channelId) {
                        notif = el.notif
                    }
                })
                return notif
            },

            resetNotifications(user = null) {
                let channelId = null

                if(user !== null) {
                    channelId = this.getChannelId(user.uid)
                } else {
                    channelId = this.channel.id
                }

                let index = this.notifCount.findIndex(el => el.id === channelId)
                if(index !== -1) {
                    this.notifCount[index].total = this.notifCount[index].lastKnownTotal
                    this.notifCount[index].notif = 0
                }
            },

            detachListeners() {
                this.usersRef.off()
                this.presenceRef.off()
                this.connectedRef.off()

                this.channels.forEach(el => {
                    this.messagesRef.child(el.id).off()
                })
            },

            // changeChannel
            changeChannel(user) {

                if(this.channel === null) {
                    this.resetNotifications(user)
                } else {
                    this.resetNotifications()
                }
                // to change channel, you need channel id
                // to get channel id, use getChannelId() method below
                let channelId = this.getChannelId(user.uid)
                // create channel object with id and name
                let channel = {id: channelId, name: user.name}

                this.channel = channel

                this.$store.dispatch('setPrivate', true)
                this.$store.dispatch('setCurrentChannel', channel)
            },

            isActive(user) {
                let channelId = this.getChannelId(user.uid)
                return this.currentChannel.id === channelId
            },

            // get channel id
            getChannelId(userId) {
                // use this format to create channel smallerUserId/biggerUserId
                return userId < this.currentUser.uid ? userId+'/'+this.currentUser.uid : this.currentUser.uid +'/'+userId 
            }
        },

        mounted() {
            this.addListeners()
        },

        beforeDestroy() {
            this.detachListeners()
        }
    }
</script>

<style scoped>
    .online{color:green;}
    .offline{color:red;}
</style>













