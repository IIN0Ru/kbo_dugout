import { lineScore } from '../data.js'

const total = (runs) => runs.reduce((a, b) => a + b, 0)
const pips = (on, max, cls) =>
  Array.from({ length: max }, (_, i) => (
    <span key={i} className={`pip ${i < on ? cls : ''}`} aria-hidden="true" />
  ))

export default function Scoreboard() {
  const { away, home, count, note } = lineScore
  const rows = [away, home]

  return (
    <div className="scoreboard" role="img" aria-label={`라인스코어 원정 ${total(away.runs)} 대 홈 ${total(home.runs)}, 9회말 끝내기`}>
      <div className="wrap scoreboard__inner">
        <div className="linescore">
          <span />
          {Array.from({ length: 9 }, (_, i) => (
            <span key={i} className="linescore__inn">{i + 1}</span>
          ))}
          <span className="linescore__r">R</span>
          {rows.map((row) => [
            <span key={`${row.label}-l`} className="linescore__team">{row.label}</span>,
            ...row.runs.map((r, i) => (
              <span key={`${row.label}-${i}`} className={`linescore__cell ${r > 0 ? 'is-run' : ''}`} style={{ '--i': i }}>
                {r}
              </span>
            )),
            <span key={`${row.label}-r`} className="linescore__r">{total(row.runs)}</span>,
          ])}
        </div>
        <div className="bso">
          <span>B {pips(count.ball, 3, 'pip--b')}</span>
          <span>S {pips(count.strike, 2, 'pip--s')}</span>
          <span>O {pips(count.out, 2, 'pip--o')}</span>
          <span className="bso__note">{note}</span>
        </div>
      </div>
    </div>
  )
}
