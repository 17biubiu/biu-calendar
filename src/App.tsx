import React, {useReducer, useState} from 'react';
import './App.scss';
import { IWeek } from './Calendar.type';
import { getCurrentCalendar, previousMonth, nextMonth, defaultYear, defaultMonth, defaultDay } from './utils/time';
import {ReactComponent as Back} from './assets/svg/back.svg';
import {ReactComponent as Next} from './assets/svg/next.svg';

interface IDate {
  year: number; 
  month: number;
  day?: number;
}

interface IDateObject {
  value: string,
  week: number,
  day: number,
  other: boolean,
  isToday: boolean
}

const initalState:IDate = {
  year: defaultYear,
  month: defaultMonth,
  day: defaultDay
}


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
  const [{year, month, day}] = useState(initalState);
  console.log('month', month);
  const days = getCurrentCalendar(year, month, day || 1);
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

function reducer(state: IDate, action: { type: string; }) {
  switch (action.type) {
    case 'prev':
      getCurrentCalendar(state.year, state.month, 1);
      return previousMonth(state.year, state.month);
    case 'next':
      getCurrentCalendar(state.year, state.month, 1);
      return nextMonth(state.year, state.month);
    default:
      throw new Error();
  }
}

function CalendarHeader (props: any) {
  const [state, dispatch] = useReducer(reducer, initalState);
  return (
    <div className="biu-calendar__header">
      <Back onClick={(event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {event.stopPropagation(); dispatch({type: 'prev'})}}/>
      {`${state.year}年${state.month}月`}
      <Next onClick={(event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {event.stopPropagation(); dispatch({type: 'next'})}}/>
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
