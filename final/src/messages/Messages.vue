<template>
    <div>
        <h2>{{ channelName }}</h2>
        <!-- show single messages -->
        <single-message :messages="messages"></single-message>
        <!-- message form -->
        <message-form></message-form>
    </div>
</template>

<script>
import SingleMessage from './SingleMessage'
import MessageForm from './MessageForm'
import database from 'firebase/database'
import {mapGetters} from 'vuex'

    export default {
        name: 'messages',

        components: {SingleMessage, MessageForm},

        data() {
            return {
                messagesRef: firebase.database().ref('messages'),
                privateMessagesRef: firebase.database().ref('privateMessages'),
                messages: [],
                channel: null,
                listeners: []
            }
        },

        computed: {
            ...mapGetters(['currentChannel', 'currentUser', 'isPrivate']),
            // channel name
            channelName() {
                if(this.channel !== null) {
                    return this.isPrivate ? '@ ' + this.channel.name : '# ' + this.channel.name
                }
            }
        },

        watch: {
            currentChannel: function() {
                // if current channel changes, watch for its messages
                // this.messages = []
                this.detachListeners()
                this.addListeners()
                this.channel = this.currentChannel
            }
        },

        methods: {
            addListeners() {
                let ref = this.getMessagesRef()
                // listen to child added events on current channel
                ref.child(this.currentChannel.id).on('child_added', (snapshot) => {

                    let message = snapshot.val()
                    message['id'] = snapshot.key

                    this.messages.push(message)

                    // scroll to the top
                    this.$nextTick(() => {
                        $("html, body").scrollTop($(document).height());
                      })
                })

                // pass arguments to addToListeners() method
                this.addToListeners(this.currentChannel.id, ref, 'child_added')
            },

            addToListeners(id, ref, event) {
                let index = this.listeners.findIndex(el => {
                    return el.id === id && el.ref === ref && el.event === event
                })

                if(index === -1) {
                    this.listeners.push({id:id, ref:ref, event:event})
                }
            },

            detachListeners() {
                this.listeners.forEach(listener => {
                    listener.ref.child(listener.id).off(listener.event)
                })

                this.listeners = []
                this.messages = []

                // if(this.channel !== null) {
                //     this.messagesRef.child(this.channel.id).off()
                // }
            },

            getMessagesRef() {
                if(this.isPrivate) {
                    return this.privateMessagesRef
                } else {
                    return this.messagesRef
                }
            }
        },

        beforeDestroy() {
            this.detachListeners()
        }
    }
</script>











