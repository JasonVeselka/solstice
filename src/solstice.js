export class Solstice {

  constructor(contEl, options){
    if (!contEl){
      throw new Error('No Container element supplied');
    }

    this.monthWords = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];

    this.timeSTZones = {
      PST: '-08:00',
      MST: '-07:00',
      CST: '-06:00',
      EST: '-05:00',
      AKST: '-09:00',
      HST: '-10:00'
    };

    this.timeDTZones = {
      PDT: '-07:00',
      MDT: '-06:00',
      CDT: '-05:00',
      EDT: '-04:00',
      AKDT: '-08:00',
      HDT: '-09:00'
    };

    this.selector = {
      calendarWrapper: 'solstice-cal',
      monthWrapper: 'solstice-cal-month',
      controls: 'solstice-ctrls',
      prevMonth: 'solstice-prev-month',
      nextMonth: 'solstice-next-month',
      prevYear: 'solstice-prev-year',
      nextYear: 'solstice-next-year',
      selectedDate: 'solstice-selected-date',
      week: 'solstice-week',
      day: 'solstice-day',
      weekDay: 'solstice-week-day',
      columns: 'solstice-columns',
      dayDisplay: 'solstice-day-display',
      monthDisplay: 'solstice-month-Display',
      yearDisplay: 'solstice-year-display',
      hour: 'solstice-hour',
      minute: 'solstice-minute',
      timewrap: 'solstice-timewrap',
      seconds: 'solstice-seconds',
      tzDD: 'solstice-time-zone-select',
      amPm: 'solstice-am-pm',
      separator: 'solstice-time-separator',
      dropdownWrapper: 'solstice-time-dropdown-wrapper'
    };

    this._events = {};
    options = options || {};

    this.selectBy = options.selectBy || 'day';
    this.showYearCtrls = options.showYearCtrls || false;
    this.timeSeparator = options.separator || ':';
    this.containerEl = contEl;
    this.isPM = false;

    const aDate = options.date || new Date();

    this.setDate(aDate);

    this.render();

    this._addDefaultEvents();
  }

  setDate(date){
    if (date && Object.prototype.toString.call(date) !== '[object Date]' && date !== ''){
      date = new Date(date);
    } else if (!date){
      date = new Date();
    }

    if (isNaN(date.getTime())){
      date = new Date();
    }

    this.selectedDate = date;
    this._updateShownDate(date);
  }

  // events
  on(eventName, callback){
    // add it to the events object
    if (!callback && typeof (callback) !== 'function'){
      throw new Error('No Callback was specified or needs to be a function');
    } else {
      if (!this._events[eventName]){
        this._events[eventName] = [];
      }
      this._events[eventName].push(callback);
    }

    return this;
  }

  off(eventName, callback){
    if (!this._events[eventName]){
      return;
    }
    let index;
    while ((index = this._events[eventName].indexOf(callback)) > -1) {
      this._events[eventName].splice(index, 1);
    }

    return this;
  }

  _emit(eventName){
    if (this._events[eventName]){
      const listeners = this._events[eventName];
      const args = Array.prototype.slice.call(arguments, 1);
      for (let i = 0; i < listeners.length; i++){
        listeners[i].apply(null, args);
      }
    }
  }

  _nextMonth(){
    if (this.shownMonth === 11){
      // next month is 0
      this.shownMonth = 0;
      this.shownYear++;
      this.shownDate.setYear(this.shownYear);
    } else {
      this.shownMonth++;
    }
    this.shownDay = 1;
    this.shownDate.setDate(this.shownDay);
    this.shownDate.setMonth(this.shownMonth);
    this._emit('solstice:monthUpdated');
  }

  _prevMonth(){
    if (this.shownMonth === 0){
      // next month is 0
      this.shownMonth = 11;
      this.shownYear--;
      this.shownDate.setYear(this.shownYear);
    } else {
      this.shownMonth--;
    }
    this.shownDay = 1;
    this.shownDate.setDate(this.shownDay);
    this.shownDate.setMonth(this.shownMonth);
    this._emit('solstice:monthUpdated');
  }

  _nextYear(){
    this.shownYear++;
    this.shownDate.setYear(this.shownYear);
    this._emit('solstice:yearUpdated');
  }

  _prevYear(){
    this.shownYear--;
    this.shownDate.setYear(this.shownYear);
    this._emit('solstice:yearUpdated');
  }

  getDate(){
    // get am/pm
    const isPM = this.containerEl.getElementsByClassName(this.selector.amPm)[0].value === 'pm';
    // get hour
    let hour = Number(this.containerEl.getElementsByClassName(this.selector.hour)[0].value);

    if (isPM && hour < 12){
      hour += 12;
    } else if (hour === 12 && !isPM){
      hour = 0;
    }

    // get minutes
    const minute = this.containerEl.getElementsByClassName(this.selector.minute)[0].value;

    // get seconds
    const second = this.containerEl.getElementsByClassName(this.selector.seconds)[0].value;

    // get timezone offset
    const tzOffset = this.containerEl.getElementsByClassName(this.selector.tzDD)[0].value;

    this.selectedDate.setHours(hour);
    this.selectedDate.setMinutes(minute);
    this.selectedDate.setSeconds(second);

    return new Date(this._formatToISO(this.selectedDate, tzOffset));
  }

  render(){
    const docFrag = document.createDocumentFragment();
    // add calendar element
    docFrag.appendChild(this._createCalendar(this.shownDate));
    // add clock element
    docFrag.appendChild(this._createClock());

    if (this.containerEl){
      this.containerEl.innerHTML = '';
      this.containerEl.appendChild(docFrag);
    }
  }

  _createCalendar(date){
    const wrapper = this._createElement('div', this.selector.calendarWrapper);
    const controls = this._createControls(date);
    const calendar = this._renderDays(date);

    wrapper.appendChild(controls);
    wrapper.appendChild(calendar);

    return wrapper;
  }

  _createControls(shownDate){
    const controls = this._createElement('div', this.selector.controls);
    const prevMonthCtrl = this._createElement('span', this.selector.prevMonth);
    const nextMonthCtrl = this._createElement('span', this.selector.nextMonth);
    const prevYearCtrl = this._createElement('span', this.selector.prevYear);
    const nextYearCtrl = this._createElement('span', this.selector.nextYear);

    if (this.showYearCtrls){
      prevYearCtrl.innerText = '<<';
      nextYearCtrl.innerText = '>>';
    }

    const selectedDate = this._buildSelectedDateElement(shownDate);

    prevMonthCtrl.innerText = '<';
    nextMonthCtrl.innerText = '>';

    if (this.showYearCtrls){
      controls.appendChild(prevYearCtrl);
    }

    controls.appendChild(prevMonthCtrl);
    controls.appendChild(selectedDate);
    controls.appendChild(nextMonthCtrl);

    if (this.showYearCtrls){
      controls.appendChild(nextYearCtrl);
    }

    return controls;
  }

  _renderDays(){
    const aDocFrag = document.createDocumentFragment();
    // 5x7 grid
    const month = [];
    // 0's mark empty cell
    const countDate = new Date(this.shownYear, this.shownMonth, 1);
    // gets day of the week
    const startWkDay = countDate.getDay();
    let i = 0;

    while (this.shownMonth === countDate.getMonth()){
      const week = [];
      if (i === 0){
        while (week.length !== startWkDay){
          week.push(0);
        }
      }
      while (week.length < 7 && this.shownMonth === countDate.getMonth()){
        let dayNum = countDate.getDate();
        week.push(dayNum);
        dayNum += 1;
        countDate.setDate(dayNum);
      }

      if (week.length < 7){
        while (week.length < 7){
          week.push(0);
        }
      }
      month.push(week);
      i++;
    }

    const monthEl = this._createElement('div', this.selector.monthWrapper);

    for (let weekInt = 0; weekInt < month.length; weekInt++){
      const week = month[weekInt];
      const aWeek = this._createElement('div', this.selector.week);
      for (let day = 0; day < week.length; day++){
        const dayNumber = week[day];
        const dayClasses = dayNumber === this.shownDay ? [this.selector.day, 'solstice-selected'] : this.selector.day;
        const aDay = this._createElement('span', dayClasses);
        if (dayNumber){
          aDay.innerText = dayNumber;
        }
        aWeek.appendChild(aDay);
      }
      monthEl.appendChild(aWeek);
    }
    aDocFrag.appendChild(monthEl);

    return aDocFrag;
  }

  _buildSelectedDateElement(date){
    const el = this._createElement('span', this.selector.selectedDate);
    let updateDate;

    if (date){
      updateDate = date;
    } else {
      updateDate = this.getDate();
    }

    const month = this._createElement('span', this.selector.monthDisplay);
    const year = this._createElement('span', this.selector.yearDisplay);

    month.innerText = ` ${this.monthWords[updateDate.getMonth()]} `;
    year.innerText = `${updateDate.getFullYear()} `;

    el.appendChild(month);
    el.appendChild(year);

    return el;
  }

  _createClock(){
    const frag = document.createDocumentFragment();

    const timewrapper = this._createElement('div', this.selector.timewrap);

    // separator
    const separator = this._createElement('span', this.selector.separator);
    separator.innerText = this.timeSeparator;

    const separatorToo = separator.cloneNode(true);
    // Hour
    const hourEl = this._createElement('input', this.selector.hour);
    hourEl.value = this.shownHour;
    // Minute
    const minEl = this._createElement('input', this.selector.minute);
    minEl.value = this.shownMinutes;
    // Seconds
    const secEl = this._createElement('input', this.selector.seconds);
    secEl.value = this.shownSeconds;
    // timezone dropdown
    const tzDD = this._createElement('select', this.selector.tzDD);

    // am/pm dropdown
    const amPmDD = this._createElement('select', this.selector.amPm);
    const amOption = this._createElement('option');
    amOption.value = 'am';
    amOption.innerText = 'AM';

    const pmOption = this._createElement('option');
    pmOption.value = 'pm';
    pmOption.innerText = 'PM';
    let selectedIndex = 0;

    if (this.isPM){
      pmOption.selected = true;
      selectedIndex = 1;
    } else {
      amOption.selected = true;
    }

    amPmDD.appendChild(amOption);
    amPmDD.appendChild(pmOption);

    amPmDD.selectedIndex = selectedIndex;

    timewrapper.appendChild(hourEl);
    timewrapper.appendChild(separatorToo);
    timewrapper.appendChild(minEl);
    timewrapper.appendChild(separator);
    timewrapper.appendChild(secEl);

    const timeDDWrapper = this._createElement('div', this.selector.dropdownWrapper);
    timeDDWrapper.appendChild(amPmDD);
    tzDD.appendChild(this._createTimeZoneOptions());
    timeDDWrapper.appendChild(tzDD);
    timewrapper.appendChild(timeDDWrapper);

    frag.appendChild(timewrapper);

    return frag;
  }

  _handlePrevMonthClick(){
    this._prevMonth();
    this.render();
  }

  _handleNextMonthClick(){
    this._nextMonth();
    this.render();
  }

  _handlePrevYearClick(event){
    this._prevYear(event);
    this.render();
  }

  _handleNextYearClick(event){
    this._nextYear(event);
    this.render();
  }

  _handleWeekClick(event){

  }

  _handleDaySelected(event){
    const target = event.target || event.toElement;
    this.selectedDate.setDate(target.innerText);
    this.selectedDate.setMonth(this.shownMonth);
    this.selectedDate.setFullYear(this.shownYear);
    this._updateShownDate(this.selectedDate);
    this.render();
  }

  _createElement(tagType, classes){
    const el = document.createElement(tagType);
    let classString = '';

    if (classes && classes.join){
      classString = classes.join(' ');
    } else if (classes) {
      classString = classes;
    }

    el.setAttribute('class', classString);

    return el;
  }

  _updateShownDate(date){
    // set shown values
    this.shownMonth = date.getMonth();
    this.shownDay = date.getDate();
    this.shownYear = date.getFullYear();

    let hours = date.getHours();
    let isPM = false;

    if (hours > 12){
      hours -= 12;
      isPM = true;
    } else if (hours === 12){
      isPM = true;
    } else if (hours === 0){
      hours = 12;
      isPM = false;
    } else {
      isPM = false;
    }

    this.shownHour = hours;
    this.isPM = isPM;

    this.shownMinutes = this._addLeadingZero(date.getMinutes());
    this.shownSeconds = this._addLeadingZero(date.getSeconds());
    this.shownDate = date;
  }

  _delegate(event){
    const target = event.target || event.toElement;
    const classList = target.classList;

    if (classList.contains(this.selector.prevMonth)){
      this._handlePrevMonthClick(event);
    }

    if (classList.contains(this.selector.nextMonth)){
      this._handleNextMonthClick(event);
    }

    if (classList.contains(this.selector.prevYear)){
      this._handlePrevYearClick(event);
    }

    if (classList.contains(this.selector.nextYear)){
      this._handleNextYearClick(event);
    }

    if (classList.contains(this.selector.week) && this.selectBy === 'week'){
      this._handleWeekClick(event);
    }

    if (classList.contains(this.selector.day) && this.selectBy === 'day'){
      this._handleDaySelected(event);
    }
  }

  _addDefaultEvents(){
    this.containerEl.onclick = this._delegate.bind(this);
  }

  _createTimeZoneOptions(){
    const timeFrag = document.createDocumentFragment();
    const timezones = this._getTimeZones();
    const arr = Object.keys(timezones);
    for (let index = 0; index < arr.length; index++){
      const op = this._createElement('option');
      op.innerText = arr[index];
      op.value = timezones[arr[index]];
      timeFrag.appendChild(op);
    }
    return timeFrag;
  }

  _getTimeZones(){
    let zone;
    if (this._isDST(this.selectedDate)){
      zone = this.timeDTZones;
    } else {
      zone = this.timeSTZones;
    }
    return zone;
  }

  _isDST(date){
    const fullYear = date.getFullYear();
    const jan = new Date(fullYear, 0, 1);
    const jul = new Date(fullYear, 6, 1);
    return date.getTimezoneOffset() < (Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset()));
  }

  _formatToISO(date, timeZoneOffset){
    const isoString = `${this.monthWords[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} ${this._addLeadingZero(date.getHours())}:${this._addLeadingZero(date.getMinutes())}:${this._addLeadingZero(date.getSeconds())} GMT ${timeZoneOffset}`;
    return isoString;
  }

  _addLeadingZero(aNumber){
    aNumber = aNumber < 10 ? '0' + aNumber : aNumber;
    return aNumber.toString();
  }
}

