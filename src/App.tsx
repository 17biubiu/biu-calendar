import React from 'react';
import './App.scss';
import { IWeek } from './Calendar.type';
import { getCurrentDate, getCurrentCalendar, previousMonth, nextMonth, defaultYear, defaultMonth } from './utils/time';
import {ReactComponent as Back} from './assets/svg/back.svg';
import {ReactComponent as Next} from './assets/svg/next.svg';
function WeekContainer() {
  const weekDatas: IWeek[] = [
    { text: 'SUN', value: 0 },
    { text: 'MON', value: 1 },
    { text: 'TUE', value: 2 },
    { text: 'WED', value: 3 },
    { text: 'THU', value: 4 },
    { text: 'FRI', value: 5 },
    { text: 'SAT', value: 6 }
  ];

  const weekList = weekDatas.map((week: IWeek) => <li className="biu-calendar__week_item" key={week.value}>{week.text}</li>);

  return (
    <ul className="biu-calendar__week">
      {weekList}
    </ul>
  )
}

function DayContainer() {
  const {year, month, day} = getCurrentDate();
  const days = getCurrentCalendar(year, month, day);
  const dayList = days.map((day, index) => {
    if (day.other) {
      return (<div className="biu-calendar__day is-disabled" key={index}>{day.day}</div>);
    } else {
      return (day.isToday ? <div className="biu-calendar__day active" key={index}>{day.day}</div> : <div className="biu-calendar__day" key={index}>{day.day}</div>);
    }
  });

  return (
    <div className="biu-calendar__day_container">{dayList}</div>
  )
}

function CalendarHeader (props: any) {
  return (
    <div className="biu-calendar__header">
      <Back onClick={(event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {event.stopPropagation(); previousMonth()}}/>
      {`${defaultYear}年${defaultMonth}月`}
      <Next onClick={(event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {event.stopPropagation(); nextMonth()}}/>
    </div>
  )
}

function App() {
  return (
    <div className="App">
      <div id="biu-calendar">
        <CalendarHeader />
        <WeekContainer />
        <DayContainer />
      </div>
    </div>
  );
}

export default App;
