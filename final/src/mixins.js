export default {
    methods: {
        handleNotifications(channelId, currentChannelId, notifCount, snapshot) {
            let lastTotal = 0;
            // find if channelId is already added to notifCount[]
            let index = notifCount.findIndex(el => el.id === channelId);
            // if found
            if (index != -1) {
                if (channelId !== currentChannelId) {
                    lastTotal = notifCount[index].total;

                    if (snapshot.numChildren() - lastTotal > 0) {
                        notifCount[index].notif = snapshot.numChildren() - lastTotal;
                    }
                }
                notifCount[index].lastKnownTotal = snapshot.numChildren();
            } else {
                // push to notifCount[]
                notifCount.push({
                    id: channelId,
                    total: snapshot.numChildren(),
                    lastKnownTotal: snapshot.numChildren(),
                    notif: 0
                });
            }
        }
    }
};
