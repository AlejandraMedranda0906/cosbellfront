import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { CalendarOptions, EventInput } from '@fullcalendar/core';

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.css']
})
export class CalendarViewComponent implements OnChanges {
  @Input() events: EventInput[] = [];
  @Input() availableSlots: string[] = [];
  @Output() slotSelected = new EventEmitter<DateClickArg>();
  @Output() visibleRangeChange = new EventEmitter<{start: string, end: string}>();

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'timeGridWeek',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: [],
    selectable: true,
    editable: false,
    allDaySlot: false, // Oculta la franja 'todo el día'
    datesSet: (arg) => {
      // Emitir el rango visible al padre
      this.visibleRangeChange.emit({
        start: arg.startStr,
        end: arg.endStr
      });
    },
    dateClick: (arg) => {
      // Solo permitir seleccionar si el slot está en availableSlots
      const slotStr = arg.dateStr.length === 16 ? arg.dateStr + ':00' : arg.dateStr;
      const slotShort = slotStr.slice(0,16);
      if (this.availableSlots.some(s => s.startsWith(slotShort))) {
        this.slotSelected.emit(arg);
      }
    },
    eventColor: '#bdbdbd',
    height: 'auto',
    locale: 'es',
    nowIndicator: true
  };

  ngOnChanges(changes: SimpleChanges) {
    // Combinar eventos ocupados y slots disponibles
    let allEvents = [...this.events];
    if (this.availableSlots && this.availableSlots.length > 0) {
      const greenEvents = this.availableSlots.map(slot => ({
        title: 'Disponible',
        start: slot,
        end: slot,
        color: '#25d366',
        display: 'background'
      }));
      allEvents = [...allEvents, ...greenEvents];

      // Marcar como ocupados todos los bloques de horario laboral que no estén en availableSlots ni en events
      // Suponiendo bloques de 30 min de 8:00 a 20:00
      const startHour = 8;
      const endHour = 20;
      const days = Array.from(new Set(this.availableSlots.map(s => s.split('T')[0])));
      for (const day of days) {
        for (let h = startHour; h < endHour; h++) {
          for (let m of [0, 30]) {
            const hourStr = `${h.toString().padStart(2, '0')}:${m === 0 ? '00' : '30'}`;
            const slot = `${day}T${hourStr}`;
            const isAvailable = this.availableSlots.some(s => s.startsWith(slot));
            const isOccupied = this.events.some(e => e.start && String(e.start).startsWith(slot));
            if (!isAvailable && !isOccupied) {
              allEvents.push({
                title: 'Ocupado',
                start: slot,
                end: slot,
                color: '#e5e7eb', // gris claro
                display: 'background'
              });
            }
          }
        }
      }
    }
    this.calendarOptions = {
      ...this.calendarOptions,
      events: allEvents
    };
  }
} 