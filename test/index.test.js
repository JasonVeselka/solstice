import sinon from 'sinon/pkg/sinon';
import {expect} from 'chai';
import Solstice from '../src/solstice';

describe('Solstice', function() {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should be a function', () => {
    expect(Solstice).to.be.a('function');
  });

  it('should throw an error if an element is not supplied', () => {
    expect(Solstice).to.throw(Error);
  });

  it('should return month words correctly', () => {
    const defaultDiv = document.createDocumentFragment();
    const sols = new Solstice(defaultDiv);
    expect(sols.monthWords[0]).to.equal('January');
    expect(sols.monthWords[1]).to.equal('February');
    expect(sols.monthWords[2]).to.equal('March');
    expect(sols.monthWords[3]).to.equal('April');
    expect(sols.monthWords[4]).to.equal('May');
    expect(sols.monthWords[5]).to.equal('June');
    expect(sols.monthWords[6]).to.equal('July');
    expect(sols.monthWords[7]).to.equal('August');
    expect(sols.monthWords[8]).to.equal('September');
    expect(sols.monthWords[9]).to.equal('October');
    expect(sols.monthWords[10]).to.equal('November');
    expect(sols.monthWords[11]).to.equal('December');
  });

  describe('_formatToISO', () => {
    let defaultDiv;
    let sols;

    beforeEach(() => {
      defaultDiv = document.createDocumentFragment();
      sols = new Solstice(defaultDiv);
    });

    it('should return a string that is a valid date', () => {
      const ret = sols._formatToISO(new Date(), '-09:00');
      const retDate = new Date(ret);
      expect(ret).to.be.a('string');
      expect(retDate).to.be.a('date');
      expect(retDate.getTime()).to.be.a('number');
    });
  });

  describe('defaults', () => {
    let defaultDiv;

    beforeEach(() => {
      defaultDiv = document.createDocumentFragment();
    });

    it('should have default selectBy be day', () => {
      const sols = new Solstice(defaultDiv);
      expect(sols.selectBy).to.equal('day');
    });

    it('should allow default selectBy to be overridden', () => {
      const sols = new Solstice(defaultDiv, {selectBy: 'week'});
      expect(sols.selectBy).to.equal('week');
    });
  });

  describe('add leading zero', () => {
    let defaultDiv = document.createDocumentFragment();
    let sols;

    beforeEach(() => {
      defaultDiv = document.createDocumentFragment();
      sols = new Solstice(defaultDiv);
    });

    it('should add a leading zero if under 10', () => {
      const num = 9;
      expect(sols._addLeadingZero(num)).to.equal('09');
    });
    it('should not add a leading zero to a number over 10', () => {
      const num = 12;
      expect(sols._addLeadingZero(num)).to.equal('12');
    });
  });

  describe('on', () => {
    let defaultDiv = document.createDocumentFragment();
    let sols;

    beforeEach(() => {
      defaultDiv = document.createDocumentFragment();
      sols = new Solstice(defaultDiv);
    });

    it('should add event to event object with the callback', () => {
      sols.on('someEvent', () => {});
      expect(sols._events.someEvent[0]).to.be.a('function');
    });

    it('should add event to already made event array instead of not adding or making a new event array if the event names are the same', () => {
      sols.on('someEvent', () => {});
      expect(sols._events.someEvent.length).to.equal(1);
      sols.on('someEvent', () => {});
      expect(sols._events.someEvent.length).to.equal(2);
    });

    it('should add new event names to the object and not add it to the same array that is already there', () => {
      sols.on('someEvent', () => {});
      sols.on('anotherEvent', () => {});
      expect(sols._events.someEvent.length).to.equal(1);
      expect(sols._events.anotherEvent.length).to.equal(1);
    });

    it('should throw error if there is no callback supplied', () => {
      expect(sols.on.bind(this, 'someEvent')).to.throw(Error);
    });
  });

  describe('off', () => {
    let defaultDiv = document.createDocumentFragment();
    let sols;
    let testCBStub;
    let count = 0;

    beforeEach(() => {
      defaultDiv = document.createDocumentFragment();
      sols = new Solstice(defaultDiv);
      count = 0;
      testCBStub = () => {
        count++;
      };
    });

    it('should remove the event that is added when supplied the same callback', () => {
      sols.on('someEvent', testCBStub);
      expect(sols._events.someEvent.length).to.equal(1);
      sols.off('someEvent', testCBStub);
      expect(sols._events.someEvent.length).to.equal(0);
    });

    it('should not call the callback if it is no longer on the events object', () => {
      sols.on('someEvent', testCBStub);
      sols._emit('someEvent');
      expect(count).to.equal(1);
      sols.off('someEvent', testCBStub);
      sols._emit('someEvent');
      expect(count).to.equal(1);
    });
  });

  describe('_emit', () => {
    let defaultDiv = document.createDocumentFragment();
    let sols;
    let testCBStub;
    let count = 0;

    beforeEach(() => {
      defaultDiv = document.createDocumentFragment();
      sols = new Solstice(defaultDiv);
      count = 0;
      testCBStub = () => {
        count++;
      };
    });

    it('should emit the event if its in the events object', () => {
      sols.on('someEvent', testCBStub);
      sols._emit('someEvent');
      expect(count).to.equal(1);
    });

    it('should not emit the event if it is not in the events object', () => {
      sols._emit('someEvent');
      expect(count).to.equal(0);
    });
  });

  describe('event handlers', () => {
    let defaultDiv;
    let sols;
    let emitStore;
    let eventsFired = [];

    beforeEach(() => {
      defaultDiv = document.createDocumentFragment();
      sols = new Solstice(defaultDiv, {startDate: new Date('2015/01/05')});
      emitStore = sols._emit;
      sols._emit = eventName => {
        eventsFired.push(eventName);
      };
    });

    afterEach(() => {
      sols._emit = emitStore;
      eventsFired = [];
    });

    describe('_nextMonth', () => {
      it('should emit nextMonth event', () => {
        sols._nextMonth();
        expect(eventsFired.length).to.equal(1);
        expect(eventsFired[0]).to.equal('solstice:monthUpdated');
      });

      it('should increment the months by one', () => {
        sols.setDate(new Date('2015/01/01'));
        expect(sols.shownMonth).to.equal(0);
        sols._nextMonth();
        expect(sols.shownMonth).to.equal(1);
      });

      it('should increment the year if the months are at 11', () => {
        sols.setDate(new Date('2014/12/01'));
        sols._nextMonth();
        expect(sols.shownYear).to.equal(2015);
      });

      it('should date to 1', () => {
        sols._nextMonth();
        expect(sols.shownDay).to.equal(1);
      });
    });

    describe('_prevMonth', () => {
      it('should emit prevMonth event', () => {
        sols._prevMonth();
        expect(eventsFired.length).to.equal(1);
        expect(eventsFired[0]).to.equal('solstice:monthUpdated');
      });

      it('should decrement the months by one', () => {
        sols.setDate(new Date('2015/01/01'));
        expect(sols.shownMonth).to.equal(0);
        sols._prevMonth();
        expect(sols.shownMonth).to.equal(11);
      });

      it('should decrement the year if the months are at 1', () => {
        sols.setDate(new Date('2015/01/05'));
        sols._prevMonth();
        expect(sols.shownYear).to.equal(2014);
      });

      it('should date to 1', () => {
        sols._prevMonth();
        expect(sols.shownDay).to.equal(1);
      });
    });

    describe('_nextYear', () => {
      it('should emit next year event', () => {
        sols._nextYear();
        expect(eventsFired.length).to.equal(1);
        expect(eventsFired[0]).to.equal('solstice:yearUpdated');
      });

      it('should increment the year by one', () => {
        sols.setDate(new Date('2015/12/01'));
        sols._nextYear();
        expect(sols.shownYear).to.equal(2016);
      });
    });

    describe('_prevYear', () => {
      it('should emit prev year event', () => {
        sols._prevYear();
        expect(eventsFired.length).to.equal(1);
        expect(eventsFired[0]).to.equal('solstice:yearUpdated');
      });

      it('should decrement the year by one', () => {
        sols.setDate(new Date('2015/12/01'));
        sols._prevYear();
        expect(sols.shownYear).to.equal(2014);
      });
    });
  });

  describe('setDate', () => {
    let defaultDiv;

    beforeEach(() => {
      defaultDiv = document.createDocumentFragment();
    });

    it('should set the date to the date given', () => {
      const aTestDate = new Date('2014/12/01');
      const sols = new Solstice(defaultDiv, {date: aTestDate});
      sols.setDate(new Date('2015/10/01'));
      expect(sols.selectedDate).to.not.equal(aTestDate);
    });

    it('should set the date to the current date if given a date string and not a date object', () => {
      const aTestDate = new Date('2014/12/01');
      const anotherTestDate = new Date();
      const sols = new Solstice(defaultDiv, {date: aTestDate});
      sols.setDate('invalid date');
      expect(anotherTestDate.getDate()).to.equal(sols.selectedDate.getDate());
    });

    it('should make the date an actual date object if the object supplied is not a date object', () => {
      const aTestDate = new Date('2014/12/01');
      const anotherTestDate = new Date();
      const sols = new Solstice(defaultDiv, {date: aTestDate});
      anotherTestDate.getTime = () => {
        return null;
      };
      sols.setDate(anotherTestDate);
      expect(anotherTestDate.getTime()).to.equal(null);
      expect(anotherTestDate.getDate()).to.equal(sols.selectedDate.getDate());
    });

    it('should set to the right time', () => {
      const aTestDate = new Date('January 14, 2014 11:35:00 PST');
      const sols = new Solstice(defaultDiv);
      sols.setDate(aTestDate);
      expect(sols.selectedDate.getHours()).to.equal(aTestDate.getHours());
      expect(sols.selectedDate.getMinutes()).to.equal(aTestDate.getMinutes());
      expect(sols.selectedDate.getSeconds()).to.equal(aTestDate.getSeconds());
    });
  });

  describe('delegate event', () => {
    let defaultDiv;
    let sols;
    let fakeEvent;

    beforeEach(() => {
      defaultDiv = document.createDocumentFragment();
      sols = new Solstice(defaultDiv);
      fakeEvent = {
        target: {
          classList: {
            contains: () => {
              return true;
            }
          }
        }
      };
    });

    it('should handle Prev Month Click', () => {
      sandbox.spy(sols, '_prevMonth');
      sandbox.stub(sols, 'render');

      fakeEvent.target.classList.contains = selector => {
        return selector === sols.selector.prevMonth;
      };

      sols._delegate(fakeEvent);
      expect(sols._prevMonth.callCount).to.equal(1);
    });

    it('should handle Next Month Click', () => {
      sandbox.spy(sols, '_nextMonth');
      sandbox.stub(sols, 'render');

      fakeEvent.target.classList.contains = selector => {
        return selector === sols.selector.nextMonth;
      };

      sols._delegate(fakeEvent);
      expect(sols._nextMonth.callCount).to.equal(1);
    });

    it('should handle Prev Year Click', () => {
      sandbox.spy(sols, '_prevYear');
      sandbox.stub(sols, 'render');

      fakeEvent.target.classList.contains = selector => {
        return selector === sols.selector.prevYear;
      };

      sols._delegate(fakeEvent);
      expect(sols._prevYear.callCount).to.equal(1);
    });

    it('should handle Next Year Click', () => {
      sandbox.spy(sols, '_nextYear');
      sandbox.stub(sols, 'render');

      fakeEvent.target.classList.contains = selector => {
        return selector === sols.selector.nextYear;
      };

      sols._delegate(fakeEvent);
      expect(sols._nextYear.callCount).to.equal(1);
    });

    it('should handle Week Click with selectBy equal to week', () => {
      sandbox.spy(sols, '_handleWeekClick');
      sandbox.stub(sols, 'render');

      sols.selectBy = 'week';
      fakeEvent.target.classList.contains = selector => {
        return selector === sols.selector.week;
      };

      sols._delegate(fakeEvent);
      expect(sols._handleWeekClick.callCount).to.equal(1);
    });

    it('should handle Week Click with selectBy equal to day', () => {
      sandbox.spy(sols, '_handleWeekClick');
      sandbox.stub(sols, 'render');

      sols.selectBy = 'day';
      fakeEvent.target.classList.contains = selector => {
        return selector === sols.selector.week;
      };

      sols._delegate(fakeEvent);
      expect(sols._handleWeekClick.callCount).to.equal(0);
    });

    it('should handle Day Click with selectBy equal to day', () => {
      sandbox.spy(sols, '_handleDaySelected');
      sandbox.stub(sols, 'render');

      sols.selectBy = 'day';
      fakeEvent.target.classList.contains = selector => {
        return selector === sols.selector.day;
      };

      fakeEvent.target.innerText = '1';

      sols._delegate(fakeEvent);
      expect(sols._handleDaySelected.callCount).to.equal(1);
      expect(sols.selectedDate.getDate()).to.equal(1);
    });

    it('should handle Day Click with selectBy equal to week', () => {
      sandbox.spy(sols, '_handleDaySelected');
      sandbox.stub(sols, 'render');

      sols.selectBy = 'week';
      fakeEvent.target.classList.contains = selector => {
        return selector === sols.selector.day;
      };
      sols._delegate(fakeEvent);
      expect(sols._handleDaySelected.callCount).to.equal(0);
    });

    it('should be called in the constructor', () => {
      sandbox.spy(Solstice.prototype, '_addDefaultEvents');
      const localSols = new Solstice(defaultDiv);
      expect(localSols._addDefaultEvents.callCount).to.equal(1);
    });
  });

  describe('getDate', () => {
    let sols;
    let defaultDiv;

    beforeEach(() => {
      defaultDiv = document.getElementsByTagName('body')[0];
      sols = new Solstice(defaultDiv);
    });

    it('should return a date object', () => {
      const retDate = sols.getDate();
      expect(retDate.getTime).to.be.a('function');
    });

    it.skip('should return the right date', () => {
      const aTestDate = new Date(1995, 11, 17, 3, 24, 0);
      sols = new Solstice(defaultDiv, {date: aTestDate});
      const retDate = sols.getDate();
      if (retDate.getTimezoneOffset() !== aTestDate.getTimezoneOffset()){
        // in a different timezone
        retDate.setHours(aTestDate.getHours() - retDate.getTimezoneOffset() / 60);
      }
      expect(retDate.getDate()).to.equal(aTestDate.getDate());
      expect(retDate.getHours()).to.equal(aTestDate.getHours());
      expect(retDate.getTime()).to.equal(aTestDate.getTime());
    });

    it('should call formatToISO', () => {
      sandbox.spy(sols, '_formatToISO');
      sols.getDate();
      expect(sols._formatToISO.callCount).to.equal(1);
    });

    it.skip('should return the right hours timezone based', () => {
      const estHour = 11;
      const estMin = 35;
      const aTestDate = new Date(`January 14, 2014 ${estHour}:${estMin}:00 EST`);
      sols = new Solstice(defaultDiv, {date: aTestDate});
      const retDate = sols.getDate();
      expect(retDate.getDate()).to.equal(aTestDate.getDate());
      const anotherDate = new Date();
      let tzOffset = anotherDate.getTimezoneOffset() / 60;
      if (sols._isDST(anotherDate)){
        tzOffset++;
      }
      expect(retDate.getHours()).to.equal(tzOffset);
      expect(retDate.getMinutes()).to.equal(estMin);
    });
  });

  describe('render', () => {
    let sols;
    let defaultDiv;

    beforeEach(() => {
      defaultDiv = document.getElementsByTagName('body')[0];
      sols = new Solstice(defaultDiv);
    });

    describe('containerEl', () => {
      it('should call _createCalendar', () => {
        sandbox.spy(sols, '_createCalendar');
        sols.render();
        expect(sols._createCalendar.callCount).to.equal(1);
      });

      it('should call _createClock', () => {
        sandbox.spy(sols, '_createClock');
        sols.render();
        expect(sols._createClock.callCount).to.equal(1);
      });

      it('should attempt to append child to the containerEl if it is defined', () => {
        sols = new Solstice({innerText: '', appendChild: sandbox.stub()});
        sols.render();
        // should be called twice because inital render and us calling it above
        expect(sols.containerEl.appendChild.callCount).to.equal(2);
      });
    });

    describe('_createControls', () => {
      beforeEach(() => {
        sols._createElement = (type, selector) => {
          const retObj = {
            children: [],
            type,
            selector,
            innerText: ''
          };
          retObj.appendChild = function(child) {
            this.children.push(child);
          };
          return retObj;
        };

        sols._buildSelectedDateElement = shownDate => {
          return {
            type: 'dateElement',
            shownDate
          };
        };
      });

      it('should return controls with expected elements', () => {
        const controls = sols._createControls(sols.shownDate);
        expect(controls.type).to.equal('div');
        expect(controls.children[0].innerText).to.equal('<');
        expect(controls.children.length).to.equal(3);
        expect(controls.children[1].type).to.equal('dateElement');
        expect(controls.children[1].shownDate).to.equal(sols.shownDate);
        expect(controls.children[2].innerText).to.equal('>');
      });

      it('should return with year controls if they are turned on', () => {
        sols.showYearCtrls = true;
        const controls = sols._createControls(sols.shownDate);
        expect(controls.children[0].innerText).to.equal('<<');
        expect(controls.children[4].innerText).to.equal('>>');
        expect(controls.children.length).to.equal(5);
      });
    });

    describe('_createElement', () => {
      it('should return an element with no classes if none are sent', () => {
        const returned = sols._createElement('div');
        expect(returned.tagName).to.equal('DIV');
        expect(typeof (returned)).to.equal('object');
        expect(returned.classList.length).to.equal(0);
      });

      it('should return a single class if a single class is passed', () => {
        const classes = 'aclass';
        const returned = sols._createElement('div', classes);
        expect(returned.tagName).to.equal('DIV');
        expect(typeof (returned)).to.equal('object');
        expect(returned.classList.length).to.equal(1);
        expect(returned.classList[0]).to.equal(classes);
      });

      it('should return a space separated class string if an array of classes are sent', () => {
        const classes = ['aclass', 'bclass'];
        const returned = sols._createElement('div', classes);
        expect(returned.tagName).to.equal('DIV');
        expect(typeof (returned)).to.equal('object');
        expect(returned.classList.length).to.equal(2);
        expect(returned.classList[0]).to.equal(classes[0]);
        expect(returned.classList[1]).to.equal(classes[1]);
      });
    });

    describe('_createCalendar', () => {
      beforeEach(() => {
        sols._createElement = (type, selector) => {
          const retObj = {
            children: [],
            type,
            selector,
            innerText: ''
          };
          retObj.appendChild = function(child) {
            this.children.push(child);
          };
          return retObj;
        };

        sols._createControls = shownDate => {
          return {
            type: 'controls',
            shownDate
          };
        };

        sols._renderDays = date => {
          return {
            type: 'days',
            date
          };
        };
      });

      it('should call _createElement', () => {
        sandbox.spy(sols, '_createElement');
        sols._createCalendar(sols.shownDate);
        expect(sols._createElement.callCount).to.equal(1);
      });

      it('should call _createControls', () => {
        sandbox.spy(sols, '_createControls');
        sols._createCalendar(sols.shownDate);
        expect(sols._createControls.callCount).to.equal(1);
      });

      it('should call _renderDays', () => {
        sandbox.spy(sols, '_renderDays');
        sols._createCalendar(sols.shownDate);
        expect(sols._renderDays.callCount).to.equal(1);
      });

      it('should attempt to append controls, and the calendar to the div returned from createElement', () => {
        const returnedEl = sols._createCalendar(sols.shownDate);
        expect(returnedEl.children.length).to.equal(2);
        expect(returnedEl.children[0].type).to.equal('controls');
        expect(returnedEl.children[1].type).to.equal('days');
      });
    });

    describe('_buildSelectedDateElement', () => {
      beforeEach(() => {
        sols._createElement = (type, selector) => {
          const retObj = {
            children: [],
            type,
            selector,
            innerText: ''
          };
          retObj.appendChild = function(child) {
            this.children.push(child);
          };
          return retObj;
        };
      });

      it('should have month and year elements with correct values with given date', () => {
        const aTestDate = new Date('2014/12/01');
        const returnedEl = sols._buildSelectedDateElement(aTestDate);
        expect(returnedEl.children.length).to.equal(2);
        expect(returnedEl.children[0].innerText.toLowerCase()).to.equal(' december ');
        expect(returnedEl.children[1].innerText).to.equal('2014 ');
      });

      it.skip('should have month and year when a date is not given', () => {
        const returnedEl = sols._buildSelectedDateElement();
        expect(returnedEl.children.length).to.equal(2);
        expect(returnedEl.children[0].innerText.toLowerCase()).to.equal(` ${sols.monthWords[sols.shownMonth].toLowerCase()} `);
        expect(returnedEl.children[1].innerText).to.equal(`${sols.shownYear} `);
      });
    });

    describe('_renderDays', () => {
      const oldCreateDocFrag = document.createDocumentFragment;

      beforeEach(() => {
        document.createDocumentFragment = () => {
          const retObj = {
            children: [],
            type: 'frag',
            selector: 'body',
            innerText: ''
          };
          retObj.appendChild = function(child) {
            this.children.push(child);
          };
          return retObj;
        };
        sols._createElement = (type, selector) => {
          const retObj = {
            children: [],
            type,
            selector,
            innerText: ''
          };
          retObj.appendChild = function(child) {
            this.children.push(child);
          };
          return retObj;
        };
      });

      afterEach(() => {
        document.createDocumentFragment = oldCreateDocFrag;
      });

      it('should render all the days in the month with exact beginning and end of week', () => {
        const testDate = new Date('2015/2/1');
        // not a leap year and allows for correct day
        const dayCount = 28;

        sols.setDate(testDate);
        const frag = sols._renderDays();
        const weeks = frag.children[0].children;
        let daysArr = [];

        for (let i = 0; i < weeks.length; i++){
          const week = weeks[i];
          if (week.children.length > 0){
            daysArr = daysArr.concat(week.children);
          }
        }
        expect(daysArr.length).to.equal(dayCount);
        expect(weeks.length).to.equal(4);
      });
    });

    describe('_createTimeZoneOptions', () => {
      const oldCreateDocFrag = document.createDocumentFragment;

      beforeEach(() => {
        document.createDocumentFragment = () => {
          const retObj = {
            children: [],
            type: 'frag',
            selector: 'body',
            innerText: ''
          };
          retObj.appendChild = function(child) {
            this.children.push(child);
          };
          return retObj;
        };
        sols._createElement = (type, selector) => {
          const retObj = {
            children: [],
            type,
            selector,
            innerText: ''
          };
          retObj.appendChild = function(child) {
            this.children.push(child);
          };
          return retObj;
        };

        sandbox.stub(sols, '_getTimeZones');
      });

      afterEach(() => {
        document.createDocumentFragment = oldCreateDocFrag;
      });

      it('should render DST timezones correctly', () => {
        sols._getTimeZones.returns(sols.timeDTZones);
        const timeFrag = sols._createTimeZoneOptions();
        expect(timeFrag.children.length).to.equal(6);
        // using PST as a base for this test (is PDT in dropdown)
        expect(timeFrag.children[0].value).to.equal('-07:00');
        expect(timeFrag.children[0].type).to.equal('option');
      });

      it('should render standard timezones correctly', () => {
        sols._getTimeZones.returns(sols.timeSTZones);
        const timeFrag = sols._createTimeZoneOptions();
        expect(timeFrag.children.length).to.equal(6);
        // using PST as a base for this test
        expect(timeFrag.children[0].value).to.equal('-08:00');
        expect(timeFrag.children[0].type).to.equal('option');
      });
    });

    describe('_createClock', () => {
      const oldCreateDocFrag = document.createDocumentFragment;

      beforeEach(() => {
        document.createDocumentFragment = () => {
          const retObj = {
            children: [],
            type: 'frag',
            selector: 'body',
            innerText: ''
          };
          retObj.appendChild = function(child) {
            this.children.push(child);
          };
          return retObj;
        };

        sols._createElement = (type, selector) => {
          const retObj = {
            children: [],
            type,
            selector,
            innerText: ''
          };
          retObj.appendChild = function(child) {
            this.children.push(child);
          };

          retObj.cloneNode = function() {
            return this;
          };

          return retObj;
        };
      });

      afterEach(() => {
        document.createDocumentFragment = oldCreateDocFrag;
      });

      it('should have 3 inputs with correct numbers', () => {
        const hour = sols.shownHour;
        const minute = sols.shownMinutes;
        const second = sols.shownSeconds;
        const clock = sols._createClock();
        expect(clock).to.be.a('object');
        expect(clock.children[0].selector).to.equal(sols.selector.timewrap);

        const timewrap = clock.children[0];

        // first 5 children 2nd and 4th are separators
        const firstInput = timewrap.children[0];
        const secondInput = timewrap.children[2];
        const thirdInput = timewrap.children[4];

        expect(firstInput.value).to.equal(hour);
        expect(secondInput.value).to.equal(minute);
        expect(thirdInput.value).to.equal(second);
      });

      it('should have separators between inputs', () => {
        const clock = sols._createClock();
        const timewrap = clock.children[0];

        // first 5 children 2nd and 4th are separators
        const firstSeparator = timewrap.children[1];
        const secondSeparator = timewrap.children[3];

        expect(firstSeparator.innerText).to.equal(':');
        expect(secondSeparator.innerText).to.equal(':');
      });

      it('should have 2 drop downs', () => {
        const clock = sols._createClock();
        const timewrapper = clock.children[0];
        const ddwrapper = timewrapper.children[5];

        const ddOne = ddwrapper.children[0];
        const ddTwo = ddwrapper.children[1];

        expect(ddOne.type).to.equal('select');
        expect(ddTwo.type).to.equal('select');
      });

      it('should render PM selected if time is PM', () => {
        sols.setDate('January 25, 2015 11:45:00 PM');
        const clock = sols._createClock();
        const timewrapper = clock.children[0];
        const ddwrapper = timewrapper.children[5];

        const ddOne = ddwrapper.children[0];
        const ddTwo = ddwrapper.children[1];

        expect(ddOne.type).to.equal('select');
        expect(ddTwo.type).to.equal('select');

        // first dropdown is the amPM
        expect(ddOne.children[1].selected).to.equal(true);
      });

      it('should render AM selected if time is AM', () => {
        sols.setDate('January 25, 2015 11:45:00 AM');
        const clock = sols._createClock();
        const timewrapper = clock.children[0];
        const ddwrapper = timewrapper.children[5];

        const ddOne = ddwrapper.children[0];
        const ddTwo = ddwrapper.children[1];

        expect(ddOne.type).to.equal('select');
        expect(ddTwo.type).to.equal('select');

        // first dropdown is the amPM
        expect(ddOne.children[0].selected).to.equal(true);
      });
    });
  });

  describe('_getTimeZones', () => {
    let defaultDiv;
    let sols;

    beforeEach(() => {
      defaultDiv = document.createDocumentFragment();
      sols = new Solstice(defaultDiv);
      sandbox.stub(sols, '_isDST');
    });

    it('should return DST timezones if _isDST returns true', () => {
      sols._isDST.returns(true);
      const timezones = sols._getTimeZones();
      expect(timezones).to.eql(sols.timeDTZones);
    });

    it('should return standard timezones if _isDST returns false', () => {
      sols._isDST.returns(false);
      const timezones = sols._getTimeZones();
      expect(timezones).to.eql(sols.timeSTZones);
    });
  });
});
