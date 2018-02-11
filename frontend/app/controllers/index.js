import Controller from '@ember/controller';
import { task } from 'ember-concurrency';
import { inject } from "@ember/service";
import { get, set } from "@ember/object";
import { computed } from "@ember/object";

export default Controller.extend({

    ajax: inject(),

    fetchTable: task(function * () {
        const ajax = get(this, 'ajax');
        let table = yield ajax.request("https://kicker.ding.si/table");
        set(this, 'table', table);
    }).on('init'),

    fetchLogs: task(function * () {
        const ajax = get(this, 'ajax');
        let logs = yield ajax.request(
            "https://kicker.ding.si/logs",
            { dataType: 'text' }
        );
        set(this, 'logs', logs);
    }).on('init'),

    formatedLogs: computed('logs', function() {
        let formatedLogs = [];
        const logs = get(this, 'logs').split("\n");
        logs.forEach((log) => {
            if (log) {
                log = log.replace('<br>', '').split(' - ');
                let timestamp = log[0];
                let paaring = log[1].split(' defeat ');
                let winners = paaring[0].split('+');
                let loosers = paaring[1].split('+');

                let winner1Url = `https://kicker.ding.si/avatars/${winners[0]}.jpeg`;
                let winner2Url = `https://kicker.ding.si/avatars/${winners[1]}.jpeg`;
                let looser1Url = `https://kicker.ding.si/avatars/${loosers[0]}.jpeg`;
                let looser2Url = `https://kicker.ding.si/avatars/${loosers[1]}.jpeg`;

                formatedLogs.pushObject({ timestamp, winners, loosers, winner1Url, winner2Url,
                                          looser1Url, looser2Url });
            }
        });
        console.log(formatedLogs);
        return formatedLogs
    }),

    sortedTable: computed('table', function() {
        let unsorted = [];
        const table = get(this, 'table');
        for(let key in table) {
            unsorted.pushObject({
                name: key,
                value: table[key],
                url: `https://kicker.ding.si/avatars/${key}.jpeg`
            });
        }
        return unsorted.sortBy('value').reverse();
    })

});
