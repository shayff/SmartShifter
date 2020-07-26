import React, { Component } from 'react';
import 'dhtmlx-scheduler';
import 'dhtmlx-scheduler/codebase/dhtmlxscheduler_material.css';

const scheduler = window.scheduler;
 
export default class Scheduler extends Component {
   
     componentDidMount() {
        scheduler.skin = 'material';
        scheduler.config.header = [
            'day',
            'week',
            'month',
            'date',
            'prev',
            'today',
            'next'
        ];

        scheduler.config.hour_size_px = 50;
        scheduler.config.start_on_monday = false;
        scheduler.config.readonly = true;
        const { events } = this.props;
        scheduler.init(this.schedulerContainer);
        scheduler.clearAll();
        scheduler.parse(events);
    }
 
    render() {
        return (
            <div
                ref={ (input) => { this.schedulerContainer = input } }
                style={ { width: '100%', height: '100%' } }
            ></div>
       );
    }
}