import { useState } from 'react';
import './App.css';

interface DaySteps {
  date: string; // YYYY-MM-DD
  steps: number;
}

// Placeholder data until the backend is wired up: last 7 days, oldest first.
function randomWeek(): DaySteps[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      date: d.toLocaleDateString('en-CA'), // YYYY-MM-DD in local time
      steps: Math.floor(2000 + Math.random() * 13000),
    };
  });
}

function weekday(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', { weekday: 'short' });
}

function App() {
  const [week] = useState(randomWeek);

  return (
    <main>
      <h1>mycoach</h1>
      <h2>Steps, last 7 days</h2>
      <table>
        <thead>
          <tr>
            <th scope="col">Day</th>
            <th scope="col">Date</th>
            <th scope="col" className="num">
              Steps
            </th>
          </tr>
        </thead>
        <tbody>
          {week.map(({ date, steps }) => (
            <tr key={date}>
              <td>{weekday(date)}</td>
              <td>{date}</td>
              <td className="num">{steps.toLocaleString('en-US')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

export default App;
