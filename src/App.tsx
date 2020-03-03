import React, {useReducer, useEffect, useState} from 'react';
import './App.scss';
import { IWeek } from './Calendar.type';
import { getCurrentCalendar, previousMonth, nextMonth, defaultYear, defaultMonth, defaultDay } from './utils/time';
import {ReactComponent as Back} from './assets/svg/back.svg';
import {ReactComponent as Next} from './assets/svg/next.svg';
import { Radio} from 'antd';
// import { RadioChangeEvent } from 'antd/lib/radio/interface';

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

interface Action {
  type: string;
}
interface WithDispatch {
  dispatch: (action: Action) => void;
}

interface IhandleDateType{
  [key: string]: any
}

const initalState:IDate = {
  year: defaultYear,
  month: defaultMonth,
  day: defaultDay
}

/**
 * Render Week Component
 */
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
/**
 * Date Component
 * @param props 
 */
function DayContainer(props: IDate) {
  const {year, month, day} = props;
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
/**
 * reducer
 * @param state 
 * @param action 
 */
function handleDateReducer(state: IDate, action: Action) {
  switch (action.type) {
    case 'prev':
      getCurrentCalendar(state.year, state.month, 1);
      return Object.assign({ ...state }, previousMonth(state.year, state.month));
    case 'next':
      getCurrentCalendar(state.year, state.month, 1);
      return Object.assign({ ...state }, nextMonth(state.year, state.month));
    default:
      throw new Error();
  }
}


/**
 * calendar header switch date
 * @param props 
 */
function CalendarHeader (props: IDate & WithDispatch) {
  return (
    <div className="biu-calendar__header">
      <Back onClick={(event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {event.stopPropagation(); props.dispatch({type: 'prev'})}}/>
      {`${props.year}年${props.month}月`}
      <Next onClick={(event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {event.stopPropagation(); props.dispatch({type: 'next'})}}/>
    </div>
  )
}

function ButtonGroup (props: IhandleDateType) {
  let {dateType, handleTypeChange} = props;

  return (
    <Radio.Group value={dateType} onChange={(e) => handleTypeChange(e.target.value)}>
      <Radio.Button value="day">天</Radio.Button>
      <Radio.Button value="week">周</Radio.Button>
      <Radio.Button value="month">月</Radio.Button>
    </Radio.Group>
  )
}

function App() {
  const [state, dispatch] = useReducer(handleDateReducer, initalState);
  const [dateType, handleTypeChange] = useState('month');

  useEffect(() => {
    // Update the document title using the browser API
    document.title = `Biu-Calendar-List`;
  });
  
  return (
    <div className="App">
      <div id="biu-calendar">
        <div className="biu-calendar__header—container">
          <CalendarHeader {...state} dispatch={dispatch} />
          <ButtonGroup dateType={dateType} handleTypeChange={handleTypeChange}/>
        </div>
        <WeekContainer />
        <DayContainer {...state} />
      </div>
    </div>
  );
}

export default App;
