import Controller from '@ember/controller';
import { task, timeout } from 'ember-concurrency';
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

    sortedTable: computed('table', function() {
        let unsorted = [];
        const table = get(this, 'table');
        for(let key in table) {
            unsorted.pushObject({
                name: key,
                value: table[key],
                url: `http://kicker.ding.si/avatars/${key}.jpeg`
            });
        }
        return unsorted.sortBy('value').reverse();
    })

});
