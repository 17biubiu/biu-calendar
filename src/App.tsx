import React, {useReducer, useEffect, useState} from 'react';
import './App.scss';
import { IWeek } from './Calendar.type';
import { getCurrentCalendar, previousMonth, nextMonth, defaultYear, defaultMonth, defaultDay, getCurrentWeek, previousWeek, nextWeek } from './utils/time';
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
  dateType: string;
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
function WeekHeadContainer(props: Partial<IhandleDateType> & IDate) {
  const weekDatas: IWeek[] = [
    { text: 'SUN', value: 0 },
    { text: 'MON', value: 1 },
    { text: 'TUE', value: 2 },
    { text: 'WED', value: 3 },
    { text: 'THU', value: 4 },
    { text: 'FRI', value: 5 },
    { text: 'SAT', value: 6 }
  ];
  const dates = getCurrentWeek(props.year, props.month, props.day || 1);
  const isWeek = props.dateType === 'week';
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  isWeek ? weekDatas.unshift({text: '', value: -1}) : '';
  const getIndex = dates.indexOf(props.day || 1);
  const weekList = weekDatas.map((week: IWeek, index) =>
    <li className={(isWeek &&  getIndex === index - 1 )? 'biu-calendar__week_item active' : 'biu-calendar__week_item'} key={week.value}>{week.text} {week.text && isWeek && dates[index - 1]}</li>
  );

  return (
    <ul className={isWeek ? 'biu-calendar__week biu-calendar__week-header' : 'biu-calendar__week'}>
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
      // getCurrentCalendar(state.year, state.month, 1);
      return Object.assign({ ...state }, action.dateType === 'week'? previousWeek(state.year, state.month, state.day || 1) : previousMonth(state.year, state.month));
    case 'next':
      // getCurrentCalendar(state.year, state.month, 1);
      return Object.assign({ ...state }, action.dateType === 'week'? nextWeek(state.year, state.month, state.day || 1) : nextMonth(state.year, state.month));
    default:
      throw new Error();
  }
}


/**
 * calendar header switch date
 * @param props 
 */
function CalendarHeader (props: IDate & WithDispatch & Partial<IhandleDateType>) {
  return (
    <div className="biu-calendar__header">
      <Back onClick={(event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {event.stopPropagation(); props.dispatch({type: 'prev', dateType: props.dateType})}}/>
      {`${props.year}年${props.month}月${props.day}日`}
      <Next onClick={(event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {event.stopPropagation(); props.dispatch({type: 'next', dateType: props.dateType})}}/>
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
  let weekContainer = null;
  let dayContainer = null;

  useEffect(() => {
    // Update the document title using the browser API
    document.title = `Biu-Calendar-List`;
  });

  if (dateType === 'week') {
    weekContainer = <WeekContainer {...state}/>;
    dayContainer = null;
  } else {
    weekContainer = null;
    dayContainer = <DayContainer {...state} />;
  }

  return (
    <div className="App">
      <div id="biu-calendar">
        <div className="biu-calendar__header—container">
          <CalendarHeader {...state} dispatch={dispatch} dateType={dateType}/>
          <ButtonGroup dateType={dateType} handleTypeChange={handleTypeChange}/>
        </div>
        <WeekHeadContainer dateType={dateType} {...state}/>
        {weekContainer}
        {dayContainer}
      </div>
    </div>
  );
}

function WeekContainer (props: IDate) {
  const dates = getCurrentWeek(props.year, props.month, props.day || 1);
const weekList = dates.map((day: number, index: number) => <li className="biu-calendar__hour_item" key={index}>{day}</li>);
  const numbers =
  ['00:00', '00:30', '01:00', '01:30',
  '02:00', '02:30', '03:00', '03:30',
  '04:00', '04:30', '05:00', '05:30',
  '06:00', '06:30', '07:00', '07:30',
  '08:00', '08:30', '09:00', '09:30',
  '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30',
  '20:00', '20:30', '21:00', '21:30',
  '22:00', '22:30', '23:00', '23:30'];
  return (
    <ul className="biu-calendar__hour-container">
      {numbers.map((num: string, index: number) =>
        <div key={index}><span className="biu-calendar__hour_item">{index % 2 === 0 && num}</span>{weekList}</div>
      )}
    </ul>
  )
}

export default App;
