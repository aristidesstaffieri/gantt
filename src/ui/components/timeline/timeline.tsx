import * as React from 'react'
import eachDayOfInterval from 'date-fns/eachDayOfInterval'
import addDays from 'date-fns/addDays'

import useDimensions from '../../hooks/use-dimensions'

/*
  Explore virtual scrolling for timeline view
*/

// const CURRENT_YEAR = new Date().getFullYear()
const MONTHS = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december'
]

//https://www.w3resource.com/javascript-exercises/javascript-date-exercise-3.php
function getDaysInMonth(month: number, year: number) {
 return new Date(year, month, 0).getDate()
}

type CoordinatesEntry = {[index: string]: { left: number, right: number } }

interface DayProps {
  day: Date
  setDayCoordMap: (dayCoordEntry: CoordinatesEntry) => void
}

const Day: React.FunctionComponent<DayProps> = (props) => {
  const { day, setDayCoordMap } = props
  const [ref, { x, width }] = useDimensions()

  React.useEffect(() => {
    if (x && width) {
      setDayCoordMap({[`${x}-${x+width}-${day.getDate()}`]: { left: x, right: x+width } })
    }
  }, [x, width])

  return (
    <div key={`${x}-${x+width}-${day.getDate()}`} ref={ref as any} className='day'>{ day.getDate() }</div>
  )
}

interface CalendarProps {
  startDate: Date
  endDate: Date
}

interface DaysByMonth {[index: string]: Date[]}

// build list of every day between start/end and make horizontal calenday header.
const Calendar: React.FunctionComponent<CalendarProps> = (props) => {
  const [dayCoordMap, _setDayCoordMap] = React.useState({})
  function setDayCoordMap(entry: CoordinatesEntry) {
    _setDayCoordMap(oldCoords => ({...oldCoords, ...entry}))
  }

  const calendarDays = eachDayOfInterval({ start: props.startDate, end: props.endDate })

  // needs to split list into sub lists by month and display the months above the days
  // centered in the blocks of days that they correspond to.
  const daysByMonth: DaysByMonth = calendarDays.reduce((prev: DaysByMonth, curr: Date) => {
    const months = Object.keys(prev)
    const currMonth = curr.getMonth().toString()

    if (months.some(month => month === currMonth)) {
      prev[currMonth].push(curr)
    } else {
      prev[currMonth] = [curr]
    }
    return prev
  }, {})

  console.log(dayCoordMap)

  return (
    <div className='calendar'>
      <div className='months'>
        {
          Object
            .keys(daysByMonth)
            .map(month => {
              return (
                <div className='month' key={month}>
                  <div className='month-name'>{ MONTHS[month as any] }</div>
                  <div className='days'>
                    { calendarDays.map(day => <Day setDayCoordMap={setDayCoordMap} day={day} />) }
                  </div>
                </div>
              )
            })
        }
      </div>
      <div className='gantt-overlay'>
        <div style={{ left: 12, right: 1200 }} className='test-gantt-slice'></div>
      </div>
    </div>
  )
}

/*
  Timeline coordinates the calendar parameters and tracks screen coordinates of each day
  coordinates can be used to draw gantt pieces, connectors, or any other time based indicator.
*/
interface TimeLineProps {

}

export const TimeLine: React.FunctionComponent<TimeLineProps> = (_props) => {
  const startDate = new Date()
  const endDate = addDays(startDate, 30)
  return (
    <div className='timeline'>
      <Calendar startDate={startDate} endDate={endDate} />
    </div>
  )
}
