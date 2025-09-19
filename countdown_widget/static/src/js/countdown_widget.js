/** @odoo-module **/

import { registry } from "@web/core/registry";
import { standardFieldProps } from "@web/views/fields/standard_field_props";
import { Component, onWillStart, onWillDestroy, onMounted, useState, useRef } from "@odoo/owl";

export class CountdownWidget extends Component {
    static template = "web.CountdownWidget";
    static props = {
        ...standardFieldProps,
        size: { type: String, optional: true }, // small, large
        alignment: { type: String, optional: true }, // left, center, right
        showLabels: { type: Boolean, optional: true }, // show/hide labels
        compact: { type: Boolean, optional: true }, // compact mode
        warning: { type: [String, Number], optional: true }, // warning threshold in days or field name
    };

    setup() {
        super.setup();
        this.timer = null;
        this.countdownData = useState({
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            isExpired: false,
            isNearDeadline: false
        });
        
        onWillStart(() => {
            this.updateCountdown();
        });
        
        onMounted(() => {
            this.startTimer();
            this.applyAlignment();
        });
        
        onWillDestroy(() => {
            if (this.timer) {
                clearInterval(this.timer);
            }
        });
    }

    updateCountdown() {
        const targetDate = this.props.record.data[this.props.name];
        if (!targetDate) {
            this.countdownData.days = 0;
            this.countdownData.hours = 0;
            this.countdownData.minutes = 0;
            this.countdownData.seconds = 0;
            this.countdownData.isExpired = false;
            this.countdownData.isNearDeadline = false;
            return;
        }

        const now = new Date().getTime();
        const target = new Date(targetDate).getTime();
        const difference = target - now;

        if (difference <= 0) {
            this.countdownData.days = 0;
            this.countdownData.hours = 0;
            this.countdownData.minutes = 0;
            this.countdownData.seconds = 0;
            this.countdownData.isExpired = true;
            this.countdownData.isNearDeadline = false;
            if (this.timer) {
                clearInterval(this.timer);
            }
        } else {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            // Check if deadline is within warning threshold (more precise calculation)
            const warningThreshold = this.getWarningThreshold();
            const totalDaysRemaining = difference / (1000 * 60 * 60 * 24); // Total days as decimal
            const isNearDeadline = totalDaysRemaining <= warningThreshold;

            this.countdownData.days = days;
            this.countdownData.hours = hours;
            this.countdownData.minutes = minutes;
            this.countdownData.seconds = seconds;
            this.countdownData.isExpired = false;
            this.countdownData.isNearDeadline = isNearDeadline;
        }
    }

    getWarningThreshold() {
        // Default warning threshold is 1 day (24 hours)
        let warningThreshold = 1;
        
        if (this.props.warning !== undefined && this.props.warning !== null) {
            // If warning is a number, use it directly
            if (typeof this.props.warning === 'number') {
                warningThreshold = this.props.warning;
            }
            // If warning is a string, check if it's a field name or a number
            else if (typeof this.props.warning === 'string') {
                // Try to get value from record field first
                if (this.props.record && this.props.record.data && this.props.record.data[this.props.warning] !== undefined) {
                    const fieldValue = this.props.record.data[this.props.warning];
                    if (typeof fieldValue === 'number') {
                        warningThreshold = fieldValue;
                    } else if (typeof fieldValue === 'string') {
                        const parsed = parseFloat(fieldValue);
                        if (!isNaN(parsed)) {
                            warningThreshold = parsed;
                        }
                    }
                } else {
                    // If not a field name, try to parse as number
                    const parsed = parseFloat(this.props.warning);
                    if (!isNaN(parsed)) {
                        warningThreshold = parsed;
                    }
                }
            }
        }
        
        return warningThreshold;
    }

    startTimer() {
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        this.timer = setInterval(() => {
            this.updateCountdown();
        }, 1000);
    }

    applyAlignment() {
        // Apply alignment after component is mounted
        if (this.props.alignment && this.el) {
            const widget = this.el.querySelector('.countdown-widget');
            if (widget) {
                // Remove existing alignment classes
                widget.classList.remove('countdown-widget-left', 'countdown-widget-center', 'countdown-widget-right');
                // Add current alignment class
                widget.classList.add(`countdown-widget-${this.props.alignment}`);
                
                // Force reflow for sheet alignment
                if (this.el.closest('.o_form_sheet')) {
                    widget.style.display = 'flex';
                    widget.offsetHeight; // Force reflow
                }
            }
        }
    }

    getCountdownClass() {
        let classes = ['countdown-widget'];
        
        // Add size class
        if (this.props.size) {
            classes.push(`countdown-widget-${this.props.size}`);
        }
        
        // Add alignment class
        if (this.props.alignment) {
            classes.push(`countdown-widget-${this.props.alignment}`);
        }
        
        // Add compact class
        if (this.props.compact) {
            classes.push('countdown-widget-compact');
        }
        
        // Add state classes
        if (this.countdownData.isExpired) {
            classes.push('expired');
        } else if (this.countdownData.isNearDeadline) {
            classes.push('warning');
        }
        
        return classes.join(' ');
    }

    formatNumber(num) {
        return num.toString().padStart(2, '0');
    }

    shouldShowLabels() {
        return this.props.showLabels !== false; // Default to true
    }
}

export const countdownField = {
    component: CountdownWidget,
    supportedTypes: ["datetime", "date"],
    supportedOptions: [
        {
            label: "Size",
            name: "size",
            type: "selection",
            selection: [
                ["small", "Small"],
                ["large", "Large"],
            ],
            default: "large",
        },
        {
            label: "Alignment",
            name: "alignment",
            type: "selection",
            selection: [
                ["left", "Left"],
                ["center", "Center"],
                ["right", "Right"],
            ],
            default: "center",
        },
        {
            label: "Show Labels",
            name: "show_labels",
            type: "boolean",
            default: true,
        },
        {
            label: "Compact Mode",
            name: "compact",
            type: "boolean",
            default: false,
        },
        {
            label: "Warning Threshold (Days or Field Name)",
            name: "warning",
            type: "char",
            default: "1",
        },
    ],
    extractProps: ({ attrs, options }, dynamicInfo) => ({
        ...attrs,
        size: options.size || "large",
        alignment: options.alignment || "center",
        showLabels: options.show_labels !== false,
        compact: options.compact || false,
        warning: options.warning !== undefined ? options.warning : 1,
    }),
};

registry.category("fields").add("countdown", countdownField);
